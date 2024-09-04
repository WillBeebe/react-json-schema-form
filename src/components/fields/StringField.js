import InfoIcon from '@mui/icons-material/Info';
import { InputAdornment, TextField, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

const StringField = ({
  name,
  schema,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { title, description, pattern } = schema;
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;

  const handleChange = useCallback(
    (e) => {
      onChange(name, e.target.value);
    },
    [name, onChange]
  );

  const handleBlur = useCallback(
    (e) => {
      setIsFocused(false);
      onBlur(name, e.target.value);
    },
    [name, onBlur]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const getHelperText = useCallback(() => {
    if (touched && error) return error;
    if (isFocused && pattern) return `Pattern: ${pattern}`;
    return description || '';
  }, [touched, error, isFocused, pattern, description]);

  return (
    <TextField
      fullWidth
      id={fieldId}
      name={name}
      label={
        <span>
          {title || name}
          {description && (
            <Tooltip title={description} arrow>
              <InfoIcon
                fontSize="small"
                sx={{ ml: 1, verticalAlign: 'middle' }}
              />
            </Tooltip>
          )}
        </span>
      }
      value={value || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      error={touched && !!error}
      helperText={getHelperText()}
      aria-invalid={touched && !!error}
      aria-describedby={error ? errorId : undefined}
      InputProps={{
        endAdornment: pattern && (
          <InputAdornment position="end">
            <Tooltip title={`Pattern: ${pattern}`}>
              <InfoIcon />
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
};

StringField.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    pattern: PropTypes.string,
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.string,
  touched: PropTypes.bool,
};

export default React.memo(StringField);
