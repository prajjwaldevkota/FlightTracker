import { Plane, PlaneTakeoff, PlaneLanding, Clock, AlertTriangle, ExternalLink } from "lucide-react"
import { CalendarIcon } from "./Icons"
import { formatCurrency } from "./utils"

const TravelHackChips = {
  virtualInterlining: {
    icon: "⚠️",
    label: "Self-Transfer",
    color:
      "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    description: "You need to collect and recheck your baggage",
  },
  hiddenCity: {
    icon: "🎯",
    label: "Hidden City",
    color: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",
    description: "Ticket manipulation - use with caution",
  },
  throwaway: {
    icon: "🎫",
    label: "Throwaway",
    color:
      "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    description: "Not using all segments of the ticket",
  },
}


export default function KiwiResults({ kiwiResults, darkMode = false }) {
  if (!kiwiResults || !kiwiResults.itineraries || kiwiResults.itineraries.length === 0) return null

  const renderSegments = (segments) => {
    return segments.map((segObj, sidx) => {
      const seg = segObj.segment
      return (
        <div
          key={sidx}
          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50/50 dark:bg-gray-700/30 hover:bg-white dark:hover:bg-gray-700/50 transition-colors duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <span className="text-blue-600 dark:text-blue-400">{seg?.source?.station?.code}</span>
                <div className="flex items-center text-gray-400 dark:text-gray-500">
                  <div className="w-6 h-px bg-gray-300 dark:bg-gray-600"></div>
                  <Plane className="w-4 h-4 mx-1" />
                  <div className="w-6 h-px bg-gray-300 dark:bg-gray-600"></div>
                </div>
                <span className="text-green-600 dark:text-green-400">{seg?.destination?.station?.code}</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {seg?.carrier?.code} {seg?.code}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <CalendarIcon />
                <span>
                  {seg?.source?.localTime
                    ? new Date(seg.source.localTime).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {seg?.source?.localTime?.slice(11, 16)} → {seg?.destination?.localTime?.slice(11, 16)}
                </span>
              </div>
            </div>
            {segObj.layover && (
              <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full">
                {Math.round(segObj.layover.duration / 3600)}h layover
              </span>
            )}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="w-full mb-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Plane className="w-4 h-4" />
          Alternative Options
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Compare with Kiwi.com</h2>
        {kiwiResults.metadata && (
          <p className="text-gray-600 dark:text-gray-300">
            Found {kiwiResults.metadata.itinerariesCount} alternative flight
            {kiwiResults.metadata.itinerariesCount !== 1 ? "s" : ""}
            {kiwiResults.metadata.hasMorePending && " (loading more...)"}
          </p>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {kiwiResults.itineraries.map((itinerary, idx) => {
          const bookingUrl = itinerary.bookingOptions?.edges?.[0]?.node?.bookingUrl
            ? `https://www.kiwi.com${itinerary.bookingOptions.edges[0].node.bookingUrl}`
            : null

          return (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 overflow-hidden group hover:-translate-y-1"
            >
              {/* Price Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {itinerary.price?.amount}{" "}
                      <span className="text-lg font-normal text-gray-600 dark:text-gray-400">CAD</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      via {itinerary.provider?.name || "Kiwi.com"}
                    </div>
                  </div>
                  {itinerary.lastAvailable && itinerary.lastAvailable.seatsLeft != null && (
                    <div className="text-right">
                      <div className="text-xs bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">
                        {itinerary.lastAvailable.seatsLeft} seats left
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Travel Hack Warnings */}
                {itinerary.travelHack.isVirtualInterlining && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="font-medium text-amber-800 dark:text-amber-300 text-sm">Special Conditions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {itinerary.travelHack && (
                        <div className="group relative">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border cursor-help ${TravelHackChips.virtualInterlining.color}`}
                          >
                            <span>{TravelHackChips.virtualInterlining.icon}</span>
                            {TravelHackChips.virtualInterlining.label}
                          </span>
                          <div className="absolute bottom-full left-30 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                            {TravelHackChips.virtualInterlining.description}
                          </div>
                        </div>
                      )}
                      {itinerary.travelHack.isTrueHiddenCity && (
                        <div className="group relative">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border cursor-help ${TravelHackChips.hiddenCity.color}`}
                          >
                            <span>{TravelHackChips.hiddenCity.icon}</span>
                            {TravelHackChips.hiddenCity.label}
                          </span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                            {TravelHackChips.hiddenCity.description}
                          </div>
                        </div>
                      )}
                      {itinerary.travelHack.isThrowawayTicket && (
                        <div className="group relative">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border cursor-help ${TravelHackChips.throwaway.color}`}
                          >
                            <span>{TravelHackChips.throwaway.icon}</span>
                            {TravelHackChips.throwaway.label}
                          </span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                            {TravelHackChips.throwaway.description}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Flight Segments */}
                {itinerary.sector && itinerary.sector.sectorSegments && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <PlaneTakeoff className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">Flight Details</h3>
                    </div>
                    <div className="space-y-3">{renderSegments(itinerary.sector.sectorSegments)}</div>
                  </div>
                )}

                {itinerary.outbound && itinerary.outbound.sectorSegments && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <PlaneTakeoff className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">Outbound</h3>
                    </div>
                    <div className="space-y-3">{renderSegments(itinerary.outbound.sectorSegments)}</div>
                  </div>
                )}

                {itinerary.inbound && itinerary.inbound.sectorSegments && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <PlaneLanding className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">Return</h3>
                    </div>
                    <div className="space-y-3">{renderSegments(itinerary.inbound.sectorSegments)}</div>
                  </div>
                )}

                {/* Book Button */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  {bookingUrl ? (
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      Book on Kiwi.com
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
                    >
                      Booking Unavailable
                    </button>
                  )}
                  <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-2">
                    Alternative booking through Kiwi.com
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
