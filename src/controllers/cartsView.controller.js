import { Router } from "express";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";
import cartsService from "../services/carts.service.js";

const router = Router();

// Mostrar los productos del carrito
router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartsService.getCartById(cartId);
    const cartProducts = cart.products;

    // Renderizar la vista con los datos del carrito
    res.render("cart.handlebars", { cartProducts });
  } catch (error) {
    req.logger.error(error);
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error });
  }
});

export default router;
