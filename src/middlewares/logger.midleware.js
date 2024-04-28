import getLogger from "../utils/winston/factory.js";

const logger = (req, res, next) => {
  req.logger = getLogger;
  next();
};

export default logger;
