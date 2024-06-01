import HttpError from "../../utils/HttpError.js";
import HTTP_RESPONSES from "../../constants/http-responses.contant.js";
import User from "../../models/user.model.js";

class UserDAO {
  async find() {
    try {
      return await User.find();
    } catch (error) {
      throw error;  // Mapear cualquier error como error 500 en el controlador
    }
  }

  async findOne(element) {
    try {
      const user = await User.findOne(element);
      if (!user) {
        throw new HttpError(
          HTTP_RESPONSES.NOT_FOUND,
          HTTP_RESPONSES.NOT_FOUND_CONTENT
        );
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async save(user) {
    try {
      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(id) {
    try {
      const result = await User.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        throw new HttpError(
          HTTP_RESPONSES.NOT_FOUND,
          HTTP_RESPONSES.NOT_FOUND_CONTENT
        );
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default UserDAO;
