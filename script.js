/* ================= CANVAS SETUP ================= */
const bg = document.getElementById("bg");
const starsCanvas = document.getElementById("stars");
const particlesCanvas = document.getElementById("particles");

const b = bg?.getContext("2d");
const s = starsCanvas?.getContext("2d");
const p = particlesCanvas?.getContext("2d");

function resize(){
  if(!bg) return;
  bg.width = starsCanvas.width = particlesCanvas.width = innerWidth;
  bg.height = starsCanvas.height = particlesCanvas.height = innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ================= SOFT GALAXY GLOWS ================= */
let glows = [];

function makeGlows(){
  if(!bg) return;

  glows = [];

  const colors = [
    "170, 70, 255",  // purple
    "0, 185, 255",   // blue
    "255, 70, 190"   // pink
  ];

  const count = 30; // more = richer galaxy, still light

  for(let i = 0; i < count; i++){
    glows.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: 260 + Math.random() * 500,   // BIG soft glows
      vx: (Math.random() - 0.5) * 0.06, // slow movement
      vy: (Math.random() - 0.5) * 0.06,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: 0.00012 + Math.random() * 0.0002,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.025 + Math.random() * 0.03 // LOW opacity
    });
  }
}

makeGlows();

/* ================= NEBULA RENDER ================= */
function nebula(){
  if(!b) return;

  b.clearRect(0, 0, bg.width, bg.height);
  b.globalCompositeOperation = "lighter";

  const t = Date.now();

  for(const g of glows){

    const wobbleX = Math.sin(t * g.driftSpeed + g.drift) * 22;
    const wobbleY = Math.cos(t * g.driftSpeed * 0.9 + g.drift) * 22;

    const x = g.x + wobbleX;
    const y = g.y + wobbleY;

    const grad = b.createRadialGradient(x, y, 0, x, y, g.r);

    grad.addColorStop(0, `rgba(${g.color}, ${g.alpha})`);
    grad.addColorStop(0.3, `rgba(${g.color}, ${g.alpha * 0.5})`);
    grad.addColorStop(0.6, `rgba(${g.color}, ${g.alpha * 0.2})`);
    grad.addColorStop(1, "transparent");

    b.fillStyle = grad;
    b.beginPath();
    b.arc(x, y, g.r, 0, Math.PI * 2);
    b.fill();

    g.x += g.vx;
    g.y += g.vy;

    // wrap around screen
    if(g.x < -600) g.x = innerWidth + 600;
    if(g.x > innerWidth + 600) g.x = -600;
    if(g.y < -600) g.y = innerHeight + 600;
    if(g.y > innerHeight + 600) g.y = -600;
  }
}

/* ================= STARS ================= */
let stars = [];

function makeStars(){
  if(!s) return;

  stars = [];

  for(let i = 0; i < 220; i++){
    stars.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.4,
      vy: 0.08 + Math.random() * 0.15
    });
  }
}

makeStars();

function drawStars(){
  if(!s) return;

  s.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

  for(const st of stars){
    s.beginPath();
    s.arc(st.x, st.y, st.r, 0, Math.PI * 2);
    s.fillStyle = "rgba(255,255,255,0.85)";
    s.fill();

    st.y += st.vy;

    if(st.y > innerHeight){
      st.y = -2;
      st.x = Math.random() * innerWidth;
    }
  }
}

/* ================= FLOATING PARTICLES ================= */
let parts = [];

function makeParticles(){
  if(!p) return;

  parts = [];

  for(let i = 0; i < 70; i++){
    parts.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15
    });
  }
}

makeParticles();

function drawParticles(){
  if(!p) return;

  p.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

  for(const pt of parts){
    p.beginPath();
    p.arc(pt.x, pt.y, 1.6, 0, Math.PI * 2);
    p.fillStyle = "rgba(255,255,255,0.22)";
    p.fill();

    pt.x += pt.vx;
    pt.y += pt.vy;

    if(pt.x < 0) pt.x = innerWidth;
    if(pt.x > innerWidth) pt.x = 0;
    if(pt.y < 0) pt.y = innerHeight;
    if(pt.y > innerHeight) pt.y = 0;
  }
}

/* ================= MAIN LOOP ================= */
function animate(){
  nebula();
  drawStars();
  drawParticles();
  requestAnimationFrame(animate);
}

animate();

/* ================= SAFE INIT ON PAGE LOAD ================= */
window.addEventListener("load", () => {
  resize();
  makeGlows();
  makeStars();
  makeParticles();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.15
});

document.querySelectorAll(".reveal").forEach(el => {
  observer.observe(el);
});
