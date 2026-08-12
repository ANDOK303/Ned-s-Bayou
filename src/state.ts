import type { User, CartItem, View } from "./types";

export const state = {
  currentUser: null as User | null,
  cart: [] as CartItem[],
  view: "catalog" as View,
  error: "" as string,
};

export function isAdmin(): boolean {
  return state.currentUser?.role === "admin";
}

export function cartCount(): number {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}
