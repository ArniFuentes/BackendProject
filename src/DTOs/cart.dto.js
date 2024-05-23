// Representar los datos del carrito de una manera más clara y específica para el cliente
export default class CartDTO {
  constructor(cartData) {
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
