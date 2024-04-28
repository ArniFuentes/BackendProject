import { faker } from "@faker-js/faker";

// Función para generar productos ficticios usando faker
function generateMockProducts(quantity) {
  const mockProducts = [];
  for (let i = 0; i < quantity; i++) {
    mockProducts.push({
      // Utilizando faker para generar datos aleatorios
      title: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      code: faker.random.alphaNumeric(8),
      price: faker.commerce.price(),
      stock: faker.datatype.number({ min: 0, max: 100 }),
      category: faker.commerce.department(),
      available: faker.datatype.boolean(),
    });
  }
  return mockProducts;
}

export { generateMockProducts };
