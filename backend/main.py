from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
import datetime
import os

app = FastAPI()

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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