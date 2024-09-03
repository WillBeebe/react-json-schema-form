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
          await onSubmit(formData);
          setSnackbar({
            open: true,
            message: 'Form submitted successfully!',
            severity: 'success',
          });
        } catch (error) {
          setSnackbar({
            open: true,
            message: 'Error submitting form. Please try again.',
            severity: 'error',
          });
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Please correct the errors in the form.',
          severity: 'error',
        });
      }
      setIsSubmitting(false);
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
