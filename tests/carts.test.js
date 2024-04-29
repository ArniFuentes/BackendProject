import supertest from "supertest";
import config from "../src/configs/config.js";

const requester = supertest("http://localhost:8080");

describe("Test: Agregar un producto a un determinado carrito", () => {
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

  it("Debería agregar el producto al carro", async () => {
    await requester
      .post(
        "/api/carts/662d8f4a97a6100913718a71/product/65f5150f5bb996864dbcc3b2"
      )
      .set("Cookie", cookie);
  });
});
