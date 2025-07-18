import React from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function FlightSearchForm({ form, handleChange, handleSubmit, loading }) {
  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={6}
      sx={{ p: { xs: 2, sm: 4 }, mb: 5, width: '100%', maxWidth: { xs: 400, md: 700, lg: 900 }, borderRadius: 4 }}
    >
      <Typography variant="h6" color="primary" mb={2} fontWeight={600}>
        Flight Search
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Origin (IATA)"
            name="origin"
            value={form.origin}
            onChange={handleChange}
            inputProps={{ maxLength: 3 }}
            required
            fullWidth
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Destination (IATA)"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            inputProps={{ maxLength: 3 }}
            required
            fullWidth
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Departure Date"
            name="departure_date"
            type="date"
            value={form.departure_date}
            onChange={handleChange}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Return Date"
            name="return_date"
            type="date"
            value={form.return_date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Adults"
            name="adults"
            type="number"
            value={form.adults}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Children"
            name="children"
            type="number"
            value={form.children}
            onChange={handleChange}
            inputProps={{ min: 0 }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Infants"
            name="infants"
            type="number"
            value={form.infants}
            onChange={handleChange}
            inputProps={{ min: 0 }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            inputProps={{ maxLength: 3 }}
            required
            fullWidth
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Max Results"
            name="max"
            type="number"
            value={form.max}
            onChange={handleChange}
            inputProps={{ min: 1, max: 50 }}
            required
            fullWidth
          />
        </Grid>
      </Grid>
      <Box mt={4}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={loading}
        >
          {loading ? "Searching..." : "🔍 Search Flights"}
        </Button>
      </Box>
    </Paper>
  );
} 