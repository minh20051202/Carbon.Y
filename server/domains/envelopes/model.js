const mongoose = require("mongoose");

const EnvelopeSchema = new mongoose.Schema(
  {
    sensorId: { type: String, required: true },
    tsUtc: { type: String, required: true },
    bootId: { type: String, required: true },
    nonce: { type: Number, required: true },
    gas: { type: String, required: true },
    reading: { type: Number, required: true },
    unit: { type: String, required: true },
    basis: { type: String, required: true },
    calibCertHash: { type: String, required: true },
    clockDriftMs: { type: Number, required: true },
    lineB3: { type: String, required: true },
    sigB64: { type: String, required: true },
    windowStart: { type: Date, index: true },
    windowEnd: { type: Date, index: true },
    batchId: { type: String, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Envelope", EnvelopeSchema);
