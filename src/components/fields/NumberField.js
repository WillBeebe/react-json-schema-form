import InfoIcon from '@mui/icons-material/Info';
import { TextField, Tooltip } from '@mui/material';
import React from 'react';

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

  const handleChange = (event) => {
    const newValue =
      event.target.value === '' ? '' : Number(event.target.value);
    onChange(name, newValue);
  };

  const handleBlur = (event) => {
    onBlur(name);
  };

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

export default React.memo(NumberField);
