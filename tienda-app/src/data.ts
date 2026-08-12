import type { User, Product } from "./types";

/**
 * TODO ESTO VIVE EN MEMORIA (variables de JS).
 * No hay localStorage, ni backend, ni base de datos.
 * Al recargar la página o cerrar la pestaña, todo vuelve a este estado inicial.
 */

export const users: User[] = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "user", password: "user123", role: "user" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Camiseta Kinal",
    price: 75,
    image: "https://placehold.co/300x300?text=Camiseta",
    stock: 20,
  },
  {
    id: 2,
    name: "Taza personalizada",
    price: 45,
    image: "https://placehold.co/300x300?text=Taza",
    stock: 15,
  },
  {
    id: 3,
    name: "Gorra bordada",
    price: 60,
    image: "https://placehold.co/300x300?text=Gorra",
    stock: 10,
  },
  {
    id: 4,
    name: "Sudadera",
    price: 150,
    image: "https://placehold.co/300x300?text=Sudadera",
    stock: 8,
  },
];

let nextUserId = users.length + 1;
export function getNextUserId(): number {
  return nextUserId++;
}

let nextProductId = products.length + 1;
export function getNextProductId(): number {
  return nextProductId++;
}
