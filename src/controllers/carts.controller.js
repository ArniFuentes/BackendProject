import { Router } from "express";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";
import cartsService from "../services/carts.service.js";
// import productsService from "../services/products.service.mjs";
import passport from "passport";
import authRoleMiddleware from "../middlewares/auth-role.middlewares.js";
import CartDTO from "../DTOs/cart.dto.js";
import CartValidatorDTO from "../DTOs/cart-validator.dto.js";
import CartQuantityValidatorDTO from "../DTOs/cart-quantity-validator.dto.js";
// import CustomError from "../handlers/errors/customError.mjs";
// import errorDictionary from "../handlers/errors/error-diccionary.mjs";

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
    console.log(cart);
    // const cartDTO = new CartDTO(cart);

    res.status(200).json({ cart: cart }); // Enviar el DTO como respuesta al cliente
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
  async (req, res, next) => {
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
      // next(error); // Pasa el error al middleware de manejo de errores
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

    res
      .status(HTTP_RESPONSES.DELETED)
      .json({ status: HTTP_RESPONSES.DELETE_SUCCESS });
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

// Actualizar el carrito con un arreglo de productos {"products": [{"product": "ID_producto", "quantity": 3}]}
router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    // Utilizar el DTO para estructurar y validar los datos del cuerpo de la solicitud
    const cartValidatorDTO = new CartValidatorDTO(req.body);

    // Obtener el carrito por su ID
    const cart = await cartsService.getCartById(cartId);

    // Actualizar los productos del carrito con el nuevo arreglo
    cart.products = cartValidatorDTO.products;

    // Guardar el carrito actualizado en la base de datos
    await cartsService.updateCart(cartId, cart);
    res.status(200).json({ status: "success", cart });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error: error.message });
  }
});

// actualizar la cantidad de ejemplares del producto pasada desde req.body
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    // Utilizar el DTO para manejar la validación de la cantidad
    const cartQuantityValidatorDTO = new CartQuantityValidatorDTO(req.body);
    cartQuantityValidatorDTO.validate();

    const newQuantity = cartQuantityValidatorDTO.quantity;

    // Llamar al servicio para validar y actualizar la cantidad del producto en el carrito
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
