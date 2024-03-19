const mongoose = require("mongoose");

// Nombre de la colección
const cartCollection = "cart";

// Define el esquema principal
const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  // Referencia al usuario al que pertenece el carrito
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const Cart = mongoose.model(cartCollection, cartSchema);

module.exports = Cart;
