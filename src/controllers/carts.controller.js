const { Router } = require("express");
const HTTP_RESPONSES = require("../constants/http-responses.contant");
const cartsService = require("../services/carts.service");
const { ObjectId } = require("mongodb");
const passport = require("passport");
const authRoleMiddleware = require("../middlewares/auth-role.middlewares");

const router = Router();

// Crear un nuevo carrito
router.post(
  "/",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.id; // Obtener el ID del usuario autenticado
      const newCart = await cartsService.insertOne(userId); // Pasar el ID del usuario al servicio
      res.status(HTTP_RESPONSES.CREATED).json({ cart: newCart });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Mostrar los productos del carrito
router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartsService.getCartById(cartId);
    const cartProducts = cart.products;
    res.json({ cartProducts });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error });
  }
});

// Agregar un producto a un determinado carrito
router.post(
  "/:cid/product/:pid",
  // Autorizar
  passport.authenticate("current", { session: false }),
  // Sólo para usuarios
  authRoleMiddleware(["user"]),
  async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const userId = req.user.id; // Obtener el ID del usuario autenticado

      // Obtener el carrito por su ID
      const cart = await cartsService.getCartById(cartId);

       // Verificar si el usuario es el propietario del carrito
       if (cart.user.toString() !== userId.toString()) {
        // Si el usuario no es el propietario del carrito, devolver un error de permiso
        return res.status(403).json({ error: "No tienes permiso para agregar productos a este carrito." });
      }

      // Si el usuario es el propietario del carrito, agregar el producto al carrito
      await cartsService.addProductToCart(cartId, productId);

      res
        .status(HTTP_RESPONSES.CREATED)
        .json({ message: "Producto agregado al carrito exitosamente." });
    } catch (error) {
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ status: "error", error });
    }
  }
);

// Eliminar un producto de un determinado carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    await cartsService.removeProductFromCart(cartId, productId);

    res
      .status(HTTP_RESPONSES.DELETED)
      .json({ status: HTTP_RESPONSES.DELETE_SUCCESS });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error });
  }
});

// Eliminar todos los productos de un carrito
router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    await cartsService.removeAllProductsFromCart(cartId);

    res
      .status(HTTP_RESPONSES.DELETED)
      .json({ status: HTTP_RESPONSES.DELETE_SUCCESS });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error });
  }
});

// Actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const newProducts = req.body.products;

    // Validar que se proporcionó un arreglo de productos
    if (!newProducts || !Array.isArray(newProducts)) {
      return res
        .status(HTTP_RESPONSES.BAD_REQUEST)
        .json({ error: HTTP_RESPONSES.BAD_REQUEST_CONTENT });
    }

    // Obtener el carrito por su ID
    const cart = await cartsService.getCartById(cartId);

    // Actualizar los productos del carrito con el nuevo arreglo
    cart.products = newProducts;

    // Guardar el carrito actualizado en la base de datos
    await cartsService.updateCart(cartId, cart);
    res.status(HTTP_RESPONSES.SUCCESS).json({ status: "success", cart });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    if (typeof newQuantity !== "number" || newQuantity <= 0) {
      return res
        .status(400)
        .json({ error: "Se espera una nueva cantidad válida" });
    }

    const cart = await cartsService.getCartById(cartId);

    // Convertir el productId a un objeto ObjectId para comparar
    const productIdObj = new ObjectId(productId);

    const productIndex = cart.products.findIndex((item) =>
      item._id.equals(productIdObj)
    );

    if (productIndex !== -1) {
      const product = cart.products[productIndex];
      product.quantity = newQuantity;

      await cartsService.updateCart(cartId, cart);
      res
        .status(HTTP_RESPONSES.SUCCESS)
        .json({ status: HTTP_RESPONSES.UPDATE_SUCCESS });
    } else {
      res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error });
  }
});

module.exports = router;
