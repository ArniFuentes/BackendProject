const forgotPasswordForm = document.getElementById("forgotPasswordForm");

forgotPasswordForm.addEventListener("submit", async function (event) {
  try {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    const email = document.getElementById("email").value;

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

    await response.json();
    alert("Email sent")
  } catch (error) {
    console.error("Error:", error.message);
  }
});
