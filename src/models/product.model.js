import mongoose from "mongoose";
// Incluir el plugin para la paginación
import mongoosePaginate from "mongoose-paginate-v2";

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
  createdAt: Date,
  updatedAt: Date,
  // Referencia a la persona que creó el producto
  owner: { type: String, default: "admin" },
});

// Agregar el plugin de paginación
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model(productCollection, productSchema);

export default Product;
