// Capa sólo para la interacción directa con la base de datos

import Cart from "../../models/cart.model.js";

class CartDAOMongo {
  async createCart(userId) {
    try {
      const newCart = await Cart.create({ products: [], user: userId });
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate("products.product");
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cartId, updatedCart) {
    try {
      const result = await Cart.findByIdAndUpdate(cartId, updatedCart);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default CartDAOMongo;
