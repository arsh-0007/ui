export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  cartId: number;
  items: CartItem[];
  total: number;
}