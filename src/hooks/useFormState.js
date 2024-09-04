import { useCallback, useMemo, useState } from 'react';

const getDefaultValues = (schema) => {
  const defaultValues = {};
  Object.entries(schema.properties).forEach(([key, value]) => {
    if ('default' in value) {
      defaultValues[key] = value.default;
    } else if (value.type === 'object') {
      defaultValues[key] = getDefaultValues(value);
    }
  });
  return defaultValues;
};

export const useFormState = (initialData, schema) => {
  const defaultValues = useMemo(() => getDefaultValues(schema), [schema]);
  const [formData, setFormData] = useState({
    ...defaultValues,
    ...initialData,
  });
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleBlur = useCallback((name) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ ...defaultValues, ...initialData });
    setTouched({});
  }, [initialData, defaultValues]);

  return {
    formData,
    touched,
    handleChange,
    handleBlur,
    resetForm,
    setFormData,
  };
};
