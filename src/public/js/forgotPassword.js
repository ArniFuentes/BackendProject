document.addEventListener("DOMContentLoaded", function () {
  // Manejar clic en el enlace de Restaurar Contraseña en login.html
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", function (event) {
      event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
      // Redirigir a la página de restauración de contraseña
      window.location.href = "/forgotPassword.html";
    });
  }

  // Manejar el envío del formulario en forgotPassword.html
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

      const formData = new FormData(forgotPasswordForm);
      const email = formData.get("email");

      try {
        const response = await fetch("/auth/forgotPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }

        const responseData = await response.json();
        console.log(responseData);
      } catch (error) {
        console.error("Error:", error.message);
      }
    });
  }
});
