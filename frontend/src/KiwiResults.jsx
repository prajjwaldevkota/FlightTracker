import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Grid,
  Chip,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AirportIcon, CalendarIcon } from "./Icons";

export default function KiwiResults({ kiwiResults }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (
    !kiwiResults ||
    !kiwiResults.itineraries ||
    kiwiResults.itineraries.length === 0
  )
    return null;

  return (
    <Box
      width="100%"
      maxWidth={{ xs: "100%", sm: "100%", md: 1200, lg: 1400 }}
      sx={{
        mb: 4,
        mx: "auto", // Center the container
        px: { xs: 2, sm: 3 }, // Add padding for mobile
      }}
    >
      <Box
        mb={4}
        sx={{
          background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
          borderRadius: 3,
          p: 3,
          color: "white",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1}>
          Compare Price with Kiwi.com
        </Typography>
        {kiwiResults.metadata && (
          <Box color="rgba(255,255,255,0.9)" fontSize="small">
            <Typography variant="body2">
              Found {kiwiResults.metadata.itinerariesCount} flights
              {kiwiResults.metadata.hasMorePending && " (more loading...)"}
            </Typography>
          </Box>
        )}
      </Box>

      <Grid
        container
        spacing={3}
        sx={{
          overflowX: isMobile ? "auto" : "visible",
          pb: isMobile ? 2 : 0,
          justifyContent: 'center',
        }}
      >
        {kiwiResults.itineraries.map((itinerary, idx) => {
          const bookingUrl = itinerary.bookingOptions?.edges?.[0]?.node
            ?.bookingUrl
            ? `https://www.kiwi.com${itinerary.bookingOptions.edges[0].node.bookingUrl}`
            : null;

          function renderSegments(segments) {
            return segments.map((segObj, sidx) => {
              const seg = segObj.segment;
              return (
                <Box
                  key={sidx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 2,
                    backgroundColor: "#f8fafc",
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                    mb: 1,
                    flexWrap: "wrap",
                    "&:hover": {
                      backgroundColor: "#f1f5f9",
                      transform: "translateY(-1px)",
                      transition: "all 0.2s ease",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <AirportIcon />
                    <Tooltip title={seg?.source?.station?.code} arrow>
                      <Typography
                        component="span"
                        fontWeight={700}
                        sx={{
                          fontSize: { xs: 14, sm: 16 },
                          color: "#1e293b",
                        }}
                      >
                        {seg?.source?.station?.code}
                      </Typography>
                    </Tooltip>
                    <Typography
                      component="span"
                      color="#64748b"
                      sx={{ fontSize: { xs: 14, sm: 16 }, mx: 1 }}
                    >
                      →
                    </Typography>
                    <Tooltip title={seg?.destination?.station?.code} arrow>
                      <Typography
                        component="span"
                        fontWeight={700}
                        sx={{
                          fontSize: { xs: 14, sm: 16 },
                          color: "#1e293b",
                        }}
                      >
                        {seg?.destination?.station?.code}
                      </Typography>
                    </Tooltip>
                  </Box>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: "#cbd5e1" }}
                  />

                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarIcon />
                    <Tooltip title={seg?.source?.localTime} arrow>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: { xs: 12, sm: 14 },
                          color: "#475569",
                        }}
                      >
                        {seg?.source?.localTime?.slice(0, 10)}{" "}
                        {seg?.source?.localTime?.slice(11, 16)}
                      </Typography>
                    </Tooltip>
                    <Typography
                      component="span"
                      color="#64748b"
                      sx={{ fontSize: { xs: 12, sm: 14 }, mx: 1 }}
                    >
                      →
                    </Typography>
                    <Tooltip title={seg?.destination?.localTime} arrow>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: { xs: 12, sm: 14 },
                          color: "#475569",
                        }}
                      >
                        {seg?.destination?.localTime?.slice(0, 10)}{" "}
                        {seg?.destination?.localTime?.slice(11, 16)}
                      </Typography>
                    </Tooltip>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={`${seg?.carrier?.code}${seg?.code}`}
                      size="small"
                      sx={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                    {segObj.layover && (
                      <Chip
                        label={`${Math.round(
                          segObj.layover.duration / 3600
                        )}h layover`}
                        size="small"
                        sx={{
                          backgroundColor: "#f59e0b",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                        }}
                      />
                    )}
                  </Box>
                </Box>
              );
            });
          }

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              key={idx}
              sx={{
                minWidth: isMobile ? 320 : "unset",
                display: "flex",
              }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-2px)",
                  },
                  overflow: "hidden",
                  background: "white",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    background:
                      "linear-gradient(90deg, #059669 0%, #047857 100%)",
                    p: 2,
                    color: "white",
                  }}
                >
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item>
                      <Typography variant="h5" fontWeight={800}>
                        {itinerary.price?.amount} CAD
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {itinerary.provider?.name || "Kiwi.com"}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {itinerary.lastAvailable &&
                    itinerary.lastAvailable.seatsLeft != null
                      ? `${itinerary.lastAvailable.seatsLeft} seats left`
                      : "Seats availability unknown"}
                  </Typography>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {itinerary.travelHack && (
                    <Box mb={2} display="flex" flexWrap="wrap" gap={1}>
                      {itinerary.travelHack.isVirtualInterlining && (
                        <Chip
                          label="⚠️ Self-transfer Required"
                          sx={{
                            backgroundColor: "#fbbf24",
                            color: "white",
                            fontWeight: 600,
                          }}
                          size="small"
                        />
                      )}
                      {itinerary.travelHack.isTrueHiddenCity && (
                        <Chip
                          label="🎯 Hidden City"
                          sx={{
                            backgroundColor: "#ef4444",
                            color: "white",
                            fontWeight: 600,
                          }}
                          size="small"
                        />
                      )}
                      {itinerary.travelHack.isThrowawayTicket && (
                        <Chip
                          label="🎫 Throwaway"
                          sx={{
                            backgroundColor: "#6366f1",
                            color: "white",
                            fontWeight: 600,
                          }}
                          size="small"
                        />
                      )}
                    </Box>
                  )}

                  <Box mb={2}>
                    <Typography
                      fontWeight={700}
                      color="#1e293b"
                      variant="h6"
                      mb={2}
                      sx={{
                        borderBottom: "2px solid #e2e8f0",
                        paddingBottom: 1,
                      }}
                    >
                      Flight Details
                    </Typography>

                    {itinerary.sector && itinerary.sector.sectorSegments && (
                      <Box mb={2}>
                        <Typography
                          component="span"
                          fontWeight={600}
                          color="#374151"
                          mb={1}
                          display="block"
                        >
                          ✈️ Flight Segments
                        </Typography>
                        {renderSegments(itinerary.sector.sectorSegments)}
                      </Box>
                    )}

                    {itinerary.outbound &&
                      itinerary.outbound.sectorSegments && (
                        <Box mb={2}>
                          <Typography
                            component="span"
                            fontWeight={600}
                            color="#374151"
                            mb={1}
                            display="block"
                          >
                            🛫 Outbound
                          </Typography>
                          {renderSegments(itinerary.outbound.sectorSegments)}
                        </Box>
                      )}

                    {itinerary.inbound && itinerary.inbound.sectorSegments && (
                      <Box mb={2}>
                        <Typography
                          component="span"
                          fontWeight={600}
                          color="#374151"
                          mb={1}
                          display="block"
                        >
                          🛬 Return
                        </Typography>
                        {renderSegments(itinerary.inbound.sectorSegments)}
                      </Box>
                    )}
                  </Box>
                </CardContent>

                {bookingUrl && (
                  <Box sx={{ p: 3, pt: 0 }}>
                    <Button
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      sx={{
                        fontWeight: 700,
                        width: "100%",
                        background:
                          "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
                        color: "white",
                        py: 1.5,
                        fontSize: "1rem",
                        textTransform: "none",
                        borderRadius: 2,
                        boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
                          boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
                          transform: "translateY(-1px)",
                        },
                      }}
                      fullWidth
                    >
                      Book Flight →
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
