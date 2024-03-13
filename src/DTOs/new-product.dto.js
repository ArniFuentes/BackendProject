class NewProductDto {
  constructor(newProductInfo) {
    this.title = newProductInfo.title;
    this.description = newProductInfo.description;
    this.code = newProductInfo.code;
    this.price = newProductInfo.price;
    this.stock = newProductInfo.stock;
    this.category = newProductInfo.category;
  }
}

module.exports = NewProductDto;
