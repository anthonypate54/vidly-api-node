const winston = require("winston");
const config = require("config");

module.exports = function() {
  if (!config.get("jwtPrivateKey")) {
    winston.info(config.get("jwtPrivateKey"));
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
