export type Role = "admin" | "user";

export interface User {
  id: number;
  username: string;
  password: string; // demo: texto plano, no hay persistencia real
  role: Role;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export interface CartItem {
  productId: number;
  qty: number;
}

export type View = "login" | "register" | "catalog" | "cart" | "admin";
