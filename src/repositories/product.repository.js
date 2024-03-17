const ProductDAOMongo = require("../DAO/mongo/product-dao.mongo");

class ProductRepository {
  constructor() {
    this.productDAO = new ProductDAOMongo();
  }

  async getProducts(page = 1, limit = 10, sortOptions = {}, filterOptions = {}) {
    try {
      return await this.productDAO.getProducts(page, limit, sortOptions, filterOptions);
    } catch (error) {
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      return await this.productDAO.getProductById(productId);
    } catch (error) {
      throw error;
    }
  }

  async createProduct(newProductInfo) {
    try {
      return await this.productDAO.createProduct(newProductInfo);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(productId, updatedProductInfo) {
    try {
      return await this.productDAO.updateProduct(productId, updatedProductInfo);
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      return await this.productDAO.deleteProduct(productId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductRepository;
