/**
 * Animações de entrada do hero.
 * GSAP apenas aqui — no resto do site é CSS puro.
 *
 * Decisão de performance: entra apenas o core do GSAP (28 KB gzip),
 * sem ScrollTrigger. Tudo que dependia de rolagem usa
 * IntersectionObserver no main.js, que é nativo e não custa thread.
 *
 * Sem GSAP (CDN bloqueado, JS desligado, erro de rede) o site
 * continua legível: o CSS abaixo garante o estado final.
 */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  if (!hero) return;

  // Se pediram menos movimento, não anima nada.
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var semGsap = typeof window.gsap === 'undefined';

  var alvos = [
    { sel: '.hero__eyebrow', y: 14, delay: 0 },
    { sel: '.hero__title', y: 24, delay: 0.08 },
    { sel: '.hero__lead', y: 20, delay: 0.16 },
    { sel: '.hero__actions', y: 16, delay: 0.24 },
    { sel: '.hero__meta', y: 12, delay: 0.32 }
  ];

  function preparar() {
    alvos.forEach(function (a) {
      var el = hero.querySelector(a.sel);
      if (!el) return;
      el.classList.add('will-animate');
      a.el = el;
    });
  }

  function revealing() {
    alvos.forEach(function (a) {
      if (a.el) a.el.classList.add('is-in');
    });
  }

  preparar();

  if (reduce || semGsap) {
    // Estado final imediato. O site aparece pronto.
    revealing();
    return;
  }

  var gsap = window.gsap;

  gsap.set(
    alvos.map(function (a) { return a.el; }).filter(Boolean),
    { y: function (i) { return alvos[i].y; }, opacity: 0, autoAlpha: 0 }
  );

  gsap.to(
    alvos.map(function (a) { return a.el; }).filter(Boolean),
    {
      y: 0,
      opacity: 1,
      autoAlpha: 1,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.08,
      delay: 0.15,
      // stagger com EaseExpo dá aceleração natural entre os itens
      overwrite: 'auto'
    }
  );

  // Marca o estado final para o CSS assumir se algo travar no meio.
  window.setTimeout(revealing, 2000);
})();