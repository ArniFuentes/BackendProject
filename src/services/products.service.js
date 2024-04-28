import ProductRepository from "../repositories/product.repository.js";

const productRepository = new ProductRepository();

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

    const products = await productRepository.getProducts(page, limit, sortOptions, filterOptions);
    return products;
  } catch (error) {
    throw error;
  }
};

const getOne = async (productId) => {
  try {
    // Llamar al nuevo método getProductById de la clase ProductDAOMongo
    const product = await productRepository.getProductById(productId);
    return product;
  } catch (error) {
    // Lanzar cualquier error que ocurra durante el proceso.
    throw error;
  }
};

const insertOne = async (newProductInfo) => { 
  try {
    newProductInfo.createdAt = new Date();
    const newProduct = await productRepository.createProduct(newProductInfo);
    return newProduct;
  } catch (error) {
    throw error;
  }
};

const updateOne = async (productId, updatedProductInfo) => {
  try {
    updatedProductInfo.updatedAt = new Date();
    await productRepository.updateProduct(productId, updatedProductInfo);
  } catch (error) {
    throw error;
  }
};

const deleteOne = async (productId) => {
  try {
    await productRepository.deleteProduct(productId);
  } catch (error) {
    throw error;
  }
};

export default {
  getAll,
  getOne,
  insertOne,
  updateOne,
  deleteOne,
};
