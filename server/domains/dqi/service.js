const { clamp, median } = require("./helper");

function computeMissingPenalty(timestampsMs, windowMs) {
  if (timestampsMs.length < 2) return { missingRate: 1, p_miss: 1 };
  const deltas = [];
  for (let i = 1; i < timestampsMs.length; i++)
    deltas.push(timestampsMs[i] - timestampsMs[i - 1]);
  const dt = median(deltas); // kỳ vọng
  const expected = Math.max(1, Math.floor(windowMs / dt));
  const missing = Math.max(0, expected - timestampsMs.length);
  const missingRate = missing / expected; // 0..1
  // map 1%→5% như spec demo: <1% ok, ≥5% =1
  const p_miss = clamp((missingRate - 0.01) / (0.05 - 0.01), 0, 1);
  return { missingRate, p_miss };
}

function computeFlatPenalty(readings, timestampsMs) {
  if (readings.length < 2) return { flatSeconds: 0, p_flat: 0 };
  const maxR = Math.max(...readings);
  const eps = 0.001 * (maxR || 1);
  let flatSec = 0;
  for (let i = 1; i < readings.length; i++) {
    if (Math.abs(readings[i] - readings[i - 1]) <= eps) {
      flatSec += (timestampsMs[i] - timestampsMs[i - 1]) / 1000;
    }
  }
  const p_flat = clamp((flatSec - 300) / 600, 0, 1);
  return { flatSeconds: flatSec, p_flat };
}

function computeOutlierPenalty(readings) {
  if (readings.length < 2) return { outlierRate: 0, p_out: 0 };
  const mean = readings.reduce((a, b) => a + b, 0) / readings.length;
  const sd = Math.sqrt(
    readings.reduce((s, x) => s + (x - mean) * (x - mean), 0) /
      (readings.length - 1) || 0
  );
  if (sd === 0) return { outlierRate: 0, p_out: 0 };
  const outCnt = readings.filter((x) => Math.abs((x - mean) / sd) > 3).length;
  const outlierRate = outCnt / readings.length;
  const p_out = clamp((outlierRate - 0.005) / (0.02 - 0.005), 0, 1);
  return { outlierRate, p_out };
}

function scoreDQI(envelopes, windowStart, windowEnd) {
  const windowMs = windowEnd - windowStart;
  const timestampsMs = envelopes
    .map((e) => Date.parse(e.tsUtc))
    .sort((a, b) => a - b);
  const readings = envelopes
    .slice()
    .sort((a, b) => Date.parse(a.tsUtc) - Date.parse(b.tsUtc))
    .map((e) => e.reading);

  const { missingRate, p_miss } = computeMissingPenalty(timestampsMs, windowMs);
  const { flatSeconds, p_flat } = computeFlatPenalty(readings, timestampsMs);
  const { outlierRate, p_out } = computeOutlierPenalty(readings);

  const w = { miss: 0.4, flat: 0.3, out: 0.3 };
  const dqi = clamp(
    1 - (w.miss * p_miss + w.flat * p_flat + w.out * p_out),
    0,
    1
  );
  const quarantine = dqi < 0.8 || missingRate >= 0.05;

  const flags = {
    missing: { rate: Number(missingRate.toFixed(4)) },
    flatline: { seconds: Math.round(flatSeconds) },
    outlier: { rate: Number(outlierRate.toFixed(4)) },
  };
  return { dqi: Number(dqi.toFixed(4)), quarantine, flags };
}

module.exports = { scoreDQI };
