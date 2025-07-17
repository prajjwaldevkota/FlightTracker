import React, { useState } from "react";

const BACKEND_URL = "http://127.0.0.1:8000/search-flights";

// Simple SVG icons
const AirportIcon = () => (
  <svg className="inline w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.5 19.5l19-7-19-7v4l15 3-15 3v4z" /></svg>
);
const CalendarIcon = () => (
  <svg className="inline w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
);
const PeopleIcon = () => (
  <svg className="inline w-4 h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4" /><path d="M17 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><path d="M17 17v2m0 0h4m-4 0a4 4 0 0 1 4-4" /></svg>
);

export default function App() {
  const [form, setForm] = useState({
    origin: "YYZ",
    destination: "KTM",
    departure_date: new Date().toISOString().split('T')[0],
    return_date: "",
    adults: 1,
    currency: "CAD",
    max: 10,
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const params = new URLSearchParams({
        ...form,
        adults: String(form.adults),
        max: String(form.max),
      });
      const res = await fetch(`${BACKEND_URL}?${params}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResults(data.results || []);
      if (!data.results || data.results.length === 0) {
        setError("No flights found for this search.");
      }
    } catch {
      setError("Failed to fetch flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to format date as YYMMDD
  function formatDateYYMMDD(dateStr) {
    if (!dateStr) return "";
    // dateStr is always 'YYYY-MM-DD'
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${yyyy.slice(2)}${mm}${dd}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-4 md:p-8">
      <h1 className="text-4xl font-extrabold mb-2 mt-6 text-blue-800 tracking-tight drop-shadow">Flight Price Tracker</h1>
      <p className="mb-8 text-gray-600 text-center max-w-xl">Find the best flight deals. Enter your route and dates below!</p>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 w-full max-w-md md:max-w-2xl lg:max-w-3xl mb-10 border border-blue-100"
      >
        <h2 className="text-lg font-semibold text-blue-700 mb-4 flex items-center"><AirportIcon />Flight Search</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center"><AirportIcon />Origin (IATA)</label>
            <input
              type="text"
              name="origin"
              value={form.origin}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              maxLength={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center"><AirportIcon />Destination (IATA)</label>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              maxLength={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center"><CalendarIcon />Departure Date</label>
            <input
              type="date"
              name="departure_date"
              value={form.departure_date}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center"><CalendarIcon />Return Date</label>
            <input
              type="date"
              name="return_date"
              value={form.return_date}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center"><PeopleIcon />Adults</label>
            <input
              type="number"
              name="adults"
              value={form.adults}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              min={1}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <input
              type="text"
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              maxLength={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Results</label>
            <input
              type="number"
              name="max"
              value={form.max}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              min={1}
              max={50}
              required
            />
          </div>
        </div>
        <div className="border-t border-blue-100 my-6"></div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-lg shadow hover:from-blue-700 hover:to-blue-600 transition text-lg tracking-wide"
          disabled={loading}
        >
          {loading ? "Searching..." : "🔍 Search Flights"}
        </button>
      </form>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 max-w-xl w-full text-center border border-red-200">
          {error}
        </div>
      )}
      {results.length > 0 && (
        <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl">
          <h2 className="text-xl font-bold mb-4 text-blue-800 border-b border-blue-200 pb-2">Results</h2>
          <ul className="space-y-6">
            {results.map((flight) => {
              // Use the first segment for origin/destination, and form dates from the form state
              const firstItinerary = flight.itineraries[0];
              const firstSegment = firstItinerary.segments[0];
              const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];
              const origin = firstSegment.departure.iataCode.toLowerCase();
              const destination = lastSegment.arrival.iataCode.toLowerCase();
              const departDate = formatDateYYMMDD(form.departure_date);
              const returnDate = form.return_date ? formatDateYYMMDD(form.return_date) : "";
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
      )}
    </div>
  );
}
