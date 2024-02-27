const { Router } = require("express");
const HTTP_RESPONSES = require("../constants/http-responses.contant");
const cartsService = require("../services/carts.service");

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
    console.error(error);
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error });
  }
});

module.exports = router;
