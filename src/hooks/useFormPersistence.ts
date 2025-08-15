import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { STORAGE_KEY } from '../constants/survey';

export const useFormPersistence = (form: UseFormReturn, formValues: any) => {
  const { reset } = form;

  // Restore saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        reset(JSON.parse(savedData));
      } catch (err) {
        console.error("Error parsing saved form data", err);
      }
    }
  }, [reset]);

  // Auto-save on form changes
  useEffect(() => {
    if (Object.keys(formValues).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
    }
  }, [formValues]);

  const clearSavedData = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return { clearSavedData };
};
