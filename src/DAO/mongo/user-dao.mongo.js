import User from "../../models/user.model.js";

class UserDAO {
  async find() {
    try {
      return await User.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id) {
    try {
      return await User.findOne({ _id: id });
    } catch (error) {
      throw error;
    }
  }

  async save(user) {
    // Guardar el nuevo usuario en la base de datos
    return await user.save();
  }
}

export default UserDAO;
