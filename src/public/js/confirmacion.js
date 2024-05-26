const cartId = localStorage.getItem("cartId");

async function llenarDatosCompra(cartId) {
  const loader = document.getElementById("loader");
  const successMessage = document.getElementById("successMessage");
  const ticketDetails = document.getElementById("ticketDetails");
  const backLink = document.getElementById("backLink");

  loader.style.display = "block"; // Mostrar el cargador

  try {
    const response = await fetch(`/api/carts/${cartId}/purchase`, {
      method: "POST",
    });
    if (response.ok) {
      const ticketData = await response.json();
      // Accediendo a los id de los elementos de confirmacion.html
      document.getElementById("ticketCode").textContent =
        ticketData.ticket.code;
      document.getElementById("ticketAmount").textContent =
        ticketData.ticket.amount.toFixed(2);
      document.getElementById("ticketPurchaser").textContent =
        ticketData.ticket.purchaser;
      document.getElementById("ticketPurchaseDate").textContent = new Date(
        ticketData.ticket.purchase_datetime
      ).toLocaleString();

      ticketDetails.style.display = "block"; // Mostrar los detalles del ticket
      successMessage.style.display = "block"; // Mostrar mensaje de compra exitosa
      backLink.style.display = "block"; // Mostrar enlace de volver
    } else {
      console.error(
        "Error al obtener los datos del ticket:",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error en la solicitud al servidor:", error);
  } finally {
    loader.style.display = "none"; // Ocultar el cargador
  }
}

llenarDatosCompra(cartId);
