const mongoose = require("mongoose");
const {
  Batch,
  BatchDQI,
  BatchEmissions,
} = require("../../domains/batches/model");

const getBatchesController = async (req, res) => {
  try {
    const batches = await Batch.find();
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBatchesController };
