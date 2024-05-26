let currentPage = 1;

// Mostrar los productos al ir a index.html
async function getProducts(page) {
  try {
    const response = await fetch(`/api/products?page=${page}`, {
      method: "GET",
    });
    const data = await response.json();
    const products = data.payload.docs;

    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
        <h3>${product.title}</h3>
        <p>Precio: $${product.price}</p>
        <button class="productButton" onclick="addToCart('${product._id}')">Agregar al carrito</button>
      `;
      // Guardar cada contenedor en el contenedor padre
      productList.appendChild(productDiv);
    });

    // Actualizar el número de página actual
    currentPage = page;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
}

// Función para cargar la página siguiente
function nextPage() {
  if (currentPage < totalPages) {
    getProducts(currentPage + 1);
  }
}

// Función para cargar la página anterior
function prevPage() {
  if (currentPage > 1) {
    getProducts(currentPage - 1);
  }
}

// Función para cargar la primera página
function firstPage() {
  getProducts(1);
}

// Función para cargar la última página
function lastPage() {
  getProducts(totalPages);
}

// Función para cargar una página específica
function goToPage(page) {
  getProducts(page);
}

// Cargar la primera página al inicio
let totalPages;

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
      // Crear un carrito para el usuario autenticado
      const response = await fetch("/api/carts", { method: "POST" });
      const data = await response.json();
      const cartId = data.cart.id;
      await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "POST",
      });
      // Guarda el cartId en localStorage
      localStorage.setItem("cartId", cartId);
      // return alert("Producto no se agregó al carro");
    }

    // Muestra un mensaje de éxito con SweetAlert2
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
