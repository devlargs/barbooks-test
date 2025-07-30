export type Order = {
  id: number;
  product: string;
  qty: number;
  price: number;
};

export type Summary = {
  totalRevenue: number;
  medianOrderPrice: number;
  topProductByQty: string;
  uniqueProductCount: number;
};
