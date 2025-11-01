const express = require("express");
const router = express.Router();
const { getBatchesController } = require("../../controllers/batch.controller");

router.get("/get", getBatchesController);

module.exports = router;
