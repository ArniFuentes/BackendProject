import supertest from "supertest";
import { expect } from "chai";
import config from "../src/configs/config.js";


const requester = supertest("http://localhost:8080");

describe("Test 1: crear un producto en la base como usuario admin o premium autenticado", () => {
  let cookie;
  it("Debería autenticar correctamente a un usuario", async function () {
    const user = {
      email: config.emailUser,
      password: "123",
    };
    const response = await requester.post("/auth/login").send(user);
    const listWithTheCookie = response.headers["set-cookie"];
    const onlyTheCookie = listWithTheCookie[0];
    cookie = onlyTheCookie;
  });

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

    await requester
      .post("/api/products")
      .set("Cookie", cookie)
      .send(productMock);
  });
});

describe("Test 2: resporder un producto elegido", () => {
  // Prueba para verificar si el endpoint GET api/products/:pid obtiene un producto correctamente
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
