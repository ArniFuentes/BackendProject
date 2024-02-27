const mongoose = require("mongoose");

// Nombre de la colección
const cartCollection = "cart";

// Define el esquema principal
const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    },
  ],
});

const Cart = mongoose.model(cartCollection, cartSchema);

module.exports = Cart;
