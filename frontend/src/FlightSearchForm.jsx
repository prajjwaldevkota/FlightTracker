
import { Search, Calendar, Users, MapPin, Plane } from "lucide-react"
import { useState, useRef } from "react";
import airports from "./assets/airports.json";

export default function FlightSearchForm({ form, handleChange, handleSubmit, loading, darkMode }) {
  // Autocomplete state for origin
  const [originInput, setOriginInput] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const originRef = useRef(null);

  // Autocomplete state for destination
  const [destInput, setDestInput] = useState("");
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const destRef = useRef(null);

  // Helper to filter airports
  const filterAirports = (input) => {
    if (!input) return [];
    const lower = input.toLowerCase();
    return airports.filter(a =>
      (a.city && a.city.toLowerCase().includes(lower)) ||
      (a.name && a.name.toLowerCase().includes(lower)) ||
      (a.code && a.code.toLowerCase().includes(lower)) ||
      (a.icao && a.icao.toLowerCase().includes(lower))
    ).slice(0, 10); // limit to 10 suggestions
  };

  // Handlers for origin autocomplete
  const handleOriginInput = (e) => {
    const value = e.target.value;
    setOriginInput(value);
    setShowOriginSuggestions(true);
    setOriginSuggestions(filterAirports(value));
    // Don't update form yet, only on selection
  };
  const handleOriginSelect = (airport) => {
    setOriginInput(`${airport.city ? airport.city + ' - ' : ''}${airport.name} (${airport.code})`);
    setShowOriginSuggestions(false);
    setOriginSuggestions([]);
    // Update form with IATA code
    handleChange({ target: { name: "origin", value: airport.code } });
  };

  // Handlers for destination autocomplete
  const handleDestInput = (e) => {
    const value = e.target.value;
    setDestInput(value);
    setShowDestSuggestions(true);
    setDestSuggestions(filterAirports(value));
  };
  const handleDestSelect = (airport) => {
    setDestInput(`${airport.city ? airport.city + ' - ' : ''}${airport.name} (${airport.code})`);
    setShowDestSuggestions(false);
    setDestSuggestions([]);
    handleChange({ target: { name: "destination", value: airport.code } });
  };

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-2">
          <Plane className="w-4 h-4" />
          Search Flights
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        {/* Route Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              <MapPin className="w-4 h-4 inline mr-1 text-blue-500" />
              From
            </label>
            <input
              type="text"
              name="origin_autocomplete"
              value={originInput}
              onChange={handleOriginInput}
              onFocus={() => setShowOriginSuggestions(true)}
              ref={originRef}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              placeholder="Enter city, airport, or code"
              autoComplete="off"
              required
            />
            {showOriginSuggestions && originSuggestions.length > 0 && (
              <ul className="absolute z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-xl">
                {originSuggestions.map((a, idx) => (
                  <li
                    key={a.code + idx}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40"
                    onMouseDown={() => handleOriginSelect(a)}
                  >
                    <span className="font-semibold">{a.city ? a.city + ' - ' : ''}{a.name}</span> <span className="text-blue-600 dark:text-blue-300">({a.code})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="group relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              <MapPin className="w-4 h-4 inline mr-1 text-green-500" />
              To
            </label>
            <input
              type="text"
              name="destination_autocomplete"
              value={destInput}
              onChange={handleDestInput}
              onFocus={() => setShowDestSuggestions(true)}
              ref={destRef}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              placeholder="Enter city, airport, or code"
              autoComplete="off"
              required
            />
            {showDestSuggestions && destSuggestions.length > 0 && (
              <ul className="absolute z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-xl">
                {destSuggestions.map((a, idx) => (
                  <li
                    key={a.code + idx}
                    className="px-4 py-2 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40"
                    onMouseDown={() => handleDestSelect(a)}
                  >
                    <span className="font-semibold">{a.city ? a.city + ' - ' : ''}{a.name}</span> <span className="text-green-600 dark:text-green-300">({a.code})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              <Calendar className="w-4 h-4 inline mr-1 text-purple-500" />
              Departure Date
            </label>
            <input
              type="date"
              name="departure_date"
              value={form.departure_date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              required
            />
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              <Calendar className="w-4 h-4 inline mr-1 text-purple-500" />
              Return Date (Optional)
            </label>
            <input
              type="date"
              name="return_date"
              value={form.return_date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
            />
          </div>
        </div>

        {/* Passengers and Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              <Users className="w-4 h-4 inline mr-1 text-orange-500" />
              Adults
            </label>
            <input
              type="number"
              name="adults"
              value={form.adults}
              onChange={handleChange}
              min="1"
              max="9"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              required
            />
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              <Users className="w-4 h-4 inline mr-1 text-orange-500" />
              Children
            </label>
            <input
              type="number"
              name="children"
              value={form.children}
              onChange={handleChange}
              min="0"
              max="9"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
            />
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              <Users className="w-4 h-4 inline mr-1 text-orange-500" />
              Infants
            </label>
            <input
              type="number"
              name="infants"
              value={form.infants}
              onChange={handleChange}
              min="0"
              max="9"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
            />
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              Currency
            </label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
            >
              <option value="CAD">CAD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search Flights
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
