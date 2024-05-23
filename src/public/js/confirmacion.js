const cartId = localStorage.getItem("cartId");

async function llenarDatosCompra(cartId) {
  const response = await fetch(`/api/carts/${cartId}/purchase`, { method: "POST" });
  if (response.ok) {
    const ticketData = await response.json();
    console.log(ticketData);
    // Accediendo a los id de los elementos de confirmacion.html
    document.getElementById("ticketCode").textContent = ticketData.ticket.code;
    document.getElementById("ticketAmount").textContent = ticketData.ticket.amount.toFixed(2);
    document.getElementById("ticketPurchaser").textContent = ticketData.ticket.purchaser;
    document.getElementById("ticketPurchaseDate").textContent = new Date(ticketData.ticket.purchase_datetime).toLocaleString();
  }
}

llenarDatosCompra(cartId);
