import InfoIcon from '@mui/icons-material/Info';
import { TextField, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

const StringField = ({
  name,
  schema,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  const { title, description } = schema;
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
      onBlur(name, e.target.value);
    },
    [name, onBlur]
  );

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
      error={touched && !!error}
      helperText={touched && error}
      aria-invalid={touched && !!error}
      aria-describedby={error ? errorId : undefined}
    />
  );
};

StringField.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.string,
  touched: PropTypes.bool,
};

export default React.memo(StringField);
