# Tienda Demo

Página de ventas interactiva, 100% frontend (TypeScript + Vite), **sin backend y sin base de datos**.

## ¿Qué hace y qué no hace?

- Tiene catálogo, carrito, login, registro y un panel de administrador con roles.
- Todo el estado (usuarios registrados, productos agregados, carrito, sesión) vive en variables de JavaScript en memoria.
- **Al recargar la página, cerrar la pestaña o volver a entrar, todo vuelve a su estado inicial.** No hay `localStorage`, ni cookies, ni servidor, ni pagos reales.

## Usuarios predeterminados

| Usuario | Contraseña | Rol   |
|---------|-----------|-------|
| admin   | admin123  | admin |
| user    | user123   | user  |

Cualquiera que se registre entra automáticamente como `user`. Solo hay un admin, el predeterminado.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre la URL que te muestre la terminal (normalmente http://localhost:5173).

## Build de producción

```bash
npm run build
npm run preview   # para probar el build localmente
```

## Desplegar en GitHub Pages

1. Sube este proyecto a un repositorio en GitHub.
2. Abre `vite.config.ts` y confirma que `base` coincida EXACTAMENTE con el nombre de tu repo (ej. si tu repo se llama `mi-tienda`, debe decir `base: "/mi-tienda/"`).
3. En tu repo, ve a **Settings → Pages → Build and deployment → Source** y selecciona **GitHub Actions**.
4. Haz push a la rama `main`. El workflow en `.github/workflows/deploy.yml` compila y publica solo.
5. Después del primer deploy (revisa la pestaña **Actions** del repo), tu página queda en:
   `https://TU-USUARIO.github.io/TU-REPO/`

## Estructura

```
src/
  types.ts     -> tipos (User, Product, CartItem, View)
  data.ts      -> usuarios y productos "semilla" (en memoria)
  state.ts     -> estado global (sesión actual, carrito, vista activa)
  main.ts      -> router simple + renderizado + eventos
  style.css    -> estilos
```
