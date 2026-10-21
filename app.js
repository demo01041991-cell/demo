/* =============================================
   NexAuth — JavaScript Logic
   - Page switching with animations
   - Form validation
   - Password strength meter
   - Password visibility toggle
   - Toast notifications
   - Particle canvas animation
   - Social button interactions
   ============================================= */

'use strict';

/* ============================================================
   PARTICLE CANVAS
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x:     randomBetween(0, canvas.width),
      y:     randomBetween(0, canvas.height),
      r:     randomBetween(0.5, 1.8),
      dx:    randomBetween(-0.25, 0.25),
      dy:    randomBetween(-0.35, -0.05),
      alpha: randomBetween(0.1, 0.55),
      hue:   Math.random() > 0.5 ? 260 : 180,
    };
  }

  for (let i = 0; i < 110; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.y < -5 || p.x < -5 || p.x > canvas.width + 5) {
        Object.assign(p, createParticle());
        p.y = canvas.height + 5;
      }
    }
    animFrame = requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
let toastTimer = null;
function showToast(message, type = 'info', duration = 3200) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className   = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.className = 'toast';
  }, duration);
}

/* ============================================================
   PAGE SWITCHING
   ============================================================ */
const signinCard  = document.getElementById('signin-card');
const registerCard = document.getElementById('register-card');

function switchToRegister() {
  signinCard.classList.add('page-exit');
  setTimeout(() => {
    signinCard.classList.add('hidden');
    signinCard.classList.remove('page-exit');
    registerCard.classList.remove('hidden');
    registerCard.classList.add('page-enter');
    setTimeout(() => registerCard.classList.remove('page-enter'), 350);
  }, 280);
}

function switchToSignin() {
  registerCard.classList.add('page-exit');
  setTimeout(() => {
    registerCard.classList.add('hidden');
    registerCard.classList.remove('page-exit');
    signinCard.classList.remove('hidden');
    signinCard.classList.add('page-enter');
    setTimeout(() => signinCard.classList.remove('page-enter'), 350);
  }, 280);
}

document.getElementById('goto-register').addEventListener('click', switchToRegister);
document.getElementById('goto-register-2').addEventListener('click', switchToRegister);
document.getElementById('goto-signin').addEventListener('click', switchToSignin);
document.getElementById('goto-signin-2').addEventListener('click', switchToSignin);

/* ============================================================
   PASSWORD VISIBILITY TOGGLE
   ============================================================ */
function setupPasswordToggle(btnId, inputId) {
  const btn   = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    btn.textContent = isHidden ? '\uD83D\uDE48' : '\uD83D\uDC41'; // monkey / eye
    btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  });
}
setupPasswordToggle('si-toggle-pass',   'si-password');
setupPasswordToggle('reg-toggle-pass',  'reg-password');
setupPasswordToggle('reg-toggle-cpass', 'reg-cpassword');

/* ============================================================
   PASSWORD STRENGTH METER
   ============================================================ */
const regPasswordInput = document.getElementById('reg-password');
const strengthFill     = document.getElementById('strength-fill');
const strengthLabel    = document.getElementById('strength-label');

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score; // 0–6
}

const strengthConfig = [
  { pct: 0,   label: 'Strength',  color: 'hsl(230,25%,22%)' },
  { pct: 16,  label: 'Very Weak', color: 'hsl(355,85%,55%)' },
  { pct: 32,  label: 'Weak',      color: 'hsl(20,90%,55%)' },
  { pct: 50,  label: 'Fair',      color: 'hsl(38,92%,55%)' },
  { pct: 68,  label: 'Good',      color: 'hsl(145,65%,45%)' },
  { pct: 84,  label: 'Strong',    color: 'hsl(145,70%,50%)' },
  { pct: 100, label: 'Very Strong', color: 'hsl(160,75%,48%)' },
];

regPasswordInput.addEventListener('input', () => {
  const score = getPasswordStrength(regPasswordInput.value);
  const cfg   = strengthConfig[score];
  strengthFill.style.width      = cfg.pct + '%';
  strengthFill.style.background = cfg.color;
  strengthLabel.style.color     = cfg.color === 'hsl(230,25%,22%)' ? 'hsl(220,10%,40%)' : cfg.color;
  strengthLabel.textContent     = cfg.label;
});

