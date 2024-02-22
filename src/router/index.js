const productsController = require("../controllers/products.controller");
const cartsController = require("../controllers/carts.controller");
const chatsController = require("../controllers/chats.controller");
const cartsViewController = require("../controllers/cartsView.controller");
const productsViewController = require("../controllers/productsViewController");
const authController = require("../controllers/auth.controller");
const viewsTemplateController = require("../controllers/views-template.controller");
const usersController = require("../controllers/users.controller");

const router = (app) => {
  app.use("/api/products", productsController);
  app.use("/api/carts", cartsController);
  app.use("/chat", chatsController);
  app.use("/carts", cartsViewController);
  app.use("/products", productsViewController);
  
  app.use("/", viewsTemplateController);

  // las solicitudes POST a la ruta "/auth" serán manejadas por authController
  app.use("/auth", authController);
  app.use("/users", usersController);
};

module.exports = router;
