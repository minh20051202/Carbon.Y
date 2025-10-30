const express = require("express");
const router = express.Router();
const {
  ingestEnvelopeController,
} = require("../../controllers/envelope.controller");

router.post("/ingest", ingestEnvelopeController);

module.exports = router;
