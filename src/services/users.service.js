const UserDAOMongo = require("../DAO/mongo/user-dao.mongo");

const User = new UserDAOMongo();

const getAll = async () => {
  return await User.find();
};

const getOne = async (id) => {
  return await User.findOne(id);
};

module.exports = { getAll, getOne };

