import React, { useState } from "react";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FlightSearchForm from "./FlightSearchForm";
import MainResults from "./MainResults";
import KiwiResults from "./KiwiResults";

const BACKEND_URL = "http://127.0.0.1:8000/search-flights";

export default function App() {
  const [form, setForm] = useState({
    origin: "YYZ",
    destination: "KTM",
    departure_date: new Date().toISOString().split('T')[0],
    return_date: "",
    adults: 1,
    children: 0,
    infants: 0,
    currency: "CAD",
    max: 10,
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [kiwiResults, setKiwiResults] = useState(null);
  const [showKiwi, setShowKiwi] = useState(false);
  const [kiwiLoading, setKiwiLoading] = useState(false);
  const [kiwiError, setKiwiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setKiwiResults(null);
    setShowKiwi(false);
    try {
      const params = new URLSearchParams({
        ...form,
        adults: String(form.adults),
        max: String(form.max),
      });
      const res = await fetch(`${BACKEND_URL}?${params}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResults(data.results || []);
      if (!data.results || data.results.length === 0) {
        setError("No flights found for this search.");
      }
    } catch {
      setError("Failed to fetch flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKiwiCompare = async () => {
    setKiwiLoading(true);
    setKiwiError("");
    try {
      const params = new URLSearchParams({
        source: `City:${form.origin}`,
        destination: `City:${form.destination}`,
        departure_date: form.departure_date,
        currency: form.currency,
        adults: form.adults,
        children: form.children,
        infants: form.infants,
        limit: form.max,
      });
      if (form.return_date) {
        params.append('return_date', form.return_date);
      }
      const res = await fetch(`http://localhost:8000/compare-flights-kiwi?${params}`);
      if (!res.ok) throw new Error('Kiwi API error');
      const data = await res.json();
      setKiwiResults(data);
      setShowKiwi(true);
    } catch {
      setKiwiError('Failed to fetch Kiwi flights. Please try again.');
    } finally {
      setKiwiLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      py: { xs: 2, md: 4 },
      px: { xs: 1, md: 2 },
      overflowX: 'hidden',
    }}>
      <Container maxWidth="lg" sx={{ width: '100%' }}>
        <Paper elevation={0} sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          my: { xs: 1, md: 2 },
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, md: 4 },
          borderRadius: 4,
          backdropFilter: 'blur(20px)',
          background: 'rgba(255,255,255,0.85)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography 
              variant="h3" 
              fontWeight={900} 
              mb={2} 
              sx={{ 
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: 28, sm: 36, md: 48 },
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              ✈️ Flight Finder
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: 16, sm: 18, md: 20 },
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Discover the best flight deals across multiple providers
            </Typography>
          </Box>

          {/* Search Form */}
          <FlightSearchForm
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
          />

          {/* Error Display */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                fontSize: 16,
                '& .MuiAlert-icon': { fontSize: 24 }
              }}
            >
              {error}
            </Alert>
          )}

          {/* Main Results */}
          <MainResults results={results} form={form} />

          {/* Compare Button */}
          {results.length > 0 && !showKiwi && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Button
                variant="contained"
                onClick={handleKiwiCompare}
                disabled={kiwiLoading}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    boxShadow: '0 12px 32px rgba(16,185,129,0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                  },
                  transition: 'all 0.3s ease',
                }}
                startIcon={kiwiLoading && <CircularProgress size={20} color="inherit" />}
              >
                {kiwiLoading ? 'Comparing...' : '🔍 Compare with Kiwi'}
              </Button>
            </Box>
          )}

          {/* Kiwi Error */}
          {kiwiError && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 3, 
                borderRadius: 3,
                fontSize: 16,
                '& .MuiAlert-icon': { fontSize: 24 }
              }}
            >
              {kiwiError}
            </Alert>
          )}

          {/* Kiwi Results */}
          {showKiwi && <KiwiResults kiwiResults={kiwiResults} />}
        </Paper>
      </Container>
    </Box>
  );
}