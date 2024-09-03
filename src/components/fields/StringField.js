import InfoIcon from '@mui/icons-material/Info';
import { TextField, Tooltip } from '@mui/material';
import React from 'react';

const StringField = React.memo(
  ({ name, schema, value, onChange, onBlur, error, touched }) => {
    const { title, description } = schema;
    const fieldId = `field-${name}`;
    const errorId = `${fieldId}-error`;

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
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={(e) => onBlur(name, e.target.value)}
        error={touched && !!error}
        helperText={touched && error}
        aria-invalid={touched && !!error}
        aria-describedby={error ? errorId : undefined}
      />
    );
  }
);

export default StringField;
