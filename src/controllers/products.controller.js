import { Router } from "express";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";
import productsService from "../services/products.service.js";
import NewProductDto from "../DTOs/new-product.dto.js";
import authRoleMiddleware from "../middlewares/auth-role.middlewares.js";
import passport from "passport";
import HttpError from "../utils/HttpError.js";

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
    res.json({ status: HTTP_RESPONSES.SUCCESS_CONTENT, payload: products });
  } catch (error) {
    res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({
      status: "error",
      error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT,
    });
  }
});

// Resporder un producto elegido
router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productsService.getOne(productId);
    res.json({ status: HTTP_RESPONSES.SUCCESS, payload: product });
  } catch (error) {
    if (error instanceof HttpError) {
      return res
        .status(error.statusCode)
        .json({ status: "error", error: error.message });
    }
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
  }
});

// Crear un producto en la base
router.post(
  "/",
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["admin", "premium"]),
  async (req, res) => {
    try {
      const newProductInfo = new NewProductDto(req.body);
      await productsService.validateRequiredFields(newProductInfo);
      await productsService.assignProductOwner(req.user, newProductInfo);
      const newProduct = await productsService.insertOne(newProductInfo);
      res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: HTTP_RESPONSES.CREATED_CONTENT, payload: newProduct });
    } catch (error) {
      if (error instanceof HttpError) {
        return res
          .status(error.statusCode)
          .json({ status: "error", error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

// Actualizar un producto
router.put(
  "/:pid",
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { pid } = req.params;
      const productInfo = await productsService.createProductDto(req.body);
      await productsService.validateRequiredFields(productInfo);
      await productsService.updateOne(pid, productInfo);
      res
        .status(HTTP_RESPONSES.UPDATED)
        .json({ status: HTTP_RESPONSES.UPDATE_SUCCESS });
    } catch (error) {
      if (error instanceof HttpError) {
        return res
          .status(error.statusCode)
          .json({ status: "error", error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
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
        .status(HTTP_RESPONSES.DELETED)
        .json({ status: HTTP_RESPONSES.DELETE_SUCCESS });
    } catch (error) {
      if (error instanceof HttpError) {
        return res
          .status(error.statusCode)
          .json({ status: "error", error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

export default router;
