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
}

module.exports = UserDAO;
