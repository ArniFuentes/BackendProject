import environment from "../../configs/config.js";
import developmentLogger from "./devLogger.js"; 
import productionLogger from "./prodLogger.js";

let logger;

switch (environment) {
  case "development":
    logger = developmentLogger;
    break;
  case "production":
    logger = productionLogger;
    break;
  default:
    logger = developmentLogger; // Por defecto, usa el logger de desarrollo
}

export default logger;
