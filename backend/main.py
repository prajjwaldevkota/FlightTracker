from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
import datetime
import os
from dotenv import load_dotenv


app = FastAPI()

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
API_KEY = os.getenv('AMADEUS_API_KEY')
API_SECRET = os.getenv('AMADEUS_API_SECRET')

# Get access token
def get_access_token():
    url = "https://test.api.amadeus.com/v1/security/oauth2/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": API_KEY,
        "client_secret": API_SECRET
    }
    response = requests.post(url, data=data)
    return response.json()['access_token']

@app.get("/")
def default_route():
    return {"message": "Hello World"}

@app.get("/search-flights")
def search_flights(
    origin: str = Query(..., min_length=3, max_length=3),
    destination: str = Query(..., min_length=3, max_length=3),
    departure_date: str = Query(...),
    return_date: str = Query(None),
    adults: int = Query(1, ge=1),
    currency: str = Query("CAD", min_length=3, max_length=3),
    max: int = Query(10, alias="max", ge=1, le=100)
):
    token = get_access_token()
    headers = {"Authorization": f"Bearer {token}"}
    url = (
        "https://test.api.amadeus.com/v2/shopping/flight-offers?"
        f"originLocationCode={origin}&destinationLocationCode={destination}&"
        f"departureDate={departure_date}&"
        + (f"returnDate={return_date}&" if return_date else "")
        + f"adults={adults}&currencyCode={currency}&max={max}"
    )
    response = requests.get(url, headers=headers)
    data = response.json()
    # Return only relevant fields for frontend
    results = []
    for flight in data.get("data", []):
        results.append({
            "price": flight["price"]["total"],
            "currency": flight["price"]["currency"],
            "itineraries": flight["itineraries"],
            "validatingAirlineCodes": flight.get("validatingAirlineCodes", []),
            "id": flight.get("id"),
        })
    if len(results) == 0:
        return {"results": "No flights found"}
    return {"results": results}

def search_kiwi_rapidapi(
    source, destination, departure_date, return_date=None, currency="usd", adults=1, children=0, infants=0, limit=10
):
    if return_date:
        url = "https://kiwi-com-cheap-flights.p.rapidapi.com/round-trip"
    else:
        url = "https://kiwi-com-cheap-flights.p.rapidapi.com/one-way"

    
    headers = {
        "x-rapidapi-host": "kiwi-com-cheap-flights.p.rapidapi.com",
        "x-rapidapi-key": os.getenv("RAPIDAPI_KEY"),
    }
    params = {
        "source": source,
        "destination": destination,
        "currency": currency,
        "adults": adults,
        "children": children,
        "infants": infants,
        "limit": limit,
        "outboundDepartmentDateStart": departure_date,
        "outboundDepartmentDateEnd": departure_date,
    }
    if return_date:
        params["inboundDepartureDateStart"] = return_date
        params["inboundDepartureDateEnd"] = return_date
    response = requests.get(url, headers=headers, params=params)
    return response.json()

@app.get("/compare-flights-kiwi")
def compare_flights_kiwi(
    source: str,
    destination: str,
    departure_date: str,  # required
    return_date: str = None,  # optional
    currency: str = "usd",
    adults: int = 1,
    children: int = 0,
    infants: int = 0,
    limit: int = 10
):
    kiwi_results = search_kiwi_rapidapi(
        source, destination, departure_date, return_date, currency, adults, children, infants, limit
    )
    return {"itineraries": kiwi_results.get('itineraries', []), "metadata": kiwi_results.get('metadata', {})} 