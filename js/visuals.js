/* Idle Tech Empire v1.2 — lightweight ambient visual effects.
   Decorative only: no game state, economy or save data is modified. */
(() => {
  "use strict";
  const canvas = document.getElementById("fx-canvas");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let width = 0, height = 0, particles = [], frame = 0;
  const mobile = () => window.innerWidth < 720;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = mobile() ? 22 : 48;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      r: Math.random() * 1.6 + .35, vy: Math.random() * .24 + .08,
      vx: (Math.random() - .5) * .16, a: Math.random() * .45 + .12,
      phase: Math.random() * Math.PI * 2
    }));
  };
  const draw = () => {
    frame++;
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.y -= p.vy; p.x += p.vx; p.phase += .012;
      if (p.y < -5) { p.y = height + 5; p.x = Math.random() * width; }
      if (p.x < -5) p.x = width + 5;
      if (p.x > width + 5) p.x = -5;
      const alpha = p.a * (.65 + Math.sin(p.phase) * .35);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(105,224,255,${alpha})`; ctx.fill();
    }
    if (frame % 2 === 0) requestAnimationFrame(draw);
    else requestAnimationFrame(draw);
  };
  resize(); window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) requestAnimationFrame(draw); });
  requestAnimationFrame(draw);

  // Add short-lived visual feedback to the existing benchmark interaction.
  const benchmark = document.getElementById("benchmark");
  if (benchmark) benchmark.addEventListener("click", () => {
    benchmark.classList.remove("benchmark-fired");
    void benchmark.offsetWidth;
    benchmark.classList.add("benchmark-fired");
    window.setTimeout(() => benchmark.classList.remove("benchmark-fired"), 650);
  });
})();
