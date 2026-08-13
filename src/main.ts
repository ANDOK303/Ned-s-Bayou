import "./style.css";
import { users, products, getNextUserId, getNextProductId } from "./data";
import { state, isAdmin, cartCount } from "./state";
import type { Product } from "./types";

const app = document.querySelector<HTMLDivElement>("#app")!;

function goTo(view: typeof state.view) {
  state.error = "";
  state.view = view;
  render();
}

function findProduct(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

// ---------- NAVBAR ----------

function renderNavbar(): string {
  const links = [
    `<button data-nav="catalog" class="nav-link ${state.view === "catalog" ? "active" : ""}">Suscripciones</button>`,
  ];

  if (state.currentUser) {
    links.push(
      `<button data-nav="cart" class="nav-link ${state.view === "cart" ? "active" : ""}">Carrito (${cartCount()})</button>`
    );
    if (isAdmin()) {
      links.push(
        `<button data-nav="admin" class="nav-link ${state.view === "admin" ? "active" : ""}">Admin</button>`
      );
    }
    links.push(
      `<span class="nav-user">👤 ${state.currentUser.username} (${state.currentUser.role})</span>`,
      `<button data-action="logout" class="nav-link">Cerrar sesión</button>`
    );
  } else {
    links.push(
      `<button data-nav="login" class="nav-link ${state.view === "login" ? "active" : ""}">Login</button>`,
      `<button data-nav="register" class="nav-link ${state.view === "register" ? "active" : ""}">Registrarse</button>`
    );
  }

  return `
    <nav class="navbar">
      <div class="brand"><img src="${import.meta.env.BASE_URL}logo.png" alt="Ned's Bayou" class="brand-logo" /></div>
      <div class="nav-links">${links.join("")}</div>
    </nav>
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

// ---------- CATALOG ----------

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

// ---------- CART ----------

function renderCart(): string {
  if (state.cart.length === 0) {
    return `<h2>Tu carrito</h2><p>Está vacío. Ve al catálogo y agrega algo.</p>`;
  }

  let total = 0;
  const rows = state.cart
    .map((item) => {
      const product = findProduct(item.productId);
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
      <thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
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

  return `
    <h2>Panel de administración</h2>

    <h3>Agregar producto</h3>
    <form id="product-form" class="inline-form">
      <input name="name" placeholder="Nombre de la suscripción" required />
      <input name="price" type="number" step="0.01" placeholder="Precio" required />
      <input name="stock" type="number" placeholder="Cupos disponibles" required />
      <button type="submit">Agregar</button>
    </form>

    <h3>Productos</h3>
    <table class="admin-table">
      <thead><tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Cupos</th><th></th></tr></thead>
      <tbody>${productRows}</tbody>
    </table>

    <h3>Usuarios registrados (en memoria)</h3>
    <table class="admin-table">
      <thead><tr><th>ID</th><th>Usuario</th><th>Rol</th></tr></thead>
      <tbody>${userRows}</tbody>
    </table>
  `;
}

// ---------- FOOTER (decorativo, solo en Suscripciones) ----------

function renderFooter(): string {
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">NED'S BAYOU</div>
        <div class="footer-links">
          <a href="#" onclick="return false">★★★★★ Calificanos</a>
          <a href="#" onclick="return false">Instagram</a>
          <a href="#" onclick="return false">Facebook</a>
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
    default:
      return renderCatalog();
  }
}

function render() {
  app.innerHTML = `
    ${renderNavbar()}
    <main class="container">${renderView()}</main>
    ${state.view === "catalog" ? renderFooter() : ""}
  `;
  attachEvents();
}

// ---------- EVENTOS ----------

function attachEvents() {
  // Navegación
  app.querySelectorAll<HTMLButtonElement>("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => goTo(btn.dataset.nav as typeof state.view));
  });

  // Logout
  app.querySelector("[data-action='logout']")?.addEventListener("click", () => {
    state.currentUser = null;
    state.cart = [];
    goTo("catalog");
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

  // Admin: agregar producto
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

  // Admin: eliminar producto
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