// Capa sólo para la interacción directa con la base de datos

import HTTP_RESPONSES from "../../constants/http-responses.contant.js";
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
      if (!cart) {
        throw new HttpError(
          HTTP_RESPONSES.NOT_FOUND,
          HTTP_RESPONSES.NOT_FOUND_CONTENT
        );
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cartId, updatedCart) {
    try {
      const result = await Cart.findByIdAndUpdate(cartId, updatedCart);
      if (!result) {
        throw new HttpError(
          HTTP_RESPONSES.NOT_FOUND,
          HTTP_RESPONSES.NOT_FOUND_CONTENT
        );
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default CartDAOMongo;
