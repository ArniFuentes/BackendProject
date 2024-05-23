// Cargar la lista de usuarios
async function loadUsers() {
  const userList = document.getElementById("user-list");
  const response = await fetch("/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json()).message; // Acceder a la propidad message
  userList.innerHTML = ""; // Limpiar la lista antes de volver a cargar los usuarios

  data.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button onclick="changeRole('${user.id}')">Cambiar Rol</button>
                    <button onclick="deleteUser('${user.id}')">Eliminar</button>
                </td>
            `;
    userList.appendChild(tr);
  });
}

loadUsers();

// Cambiar el rol de un usuario (debe tener la docu cargada)
async function changeRole(userId) {
  await fetch(`/api/users/premium/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  loadUsers(); // Recargar la lista de usuarios después de cambiar el rol
}

// Eliminar un usuario
async function deleteUser(userId) {
  const confirmDelete = confirm(
    "¿Está seguro de que desea eliminar este usuario?"
  );
  if (confirmDelete) {
    await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    });
    loadUsers(); // Recargar la lista de usuarios después de eliminar
  }
}
