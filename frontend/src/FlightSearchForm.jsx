import React from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SearchIcon from '@mui/icons-material/Search';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    color: '#374151',
    '&.Mui-focused': {
      color: '#3b82f6',
    },
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '12px 32px',
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
  '&:disabled': {
    background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
    transform: 'none',
  },
  transition: 'all 0.3s ease',
}));

export default function FlightSearchForm({ form, handleChange, handleSubmit, loading }) {
  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{ 
        p: { xs: 3, sm: 4 }, 
        mb: 4, 
        borderRadius: 4,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          fontWeight: 700,
          color: '#1e40af',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <SearchIcon /> Search Flights
      </Typography>
      
      <Grid container spacing={3}>
        {/* Origin and Destination */}
        <Grid item xs={12} md={6}>
          <StyledTextField
            label="From (Airport Code)"
            name="origin"
            value={form.origin}
            onChange={handleChange}
            inputProps={{ maxLength: 3 }}
            required
            fullWidth
            autoComplete="off"
            placeholder="e.g., YYZ"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlightTakeoffIcon sx={{ color: '#3b82f6' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField
            label="To (Airport Code)"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            inputProps={{ maxLength: 3 }}
            required
            fullWidth
            autoComplete="off"
            placeholder="e.g., KTM"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlightLandIcon sx={{ color: '#10b981' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Dates */}
        <Grid item xs={12} md={6}>
          <StyledTextField
            label="Departure Date"
            name="departure_date"
            type="date"
            value={form.departure_date}
            onChange={handleChange}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: '#f59e0b' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField
            label="Return Date (Optional)"
            name="return_date"
            type="date"
            value={form.return_date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: '#f59e0b' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Passengers */}
        <Grid item xs={12} md={4}>
          <StyledTextField
            label="Adults"
            name="adults"
            type="number"
            value={form.adults}
            onChange={handleChange}
            inputProps={{ min: 1, max: 9 }}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PeopleIcon sx={{ color: '#8b5cf6' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StyledTextField
            label="Children"
            name="children"
            type="number"
            value={form.children}
            onChange={handleChange}
            inputProps={{ min: 0, max: 9 }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PeopleIcon sx={{ color: '#8b5cf6' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StyledTextField
            label="Infants"
            name="infants"
            type="number"
            value={form.infants}
            onChange={handleChange}
            inputProps={{ min: 0, max: 9 }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PeopleIcon sx={{ color: '#8b5cf6' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Currency and Max Results */}
        <Grid item xs={12} md={6}>
          <StyledTextField
            label="Currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            inputProps={{ maxLength: 3 }}
            required
            fullWidth
            autoComplete="off"
            placeholder="e.g., CAD"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon sx={{ color: '#10b981' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField
            label="Max Results"
            name="max"
            type="number"
            value={form.max}
            onChange={handleChange}
            inputProps={{ min: 1, max: 50 }}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6b7280' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="center">
        <SearchButton
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={<SearchIcon />}
          sx={{ minWidth: 200 }}
        >
          {loading ? "Searching..." : "Search Flights"}
        </SearchButton>
      </Box>
    </Paper>
  );
}