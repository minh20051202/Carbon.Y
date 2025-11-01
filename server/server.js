const express = require("express");
const routes = require("./src/app/http/routes/index");

module.exports = function createServer() {
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET"],
      credentials: false,
    })
  );
  app.use(express.json());
  app.use("/api", routes);
  return app;
};
