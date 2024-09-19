import { useCallback, useState } from 'react';

export const useFormSubmission = (onSubmit, validateAllFields) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSubmit = useCallback(
    async (formData) => {
      setIsSubmitting(true);
      const validationResult = validateAllFields();
      if (validationResult.isValid) {
        try {
          if (typeof onSubmit !== 'function') {
            console.warn('onSubmit is not provided or is not a function');
            return true; // Return true to indicate successful validation
          }
          await onSubmit(formData);
          setSnackbar({
            open: true,
            message: 'Form submitted successfully!',
            severity: 'success',
          });
        } catch (error) {
          console.error('Form submission error:', error);
          setSnackbar({
            open: true,
            message: `Error submitting form: ${error.message}`,
            severity: 'error',
          });
          return false;
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Please correct the errors in the form.',
          severity: 'error',
        });
        return false;
      }
      setIsSubmitting(false);
      return true;
    },
    [onSubmit, validateAllFields]
  );

  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return {
    isSubmitting,
    snackbar,
    handleSubmit,
    closeSnackbar,
  };
};
