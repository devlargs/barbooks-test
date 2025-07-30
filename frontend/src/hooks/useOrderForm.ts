import { useState, useCallback } from "react";
import type { NewOrderForm, FormErrors } from "../utils/validation";
import { validateOrderForm } from "../utils/validation";

export const useOrderForm = () => {
  const [form, setForm] = useState<NewOrderForm>({
    product: "",
    qty: "",
    price: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    product: "",
    qty: "",
    price: "",
  });

  const updateField = useCallback(
    (field: keyof NewOrderForm, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const validate = useCallback(() => {
    const validationErrors = validateOrderForm(form);
    setErrors(validationErrors);
    return !Object.values(validationErrors).some((error) => error);
  }, [form]);

  const reset = useCallback(() => {
    setForm({ product: "", qty: "", price: "" });
    setErrors({ product: "", qty: "", price: "" });
  }, []);

  const getOrderData = useCallback(
    () => ({
      product: form.product.trim(),
      qty: parseInt(form.qty),
      price: parseFloat(form.price),
    }),
    [form]
  );

  return {
    form,
    errors,
    updateField,
    validate,
    reset,
    getOrderData,
  };
};
