//  Lógica de negocio

import { v4 as uuidv4 } from "uuid";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import TicketRepository from "../repositories/ticket.repository.js";
import UserRepository from "../repositories/users.repository.js";
import { ObjectId } from "mongodb";
import productsService from "./products.service.js";
import userService from "./users.service.js";

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketRepository();
const userRepository = new UserRepository();

// Validar si un usuario premium está intentando agregar su propio producto al carrito
const validatePremiumUser = async (userId, productId) => {
  const product = await productsService.getOne(productId);
  const user = await userService.getOne(userId);
  if (user.role === "premium") {
    if (product.owner === user.email) {
      throw new Error(
        "Un usuario premium no puede agregar su propio producto al carrito."
      );
    }
  }
};

//  Manejar la lógica de agregar un producto al carrito solo si no existe
const addProductToCartIfNotExists = async (cartId, productId, userId) => {
  const cart = await getCartById(cartId);

  // Verificar si el usuario es el propietario del carrito
  if (cart.user.toString() !== userId.toString()) {
    throw new Error("No tienes permiso para agregar productos a este carrito.");
  }

  // Verificar si el producto ya está en el carrito
  const productIndex = cart.products.findIndex(
    (item) => item.product._id.toString() === productId
  );

  // Si el producto ya está en el carrito, incrementar la cantidad
  if (productIndex !== -1) {
    cart.products[productIndex].quantity++;
    // Guardar el carrito actualizado en la base de datos
    await updateCart(cartId, cart);
  } else {
    // Si el producto no está en el carrito, agregarlo (por defecto quantity es un 1)
    await addProductToCart(cartId, productId);
  }
};

// Lógica de validación y búsqueda del producto en el carrito
const updateProductQuantityInCart = async (cartId, productId, newQuantity) => {
  try {
    const cart = await getCartById(cartId);

    // Convertir el productId a un objeto ObjectId para comparar
    const productIdObj = new ObjectId(productId);

    // Encontrar el índice del producto dentro del carrito
    const productIndex = cart.products.findIndex((item) =>
      item.product._id.equals(productIdObj)
    );

    if (productIndex !== -1) {
      const product = cart.products[productIndex];
      product.quantity = newQuantity;
      await updateCart(cartId, cart);
    } else {
      throw new Error("Producto no encontrado en el carrito");
    }
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
      throw new Error("El carrito no fue encontrado");
    }
    return cart;
  } catch (error) {
    throw error;
  }
};

const addProductToCart = async (cartId, productId) => {
  try {
    // Obtener el carrito por su ID
    const cart = await cartRepository.getCartById(cartId);

    // Verificar si el producto (el id) ya está en el carrito
    const existingProduct = cart.products.find(
      (item) => item.product === productId
    );

    if (existingProduct) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      existingProduct.quantity++;
    } else {
      // Si el producto no está en el carrito, agregarlo con cantidad 1
      cart.products.push({ product: productId, quantity: 1 });
    }

    // Guardar el carrito actualizado en la base de datos
    await cartRepository.updateCart(cartId, cart);

    return cart;
  } catch (error) {
    throw error;
  }
};

const removeProductFromCart = async (cartId, productId) => {
  try {
    // Obtener el carrito por su ID
    const cart = await cartRepository.getCartById(cartId);

    // Filtrar los productos para excluir el producto que se va a eliminar
    cart.products = cart.products.filter(
      (item) => item.product._id.toString() !== productId
    );
    console.log(cart.products);

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
    // Buscar el usuario por su ID en la base de datos
    const user = await userRepository.getOne(userId);

    // Devolver el correo electrónico del usuario
    return user.email;
  } catch (error) {
    throw error;
  }
};

const purchaseCart = async (cartId) => {
  try {
    const cart = await cartRepository.getCartById(cartId);

    // Inicializa un arreglo para almacenar los productos no procesados
    const unprocessedProducts = [];

    // Inicializa un arreglo para almacenar los productos comprados
    const purchasedProducts = [];

    // Revisar cada producto del carrito
    for (const item of cart.products) {
      // Producto a verificar
      const product = await productRepository.getProductById(item.product._id);

      // Si no hay suficiente stock, agregar el producto a la lista de productos no procesados
      if (product.stock < item.quantity) {
        unprocessedProducts.push(item.product._id);
      } else {
        // Si hay suficiente stock, restar el stock del producto
        product.stock -= item.quantity;
        await productRepository.updateProduct(product._id, product);
        // Agregar el producto a la lista de productos comprados
        purchasedProducts.push(item);
      }
    }

    // Crear un ticket para los productos comprados
    const ticketData = {
      code: uuidv4(),
      amount: calculateTotalAmount(purchasedProducts),
      purchaser: await getUserEmail(cart.user),
    };
    const newTicket = await ticketRepository.createTicket(ticketData);

    // Actualizar el carrito para contener solo los productos no procesados
    cart.products = cart.products.filter(
      // Ejecutar para cada elemento del array, y si es true incluir en el nuevo array
      (item) => unprocessedProducts.includes(item.product._id)
    );
    await cartRepository.updateCart(cartId, cart);

    // Si hay productos no procesados, devolver sus IDs junto con el mensaje de compra incompleta
    if (unprocessedProducts.length > 0) {
      return {
        message: "Purchase incomplete",
        purchasedProducts: purchasedProducts,
        unprocessedProducts,
        ticket: newTicket,
      };
    }

    // Si todos los productos se compraron correctamente, devolver el mensaje de compra exitosa y el ticket generado
    return {
      message: "Purchase completed successfully",
      ticket: newTicket,
    };
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
};
