/* ============================================================
   GAIA JOURNAL — shared interactivity
   - transparent-over-hero nav that solidifies on scroll (index)
   - injected hamburger + mobile menu (all pages)
   - scroll-reveal via IntersectionObserver
   - reading-progress bar + back-to-top (article pages)
   - editorial drop cap on the opening paragraph
   ============================================================ */
(function () {
  'use strict';

  const nav = document.querySelector('nav');
  const isArticle = !!document.querySelector('.article');
  const solidNav = document.body.classList.contains('nav-solid');

  /* ---- nav solidify on scroll (index only; article nav is always solid) ---- */
  if (nav && !solidNav) {
    const onScroll = () => nav.classList.toggle('solid', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- build hamburger + mobile menu from the existing nav links ---- */
  const navRight = document.querySelector('.nav-right');
  const navLinks = document.querySelector('.nav-links');
  if (navRight && navLinks) {
    const burger = document.createElement('button');
    burger.className = 'hamburger';
    burger.setAttribute('aria-label', 'Menu');
    burger.innerHTML = '<span></span><span></span><span></span>';
    navRight.appendChild(burger);

    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    navLinks.querySelectorAll('a').forEach(a => {
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent;
      if (a.classList.contains('active')) link.classList.add('active');
      menu.appendChild(link);
    });
    const foot = document.createElement('div');
    foot.className = 'mobile-menu-footer';
    foot.textContent = 'Gaia Residence · Natural Luxury';
    menu.appendChild(foot);
    document.body.appendChild(menu);

    const toggle = (open) => {
      burger.classList.toggle('open', open);
      menu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
    window.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  /* ---- editorial drop cap on first body paragraph ---- */
  const inner = document.querySelector('.article-inner');
  if (inner) {
    const firstH2 = inner.querySelector('h2');
    const cands = [...inner.querySelectorAll('p:not(.lede):not(.disclaimer)')];
    // drop cap only on a genuine opening paragraph (before the first section heading)
    const intro = cands.find(p => !firstH2 || (p.compareDocumentPosition(firstH2) & Node.DOCUMENT_POSITION_FOLLOWING));
    if (intro) intro.classList.add('first');
  }

  /* ---- auto-tag content blocks for scroll reveal ---- */
  const revealSelectors = [
    '.j-section .eyebrow', '.featured', '.section-title',
    '.post-grid', '.cta-strip > div', '.cta-strip .btn-primary',
    '.article-inner h2', '.article-inner > p:not(.lede)',
    '.article-inner figure', '.pullquote', '.article-inner ul',
    '.stat-row', '.disclaimer', '.divider-mark', '.signoff'
  ];
  const revealEls = document.querySelectorAll(revealSelectors.join(','));
  if ('IntersectionObserver' in window) {
    revealEls.forEach(el => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---- reading progress bar (article pages) ---- */
  if (isArticle) {
    const bar = document.createElement('div');
    bar.className = 'read-progress';
    document.body.appendChild(bar);
    const article = document.querySelector('.article');
    const update = () => {
      const start = article.offsetTop;
      const total = article.offsetHeight - window.innerHeight;
      const pct = Math.min(1, Math.max(0, (window.scrollY - start) / total));
      bar.style.width = (pct * 100) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---- back to top ---- */
  const toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '↑';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const toTopVis = () => toTop.classList.toggle('show', window.scrollY > 700);
  window.addEventListener('scroll', toTopVis, { passive: true });
  toTopVis();
})();
