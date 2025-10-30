const fs = require("fs");
const path = require("path");

const CSV_HEADER =
  "tsUtc,sensorId,gas,reading,unit,basis,nonce,bootId,calibCertHash,clockDriftMs,sigB64,lineB3\n";

async function writeBatchCsv(batchId, envelopes) {
  const outDir = path.join(process.cwd(), "data", "csv");
  fs.mkdirSync(outDir, { recursive: true });
  const filePath = path.join(outDir, `${batchId}.csv`);
  const stream = fs.createWriteStream(filePath, { encoding: "utf8" });
  stream.write(CSV_HEADER);

  envelopes.sort((a, b) =>
    a.tsUtc < b.tsUtc
      ? -1
      : a.tsUtc > b.tsUtc
      ? 1
      : a.sensorId.localeCompare(b.sensorId)
  );

  for (const e of envelopes) {
    stream.write(
      [
        e.tsUtc,
        e.sensorId,
        e.gas,
        e.reading,
        e.unit,
        e.basis,
        e.nonce,
        e.bootId,
        e.calibCertHash,
        e.clockDriftMs,
        e.sigB64,
        e.lineB3,
      ].join(",") + "\n"
    );
  }
  await new Promise((res) => stream.end(res));
  return filePath;
}

module.exports = { writeBatchCsv, CSV_HEADER };
