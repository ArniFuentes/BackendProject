// Función para cargar la lista de productos en la página de inicio y la lista de productos
async function loadProducts() {
  try {
    // Hacer una solicitud GET al endpoint correspondiente en el backend para obtener la lista de productos
    const response = await fetch("/api/products");

    // Verificar si la respuesta es exitosa (código de estado 200)
    if (!response.ok) {
      throw new Error("No se pudieron cargar los productos");
    }

    // Convertir la respuesta JSON en un objeto JavaScript
    const responseData = await response.json();
    const products = responseData.payload.docs;

    // Llamar a una función para mostrar los productos en la página
    displayProducts(products);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

// Función para mostrar los productos en la página
function displayProducts(products) {
  const productList = document.getElementById("product-list");
  // Limpiar la lista de productos antes de agregar nuevos productos
  productList.innerHTML = "";

  // Iterar sobre cada producto y crear un elemento de lista para mostrarlo en la página
  products.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${product.title} - $${product.price}`;
    productList.appendChild(listItem);
  });
}

loadProducts();
