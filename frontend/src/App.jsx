import { useEffect, useState } from "react";
import { Moon, Sun, Plane, Search } from "lucide-react";
import FlightSearchForm from "./FlightSearchForm";
import MainResults from "./MainResults";
import KiwiResults from "./KiwiResults";

const BACKEND_URL = "https://prajjwals-project.ue.r.appspot.com";

export default function App() {
  // Initialize darkMode state based on actual DOM state
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
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
      const res = await fetch(`${BACKEND_URL}/search-flights?${params}`, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
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
      const res = await fetch(`${BACKEND_URL}/compare-flights-kiwi?${params}`, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
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
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-stone-100 to-amber-50 dark:from-zinc-900 dark:via-neutral-900 dark:to-stone-900 px-4 py-8 transition-all duration-700 relative overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-300/15 dark:bg-amber-500/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 -right-20 w-80 h-80 bg-orange-300/15 dark:bg-orange-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-300/12 dark:bg-yellow-500/6 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
  
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-12">
            {/* Dark Mode Toggle - Absolute positioned on mobile, normal flex on desktop */}
            <button
              onClick={toggleDarkMode}
              className="absolute top-4 left-[-10] md:static md:float-right md:mb-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/30 dark:bg-neutral-700/40 backdrop-blur-2xl border border-white/50 dark:border-neutral-600/50 hover:bg-white/40 dark:hover:bg-neutral-600/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 z-30"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
              )}
            </button>

            {/* Main Header Content - Centered */}
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="bg-white/25 dark:bg-neutral-800/30 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl border border-white/40 dark:border-neutral-600/40">
                  <div className="flex items-center gap-4 justify-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500 rounded-xl flex items-center justify-center shadow-2xl border border-white/30">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
                        Flight Finder
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-neutral-300 text-lg max-w-2xl mx-auto font-medium px-4">
                Discover the best flight deals with our app.
              </p>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/30 dark:border-neutral-600/30 overflow-hidden mb-8">
            <div className="p-8 md:p-10">
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
                <div className="mt-6 p-6 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-2xl border border-red-200/60 dark:border-red-700/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">!</span>
                    </div>
                    <p className="text-red-700 dark:text-red-300 font-medium text-lg">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="mt-8 text-center py-16">
                  <div className="inline-flex items-center gap-4 text-gray-700 dark:text-neutral-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-amber-500 border-t-transparent"></div>
                    <span className="text-xl font-semibold">
                      Searching for flights...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Results */}
          {results.length > 0 && (
            <div className="mb-8">
              <MainResults results={results} form={form} darkMode={darkMode} />
            </div>
          )}

          {/* Compare Button */}
          {results.length > 0 && !showKiwi && (
            <div className="mb-8 text-center">
              <button
                onClick={handleKiwiCompare}
                disabled={kiwiLoading}
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500/90 to-teal-600/90 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl backdrop-blur-2xl border border-white/30 transition-all duration-300 shadow-2xl hover:shadow-3xl disabled:cursor-not-allowed transform hover:-translate-y-1 hover:scale-105 disabled:transform-none"
              >
                {kiwiLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Comparing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Compare with Kiwi.com
                  </>
                )}
              </button>
            </div>
          )}

          {/* Kiwi Error */}
          {kiwiError && (
            <div className="mb-6 p-6 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-2xl border border-red-200/60 dark:border-red-700/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-red-700 dark:text-red-300 font-medium text-lg">
                  {kiwiError}
                </p>
              </div>
            </div>
          )}

          {/* Kiwi Results */}
          {showKiwi && (
            <div className="mb-8">
              <KiwiResults kiwiResults={kiwiResults} darkMode={darkMode} />
            </div>
          )}

          {/* Footer */}
          <div className="text-center py-8 border-t border-white/30 dark:border-neutral-600/30 backdrop-blur-sm">
            <p className="text-gray-600 dark:text-neutral-400 text-lg">
              Experience flight search with more features coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
