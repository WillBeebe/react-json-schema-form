import InfoIcon from '@mui/icons-material/Info';
import {
  FormControl,
  FormControlLabel,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

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

  const handleChange = useCallback(
    (event) => {
      onChange(name, event.target.checked);
    },
    [name, onChange]
  );

  const handleBlur = useCallback(() => {
    onBlur(name);
  }, [name, onBlur]);

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

BooleanField.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    required: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.string,
  touched: PropTypes.bool,
};

export default React.memo(BooleanField);
