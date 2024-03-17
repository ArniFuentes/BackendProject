const UserDAO = require("../DAO/mongo/user-dao.mongo");

class UserRepository {
  constructor() {
    this.userDAO = new UserDAO();
  }

  async getAll() {
    try {
      return await this.userDAO.find();
    } catch (error) {
      throw error;
    }
  }

  async getOne(id) {
    try {
      return await this.userDAO.findOne(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserRepository;
