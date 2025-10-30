const mongoose = require("mongoose");
const BatchDQISchema = new mongoose.Schema(
  {
    batchId: { type: String, unique: true, index: true },
    dqi: { type: Number, required: true }, // 0..1
    quarantine: { type: Boolean, default: false },
    flags: { type: Object, default: {} }, // JSON details
    rulesVersion: { type: String, default: "1.0" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("BatchDQI", BatchDQISchema);
