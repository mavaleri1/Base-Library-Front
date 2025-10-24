import { useState, useCallback } from 'react';

type FormErrors<T> = Partial<Record<keyof T, string>>;

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => FormErrors<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name] && validate) {
      const newValues = { ...values, [name]: value };
      const validationErrors = validate(newValues);
      setErrors(validationErrors);
    }
  }, [values, touched, validate]);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  }, [values, validate]);

  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void>
  ) => {
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}

