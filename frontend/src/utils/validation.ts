export interface NewOrderForm {
  product: string;
  qty: string;
  price: string;
}

export interface FormErrors {
  product: string;
  qty: string;
  price: string;
}

export const validateOrderForm = (form: NewOrderForm): FormErrors => {
  const errors: FormErrors = { product: "", qty: "", price: "" };

  if (!form.product.trim()) {
    errors.product = "Product name is required";
  } else if (form.product.trim().length < 2) {
    errors.product = "Product name must be at least 2 characters";
  }

  if (!form.qty) {
    errors.qty = "Quantity is required";
  } else {
    const qty = parseInt(form.qty);
    if (isNaN(qty) || qty <= 0) {
      errors.qty = "Quantity must be a positive number";
    }
  }

  if (!form.price) {
    errors.price = "Price is required";
  } else {
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) {
      errors.price = "Price must be a positive number";
    }
  }

  return errors;
};
