export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  disabled: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  banner: string;
  disabled: boolean;
  category_id: string;
  category?: Category;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  amount: number;
  status: "DRAFT" | "PRODUCTION" | "DELIVERED";
  product: Product;
}

export interface Order {
  id: string;
  table: number;
  name: string | null;
  draft: boolean;
  status: boolean;
  createdAt: string;
  user?: { name: string };
  items: OrderItem[];
}
