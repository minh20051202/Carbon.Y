const express = require("express");
const routes = require("./src/app/http/routes/index");

module.exports = function createServer() {
  const app = express();
  app.use(express.json());
  app.use("/api", routes);
  return app;
};
