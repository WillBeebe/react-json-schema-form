import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

const getCountryFlag = (country) => {
  const flagEmojis = {
    'South Africa': '🇿🇦',
    Taiwan: '🇹🇼',
    'Hong Kong': '🇭🇰',
    Japan: '🇯🇵',
    'South Korea': '🇰🇷',
    India: '🇮🇳',
    Singapore: '🇸🇬',
    Indonesia: '🇮🇩',
    Australia: '🇦🇺',
    Poland: '🇵🇱',
    Finland: '🇫🇮',
    Spain: '🇪🇸',
    Belgium: '🇧🇪',
    Germany: '🇩🇪',
    Italy: '🇮🇹',
    UK: '🇬🇧',
    Netherlands: '🇳🇱',
    Switzerland: '🇨🇭',
    France: '🇫🇷',
    Qatar: '🇶🇦',
    'Saudi Arabia': '🇸🇦',
    Israel: '🇮🇱',
    Canada: '🇨🇦',
    Brazil: '🇧🇷',
    Chile: '🇨🇱',
    USA: '🇺🇸',
  };
  return flagEmojis[country] || '';
};

const GCPRegionsComponent = ({ label, value, onChange, error, helperText }) => {
  const [regions, setRegions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data with labels, values, and countries
    const mockRegions = [
      {
        label: 'Johannesburg',
        value: 'africa-south1',
        country: 'South Africa',
      },
      { label: 'Changhua County', value: 'asia-east1', country: 'Taiwan' },
      { label: 'Hong Kong', value: 'asia-east2', country: 'Hong Kong' },
      { label: 'Tokyo', value: 'asia-northeast1', country: 'Japan' },
      { label: 'Osaka', value: 'asia-northeast2', country: 'Japan' },
      { label: 'Seoul', value: 'asia-northeast3', country: 'South Korea' },
      { label: 'Mumbai', value: 'asia-south1', country: 'India' },
      { label: 'Delhi', value: 'asia-south2', country: 'India' },
      { label: 'Singapore', value: 'asia-southeast1', country: 'Singapore' },
      { label: 'Jakarta', value: 'asia-southeast2', country: 'Indonesia' },
      { label: 'Sydney', value: 'australia-southeast1', country: 'Australia' },
      {
        label: 'Melbourne',
        value: 'australia-southeast2',
        country: 'Australia',
      },
      { label: 'Warsaw', value: 'europe-central2', country: 'Poland' },
      { label: 'Hamina', value: 'europe-north1', country: 'Finland' },
      { label: 'Madrid', value: 'europe-southwest1', country: 'Spain' },
      { label: 'St. Ghislain', value: 'europe-west1', country: 'Belgium' },
      { label: 'Berlin', value: 'europe-west10', country: 'Germany' },
      { label: 'Turin', value: 'europe-west12', country: 'Italy' },
      { label: 'London', value: 'europe-west2', country: 'UK' },
      { label: 'Frankfurt', value: 'europe-west3', country: 'Germany' },
      { label: 'Eemshaven', value: 'europe-west4', country: 'Netherlands' },
      { label: 'Zürich', value: 'europe-west6', country: 'Switzerland' },
      { label: 'Milan', value: 'europe-west8', country: 'Italy' },
      { label: 'Paris', value: 'europe-west9', country: 'France' },
      { label: 'Doha', value: 'me-central1', country: 'Qatar' },
      { label: 'Dammam', value: 'me-central2', country: 'Saudi Arabia' },
      { label: 'Tel Aviv', value: 'me-west1', country: 'Israel' },
      {
        label: 'Montréal',
        value: 'northamerica-northeast1',
        country: 'Canada',
      },
      { label: 'Toronto', value: 'northamerica-northeast2', country: 'Canada' },
      { label: 'São Paulo', value: 'southamerica-east1', country: 'Brazil' },
      { label: 'Santiago', value: 'southamerica-west1', country: 'Chile' },
      { label: 'Council Bluffs, Iowa', value: 'us-central1', country: 'USA' },
      {
        label: 'Moncks Corner, South Carolina',
        value: 'us-east1',
        country: 'USA',
      },
      { label: 'Ashburn, Virginia', value: 'us-east4', country: 'USA' },
      { label: 'Columbus, Ohio', value: 'us-east5', country: 'USA' },
      { label: 'Dallas, Texas', value: 'us-south1', country: 'USA' },
      { label: 'The Dalles, Oregon', value: 'us-west1', country: 'USA' },
      { label: 'Los Angeles, California', value: 'us-west2', country: 'USA' },
      { label: 'Salt Lake City, Utah', value: 'us-west3', country: 'USA' },
      { label: 'Las Vegas, Nevada', value: 'us-west4', country: 'USA' },
    ];
    setRegions(mockRegions);
  }, []);

  const filteredRegions = useMemo(() => {
    return regions.filter(
      (region) =>
        region.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [regions, searchTerm]);

  return (
    <FormControl fullWidth error={error}>
      <TextField
        label="Search regions"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        margin="normal"
      />
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        {filteredRegions.map((region) => (
          <MenuItem key={region.value} value={region.value}>
            <Box display="flex" alignItems="center">
              <span style={{ marginRight: '8px' }}>
                {getCountryFlag(region.country)}
              </span>
              {region.label}, {region.country} ({region.value})
            </Box>
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default GCPRegionsComponent;
