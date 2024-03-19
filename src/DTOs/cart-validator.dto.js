//  Estructurar y validar los datos que se reciben en el cuerpo de la solicitud
class CartValidatorDTO {
  constructor(data) {
    // Verificar si se proporcionó un arreglo de productos en el cuerpo de la solicitud
    if (!data || !Array.isArray(data.products)) {
      throw new Error("Se esperaba un arreglo de productos.");
    }

    // Verificar si cada elemento del arreglo de productos tiene la estructura correcta
    this.products = data.products.map((product) => {
      if (!product.product || typeof product.product !== "string") {
        throw new Error("Cada producto debe tener un ID de producto válido.");
      }
      return {
        product: product.product,
        quantity: product.quantity || 1, // Asignar una cantidad predeterminada de 1 si no se proporciona
      };
    });
  }
}

module.exports = CartValidatorDTO;
