/**
 * observer.js — Single IntersectionObserver for all scroll-triggered behaviors.
 *
 * Declarative API via data-observe attribute:
 *   data-observe="reveal"       — fade in on enter
 *   data-observe="reveal-up"    — slide up + fade in
 *   data-observe="lazy"         — lazy-load image (data-src → src)
 *   data-observe="countup"      — animate number (data-to="1500")
 *   data-observe="stagger"      — children animate sequentially
 *
 * Multiple effects can stack: data-observe="reveal stagger"
 *
 * Respects prefers-reduced-motion: all effects resolve instantly.
 */

(function () {
  'use strict';

  // -- Reduced motion check (live) ------------------------------------------
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = motionQuery.matches;

  motionQuery.addEventListener('change', function (e) {
    prefersReducedMotion = e.matches;
    // If user enables reduced motion, instantly reveal all pending elements
    if (prefersReducedMotion) revealAll();
  });

  // -- State ----------------------------------------------------------------
  const observed = new Set();
  let observer = null;

  // -- Effect handlers ------------------------------------------------------
  const effects = {
    reveal: function (el) {
      el.classList.add('observed');
    },

    'reveal-up': function (el) {
      el.classList.add('observed');
    },

    lazy: function (el) {
      const src = el.getAttribute('data-src');
      if (src) {
        el.src = src;
        el.removeAttribute('data-src');
      }
    },

    countup: function (el) {
      const target = parseInt(el.getAttribute('data-to'), 10) || 0;
      if (prefersReducedMotion) {
        el.textContent = target.toLocaleString();
        return;
      }
      animateCountUp(el, target);
    },

    stagger: function (el) {
      const children = el.children;
      for (let i = 0; i < children.length; i++) {
        children[i].style.setProperty('--stagger-index', i);
      }
      el.classList.add('observed');
    },
  };

  // -- Count-up animation ---------------------------------------------------
  function animateCountUp(el, target) {
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      if (prefersReducedMotion) {
        el.textContent = target.toLocaleString();
        return;
      }
      const progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function applyEffects(el) {
    const types = (el.getAttribute('data-observe') || '').split(/\s+/);
    el.classList.remove('observe-pending');
    types.forEach(function (type) {
      if (effects[type]) effects[type](el);
    });
  }

  function finish(el) {
    applyEffects(el);
    observer.unobserve(el);
    observed.delete(el);
  }

  // -- Reveal all (for reduced motion) --------------------------------------
  function revealAll() {
    observed.forEach(finish);
  }

  // -- Observer callback ----------------------------------------------------
  function handleIntersect(entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || !observed.has(entry.target)) return;

      finish(entry.target);
    });
  }

  // -- Init / scan ----------------------------------------------------------
  function scan() {
    const elements = document.querySelectorAll('[data-observe]');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach(applyEffects);
      return;
    }

    if (!observer) {
      observer = new IntersectionObserver(handleIntersect, {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1,
      });
    }

    elements.forEach(function (el) {
      if (observed.has(el)) return;
      observed.add(el);
      observer.observe(el);
      // Visible content stays visible at startup. Only defer offscreen reveals.
      if (
        el.matches('[data-observe~="reveal"], [data-observe~="reveal-up"]') &&
        el.getBoundingClientRect().top > window.innerHeight
      ) {
        el.classList.add('observe-pending');
      }
    });
  }

  // -- Cleanup --------------------------------------------------------------
  function cleanup() {
    if (observer) {
      observer.disconnect();
      observed.forEach((el) => el.classList.remove('observe-pending'));
      observed.clear();
    }
  }

  // -- Lifecycle hooks ------------------------------------------------------
  const lifecycle = window.PageLifecycle;
  if (lifecycle) {
    lifecycle.onReady(scan);
    lifecycle.onPageLoaded(scan);
    lifecycle.onBeforePageUnload(cleanup);
  }
})();
