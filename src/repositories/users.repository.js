import UserDAO from "../DAO/mongo/user-dao.mongo.js";

class UserRepository {
  constructor() {
    this.userDAO = new UserDAO();
  }

  async find() {
    try {
      return await this.userDAO.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(option) {
    try {
      return await this.userDAO.findOne(option);
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

  async deleteOne(userId) {
    try {
      return await this.userDAO.deleteOne(userId);
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
