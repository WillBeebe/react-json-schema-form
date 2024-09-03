import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const API_KEY = ''; // Replace with your actual API key

const WeatherCityComponent = ({
  label,
  value,
  onChange,
  error,
  helperText,
}) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Pre-defined list of cities
    setCities(['London', 'New York', 'Tokyo', 'Paris', 'Sydney']);
  }, []);

  useEffect(() => {
    if (value) {
      fetchWeather(value);
    }
  }, [value]);

  const fetchWeather = async (city) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <FormControl fullWidth error={error}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          label={label}
        >
          {cities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </Select>
        {helperText && <Typography color="error">{helperText}</Typography>}
      </FormControl>
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {weather && !loading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">{weather.name} Weather</Typography>
          <Typography>Temperature: {weather.main.temp}°C</Typography>
          <Typography>Humidity: {weather.main.humidity}%</Typography>
          <Typography>Description: {weather.weather[0].description}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default WeatherCityComponent;
