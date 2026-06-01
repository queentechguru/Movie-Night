/* ============================================
   OPERATION MOVIE NIGHT — script.js (v2)
   No = big & runs away | Yes = tiny & hidden
   ============================================ */

/* ---- Floating Popcorn Emojis ---- */
(function spawnFloaters() {
  const emojis = ['🍿','🎬','🎥','🎞️','🌍','❤️','😂'];
  const container = document.getElementById('floaters');
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.classList.add('floater');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left            = Math.random() * 100 + 'vw';
    el.style.animationDuration = (8 + Math.random() * 14) + 's';
    el.style.animationDelay    = (Math.random() * 14) + 's';
    el.style.fontSize          = (0.9 + Math.random() * 0.8) + 'rem';
    container.appendChild(el);
  }
})();


/* ---- Runaway NO Button ---- */
const btnNo   = document.getElementById('btnNo');
const btnYes  = document.getElementById('btnYes');
const yesHint = document.getElementById('yesHint');
const yesLabel = document.getElementById('yesLabel');

let escapeCount = 0;

// Messages that evolve as he keeps trying
const escapeMsgs = [
  "❌ Nope. Bye. 🏃‍♂️",
  "❌ I said no. Stop.",
  "❌ SIR. I am RUNNING.",
  "❌ This is cardio now.",
  "❌ You can't catch me 🤣",
  "❌ Bro. Give up.",
  "❌ I have places to be.",
  "❌ Still no. Still running.",
  "❌ You're embarrassing yourself.",
  "❌ ...okay fine just click yes 💀",
];

// Hints that appear in the yes zone as he keeps failing
const hintMsgs = [
  "",
  "",
  "psst... there's another button down here 👀",
  "that tiny thing below? yeah. that's your lifeline.",
  "just saying... yes is RIGHT THERE 😂",
  "bro the button is LITERALLY in front of you 💀",
  "okay at this point i'm worried about you.",
  "✅ YES IS RIGHT HERE. CLICK IT. PLEASE.",
];

function moveNoButton() {
  const margin = 20;
  const w = btnNo.offsetWidth;
  const h = btnNo.offsetHeight;
  const maxX = window.innerWidth  - w  - margin;
  const maxY = window.innerHeight - h - margin;

  const newX = margin + Math.random() * (maxX - margin * 2);
  const newY = margin + Math.random() * (maxY - margin * 2);

  btnNo.style.position = 'fixed';
  btnNo.style.left     = newX + 'px';
  btnNo.style.top      = newY + 'px';
  btnNo.style.zIndex   = '50';

  // Update No button text
  if (escapeCount < escapeMsgs.length) {
    btnNo.textContent = escapeMsgs[escapeCount];
  }

  // Update hint text above Yes
  const hintIndex = Math.min(escapeCount, hintMsgs.length - 1);
  yesHint.textContent = hintMsgs[hintIndex];

  // After 4 escapes, start making Yes more visible
  if (escapeCount >= 4) {
    btnYes.classList.add('revealed');
    btnYes.textContent = '✅ YES, I\'M IN (finally)';
    yesLabel.style.color = 'var(--yes-green)';
    yesLabel.textContent = '^ click this one. it works. i promise.';
  }

  escapeCount++;
}

// Desktop
btnNo.addEventListener('mouseover', moveNoButton);

// Mobile
btnNo.addEventListener('touchstart', function(e) {
  e.preventDefault();
  moveNoButton();
}, { passive: false });


/* ---- YES Handler ---- */
function handleYes() {
  btnNo.style.display = 'none';
  launchConfetti();
  setTimeout(function() {
    document.getElementById('modalOverlay').classList.add('active');
  }, 500);
}


/* ---- Modal Close ---- */
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  stopConfetti();
}


/* ---- Confetti ---- */
let confettiCanvas, confettiCtx, confettiParticles, confettiAnimId;

function launchConfetti() {
  confettiCanvas = document.createElement('canvas');
  confettiCanvas.id = 'confetti-canvas';
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  document.body.appendChild(confettiCanvas);
  confettiCtx = confettiCanvas.getContext('2d');

  const colors = ['#c9a227','#27ae60','#e63946','#f9ca24','#ffffff','#74b9ff','#a29bfe'];
  confettiParticles = [];
  for (let i = 0; i < 180; i++) {
    confettiParticles.push({
      x:     Math.random() * confettiCanvas.width,
      y:     Math.random() * confettiCanvas.height - confettiCanvas.height,
      w:     6 + Math.random() * 10,
      h:     4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 2 + Math.random() * 4,
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - 0.5) * 0.2,
      drift: (Math.random() - 0.5) * 2,
    });
  }
  animateConfetti();
}

function animateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach(function(p) {
    p.y += p.speed; p.x += p.drift; p.angle += p.spin;
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.angle);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
    if (p.y > confettiCanvas.height) p.y = -10;
    if (p.x > confettiCanvas.width)  p.x = 0;
    if (p.x < 0) p.x = confettiCanvas.width;
  });
  confettiAnimId = requestAnimationFrame(animateConfetti);
}

function stopConfetti() {
  if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
  if (confettiCanvas) { confettiCanvas.remove(); confettiCanvas = null; }
}

window.addEventListener('resize', function() {
  if (confettiCanvas) {
    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
});


/* ---- Title Glitch on Load ---- */
(function titleGlitch() {
  const title = document.querySelector('.title-accent');
  if (!title) return;
  const original  = title.textContent;
  const glitchChars = '!@#$%^&*ABCXYZabcx01';
  let iterations = 0;
  const maxIter  = 20;

  function glitch() {
    if (iterations >= maxIter) { title.textContent = original; return; }
    title.textContent = original.split('').map(function(ch) {
      if (ch === ' ') return ' ';
      return Math.random() > (iterations / maxIter)
        ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
        : ch;
    }).join('');
    iterations++;
    setTimeout(glitch, 60);
  }
  setTimeout(glitch, 900);
})();