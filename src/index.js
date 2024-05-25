import logger from "./utils/winston/factory.js";
import app from "./server.js";
import { Server } from "socket.io";
import config from "./configs/config.js";

const chats = [];
const httpServer = app.listen(config.port, () => {
  logger.info(`Server running at ${config.port}`);
});

// asignar el servidor de socket a io
const io = new Server(httpServer);

// Inicializar el servidor socket con el evento "connection"
io.on("connection", (socket) => {

  // Escuchar el evento newUser emitido por el cliente
  socket.on("newUser", (data) => {
    socket.broadcast.emit("userConnected", data);
    socket.emit("messageLogs", chats);
  });
  // Escuchar el evento message (capturarlo) del cliente para obtener la data
  socket.on("message", (data) => {
    chats.push(data);
    // Crear el evento messageLogs y enviar la data obtenida del evento message a todos
    io.emit("messageLogs", chats);
  });
});
