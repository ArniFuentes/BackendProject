const { Router } = require("express");
const HTTP_RESPONSES = require("../constants/http-responses.contant");
const { generateMockProducts } = require("../utils/products-mock.util");

const router = Router();

router.get("/", (req, res) => {
  try {
    // Generar 100 productos ficticios (mock data) usando la utilidad
    const mockProducts = generateMockProducts(100);
    res.json({ status: "success", payload: mockProducts });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error: error });
  }
});

module.exports = router;
