const createServer = require("./server");
const { connectToDB } = require("./infra/db/mongoose");
const { startSealWorker } = require("./src/app/workers/sealWorker");

(async () => {
  await connectToDB();
  const app = createServer();
  startSealWorker();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
})();
