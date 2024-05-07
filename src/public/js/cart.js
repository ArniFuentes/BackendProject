const cartId = localStorage.getItem("cartId");

// Función para mostrar los productos del carrito
async function showCartProducts(cartId) {
  try {
    const response = await fetch(`/api/carts/${cartId}`, { method: "GET" });
    const cartData = await response.json();

    const addedProducts = cartData.cart.products;

    const table = document.getElementById("miTabla");
    const tbody = table.getElementsByTagName("tbody")[0];
    tbody.innerHTML = ""; // Limpiamos la lista antes de agregar nuevos productos al carrito

    let counter = 0;
    addedProducts.forEach((cartItem) => {
      const product = cartItem.product;
      counter += product.price * cartItem.quantity;
      let row = "<tr>";
      row += `<td>${product.title}</td>`;
      row += `<td><input type="number" id="quantity_${product._id}" value="${cartItem.quantity}" onchange="actualizarCantidad('${cartId}', '${product._id}')"></td>`;
      row += `<td>$${(product.price * cartItem.quantity).toFixed(2)}</td>`;
      row += `<td><button onclick="eliminarProducto('${cartId}', '${product._id}')">Eliminar</button></td>`;
      row += "</tr>";
      tbody.innerHTML += row;
    });

    const total = `<tr> <td>Total</td> <td></td> <td>$${counter.toFixed(
      2
    )}</td> </tr>`;
    tbody.innerHTML += total;
  } catch (error) {
    console.error("Error al obtener los productos del carrito:", error);
  }
}

// Función para actualizar la cantidad de un producto en el carrito
async function actualizarCantidad(cartId, productId) {
  try {
    // Obtener la nueva cantidad del producto del campo de entrada correspondiente
    const newQuantity = document.getElementById(`quantity_${productId}`).value;

    // Enviar una solicitud PUT a la API para actualizar la cantidad del producto
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Especifar que el cuerpo de la solicitud es JSON
      },
      // En el cuerpo de la solicitud, enviamos un objeto JSON que contiene la nueva cantidad del producto
      body: JSON.stringify({ quantity: parseInt(newQuantity) }), // Convertimos la nueva cantidad a entero y la convertimos a JSON
    });

    if (response.ok) {
      // Si la solicitud PUT fue exitosa, volver a cargar los productos del carrito
      showCartProducts(cartId);
    } else {
      // Si la solicitud PUT no fue exitosa, mostrar el mensaje de error en la consola del navegador
      console.error(
        "Error al actualizar la cantidad del producto:",
        response.statusText
      );
    }
  } catch (error) {
    // Capturar y manejar cualquier error que pueda ocurrir durante el proceso
    console.error("Error al actualizar la cantidad del producto:", error);
  }
}

// Función para eliminar un producto del carrito
async function eliminarProducto(cartId, productId) {
  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      // Si la solicitud DELETE fue exitosa, volver a cargar los productos del carrito
      showCartProducts(cartId);
    } else {
      console.error(
        "Error al eliminar el producto del carrito:",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error);
  }
}

async function comprarCarrito() {
  window.location.href = "confirmacion.html";
}

// Llamar a la función para mostrar los productos del carrito al cargar la página
showCartProducts(cartId);
