document.addEventListener("DOMContentLoaded", function () {
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(resetPasswordForm);
      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");

      if (password !== confirmPassword) {
        console.error("Passwords do not match");
        return;
      }

      // Obtener el token de la URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      console.log(token);

      try {
        const response = await fetch(`/auth/resetPassword/${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }

        const responseData = await response.json();

        // Alertas según la respuesta de la API
        if (responseData.message === "Password reset successfully") {
          return alert("Password reset successfully");
        }

        if (responseData.message === "New password must be different") {
          alert("New password must be different");
        }

        // // Redirigir al usuario a una página de éxito o inicio de sesión
        // window.location.href = "/login.html";
      } catch (error) {
        // Redirigir a la vista que permita generar nuevamente el correo
        window.location.href = "/forgotPassword.html";
      }
    });
  }
});
