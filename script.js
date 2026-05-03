/* ============================================================
   PORTFOLIO — TACTILE FORMALIST
   script.js
   ============================================================ */


/* ── CUSTOM CURSOR ──────────────────────────────────────────── */

const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  // Dot: snaps to mouse
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';

  // Ring: lags behind with easing
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';

  requestAnimationFrame(animateCursor);
}

animateCursor();


/* ── NAV — SCROLL-TRIGGERED BLUR ───────────────────────────── */

const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});


/* ── THEME TOGGLE ───────────────────────────────────────────── */

const themeBtn = document.getElementById('themeBtn');
let isLight = false;

themeBtn.addEventListener('click', () => {
  isLight = !isLight;
  document.body.classList.toggle('light', isLight);
  themeBtn.textContent = isLight ? '◐ Dark' : '◐ Light';
});


/* ── SCROLL REVEAL (IntersectionObserver) ───────────────────── */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Animate skill bars when their container comes into view
        entry.target.querySelectorAll('.bar-fill').forEach((bar) => {
          bar.classList.add('animated');
        });
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});


/* ── PARALLAX HERO BACKGROUND TEXT ─────────────────────────── */

const heroBgText = document.querySelector('.hero-bg-text');

window.addEventListener('scroll', () => {
  if (heroBgText) {
    const offset = window.scrollY * 0.25;
    heroBgText.style.transform = `translateY(calc(-50% + ${offset}px))`;
  }
});


/* ── GENERATIVE CANVAS ARTWORK ──────────────────────────────── */

/**
 * Registers a draw function for a canvas element.
 * Uses ResizeObserver to re-draw whenever the canvas size changes.
 *
 * @param {string}   id  - The canvas element's id
 * @param {Function} fn  - Draw function receiving (ctx, width, height)
 */
function drawCanvas(id, fn) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  const ro = new ResizeObserver(() => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    fn(canvas.getContext('2d'), canvas.width, canvas.height);
  });

  ro.observe(canvas);
}


/* -- Canvas 1: Bold geometric halftone ----------------------- */
drawCanvas('c1', (ctx, W, H) => {
  ctx.fillStyle = '#0c0b09';
  ctx.fillRect(0, 0, W, H);

  const cols = 18, rows = 12;
  const cw = W / cols, ch = H / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t     = c / cols + (r / rows) * 0.7;
      const size  = 0.15 + 0.75 * Math.abs(Math.sin(t * Math.PI * 1.4));
      const alpha = 0.3  + 0.7  * Math.abs(Math.cos(t * Math.PI));

      ctx.fillStyle = `rgba(201, 79, 34, ${alpha})`;
      ctx.beginPath();
      ctx.arc(c * cw + cw / 2, r * ch + ch / 2, size * cw * 0.42, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Diagonal overlay lines
  ctx.strokeStyle = 'rgba(242, 237, 228, 0.06)';
  ctx.lineWidth   = 1;
  for (let i = -H; i < W + H; i += 24) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + H, H);
    ctx.stroke();
  }
});


/* -- Canvas 2: High-contrast letterform ---------------------- */
drawCanvas('c2', (ctx, W, H) => {
  ctx.fillStyle = '#f2ede4';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle    = '#0c0b09';
  ctx.font         = `bold ${H * 1.1}px 'Bebas Neue', serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('B', W / 2, H / 2);

  // Noise hatching overlay
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const l = 8 + Math.random() * 14;
    const a = Math.random() * Math.PI;

    ctx.strokeStyle = `rgba(201, 79, 34, ${0.03 + Math.random() * 0.1})`;
    ctx.lineWidth   = 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    ctx.stroke();
  }
});


/* -- Canvas 3: Grain texture print --------------------------- */
drawCanvas('c3', (ctx, W, H) => {
  ctx.fillStyle = '#1c1a16';
  ctx.fillRect(0, 0, W, H);

  const blocks = [
    [0,       0,       W * 0.6, H * 0.55, '#c94f22'],
    [W * 0.6, 0,       W * 0.4, H,        '#e8a87c'],
    [0,       H * 0.55,W * 0.6, H * 0.45, '#0c0b09'],
  ];

  blocks.forEach(([x, y, w, h, color]) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  });

  // Dark grain
  for (let i = 0; i < 4000; i++) {
    ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + Math.random() * 0.2})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }

  // Light grain
  for (let i = 0; i < 1500; i++) {
    ctx.fillStyle = `rgba(242, 237, 228, ${0.02 + Math.random() * 0.08})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }
});


