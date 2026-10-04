export type CartItem = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  sku: string;
  size: string | null;
  color: string | null;
  imageUrl: string | null;
  unitPriceMinor: number;
  currency: string;
  maxStock: number;
  quantity: number;
};

export type CartViewItem = CartItem & {
  lineTotalMinor: number;
};