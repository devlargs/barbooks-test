export const formatCurrency = (amount: number): string =>
  `$${amount.toFixed(2)}`;
export const formatNumber = (num: number): string => num.toLocaleString();
