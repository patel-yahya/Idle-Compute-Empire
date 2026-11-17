window.Economy = {
  fmt(n) {
    if (!Number.isFinite(n)) return "∞";
    if (n < 1000) return n.toFixed(n < 10 ? 1 : 0);
    const units = ["K","M","B","T","Qa","Qi","Sx","Sp"];
    let i = -1;
    while (n >= 1000 && i < units.length - 1) { n /= 1000; i++; }
    return n.toFixed(n >= 100 ? 0 : n >= 10 ? 1 : 2) + units[i];
  },
  cost(base, count, growth=1.16) { return Math.floor(base * Math.pow(growth, count)); },
  clamp(n,min,max) { return Math.max(min,Math.min(max,n)); }
};