/* ============================================================
   FORM VALIDATION HELPERS
   ============================================================ */
function setFieldState(groupId, errId, message) {
  const group = document.getElementById(groupId);
  const errEl = document.getElementById(errId);
  if (message) {
    group.classList.add('has-error');
    group.classList.remove('has-success');
    errEl.textContent = message;
    return false;
  } else {
    group.classList.remove('has-error');
    group.classList.add('has-success');
    errEl.textContent = '';
    return true;
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/* ============================================================
   SIGN IN FORM
   ============================================================ */
const signinForm = document.getElementById('signin-form');
const signinBtn  = document.getElementById('signin-submit-btn');

function validateSignIn() {
  let valid = true;

  const email    = document.getElementById('si-email').value.trim();
  const password = document.getElementById('si-password').value;

  if (!email) {
    valid = setFieldState('si-email-group', 'si-email-err', 'Email address is required.') && valid;
  } else if (!isValidEmail(email)) {
    valid = setFieldState('si-email-group', 'si-email-err', 'Please enter a valid email.') && valid;
  } else {
    setFieldState('si-email-group', 'si-email-err', null);
  }

  if (!password) {
    valid = setFieldState('si-pass-group', 'si-pass-err', 'Password is required.') && valid;
  } else if (password.length < 6) {
    valid = setFieldState('si-pass-group', 'si-pass-err', 'Password must be at least 6 characters.') && valid;
  } else {
    setFieldState('si-pass-group', 'si-pass-err', null);
  }

  return valid;
}

// Live validation on blur
document.getElementById('si-email').addEventListener('blur', () => {
  const v = document.getElementById('si-email').value.trim();
  if (!v) setFieldState('si-email-group', 'si-email-err', 'Email address is required.');
  else if (!isValidEmail(v)) setFieldState('si-email-group', 'si-email-err', 'Please enter a valid email.');
  else setFieldState('si-email-group', 'si-email-err', null);
});

signinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateSignIn()) return;

  // Simulate loading
  signinBtn.disabled = true;
  signinBtn.querySelector('.btn-text').hidden  = true;
  signinBtn.querySelector('.btn-arrow').hidden = true;
  signinBtn.querySelector('.btn-loader').hidden = false;

  setTimeout(() => {
    signinBtn.disabled = false;
    signinBtn.querySelector('.btn-text').hidden  = false;
    signinBtn.querySelector('.btn-arrow').hidden = false;
    signinBtn.querySelector('.btn-loader').hidden = true;
    showToast('Welcome back! Signed in successfully. ✓', 'success');
  }, 1800);
});

/* ============================================================
   REGISTER FORM
   ============================================================ */
const registerForm = document.getElementById('register-form');
const registerBtn  = document.getElementById('register-submit-btn');

function validateRegister() {
  let valid = true;

  const fname    = document.getElementById('reg-fname').value.trim();
  const lname    = document.getElementById('reg-lname').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const cpass    = document.getElementById('reg-cpassword').value;
  const terms    = document.getElementById('reg-terms').checked;

  // First name
  if (!fname) {
    valid = setFieldState('reg-fname-group', 'reg-fname-err', 'First name is required.') && valid;
  } else if (fname.length < 2) {
    valid = setFieldState('reg-fname-group', 'reg-fname-err', 'Minimum 2 characters.') && valid;
  } else {
    setFieldState('reg-fname-group', 'reg-fname-err', null);
  }

  // Last name
  if (!lname) {
    valid = setFieldState('reg-lname-group', 'reg-lname-err', 'Last name is required.') && valid;
  } else {
    setFieldState('reg-lname-group', 'reg-lname-err', null);
  }

  // Email
  if (!email) {
    valid = setFieldState('reg-email-group', 'reg-email-err', 'Email address is required.') && valid;
  } else if (!isValidEmail(email)) {
    valid = setFieldState('reg-email-group', 'reg-email-err', 'Please enter a valid email.') && valid;
  } else {
    setFieldState('reg-email-group', 'reg-email-err', null);
  }

  // Password
  if (!password) {
    valid = setFieldState('reg-pass-group', 'reg-pass-err', 'Password is required.') && valid;
  } else if (password.length < 8) {
    valid = setFieldState('reg-pass-group', 'reg-pass-err', 'Password must be at least 8 characters.') && valid;
  } else {
    setFieldState('reg-pass-group', 'reg-pass-err', null);
  }

  // Confirm password
  if (!cpass) {
    valid = setFieldState('reg-cpass-group', 'reg-cpass-err', 'Please confirm your password.') && valid;
  } else if (cpass !== password) {
    valid = setFieldState('reg-cpass-group', 'reg-cpass-err', 'Passwords do not match.') && valid;
  } else {
    setFieldState('reg-cpass-group', 'reg-cpass-err', null);
  }

  // Terms
  const termsErr = document.getElementById('reg-terms-err');
  if (!terms) {
    termsErr.textContent = 'You must agree to the Terms of Service.';
    valid = false;
  } else {
    termsErr.textContent = '';
  }

  return valid;
}

