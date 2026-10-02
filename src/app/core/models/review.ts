export interface ReviewRequest {
  rating: number;
  comment: string;
}

export interface Review {
  id: number;
  productId: number;
  productName: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}