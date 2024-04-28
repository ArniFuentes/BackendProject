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
      // .lean();
      if (!cart) {
        throw new Error("Cart not found");
      }
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

  async purchaseCart(cartId) {
    try {
      const cart = await this.getCartById(cartId);

      if (!cart) {
        throw new Error("Cart not found");
      }

      for (const item of cart.products) {
        const product = await ProductDAOMongo.getProductById(item.product._id);

        if (!product) {
          throw new Error(`Product with id ${item.product._id} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.product._id}`);
        }

        product.stock -= item.quantity;
        await ProductDAOMongo.updateProduct(product);
      }

      const ticketData = {
        // Agregar datos relevantes del carrito u otros detalles de la compra
      };
      const newTicket = await TicketDAOMongo.createTicket(ticketData);

      const unprocessedProducts = cart.products
        .filter((item) => item.quantity > product.stock)
        .map((item) => item.product._id);

      cart.products = cart.products.filter(
        (item) => !unprocessedProducts.includes(item.product._id)
      );
      await cart.save();

      return { message: "Purchase completed successfully", ticket: newTicket };
    } catch (error) {
      throw error;
    }
  }
}

export default CartDAOMongo;
