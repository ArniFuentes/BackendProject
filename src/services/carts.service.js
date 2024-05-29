import { v4 as uuidv4 } from "uuid";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import TicketRepository from "../repositories/ticket.repository.js";
import UserRepository from "../repositories/users.repository.js";
import { ObjectId } from "mongodb";
import productsService from "./products.service.js";
import userService from "./users.service.js";
import HttpError from "../utils/HttpError.js";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketRepository();
const userRepository = new UserRepository();

// Validar si un usuario premium está intentando agregar su propio producto al carrito
const validatePremiumUser = async (userId, productId) => {
  try {
    const product = await productsService.getOne(productId);
    const user = await userService.findOne({ _id: userId });
    if (user.role === "premium") {
      if (product.owner === user.email) {
        throw new HttpError(
          HTTP_RESPONSES.FORBIDDEN,
          HTTP_RESPONSES.FORBIDDEN_CONTENT
        );
      }
    }
  } catch (error) {
    throw error;
  }
};

//  Manejar la lógica de agregar un producto al carrito solo si no existe
const addProductToCartIfNotExists = async (cartId, productId, userId) => {
  try {
    const cart = await getCartById(cartId);

    // Verificar si el usuario es el propietario del carrito
    if (cart.user.toString() !== userId.toString()) {
      throw new HttpError(
        HTTP_RESPONSES.FORBIDDEN,
        HTTP_RESPONSES.FORBIDDEN_CONTENT
      );
    }

    // Verificar si el producto ya está en el carrito
    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === productId
    );

    // Si el producto ya está en el carrito, incrementar la cantidad
    if (productIndex !== -1) {
      cart.products[productIndex].quantity++;
      // Guardar el carrito actualizado en la base de datos y corta el flujo
      return await updateCart(cartId, cart);
    }
    // Si el producto no está en el carrito, agregarlo (por defecto quantity es un 1)
    await addProductToCart(cartId, productId);
  } catch (error) {
    throw error;
  }
};

// Lógica de validación y búsqueda del producto en el carrito
const updateProductQuantityInCart = async (cartId, productId, newQuantity) => {
  try {
    const cart = await getCartById(cartId);
    const productIdObj = new ObjectId(productId);

    // Encontrar el índice del producto dentro del carrito
    const productIndex = cart.products.findIndex((item) =>
      item.product._id.equals(productIdObj)
    );

    if (productIndex !== -1) {
      const product = cart.products[productIndex];
      product.quantity = newQuantity;
      return await updateCart(cartId, cart);
    }
    throw new HttpError(
      HTTP_RESPONSES.NOT_FOUND,
      HTTP_RESPONSES.NOT_FOUND_CONTENT
    );
  } catch (error) {
    throw error;
  }
};

const insertOne = async (userId) => {
  try {
    // Crear un nuevo carrito y asociarlo al usuario
    const newCart = await cartRepository.createCart(userId);
    return newCart;
  } catch (error) {
    throw error;
  }
};

// Función para obtener un carrito por su ID
const getCartById = async (cartId) => {
  try {
    const cart = await cartRepository.getCartById(cartId);
    if (!cart) {
      throw new HttpError(
        HTTP_RESPONSES.NOT_FOUND,
        HTTP_RESPONSES.NOT_FOUND_CONTENT
      );
    }
    return cart;
  } catch (error) {
    throw new HttpError(
      HTTP_RESPONSES.BAD_REQUEST,
      HTTP_RESPONSES.BAD_REQUEST_CONTENT
    );
  }
};

const addProductToCart = async (cartId, productId) => {
  try {
    const cart = await cartRepository.getCartById(cartId);
    // Verificar si el producto (el id) ya está en el carrito
    const existingProduct = cart.products.find(
      (item) => item.product === productId
    );

    // Si el producto ya está en el carrito, incrementar la cantidad
    if (existingProduct) {
      return existingProduct.quantity++;
    }
    // Si el producto no está en el carrito, agregarlo con cantidad 1
    cart.products.push({ product: productId, quantity: 1 });

    // Guardar el carrito actualizado en la base de datos
    await cartRepository.updateCart(cartId, cart);

    return cart;
  } catch (error) {
    throw error;
  }
};

const removeProductFromCart = async (cartId, productId) => {
  try {
    const cart = await cartRepository.getCartById(cartId);
    // Filtrar los productos para excluir el producto que se va a eliminar
    cart.products = cart.products.filter(
      (item) => item.product._id.toString() !== productId
    );

    // Guardar el carrito actualizado en la base de datos
    await cartRepository.updateCart(cartId, cart);
    return cart;
  } catch (error) {
    throw error;
  }
};

