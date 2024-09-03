import { useCallback, useState } from 'react';

export const useFormState = (initialData, schema) => {
  const [formData, setFormData] = useState(initialData);
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
    setFormData(initialData);
    setTouched({});
  }, [initialData]);

  return {
    formData,
    touched,
    handleChange,
    handleBlur,
    resetForm,
    setFormData,
  };
};
