const Envelope = require("./model");
const { floorTo2Min } = require("../../shared/time");

function enqueueEnvelope(payload) {
  const { start, end } = floorTo2Min(payload.tsUtc);
  const doc = new Envelope({ ...payload, windowStart: start, windowEnd: end });
  return doc;
}

module.exports = { enqueueEnvelope };
