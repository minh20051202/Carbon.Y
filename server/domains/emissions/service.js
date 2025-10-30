function computeEmissions(envelopes) {
  const sum = envelopes.reduce((a, e) => a + (e.reading || 0), 0);
  const tco2e = sum * 1e-6;
  return Number(tco2e.toFixed(6));
}
module.exports = { computeEmissions };
