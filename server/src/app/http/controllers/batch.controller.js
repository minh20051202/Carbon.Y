const { Batch } = require("../../../../domains/batches/model");

const getBatchesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $lookup: {
          from: "batchemissions",
          let: { bid: "$batchId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$batchId", "$$bid"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            { $project: { _id: 0, tco2e: 1 } },
          ],
          as: "em",
        },
      },
      {
        $lookup: {
          from: "batchdqis",
          let: { bid: "$batchId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$batchId", "$$bid"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            { $project: { _id: 0, dqi: 1 } },
          ],
          as: "dqi",
        },
      },
      { $unwind: { path: "$em", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$dqi", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 0,
          batchId: 1,
          sensorId: 1,
          windowStart: 1,
          windowEnd: 1,
          tco2e: "$em.tco2e",
          dqi: "$dqi.dqi",
        },
      },

      { $sort: { windowStart: -1, windowEnd: -1 } },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
      {
        $project: {
          data: 1,
          total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
          page: { $literal: page },
          limit: { $literal: limit },
        },
      },
    ];

    const [result] = await Batch.aggregate(pipeline);

    if (result && result.data) {
      result.data = result.data.map((item) => ({
        ...item,
        randStatus: Math.random() < 0.1 ? 0 : 1,
      }));
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBatchesController };
