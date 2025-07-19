import asyncio
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager

import aiohttp
import httpx
from fastapi import FastAPI, Query, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
from cachetools import TTLCache
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
class Config:
    API_KEY = os.getenv('AMADEUS_API_KEY')
    API_SECRET = os.getenv('AMADEUS_API_SECRET')
    RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY')
    
    # Validate required environment variables
    @classmethod
    def validate(cls):
        missing = []
        if not cls.API_KEY:
            missing.append('AMADEUS_API_KEY')
        if not cls.API_SECRET:
            missing.append('AMADEUS_API_SECRET')
        if not cls.RAPIDAPI_KEY:
            missing.append('RAPIDAPI_KEY')
        
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

# Cache for access tokens and flight data
access_token_cache = TTLCache(maxsize=1, ttl=1800)  # 30 minutes
flight_cache = TTLCache(maxsize=1000, ttl=300)  # 5 minutes

# Pydantic models for request validation
class FlightSearchRequest(BaseModel):
    origin: str = Field(..., min_length=3, max_length=3, pattern=r'^[A-Z]{3}$')
    destination: str = Field(..., min_length=3, max_length=3, patern=r'^[A-Z]{3}$')
    departure_date: str = Field(..., patern=r'^\d{4}-\d{2}-\d{2}$')
    return_date: Optional[str] = Field(None, patern=r'^\d{4}-\d{2}-\d{2}$')
    adults: int = Field(1, ge=1, le=9)
    currency: str = Field("CAD", min_length=3, max_length=3)
    max_results: int = Field(10, ge=1, le=100, alias="max")
    
    @validator('departure_date', 'return_date')
    def validate_dates(cls, v):
        if v:
            try:
                date_obj = datetime.strptime(v, '%Y-%m-%d')
                if date_obj.date() < datetime.now().date():
                    raise ValueError('Date cannot be in the past')
            except ValueError as e:
                raise ValueError(f'Invalid date format: {e}')
        return v

class KiwiSearchRequest(BaseModel):
    source: str = Field(..., min_length=3, max_length=3)
    destination: str = Field(..., min_length=3, max_length=3)
    departure_date: str = Field(..., patern=r'^\d{4}-\d{2}-\d{2}$')
    return_date: Optional[str] = Field(None, patern=r'^\d{4}-\d{2}-\d{2}$')
    currency: str = Field("CAD", min_length=3, max_length=3)
    adults: int = Field(1, ge=1, le=9)
    children: int = Field(0, ge=0, le=9)
    infants: int = Field(0, ge=0, le=9)
    limit: int = Field(10, ge=1, le=100)

# Response models
class FlightOffer(BaseModel):
    id: Optional[str]
    price: str
    currency: str
    itineraries: List[Dict[str, Any]]
    validating_airline_codes: List[str]

class FlightSearchResponse(BaseModel):
    results: List[FlightOffer]
    total_results: int
    search_time_ms: int

# HTTP client setup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Config.validate()
    app.state.http_client = httpx.AsyncClient(
        timeout=httpx.Timeout(30.0),
        limits=httpx.Limits(max_connections=100, max_keepalive_connections=20)
    )
    logger.info("Application startup complete")
    yield
    # Shutdown
    await app.state.http_client.aclose()
    logger.info("Application shutdown complete")

