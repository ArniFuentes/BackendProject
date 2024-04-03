const { environment } = require("../../configs/config");

switch (environment) {
  case "development":
    module.exports = require("./devLogger");
    break;

  case "production":
    module.exports = require("./prodLogger");
    break;
}
