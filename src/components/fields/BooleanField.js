import InfoIcon from '@mui/icons-material/Info';
import {
  FormControl,
  FormControlLabel,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';

const BooleanField = ({
  name,
  schema,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  const { title, description } = schema;
  const isRequired = schema.required && schema.required.includes(name);
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;

  const handleChange = (event) => {
    onChange(name, event.target.checked);
  };

  const handleBlur = () => {
    onBlur(name);
  };

  return (
    <FormControl fullWidth error={touched && !!error} required={isRequired}>
      <FormControlLabel
        control={
          <Switch
            checked={!!value}
            onChange={handleChange}
            onBlur={handleBlur}
            name={name}
            id={fieldId}
            inputProps={{
              'aria-describedby': error ? errorId : undefined,
            }}
          />
        }
        label={
          <Typography component="span">
            {title || name}
            {isRequired && <span style={{ color: 'red' }}> *</span>}
            {description && (
              <Tooltip title={description} arrow>
                <InfoIcon
                  fontSize="small"
                  sx={{ ml: 1, verticalAlign: 'middle' }}
                />
              </Tooltip>
            )}
          </Typography>
        }
      />
      {touched && error && (
        <Typography color="error" variant="caption" id={errorId}>
          {error}
        </Typography>
      )}
    </FormControl>
  );
};

export default React.memo(BooleanField);
