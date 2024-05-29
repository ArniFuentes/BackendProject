import User from "../../models/user.model.js";

class UserDAO {
  async find() {
    try {
      return await User.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(element) {
    try {
      return await User.findOne(element);
    } catch (error) {
      throw error;
    }
  }

  async save(user) {
    // Guardar el nuevo usuario en la base de datos
    return await user.save();
  }

  async deleteOne(id) {
    try {
      return await User.deleteOne({ _id: id });
      // // Actualizar el campo status a false en lugar de eliminar el documento
      // return await User.findByIdAndUpdate(id, { status: false }, { new: true });
    } catch (error) {
      throw error;
    }
  }
}

export default UserDAO;
