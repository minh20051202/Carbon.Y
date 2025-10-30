const { enqueueEnvelope } = require("../../../../domains/envelopes/service");

const ingestEnvelopeController = async (req, res) => {
  try {
    const newEnvelope = enqueueEnvelope(req.body);
    if (!newEnvelope) {
      return res.status(400).json({
        success: false,
        message: "Failed to ingest envelope",
      });
    }
    await newEnvelope.save();
    res.status(201).json({
      success: true,
      message: "Envelope ingested successfully",
      data: newEnvelope,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occurred. Please try again!",
    });
  }
};

module.exports = { ingestEnvelopeController };
