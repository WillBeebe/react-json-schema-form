import {
  Button,
  CircularProgress,
  Snackbar,
  Stack,
  ThemeProvider,
  createTheme,
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
import { useI18n } from '../context/I18nContext';
import { useFormState } from '../hooks/useFormState';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { useFormValidation } from '../hooks/useFormValidation';
import ErrorBoundary from './ErrorBoundary';
import FormField from './FormField';

const StyledForm = styled('form')(({ theme }) => ({
  '& .MuiFormControl-root': {
    marginBottom: theme.spacing(2),
  },
  '& .MuiInputBase-root': {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
  },
}));

const JsonSchemaForm = forwardRef(
  (
    {
      schema,
      uiSchema = {},
      initialData = {},
      onSubmit,
      onChange,
      customComponents = {},
      customValidators = {},
      isLoading = false,
      theme = {},
      locale = 'en',
      hideSubmitButton = false,
    },
    ref
  ) => {
    const { t } = useI18n();
    const formTheme = useMemo(() => createTheme(theme), [theme]);
    const memoizedSchema = useMemo(() => schema, [schema]);
    const memoizedInitialData = useMemo(() => initialData, [initialData]);
    const [isInitialized, setIsInitialized] = useState(false);

    const {
      formData,
      touched,
      handleChange,
      handleBlur,
      resetForm,
      setFormData,
    } = useFormState(memoizedInitialData, memoizedSchema);

    const { errors, isValid, validateAllFields, validateSingleField } =
      useFormValidation(memoizedSchema, formData, touched, customValidators);

    const { isSubmitting, snackbar, handleSubmit, closeSnackbar } =
      useFormSubmission(onSubmit, validateAllFields);

    useEffect(() => {
      if (!isInitialized) {
        setIsInitialized(true);
      }
    }, []);

    const memoizedHandleSubmit = useCallback(async () => {
      const validationResult = validateAllFields();
      if (validationResult.isValid) {
        return handleSubmit(formData);
      }
      return false;
    }, [handleSubmit, formData, validateAllFields]);

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

    useImperativeHandle(
      ref,
      () => ({
        submit: memoizedHandleSubmit,
        validate: validateAllFields,
        getData: () => formData,
        reset: resetForm,
      }),
      [memoizedHandleSubmit, validateAllFields, formData, resetForm]
    );

    const renderFields = useCallback(
      () =>
        memoizedSchema &&
        Object.entries(memoizedSchema.properties).map(([key, fieldSchema]) => (
          <FormField
            key={key}
            name={key}
            schema={fieldSchema}
            uiSchema={uiSchema[key] || {}}
            value={formData[key]}
            onChange={memoizedHandleChange}
            onBlur={handleBlur}
            error={errors[key]}
            touched={touched[key]}
            customComponents={customComponents}
          />
        )),
      [
        memoizedSchema,
        uiSchema,
        formData,
        memoizedHandleChange,
        handleBlur,
        errors,
        touched,
        customComponents,
      ]
    );

    const handleFormSubmit = useCallback(
      (event) => {
        event.preventDefault();
        return memoizedHandleSubmit();
      },
      [memoizedHandleSubmit]
    );

    if (!isInitialized) {
      return null;
    }

    return (
      <ErrorBoundary>
        <ThemeProvider theme={formTheme}>
          <StyledForm onSubmit={handleFormSubmit}>
            <Stack spacing={2}>{renderFields()}</Stack>
            {!hideSubmitButton && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || isLoading || !isValid}
                startIcon={
                  isSubmitting || isLoading ? (
                    <CircularProgress size={20} />
                  ) : null
                }
                aria-busy={isSubmitting || isLoading}
              >
                {isSubmitting ? t('submitting') : t('submit')}
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
        </ThemeProvider>
      </ErrorBoundary>
    );
  }
);

export default React.memo(JsonSchemaForm);
