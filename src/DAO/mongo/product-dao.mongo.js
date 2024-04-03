const Product = require("../../models/product.model");

class ProductDAO {
  async getProducts(page = 1, limit = 10, sortOptions = {}, filterOptions = {}) {
    try {
      const options = {
        page: page,
        limit: limit,
        sort: sortOptions,
        lean: true, 
      };
    
      const query = filterOptions;
    
      const result = await Product.paginate(query, options);
      return result;
      
    } catch (error) {
      throw error;
    }
  }
  
  async getProductById(productId) {
    try {
      // Obtener un producto por su ID utilizando el método findById de mongoose
      const product = await Product.findById(productId);
      return product;
      
    } catch (error) {
      // throw error;
    }
  }

  async createProduct(newProductInfo) {
    try {
      return await Product.create(newProductInfo);
      
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(productId, updatedProductInfo) {
    try {
      // Utiliza el método updateOne de Mongoose para actualizar el producto
      await Product.updateOne({ _id: productId }, { $set: updatedProductInfo });
      
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      // Utiliza el método deleteOne de Mongoose para eliminar el producto
      return await Product.deleteOne({ _id: productId });
      
    } catch (error) {
      // throw error;
    }
  }
}

module.exports = ProductDAO;
