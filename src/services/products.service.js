// Para manipular MongoDB
const ProductDAOMongo = require("../DAO/mongo/product-dao.mongo");
const Product = new ProductDAOMongo();

const getAll = async (page, limit, sort, category, available) => {
  try {
    const sortOptions = sort === 'desc' ? { price: -1 } : sort === 'asc' ? { price: 1 } : {};
    const filterOptions = {};
    
    // Aplicar filtro por categoría si está presente
    if (category) {
      filterOptions.category = category;
    }

    // Aplicar filtro por disponibilidad si está presente
    if (available !== undefined) {
      filterOptions.status = available;
    }

    const products = await Product.getProducts(page, limit, sortOptions, filterOptions);
    return products;
  } catch (error) {
    throw error;
  }
};

const getOne = async (productId) => {
  try {
    // Llamar al nuevo método getProductById de la clase ProductDAOMongo
    const product = await Product.getProductById(productId);
    return product;
  } catch (error) {
    // Lanzar cualquier error que ocurra durante el proceso.
    throw error;
  }
};

const insertOne = async (newProductInfo) => {
  try {
    newProductInfo.createdAt = new Date();
    const newProduct = await Product.createProduct(newProductInfo);
    return newProduct;
  } catch (error) {
    throw error;
  }
};

const updateOne = async (productId, updatedProductInfo) => {
  try {
    updatedProductInfo.updatedAt = new Date();
    await Product.updateProduct(productId, updatedProductInfo);
  } catch (error) {
    throw error;
  }
};

const deleteOne = async (productId) => {
  try {
    await Product.deleteProduct(productId);
  } catch (error) {
    throw error;
  }
};

// Exportar el objeto con las funciones
module.exports = {
  getAll,
  insertOne,
  getOne,
  updateOne,
  deleteOne,
  // getAllProducts,
};
