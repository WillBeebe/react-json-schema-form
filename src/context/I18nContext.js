import React, { createContext, useCallback, useContext, useState } from 'react';

// Default translations
const defaultTranslations = {
  en: {
    submit: 'Submit',
    submitting: 'Submitting...',
    required: 'This field is required',
    invalid: 'This field is invalid',
    min: 'Minimum value is {{min}}',
    max: 'Maximum value is {{max}}',
    minLength: 'Minimum length is {{minLength}} characters',
    maxLength: 'Maximum length is {{maxLength}} characters',
    pattern: 'This field does not match the required pattern',
    // Add more default translations as needed
  },
  // Add more languages as needed
};

const I18nContext = createContext();

export const I18nProvider = ({
  children,
  locale = 'en',
  customTranslations = {},
}) => {
  const [currentLocale, setCurrentLocale] = useState(locale);

  const translations = {
    ...defaultTranslations,
    ...customTranslations,
  };

  const t = useCallback(
    (key, params = {}) => {
      const translation = translations[currentLocale]?.[key] || key;
      return translation.replace(
        /{{(\w+)}}/g,
        (_, param) => params[param] || ''
      );
    },
    [currentLocale]
  );

  const changeLocale = useCallback((newLocale) => {
    if (translations[newLocale]) {
      setCurrentLocale(newLocale);
    } else {
      console.warn(`Locale '${newLocale}' is not available.`);
    }
  }, []);

  const value = {
    locale: currentLocale,
    t,
    changeLocale,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Helper function to add custom translations
export const addTranslations = (newTranslations) => {
  Object.keys(newTranslations).forEach((locale) => {
    if (!defaultTranslations[locale]) {
      defaultTranslations[locale] = {};
    }
    Object.assign(defaultTranslations[locale], newTranslations[locale]);
  });
};
