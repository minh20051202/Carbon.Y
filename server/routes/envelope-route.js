const express = require("express");
const route = express.Router();
const {
  ingestEnvelopeController,
  getAllEnvelopesController,
} = require("../controllers/envelope-controller");

route.post("/ingest", ingestEnvelopeController);
route.get("/get", getAllEnvelopesController);

module.exports = route;
