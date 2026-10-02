export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  orderId: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}