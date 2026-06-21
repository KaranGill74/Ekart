export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  role: UserRole;
  avatarUrl: string;
  password?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  description: string;
  imageUrl: string;
  images?: string[];
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export enum OrderStatus {
  PAID = "Paid",
  FAILED = "Failed",
  PENDING = "Pending",
}

export interface Order {
  id: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  paymentId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ActiveTab = "home" | "products" | "profile" | "dashboard" | "login";

export interface SalesHistoryPoint {
  date: string;
  amount: number;
}
