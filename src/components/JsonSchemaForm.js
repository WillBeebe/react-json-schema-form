import { Button, CircularProgress, Snackbar, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import { useFormState } from '../hooks/useFormState';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { useFormValidation } from '../hooks/useFormValidation';
import ErrorBoundary from './ErrorBoundary';
import FormField from './FormField';

const StyledForm = styled('form')(({ theme }) => ({
  '& .MuiFormControl-root': {
    marginBottom: theme.spacing(2),
  },
}));

const JsonSchemaForm = forwardRef(
  (
    {
      schema,
      initialData = {},
      onSubmit,
      onChange,
      customComponents = {},
      isLoading = false,
    },
    ref
  ) => {
    const memoizedSchema = useMemo(() => schema, [schema]);
    const memoizedInitialData = useMemo(() => initialData, [initialData]);

    const {
      formData,
      touched,
      handleChange,
      handleBlur,
      resetForm,
      setFormData,
    } = useFormState(memoizedInitialData, memoizedSchema);

    const { errors, isValid, validateAllFields, validateSingleField } =
      useFormValidation(memoizedSchema, formData, touched);

    const { isSubmitting, snackbar, handleSubmit, closeSnackbar } =
      useFormSubmission(onSubmit, validateAllFields);

    useEffect(() => {
      setFormData(memoizedInitialData);
      resetForm();
    }, [memoizedInitialData, setFormData, resetForm]);

    const memoizedHandleChange = useCallback(
      (name, value) => {
        handleChange(name, value);
        if (onChange) {
          onChange({ ...formData, [name]: value });
        }
        validateSingleField(name, value);
      },
      [handleChange, onChange, formData, validateSingleField]
    );

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(formData),
      validate: validateAllFields,
      getData: () => formData,
    }));

    return (
      <ErrorBoundary>
        <StyledForm onSubmit={(e) => e.preventDefault()}>
          <Stack spacing={2}>
            {memoizedSchema &&
              Object.entries(memoizedSchema.properties).map(
                ([key, fieldSchema]) => (
                  <FormField
                    key={key}
                    name={key}
                    schema={fieldSchema}
                    value={formData[key]}
                    onChange={memoizedHandleChange}
                    onBlur={handleBlur}
                    error={errors[key]}
                    touched={touched[key]}
                    customComponents={customComponents}
                  />
                )
              )}
          </Stack>
          {!ref && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => handleSubmit(formData)}
              disabled={isSubmitting || isLoading || !isValid}
              startIcon={
                isSubmitting || isLoading ? (
                  <CircularProgress size={20} />
                ) : null
              }
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          )}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={closeSnackbar}
            message={snackbar.message}
            severity={snackbar.severity}
          />
        </StyledForm>
      </ErrorBoundary>
    );
  }
);

export default React.memo(JsonSchemaForm);
