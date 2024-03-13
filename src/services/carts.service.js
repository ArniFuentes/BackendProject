const CartDAOMongo = require("../DAO/mongo/cart-dao.mongo");

const Cart = new CartDAOMongo();

const insertOne = async (userId) => {
  try {
    // Crear un nuevo carrito y asociarlo al usuario
    const newCart = await Cart.createCart(userId);
    return newCart;
  } catch (error) {
    throw error;
  }
};

// Función para obtener un carrito por su ID
const getCartById = async (cartId) => {
  try {
    const cart = await Cart.getCartById(cartId);
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
    const cart = await Cart.getCartById(cartId);

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
    await Cart.updateCart(cartId, cart);

    return cart;
  } catch (error) {
    throw error;
  }
};

const removeProductFromCart = async (cartId, productId) => {
  try {
    // Obtener el carrito por su ID
    const cart = await Cart.getCartById(cartId);

    // Filtrar los productos para excluir el producto que se va a eliminar
    cart.products = cart.products.filter(
      (item) => item.product._id.toString() !== productId
    );
    console.log(cart.products);

    // Guardar el carrito actualizado en la base de datos
    await Cart.updateCart(cartId, cart);

    return cart;
  } catch (error) {
    throw error;
  }
};

// Eliminar todos los productos de un carrito
const removeAllProductsFromCart = async (cartId) => {
  try {
    // Obtener el carrito por su ID
    const cart = await Cart.getCartById(cartId);

    // Eliminar todos los productos del carrito
    cart.products = [];

    // Guardar el carrito actualizado en la base de datos
    await Cart.updateCart(cartId, cart);
    return cart;
  } catch (error) {
    throw error;
  }
};

// Función para actualizar el carrito en la base de datos
const updateCart = async (cartId, updatedCart) => {
  try {
    const result = await Cart.updateCart(cartId, updatedCart);
    return result;
  } catch (error) {
    throw error;
  }
};

// Exportar el objeto con las funciones
module.exports = {
  insertOne,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  removeAllProductsFromCart,
  updateCart,
};
