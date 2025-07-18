import React from "react";
import { AirportIcon, CalendarIcon } from "./Icons";

export default function KiwiResults({ kiwiResults }) {
  if (!kiwiResults || !kiwiResults.itineraries || kiwiResults.itineraries.length === 0) return null;
  return (
    <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mt-10">
      <h2 className="text-xl font-bold mb-4 text-green-800 border-b border-green-200 pb-2">Kiwi Flights</h2>
      {/* Show some metadata if available */}
      {kiwiResults.metadata && (
        <div className="mb-4 text-gray-600 text-sm">
          <div>Total Itineraries: {kiwiResults.metadata.itinerariesCount}</div>
          <div>Has More Pending: {kiwiResults.metadata.hasMorePending ? 'Yes' : 'No'}</div>
        </div>
      )}
      <ul className="space-y-6">
        {kiwiResults.itineraries.map((itinerary, idx) => {
          const bookingUrl = itinerary.bookingOptions?.edges?.[0]?.node?.bookingUrl
            ? `https://www.kiwi.com${itinerary.bookingOptions.edges[0].node.bookingUrl}`
            : null;
          function renderSegments(segments) {
            return segments.map((segObj, sidx) => {
              const seg = segObj.segment;
              return (
                <div key={sidx} className="ml-2 flex items-center gap-2">
                  <AirportIcon />
                  <span>{seg?.source?.station?.code}</span>
                  <span className="text-gray-400">→</span>
                  <span>{seg?.destination?.station?.code}</span>
                  <span className="text-gray-500">|</span>
                  <CalendarIcon />
                  <span>{seg?.source?.localTime?.slice(0, 10)} {seg?.source?.localTime?.slice(11, 16)}</span>
                  <span className="text-gray-400">→</span>
                  <span>{seg?.destination?.localTime?.slice(0, 10)} {seg?.destination?.localTime?.slice(11, 16)}</span>
                  <span className="text-gray-500">|</span>
                  <span>Flight: {seg?.carrier?.code}{seg?.code}</span>
                  {segObj.layover && (
                    <span className="text-xs text-yellow-600 ml-2">Layover: {Math.round(segObj.layover.duration / 3600)}h</span>
                  )}
                </div>
              );
            });
          }
          return (
            <li key={idx} className="bg-white shadow-lg rounded-xl p-6 border border-green-100 hover:shadow-2xl transition cursor-pointer group">
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-extrabold text-green-700 group-hover:text-green-900 transition">
                  {itinerary.price?.amount} CAD
                </span>
                <span className="text-sm text-gray-500">
                  Provider: {itinerary.provider?.name || 'Kiwi.com'}
                </span>
              </div>
              <div className="text-xs text-gray-700 mb-2">
                Seats left: {itinerary.lastAvailable && itinerary.lastAvailable.seatsLeft != null ? itinerary.lastAvailable.seatsLeft : 'Not available'}
              </div>
              {/* Self-transfer and travel hack info */}
              {itinerary.travelHack && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {itinerary.travelHack.isVirtualInterlining && (
                    <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">Self-transfer (Virtual Interlining)</span>
                  )}
                  {itinerary.travelHack.isTrueHiddenCity && (
                    <span className="inline-block bg-red-200 text-red-800 text-xs font-semibold px-2 py-1 rounded">Hidden City Ticket</span>
                  )}
                  {itinerary.travelHack.isThrowawayTicket && (
                    <span className="inline-block bg-orange-200 text-orange-800 text-xs font-semibold px-2 py-1 rounded">Throwaway Ticket</span>
                  )}
                </div>
              )}
              <div className="text-sm text-gray-700 mb-4">
                <div className="font-medium text-green-600">Flight Details:</div>
                {/* One-way: sector.sectorSegments; Round-trip: outbound/inbound.sectorSegments */}
                {itinerary.sector && itinerary.sector.sectorSegments && (
                  <div className="ml-2 mb-2">
                    <span className="font-semibold">Segments:</span>
                    {renderSegments(itinerary.sector.sectorSegments)}
                  </div>
                )}
                {itinerary.outbound && itinerary.outbound.sectorSegments && (
                  <div className="ml-2 mb-2">
                    <span className="font-semibold">Outbound:</span>
                    {renderSegments(itinerary.outbound.sectorSegments)}
                  </div>
                )}
                {itinerary.inbound && itinerary.inbound.sectorSegments && (
                  <div className="ml-2 mb-2">
                    <span className="font-semibold">Inbound:</span>
                    {renderSegments(itinerary.inbound.sectorSegments)}
                  </div>
                )}
              </div>
              {bookingUrl && (
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
                >
                  Book on Kiwi
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
} 