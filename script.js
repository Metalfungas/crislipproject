(() => {
  const shell = document.getElementById("pageShell");
  const glow = document.querySelector(".top-glow");

  // Soft mouse drift for the glow layer only
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

 window.addEventListener("mousemove", (e) => {
  const nx = (e.clientX / window.innerWidth - 0.5) * 10;
  const ny = (e.clientY / window.innerHeight - 0.5) * 10;

  targetX = nx;
  targetY = ny;
});

  function animate() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    if (glow) {
      glow.style.transform = `translate3d(${currentX * 0.35}px, ${currentY * 0.35}px, 0)`;
    }

    if (shell) {
      shell.style.setProperty("--mouse-x", `${currentX}px`);
      shell.style.setProperty("--mouse-y", `${currentY}px`);
    }

    requestAnimationFrame(animate);
  }
  animate();

  // Tiny floating light particles
  const particleCount = 14;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement("span");
    p.className = "bg-particle";
    p.style.cssText = `
      position: fixed;
      left: ${Math.random() * 100}vw;
      top: ${Math.random() * 100}vh;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      border-radius: 999px;
      background: rgba(255,255,255,${0.12 + Math.random() * 0.18});
      box-shadow: 0 0 18px rgba(255,255,255,0.20);
      pointer-events: none;
      z-index: 0;
      opacity: ${0.25 + Math.random() * 0.45};
      filter: blur(${Math.random() * 0.5}px);
    `;
    document.body.appendChild(p);
    particles.push({
      el: p,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: -0.1 + Math.random() * 0.2,
      vy: -0.08 + Math.random() * 0.16,
      drift: 0.3 + Math.random() * 0.8
    });
  }

  function moveParticles() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    }

    requestAnimationFrame(moveParticles);
  }
  moveParticles();

  // Safety remove for intro overlay
  setTimeout(() => {
    const intro = document.getElementById("intro");
    if (intro) intro.remove();
  }, 5200);
})();
