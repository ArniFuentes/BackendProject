const form = document.getElementById("loginForm");

// Si se produce un submit (si se preciona el botón) capturar el evento
form.addEventListener("submit", (e) => {
  // Evitar que al dar clic en el botón se recargue
  e.preventDefault();

  // Asignar el array de input con los objetos internos
  const data = new FormData(form);

  const obj = {};

  // value es el email y key es el password
  data.forEach((value, key) => (obj[key] = value));

  const fetchParams = {
    url: "/auth/login", //  Ruta a la cual se enviará la solicitud
    headers: { "Content-type": "application/json" }, // Desde el formulario salir como json
    method: "POST",
    body: JSON.stringify(obj),
  };

  // Realizar solicitud HTTP con los datos del formulario en formato JSON
  fetch(fetchParams.url, {
    headers: fetchParams.headers,
    method: fetchParams.method,
    body: fetchParams.body,
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
});
