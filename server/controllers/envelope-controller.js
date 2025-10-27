const Envelope = require("../models/Envelope");

const ingestEnvelopeController = async (req, res) => {
  try {
    const newEnvelope = await Envelope.create(req.body);
    if (!newEnvelope) {
      return res.status(400).json({
        success: false,
        message: "Failed to ingest envelope",
      });
    }
    res.status(201).json({
      success: true,
      message: "Envelope ingested successfully",
      data: newEnvelope,
    });
  } catch (error) {
    console.error("ingestEnvelopeController error:", error);
    console.error("ingestEnvelopeController req.body:", req.body);
    res.status(500).json({
      success: false,
      message: "Some error occurred. Please try again!",
    });
  }
};

const getAllEnvelopesController = async (req, res) => {
  try {
    const envelopes = await Envelope.find({});
    if (!envelopes) {
      return res.status(404).json({
        success: false,
        message: "No envelopes found",
      });
    }
    res.status(200).json({
      success: true,
      data: envelopes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occurred. Please try again!",
    });
  }
};

module.exports = { ingestEnvelopeController, getAllEnvelopesController };
