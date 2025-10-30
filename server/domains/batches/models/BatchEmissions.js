const mongoose = require("mongoose");
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
module.exports = mongoose.model("BatchEmissions", BatchEmissionsSchema);
