const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema(
  {
    batchId: { type: String, unique: true, index: true },
    sensorId: { type: String, required: true, index: true },
    windowStart: { type: Date, required: true, index: true },
    windowEnd: { type: Date, required: true, index: true },
    recordCount: { type: Number, required: true },
    merkleRootB3: { type: String, required: true },
    status: {
      type: String,
      enum: ["READY", "DQI_DONE", "EMISSIONS_DONE", "PACKED"],
      default: "READY",
    },
  },
  { timestamps: true }
);

const Batch = mongoose.model("Batch", BatchSchema);

const BatchDQISchema = new mongoose.Schema(
  {
    batchId: { type: String, unique: true, index: true },
    dqi: { type: Number, required: true },
    quarantine: { type: Boolean, default: false },
    flags: { type: Object, default: {} },
    rulesVersion: { type: String, default: "1.0" },
  },
  { timestamps: true }
);

const BatchDQI = mongoose.model("BatchDQI", BatchDQISchema);

const BatchEmissionsSchema = new mongoose.Schema(
  {
    batchId: { type: String, unique: true, index: true },
    methodology: { type: String, default: "SIMPLE" },
    methodVersion: { type: String, default: "1.0" },
    policyHash: { type: String, default: "dev" },
    tco2e: { type: Number, required: true },
    uncertainty: { type: Object, default: null },
  },
  { timestamps: true }
);

const BatchEmissions = mongoose.model("BatchEmissions", BatchEmissionsSchema);

module.exports = { Batch, BatchDQI, BatchEmissions };
