import InfoIcon from '@mui/icons-material/Info';
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import ArrayField from '../fields/ArrayField';
import StringField from '../fields/StringField';

const FieldRenderer = ({
  name,
  schema,
  fieldSchema,
  value,
  error,
  onChange,
  onBlur,
  touched,
  customComponents,
}) => {
  const isRequired = schema.required && schema.required.includes(name);

  const commonProps = {
    fullWidth: true,
    name,
    label: (
      <span>
        {fieldSchema.title || name}
        {isRequired && <span style={{ color: 'red' }}> *</span>}
        {fieldSchema.description && (
          <Tooltip title={fieldSchema.description} arrow>
            <InfoIcon
              fontSize="small"
              sx={{ ml: 1, verticalAlign: 'middle' }}
            />
          </Tooltip>
        )}
      </span>
    ),
    value: value !== undefined ? value : '',
    onChange: (e) => onChange(name, e.target.value),
    onBlur: () => onBlur(name),
    error: touched && !!error,
    helperText: touched && error,
    required: isRequired,
  };

  if (customComponents[name]) {
    const CustomComponent = customComponents[name];
    return (
      <CustomComponent
        {...commonProps}
        schema={fieldSchema}
        onChange={(value) => onChange(name, value)}
      />
    );
  }

  if (fieldSchema.enum) {
    const options = fieldSchema.enum.map((option, index) => ({
      value: option,
      label: fieldSchema.enumNames?.[index] || option,
    }));

    return (
      <FormControl {...commonProps}>
        <InputLabel error={touched && !!error}>{commonProps.label}</InputLabel>
        <Select {...commonProps} label={commonProps.label}>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  switch (fieldSchema.type) {
    case 'string':
      return (
        <StringField
          name={name}
          schema={fieldSchema}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
          touched={touched}
        />
      );
    case 'number':
    case 'integer':
      return <TextField {...commonProps} type="number" />;
    case 'boolean':
      return (
        <FormControlLabel
          control={
            <Switch
              checked={!!value}
              onChange={(e) => onChange(name, e.target.checked)}
            />
          }
          label={commonProps.label}
        />
      );
    case 'array':
      return (
        <ArrayField
          fieldSchema={fieldSchema}
          value={value}
          onChange={(newValue) => onChange(name, newValue)}
          error={error}
        />
      );
    default:
      return (
        <Typography color="error">
          Unsupported field type: {fieldSchema.type}
        </Typography>
      );
  }
};

export default FieldRenderer;
