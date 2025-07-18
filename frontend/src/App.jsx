import React, { useState } from "react";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
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

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      py: { xs: 2, md: 6 },
      px: 0,
      overflowX: 'hidden',
    }}>
      <Paper elevation={0} sx={{
        width: '100%',
        maxWidth: 900,
        mx: 'auto',
        my: { xs: 1, md: 4 },
        px: { xs: 1, sm: 2, md: 4 },
        py: { xs: 2, md: 4 },
        borderRadius: 5,
        backdropFilter: 'blur(16px)',
        background: 'rgba(255,255,255,0.65)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        border: '1px solid rgba(255,255,255,0.18)',
      }}>
        <Typography variant="h2" fontWeight={800} mb={2} mt={2} color="primary" align="center" sx={{ textShadow: '0 2px 4px #cbd5e1', fontSize: { xs: 28, sm: 36, md: 44 } }}>
          Flight Price Tracker
        </Typography>
        <Typography mb={4} color="text.secondary" align="center" maxWidth="xl" sx={{ fontSize: { xs: 15, sm: 18 } }}>
          Find the best flight deals. Enter your route and dates below!
        </Typography>
        <FlightSearchForm
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
        {error && (
          <Alert severity="error" sx={{ mb: 4, maxWidth: 'xl', width: '100%', borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        <MainResults results={results} form={form} />
        {results.length > 0 && !showKiwi && (
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 4, px: 6, py: 2, fontWeight: 600, boxShadow: 2, borderRadius: 2 }}
            disabled={kiwiLoading}
            onClick={async () => {
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
            }}
          >
            {kiwiLoading ? 'Loading...' : 'Compare Provider'}
          </Button>
        )}
        {kiwiError && (
          <Alert severity="error" sx={{ mt: 2, maxWidth: 'xl', width: '100%', borderRadius: 2 }}>
            {kiwiError}
          </Alert>
        )}
        {showKiwi && <KiwiResults kiwiResults={kiwiResults} />}
      </Paper>
    </Box>
  );
}
