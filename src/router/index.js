import productsController from "../controllers/products.controller.js";
import cartsController from "../controllers/carts.controller.js";
import cartsViewController from "../controllers/cartsView.controller.js";
import productsViewController from "../controllers/productsViewController.js";
import authController from "../controllers/auth.controller.js";
import viewsTemplateController from "../controllers/views-template.controller.js";
import usersController from "../controllers/users.controller.js";
import chatsController from "../controllers/chats.controller.js";
import sessionsController from "../controllers/sessions.controller.js";
import mockingController from "../controllers/mocking.controller.js";
import loggerTestController from "../controllers/loggers.controller.js";
import userRoleController from "../controllers/userRoleController.js";

const router = (app) => {
  app.use("/api/products", productsController);
  app.use("/api/sessions", sessionsController);
  app.use("/api/carts", cartsController);
  app.use("/chat", chatsController);
  app.use("/carts", cartsViewController);
  app.use("/products", productsViewController);
  app.use("/", viewsTemplateController);
  app.use("/auth", authController);
  app.use("/api/users", usersController);
  app.use("/mockingproducts", mockingController);
  // Agrega el enrutador para probar los logs
  app.use("/loggerTest", loggerTestController);
  // app.use("/api/users", userRoleController);
};

export default router;
