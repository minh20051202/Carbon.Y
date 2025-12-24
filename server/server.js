const express = require("express");
const routes = require("./src/app/http/routes/index");
const cors = require("cors");

module.exports = function createServer() {
  const app = express();
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET"],
      credentials: false,
    })
  );
  app.use(express.json());
  app.use("/api", routes);
  return app;
};