// Eliminar todos los productos de un carrito
const removeAllProductsFromCart = async (cartId) => {
  try {
    // Obtener el carrito por su ID
    const cart = await cartRepository.getCartById(cartId);

    // Eliminar todos los productos del carrito
    cart.products = [];

    // Guardar el carrito actualizado en la base de datos
    await cartRepository.updateCart(cartId, cart);
    return cart;
  } catch (error) {
    throw error;
  }
};

// Función para actualizar el carrito en la base de datos
const updateCart = async (cartId, updatedCart) => {
  try {
    const result = await cartRepository.updateCart(cartId, updatedCart);
    return result;
  } catch (error) {
    throw error;
  }
};

const calculateTotalAmount = (products) => {
  let total = 0;
  try {
    // Iterar sobre el array de productos que se pueden comprar (stock > 0)
    for (const item of products) {
      // Multiplicar el precio del producto por su cantidad y sumarlo al total
      total += item.product.price * item.quantity;
    }
    return total;
  } catch (error) {
    throw error;
  }
};

const getUserEmail = async (userId) => {
  try {
    const user = await userRepository.findOne(userId);
    return user.email;
  } catch (error) {
    throw error;
  }
};

const processProductPurchase = async (
  item,
  unprocessedProducts,
  purchasedProducts
) => {
  const product = await productRepository.getProductById(item.product._id);

  if (product.stock < item.quantity) {
    unprocessedProducts.push(item.product._id);
  } else {
    product.stock -= item.quantity;
    await productRepository.updateProduct(product._id, product);
    purchasedProducts.push(item);
  }
};

const generateTicket = async (cart, purchasedProducts) => {
  const ticketData = {
    code: uuidv4(),
    amount: calculateTotalAmount(purchasedProducts),
    purchaser: await getUserEmail(cart.user),
  };
  return await ticketRepository.createTicket(ticketData);
};

const purchaseCart = async (cartId) => {
  try {
    const cart = await cartRepository.getCartById(cartId);
    const unprocessedProducts = [];
    const purchasedProducts = [];

    for (const item of cart.products) {
      await processProductPurchase(
        item,
        unprocessedProducts,
        purchasedProducts
      );
    }

    const newTicket = await generateTicket(cart, purchasedProducts);

    cart.products = cart.products.filter((item) =>
      unprocessedProducts.includes(item.product._id)
    );
    await cartRepository.updateCart(cartId, cart);

    if (unprocessedProducts.length > 0) {
      return {
        message: "Purchase incomplete",
        purchasedProducts,
        unprocessedProducts,
        ticket: newTicket,
      };
    }

    return {
      message: "Purchase completed successfully",
      ticket: newTicket,
    };
  } catch (error) {
    throw error;
  }
};

// Métodos de validación
const validateProductQuantity = (quantity) => {
  if (typeof quantity !== "number" || quantity <= 0) {
    throw new Error("Se espera una nueva cantidad válida");
  }
};

const validateCartProducts = (products) => {
  if (!Array.isArray(products)) {
    throw new Error("Se esperaba un arreglo de productos.");
  }

  return products.map((product) => {
    if (!product.product || typeof product.product !== "string") {
      throw new Error("Cada producto debe tener un ID de producto válido.");
    }
    const quantity = product.quantity || 1; // Asignar una cantidad predeterminada de 1 si no se proporciona
    validateProductQuantity(quantity);
    return {
      product: product.product,
      quantity: quantity,
    };
  });
};

// Método para actualizar el carrito
const updateCartProducts = async (cartId, productsData) => {
  try {
    const validatedProducts = validateCartProducts(productsData.products);
    const cart = await getCartById(cartId);
    cart.products = validatedProducts;
    await updateCart(cartId, cart);
    return cart;
  } catch (error) {
    throw error;
  }
};

// Verificar que el carrito pertenece al usuario autenticado
const verifyCartOwnership = async (cartId, userId) => {
  try {
    const cart = await getCartById(cartId);
    if (cart.user.toString() !== userId.toString()) {
      throw new HttpError(
        HTTP_RESPONSES.FORBIDDEN,
        HTTP_RESPONSES.FORBIDDEN_CONTENT
      );
    }
    return cart;
  } catch (error) {
    throw error;
  }
};

export default {
  validatePremiumUser,
  addProductToCartIfNotExists,
  updateProductQuantityInCart,
  insertOne,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  removeAllProductsFromCart,
  updateCart,
  calculateTotalAmount,
  getUserEmail,
  purchaseCart,
  updateCartProducts,
  verifyCartOwnership,
};
