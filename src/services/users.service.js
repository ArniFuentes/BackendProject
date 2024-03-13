const UserDAOMongo = require("../DAO/mongo/user-dao.mongo");

const User = new UserDAOMongo();

const getAll = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw error;
  }
};

const getOne = async (id) => {
  try {
    return await User.findOne(id);
  } catch (error) {
    throw error;
  }
};

module.exports = { getAll, getOne };
