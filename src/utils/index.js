// Import necessary utilities
import { validateField } from './validationUtils';

const handleBlur = (
  name,
  value,
  schema,
  setTouched,
  setErrors,
  setFormData,
  onBlur
) => {
  // Mark the field as touched
  // setTouched((prevTouched) => ({
  //   ...prevTouched,
  //   [name]: true,
  // }));

  // Validate the field
  const errorMessage = validateField(schema, name, value);

  // Update errors state
  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: errorMessage,
  }));

  // If there's no error, format the value if needed
  if (!errorMessage) {
    const formattedValue = formatFieldValue(schema, value);
    if (formattedValue !== value) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    }
  }

  // Call the onBlur prop if provided
  if (onBlur) {
    onBlur(name, value);
  }
};

// Helper function to format field value based on schema
const formatFieldValue = (schema, value) => {
  switch (schema.type) {
    case 'string':
      if (schema.format === 'email') {
        return value.trim().toLowerCase();
      }
      if (schema.format === 'uri') {
        return value.trim();
      }
      return value;
    case 'number':
    case 'integer':
      return parseFloat(value);
    default:
      return value;
  }
};

export { handleBlur };
