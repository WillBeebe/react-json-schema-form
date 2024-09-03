import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const StringField = ({
  name,
  schema,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { title, description, format, minLength, maxLength, pattern } = schema;

  const handleChange = (event) => {
    onChange(name, event.target.value);
  };

  const handleBlur = (event) => {
    onBlur(name, event.target.value);
  };

  const getInputType = () => {
    switch (format) {
      case 'date':
        return 'date';
      case 'time':
        return 'time';
      case 'date-time':
        return 'datetime-local';
      case 'email':
        return 'email';
      case 'uri':
        return 'url';
      case 'password':
        return showPassword ? 'text' : 'password';
      default:
        return 'text';
    }
  };

  const getInputProps = () => {
    const props = {};
    if (minLength !== undefined) props.minLength = minLength;
    if (maxLength !== undefined) props.maxLength = maxLength;
    if (pattern !== undefined) props.pattern = pattern;
    return props;
  };

  const renderPasswordToggle = () => {
    if (format !== 'password') return null;

    return (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => setShowPassword(!showPassword)}
          onMouseDown={(e) => e.preventDefault()}
          edge="end"
        >
          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </InputAdornment>
    );
  };

  return (
    <TextField
      fullWidth
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
      type={getInputType()}
      value={value || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched && !!error}
      helperText={touched && error}
      InputProps={{
        endAdornment: renderPasswordToggle(),
      }}
      InputLabelProps={
        format === 'date' || format === 'time' || format === 'date-time'
          ? { shrink: true }
          : undefined
      }
      {...getInputProps()}
    />
  );
};

StringField.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    format: PropTypes.string,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    pattern: PropTypes.string,
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.string,
  touched: PropTypes.bool,
};

export default React.memo(StringField);
