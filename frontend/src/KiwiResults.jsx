import React from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AirportIcon, CalendarIcon } from "./Icons";

export default function KiwiResults({ kiwiResults }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  if (!kiwiResults || !kiwiResults.itineraries || kiwiResults.itineraries.length === 0) return null;
  return (
    <Box width="100%" maxWidth={{ xs: 400, md: 700, lg: 900 }} mt={5} sx={{ overflowX: isMobile ? 'auto' : 'visible', pb: isMobile ? 2 : 0 }}>
      <Typography variant="h5" fontWeight={700} mb={3} color="success.main" borderBottom={1} borderColor="divider" pb={1}>
        Kiwi Flights
      </Typography>
      {kiwiResults.metadata && (
        <Box mb={2} color="text.secondary" fontSize="small">
          <div>Total Itineraries: {kiwiResults.metadata.itinerariesCount}</div>
          <div>Has More Pending: {kiwiResults.metadata.hasMorePending ? 'Yes' : 'No'}</div>
        </Box>
      )}
      <Stack
        direction={isMobile ? 'row' : 'column'}
        spacing={3}
        sx={{
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          overflowX: isMobile ? 'auto' : 'visible',
          pb: isMobile ? 2 : 0,
        }}
      >
        {kiwiResults.itineraries.map((itinerary, idx) => {
          const bookingUrl = itinerary.bookingOptions?.edges?.[0]?.node?.bookingUrl
            ? `https://www.kiwi.com${itinerary.bookingOptions.edges[0].node.bookingUrl}`
            : null;
          function renderSegments(segments) {
            return segments.map((segObj, sidx) => {
              const seg = segObj.segment;
              return (
                <Box
                  key={sidx}
                  ml={2}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{
                    flexWrap: 'nowrap',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                  }}
                >
                  <AirportIcon />
                  <Tooltip title={seg?.source?.station?.code} arrow>
                    <Typography component="span" fontWeight={700} noWrap sx={{ maxWidth: 40, fontSize: { xs: 13, sm: 15 } }}>{seg?.source?.station?.code}</Typography>
                  </Tooltip>
                  <Typography component="span" color="text.disabled" noWrap sx={{ fontSize: { xs: 13, sm: 15 } }}>→</Typography>
                  <Tooltip title={seg?.destination?.station?.code} arrow>
                    <Typography component="span" fontWeight={700} noWrap sx={{ maxWidth: 40, fontSize: { xs: 13, sm: 15 } }}>{seg?.destination?.station?.code}</Typography>
                  </Tooltip>
                  <Typography component="span" color="text.secondary" noWrap sx={{ fontSize: { xs: 13, sm: 15 } }}>|</Typography>
                  <CalendarIcon />
                  <Tooltip title={seg?.source?.localTime} arrow>
                    <Typography component="span" noWrap sx={{ maxWidth: 90, fontSize: { xs: 12, sm: 14 }, overflow: 'hidden', textOverflow: 'ellipsis' }}>{seg?.source?.localTime?.slice(0, 10)} {seg?.source?.localTime?.slice(11, 16)}</Typography>
                  </Tooltip>
                  <Typography component="span" color="text.disabled" noWrap sx={{ fontSize: { xs: 13, sm: 15 } }}>→</Typography>
                  <Tooltip title={seg?.destination?.localTime} arrow>
                    <Typography component="span" noWrap sx={{ maxWidth: 90, fontSize: { xs: 12, sm: 14 }, overflow: 'hidden', textOverflow: 'ellipsis' }}>{seg?.destination?.localTime?.slice(0, 10)} {seg?.destination?.localTime?.slice(11, 16)}</Typography>
                  </Tooltip>
                  <Typography component="span" color="text.secondary" noWrap sx={{ fontSize: { xs: 13, sm: 15 } }}>|</Typography>
                  <Tooltip title={`Flight: ${seg?.carrier?.code}${seg?.code}`} arrow>
                    <Typography component="span" fontSize={13} color="text.secondary" noWrap sx={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>Flight: {seg?.carrier?.code}{seg?.code}</Typography>
                  </Tooltip>
                  {segObj.layover && (
                    <Tooltip title={`Layover: ${Math.round(segObj.layover.duration / 3600)}h`} arrow>
                      <Typography component="span" fontSize={11} color="warning.main" ml={2} noWrap sx={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>Layover: {Math.round(segObj.layover.duration / 3600)}h</Typography>
                    </Tooltip>
                  )}
                </Box>
              );
            });
          }
          return (
            <Card
              key={idx}
              variant="outlined"
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                '&:hover': { boxShadow: 6 },
                overflow: 'hidden',
                minWidth: isMobile ? 320 : 'unset',
                maxWidth: isMobile ? 320 : 'unset',
                mx: isMobile ? 1 : 0,
                backdropFilter: 'blur(12px)',
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.18)',
                transition: 'box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Grid container justifyContent="space-between" alignItems="center" mb={1}>
                  <Grid item>
                    <Typography variant="h6" color="success.main" fontWeight={800}>
                      {itinerary.price?.amount} CAD
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      Provider: {itinerary.provider?.name || 'Kiwi.com'}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary" mb={1} display="block">
                  Seats left: {itinerary.lastAvailable && itinerary.lastAvailable.seatsLeft != null ? itinerary.lastAvailable.seatsLeft : 'Not available'}
                </Typography>
                {itinerary.travelHack && (
                  <Box mb={1} display="flex" flexWrap="wrap" gap={1}>
                    {itinerary.travelHack.isVirtualInterlining && (
                      <Chip label="Self-transfer (Virtual Interlining)" color="warning" size="small" />
                    )}
                    {itinerary.travelHack.isTrueHiddenCity && (
                      <Chip label="Hidden City Ticket" color="error" size="small" />
                    )}
                    {itinerary.travelHack.isThrowawayTicket && (
                      <Chip label="Throwaway Ticket" color="info" size="small" />
                    )}
                  </Box>
                )}
                <Box mb={2}>
                  <Typography fontWeight={600} color="success.main" variant="subtitle2">
                    Flight Details:
                  </Typography>
                  {itinerary.sector && itinerary.sector.sectorSegments && (
                    <Box ml={2} mb={1}>
                      <Typography component="span" fontWeight={600}>Segments:</Typography>
                      <Stack spacing={1} divider={<Divider flexItem sx={{ borderColor: '#e3e3e3' }} />}>
                        {renderSegments(itinerary.sector.sectorSegments)}
                      </Stack>
                    </Box>
                  )}
                  {itinerary.outbound && itinerary.outbound.sectorSegments && (
                    <Box ml={2} mb={1}>
                      <Typography component="span" fontWeight={600}>Outbound:</Typography>
                      <Stack spacing={1} divider={<Divider flexItem sx={{ borderColor: '#e3e3e3' }} />}>
                        {renderSegments(itinerary.outbound.sectorSegments)}
                      </Stack>
                    </Box>
                  )}
                  {itinerary.inbound && itinerary.inbound.sectorSegments && (
                    <Box ml={2} mb={1}>
                      <Typography component="span" fontWeight={600}>Inbound:</Typography>
                      <Stack spacing={1} divider={<Divider flexItem sx={{ borderColor: '#e3e3e3' }} />}>
                        {renderSegments(itinerary.inbound.sectorSegments)}
                      </Stack>
                    </Box>
                  )}
                </Box>
                {/* Button is now outside scrollable content and always at the bottom */}
              </CardContent>
              {bookingUrl && (
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    color="success"
                    sx={{ fontWeight: 600, width: '100%', mx: 0, mt: 'auto' }}
                    fullWidth
                  >
                    Book on Kiwi
                  </Button>
                </Box>
              )}
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
} 