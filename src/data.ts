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

export interface NewsItem {
  id: number;
  artist: string;
  headline: string;
  summary: string;
  image?: string; // ruta local en public/, para bandas del flyer
  youtubeUrl?: string; // si existe, la miniatura sale directo de YouTube
}

export const news: NewsItem[] = [
  {
    id: 1,
    artist: "Charlotte MacInnes",
    headline: "Estrena su primer EP 'Highwater'",
    summary:
      "La cantautora lleva cinco años puliendo su sonido y por fin deja que el público entre en su proceso creativo con este debut.",
  },
  {
    id: 2,
    artist: "LEMONSUCKR",
    headline: "El dúo de dance-punk lanza 'Life is a Heist'",
    summary:
      "Frontman Guy Ferris y el guitarrista Ollie Thomas hablan de shows con mucha energía y de mostrarse más vulnerables en las letras.",
  },
  {
    id: 3,
    artist: "Meli Foster-Turner",
    headline: "Debuta a los 17 años con 'unfinished conversations'",
    summary:
      "Seis canciones entre folk e indie que exploran el crecer: rupturas, amistad y autodescubrimiento, con un sencillo que ya suena como himno.",
  },
  {
    id: 4,
    artist: "Bory",
    headline: "Power-pop contagioso desde Portland",
    summary:
      "Recién firmado con el sello de sus colegas de Ducks Ltd., su álbum debut viene cargado de guitarras y ganchos memorables.",
  },
  {
    id: 5,
    artist: "Maddie Ashman",
    headline: "Explora ritmos microtonales en su nuevo sencillo doble",
    summary:
      "Tras una gira por Europa junto a King Gizzard and The Lizard Wizard, la multiinstrumentista sigue construyendo un sonido difícil de encasillar.",
  },
  {
    id: 6,
    artist: "half•alive",
    headline: "Estrena 'The Wolf', adelanto de su nuevo EP 'Billions'",
    summary:
      "El video viene con la coreografía característica de la banda y explora temas del mundo corporativo. El EP completo sale el 28 de agosto vía ARRO Records.",
    youtubeUrl: "https://www.youtube.com/watch?v=uRHIqSRb7YQ",
  },
  {
    id: 7,
    artist: "Vinotinto",
    headline: "Rock Night Music en Búho Cósmico",
    summary:
      "La banda se presenta en vivo este 4 de abril en Búho Cósmico Gastro & Bar, zona 4. Entrada por consumo.",
    image: "vinotinto.jpg",
  },
  {
    id: 8,
    artist: "Da Bom Garoto y Los Mal Portados",
    headline: "Comparten escenario con Los Simios del Mercado",
    summary:
      "Show en vivo el 5 de septiembre en La Guarida, zona 4. Preventa Q50, en taquilla Q75.",
    image: "malportados.jpg",
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

// ---------- MERCH (usa ids distintos a las suscripciones para no chocar en el carrito) ----------

export const merch: Product[] = [
  { id: 101, name: "Playera Bayou Tour", price: 120, image: "", stock: 40 },
  { id: 102, name: "Vinilo 'Highwater' Edición Limitada", price: 180, image: "", stock: 15 },
  { id: 103, name: "Gorra bordada NB", price: 90, image: "", stock: 25 },
  { id: 104, name: "Póster A2 firmado", price: 60, image: "", stock: 50 },
];

let nextMerchId = 105;
export function getNextMerchId(): number {
  return nextMerchId++;
}

// ---------- EVENTOS ----------

export interface EventItem {
  id: number;
  name: string;
  date: string;
  venue: string;
  images?: string[];
}

export const events: EventItem[] = [
  {
    id: 1,
    name: "Vinotinto: Rock Night Music",
    date: "4 abr 2026 · 8:00 PM",
    venue: "Búho Cósmico Gastro & Bar, Ruta 4 6-49 zona 4",
    images: ["vinotinto.jpg"],
  },
  {
    id: 2,
    name: "Da Bom Garoto y Los Mal Portados + Los Simios del Mercado",
    date: "5 sep 2026 · 7:00 PM",
    venue: "La Guarida, Zona 4",
    images: ["malportados.jpg", "malportados2.jpg"],
  },
  {
    id: 3,
    name: "Fiesta de la Música 2026 — El Atrio CFCE",
    date: "Por confirmar",
    venue: "El Atrio, CFCE",
    images: ["fiestamusica.jpg"],
  },
];

// ---------- INSCRIPCIONES: clases en línea, horarios, cursos ----------

export interface OnlineClass {
  id: number;
  name: string;
  instructor: string;
  modality: string;
}

export const onlineClasses: OnlineClass[] = [
  { id: 1, name: "Producción en BandLab desde cero", instructor: "DJ Marea", modality: "En vivo por videollamada" },
  { id: 2, name: "Mezcla y masterización básica", instructor: "Ing. Paola Ruiz", modality: "Grabado, acceso libre" },
  { id: 3, name: "Composición de letras", instructor: "Fer Cabrera", modality: "En vivo por videollamada" },
];

export interface ScheduleSlot {
  day: string;
  time: string;
  className: string;
}

export const schedule: ScheduleSlot[] = [
  { day: "Lunes", time: "6:00 PM - 7:30 PM", className: "Producción en BandLab" },
  { day: "Miércoles", time: "5:00 PM - 6:00 PM", className: "Composición de letras" },
  { day: "Sábado", time: "10:00 AM - 12:00 PM", className: "Mezcla y masterización" },
];

export interface Course {
  id: number;
  name: string;
  price: number;
  duration: string;
}

export const courses: Course[] = [
  { id: 1, name: "Curso intensivo de producción musical", price: 350, duration: "6 semanas" },
  { id: 2, name: "Curso de canto e interpretación", price: 280, duration: "8 semanas" },
  { id: 3, name: "Curso de industria musical y contratos", price: 200, duration: "4 semanas" },
];

// ---------- ARTISTAS Y BANDAS ----------

export interface Artist {
  id: number;
  name: string;
  genre: string;
  bio: string;
}

export const artists: Artist[] = [
  { id: 1, name: "Mareas Bajas", genre: "Indie folk", bio: "Trío guatemalteco que mezcla marimba con guitarras acústicas." },
  { id: 2, name: "Otto & los Ecos", genre: "Pop-ambient", bio: "Proyecto solista con paisajes sonoros psicodélicos." },
  { id: 3, name: "Cerámica Rota", genre: "Dance-punk", bio: "Banda emergente conocida por sus shows caóticos en vivo." },
  { id: 4, name: "Luna de Barro", genre: "Dream pop", bio: "Voz etérea sobre texturas electrónicas nocturnas." },
];

// ---------- DISQUERAS (sellos asociados) ----------

export interface LabelPartner {
  id: number;
  name: string;
  founded: number;
  focus: string;
}

export const labels: LabelPartner[] = [
  { id: 1, name: "Pantano Records", founded: 2019, focus: "Rock alternativo y garage" },
  { id: 2, name: "Marisco Discos", founded: 2021, focus: "Electrónica experimental" },
  { id: 3, name: "Raíz Sello", founded: 2016, focus: "Folk y raíces latinoamericanas" },
];

// ---------- CANCIONES DESTACADAS (links a YouTube) ----------

export interface MediaLink {
  id: number;
  title: string;
  url: string;
}

export const featuredSongs: MediaLink[] = [
  { id: 1, title: "Sencillo destacado 1", url: "https://youtu.be/euQFIVqn2JA" },
  { id: 2, title: "Sencillo destacado 2", url: "https://youtu.be/RiSRNN_RObg" },
  { id: 3, title: "Sencillo destacado 3", url: "https://youtu.be/qrfmW6SYhxQ" },
  { id: 4, title: "Sencillo destacado 4", url: "https://youtu.be/9PlJeN9fLnw" },
  { id: 5, title: "Sencillo destacado 5", url: "https://youtu.be/uzVWEr4_07M" },
  { id: 6, title: "Sencillo destacado 6", url: "https://youtu.be/PPI9li8HsWs" },
];

let nextLinkId = featuredSongs.length + 1;
export function getNextLinkId(): number {
  return nextLinkId++;
}

export interface Casting {
  id: number;
  role: string;
  requirements: string;
  deadline: string;
}

export const castings: Casting[] = [
  { id: 1, role: "Vocalista para banda de apertura", requirements: "Experiencia en vivo, disponibilidad fines de semana", deadline: "1 sep 2026" },
  { id: 2, role: "Bajista para sesión de grabación", requirements: "Lectura a primera vista, equipo propio", deadline: "15 sep 2026" },
  { id: 3, role: "Bailarines para video musical", requirements: "Experiencia en danza urbana", deadline: "20 sep 2026" },
];