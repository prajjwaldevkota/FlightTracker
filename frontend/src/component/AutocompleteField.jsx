// src/components/AutocompleteField.jsx
import { useAutocomplete } from "../hooks/useAutocomplete";
import { MapPin } from "lucide-react";

export default function AutocompleteField({
  label, iconColor, formField, input, setInput, handleChange, error, clearError
}) {
  const hookProps = { input, setInput, formField, handleChange, clearError };
  const {
    suggestions, showSuggestions, selectedIndex, loading,
    inputRef, dropdownRef,
    handleInputChange, handleKeyDown, handleSelect, handleFocus, setSelectedIndex
  } = useAutocomplete(hookProps);

  return (
    <div className="group relative">
      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
        <MapPin className={`w-4 h-4 inline mr-2 ${iconColor}`} />
        {label}
      </label>
      <input
        type="text"
        name={`${formField}_autocomplete`}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        ref={inputRef}
        className={`w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all shadow-lg text-sm sm:text-base`}
        placeholder="Enter city or airport (min 2 chars)"
        autoComplete="off"
        required
        role="combobox"
        aria-expanded={showSuggestions}
        aria-haspopup="listbox"
        aria-controls={`${formField}-suggestions`}
        aria-activedescendant={selectedIndex > -1 ? `${formField}-option-${selectedIndex}` : undefined}
      />
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      
      {showSuggestions && (suggestions.length > 0 || loading) && (
        <ul
          id={`${formField}-suggestions`}
          ref={dropdownRef}
          className="absolute z-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl mt-2 w-full max-h-60 overflow-y-auto shadow-2xl"
          role="listbox"
        >
          {loading ? (
            <li className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
              <div className="animate-pulse">Searching airports...</div>
            </li>
          ) : (
            suggestions.map((a, idx) => (
              <li
                key={a.code + idx}
                id={`${formField}-option-${idx}`}
                className={`px-4 py-2 cursor-pointer transition-all ${
                  idx === selectedIndex
                    ? 'bg-blue-100 dark:bg-blue-900/60'
                    : 'hover:bg-blue-50 dark:hover:bg-blue-900/40'
                }`}
                onMouseDown={() => handleSelect(a)}
                onMouseEnter={() => setSelectedIndex(idx)}
                role="option"
                aria-selected={idx === selectedIndex}
              >
                <span className="font-semibold text-gray-900 dark:text-gray-100">{a.city ? `${a.city} - ` : ""}{a.name}</span>
                <span className="text-blue-600 dark:text-blue-300 font-medium"> ({a.code})</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}