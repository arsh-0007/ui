// import { ProductCategory } from './product-category';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  imageUrl: string;
}

export type ProductCategory =
  | 'SEEDS'
  | 'PLANTS'
  | 'FERTILIZERS'
  | 'POTS'
  | 'TOOLS';

export interface ProductRequest {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  imageUrl: string;
}
