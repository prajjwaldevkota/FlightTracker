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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AirportIcon, CalendarIcon } from "./Icons";

export default function MainResults({ results, form }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  if (!results || results.length === 0) return null;
  return (
    <Box width="100%" maxWidth={{ xs: 400, md: 700, lg: 900 }} sx={{ overflowX: isMobile ? 'auto' : 'visible', pb: isMobile ? 2 : 0 }}>
      <Typography variant="h5" fontWeight={700} mb={3} color="primary" borderBottom={1} borderColor="divider" pb={1}>
        Results
      </Typography>
      <Stack
        direction={isMobile ? 'row' : 'column'}
        spacing={3}
        sx={{
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          overflowX: isMobile ? 'auto' : 'visible',
          pb: isMobile ? 2 : 0,
        }}
      >
        {results.map((flight) => {
          const firstItinerary = flight.itineraries[0];
          const firstSegment = firstItinerary.segments[0];
          const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];
          const origin = firstSegment.departure.iataCode.toLowerCase();
          const destination = lastSegment.arrival.iataCode.toLowerCase();
          const departDate = form.departure_date.replace(/-/g, "").slice(2);
          const returnDate = form.return_date ? form.return_date.replace(/-/g, "").slice(2) : "";
          const adults = form.adults;
          let skyscannerUrl = `https://www.skyscanner.com/transport/flights/${origin}/${destination}/${departDate}/`;
          if (returnDate) skyscannerUrl += `${returnDate}/`;
          skyscannerUrl += `?adults=${adults}`;
          return (
            <Card
              key={flight.id}
              variant="outlined"
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                '&:hover': { boxShadow: 6 },
                overflow: 'hidden',
                minWidth: isMobile ? 320 : 'unset',
                maxWidth: isMobile ? 340 : 'unset',
                mx: isMobile ? 1 : 0,
                backdropFilter: 'blur(12px)',
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.18)',
                transition: 'box-shadow 0.2s',
              }}
            >
              <Box sx={{ background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', color: 'white', px: 3, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={800}>
                  {flight.price} {flight.currency}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {flight.validatingAirlineCodes?.map(code => (
                    <Chip key={code} label={code} size="small" color="default" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700 }} />
                  ))}
                </Stack>
              </Box>
              <CardContent sx={{ bgcolor: '#f7fafd', p: 2 }}>
                {flight.itineraries.map((it, idx) => (
                  <Box key={idx} mb={2}>
                    <Typography fontWeight={600} color="primary.main" variant="subtitle2" mb={1}>
                      Itinerary {idx + 1}
                    </Typography>
                    <Stack spacing={1} divider={<Divider flexItem sx={{ borderColor: '#e3e3e3' }} />}>
                      {it.segments.map((seg, sidx) => (
                        <Grid key={sidx} container alignItems="center" spacing={1} sx={{ bgcolor: 'white', borderRadius: 2, px: 1, py: 0.5 }}>
                          <Grid item><AirportIcon /></Grid>
                          <Grid item><Typography fontWeight={700}>{seg.departure.iataCode}</Typography></Grid>
                          <Grid item><Typography color="text.disabled">→</Typography></Grid>
                          <Grid item><Typography fontWeight={700}>{seg.arrival.iataCode}</Typography></Grid>
                          <Grid item><Typography color="text.secondary">|</Typography></Grid>
                          <Grid item><CalendarIcon /></Grid>
                          <Grid item><Typography>{seg.departure.at.slice(0, 10)} {seg.departure.at.slice(11, 16)}</Typography></Grid>
                          <Grid item><Typography color="text.disabled">→</Typography></Grid>
                          <Grid item><Typography>{seg.arrival.at.slice(0, 10)} {seg.arrival.at.slice(11, 16)}</Typography></Grid>
                          <Grid item><Typography color="text.secondary">|</Typography></Grid>
                          <Grid item><Typography fontSize={13} color="text.secondary">Flight: {seg.carrierCode}{seg.number}</Typography></Grid>
                        </Grid>
                      ))}
                    </Stack>
                  </Box>
                ))}
                <Button
                  href={skyscannerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, fontWeight: 600, borderRadius: 2 }}
                  fullWidth
                >
                  Book on Skyscanner
                </Button>
                <Typography variant="caption" color="text.disabled" display="block" mt={1} align="center">
                  Price and availability may change. Booking will open Skyscanner with your selected route and dates.
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
} 