// Live validation on blur
document.getElementById('reg-email').addEventListener('blur', () => {
  const v = document.getElementById('reg-email').value.trim();
  if (!v) setFieldState('reg-email-group', 'reg-email-err', 'Email address is required.');
  else if (!isValidEmail(v)) setFieldState('reg-email-group', 'reg-email-err', 'Please enter a valid email.');
  else setFieldState('reg-email-group', 'reg-email-err', null);
});

document.getElementById('reg-cpassword').addEventListener('input', () => {
  const pass  = document.getElementById('reg-password').value;
  const cpass = document.getElementById('reg-cpassword').value;
  if (cpass && cpass !== pass) {
    setFieldState('reg-cpass-group', 'reg-cpass-err', 'Passwords do not match.');
  } else if (cpass && cpass === pass) {
    setFieldState('reg-cpass-group', 'reg-cpass-err', null);
  }
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateRegister()) return;

  // Simulate loading
  registerBtn.disabled = true;
  registerBtn.querySelector('.btn-text').hidden  = true;
  registerBtn.querySelector('.btn-arrow').hidden = true;
  registerBtn.querySelector('.btn-loader').hidden = false;

  setTimeout(() => {
    registerBtn.disabled = false;
    registerBtn.querySelector('.btn-text').hidden  = false;
    registerBtn.querySelector('.btn-arrow').hidden = false;
    registerBtn.querySelector('.btn-loader').hidden = true;
    showToast('Account created successfully! Welcome to NexAuth 🎉', 'success');
    // Optionally redirect to sign in
    setTimeout(switchToSignin, 1500);
  }, 2000);
});

/* ============================================================
   SOCIAL LOGIN BUTTONS
   ============================================================ */
function socialLogin(provider) {
  showToast(`Redirecting to ${provider} sign-in...`, 'info');
}

document.getElementById('signin-google').addEventListener('click', () => socialLogin('Google'));
document.getElementById('signin-github').addEventListener('click', () => socialLogin('GitHub'));
document.getElementById('reg-google').addEventListener('click', () => socialLogin('Google'));
document.getElementById('reg-github').addEventListener('click', () => socialLogin('GitHub'));

/* ============================================================
   FORGOT PASSWORD LINK
   ============================================================ */
document.getElementById('forgot-pass-link').addEventListener('click', (e) => {
  e.preventDefault();
  showToast('Password reset link sent to your email. 📧', 'info');
});

/* ============================================================
   INPUT FOCUS EFFECTS — subtle icon glow
   ============================================================ */
document.querySelectorAll('.field-input').forEach(input => {
  const wrap = input.closest('.field-wrap');
  const icon = wrap && wrap.querySelector('.field-icon');
  if (!icon) return;
  input.addEventListener('focus', () => {
    icon.style.opacity = '0.85';
    icon.style.transform = 'scale(1.1)';
    icon.style.transition = 'all 150ms ease';
  });
  input.addEventListener('blur', () => {
    icon.style.opacity = '';
    icon.style.transform = '';
  });
});
