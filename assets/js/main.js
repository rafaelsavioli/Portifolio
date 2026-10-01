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
  var $ = function (s, c) { return (c || doc).querySelector(s); };
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

  /* ---------- 2. Entrada do topo ---------- */
  // CSS puro com transition-delay escalonado. Sem GSAP.
  var entrada = $$('.will-animate');
  var revelarEntrada = function () {
    entrada.forEach(function (el) { el.classList.add('is-in'); });
  };

  if (reduceMotion) {
    revelarEntrada();
  } else {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(revelarEntrada);
    });
  }

  // Rede de segurança: se algo travar, o conteúdo aparece mesmo assim.
  window.setTimeout(revelarEntrada, 1500);

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

  /* ---------- 4. Barra superior ganha borda ao rolar ---------- */
  var topbar = doc.getElementById('topbar');
  if (topbar) {
    var onScroll = function () {
      topbar.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 5. Scrollspy: marca a seção visível ----------
     Links reais com href="#id": funcionam sem JS. O JS só acrescenta
     o estado visual de "você está aqui". */
  var navLinks = $$('.topbar__nav a[href^="#"]');
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
        { rootMargin: '-42% 0px -52% 0px' }
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

  /* ---------- 6. Copia o email ao clicar (mailto continua funcionando) ---------- */
  var mail = $('.contact__mail');
  if (mail && navigator.clipboard && navigator.clipboard.writeText) {
    mail.addEventListener('click', function () {
      var addr = mail.textContent.trim();
      navigator.clipboard.writeText(addr).then(
        function () {
          var prev = mail.textContent;
          mail.textContent = 'copiado';
          window.setTimeout(function () { mail.textContent = prev; }, 1600);
        },
        function () { /* clipboard negado: segue para o mailto */ }
      );
    });
  }
})();