const { Router } = require("express");
const envelopeRoutes = require("./v1/envelope.routes");
const router = Router();
router.use("/v1/envelopes", envelopeRoutes);
// router.use('/v1/batches', batchesRoutes); // when ready
module.exports = router;
