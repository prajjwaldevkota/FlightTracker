import React from "react";
import { AirportIcon, CalendarIcon } from "./Icons";

export default function MainResults({ results, form }) {
  if (!results || results.length === 0) return null;
  return (
    <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl">
      <h2 className="text-xl font-bold mb-4 text-blue-800 border-b border-blue-200 pb-2">Results</h2>
      <ul className="space-y-6">
        {results.map((flight) => {
          const firstItinerary = flight.itineraries[0];
          const firstSegment = firstItinerary.segments[0];
          const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];
          const origin = firstSegment.departure.iataCode.toLowerCase();
          const destination = lastSegment.arrival.iataCode.toLowerCase();
          const departDate = form.departure_date.replace(/-/g, "").slice(2);
          const returnDate = form.return_date ? form.return_date.replace(/-/g, "").slice(2) : "";
          const adults = form.adults;
          let skyscannerUrl = `https://www.skyscanner.com/transport/flights/${origin}/${destination}/${departDate}/`;
          if (returnDate) skyscannerUrl += `${returnDate}/`;
          skyscannerUrl += `?adults=${adults}`;
          return (
            <li
              key={flight.id}
              className="bg-white shadow-lg rounded-xl p-6 border border-blue-100 hover:shadow-2xl transition cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-extrabold text-blue-700 group-hover:text-blue-900 transition">
                  {flight.price} {flight.currency}
                </span>
                <span className="text-sm text-gray-500">
                  Airline: {flight.validatingAirlineCodes?.join(", ") || "N/A"}
                </span>
              </div>
              <div className="text-sm text-gray-700 mb-4">
                {flight.itineraries.map((it, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="font-medium text-blue-600">Itinerary {idx + 1}:</div>
                    {it.segments.map((seg, sidx) => (
                      <div key={sidx} className="ml-2 flex items-center gap-2">
                        <AirportIcon />
                        <span>{seg.departure.iataCode}</span>
                        <span className="text-gray-400">→</span>
                        <span>{seg.arrival.iataCode}</span>
                        <span className="text-gray-500">|</span>
                        <CalendarIcon />
                        <span>{seg.departure.at.slice(0, 10)} {seg.departure.at.slice(11, 16)}</span>
                        <span className="text-gray-400">→</span>
                        <span>{seg.arrival.at.slice(0, 10)} {seg.arrival.at.slice(11, 16)}</span>
                        <span className="text-gray-500">|</span>
                        <span>Flight: {seg.carrierCode}{seg.number}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <a
                href={skyscannerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
              >
                Book on Skyscanner
              </a>
              <div className="text-xs text-gray-400 mt-2">Price and availability may change. Booking will open Skyscanner with your selected route and dates.</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 