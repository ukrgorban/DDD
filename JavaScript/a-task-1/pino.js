"use strict";
const logger = require("pino")();

logger.log = (...args) => {
  console.log(...args);
};

module.exports = logger;
