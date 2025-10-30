const Envelope = require("../../../domains/envelopes/model");
const { sealWindow } = require("../../../domains/batches/service");

// Scheduler: mỗi 30s, seal cửa sổ đã khép (khoảng trễ 10s)
function startSealWorker() {
  const TICK_MS = 30000;
  const LAG_MS = 10000;

  setInterval(async () => {
    try {
      const now = Date.now();
      // tìm các windowStart chưa seal mà windowEnd < now - LAG
      const candidates = await Envelope.aggregate([
        { $match: { batchId: { $exists: false } } },
        {
          $group: {
            _id: {
              sensorId: "$sensorId",
              ws: "$windowStart",
              we: "$windowEnd",
            },
            count: { $sum: 1 },
          },
        },
      ]);

      for (const c of candidates) {
        const { sensorId, ws, we } = c._id;
        const wstart = new Date(ws);
        const wend = new Date(we);
        if (wend.getTime() < now - LAG_MS) {
          await sealWindow(sensorId, wstart, wend);
        }
      }
    } catch (err) {
      console.error("seal scheduler error:", err);
    }
  }, TICK_MS);
}

module.exports = { startSealWorker };