/* -- Canvas 4: Structure / Noise grid ------------------------ */
drawCanvas('c4', (ctx, W, H) => {
  ctx.fillStyle = '#0c0b09';
  ctx.fillRect(0, 0, W, H);

  const g = 28;

  // Grid lines
  ctx.strokeStyle = 'rgba(201, 79, 34, 0.5)';
  ctx.lineWidth   = 1;

  for (let x = 0; x < W; x += g) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += g) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Randomly filled cells
  for (let x = 0; x < W; x += g) {
    for (let y = 0; y < H; y += g) {
      if (Math.random() < 0.35) {
        const alpha = 0.4 + Math.random() * 0.6;
        ctx.fillStyle = Math.random() > 0.5
          ? `rgba(201, 79, 34, ${alpha})`
          : `rgba(232, 168, 124, ${alpha * 0.5})`;
        ctx.fillRect(x + 1, y + 1, g - 2, g - 2);
      }
    }
  }
});


/* -- Canvas 5: Tally marks / mark & counter ------------------ */
drawCanvas('c5', (ctx, W, H) => {
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#1a1714';
  ctx.lineWidth   = 2.5;

  const groups = 7;
  const gw     = W / (groups + 1);

  for (let g = 0; g < groups; g++) {
    const gx    = gw * (g + 1);
    const gy    = H / 2;
    const markH = H * 0.28;

    // Four vertical strokes
    for (let m = 0; m < 4; m++) {
      const mx = gx - 12 + m * 7;
      ctx.beginPath();
      ctx.moveTo(mx, gy - markH);
      ctx.lineTo(mx, gy + markH);
      ctx.stroke();
    }

    // Diagonal fifth stroke on every other group
    if (g % 2 === 0) {
      ctx.beginPath();
      ctx.moveTo(gx - 26, gy - markH * 1.1);
      ctx.lineTo(gx +  2, gy + markH * 1.1);
      ctx.stroke();
    }
  }

  // Accent dots
  ctx.fillStyle = '#c94f22';
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * W,
      Math.random() * H,
      2 + Math.random() * 5,
      0, Math.PI * 2
    );
    ctx.fill();
  }
});


/* -- Canvas 6: Editorial paper columns ----------------------- */
drawCanvas('c6', (ctx, W, H) => {
  ctx.fillStyle = '#e8e0d5';
  ctx.fillRect(0, 0, W, H);

  const cols = 5;
  const cw   = W / cols;

  for (let c = 0; c < cols; c++) {
    if (c === 2) {
      // Black centre column
      ctx.fillStyle = '#1a1714';
      ctx.fillRect(c * cw, 0, cw, H);
      continue;
    }

    // Text-line rules
    ctx.strokeStyle = 'rgba(26, 23, 20, 0.12)';
    ctx.lineWidth   = 0.5;
    const lines     = 18;

    for (let l = 0; l < lines; l++) {
      const y = (H / lines) * l + 30;
      ctx.beginPath();
      ctx.moveTo(c * cw + 12, y);
      ctx.lineTo((c + 1) * cw - 12, y);
      ctx.stroke();
    }
  }

  // Large accent letter over centre column
  ctx.fillStyle    = '#c94f22';
  ctx.font         = `bold ${H * 0.65}px 'Bebas Neue'`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('A', W / 2, H / 2);
});
