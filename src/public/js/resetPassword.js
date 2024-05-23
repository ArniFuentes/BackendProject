const form = document.getElementById("resetPasswordForm");

form.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Obtener el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

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

    const data = await response.json();

    // Alertas según la respuesta de la API
    if (data.message === "Password reset successfully") {
      alert("Password reset successfully");
    }

    if (data.message === "New password must be different") {
      alert("New password must be different");
    }

    window.location.href = "/index.html";
  } catch (error) {
    window.location.href = "/forgotPassword.html";
  }
});
