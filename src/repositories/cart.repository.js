const CartDAOMongo = require("../DAO/mongo/cart-dao.mongo");

class CartRepository {
  constructor() {
    this.cartDAO = new CartDAOMongo();
  }

  async createCart(userId) {
    try {
      return await this.cartDAO.createCart(userId);
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      return await this.cartDAO.getCartById(cartId);
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cartId, updatedCart) {
    try {
      return await this.cartDAO.updateCart(cartId, updatedCart);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartRepository;
