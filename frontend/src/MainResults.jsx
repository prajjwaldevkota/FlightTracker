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
import { styled } from '@mui/material/styles';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LaunchIcon from '@mui/icons-material/Launch';
import { AirportIcon, CalendarIcon } from "./Icons";

const ResultCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  '&:hover': {
    boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
    transform: 'translateY(-4px)',
  },
}));

const PriceHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
  color: 'white',
  padding: theme.spacing(2.5, 3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #06b6d4 0%, #10b981 100%)',
  },
}));

const SegmentBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255,255,255,0.9)',
  borderRadius: 12,
  padding: theme.spacing(2),
  margin: theme.spacing(1, 0),
  border: '1px solid rgba(59,130,246,0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,1)',
    boxShadow: '0 4px 12px rgba(59,130,246,0.1)',
    transform: 'translateY(-1px)',
  },
}));

const BookButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '14px 28px',
  fontSize: 16,
  fontWeight: 700,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
    boxShadow: '0 12px 32px rgba(59, 130, 246, 0.4)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

// Helper function to format flight duration
const formatDuration = (segment) => {
  if (segment.duration) {
    
    const match = segment.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
      const hours = parseInt(match[1] || 0);
      const minutes = parseInt(match[2] || 0);
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    }
  }
  
};

export default function MainResults({ results, form }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!results || results.length === 0) return null;

  return (
    <Box 
      width="100%" 
      maxWidth={{ xs: '100%', sm: '100%', md: 1200, lg: 1400 }} 
      sx={{ 
        mb: 4,
        mx: 'auto', // Center the container
        px: { xs: 2, sm: 3 } // Add padding for mobile
      }}
    >
      <Box 
        mb={4} 
        sx={{ 
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          borderRadius: 3,
          p: 3,
          color: 'white',
          boxShadow: 3
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1}>
          <FlightTakeoffIcon sx={{ fontSize: 32, mr: 1 }} />
          Search Results ({results.length})
        </Typography> 
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Found {results.length} flight options for your trip
        </Typography>
      </Box>
      
      <Grid 
        container 
        spacing={3}
        sx={{
          justifyContent: 'center',
        }}
      >
        {results.map((flight) => {
          const firstItinerary = flight.itineraries[0];
          const firstSegment = firstItinerary.segments[0];
          const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];
          
          // Build Skyscanner URL
          const origin = firstSegment.departure.iataCode.toLowerCase();
          const destination = lastSegment.arrival.iataCode.toLowerCase();
          const departDate = form.departure_date.replace(/-/g, "").slice(2);
          const returnDate = form.return_date ? form.return_date.replace(/-/g, "").slice(2) : "";
          const adults = form.adults;
          
          let skyscannerUrl = `https://www.skyscanner.com/transport/flights/${origin}/${destination}/${departDate}/`;
          if (returnDate) skyscannerUrl += `${returnDate}/`;
          skyscannerUrl += `?adults=${adults}`;

          return (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={6} 
              lg={4} // Allow 3 columns on large screens
              xl={4}
              key={flight.id}
              sx={{
                display: 'flex',
                justifyContent: 'center' // Center each card
              }}
            >
              <ResultCard sx={{ width: '100%', maxWidth: 400 }}>
                <PriceHeader>
                  <Typography variant="h5" fontWeight={800}>
                    {flight.price} {flight.currency}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {flight.validatingAirlineCodes?.map(code => (
                      <Chip 
                        key={code} 
                        label={code} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          color: 'white', 
                          fontWeight: 700,
                          border: '1px solid rgba(255,255,255,0.3)',
                        }} 
                      />
                    ))}
                  </Stack>
                </PriceHeader>
                
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {flight.itineraries.map((itinerary, idx) => (
                      <Box key={idx} mb={3}>
                        <Typography 
                          variant="h6" 
                          fontWeight={700} 
                          color="#1e40af" 
                          mb={2}
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            borderBottom: '2px solid #e2e8f0',
                            paddingBottom: 1
                          }}
                        >
                          {idx === 0 ? <FlightTakeoffIcon /> : <FlightLandIcon />}
                          {idx === 0 ? '🛫 Outbound' : '🛬 Return'} Journey
                        </Typography>
                        
                        <Stack spacing={1}>
                          {itinerary.segments.map((segment, sidx) => (
                            <SegmentBox key={sidx}>
                              <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <Box display="flex" alignItems="center" gap={1.5}>
                                    <AirportIcon />
                                    <Typography fontWeight={700} sx={{ color: '#1e40af', fontSize: 16 }}>
                                      {segment.departure.iataCode}
                                    </Typography>
                                    <Typography color="text.disabled" sx={{ fontSize: 18 }}>→</Typography>
                                    <Typography fontWeight={700} sx={{ color: '#10b981', fontSize: 16 }}>
                                      {segment.arrival.iataCode}
                                    </Typography>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                    <CalendarIcon />
                                    <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>
                                      {segment.departure.at.slice(0, 10)}
                                    </Typography>
                                    <AccessTimeIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                                    <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>
                                      {segment.departure.at.slice(11, 16)} → {segment.arrival.at.slice(11, 16)}
                                    </Typography>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={12}>
                                  <Divider sx={{ my: 1 }} />
                                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                                    <Chip 
                                      label={`${segment.carrierCode}${segment.number}`}
                                      size="small"
                                      sx={{
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.75rem'
                                      }}
                                    />
                                    <Chip 
                                      label={formatDuration(segment)}
                                      size="small"
                                      sx={{
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.75rem'
                                      }}
                                    />
                                  </Stack>
                                </Grid>
                              </Grid>
                            </SegmentBox>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Box>
                  
                  <Box mt={2}>
                    <BookButton
                      href={skyscannerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      fullWidth
                      startIcon={<LaunchIcon />}
                    >
                      Book on Skyscanner →
                    </BookButton>
                    
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      display="block" 
                      mt={1.5} 
                      align="center"
                      sx={{ fontSize: 12, lineHeight: 1.4, opacity: 0.8 }}
                    >
                      Prices may vary. You'll be redirected to Skyscanner to complete your booking.
                    </Typography>
                  </Box>
                </CardContent>
              </ResultCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}