app = FastAPI(
    title="Flight Search API",
    description="Compare flight prices from multiple providers",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware with more restrictive settings for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Dependency to get HTTP client
async def get_http_client() -> httpx.AsyncClient:
    return app.state.http_client

@app.get("/", tags=["health"])
async def health_check():
    return {"message": "Flight Search API is running", "status": "healthy"}

# ----------------------------- #
# Amadeus Flight Search Endpoint
# ----------------------------- #

async def get_access_token(client: httpx.AsyncClient) -> str:
    """Get Amadeus access token with caching"""
    if "access_token" in access_token_cache:
        return access_token_cache["access_token"]
    
    try:
        url = "https://test.api.amadeus.com/v1/security/oauth2/token"
        data = {
            "grant_type": "client_credentials",
            "client_id": Config.API_KEY,
            "client_secret": Config.API_SECRET
        }
        response = await client.post(url, data=data)
        response.raise_for_status()
        
        token_data = response.json()
        access_token = token_data['access_token']
        access_token_cache["access_token"] = access_token
        
        logger.info("Successfully obtained new Amadeus access token")
        return access_token
        
    except httpx.HTTPError as e:
        logger.error(f"Failed to get Amadeus access token: {e}")
        raise HTTPException(status_code=500, detail="Failed to authenticate with Amadeus API")

@app.get("/search-flights", response_model=FlightSearchResponse, tags=["flights"])
async def search_flights(
    origin: str = Query(..., min_length=3, max_length=3),
    destination: str = Query(..., min_length=3, max_length=3),
    departure_date: str = Query(...),
    return_date: Optional[str] = Query(None),
    adults: int = Query(1, ge=1),
    currency: str = Query("CAD", min_length=3, max_length=3),
    max_results: int = Query(10, alias="max", ge=1, le=100),
    client: httpx.AsyncClient = Depends(get_http_client)
):
    """Search flights using Amadeus API"""
    start_time = datetime.now()
    
    # Create cache key
    cache_key = f"{origin}_{destination}_{departure_date}_{return_date}_{adults}_{currency}_{max_results}"
    
    if cache_key in flight_cache:
        logger.info(f"Returning cached results for {cache_key}")
        return flight_cache[cache_key]
    
    try:
        token = await get_access_token(client)
        headers = {"Authorization": f"Bearer {token}"}
        
        # Build URL with parameters
        url = "https://test.api.amadeus.com/v2/shopping/flight-offers"
        params = {
            "originLocationCode": origin,
            "destinationLocationCode": destination,
            "departureDate": departure_date,
            "adults": adults,
            "currencyCode": currency,
            "max": max_results
        }
        
        if return_date:
            params["returnDate"] = return_date
        
        response = await client.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        results = []
        
        for flight in data.get("data", []):
            results.append(FlightOffer(
                id=flight.get("id"),
                price=flight["price"]["total"],
                currency=flight["price"]["currency"],
                itineraries=flight["itineraries"],
                validating_airline_codes=flight.get("validatingAirlineCodes", [])
            ))
        
        end_time = datetime.now()
        search_time_ms = int((end_time - start_time).total_seconds() * 1000)
        
        response_data = FlightSearchResponse(
            results=results,
            total_results=len(results),
            search_time_ms=search_time_ms
        )
        
        # Cache the response
        flight_cache[cache_key] = response_data
        
        logger.info(f"Found {len(results)} flights for {origin}->{destination}")
        return response_data
        
    except httpx.HTTPError as e:
        logger.error(f"Amadeus API error: {e}")
        raise HTTPException(status_code=500, detail="Failed to search flights")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ----------------------------- #
# Kiwi (RapidAPI) Flight Search
# ----------------------------- #

async def search_kiwi_rapidapi(
    client: httpx.AsyncClient,
    source: str,
    destination: str,
    departure_date: str,
    return_date: Optional[str] = None,
    currency: str = "CAD",
    adults: int = 1,
    children: int = 0,
    infants: int = 0,
    limit: int = 10
) -> Dict[str, Any]:
    """Search flights using Kiwi API via RapidAPI"""
    
    url = (
        "https://kiwi-com-cheap-flights.p.rapidapi.com/round-trip"
        if return_date
        else "https://kiwi-com-cheap-flights.p.rapidapi.com/one-way"
    )

    headers = {
        "x-rapidapi-host": "kiwi-com-cheap-flights.p.rapidapi.com",
        "x-rapidapi-key": Config.RAPIDAPI_KEY,
    }

    params = {
        "source": source,
        "destination": destination,
        "currency": currency,
        "adults": adults,
        "children": children,
        "infants": infants,
        "limit": limit,
        "outboundDepartureDateStart": departure_date,
    }

    if return_date:
        params["inboundDepartureDateStart"] = return_date
    
    try:
        response = await client.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        logger.error(f"Kiwi API error: {e}")
        raise HTTPException(status_code=500, detail="Failed to search Kiwi flights")

@app.get("/compare-flights-kiwi", tags=["flights"])
async def compare_flights_kiwi(
    source: str,
    destination: str,
    departure_date: str,
    return_date: Optional[str] = None,
    currency: str = "CAD",
    adults: int = 1,
    children: int = 0,
    infants: int = 0,
    limit: int = 10,
    client: httpx.AsyncClient = Depends(get_http_client)
):
    """Search flights using Kiwi API"""
    
    cache_key = f"kiwi_{source}_{destination}_{departure_date}_{return_date}_{currency}_{adults}_{children}_{infants}_{limit}"
    
    if cache_key in flight_cache:
        logger.info(f"Returning cached Kiwi results for {cache_key}")
        return flight_cache[cache_key]
    
    try:
        kiwi_results = await search_kiwi_rapidapi(
            client, source, destination, departure_date, return_date, 
            currency, adults, children, infants, limit
        )

        response_data = {
            "itineraries": kiwi_results.get("itineraries", []),
            "metadata": kiwi_results.get("metadata", {}),
            "source": "kiwi"
        }
        
        # Cache the response
        flight_cache[cache_key] = response_data
        
        logger.info(f"Found Kiwi flights for {source}->{destination}")
        return JSONResponse(content=jsonable_encoder(response_data))
        
    except Exception as e:
        logger.error(f"Error in Kiwi search: {e}")
        raise HTTPException(status_code=500, detail="Failed to search Kiwi flights")

# ----------------------------- #
# Combined Search Endpoint
# ----------------------------- #

# @app.get("/compare-all-flights", tags=["flights"])
# async def compare_all_flights(
#     origin: str = Query(..., min_length=3, max_length=3),
#     destination: str = Query(..., min_length=3, max_length=3),
#     departure_date: str = Query(...),
#     return_date: Optional[str] = Query(None),
#     adults: int = Query(1, ge=1),
#     currency: str = Query("CAD", min_length=3, max_length=3),
#     max_results: int = Query(10, alias="max", ge=1, le=100),
#     client: httpx.AsyncClient = Depends(get_http_client)
# ):
#     """Search and compare flights from both Amadeus and Kiwi APIs"""
    
#     start_time = datetime.now()
    
#     # Run both searches concurrently
#     amadeus_task = search_flights(
#         origin, destination, departure_date, return_date, 
#         adults, currency, max_results, client
#     )
    
#     kiwi_task = search_kiwi_rapidapi(
#         client, origin, destination, departure_date, return_date,
#         currency, adults, 0, 0, max_results
#     )
    
#     try:
#         amadeus_results, kiwi_results = await asyncio.gather(
#             amadeus_task, kiwi_task, return_exceptions=True
#         )
        
#         response_data = {
#             "amadeus": amadeus_results if not isinstance(amadeus_results, Exception) else {"error": str(amadeus_results)},
#             "kiwi": kiwi_results if not isinstance(kiwi_results, Exception) else {"error": str(kiwi_results)},
#             "search_time_ms": int((datetime.now() - start_time).total_seconds() * 1000)
#         }
        
#         return JSONResponse(content=jsonable_encoder(response_data))
        
#     except Exception as e:
#         logger.error(f"Error in combined search: {e}")
#         raise HTTPException(status_code=500, detail="Failed to search flights from providers")

# Add middleware for request logging
@app.middleware("http")
async def log_requests(request, call_next):
    start_time = datetime.now()
    response = await call_next(request)
    process_time = datetime.now() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time.total_seconds():.3f}s"
    )
    return response