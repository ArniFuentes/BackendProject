import supertest from "supertest";
import config from "../src/configs/config.js";

const requester = supertest("http://localhost:8080");

describe("Test: Enviar la información del usuario que está autenticado", () => {
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

  it("Debería enviar la información del usuario que está autenticado", async () => {
    await requester.get("/api/sessions/current");
  });
});
