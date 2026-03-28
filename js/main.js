/* ============================================================
   APK Manager — Main JavaScript
   Carousel, Hamburger Menu, Animations, Toast Dismiss
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initCarousel();
  initFadeIn();
  initToastDismiss();
  initRxcTabs();
});

/* ---------- Hamburger Menu ---------- */
function initHamburger() {
  const btn     = document.querySelector('.hamburger');
  const nav     = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');
  if (!btn || !nav) return;

  const toggle = () => {
    btn.classList.toggle('active');
    nav.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  };

  btn.addEventListener('click', toggle);
  if (overlay) overlay.addEventListener('click', toggle);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) toggle();
  });
}

/* ---------- Carousel ---------- */
function initCarousel() {
  const wrapper = document.querySelector('.carousel-wrapper');
  if (!wrapper) return;

  const track  = wrapper.querySelector('.carousel-track');
  const slides = wrapper.querySelectorAll('.carousel-slide');
  const dots   = wrapper.parentElement.querySelectorAll('.carousel-dot');
  const prev   = wrapper.querySelector('.carousel-btn.prev');
  const next   = wrapper.querySelector('.carousel-btn.next');

  if (slides.length <= 1) return;

  let current  = 0;
  let interval = null;
  const total  = slides.length;

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function autoPlay() {
    interval = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAuto() {
    clearInterval(interval);
    autoPlay();
  }

  if (prev) prev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  if (next) next.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

  // Swipe support for mobile
  let startX = 0;
  let deltaX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchmove',  (e) => { deltaX = e.touches[0].clientX - startX; }, { passive: true });
  track.addEventListener('touchend',   () => {
    if (Math.abs(deltaX) > 50) {
      goTo(deltaX < 0 ? current + 1 : current - 1);
      resetAuto();
    }
    deltaX = 0;
  });

  goTo(0);
  autoPlay();
}

/* ---------- Fade-In on Scroll ---------- */
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach((el) => observer.observe(el));
}

/* ---------- Toast Auto-Dismiss ---------- */
function initToastDismiss() {
  const toasts = document.querySelectorAll('.message-toast');
  toasts.forEach((toast) => {
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  });
}

/* ---------- Royal x Casino Tabs ---------- */
function initRxcTabs() {
  const tabs = document.querySelectorAll('.rxc-tab');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      // Toggle active tab
      document.querySelectorAll('.rxc-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Toggle active content
      document.querySelectorAll('.rxc-tab-content').forEach((c) => c.classList.remove('active'));
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });
}

