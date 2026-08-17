import "./style.css";
import {
  users,
  products,
  merch,
  news,
  events,
  onlineClasses,
  schedule,
  courses,
  artists,
  labels,
  castings,
  featuredSongs,
  getNextUserId,
  getNextProductId,
  getNextLinkId,
} from "./data";
import { state, isAdmin, cartCount } from "./state";
import type { Product } from "./types";

const app = document.querySelector<HTMLDivElement>("#app")!;

function goTo(view: typeof state.view) {
  state.error = "";
  state.view = view;
  render();
}

function findCatalogItem(id: number): Product | undefined {
  return products.find((p) => p.id === id) ?? merch.find((m) => m.id === id);
}

function extractYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch {
    return null;
  }
  return null;
}

function renderFeaturedSongs(): string {
  const cards = featuredSongs
    .map((song) => {
      const videoId = extractYoutubeId(song.url);
      const thumb = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
      return `
        <a class="song-card" href="${song.url}" target="_blank" rel="noopener noreferrer">
          ${thumb ? `<img src="${thumb}" alt="${song.title}" />` : ""}
          <span>${song.title}</span>
        </a>
      `;
    })
    .join("");

  return `
    <h3 class="section-subtitle">Canciones destacadas</h3>
    <div class="song-grid">${cards}</div>
  `;
}

// ---------- ICONOS (SVG en línea, sin dependencias externas) ----------

const ICON_INSTAGRAM = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.3-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.3 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4zm0 1.8a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8zm5.5-2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg>`;

const ICON_YOUTUBE = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.5v-7l6.2 3.5-6.2 3.5z"/></svg>`;

const ICON_X = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M18.9 3H22l-7.6 8.7L23 21h-7.2l-5.1-6.5L4.8 21H1.6l8.1-9.3L1 3h7.4l4.6 6 5.9-6zm-1.3 16h1.9L7.5 4.9H5.5L17.6 19z"/></svg>`;

const ICON_SUN = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></svg>`;

const ICON_MOON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20.7 14.9A8.5 8.5 0 1 1 9.1 3.3a7 7 0 0 0 11.6 11.6z"/></svg>`;

// ---------- TOPBAR ----------

function renderTopbar(): string {
  const authButtons = state.currentUser
    ? ""
    : `
      <button data-nav="login" class="nav-link ${state.view === "login" ? "active" : ""}">Login</button>
      <button data-nav="register" class="nav-link ${state.view === "register" ? "active" : ""}">Registrarse</button>
    `;

  return `
    <nav class="topbar">
      <div class="brand"><img src="${import.meta.env.BASE_URL}${state.theme === "dark" ? "logo-dark.png" : "logo.png"}" alt="Ned's Bayou" class="brand-logo" /></div>
      <div class="topbar-right">${authButtons}</div>
    </nav>
  `;
}

// ---------- SIDEBAR (fija, siempre visible) ----------

function renderSidebar(): string {
  const links = [
    `<button data-nav="home" class="sidebar-link ${state.view === "home" ? "active" : ""}">Inicio</button>`,
    `<button data-nav="eventos" class="sidebar-link ${state.view === "eventos" ? "active" : ""}">Eventos</button>`,
    `<button data-nav="inscripciones" class="sidebar-link ${state.view === "inscripciones" ? "active" : ""}">Inscripciones</button>`,
    `<button data-nav="catalog" class="sidebar-link ${state.view === "catalog" ? "active" : ""}">Suscripciones</button>`,
    `<button data-nav="merch" class="sidebar-link ${state.view === "merch" ? "active" : ""}">Merch</button>`,
    `<button data-nav="artistas" class="sidebar-link ${state.view === "artistas" ? "active" : ""}">Artistas y Bandas</button>`,
    `<button data-nav="disqueras" class="sidebar-link ${state.view === "disqueras" ? "active" : ""}">Disqueras</button>`,
    `<button data-nav="castings" class="sidebar-link ${state.view === "castings" ? "active" : ""}">Castings</button>`,
  ];

  if (state.currentUser) {
    links.push(
      `<button data-nav="cart" class="sidebar-link ${state.view === "cart" ? "active" : ""}">Carrito (${cartCount()})</button>`
    );
    if (isAdmin()) {
      links.push(
        `<button data-nav="admin" class="sidebar-link ${state.view === "admin" ? "active" : ""}">Admin</button>`
      );
    }
  }

  const userBlock = state.currentUser
    ? `
      <div class="sidebar-user">👤 ${state.currentUser.username}<br /><span>${state.currentUser.role}</span></div>
      <button data-action="logout" class="sidebar-link sidebar-logout">Cerrar sesión</button>
    `
    : "";

  return `
    <aside class="sidebar">
      <nav class="sidebar-links">${links.join("")}</nav>
      ${userBlock}
      <div class="sidebar-placeholder">+ Más próximamente</div>
      <button id="theme-toggle" class="sidebar-theme-toggle" aria-label="Cambiar modo claro/oscuro">
        ${state.theme === "light" ? ICON_MOON : ICON_SUN}
      </button>
    </aside>
  `;
}

