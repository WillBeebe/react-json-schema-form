import { useCallback, useEffect, useState } from 'react';
import { validateField, validateForm } from '../utils/validationUtils';

export const useFormValidation = (schema, formData, touched) => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(true);

  const validateAllFields = useCallback(() => {
    const result = validateForm(schema, formData);
    setErrors(result.errors);
    setIsValid(result.isValid);
    return result;
  }, [schema, formData]);

  const validateSingleField = useCallback(
    (name, value) => {
      const fieldError = validateField(schema, name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: fieldError,
      }));
    },
    [schema]
  );

  useEffect(() => {
    // Validate touched fields
    Object.keys(touched).forEach((fieldName) => {
      if (touched[fieldName]) {
        validateSingleField(fieldName, formData[fieldName]);
      }
    });
  }, [formData, touched, validateSingleField]);

  return {
    errors,
    isValid,
    validateAllFields,
    validateSingleField,
  };
};
