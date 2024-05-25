import productsController from "../controllers/products.controller.js";
import cartsController from "../controllers/carts.controller.js";
import authController from "../controllers/auth.controller.js";
import usersController from "../controllers/users.controller.js";
import chatsController from "../controllers/chats.controller.js";
import sessionsController from "../controllers/sessions.controller.js";
import mockingController from "../controllers/mocking.controller.js";
import loggerTestController from "../controllers/loggers.controller.js";

const router = (app) => {
  app.use("/api/products", productsController);
  app.use("/api/sessions", sessionsController);
  app.use("/api/carts", cartsController);
  app.use("/chat", chatsController);
  app.use("/auth", authController);
  app.use("/api/users", usersController);
  app.use("/mockingproducts", mockingController);
  app.use("/loggerTest", loggerTestController);
};

export default router;
