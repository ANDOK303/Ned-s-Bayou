export type Role = "admin" | "user";

export interface User {
  id: number;
  username: string;
  password: string; 
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

export type View =
  | "home"
  | "login"
  | "register"
  | "catalog"
  | "merch"
  | "eventos"
  | "inscripciones"
  | "artistas"
  | "disqueras"
  | "castings"
  | "cart"
  | "admin";

export type InscripcionesTab = "clases" | "horarios" | "cursos";