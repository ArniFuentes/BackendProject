import supertest from "supertest";
import { expect } from "chai";
import config from "../src/configs/config.js";

const requester = supertest("http://localhost:8080");

describe("Funcionalidades de la aplicación", () => {
  let cookie;

  describe("Test: Autenticar a un usuario", () => {
    it("Debería autenticar al usuario al utilizar POST a /auth/login", async () => {
      const user = {
        email: config.emailUser,
        password: "123",
      };
      const response = await requester.post("/auth/login").send(user);
      const listWithTheCookie = response.headers["set-cookie"];
      const onlyTheCookie = listWithTheCookie[0];
      cookie = onlyTheCookie;

      expect(response.status).to.equal(200);
    });
  });

  describe("Test: Crear un producto en la base como usuario admin o premium autenticado", () => {
    it("Debería crear el producto en la base", async () => {
      // Datos ficticios pasados por body
      const productMock = {
        title: "Producto de prueba creado en el testing",
        description: "Testing",
        code: "FITBIT-003",
        price: 199.99,
        stock: 29,
        category: "Electrónica",
      };

      const response = await requester
        .post("/api/products")
        .set("Cookie", cookie)
        .send(productMock);

      // Asegúrate de que la creación del producto sea exitosa
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("status", "success");
    });
  });

  describe("Test: Responder un producto elegido", () => {
    it("Debería obtener un producto correctamente al llamar a GET api/products/:pid", async () => {
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

  describe("Test: Agregar un producto a un determinado carrito como usuario autenticado", () => {
    it("Debería agregar el producto al carro", async () => {
      const response = await requester
        .post(
          "/api/carts/662d8f4a97a6100913718a71/product/65f5150f5bb996864dbcc3b2"
        )
        .set("Cookie", cookie);

      expect(response.body).to.have.property(
        "message",
        "Producto agregado al carrito exitosamente."
      );
    });
  });

  describe("Test: Enviar la información del usuario que está autenticado", () => {
    it("Debería enviar la información del usuario que está autenticado", async () => {
      const response = await requester
        .get("/api/sessions/current")
        .set("Cookie", cookie);

      expect(response.status).to.equal(200);
    });
  });
});
