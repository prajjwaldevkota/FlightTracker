import { useEffect, useState } from "react";
import { Moon, Sun, Plane, Search } from "lucide-react";
import FlightSearchForm from "./FlightSearchForm";
import MainResults from "./MainResults";
import KiwiResults from "./KiwiResults";

const BACKEND_URL = "https://prajjwals-project.ue.r.appspot.com";

export default function App() {
  // Initialize darkMode state based on actual DOM state
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  
  const [form, setForm] = useState({
    origin: "YYZ",
    destination: "KTM",
    departure_date: new Date().toISOString().split("T")[0],
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

  useEffect(() => {
    console.log('React darkMode state:', darkMode);
    console.log('DOM has dark class:', document.documentElement.classList.contains('dark'));
    
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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
      const res = await fetch(`${BACKEND_URL}/search-flights?${params}`);
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

  const handleKiwiCompare = async () => {
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
        params.append("return_date", form.return_date);
      }
      const res = await fetch(
        `${BACKEND_URL}/compare-flights-kiwi?${params}`
      );
      if (!res.ok) throw new Error("Kiwi API error");
      const data = await res.json();
      setKiwiResults(data);
      setShowKiwi(true);
    } catch {
      setKiwiError("Failed to fetch Kiwi flights. Please try again.");
    } finally {
      setKiwiLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Force sync the DOM (as backup)
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen transition-all duration-500">
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8 transition-all duration-500">
        <div className="max-w-6xl mx-auto">
          {/* Header with Dark Mode Toggle */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Flight Finder
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mt-1.5">
                Discover the best flight deals across multiple providers
              </p>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="p-6 md:p-8">
              {/* Search Form */}
              <FlightSearchForm
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                loading={loading}
                darkMode={darkMode}
              />

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-in slide-in-from-top duration-300">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <p className="text-red-700 dark:text-red-300 font-medium">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="mt-8 text-center py-12">
                  <div className="inline-flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-lg font-medium">
                      Searching for flights...
                    </span>
                  </div>
                  <div className="mt-4 w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Results */}
          {results.length > 0 && (
            <div className="mt-8 animate-in slide-in-from-bottom duration-500">
              <MainResults results={results} form={form} darkMode={darkMode} />
            </div>
          )}

          {/* Compare Button */}
          {results.length > 0 && !showKiwi && (
            <div className="mt-8 text-center animate-in slide-in-from-bottom duration-700">
              <button
                onClick={handleKiwiCompare}
                disabled={kiwiLoading}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
              >
                {kiwiLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Comparing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Compare with Kiwi.com
                  </>
                )}
              </button>
            </div>
          )}

          {/* Kiwi Error */}
          {kiwiError && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-in slide-in-from-top duration-300">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-red-700 dark:text-red-300 font-medium">
                  {kiwiError}
                </p>
              </div>
            </div>
          )}

          {/* Kiwi Results */}
          {showKiwi && (
            <div className="mt-8 animate-in slide-in-from-bottom duration-500">
              <KiwiResults kiwiResults={kiwiResults} darkMode={darkMode} />
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center py-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              Compare flights across multiple providers to find the best deals.
              More features coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}