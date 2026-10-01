/**
 * Portfólio — Rafael Savioli
 * Sem dependências externas. Degrada com elegância se o JS falhar.
 *
 * O estado inicial das animações está preso a `.js`, que este arquivo
 * adiciona no <html>. Se o script não rodar, nenhum bloco fica invisível.
 */
(function () {
  'use strict';

  var doc = document;
  var $$ = function (s, c) {
    return Array.prototype.slice.call((c || doc).querySelectorAll(s));
  };

  // Marca que o JS está vivo. Sem isso, nada anima — e nada some.
  doc.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Ano no rodapé ---------- */
  $$('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- 2. Entrada do hero ---------- */
  // CSS puro com transition-delay escalonado. Sem GSAP: 28 KB a menos
  // e o mesmo resultado visual.
  var heroItems = $$('.hero .will-animate');
  var revealHero = function () {
    heroItems.forEach(function (el) { el.classList.add('is-in'); });
  };

  if (reduceMotion) {
    revealHero();
  } else {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(revealHero);
    });
  }

  // Rede de segurança: se algo travar, o hero aparece mesmo assim.
  window.setTimeout(revealHero, 1500);

  /* ---------- 3. Revela blocos ao entrar na viewport ---------- */
  var revealables = $$('.reveal');
  if (revealables.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-revealed'); });
    } else {
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

  /* ---------- 4. Scrollspy: marca a seção visível na sidenav ---------- */
  // Links reais com href="#id": funcionam sem JS. O JS só acrescenta
  // o estado visual de "você está aqui".
  var navLinks = $$('.sidenav a[href^="#"]');
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
        { rootMargin: '-40% 0px -55% 0px' }
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

  /* ---------- 5. Compia o email ao clicar (mailto continua funcionando) ---------- */
  var emailLink = doc.querySelector('.contact__email');
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
})();