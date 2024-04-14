const Users = require("../../models/user.model");

class UserDAO {
  async find() {
    try {
      return await Users.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id) {
    try {
      return await Users.findOne({ _id: id });
    } catch (error) {
      throw error;
    }
  }

  async save(user) {
    // return await user.save();
    // Guardar el nuevo usuario en la base de datos
    await Users.create(user);
  }
}

module.exports = UserDAO;
