/**
 * Portfólio — Rafael Savioli
 * Sem dependências externas. Degrada com elegância se o JS falhar.
 */
(function () {
  'use strict';

  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---------- 1. Ano no rodapé ---------- */
  $$('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- 2. Preloader: some ao pintar, nunca segura a pagina ---------- */
  var preloader = $('.preloader');
  if (preloader) {
    // so assume o controle do preloader se ele existir no markup
    preloader.hidden = false;
    var hide = function () {
      if (preloader.classList.contains('is-done')) return;
      preloader.classList.add('is-done');
      window.setTimeout(function () {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 600);
    };
    if (doc.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
    window.setTimeout(hide, 2500); // rede de seguranca
  }

  /* ---------- 3. Nav ganha fundo ao rolar ---------- */
  var nav = doc.getElementById('nav');
  if (nav) {
    var onNavScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onNavScroll();
    window.addEventListener('scroll', onNavScroll, { passive: true });
  }

  /* ---------- 4. Scrollspy: marca a secao visivel ---------- */
  var navLinks = $$('.nav__links a[href^="#"]');
  var watched = navLinks
    .map(function (a) {
      var el = doc.getElementById(a.getAttribute('href').slice(1));
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);

  if (watched.length) {
    var setActive = function (match) {
      navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
      if (match) match.link.setAttribute('aria-current', 'true');
    };

    if ('IntersectionObserver' in window) {
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            watched.forEach(function (w) {
              if (w.el === entry.target) setActive(w);
            });
          });
        },
        { rootMargin: '-45% 0px -50% 0px' }
      );
      watched.forEach(function (w) { spy.observe(w.el); });
    } else {
      var onScrollSpy = function () {
        var line = window.innerHeight * 0.4;
        var current = null;
        watched.forEach(function (w) {
          if (w.el.getBoundingClientRect().top <= line) current = w;
        });
        setActive(current);
      };
      onScrollSpy();
      window.addEventListener('scroll', onScrollSpy, { passive: true });
    }
  }

  /* ---------- 5. Revela blocos ao entrar na viewport ---------- */
  var revealables = $$('.project, .about__facts li, .skills__group');
  if (revealables.length) {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-revealed'); });
    } else {
      revealables.forEach(function (el) { el.classList.add('reveal'); });
      var revealer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
      );
      revealables.forEach(function (el) { revealer.observe(el); });
    }
  }

  /* ---------- 6. Copia o email ao clicar (mailto continua funcionando) ---------- */
  var emailLink = $('.contact__email');
  if (emailLink && navigator.clipboard && navigator.clipboard.writeText) {
    emailLink.addEventListener('click', function () {
      var addr = emailLink.textContent.trim();
      navigator.clipboard.writeText(addr).then(
        function () {
          var prev = emailLink.textContent;
          emailLink.textContent = 'copiado';
          window.setTimeout(function () { emailLink.textContent = prev; }, 1600);
        },
        function () { /* clipboard negado: segue para o mailto */ }
      );
    });
  }
  /* ---------- 7. Efeitos de interação ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var topline = document.createElement('div');
  topline.className = 'topline';
  topline.setAttribute('aria-hidden', 'true');
  document.body.appendChild(topline);

  if (!reduceMotion) {
    // marca onde o ponteiro esta, para o brilho radial do card e dos botoes
    var onPointer = function (ev) {
      topline.classList.add('is-on');
      var alvo = ev.target.closest('.btn, .contact__links a, .projects__more, .project');
      if (!alvo) return;
      var r = alvo.getBoundingClientRect();
      alvo.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
      alvo.style.setProperty('--my', (ev.clientY - r.top) + 'px');
    };

    var onLeave = function () {
      topline.classList.remove('is-on');
    };

    document.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerleave', onLeave, { passive: true });

    var scrollProgress = 0;
    var loop = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      if (Math.abs(p - scrollProgress) > 0.001) {
        scrollProgress = p;
        topline.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      }
      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
  }

  /* ---------- 8. Estado final do hero, por seguranca ---------- */
  // Se o hero.js nao rodar (bloqueado, erro), nada fica invisivel.
  window.setTimeout(function () {
    var alvos = document.querySelectorAll('.hero .will-animate');
    for (var i = 0; i < alvos.length; i++) alvos[i].classList.add('is-in');
  }, 2500);
})();
