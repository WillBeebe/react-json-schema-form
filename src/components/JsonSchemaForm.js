import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useFormState } from '../hooks/useFormState';
import { useFormValidation } from '../hooks/useFormValidation';
import { pluginRegistry } from '../plugins/PluginRegistry';
import ErrorBoundary from './ErrorBoundary';
import FieldRenderer from './FieldRenderer';

const StyledForm = styled('form')(({ theme }) => ({
  '& .MuiFormControl-root': {
    marginBottom: theme.spacing(2),
  },
  '& .MuiInputLabel-root': {
    transition: 'all 0.2s',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)',
    },
  },
}));

const JsonSchemaForm = forwardRef(
  (
    {
      schema,
      initialData = {},
      onSubmit,
      onChange,
      onClose,
      customComponents = {},
      isLoading = false,
      plugins = [],
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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      severity: 'success',
    });
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

    // Register plugins
    useEffect(() => {
      plugins.forEach((plugin) => pluginRegistry.register(plugin));
      return () => {
        plugins.forEach((plugin) => pluginRegistry.unregister(plugin.name));
      };
    }, [plugins]);

    const defaultValues = useMemo(() => {
      const newFormData = { ...memoizedInitialData };
      if (memoizedSchema) {
        Object.entries(memoizedSchema.properties).forEach(
          ([key, fieldSchema]) => {
            if (
              fieldSchema.default !== undefined &&
              memoizedInitialData[key] === undefined
            ) {
              newFormData[key] = fieldSchema.default;
            }
            if (fieldSchema.type === 'array' && !newFormData[key]) {
              newFormData[key] = [];
            }
          }
        );
      }
      return newFormData;
    }, [memoizedSchema, memoizedInitialData]);

    useEffect(() => {
      setFormData(defaultValues);
      resetForm();
      setHasAttemptedSubmit(false);
    }, [defaultValues, setFormData, resetForm]);

    const handleSubmit = useCallback(
      async (e) => {
        if (e && e.preventDefault) {
          e.preventDefault();
        }
        setHasAttemptedSubmit(true);
        const validationResult = validateAllFields();
        if (validationResult.isValid) {
          setIsSubmitting(true);
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
          } finally {
            setIsSubmitting(false);
          }
        } else {
          setSnackbar({
            open: true,
            message: 'Please correct the errors in the form.',
            severity: 'error',
          });
        }
      },
      [formData, validateAllFields, onSubmit]
    );

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
      validate: validateAllFields,
      getData: () => formData,
    }));

    const memoizedHandleChange = useCallback(
      (name, value) => {
        handleChange(name, value);
        if (onChange) {
          onChange({ ...formData, [name]: value });
        }
        if (hasAttemptedSubmit) {
          validateSingleField(name, value);
        }
      },
      [
        handleChange,
        onChange,
        formData,
        hasAttemptedSubmit,
        validateSingleField,
      ]
    );

    return (
      <ErrorBoundary>
        <StyledForm onSubmit={(e) => e.preventDefault()}>
          <Stack spacing={2}>
            {memoizedSchema &&
              Object.entries(memoizedSchema.properties).map(
                ([key, fieldSchema]) => (
                  <FieldRenderer
                    key={key}
                    name={key}
                    schema={memoizedSchema}
                    fieldSchema={fieldSchema}
                    value={formData[key]}
                    error={hasAttemptedSubmit ? errors[key] : undefined}
                    touched={touched[key]}
                    onChange={memoizedHandleChange}
                    onBlur={handleBlur}
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
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading}
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
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </StyledForm>
      </ErrorBoundary>
    );
  }
);

export default React.memo(JsonSchemaForm);
