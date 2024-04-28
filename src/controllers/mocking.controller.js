import { Router } from "express";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";
import { generateMockProducts } from "../utils/products-mock.util.js";

const router = Router();

router.get("/", (req, res) => {
  try {
    // Generar 100 productos ficticios (mock data) usando la utilidad
    const mockProducts = generateMockProducts(100);
    res.json({ status: "success", payload: mockProducts });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error });
  }
});

export default router;
