function floorTo2Min(isoTs) {
  const ms = Date.parse(isoTs);
  const win = Math.floor(ms / 120000) * 120000;
  return { start: new Date(win), end: new Date(win + 120000) };
}

module.exports = { floorTo2Min };
