import type { User, CartItem, View, InscripcionesTab } from "./types";

export const state = {
  currentUser: null as User | null,
  cart: [] as CartItem[],
  view: "home" as View,
  error: "" as string,
  theme: "light" as "light" | "dark",

  inscripcionesTab: "clases" as InscripcionesTab,
  enrolledClasses: [] as number[],
  enrolledCourses: [] as number[],
  rsvpEvents: [] as number[],
  appliedCastings: [] as number[],
  lightboxImage: null as string | null,
};

export function isAdmin(): boolean {
  return state.currentUser?.role === "admin";
}

export function cartCount(): number {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}