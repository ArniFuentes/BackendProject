const Cart = require("../../models/cart.model");

class CartDAOMongo {
  
  async createCart() {
    try {
      const newCart = await Cart.create({ products: [] });
      return newCart;
    } catch (error) {
      console.error("Error en createCart:", error);
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate("products.product").lean();
      return cart;
    } catch (error) {
      console.error("Error en getCartById:", error);
      throw error;
    }
  }

  async updateCart(cartId, updatedCart) {
    try {
      const result = await Cart.findByIdAndUpdate(cartId, updatedCart);
      return result;
    } catch (error) {
      console.error("Error en updateCart:", error);
      throw error;
    }
  }
}

module.exports = CartDAOMongo;
