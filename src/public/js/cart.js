const cartId = localStorage.getItem("cartId");
console.log(cartId);

// Función para mostrar los productos del carrito
async function showCartProducts(cartId) {
  try {
    const response = await fetch(`/api/carts/${cartId}`, { method: "GET" });
    const data = await response.json();

    const productsArray = data.cart.products;

    const table = document.getElementById("miTabla");
    const tbody = table.getElementsByTagName("tbody")[0];
    tbody.innerHTML = ""; // Limpiamos la lista antes de agregar nuevos productos al carrito

    let counter = 0;
    productsArray.forEach((cartItem) => {
      counter += cartItem.price * cartItem.quantity;
      let row = "<tr>";
      row += `<td>${cartItem.title}</td>`;
      row += `<td><input type="number" id="quantity_${cartItem.productId}" value="${cartItem.quantity}" onchange="actualizarCantidad('${cartId}', '${cartItem.productId}')"></td>`;
      row += `<td>$${(cartItem.price * cartItem.quantity).toFixed(2)}</td>`;
      row += `<td><button onclick="eliminarProducto('${cartId}', '${cartItem.productId}')">Eliminar</button></td>`;
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
    console.log(cartId);
    console.log(productId);
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
