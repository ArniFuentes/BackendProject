import NewProductDto from "../DTOs/new-product.dto.js";
import config from "../configs/config.js";
import CustomError from "../handlers/errors/customError.js";
import errorDictionary from "../handlers/errors/error-diccionary.js";
import ProductRepository from "../repositories/product.repository.js";
import transport from "../utils/nodemailer.util.js";

const productRepository = new ProductRepository();

const getAll = async (page, limit, sort, category, available) => {
  try {
    const sortOptions =
      sort === "desc" ? { price: -1 } : sort === "asc" ? { price: 1 } : {};
    const filterOptions = {};

    // Aplicar filtro por categoría si está presente
    if (category) {
      filterOptions.category = category;
    }

    // Aplicar filtro por disponibilidad si está presente
    if (available !== undefined) {
      filterOptions.status = available;
    }

    const products = await productRepository.getProducts(
      page,
      limit,
      sortOptions,
      filterOptions
    );
    return products;
  } catch (error) {
    throw error;
  }
};

const getOne = async (productId) => {
  try {
    // Llamar al nuevo método getProductById de la clase ProductDAOMongo
    const product = await productRepository.getProductById(productId);
    return product;
  } catch (error) {
    // Lanzar cualquier error que ocurra durante el proceso.
    throw error;
  }
};

const insertOne = async (newProductInfo) => {
  try {
    newProductInfo.createdAt = new Date();
    const newProduct = await productRepository.createProduct(newProductInfo);
    return newProduct;
  } catch (error) {
    throw error;
  }
};

const updateOne = async (productId, updatedProductInfo) => {
  try {
    updatedProductInfo.updatedAt = new Date();
    await productRepository.updateProduct(productId, updatedProductInfo);
  } catch (error) {
    throw error;
  }
};

// const deleteOne = async (productId) => {
//   try {
//     await productRepository.deleteProduct(productId);
//   } catch (error) {
//     throw error;
//   }
// };

const deleteProduct = async (user, product) => {
  try {
    // El admin pueda borrar cualquier producto
    if (user.role === "admin") {
      await productRepository.deleteProduct(product._id);
      const premiumOwnerEmail = product.owner;
      await sendDeletedProductEmail(premiumOwnerEmail, product._id);
    }

    // Si es un usuario premium y el producto le pertenece, permitir la eliminación
    if (product.owner === user.email) {
      await productRepository.deleteProduct(product._id);
      await sendDeletedProductEmail(user.email, product._id);
    }
  } catch (error) {
    throw error;
  }
};

const sendDeletedProductEmail = async (email, removedProductId) => {
  try {
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "Producto eliminado",
      html: `<h1>Tu producto con id: ${removedProductId} ha sido eliminada.</h1>`,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

const validateRequiredFields = async (newProductInfo) => {
  try {
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
          message: "Fields are missing",
          code: errorDictionary.PRODUCT_CREATION_ERROR,
        });
      }
    }
  } catch (error) {
    throw error;
  }
};

const assignProductOwner = async (user, newProductInfo) => {
  try {
    // Si el creador es un usuario premium, entonces asignar el correo a owner
    if (user.role === "premium") {
      newProductInfo.owner = user.email;
    }
  } catch (error) {
    throw error;
  }
};

const createProductDto = async (requestData) => {
  return new NewProductDto(requestData);
};

const updateProduct = async (productId, productInfo) => {
  await productRepository.updateOne(productId, productInfo);
};

export default {
  getAll,
  getOne,
  insertOne,
  updateOne,
  deleteProduct,
  sendDeletedProductEmail,
  assignProductOwner,
  validateRequiredFields,
  createProductDto,
  updateProduct,
};
