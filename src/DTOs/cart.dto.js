import HTTP_RESPONSES from "../constants/http-responses.contant.js";
import HttpError from "../utils/HttpError.js";

// Representar los datos del carrito de una manera más clara y específica para el cliente
export default class CartDTO {
  constructor(cartData) {
    if (!cartData) {
      throw new HttpError(
        HTTP_RESPONSES.NOT_FOUND,
        HTTP_RESPONSES.NOT_FOUND_CONTENT
      );
    }
    this.id = cartData._id;
    this.user = cartData.user;
    this.products = cartData.products.map((item) => ({
      productId: item.product._id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
    }));
  }
}
