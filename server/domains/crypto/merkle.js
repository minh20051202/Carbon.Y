const {
  concatBytes,
  hexToBytes,
  bytesToHex,
} = require("@noble/hashes/utils.js");
const { blake3 } = require("@noble/hashes/blake3.js");

const generateMerkleRoot = (arrayOfHashes) => {
  if (arrayOfHashes.length === 0) {
    return [];
  }
  let level = arrayOfHashes.map((hash) => hexToBytes(hash));
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      const a = level[i];
      const b = i + 1 < level.length ? level[i + 1] : a;
      next.push(blake3(concatBytes(a, b)));
    }
    level = next;
  }
  return bytesToHex(level[0]);
};

module.exports = {
  generateMerkleRoot,
};