// ---------- INICIO (noticias) ----------

function renderHome(): string {
  const cards = news
    .map(
      (n) => `
      <article class="news-card">
        <span class="news-artist">${n.artist}</span>
        <h3>${n.headline}</h3>
        <p>${n.summary}</p>
      </article>
    `
    )
    .join("");

  return `
    <h2>Novedades de la escena</h2>
    <p class="hint" style="margin-top:-8px;">Lo que están haciendo artistas independientes ahora mismo.</p>
    <div class="news-grid">${cards}</div>
    ${renderFeaturedSongs()}
  `;
}

// ---------- EVENTOS ----------

function renderEventos(): string {
  const rows = events
    .map((ev) => {
      const reserved = state.rsvpEvents.includes(ev.id);
      const flyers = (ev.images ?? [])
        .map(
          (img) =>
            `<img class="event-flyer" src="${import.meta.env.BASE_URL}${img}" alt="${ev.name}" data-lightbox="${import.meta.env.BASE_URL}${img}" />`
        )
        .join("");
      return `
        <div class="list-row event-row">
          ${flyers ? `<div class="event-flyers">${flyers}</div>` : ""}
          <div class="list-info">
            <h3>${ev.name}</h3>
            <p class="list-sub">${ev.date} · ${ev.venue}</p>
          </div>
          ${
            state.currentUser
              ? `<button class="list-action" data-rsvp="${ev.id}" ${reserved ? "disabled" : ""}>
                  ${reserved ? "¡Reservado!" : "Reservar lugar"}
                </button>`
              : `<span class="hint">Inicia sesión</span>`
          }
        </div>
      `;
    })
    .join("");

  return `
    <h2>Eventos</h2>
    <div class="list-block">${rows}</div>
    ${renderFeaturedSongs()}
  `;
}

// ---------- INSCRIPCIONES (clases en línea / horarios / cursos) ----------

