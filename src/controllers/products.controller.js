import { Router } from "express";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";
import productsService from "../services/products.service.js";
import NewProductDto from "../DTOs/new-product.dto.js";
import authRoleMiddleware from "../middlewares/auth-role.middlewares.js";
import passport from "passport";
import CustomError from "../handlers/errors/customError.js";
import errorDictionary from "../handlers/errors/error-diccionary.js";

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
    res.json({ status: "success", payload: products });
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
    console.log(product);
    res.json({ status: "success", payload: product });
  } catch (error) {
    req.logger.error("Error al obtener productos:", error); // Registrar error en caso de excepción
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: "error", error });
  }
});

// // Crear un producto en la base
// router.post(
//   "/",
//   passport.authenticate("current", { session: false }),
//   authRoleMiddleware(["admin", "premium"]), // Perfiles que pueden crear productos
//   async (req, res) => {
//     try {
//       const newProductInfo = new NewProductDto(req.body);
//       const newproduct = await productsService.insertOne(newProductInfo);

//       res
//         .status(HTTP_RESPONSES.CREATED)
//         .json({ status: "success", payload: newproduct });
//     } catch (error) {
//       res
//         .status(500)
//         .json({ status: "error", error });
//     }
//   }
// );

// Crear un producto en la base
router.post(
  "/",
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["admin", "premium"]), // Perfiles que pueden crear productos
  async (req, res, next) => {
    try {
      const newProductInfo = new NewProductDto(req.body);

      // Validar campos requeridos
      const requiredFields = [
        "title",
        "description",
        "code",
        "price",
        "stock",
        "category",
      ];

      for (const field of requiredFields) {
        if (!newProductInfo[field]) {
          CustomError.createError({
            name: "ProductCreationError",
            message: "Error creating product",
            code: errorDictionary.PRODUCT_CREATION_ERROR,
          });
        }
      }

      if (req.user.role === "premium") {
        // user contiene la información del usuario autenticado (un objeto)
        const ownerEmail = req.user.email;
        // Asignar el propietario al nuevo producto
        newProductInfo.owner = ownerEmail;
      }
   
      // Crear el nuevo producto
      const newProduct = await productsService.insertOne(newProductInfo);
      res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: "success", payload: newProduct });
    } catch (error) {
      next(error);
    }
  }
);

// // Actualizar un producto completamente, todo lo que no se envía quedará como undefined
// router.put(
//   "/:pid",
//   passport.authenticate("current", { session: false }),
//   authRoleMiddleware(["admin"]), // Solo administradores pueden autualizar productos
//   async (req, res) => {
//     try {
//       const { pid } = req.params;
//       const { title, description, code, price, stock, category } = req.body;

//       // Si algún campo no viene en el body (no existe) no actualizar y devolver error
//       if (!title || !description || !code || !price || !stock || !category) {
//         res
//           .status(HTTP_RESPONSES.BAD_REQUEST)
//           .json({ status: error, error: HTTP_RESPONSES.BAD_REQUEST_CONTENT });
//       }

//       const productInfo = new NewProductDto(req.body);

//       // Actualizar el documento que tenga el pid utilizando los datos del objeto
//       await productsService.updateOne(pid, productInfo);

//       res
//         .status(HTTP_RESPONSES.UPDATED)
//         .json({ status: HTTP_RESPONSES.UPDATE_SUCCESS });
//     } catch (error) {
//       res
//         .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
//         .json({ status: "error", error: error });
//     }
//   }
// );
// Actualizar un producto completamente, todo lo que no se envía quedará como undefined
router.put(
  "/:pid",
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["admin"]), // Solo administradores pueden autualizar productos
  async (req, res, next) => {
    try {
      const { pid } = req.params;
      const { title, description, code, price, stock, category } = req.body;

      // Si algún campo no viene en el body (no existe) no actualizar y devolver error
      if (!title || !description || !code || !price || !stock || !category) {
        // errorDictionary.PRODUCT_UPDATE_ERROR();
        CustomError.createError({
          name: "ProductUpdateError",
          message: "Error when trying to update the product",
          code: errorDictionary.PRODUCT_UPDATE_ERROR,
        });
      }

      const productInfo = new NewProductDto(req.body);

      // Actualizar el documento que tenga el pid utilizando los datos del objeto
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
  // El admin pueda borrar cualquier producto
  authRoleMiddleware(["admin", "premium"]),
  async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await productsService.getOne(pid);

      // Verificar si el usuario es premium y si el producto le pertenece
      if (req.user.role === "premium" && product.owner === req.user.email) {
        // Si es premium y el producto le pertenece, permitir la eliminación del producto
        await productsService.deleteOne(pid);
        return res
          .status(HTTP_RESPONSES.DELETED)
          .json({ status: HTTP_RESPONSES.DELETE_SUCCESS });
      }

      // El admin pueda borrar cualquier producto
      if (req.user.role === "admin") {
        await productsService.deleteOne(pid);
        return res
          .status(HTTP_RESPONSES.DELETED)
          .json({ status: HTTP_RESPONSES.DELETE_SUCCESS });
      }
      return res.status(403).json({
        status: "error",
        error: "No tienes permisos para eliminar este producto.",
      });
    } catch (error) {
      req.logger.error("Error al crear un producto:", error);
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ status: "error", error });
    }
  }
);

export default router;

