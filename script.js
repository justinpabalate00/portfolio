// Theme (saved per browser, falls back to system preference)
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeBtn');
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));

  if (btn) {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }
})();

// Mobile menu
(function () {
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if (!menuBtn || !nav) return;
  const close = () => { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); };
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.addEventListener('click', e => { if (!nav.contains(e.target) && !menuBtn.contains(e.target)) close(); });
})();

// Scroll reveal, score counters and progress bars
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const countUp = el => {
    const target = parseInt(el.dataset.count, 10);
    if (reduce) { el.textContent = target; return; }
    const start = performance.now();
    const dur = 1100;
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in');
      el.querySelectorAll('[data-count]').forEach(countUp);
      el.querySelectorAll('.bar i').forEach(b => { b.style.width = b.dataset.w; });
      io.unobserve(el);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

// Poster tilt on hover (desktop only)
(function () {
  const poster = document.querySelector('[data-tilt]');
  if (!poster || !window.matchMedia('(hover: hover)').matches) return;
  poster.addEventListener('mousemove', e => {
    const r = poster.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    poster.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.03)`;
  });
  poster.addEventListener('mouseleave', () => { poster.style.transform = ''; });
})();

// Copy email button
(function () {
  const btn = document.getElementById('copyBtn');
  const toast = document.getElementById('toast');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const email = btn.dataset.email;
    try { await navigator.clipboard.writeText(email); } catch (e) {}
    if (toast) {
      toast.textContent = 'Email copied!';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1800);
    }
  });
})();
