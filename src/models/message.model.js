import mongoose from "mongoose";

// Nombre de la colección
const messageCollection = "message";

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  message: String,
});

const Message = mongoose.model(messageCollection, messageSchema);

export default Message;
