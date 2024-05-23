document.addEventListener("DOMContentLoaded", (event) => {
  const form = document.getElementById("loginForm");

  if (form) {
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

        const cartId = localStorage.getItem("cartId");
        const response = await fetch(`/api/carts/${cartId}`, {
          method: "GET",
        });

        if (!response.ok) {
          const response = await fetch("/api/carts", { method: "POST" });
          const data = await response.json();
          const cartId = data.cart.id;

          localStorage.setItem("cartId", cartId);
        }
        window.location.href = "index.html";
      } catch (error) {
        console.log(error);
      }
    });

    document
      .getElementById("forgotPasswordLink")
      .addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "/forgotPassword.html";
      });
  }
});
