import supertest from "supertest";
import { expect } from "chai";

const requester = supertest("http://localhost:8080");

describe("API Tests", () => {
  describe("Product Endpoint Tests", () => {
    // Prueba para verificar si el endpoint POST api/products crea un producto correctamente
    it("Should create a product successfully when calling POST api/products", async () => {
      // Datos ficticios pasados por body
      const productMock = {
        title: "Reloj Inteligente Fitbit Versa 3",
        description: "Reloj inteligente con seguimiento de actividad",
        code: "FITBIT-003",
        price: 199.99,
        stock: 29,
        category: "Electrónica",
      };

      const { statusCode, ok, body } = await requester
        .post("/api/products")
        .send(productMock);
      console.log(statusCode, ok, body);
    });

    // Prueba para verificar si el endpoint GET api/products/:pid obtiene un producto correctamente
    it("Should get a product successfully when calling GET api/products/:pid", async () => {
      // Supongamos que pid es un ID válido de un producto existente en tu base de datos
      const productId = "65f5c84eff6b5caf6ca28b95";

      const response = await requester.get(`/api/products/${productId}`);

      // Verificar que la respuesta sea exitosa (código de estado 200)
      expect(response.status).to.equal(200);
      // Verificar que el cuerpo de la respuesta tenga una propiedad llamada "status" con el valor "success"
      expect(response.body).to.have.property("status", "success");
      // verificar que el cuerpo de la respuesta tenga una propiedad llamada "payload". 
      expect(response.body).to.have.property("payload");
      // verificar que el valor de la propiedad "payload" sea un objeto.
      expect(response.body.payload).to.be.an("object");
    });
  });
});
