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
    name: "Suscripción Bronce",
    price: 50,
    image: "",
    stock: 200,
  },
  {
    id: 2,
    name: "Suscripción Plata",
    price: 120,
    image: "",
    stock: 80,
  },
  {
    id: 3,
    name: "Suscripción Oro",
    price: 250,
    image: "",
    stock: 30,
  },
  {
    id: 4,
    name: "Membresía VIP Backstage",
    price: 500,
    image: "",
    stock: 5,
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