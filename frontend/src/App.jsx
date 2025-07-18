import React, { useState } from "react";
import FlightSearchForm from "./FlightSearchForm";
import MainResults from "./MainResults";
import KiwiResults from "./KiwiResults";

const BACKEND_URL = "http://127.0.0.1:8000/search-flights";

export default function App() {
  const [form, setForm] = useState({
    origin: "YYZ",
    destination: "KTM",
    departure_date: new Date().toISOString().split('T')[0],
    return_date: "",
    adults: 1,
    children: 0,
    infants: 0,
    currency: "CAD",
    max: 10,
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [kiwiResults, setKiwiResults] = useState(null);
  const [showKiwi, setShowKiwi] = useState(false);
  const [kiwiLoading, setKiwiLoading] = useState(false);
  const [kiwiError, setKiwiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setKiwiResults(null);
    setShowKiwi(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-4 md:p-8">
      <h1 className="text-4xl font-extrabold mb-2 mt-6 text-blue-800 tracking-tight drop-shadow">Flight Price Tracker</h1>
      <p className="mb-8 text-gray-600 text-center max-w-xl">Find the best flight deals. Enter your route and dates below!</p>
      <FlightSearchForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 max-w-xl w-full text-center border border-red-200">
          {error}
        </div>
      )}
      <MainResults results={results} form={form} />
      {/* Compare Provider button, only shown if Kiwi not yet shown and main results exist */}
      {results.length > 0 && !showKiwi && (
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
          onClick={async () => {
            setKiwiLoading(true);
            setKiwiError("");
            try {
              const params = new URLSearchParams({
                source: `City:${form.origin}`,
                destination: `City:${form.destination}`,
                departure_date: form.departure_date,
                currency: form.currency,
                adults: form.adults,
                children: form.children,
                infants: form.infants,
                limit: form.max,
              });
              if (form.return_date) {
                params.append('return_date', form.return_date);
              }
              const res = await fetch(`http://localhost:8000/compare-flights-kiwi?${params}`);
              if (!res.ok) throw new Error('Kiwi API error');
              const data = await res.json();
              setKiwiResults(data);
              setShowKiwi(true);
            } catch {
              setKiwiError('Failed to fetch Kiwi flights. Please try again.');
            } finally {
              setKiwiLoading(false);
            }
          }}
          disabled={kiwiLoading}
        >
          {kiwiLoading ? 'Loading...' : 'Compare Provider'}
        </button>
      )}
      {kiwiError && <div className="text-red-600 mt-2">{kiwiError}</div>}
      {/* Kiwi results rendering, only if user triggered and results exist */}
      {showKiwi && <KiwiResults kiwiResults={kiwiResults} />}
    </div>
  );
}
