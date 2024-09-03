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
  useRef,
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
    },
    ref
  ) => {
    const { t } = useI18n();
    const formTheme = useMemo(() => createTheme(theme), [theme]);
    const memoizedSchema = useMemo(() => schema, [schema]);
    const memoizedInitialData = useMemo(() => initialData, [initialData]);
    const initialDataRef = useRef(memoizedInitialData);

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

    const memoizedHandleSubmit = useCallback(
      () => handleSubmit(formData),
      [handleSubmit, formData]
    );

    useEffect(() => {
      if (JSON.stringify(formData) !== JSON.stringify(initialDataRef.current)) {
        setFormData(initialDataRef.current);
        resetForm();
      }
      initialDataRef.current = memoizedInitialData;
    }, [memoizedInitialData, formData, setFormData, resetForm]);

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
      () =>
        useMemo(
          () => ({
            submit: () => handleSubmit(formData),
            validate: validateAllFields,
            getData: () => formData,
            reset: resetForm,
          }),
          [handleSubmit, formData, validateAllFields, resetForm]
        ),
      [handleSubmit, formData, validateAllFields, resetForm]
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

    return (
      <ErrorBoundary>
        <ThemeProvider theme={formTheme}>
          <StyledForm onSubmit={(e) => e.preventDefault()}>
            <Stack spacing={2}>{renderFields()}</Stack>
            {!ref && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={memoizedHandleSubmit}
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