function renderInscripciones(): string {
  const tabs = `
    <div class="tabs">
      <button class="tab-btn ${state.inscripcionesTab === "clases" ? "active" : ""}" data-tab="clases">Clases en línea</button>
      <button class="tab-btn ${state.inscripcionesTab === "horarios" ? "active" : ""}" data-tab="horarios">Horarios</button>
      <button class="tab-btn ${state.inscripcionesTab === "cursos" ? "active" : ""}" data-tab="cursos">Cursos</button>
    </div>
  `;

  let body = "";

  if (state.inscripcionesTab === "clases") {
    body = onlineClasses
      .map((c) => {
        const enrolled = state.enrolledClasses.includes(c.id);
        return `
          <div class="list-row">
            <div class="list-info">
              <h3>${c.name}</h3>
              <p class="list-sub">${c.instructor} · ${c.modality}</p>
            </div>
            ${
              state.currentUser
                ? `<button class="list-action" data-enroll-class="${c.id}" ${enrolled ? "disabled" : ""}>
                    ${enrolled ? "Inscrito" : "Inscribirme"}
                  </button>`
                : `<span class="hint">Inicia sesión</span>`
            }
          </div>
        `;
      })
      .join("");
    body = `<div class="list-block">${body}</div>`;
  } else if (state.inscripcionesTab === "horarios") {
    const rows = schedule
      .map((s) => `<tr><td>${s.day}</td><td>${s.time}</td><td>${s.className}</td></tr>`)
      .join("");
    body = `
      <table class="cart-table">
        <thead><tr><th>Día</th><th>Horario</th><th>Clase</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  } else {
    body = courses
      .map((c) => {
        const enrolled = state.enrolledCourses.includes(c.id);
        return `
          <div class="list-row">
            <div class="list-info">
              <h3>${c.name}</h3>
              <p class="list-sub">${c.duration} · Q${c.price.toFixed(2)}</p>
            </div>
            ${
              state.currentUser
                ? `<button class="list-action" data-enroll-course="${c.id}" ${enrolled ? "disabled" : ""}>
                    ${enrolled ? "Inscrito" : "Inscribirme"}
                  </button>`
                : `<span class="hint">Inicia sesión</span>`
            }
          </div>
        `;
      })
      .join("");
    body = `<div class="list-block">${body}</div>`;
  }

  return `
    <h2>Inscripciones</h2>
    ${tabs}
    ${body}
  `;
}

// ---------- ARTISTAS Y BANDAS ----------

function renderArtistas(): string {
  const cards = artists
    .map(
      (a) => `
      <article class="entity-card">
        <span class="entity-tag">${a.genre}</span>
        <h3>${a.name}</h3>
        <p>${a.bio}</p>
      </article>
    `
    )
    .join("");

  return `<h2>Artistas y Bandas</h2><div class="news-grid">${cards}</div>`;
}

// ---------- DISQUERAS ----------

function renderDisqueras(): string {
  const cards = labels
    .map(
      (l) => `
      <article class="entity-card">
        <span class="entity-tag">Desde ${l.founded}</span>
        <h3>${l.name}</h3>
        <p>${l.focus}</p>
      </article>
    `
    )
    .join("");

  return `<h2>Disqueras asociadas</h2><div class="news-grid">${cards}</div>`;
}

// ---------- CASTINGS ----------

function renderCastings(): string {
  const rows = castings
    .map((c) => {
      const applied = state.appliedCastings.includes(c.id);
      return `
        <div class="list-row">
          <div class="list-info">
            <h3>${c.role}</h3>
            <p class="list-sub">${c.requirements}</p>
            <p class="list-sub">Cierra: ${c.deadline}</p>
          </div>
          ${
            state.currentUser
              ? `<button class="list-action" data-apply-casting="${c.id}" ${applied ? "disabled" : ""}>
                  ${applied ? "¡Aplicado!" : "Aplicar"}
                </button>`
              : `<span class="hint">Inicia sesión</span>`
          }
        </div>
      `;
    })
    .join("");

  return `
    <h2>Castings abiertos</h2>
    <div class="list-block">${rows}</div>
  `;
}

// ---------- MERCH ----------

function renderMerch(): string {
  const rows = merch
    .map(
      (m, i) => `
      <div class="sub-row">
        <span class="sub-code">MC-0${i + 1}</span>
        <div class="sub-info">
          <h3>${m.name}</h3>
          <p class="sub-price">Q${m.price.toFixed(2)}</p>
        </div>
        <span class="sub-cupos">${m.stock} en stock</span>
        ${
          state.currentUser
            ? `<button class="sub-stamp" data-add-cart="${m.id}" ${m.stock === 0 ? "disabled" : ""}>
                ${m.stock === 0 ? "Agotado" : "Agregar al carrito"}
              </button>`
            : `<span class="hint sub-hint">Inicia sesión</span>`
        }
      </div>
    `
    )
    .join("");

  return `
    <h2>Merch</h2>
    <div class="sub-list">${rows}</div>
  `;
}

// ---------- LOGIN ----------

function renderLogin(): string {
  return `
    <div class="auth-box">
      <h2>Iniciar sesión</h2>
      ${state.error ? `<p class="error">${state.error}</p>` : ""}
      <form id="login-form">
        <label>Usuario</label>
        <input name="username" type="text" required autocomplete="off" />
        <label>Contraseña</label>
        <input name="password" type="password" required />
        <button type="submit">Entrar</button>
      </form>
      <p class="hint">Prueba: admin / admin123 o user / user123</p>
    </div>
  `;
}

// ---------- REGISTER ----------

function renderRegister(): string {
  return `
    <div class="auth-box">
      <h2>Crear cuenta</h2>
      ${state.error ? `<p class="error">${state.error}</p>` : ""}
      <form id="register-form">
        <label>Usuario</label>
        <input name="username" type="text" required autocomplete="off" />
        <label>Contraseña</label>
        <input name="password" type="password" required minlength="4" />
        <button type="submit">Registrarme</button>
      </form>
      <p class="hint">Los usuarios nuevos siempre entran como "user". Solo existe un admin predeterminado.</p>
    </div>
  `;
}

// ---------- CATÁLOGO (suscripciones) ----------

function renderCatalog(): string {
  const rows = products
    .map(
      (p, i) => `
      <div class="sub-row">
        <span class="sub-code">NB-0${i + 1}</span>
        <div class="sub-info">
          <h3>${p.name}</h3>
          <p class="sub-price">Q${p.price.toFixed(2)}<span class="sub-per">/mes</span></p>
        </div>
        <span class="sub-cupos">${p.stock} cupos</span>
        ${
          state.currentUser
            ? `<button class="sub-stamp" data-add-cart="${p.id}" ${p.stock === 0 ? "disabled" : ""}>
                ${p.stock === 0 ? "Cupos llenos" : "Suscribirse"}
              </button>`
            : `<span class="hint sub-hint">Inicia sesión</span>`
        }
      </div>
    `
    )
    .join("");

  return `
    <h2>Suscripciones</h2>
    <div class="sub-list">${rows}</div>
  `;
}

// ---------- CARRITO ----------

function renderCart(): string {
  if (state.cart.length === 0) {
    return `<h2>Tu carrito</h2><p>Está vacío. Ve a Suscripciones y agrega algo.</p>`;
  }

  let total = 0;
  const rows = state.cart
    .map((item) => {
      const product = findCatalogItem(item.productId);
      if (!product) return "";
      const subtotal = product.price * item.qty;
      total += subtotal;
      return `
        <tr>
          <td>${product.name}</td>
          <td>Q${product.price.toFixed(2)}</td>
          <td>
            <button data-cart-dec="${product.id}">-</button>
            ${item.qty}
            <button data-cart-inc="${product.id}">+</button>
          </td>
          <td>Q${subtotal.toFixed(2)}</td>
          <td><button data-cart-remove="${product.id}">Quitar</button></td>
        </tr>
      `;
    })
    .join("");

  return `
    <h2>Tu carrito</h2>
    <table class="cart-table">
      <thead><tr><th>Suscripción</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="total">Total: Q${total.toFixed(2)}</p>
    <button id="checkout-btn">Finalizar pedido (demo)</button>
    <p class="hint">Esto es una demo: no se procesa ningún pago real ni se guarda el pedido.</p>
  `;
}

// ---------- ADMIN ----------

function renderAdmin(): string {
  const productRows = products
    .map(
      (p) => `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>Q${p.price.toFixed(2)}</td>
        <td>${p.stock}</td>
        <td><button data-remove-product="${p.id}">Eliminar</button></td>
      </tr>
    `
    )
    .join("");

  const userRows = users
    .map(
      (u) => `
      <tr>
        <td>${u.id}</td>
        <td>${u.username}</td>
        <td>${u.role}</td>
      </tr>
    `
    )
    .join("");

  const linkRows = featuredSongs
    .map(
      (s) => `
      <tr>
        <td>${s.id}</td>
        <td>${s.title}</td>
        <td><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.url}</a></td>
        <td><button data-remove-link="${s.id}">Eliminar</button></td>
      </tr>
    `
    )
    .join("");

  return `
    <h2>Panel de administración</h2>

    <h3>Agregar suscripción</h3>
    <form id="product-form" class="inline-form">
      <input name="name" placeholder="Nombre de la suscripción" required />
      <input name="price" type="number" step="0.01" placeholder="Precio" required />
      <input name="stock" type="number" placeholder="Cupos disponibles" required />
      <button type="submit">Agregar</button>
    </form>

    <h3>Suscripciones</h3>
    <table class="admin-table">
      <thead><tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Cupos</th><th></th></tr></thead>
      <tbody>${productRows}</tbody>
    </table>

    <h3>Usuarios registrados (en memoria)</h3>
    <table class="admin-table">
      <thead><tr><th>ID</th><th>Usuario</th><th>Rol</th></tr></thead>
      <tbody>${userRows}</tbody>
    </table>

    <h3>Agregar canción / link de YouTube</h3>
    <form id="link-form" class="inline-form">
      <input name="title" placeholder="Título de la canción" required />
      <input name="url" type="url" placeholder="https://youtu.be/..." required />
      <button type="submit">Agregar</button>
    </form>

    <h3>Canciones destacadas</h3>
    <table class="admin-table">
      <thead><tr><th>ID</th><th>Título</th><th>Link</th><th></th></tr></thead>
      <tbody>${linkRows}</tbody>
    </table>
  `;
}

// ---------- FOOTER (decorativo, solo en Inicio y Suscripciones) ----------

function renderFooter(): string {
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">NED'S BAYOU</div>
        <div class="footer-links">
          <a href="#" onclick="return false" class="footer-rating">★★★★★ Calificanos</a>
        </div>
        <div class="footer-social">
          <a href="https://www.instagram.com/amigosgt.of?igsh=MXFsbDR0bmNndjl6ag==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${ICON_INSTAGRAM}</a>
          <a href="https://youtube.com/@genesisgonzalez8732?si=MJauvL7bzRjwQJB1" target="_blank" rel="noopener noreferrer" aria-label="YouTube">${ICON_YOUTUBE}</a>
          <a href="https://x.com/dorcass_xd" target="_blank" rel="noopener noreferrer" aria-label="X">${ICON_X}</a>
        </div>
        <div class="footer-contact">
          <span>+502 4417-8823</span>
          <span>contacto@nedsbayou.com</span>
        </div>
      </div>
      <p class="footer-copy">© ${new Date().getFullYear()} Ned's Bayou Records. Todos los derechos reservados.</p>
    </footer>
  `;
}

