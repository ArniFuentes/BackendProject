// Representar los datos del carrito de una manera más clara y específica para el cliente
class CartDTO {
  constructor(cartData) {
    this.id = cartData._id; // ID del carrito
    this.user = cartData.user; // ID del usuario
    this.products = cartData.products.map((item) => ({
      productId: item.product._id, // ID del producto
      quantity: item.quantity, // Cantidad del producto en el carrito
    }));
  }
}

module.exports = CartDTO;
