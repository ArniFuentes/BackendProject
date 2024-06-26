import config from "../configs/config.js";
import ProductRepository from "../repositories/product.repository.js";
import transport from "../utils/nodemailer.util.js";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";
import HttpError from "../utils/HttpError.js";

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
    const product = await productRepository.getProductById(productId);
    return product;
  } catch (error) {
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

const deleteProduct = async (user, product) => {
  try {
    // Si es un usuario premium y el producto le pertenece a un admin
    if (user.role === "admin" || product.owner === user.email) {
      await productRepository.deleteProduct(product._id);
      return await sendDeletedProductEmail(user.email, product._id);
    }
    throw new HttpError(
      HTTP_RESPONSES.FORBIDDEN,
      HTTP_RESPONSES.FORBIDDEN_CONTENT
    );
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
      if (typeof newProductInfo[field] === "undefined") {
        throw new HttpError(
          HTTP_RESPONSES.BAD_REQUEST,
          HTTP_RESPONSES.BAD_REQUEST_CONTENT
        );
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

const updateProduct = async (productId, productInfo) => {
  try {
    await productRepository.updateOne(productId, productInfo);
  } catch (error) {
    throw error;
  }
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
  updateProduct,
};
