import mongoose from "mongoose";

const ticketCollection = "ticket";

// Definir el esquema para el modelo Ticket
const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
  },
  purchaser: {
    type: String,
  },
});

// Crear el modelo Ticket utilizando el esquema definido
const Ticket = mongoose.model(ticketCollection, ticketSchema);

export default Ticket;
