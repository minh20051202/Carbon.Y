const Envelope = require("../envelopes/model");
const { Batch, BatchDQI, BatchEmissions } = require("../batches/model");
const { writeBatchCsv } = require("../envelopes/csv/csvWriter");
const { generateMerkleRoot } = require("../crypto/merkle");
const { scoreDQI } = require("../dqi/service");
const { computeEmissions } = require("../emissions/service");

function makeBatchId(sensorId, winStart) {
  // ISO ngắn gọn: 2025-10-30T12-34Z_2m
  const s = new Date(winStart).toISOString().replace(/[:.]/g, "-");
  return `B_${sensorId}_${s}_2m`;
}

async function sealWindow(sensorId, winStart, winEnd) {
  // lấy tất cả envelopes của cửa sổ CHƯA gán batch
  const envs = await Envelope.find({
    sensorId,
    windowStart: winStart,
    windowEnd: winEnd,
    batchId: { $exists: false },
  }).lean();
  if (envs.length === 0) return null;

  const batchId = makeBatchId(sensorId, winStart);

  // 1) Tạo file CSV
  const csvPath = await writeBatchCsv(batchId, envs);

  // 2) Tạo MerkleRoot
  const leaves = envs.map((e) => e.lineB3);
  const merkleRootB3 = generateMerkleRoot(leaves);

  // 3) Lưu Batch
  const batch = await Batch.create({
    batchId,
    sensorId,
    windowStart: winStart,
    windowEnd: winEnd,
    recordCount: envs.length,
    merkleRootB3,
    status: "READY",
  });

  // 4) Update envelopes
  await Envelope.updateMany(
    { _id: { $in: envs.map((e) => e._id) } },
    { $set: { batchId } }
  );

  // 5) DQI
  const { dqi, quarantine, flags } = scoreDQI(envs, winStart, winEnd);
  await BatchDQI.create({
    batchId,
    dqi,
    quarantine,
    flags,
    rulesVersion: "1.0",
  });
  await Batch.updateOne({ batchId }, { $set: { status: "DQI_DONE" } });

  // 6) Emissions
  const tco2e = computeEmissions(envs);
  await BatchEmissions.create({
    batchId,
    methodology: "SIMPLE",
    methodVersion: "1.0",
    policyHash: "dev",
    tco2e,
    uncertainty: null,
  });
  await Batch.updateOne({ batchId }, { $set: { status: "EMISSIONS_DONE" } });

  return { batch, csvPath, merkleRootB3, dqi, quarantine, tco2e, flags };
}
module.exports = { sealWindow };
