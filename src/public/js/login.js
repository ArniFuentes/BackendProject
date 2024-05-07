const form = document.getElementById("loginForm");

// Ejecutar la callback cuando se envíe el formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  const fetchParams = {
    url: "/auth/login",
    headers: { "Content-type": "application/json" },
    method: "POST",
    body: JSON.stringify(obj),
  };

  try {
    await fetch(fetchParams.url, {
      headers: fetchParams.headers,
      method: fetchParams.method,
      body: fetchParams.body,
    });

    // Llamada al endpoint de creación de carritos
    const cartResponse = await fetch("/api/carts", { method: "POST" });

    const cartData = await cartResponse.json();
    const cartId = cartData.cart._id;

    // Guardar el ID del carrito en el almacenamiento local
    localStorage.setItem("cartId", cartId);

    window.location.href = "index.html";
  } catch (error) {
    console.log(error);
  }
});
