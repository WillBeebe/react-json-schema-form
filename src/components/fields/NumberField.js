import InfoIcon from '@mui/icons-material/Info';
import { TextField, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

const NumberField = ({
  name,
  schema,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  const { title, description, minimum, maximum, multipleOf } = schema;
  const isRequired = schema.required && schema.required.includes(name);
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;

  const handleChange = useCallback(
    (event) => {
      const newValue =
        event.target.value === '' ? '' : Number(event.target.value);
      onChange(name, newValue);
    },
    [name, onChange]
  );

  const handleBlur = useCallback(() => {
    onBlur(name);
  }, [name, onBlur]);

  return (
    <TextField
      fullWidth
      id={fieldId}
      label={
        <span>
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
        </span>
      }
      type="number"
      name={name}
      value={value === undefined ? '' : value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched && !!error}
      helperText={touched && error}
      required={isRequired}
      InputProps={{
        inputProps: {
          min: minimum,
          max: maximum,
          step: multipleOf,
        },
      }}
      aria-invalid={touched && !!error}
      aria-describedby={error ? errorId : undefined}
    />
  );
};

NumberField.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    required: PropTypes.arrayOf(PropTypes.string),
    minimum: PropTypes.number,
    maximum: PropTypes.number,
    multipleOf: PropTypes.number,
  }).isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.string,
  touched: PropTypes.bool,
};

export default React.memo(NumberField);
