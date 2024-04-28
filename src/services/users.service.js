// Utilizar el UserRepository en lugar del UserDAO directamente

import UserRepository from "../repositories/users.repository.js";

const userRepository = new UserRepository();

// Cambio de roles de usuario
const toggleUserRole = async (userId) => {
  try {
    const user = await getOne(userId);

    // Si user.role === "user" es verdadero, devolver "premium" sino "user"
    user.role = user.role === "user" ? "premium" : "user";

    // Guardar el usuario actualizado en la base de datos
    await userRepository.save(user);
  } catch (error) {
    throw error;
  }
};

const getAll = async () => {
  try {
    return await userRepository.getAll();
  } catch (error) {
    throw error;
  }
};

const getOne = async (id) => {
  try {
    return await userRepository.getOne(id);
  } catch (error) {
    throw error;
  }
};

export default {
  toggleUserRole,
  getAll,
  getOne,
};
