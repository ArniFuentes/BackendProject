const Users = require("../../models/user.model");

class UserDAO {
  async find() {
    return await Users.find();
  }

  async findOne(id) {
    return await Users.findOne({ _id: id });
  }
}

module.exports = UserDAO;
