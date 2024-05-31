import { Router } from "express";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";
import cartsService from "../services/carts.service.js";
import passport from "passport";
import authRoleMiddleware from "../middlewares/auth-role.middlewares.js";
import CartDTO from "../DTOs/cart.dto.js";
import HttpError from "../utils/HttpError.js";

const router = Router();

// Crear un nuevo carrito
router.post(
  "/",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.id; // Obtener el ID del usuario autenticado
      const newCart = await cartsService.insertOne(userId);
      const DtoCreatedCart = new CartDTO(newCart);
      res.status(HTTP_RESPONSES.CREATED).json({ cart: DtoCreatedCart });
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

// Mostrar los productos del carrito
router.get(
  "/:cid",
  // Para asegurarse de que el usuario solo puede ver su propio carrito
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const cartId = req.params.cid;
      const userId = req.user.id;

      // Verificar que el carrito pertenece al usuario autenticado
      const cart = await cartsService.verifyCartOwnership(cartId, userId);
      const cartDTO = new CartDTO(cart);
      res.json({ cart: cartDTO });
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

// Agregar un producto a un carrito
router.post(
  "/:cid/product/:pid",
  // Presentar las credenciales presentes en el token
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
        .json({ status: HTTP_RESPONSES.CREATED_CONTENT });
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

// Eliminar un producto de un carrito (si hay más de 1 se elimina todo)
router.delete(
  "/:cid/products/:pid",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const userId = req.user.id;
      await cartsService.verifyCartOwnership(cartId, userId);
      await cartsService.removeProductFromCart(cartId, productId);
      res
        .status(HTTP_RESPONSES.DELETED)
        .json({ status: HTTP_RESPONSES.DELETE_CONTENT });
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

// Eliminar todos los productos de un carrito
router.delete(
  "/:cid",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const cartId = req.params.cid;
      const userId = req.user.id;
      await cartsService.verifyCartOwnership(cartId, userId);
      await cartsService.removeAllProductsFromCart(cartId);
      const emptyCart = await cartsService.getCartById(cartId);
      const emptyCartDTO = new CartDTO(emptyCart);
      res.status(200).json({ cart: emptyCartDTO });
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

router.put(
  "/:cid",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productsData = req.body;
      const userId = req.user.id;
      await cartsService.verifyCartOwnership(cartId, userId);

      const updatedCart = await cartsService.updateCartProducts(
        cartId,
        productsData
      );
      const cartDto = new CartDTO(updatedCart);

      res.json({ status: HTTP_RESPONSES.SUCCESS_CONTENT, cart: cartDto });
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

// Actualizar la cantidad de ejemplares del producto
router.put(
  "/:cid/products/:pid",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const newQuantity = req.body.quantity;
      const userId = req.user.id;
      await cartsService.verifyCartOwnership(cartId, userId);

      await cartsService.updateProductQuantityInCart(
        cartId,
        productId,
        newQuantity
      );

      res
        .status(HTTP_RESPONSES.SUCCESS)
        .json({ status: HTTP_RESPONSES.SUCCESS_CONTENT });
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      // identificar el carrito que se está comprando
      const cartId = req.params.cid;
      const userId = req.user.id;
      await cartsService.verifyCartOwnership(cartId, userId);
      const result = await cartsService.purchaseCart(cartId);
      res.json(result);
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

export default router;
