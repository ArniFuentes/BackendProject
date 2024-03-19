// Para validar la cantidad de ejemplares del producto
class CartQuantityValidatorDTO {
  constructor(data) {
    this.quantity = data.quantity;
  }

  validate() {
    if (typeof this.quantity !== "number" || this.quantity <= 0) {
      throw new Error("Se espera una nueva cantidad válida");
    }
  }
}

module.exports = CartQuantityValidatorDTO;
