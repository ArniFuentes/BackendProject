import CartDAOMongo from "../DAO/mongo/cart-dao.mongo.js";

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
      const cart = await this.cartDAO.getCartById(cartId);
      return cart;
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

export default CartRepository;
