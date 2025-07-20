import { Search, Calendar, Users, MapPin, Plane } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import airports from "./assets/airports.json";

const currencyList = [
  { code: "USD", name: "US Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "KRW", name: "South Korean Won" },
];

export default function FlightSearchForm({
  form,
  handleChange,
  handleSubmit,
  loading,
  darkMode,
}) {
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
    return airports
      .filter(
        (a) =>
          (a.city && a.city.toLowerCase().includes(lower)) ||
          (a.name && a.name.toLowerCase().includes(lower)) ||
          (a.code && a.code.toLowerCase().includes(lower)) ||
          (a.icao && a.icao.toLowerCase().includes(lower))
      )
      .slice(0, 10); // limit to 10 suggestions
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
    setOriginInput(
      `${airport.city ? airport.city + " - " : ""}${airport.name} (${
        airport.code
      })`
    );
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
    setDestInput(
      `${airport.city ? airport.city + " - " : ""}${airport.name} (${
        airport.code
      })`
    );
    setShowDestSuggestions(false);
    setDestSuggestions([]);
    handleChange({ target: { name: "destination", value: airport.code } });
  };

  // Automatically set currency using ipapi.co if not set
  useEffect(() => {
    if (!form.currency) {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          if (data.currency) {
            handleChange({
              target: { name: "currency", value: data.currency },
            });
          } else {
            handleChange({ target: { name: "currency", value: "USD" } });
          }
        })
        .catch(() => {
          handleChange({ target: { name: "currency", value: "USD" } });
        });
    }
  }, [form.currency, handleChange]);

  return (
    <div className="space-y-8 p-8 bg-white/80 dark:bg-white/10 backdrop-blur-2xl rounded-3xl border border-gray-200/50 dark:border-white/20 shadow-2xl">
      {/* Form Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-blue-600/90 dark:bg-white/15 backdrop-blur-xl text-white px-6 py-3 rounded-full text-sm font-semibold mb-4 border border-blue-500/30 dark:border-white/20 shadow-lg hover:bg-blue-700/90 dark:hover:bg-white/20 transition-all duration-300">
          <Plane className="w-5 h-5" />
          Search Flights
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
        {/* Route Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 transition-all duration-300">
              <MapPin className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-300" />
              From
            </label>
            <input
              type="text"
              name="origin_autocomplete"
              value={originInput}
              onChange={handleOriginInput}
              onFocus={() => setShowOriginSuggestions(true)}
              ref={originRef}
              className="w-full px-5 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 shadow-lg"
              placeholder="Enter city, airport, or code"
              autoComplete="off"
              required
            />
            {showOriginSuggestions && originSuggestions.length > 0 && (
              <ul className="absolute z-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl mt-2 w-full max-h-60 overflow-y-auto shadow-2xl">
                {originSuggestions.map((a, idx) => (
                  <li
                    key={a.code + idx}
                    className="px-5 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl"
                    onMouseDown={() => handleOriginSelect(a)}
                  >
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {a.city ? a.city + " - " : ""}
                      {a.name}
                    </span>
                    <span className="text-blue-600 dark:text-blue-300 font-medium">
                      ({a.code})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="group relative">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 transition-all duration-300">
              <MapPin className="w-4 h-4 inline mr-2 text-green-600 dark:text-green-300" />
              To
            </label>
            <input
              type="text"
              name="destination_autocomplete"
              value={destInput}
              onChange={handleDestInput}
              onFocus={() => setShowDestSuggestions(true)}
              ref={destRef}
              className="w-full px-5 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 shadow-lg"
              placeholder="Enter city, airport, or code"
              autoComplete="off"
              required
            />
            {showDestSuggestions && destSuggestions.length > 0 && (
              <ul className="absolute z-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl mt-2 w-full max-h-60 overflow-y-auto shadow-2xl">
                {destSuggestions.map((a, idx) => (
                  <li
                    key={a.code + idx}
                    className="px-5 py-3 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/40 transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl"
                    onMouseDown={() => handleDestSelect(a)}
                  >
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {a.city ? a.city + " - " : ""}
                      {a.name}
                    </span>
                    <span className="text-green-600 dark:text-green-300 font-medium">
                      ({a.code})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 transition-all duration-300">
              <Calendar className="w-4 h-4 inline mr-2 text-purple-600 dark:text-purple-300" />
              Departure Date
            </label>
            <input
              type="date"
              name="departure_date"
              value={form.departure_date}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 shadow-lg [color-scheme:light] dark:[color-scheme:dark]"
              required
            />
          </div>
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 transition-all duration-300">
              <Calendar className="w-4 h-4 inline mr-2 text-purple-600 dark:text-purple-300" />
              Return Date (Optional)
            </label>
            <input
              type="date"
              name="return_date"
              value={form.return_date}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 shadow-lg [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>
        </div>

        {/* Passengers and Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 transition-all duration-300">
              <Users className="w-4 h-4 inline mr-2 text-orange-600 dark:text-orange-300" />
              Adults
            </label>
            <input
              type="number"
              name="adults"
              value={form.adults}
              onChange={handleChange}
              min="1"
              max="9"
              className="w-full px-4 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 shadow-lg"
              required
            />
          </div>
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 transition-all duration-300">
              <Users className="w-4 h-4 inline mr-2 text-orange-600 dark:text-orange-300" />
              Children
            </label>
            <input
              type="number"
              name="children"
              value={form.children}
              onChange={handleChange}
              min="0"
              max="9"
              className="w-full px-4 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 shadow-lg"
            />
          </div>
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 transition-all duration-300">
              <Users className="w-4 h-4 inline mr-2 text-orange-600 dark:text-orange-300" />
              Infants
            </label>
            <input
              type="number"
              name="infants"
              value={form.infants}
              onChange={handleChange}
              min="0"
              max="9"
              className="w-full px-4 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 shadow-lg"
            />
          </div>
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 transition-all duration-300">
              Currency
            </label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 shadow-lg"
            >
              {currencyList.map((c) => (
                <option
                  key={c.code}
                  value={c.code}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 backdrop-blur-xl text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:cursor-not-allowed shadow-2xl transform hover:scale-[1.02] hover:-translate-y-1 disabled:transform-none border border-blue-500/30"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/60 border-t-white"></div>
                <span className="text-lg">Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-6 h-6" />
                <span className="text-lg">Search Flights</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
