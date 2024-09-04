import { MenuItem, TextField } from '@mui/material';
import React from 'react';

const EnumField = ({
  name,
  schema,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  return (
    <TextField
      select
      fullWidth
      id={`field-${name}`}
      name={name}
      label={schema.title || name}
      value={value || ''}
      onChange={(e) => onChange(name, e.target.value)}
      onBlur={(e) => onBlur(name, e.target.value)}
      error={touched && !!error}
      helperText={touched && error}
      aria-invalid={touched && !!error}
      aria-describedby={error ? `${name}-error` : undefined}
    >
      {schema.enum.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default React.memo(EnumField);
