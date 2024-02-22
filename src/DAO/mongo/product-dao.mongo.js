const Product = require("../../models/product.model");

class ProductDAO {

  async getProducts(page = 1, limit = 10, sortOptions = {}, filterOptions = {}) {
    const options = {
      page: page,
      limit: limit,
      sort: sortOptions,
      lean: true, 
    };
  
    const query = filterOptions;
  
    const result = await Product.paginate(query, options);
    return result;
  }
  
  async getProductById(productId) {
    // Obtener un producto por su ID utilizando el método findById de mongoose
    const product = await Product.findById(productId);
    return product;
  }

  async createProduct(newProductInfo) {
    return await Product.create(newProductInfo);
  }

  async updateProduct(productId, updatedProductInfo) {
    // Utiliza el método updateOne de Mongoose para actualizar el producto
    await Product.updateOne({ _id: productId }, { $set: updatedProductInfo });
  }

  async deleteProduct(productId) {
    // Utiliza el método deleteOne de Mongoose para eliminar el producto
    return await Product.deleteOne({ _id: productId });
  }
}

module.exports = ProductDAO;
