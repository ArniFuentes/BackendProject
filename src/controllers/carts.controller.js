import { Router } from "express";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";
import cartsService from "../services/carts.service.js";
import passport from "passport";
import authRoleMiddleware from "../middlewares/auth-role.middlewares.js";
import CartDTO from "../DTOs/cart.dto.js";

const router = Router();

// Crear un nuevo carrito
router.post(
  "/",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.id; // Obtener el ID del usuario autenticado
      const newCart = await cartsService.insertOne(userId); // Pasar el ID del usuario al servicio
      const DtoCreatedCart = new CartDTO(newCart);
      res.status(HTTP_RESPONSES.CREATED).json({ cart: DtoCreatedCart });
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
    const cartDTO = new CartDTO(cart);
    res.status(200).json({ cart: cartDTO });
  } catch (error) {
    res.status(400).json({ status: "error", error });
  }
});

// Agregar un producto a un determinado carrito
router.post(
  "/:cid/product/:pid",
  // Presentar las credenciales presentes en el token a la api
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["user", "premium"]),
  async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const userId = req.user.id;

      // Validar si el usuario premium está intentando agregar su propio producto al carrito
      await cartsService.validatePremiumUser(userId, productId);

      await cartsService.addProductToCartIfNotExists(cartId, productId, userId);

      res
        .status(HTTP_RESPONSES.CREATED)
        .json({ message: "Producto agregado al carrito exitosamente." });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
);

// Eliminar un producto de un determinado carrito (si hay más de 1 se elimina todo)
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
    const emptyCart = await cartsService.getCartById(cartId);
    const emptyCartDTO = new CartDTO(emptyCart);

    res.status(200).json({ cart: emptyCartDTO });
  } catch (error) {
    req.logger.error(
      "Error al eliminar todos los productos del carrito:",
      error
    );
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productsData = req.body;

    const updatedCart = await cartsService.updateCartProducts(
      cartId,
      productsData
    );
    const cartDto = new CartDTO(updatedCart);

    res.status(200).json({ status: "success", cart: cartDto });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error: error.message });
  }
});

// Actualizar la cantidad de ejemplares del producto
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    await cartsService.updateProductQuantityInCart(
      cartId,
      productId,
      newQuantity
    );

    res
      .status(HTTP_RESPONSES.SUCCESS)
      .json({ status: HTTP_RESPONSES.UPDATE_SUCCESS });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error: error.message });
  }
});

router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    // identificar el carrito que se está comprando
    const cartId = req.params.cid;
    try {
      const result = await cartsService.purchaseCart(cartId);
      res.status(200).json(result);
    } catch (error) {
      res.status(HTTP_RESPONSES.BAD_REQUEST).json({ error: error.message });
    }
  }
);

export default router;
