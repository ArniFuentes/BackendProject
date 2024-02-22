const app = require("./server");
const { Server } = require("socket.io");
// const Message = require("./models/message.model");

const httpServer = app.listen(8080, () => {
  console.log("Server running at http://localhost:8080/");
});

// asignar el servidor de socket a io
const io = new Server(httpServer);

// Inicializar el servidor socket con el evento "connection"
io.on("connection", (socket) => {
  // Escuchar evento (capturarlo) del cliente para obtener el objeto
  socket.on("message", (data) => {
    console.log(data);
    // Reenviar a todos los usuarios conectados
    io.emit("messageLogs", data);
  });
});