// ---------- LIGHTBOX (agrandar imágenes) ----------

function renderLightbox(): string {
  if (!state.lightboxImage) return "";
  return `
    <div class="lightbox" id="lightbox">
      <img src="${state.lightboxImage}" alt="Vista ampliada" />
    </div>
  `;
}

// ---------- RENDER PRINCIPAL ----------

function renderView(): string {
  switch (state.view) {
    case "login":
      return renderLogin();
    case "register":
      return renderRegister();
    case "cart":
      return state.currentUser ? renderCart() : renderLogin();
    case "admin":
      return isAdmin() ? renderAdmin() : renderCatalog();
    case "catalog":
      return renderCatalog();
    case "merch":
      return renderMerch();
    case "eventos":
      return renderEventos();
    case "inscripciones":
      return renderInscripciones();
    case "artistas":
      return renderArtistas();
    case "disqueras":
      return renderDisqueras();
    case "castings":
      return renderCastings();
    case "home":
    default:
      return renderHome();
  }
}

function render() {
  document.body.classList.toggle("theme-dark", state.theme === "dark");
  const hiddenFooterViews: (typeof state.view)[] = ["login", "register", "cart", "admin"];
  const showFooter = !hiddenFooterViews.includes(state.view);
  app.innerHTML = `
    ${renderTopbar()}
    <div class="layout">
      ${renderSidebar()}
      <main class="content">${renderView()}</main>
    </div>
    ${showFooter ? renderFooter() : ""}
    ${renderLightbox()}
  `;
  attachEvents();
}

