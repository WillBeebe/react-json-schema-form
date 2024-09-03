// ErrorContext.js
import React, { createContext, useCallback, useContext, useState } from 'react';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState({});

  const addError = useCallback((field, message) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: message,
    }));
  }, []);

  const removeError = useCallback((field) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const setFieldErrors = useCallback((fieldErrors) => {
    setErrors(fieldErrors);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const value = {
    errors,
    addError,
    removeError,
    setFieldErrors,
    clearErrors,
  };

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};

export const useErrors = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrors must be used within an ErrorProvider');
  }
  return context;
};

// Usage example:
// import { ErrorProvider, useErrors } from './ErrorContext';

// // Wrap your form with the ErrorProvider
// const App = () => (
//   <ErrorProvider>
//     <JsonSchemaForm {...props} />
//   </ErrorProvider>
// );

// // Use errors in your components
// const FieldComponent = () => {
//   const { errors, addError, removeError } = useErrors();
//   // ...
// };
