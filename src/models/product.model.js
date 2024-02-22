const mongoose = require("mongoose");
// Incluir el plugin para la paginación
const mongoosePaginate = require("mongoose-paginate-v2");

// Nombre de la colección
const productCollection = "product";

// Si vienen otros campos no se van a tomar en cuenta
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: Object, default: [] },
  // Al momento de responder sólo entregar los que tengan status true
  status: { type: Boolean, default: true },
  createdAt: Date,
  updatedAt: Date,
});

// Agregar el plugin de paginación
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model(productCollection, productSchema);

module.exports = Product;
