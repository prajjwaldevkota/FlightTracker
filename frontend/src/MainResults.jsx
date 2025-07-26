import { Plane, Clock, ExternalLink, PlaneTakeoff, PlaneLanding } from "lucide-react"
import { CalendarIcon } from "./Icons"
import { formatCurrency } from "./utils"


// Helper function to format flight duration
const formatDuration = (segment) => {
  if (segment.duration) {
    const match = segment.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    if (match) {
      const hours = Number.parseInt(match[1] || "0")
      const minutes = Number.parseInt(match[2] || "0")
      if (hours > 0) {
        return `${hours}h ${minutes}m`
      }
      return `${minutes}m`
    }
  }
  return "N/A"
}


export default function MainResults({ results, form, darkMode = false }) {
  if (!results || results.length === 0) return null
  console.log(results)

  return (
    <div className="w-full mb-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Plane className="w-4 h-4" />
          Flight Results
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Available Flights</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Found {results.length} available flight{results.length !== 1 ? "s" : ""} for your journey
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {results.map((flight) => {
          const firstItinerary = flight.itineraries[0]
          const firstSegment = firstItinerary.segments[0]
          const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1]

          // Build Skyscanner URL
          const origin = firstSegment.departure.iataCode.toLowerCase()
          const destination = lastSegment.arrival.iataCode.toLowerCase()
          const departDate = form.departure_date.replace(/-/g, "").slice(2)
          const returnDate = form.return_date ? form.return_date.replace(/-/g, "").slice(2) : ""
          const adults = form.adults

          let skyscannerUrl = `https://www.skyscanner.com/transport/flights/${origin}/${destination}/${departDate}/`
          if (returnDate) skyscannerUrl += `${returnDate}/`
          skyscannerUrl += `?adults=${adults}`

          return (
            <div
              key={flight.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 overflow-hidden group hover:-translate-y-1"
            >
              {/* Price Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(flight.price, flight.currency)}{" "}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {flight.validatingAirlineCodes?.map((code) => (
                        <span
                          key={code}
                          className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full"
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {flight.itineraries.map((itinerary , idx) => (
                  <div key={idx} className={idx > 0 ? "border-t border-gray-100 dark:border-gray-700 pt-6" : ""}>
                    {/* Journey Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          idx === 0 ? "bg-blue-100 dark:bg-blue-900/50" : "bg-green-100 dark:bg-green-900/50"
                        }`}
                      >
                        {idx === 0 ? (
                          <PlaneTakeoff className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <PlaneLanding className="w-4 h-4 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <h3
                        className={`font-semibold ${
                          idx === 0 ? "text-blue-600 dark:text-blue-400" : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        {idx === 0 ? "Outbound Flight" : "Return Flight"}
                      </h3>
                    </div>

                    {/* Route Overview */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {firstSegment.departure.iataCode}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {firstSegment.departure.at.slice(11, 16)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                          <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
                          <Plane className="w-4 h-4" />
                          <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
                        </div>

                        <div className="text-center">
                          <div className="text-xl font-bold text-green-600 dark:text-green-400">
                            {lastSegment.arrival.iataCode}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {lastSegment.arrival.at.slice(11, 16)}
                          </div>
                        </div>
                      </div>

                      <div className="text-center mt-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {itinerary.segments.length > 1
                            ? `${itinerary.segments.length - 1} stop${itinerary.segments.length > 2 ? "s" : ""}`
                            : "Direct"}
                        </span>
                      </div>
                    </div>

                    {/* Flight Segments */}
                    <div className="space-y-3">
                      {itinerary.segments.map((segment , sidx) => (
                        <div
                          key={sidx}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50/50 dark:bg-gray-700/30 hover:bg-white dark:hover:bg-gray-700/50 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 text-lg font-semibold">
                                <span className="text-blue-600 dark:text-blue-400">{segment.departure.iataCode}</span>
                                <div className="flex items-center text-gray-400 dark:text-gray-500">
                                  <div className="w-6 h-px bg-gray-300 dark:bg-gray-600"></div>
                                  <Plane className="w-4 h-4 mx-1" />
                                  <div className="w-6 h-px bg-gray-300 dark:bg-gray-600"></div>
                                </div>
                                <span className="text-green-600 dark:text-green-400">{segment.arrival.iataCode}</span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                              {segment.carrierCode} {segment.number}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <CalendarIcon />
                                <span>
                                  {new Date(segment.departure.at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {segment.departure.at.slice(11, 16)} → {segment.arrival.at.slice(11, 16)}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                              {formatDuration(segment)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Book Button */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <a
                    href={skyscannerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Book on Skyscanner
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-2">
                    Prices may vary on Skyscanner. You'll be redirected to complete your booking.
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