// ---------- EVENTOS ----------

function attachEvents() {
  // Abrir imagen en lightbox
  app.querySelectorAll<HTMLImageElement>("[data-lightbox]").forEach((img) => {
    img.addEventListener("click", () => {
      state.lightboxImage = img.dataset.lightbox ?? null;
      render();
    });
  });

  // Cerrar lightbox (clic en cualquier parte del overlay)
  app.querySelector("#lightbox")?.addEventListener("click", () => {
    state.lightboxImage = null;
    render();
  });

  // Cambiar tema claro/oscuro
  app.querySelector("#theme-toggle")?.addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    render();
  });

  // Tabs de Inscripciones
  app.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.inscripcionesTab = btn.dataset.tab as typeof state.inscripcionesTab;
      render();
    });
  });

  // Inscribirse a clase en línea
  app.querySelectorAll<HTMLButtonElement>("[data-enroll-class]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.enrollClass);
      if (!state.enrolledClasses.includes(id)) state.enrolledClasses.push(id);
      render();
    });
  });

  // Inscribirse a curso
  app.querySelectorAll<HTMLButtonElement>("[data-enroll-course]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.enrollCourse);
      if (!state.enrolledCourses.includes(id)) state.enrolledCourses.push(id);
      render();
    });
  });

  // Reservar lugar en evento
  app.querySelectorAll<HTMLButtonElement>("[data-rsvp]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.rsvp);
      if (!state.rsvpEvents.includes(id)) state.rsvpEvents.push(id);
      render();
    });
  });

  // Aplicar a casting
  app.querySelectorAll<HTMLButtonElement>("[data-apply-casting]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.applyCasting);
      if (!state.appliedCastings.includes(id)) state.appliedCastings.push(id);
      render();
    });
  });

  // Navegación
  app.querySelectorAll<HTMLButtonElement>("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => goTo(btn.dataset.nav as typeof state.view));
  });

  // Logout
  app.querySelector("[data-action='logout']")?.addEventListener("click", () => {
    state.currentUser = null;
    state.cart = [];
    goTo("home");
  });

  // Login
  app.querySelector("#login-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const found = users.find((u) => u.username === username && u.password === password);
    if (!found) {
      state.error = "Usuario o contraseña incorrectos.";
      render();
      return;
    }
    state.currentUser = found;
    goTo("catalog");
  });

  // Registro
  app.querySelector("#register-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (users.some((u) => u.username === username)) {
      state.error = "Ese usuario ya existe (en esta sesión).";
      render();
      return;
    }

    const newUser = { id: getNextUserId(), username, password, role: "user" as const };
    users.push(newUser); // solo en memoria, se pierde al recargar
    state.currentUser = newUser;
    goTo("catalog");
  });

  // Agregar al carrito
  app.querySelectorAll<HTMLButtonElement>("[data-add-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.addCart);
      const existing = state.cart.find((i) => i.productId === id);
      if (existing) existing.qty += 1;
      else state.cart.push({ productId: id, qty: 1 });
      render();
    });
  });

  // Cantidad en carrito
  app.querySelectorAll<HTMLButtonElement>("[data-cart-inc]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.cartInc);
      const item = state.cart.find((i) => i.productId === id);
      if (item) item.qty += 1;
      render();
    });
  });
  app.querySelectorAll<HTMLButtonElement>("[data-cart-dec]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.cartDec);
      const item = state.cart.find((i) => i.productId === id);
      if (item) {
        item.qty -= 1;
        if (item.qty <= 0) state.cart = state.cart.filter((i) => i.productId !== id);
      }
      render();
    });
  });
  app.querySelectorAll<HTMLButtonElement>("[data-cart-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.cartRemove);
      state.cart = state.cart.filter((i) => i.productId !== id);
      render();
    });
  });

  // Checkout falso
  app.querySelector("#checkout-btn")?.addEventListener("click", () => {
    alert("Pedido simulado. No se guardó ni se cobró nada real. ¡Gracias por probar la demo!");
    state.cart = [];
    goTo("catalog");
  });

  // Admin: agregar suscripción
  app.querySelector("#product-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const price = Number((form.elements.namedItem("price") as HTMLInputElement).value);
    const stock = Number((form.elements.namedItem("stock") as HTMLInputElement).value);

    products.push({
      id: getNextProductId(),
      name,
      price,
      stock,
      image: "",
    });
    render();
  });

  // Admin: agregar canción/link
  app.querySelector("#link-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value.trim();
    const url = (form.elements.namedItem("url") as HTMLInputElement).value.trim();

    featuredSongs.push({ id: getNextLinkId(), title, url });
    render();
  });

  // Admin: eliminar canción/link
  app.querySelectorAll<HTMLButtonElement>("[data-remove-link]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.removeLink);
      const idx = featuredSongs.findIndex((s) => s.id === id);
      if (idx !== -1) featuredSongs.splice(idx, 1);
      render();
    });
  });

  // Admin: eliminar suscripción
  app.querySelectorAll<HTMLButtonElement>("[data-remove-product]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.removeProduct);
      const idx = products.findIndex((p) => p.id === id);
      if (idx !== -1) products.splice(idx, 1);
      render();
    });
  });
}

render();