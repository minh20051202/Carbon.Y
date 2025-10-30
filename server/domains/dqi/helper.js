function clamp(x, a, b) {
  return Math.max(a, Math.min(b, x));
}

function median(arr) {
  if (!arr.length) return 0;
  const a = [...arr].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

module.exports = { clamp, median };
