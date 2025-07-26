// src/hooks/useAutocomplete.js
import { useState, useRef, useEffect, useCallback } from "react";
import airports from "../assets/airports.json";

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const filterAirports = (input) => {
  if (!input || input.length < 2) return [];
  const lower = input.toLowerCase();
  return airports
    .filter(
      (a) =>
        (a.city && a.city.toLowerCase().includes(lower)) ||
        (a.name && a.name.toLowerCase().includes(lower)) ||
        (a.code && a.code.toLowerCase().includes(lower)) ||
        (a.icao && a.icao.toLowerCase().includes(lower))
    )
    .slice(0, 10);
};

export const useAutocomplete = ({ input, setInput, formField, handleChange, clearError }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setLoading(true);
      const results = filterAirports(value);
      setSuggestions(results);
      setLoading(false);
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
    handleChange({ target: { name: formField, value: "" } });
    clearError();
    if (value.length >= 2) {
      debouncedSearch(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (airport) => {
    setInput(`${airport.city ? airport.city + " - " : ""}${airport.name} (${airport.code})`);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    handleChange({ target: { name: formField, value: airport.code } });
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    setShowSuggestions(true);
    if (input.length >= 2) {
      debouncedSearch(input);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        inputRef.current && !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    suggestions, showSuggestions, selectedIndex, loading,
    inputRef, dropdownRef,
    handleInputChange, handleKeyDown, handleSelect, handleFocus,
    setSelectedIndex
  };
};