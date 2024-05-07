const url = "http://localhost:8080/api/products";
let currentPage = 1;

const cartId = localStorage.getItem("cartId");

async function getProducts(page) {
  try {
    const response = await fetch(`${url}?page=${page}`, { method: "GET" });
    const jsonResponse = await response.json();
    const products = jsonResponse.payload.docs;

    const productList = document.getElementById("productList");
    productList.innerHTML = ""; // Limpiamos la lista antes de agregar nuevos productos

    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
        <h3>${product.title}</h3>
        <p>Precio: $${product.price}</p>
        <button onclick="addToCart('${cartId}', '${product._id}')">Agregar al carrito</button>
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
    const response = await fetch(url);
    const jsonResponse = await response.json();
    totalPages = jsonResponse.payload.totalPages;
    getProducts(1);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
})();

function redirectToLogin() {
  // Redirigir a la página de inicio de sesión
  window.location.href = "login.html";
}

async function addToCart(cartId, productId) {
  try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "POST",
    });

    if (response.ok) {
      console.log("Producto agregado al carrito exitosamente.");
      // Aquí puedes agregar cualquier lógica adicional que desees después de agregar el producto al carrito
    } else {
      console.error(
        "Error al agregar el producto al carrito:",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error en la solicitud al servidor:", error);
  }
}

// async function showAddedProducts(cartId) {
//   try {

//     window.location.href = "carrito.html";

//     // Realizar la solicitud GET al endpoint con el cartId proporcionado
//     const response = await fetch(`/api/carts/${cartId}`);
//     const data = await response.json();

//     // Crear la vista de los productos del carrito
//     const cartView = document.createElement("div");
//     cartView.classList.add("cart-view");

//     // Crear un título para la vista
//     const title = document.createElement("h3");
//     title.textContent = "Productos agregados al carrito:";
//     cartView.appendChild(title);

//     // Crear una lista para mostrar los productos
//     const productList = document.createElement("ul");
//     data.cart.products.forEach((product) => {
//       const item = document.createElement("li");
//       item.textContent = `${product.product.title} - ${product.quantity}`;
//       productList.appendChild(item);
//     });
//     cartView.appendChild(productList);

//     // Mostrar la vista en el cuerpo del documento
//     document.body.appendChild(cartView);
//   } catch (error) {
//     console.error("Error al obtener los productos del carrito:", error);
//     alert(
//       "Ocurrió un error al obtener los productos del carrito. Por favor, inténtalo de nuevo."
//     );
//   }
// }

// async function showAddedProducts(cartId) {
//   try {
//     window.location.href = "carrito.html";

//     const response = await fetch(`/api/carts/${cartId}`, {
//       method: "GET",
//     });

//     console.log(response.ok);

//     if (response.ok) {
//       const jsonResponse = await response.json();
//       const cartProducts = jsonResponse.cart.products;

//       const cartProductList = document.getElementById("cartProductList");
//       cartProductList.innerHTML = ""; // Limpiamos la lista antes de agregar los nuevos productos al carrito

//       cartProducts.forEach((cartProduct) => {
//         const product = cartProduct.product;
//         const quantity = cartProduct.quantity;

//         const listItem = document.createElement("li");
//         listItem.textContent = `${quantity}x ${product.title} - $${product.price}`;
//         cartProductList.appendChild(listItem);
//       });
//     } else {
//       console.error(
//         "Error al obtener los productos del carrito:",
//         response.statusText
//       );
//     }
//   } catch (error) {
//     console.error("Error en la solicitud al servidor:", error);
//   }
// }

// async function showAddedProducts(cartId) {
//   try {
//     // Realizar la solicitud GET al endpoint con el cartId proporcionado
//     const response = await fetch(`/api/carts/${cartId}`);
//     const data = await response.json();

//     // Insertar los datos del carrito en la página carrito.html
//     const responseHTML = await fetch("carrito.html");
//     const cartPageHTML = await responseHTML.text();
//     const cartData = JSON.stringify(data.cart.products);
//     const modifiedHTML = cartPageHTML.replace("<!-- cartData -->", cartData);

//     // Abrir una nueva pestaña con carrito.html y los datos del carrito
//     const newWindow = window.open("");
//     newWindow.document.write(modifiedHTML);
//   } catch (error) {
//     console.error("Error al obtener los productos del carrito:", error);
//     alert(
//       "Ocurrió un error al obtener los productos del carrito. Por favor, inténtalo de nuevo."
//     );
//   }
// }

async function showAddedProducts(cartId) {
  window.location.href = "carrito.html";
  // try {
  //   window.location.href = "carrito.html";

  //   // Realizar la solicitud GET a la API para obtener los productos del carrito
  //   const response = await fetch(`/api/carts/${cartId}`);
  //   const data = await response.json();

  //   // Obtener la lista de productos del carrito
  //   const products = data.cart.products;
  //   console.log(products);

  //   // Seleccionar el elemento ul donde se mostrarán los productos del carrito
  //   const cartProductList = document.getElementById("cartProductList");

  //   // Limpiar cualquier contenido previo del elemento ul
  //   cartProductList.innerHTML = "";

  //   // Mostrar los productos del carrito en la lista
  //   products.forEach((cartItem) => {
  //     const li = document.createElement("li");
  //     const product = cartItem.product;
  //     li.textContent = `${product.title} - ${cartItem.quantity}`;
  //     cartProductList.appendChild(li);
  //   });

  // } catch (error) {
  //   console.error("Error al obtener los productos del carrito:", error);

  // }
}
