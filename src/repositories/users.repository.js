import UserDAO from "../DAO/mongo/user-dao.mongo.js";

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

  async save(user) {
    try {
      return await this.userDAO.save(user);
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
