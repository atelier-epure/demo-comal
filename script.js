/* ===========================================================
   COMAL — script.js · vanilla, zéro dépendance runtime fragile
   =========================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- AOS ---------- */
  if (window.AOS) {
    AOS.init({ duration: 650, once: true, offset: 80, disable: reduceMotion });
  }

  /* ---------- Année footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav scrolled ---------- */
  var nav = document.getElementById('nav');
  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  }
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- Burger / menu mobile ---------- */
  var burger = document.getElementById('burger');
  var navMobile = document.getElementById('nav-mobile');
  function closeMobile() {
    if (!burger || !navMobile) return;
    burger.setAttribute('aria-expanded', 'false');
    navMobile.hidden = true;
    document.body.style.overflow = '';
  }
  if (burger && navMobile) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      if (open) { closeMobile(); }
      else {
        burger.setAttribute('aria-expanded', 'true');
        navMobile.hidden = false;
        document.body.style.overflow = 'hidden';
      }
    });
    navMobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobile);
    });
  }

  /* ---------- 1. Compteurs animés ---------- */
  var counters = document.querySelectorAll('.counter');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------- 4. Reveal mot par mot ---------- */
  document.querySelectorAll('.reveal-words').forEach(function (title) {
    if (title.dataset.split) return;
    title.dataset.split = '1';
    var html = title.innerHTML;
    // Découpe en respectant les balises <em>...</em>
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    var out = '';
    var idx = 0;
    function wrapText(text) {
      return text.split(/(\s+)/).map(function (tok) {
        if (/^\s+$/.test(tok) || tok === '') return tok;
        return '<span class="word" style="--i:' + (idx++) + '">' + tok + '</span>';
      }).join('');
    }
    tmp.childNodes.forEach(function (node) {
      if (node.nodeType === 3) {
        out += wrapText(node.textContent);
      } else if (node.nodeType === 1) {
        var tag = node.tagName.toLowerCase();
        out += '<' + tag + ' class="' + node.className + '">' + wrapText(node.textContent) + '</' + tag + '>';
      }
    });
    title.innerHTML = out;
  });

  /* ---------- IntersectionObserver: reveal-words + counters ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      if (el.classList.contains('reveal-words')) el.classList.add('visible');
      if (el.classList.contains('counter')) animateCounter(el);
      io.unobserve(el);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.reveal-words').forEach(function (el) { io.observe(el); });
  counters.forEach(function (el) { io.observe(el); });

  /* ---------- Galerie : filtres + voir plus/moins ---------- */
  var grid = document.getElementById('galerie-grid');
  var filtres = document.getElementById('galerie-filtres');
  var moreBtn = document.getElementById('galerie-more');
  var lessBtn = document.getElementById('galerie-less');

  function expandGallery() {
    if (grid) grid.classList.add('expanded');
  }
  function collapseGallery() {
    if (!grid) return;
    grid.classList.remove('expanded');
    var gy = document.getElementById('galerie');
    if (gy) gy.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  if (moreBtn) moreBtn.addEventListener('click', expandGallery);
  if (lessBtn) lessBtn.addEventListener('click', collapseGallery);

  if (filtres && grid) {
    filtres.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var cat = btn.getAttribute('data-cat');
      filtres.querySelectorAll('button').forEach(function (b) { b.classList.remove('actif'); });
      btn.classList.add('actif');
      grid.setAttribute('data-filter', cat);
      if (cat !== 'all') expandGallery(); // pour voir tous les résultats du filtre

      grid.querySelectorAll('picture').forEach(function (pic) {
        var show = (cat === 'all') || pic.getAttribute('data-cat') === cat;
        pic.style.display = show ? '' : 'none';
      });
    });
  }

  /* ---------- 6. Parallax hero (scroll-based) ---------- */
  var heroImg = document.querySelector('.hero__image img');
  if (heroImg && !reduceMotion) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight) {
          heroImg.style.transform = 'translateY(' + (y * 0.18) + 'px) scale(1.06)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Curseur custom (street food) ---------- */
  var dot = document.getElementById('cursor-dot');
  if (dot && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    document.body.classList.add('has-cursor-dot');
    window.addEventListener('mousemove', function (e) {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    }, { passive: true });
    document.querySelectorAll('a, button, .galerie picture, .menu-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { dot.classList.add('grow'); });
      el.addEventListener('mouseleave', function () { dot.classList.remove('grow'); });
    });
  } else if (dot) {
    dot.style.display = 'none';
  }

  /* ---------- Smooth scroll ancres (offset nav) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

})();
