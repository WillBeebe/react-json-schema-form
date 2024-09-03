import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
} from '@mui/material';

const CIDRBlockSelector = ({ label, value, onChange, error, helperText }) => {
  const [ipAddress, setIpAddress] = useState('10.0.0.0');
  const [prefixLength, setPrefixLength] = useState(16);
  const [customInput, setCustomInput] = useState('');

  useEffect(() => {
    if (value) {
      const [ip, prefix] = value.split('/');
      setIpAddress(ip);
      setPrefixLength(Number(prefix));
    }
  }, [value]);

  const handleIPChange = (event) => {
    setIpAddress(event.target.value);
    updateValue(event.target.value, prefixLength);
  };

  const handlePrefixChange = (event, newValue) => {
    setPrefixLength(newValue);
    updateValue(ipAddress, newValue);
  };

  const handleCustomInputChange = (event) => {
    setCustomInput(event.target.value);
    if (isValidCIDR(event.target.value)) {
      onChange(event.target.value);
    }
  };

  const updateValue = (ip, prefix) => {
    const newValue = `${ip}/${prefix}`;
    if (isValidCIDR(newValue)) {
      onChange(newValue);
    }
  };

  const isValidCIDR = (cidr) => {
    const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    if (!cidrRegex.test(cidr)) return false;

    const [ip, prefix] = cidr.split('/');
    const octets = ip.split('.').map(Number);
    return (
      octets.every((octet) => octet >= 0 && octet <= 255) &&
      Number(prefix) >= 0 &&
      Number(prefix) <= 32
    );
  };

  const calculateAddressRange = () => {
    const ipParts = ipAddress.split('.').map(Number);
    const totalIPs = 2 ** (32 - prefixLength);
    const startIP =
      ipParts.reduce((acc, octet) => (acc << 8) + octet, 0) &
      -(2 ** (32 - prefixLength));
    const endIP = startIP + totalIPs - 1;

    const formatIP = (ip) =>
      [(ip >> 24) & 255, (ip >> 16) & 255, (ip >> 8) & 255, ip & 255].join('.');

    return `${formatIP(startIP)} - ${formatIP(endIP)}`;
  };

  const predefinedRanges = [
    { label: 'Small', value: '10.0.0.0/24' },
    { label: 'Medium', value: '172.16.0.0/16' },
    { label: 'Large', value: '192.168.0.0/16' },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="IP Address"
            value={ipAddress}
            onChange={handleIPChange}
            error={error}
            helperText={error ? helperText : 'Enter the starting IP address'}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>Prefix Length: {prefixLength}</Typography>
          <Slider
            value={prefixLength}
            onChange={handlePrefixChange}
            min={8}
            max={30}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>
      </Grid>

      <Typography variant="body2" sx={{ mt: 2 }}>
        CIDR Block: {ipAddress}/{prefixLength}
      </Typography>
      <Typography variant="body2">
        Address Range: {calculateAddressRange()}
      </Typography>
      <Typography variant="body2">
        Total IPs: {2 ** (32 - prefixLength)}
      </Typography>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Quick Select</InputLabel>
        <Select
          value=""
          onChange={(e) => {
            const [ip, prefix] = e.target.value.split('/');
            setIpAddress(ip);
            setPrefixLength(Number(prefix));
            onChange(e.target.value);
          }}
        >
          {predefinedRanges.map((range) => (
            <MenuItem key={range.value} value={range.value}>
              {range.label} ({range.value})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Tooltip title="Enter a custom CIDR block (e.g., 192.168.1.0/24)">
        <TextField
          fullWidth
          label="Custom CIDR Input"
          value={customInput}
          onChange={handleCustomInputChange}
          error={customInput !== '' && !isValidCIDR(customInput)}
          helperText={
            customInput !== '' && !isValidCIDR(customInput)
              ? 'Invalid CIDR format'
              : ''
          }
          sx={{ mt: 2 }}
        />
      </Tooltip>
    </Box>
  );
};

export default CIDRBlockSelector;
