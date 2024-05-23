import { Router } from "express";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";
import productsService from "../services/products.service.js";
import NewProductDto from "../DTOs/new-product.dto.js";
import authRoleMiddleware from "../middlewares/auth-role.middlewares.js";
import passport from "passport";

const router = Router();

// Respoder productos
router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const sort = req.query.sort || null;
    const category = req.query.category || null;
    const available =
      req.query.available !== undefined
        ? req.query.available === "true"
        : undefined;

    const products = await productsService.getAll(
      page,
      limit,
      sort,
      category,
      available
    );
    res.status(200).json({ status: "success", payload: products });
  } catch (error) {
    req.logger.error("Error al obtener productos:", error);
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error: error });
  }
});

// Resporder un producto elegido
router.get("/:pid", async (req, res) => {
  try {
    // Obtener el parámetro 'pid' de la solicitud y convertirlo a un número entero.
    const productId = req.params.pid;
    // Llamar a la función getOne con el productId y esperar la respuesta.
    const product = await productsService.getOne(productId);
    res.json({ status: "success", payload: product });
  } catch (error) {
    req.logger.error("Error al obtener productos:", error); // Registrar error en caso de excepción
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error });
  }
});

// Crear un producto en la base
router.post(
  "/",
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["admin", "premium"]),
  async (req, res, next) => {
    try {
      const newProductInfo = new NewProductDto(req.body);
      await productsService.validateRequiredFields(newProductInfo);
      await productsService.assignProductOwner(req.user, newProductInfo);
      const newProduct = await productsService.insertOne(newProductInfo);
      res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: "success", payload: newProduct });
    } catch (error) {
      next(error);
    }
  }
);

// Actualizar un producto 
router.put(
  "/:pid",
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["admin"]),
  async (req, res, next) => {
    try {
      const { pid } = req.params;

      const productInfo = await productsService.createProductDto(req.body);
      await productsService.validateRequiredFields(productInfo);
      await productsService.updateOne(pid, productInfo);

      res
        .status(HTTP_RESPONSES.UPDATED)
        .json({ status: HTTP_RESPONSES.UPDATE_SUCCESS });
    } catch (error) {
      next(error);
    }
  }
);

// Eliminar un producto
router.delete(
  "/:pid",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await productsService.getOne(pid);
      await productsService.deleteProduct(req.user, product);

      res
        .status(200)
        .json({ status: "El producto ha sido eliminado exitosamente." });
    } catch (error) {
      req.logger.error("Error al eliminar un producto:", error);
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ status: "error", error });
    }
  }
);

export default router;
