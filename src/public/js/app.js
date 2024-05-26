let currentPage = 1;
let totalPages;

async function getProducts(page) {
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");
  const productList = document.getElementById("productList");
  
  loader.style.display = "block"; // Mostrar el cargador
  content.style.display = "none"; // Ocultar el contenido

  try {
    const response = await fetch(`/api/products?page=${page}`, { method: "GET" });
    const data = await response.json();
    const products = data.payload.docs;

    productList.innerHTML = "";

    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
        <h3>${product.title}</h3>
        <p>Precio: $${product.price}</p>
        <button class="productButton" onclick="addToCart('${product._id}')">Agregar al carrito</button>
      `;
      productList.appendChild(productDiv);
    });

    currentPage = page;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  } finally {
    loader.style.display = "none"; // Ocultar el cargador
    content.style.display = "block"; // Mostrar el contenido
  }
}

// Funciones para navegación de página
function nextPage() {
  if (currentPage < totalPages) {
    getProducts(currentPage + 1);
  }
}

function prevPage() {
  if (currentPage > 1) {
    getProducts(currentPage - 1);
  }
}

function firstPage() {
  getProducts(1);
}

function lastPage() {
  getProducts(totalPages);
}

function goToPage(page) {
  getProducts(page);
}

// Inicializar la carga de productos
(async () => {
  try {
    const response = await fetch("/api/products");
    const jsonResponse = await response.json();
    totalPages = jsonResponse.payload.totalPages;
    getProducts(1);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
})();

function redirectToLogin() {
  window.location.href = "login.html";
}

function redirectToSignup() {
  window.location.href = "signup.html";
}

async function addToCart(productId) {
  try {
    const cartId = localStorage.getItem("cartId");
    console.log(cartId);
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "POST",
    });

    if (!response.ok) {
      const response = await fetch("/api/carts", { method: "POST" });
      const data = await response.json();
      const cartId = data.cart.id;
      await fetch(`/api/carts/${cartId}/product/${productId}`, { method: "POST" });
      localStorage.setItem("cartId", cartId);
    }

    Swal.fire({
      icon: "success",
      title: "Producto agregado al carrito",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.error("Error en la solicitud al servidor:", error);
  }
}

async function showAddedProducts() {
  window.location.href = "carrito.html";
}
