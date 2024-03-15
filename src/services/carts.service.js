const { v4: uuidv4 } = require("uuid");
const CartDAOMongo = require("../DAO/mongo/cart-dao.mongo");
const ProductDAOMongo = require("../DAO/mongo/product-dao.mongo");
const TicketDAOMongo = require("../DAO/mongo/ticket-dao.mongo");
const UserDAOMongo = require("../DAO/mongo/user-dao.mongo");

const Cart = new CartDAOMongo();
const Product = new ProductDAOMongo();
const Ticket = new TicketDAOMongo();
const User = new UserDAOMongo();

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

const calculateTotalAmount = (products) => {
  let total = 0;
  try {
    // Iterar sobre el array de productos que se pueden comprar (stock > 0)
    for (const item of products) {
      // Sumar el precio del producto al total
      total += item.product.price;
    }
    return total;
  } catch (error) {
    throw error;
  }
};

const getUserEmail = async (userId) => {
  try {
    // Buscar el usuario por su ID en la base de datos
    const user = await User.findOne(userId);

    // Devolver el correo electrónico del usuario
    return user.email;
  } catch (error) {
    throw error;
  }
};

const purchaseCart = async (cartId) => {
  try {
    const cart = await Cart.getCartById(cartId);

    // Inicializa un arreglo para almacenar los productos no procesados
    const unprocessedProducts = [];

    // Revisar cada producto del array de productos
    for (const item of cart.products) {
      // Producto a verificar
      const product = await Product.getProductById(item.product._id);

      if (product.stock < 1) {
        // Si no hay suficiente stock, agrega el producto a la lista de productos no procesados
        unprocessedProducts.push(item.product._id);
      } else {
        // Restar el stock del producto
        product.stock -= 1;
        await Product.updateProduct(product._id, product);
      }
    }

    purchasedProducts = cart.products.filter(
      // Ejecutar para cada elemento del array, y si es true incluir en el nuevo array
      (item) => !unprocessedProducts.includes(item.product._id)
    );

    // Crear un ticket para la compra
    const ticketData = {
      code: uuidv4(),
      amount: calculateTotalAmount(purchasedProducts),
      purchaser: await getUserEmail(cart.user),
    };
    const newTicket = await Ticket.createTicket(ticketData);

    // Actualizar el carrito para contener solo los productos no procesados
    cart.products = cart.products.filter(
      // Ejecutar para cada elemento del array, y si es true incluir en el nuevo array
      (item) => unprocessedProducts.includes(item.product._id)
    );
    await Cart.updateCart(cartId, cart);

    return { message: "Purchase completed successfully", ticket: newTicket };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  insertOne,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  removeAllProductsFromCart,
  updateCart,
  purchaseCart,
};
