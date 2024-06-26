const socket = io();

const chatBox = document.getElementById("chatBox");
const messageLogs = document.getElementById("messageLogs");

const getUserName = async () => {
  try {
    const userName = await Swal.fire({
      title: "Bienvenido al Chat",
      text: "Ingresa tu usuario",
      input: "text",
      icon: "success",
    });

    const response = await fetch("/api/sessions/current");
    if (response.ok) {
      const data = await response.json();
      const userEmail = data.user.email;

      socket.emit("newUser", { userName: userName.value, userEmail });

      socket.on("userConnected", (user) => {
        Swal.fire({
          text: `Se acaba de conectar ${user.userName}`,
        });
      });

      chatBox.addEventListener("keyup", (e) => {
        // El evento es un enter?
        if (e.key === "Enter") {
          // Data ingresada al cuadro
          const data = { userName: userName.value, userEmail, message: chatBox.value };
          chatBox.value = "";
          // Apenas se precione enter se debe emitir un evento y enviar al servidor
          socket.emit("message", data);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

getUserName();

socket.on("messageLogs", (chats) => {
  let messages = "";
  chats.forEach(
    (chat) => (messages += `${chat.userName} dice: ${chat.message} <br>`)
  );

  messageLogs.innerHTML = messages;
});
