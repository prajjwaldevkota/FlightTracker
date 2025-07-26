// src/components/FlightSearchForm.jsx
import { Search, Calendar, Users, Plane, ArrowRightLeft } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import AutocompleteField from "./component/AutocompleteField";

const currencyList = [
  { code: "USD", name: "US Dollar" }, { code: "CAD", name: "Canadian Dollar" },
  { code: "EUR", name: "Euro" }, { code: "GBP", name: "British Pound" },
  { code: "AUD", name: "Australian Dollar" }, { code: "JPY", name: "Japanese Yen" },
  { code: "SGD", name: "Singapore Dollar" }, { code: "HKD", name: "Hong Kong Dollar" },
  { code: "INR", name: "Indian Rupee" }, { code: "KRW", name: "South Korean Won" },
];

export default function FlightSearchForm({ form, handleChange, handleSubmit, loading }) {
  const [availableCurrencies, setAvailableCurrencies] = useState(currencyList);
  const [originInput, setOriginInput] = useState("");
  const [destInput, setDestInput] = useState("");
  const [errors, setErrors] = useState({});

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // Currency fetching logic
  useEffect(() => {
    if (!form.currency) {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          if (data.currency) {
            setAvailableCurrencies((prev) => {
              const exists = prev.some(c => c.code === data.currency);
              return exists ? prev : [...prev, { code: data.currency, name: data.currency_name }];
            });
            handleChange({ target: { name: "currency", value: data.currency } });
          } else {
            handleChange({ target: { name: "currency", value: "USD" } });
          }
        })
        .catch(() => handleChange({ target: { name: "currency", value: "USD" } }));
    }
  }, [form.currency, handleChange]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const today = getTodayDate();
    if (!form.origin) newErrors.origin = "Please select an origin airport.";
    if (!form.destination) newErrors.destination = "Please select a destination airport.";
    if (form.departure_date < today) newErrors.departure_date = "Departure date cannot be in the past.";
    if (form.return_date && form.return_date < form.departure_date) newErrors.return_date = "Return date must be after departure.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // Specific handler for date changes to add extra logic
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    handleChange(e); // Call the parent handler first
    
    // Clear related errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Auto-clear return date if it's before the new departure date
    if (name === 'departure_date' && form.return_date && value > form.return_date) {
      handleChange({ target: { name: "return_date", value: "" } });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(e);
    }
  };

  const handleSwap = () => {
    handleChange({ target: { name: "origin", value: form.destination } });
    handleChange({ target: { name: "destination", value: form.origin } });
    setOriginInput(destInput);
    setDestInput(originInput);
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-8 bg-white/80 dark:bg-white/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-gray-200/50 dark:border-white/20 shadow-2xl">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 sm:gap-3 bg-blue-600/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold mb-4 shadow-lg">
          <Plane className="w-4 h-4 sm:w-5 sm:h-5" /> Search Flights
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6 sm:space-y-8" autoComplete="off">
        {/* Route Selection with Swap Button */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <AutocompleteField
            label="From"
            iconColor="text-blue-600 dark:text-blue-300"
            formField="origin"
            input={originInput}
            setInput={setOriginInput}
            handleChange={handleChange}
            error={errors.origin}
            clearError={() => setErrors(p => ({ ...p, origin: undefined }))}
          />
          <div className="flex justify-center md:pt-8">
            <button
              type="button"
              onClick={handleSwap}
              className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              aria-label="Swap origin and destination"
            >
              <ArrowRightLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <AutocompleteField
            label="To"
            iconColor="text-green-600 dark:text-green-300"
            formField="destination"
            input={destInput}
            setInput={setDestInput}
            handleChange={handleChange}
            error={errors.destination}
            clearError={() => setErrors(p => ({ ...p, destination: undefined }))}
          />
        </div>
        

        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 lg:gap-6">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 transition-all duration-300">
              <Calendar className="w-4 h-4 inline mr-2 text-purple-600 dark:text-purple-300" />
              Departure Date
            </label>
            <input
              type="date"
              name="departure_date"
              value={form.departure_date}
              onChange={handleDateChange}
              min={getTodayDate()}
              className={`w-full px-3 py-3 sm:px-5 sm:py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border ${
                errors.departure_date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-lg sm:rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 shadow-lg [color-scheme:light] dark:[color-scheme:dark] text-sm sm:text-base`}
              aria-describedby={errors.departure_date ? "departure-error" : undefined}
              required
            />
            {errors.departure_date && (
              <div id="departure-error" className="text-red-500 text-xs mt-1 break-words">{errors.departure_date}</div>
            )}
          </div>
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 transition-all duration-300">
              <Calendar className="w-4 h-4 inline mr-2 text-purple-600 dark:text-purple-300" />
              Return Date (Optional)
            </label>
            <input
              type="date"
              name="return_date"
              value={form.return_date}
              onChange={handleDateChange}
              min={form.departure_date || getTodayDate()}
              className={`w-full px-3 py-3 sm:px-5 sm:py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border ${
                errors.return_date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-lg sm:rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 shadow-lg [color-scheme:light] dark:[color-scheme:dark] text-sm sm:text-base`}
              aria-describedby={errors.return_date ? "return-error" : undefined}
            />
            {errors.return_date && (
              <div id="return-error" className="text-red-500 text-xs mt-1 break-words">{errors.return_date}</div>
            )}
          </div>
        </div>

        {/* Passengers and Currency */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2 text-orange-600 dark:text-orange-300" />
              Adults
            </label>
            <input
              type="number" name="adults" value={form.adults} onChange={handleChange}
              min="1" max="9" required
              className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 shadow-lg text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2 text-orange-600 dark:text-orange-300" />
              Children
            </label>
            <input
              type="number" name="children" value={form.children} onChange={handleChange}
              min="0" max="9"
              className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 shadow-lg text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2 text-orange-600 dark:text-orange-300" />
              Infants
            </label>
            <input
              type="number" name="infants" value={form.infants} onChange={handleChange}
              min="0" max="9"
              className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 shadow-lg text-sm sm:text-base"
            />
          </div>
          <div className="group col-span-2 lg:col-span-1">
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Currency
            </label>
            <select
              name="currency" value={form.currency || "USD"} onChange={handleChange}
              className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 shadow-lg text-sm sm:text-base"
            >
              {availableCurrencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
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
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:cursor-not-allowed shadow-2xl transform hover:scale-[1.02]"
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