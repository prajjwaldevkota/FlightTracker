import React from "react";
import { AirportIcon, CalendarIcon, PeopleIcon } from "./Icons";

export default function FlightSearchForm({ form, handleChange, handleSubmit, loading }) {
  return (
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
          <label className="block text-sm font-medium mb-1 flex items-center">Children</label>
          <input
            type="number"
            name="children"
            value={form.children}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center">Infants</label>
          <input
            type="number"
            name="infants"
            value={form.infants}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
            min={0}
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
  );
} 