'use strict';
/* ================================================
   ELONA STUDIO — SHARED JS
   Nav, Reveal observer, Testimonials carousel,
   Footer year
================================================ */

(function () {

  /* Footer year */
  document.querySelectorAll('.footer-year').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ── NAV ── */
  const nav     = document.querySelector('.nav');
  const burger  = document.getElementById('nav-burger');
  const navList = document.getElementById('nav-list');

  if (nav) {
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 55), { passive: true });
  }

  if (burger && navList) {
    burger.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
    });
    navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navList.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.querySelector('i').className = 'fas fa-bars';
    }));
  }

  /* Mark active nav link by comparing href to current page */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__list a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith(currentPage) || (currentPage === 'index.html' && href === 'index.html')) {
      a.classList.add('nav-active');
    }
  });

  /* ── REVEAL ── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('active');
      revealObs.unobserve(e.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── TESTIMONIALS CAROUSEL ── */
  const track    = document.getElementById('testimonials-track');
  const dots     = [...document.querySelectorAll('.testimonials__dot')];
  const slides   = [...document.querySelectorAll('.testimonial-slide')];
  const carousel = document.getElementById('testimonials-carousel');

  if (track && slides.length) {
    let cur = 0, autoTimer, startX = 0, isDragging = false;

    function goTo(i) {
      cur = ((i % slides.length) + slides.length) % slides.length;
      track.style.transform = `translateX(-${cur * 100}%)`;
      dots.forEach((d, idx) => {
        d.classList.toggle('active', idx === cur);
        d.setAttribute('aria-current', idx === cur ? 'true' : 'false');
      });
    }

    function resetTimer() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(cur + 1), 5500);
    }

    const btnNext = document.getElementById('testi-next');
    const btnPrev = document.getElementById('testi-prev');
    if (btnNext) btnNext.addEventListener('click', () => { goTo(cur + 1); resetTimer(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { goTo(cur - 1); resetTimer(); });
    dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.index); resetTimer(); }));

    /* Touch swipe */
    carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) { dx < 0 ? goTo(cur + 1) : goTo(cur - 1); resetTimer(); }
    });

    /* Mouse drag */
    carousel.addEventListener('mousedown',  e => { startX = e.clientX; isDragging = true; });
    carousel.addEventListener('mouseup',    e => {
      if (!isDragging) return; isDragging = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 60) { dx < 0 ? goTo(cur + 1) : goTo(cur - 1); resetTimer(); }
    });
    carousel.addEventListener('mouseleave', () => { isDragging = false; });

    resetTimer();
  }

})();
