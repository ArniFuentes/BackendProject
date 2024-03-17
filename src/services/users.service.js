// Utilizar el UserRepository en lugar del UserDAO directamente

const UserRepository = require("../repositories/users.repository");

const userRepository = new UserRepository();

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

module.exports = { getAll, getOne };
