import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Create and configure Ajv instance
const ajv = new Ajv({ allErrors: true, useDefaults: true });
addFormats(ajv);

/**
 * Validate the entire form data against the schema
 * @param {Object} schema - The JSON schema
 * @param {Object} data - The form data
 * @returns {Object} - Validation result with isValid flag and errors object
 */
export const validateForm = (schema, data) => {
  const validate = ajv.compile(schema);
  const isValid = validate(data);

  if (!isValid) {
    const errors = validate.errors.reduce((acc, error) => {
      const path = error.instancePath.substring(1); // Remove leading slash
      acc[path] = error.message;
      return acc;
    }, {});
    return { isValid: false, errors };
  }

  return { isValid: true, errors: {} };
};

/**
 * Validate a single field
 * @param {Object} schema - The JSON schema
 * @param {string} name - The field name
 * @param {any} value - The field value
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (schema, name, value) => {
  const fieldSchema = {
    type: 'object',
    properties: {
      [name]: schema.properties[name],
    },
    required: schema.required && schema.required.includes(name) ? [name] : [],
  };

  const validate = ajv.compile(fieldSchema);
  const isValid = validate({ [name]: value });

  if (!isValid) {
    return validate.errors[0].message;
  }

  return null;
};

/**
 * Custom validators for specific use cases
 */
const customValidators = {
  /**
   * Validate email format
   * @param {string} email - The email to validate
   * @returns {string|null} - Error message or null if valid
   */
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : 'Invalid email format';
  },

  /**
   * Validate password strength
   * @param {string} password - The password to validate
   * @returns {string|null} - Error message or null if valid
   */
  passwordStrength: (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return null;
  },

  /**
   * Validate a URL
   * @param {string} url - The URL to validate
   * @returns {string|null} - Error message or null if valid
   */
  url: (url) => {
    try {
      new URL(url);
      return null;
    } catch {
      return 'Invalid URL format';
    }
  },
};

/**
 * Apply custom validation to a field
 * @param {string} name - The field name
 * @param {any} value - The field value
 * @param {Object} customValidation - Custom validation rules
 * @returns {string|null} - Error message or null if valid
 */
export const applyCustomValidation = (name, value, customValidation) => {
  if (customValidation && customValidation[name]) {
    const validator = customValidators[customValidation[name]];
    if (validator) {
      return validator(value);
    }
  }
  return null;
};

/**
 * Combine JSON Schema validation with custom validation
 * @param {Object} schema - The JSON schema
 * @param {string} name - The field name
 * @param {any} value - The field value
 * @param {Object} customValidation - Custom validation rules
 * @returns {string|null} - Error message or null if valid
 */
export const validateFieldWithCustom = (
  schema,
  name,
  value,
  customValidation
) => {
  const schemaError = validateField(schema, name, value);
  if (schemaError) return schemaError;

  const customError = applyCustomValidation(name, value, customValidation);
  if (customError) return customError;

  return null;
};
