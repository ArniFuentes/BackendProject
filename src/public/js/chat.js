// // Funcionalidad

// const socket = io();
// const chatBox = document.getElementById("chatBox");
// const messageLogs = document.getElementById("messageLogs");

// const getUserData = async () => {
//   try {
//     const userEmail = await Swal.fire({
//       title: "Bienvenido al Chat",
//       text: "Ingresa tu email",
//       input: "text",
//       icon: "success",
//     });

//     getUserData();

//     chatBox.addEventListener("keyup", (e) => {
//       // El evento es un enter?
//       if (e.key === "Enter") {
//         const data = {
//           userEmail: userEmail.value,
//           message: chatBox.value,
//         };
//         chatBox.value = "";

//         // Emitir (enviar al servidor) el evento cuando se precione enter
//         socket.emit("message", data);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

const socket = io();

// Asignar el elemento del DOM a la variable por el id
const chatBox = document.getElementById("chatBox");
const messageLogs = document.getElementById("messageLogs");

const getUserData = async () => {
  try {
    const userEmail = await Swal.fire({
      title: "Bienvenido al Chat",
      text: "Ingresa tu email",
      input: "text",
      icon: "success",
    });

    console.log(userEmail.value);

    // socket.emit("newUser", { userEmail: userEmail.value });

    // socket.on("userConnected", (user) => {
    //   Swal.fire({
    //     text: `Se acaba de conectar ${user.userEmail}`,
    //     toast: true,
    //     position: "top-end",
    //     showConfirmButton: false,
    //     timer: 3000,
    //     timerProgressBar: true,
    //     icon: "success",
    //   });
    // });
  } catch (error) {
    console.log(error);
  }
};

getUserData();

chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const data = chatBox.value;
    console.log(data);
    // const data = {
    //   userEmail: userEmail.value,
    //   message: chatBox.value,
    // };
    chatBox.value = "";

    // Enviar al servidor lo que se escriba en el chatbox
    socket.emit("message", data);
  }
});

socket.on("messageLogs", (data) => {
  let messages = "";
  data.forEach((chat) => (messages += `${chat} <br>`));

  messageLogs.innerHTML = messages;
});
