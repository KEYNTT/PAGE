/**
 * INSTANTE — Enhancer
 * Dynamic title control, Spanish locale, and Instagram @kevi1no badge.
 * Designed for maximum performance without blocking React hydration.
 */
(function () {
  'use strict';

  // 1. Ensure Spanish locale
  if (document.documentElement.lang !== 'es') {
    document.documentElement.lang = 'es';
  }

  // 2. Route title mapping
  const SPANISH_TITLES = {
    '/': 'INSTANTE — Editor de Imágenes Gratuito y 100% Privado Online',
    '/PAGE': 'INSTANTE — Editor de Imágenes Gratuito y 100% Privado Online',
    '/PAGE/': 'INSTANTE — Editor de Imágenes Gratuito y 100% Privado Online',
    '/crop-image': 'Recortar Imagen Online Gratis — INSTANTE',
    '/crop-image/': 'Recortar Imagen Online Gratis — INSTANTE',
    '/PAGE/crop-image': 'Recortar Imagen Online Gratis — INSTANTE',
    '/PAGE/crop-image/': 'Recortar Imagen Online Gratis — INSTANTE',
    '/resize-image': 'Redimensionar Imagen Online — INSTANTE',
    '/resize-image/': 'Redimensionar Imagen Online — INSTANTE',
    '/PAGE/resize-image': 'Redimensionar Imagen Online — INSTANTE',
    '/PAGE/resize-image/': 'Redimensionar Imagen Online — INSTANTE',
    '/convert-to-webp': 'Convertir a WebP Online — INSTANTE',
    '/convert-to-webp/': 'Convertir a WebP Online — INSTANTE',
    '/PAGE/convert-to-webp': 'Convertir a WebP Online — INSTANTE',
    '/PAGE/convert-to-webp/': 'Convertir a WebP Online — INSTANTE',
    '/compress-image': 'Comprimir Imágenes Online — INSTANTE',
    '/compress-image/': 'Comprimir Imágenes Online — INSTANTE',
    '/PAGE/compress-image': 'Comprimir Imágenes Online — INSTANTE',
    '/PAGE/compress-image/': 'Comprimir Imágenes Online — INSTANTE',
    '/guides': 'Guías de Edición y Optimización — INSTANTE',
    '/guides/': 'Guías de Edición y Optimización — INSTANTE',
    '/PAGE/guides': 'Guías de Edición y Optimización — INSTANTE',
    '/PAGE/guides/': 'Guías de Edición y Optimización — INSTANTE'
  };

  function getTitleForCurrentRoute() {
    const path = window.location.pathname;
    const cleanPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
    return SPANISH_TITLES[cleanPath] || SPANISH_TITLES[path] || 'INSTANTE — Editor de Imágenes 100% Privado';
  }

  // Set title immediately
  const expectedTitle = getTitleForCurrentRoute();
  document.title = expectedTitle;

  // Intercept any attempt by Next.js hydration or client router to overwrite with 'Pixbench'
  try {
    let currentTitle = expectedTitle;
    Object.defineProperty(document, 'title', {
      configurable: true,
      get: function () {
        return currentTitle;
      },
      set: function (val) {
        if (!val || val.includes('Pixbench') || val.includes('pixbench')) {
          currentTitle = getTitleForCurrentRoute();
        } else {
          currentTitle = val;
        }
        const tag = document.querySelector('title');
        if (tag) tag.textContent = currentTitle;
      }
    });
  } catch (e) {}

  // 3. Inject Instagram Badge & Translucent Styles & Hero Cleanups
  function injectStyles() {
    if (document.getElementById('instante-enhancer-styles')) return;
    const style = document.createElement('style');
    style.id = 'instante-enhancer-styles';
    style.textContent = `
      .text-ig-gradient {
        background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
      }
      /* Hide any green shield badge in the hero header */
      section.container.pt-10 .lucide-shield.text-emerald-500,
      section.container.pt-10 > .inline-flex,
      section.container.pt-10 > div.inline-flex {
        display: none !important;
      }
      .kevi1no-footer-card {
        background: linear-gradient(135deg, rgba(240, 148, 51, 0.08) 0%, rgba(225, 48, 108, 0.12) 50%, rgba(131, 58, 180, 0.15) 100%) !important;
        border: 1.5px solid rgba(225, 48, 108, 0.35) !important;
        border-radius: 20px !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
        box-shadow: 0 8px 32px rgba(225, 48, 108, 0.18) !important;
      }
      .kevi1no-ig-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 10px !important;
        padding: 11px 22px !important;
        border-radius: 9999px !important;
        background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%) !important;
        color: #ffffff !important;
        font-family: inherit !important;
        font-size: 13.5px !important;
        font-weight: 700 !important;
        text-decoration: none !important;
        box-shadow: 0 6px 22px rgba(225, 48, 108, 0.45) !important;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        cursor: pointer !important;
      }
      .kevi1no-ig-btn:hover {
        transform: translateY(-2px) scale(1.03) !important;
        box-shadow: 0 10px 32px rgba(225, 48, 108, 0.65) !important;
        color: #ffffff !important;
      }
      .kevi1no-floating-badge {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        border-radius: 9999px;
        background: linear-gradient(135deg, rgba(240, 148, 51, 0.95), rgba(225, 48, 108, 0.95), rgba(131, 58, 180, 0.95));
        color: #ffffff !important;
        font-family: inherit;
        font-size: 13px;
        font-weight: 700;
        text-decoration: none !important;
        box-shadow: 0 4px 20px rgba(225, 48, 108, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        cursor: pointer;
      }
      .kevi1no-floating-badge:hover {
        transform: translateY(-3px) scale(1.04);
        box-shadow: 0 8px 30px rgba(225, 48, 108, 0.65), 0 0 0 2px rgba(255, 255, 255, 0.4);
        color: #ffffff !important;
      }
      .kevi1no-floating-badge svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
        flex-shrink: 0;
      }
      @media (max-width: 640px) {
        .kevi1no-floating-badge {
          bottom: 16px;
          right: 16px;
          padding: 8px 14px;
          font-size: 12px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureFloatingBadge() {
    if (document.getElementById('kevi1no-floating-badge-link')) return;
    const badge = document.createElement('a');
    badge.id = 'kevi1no-floating-badge-link';
    badge.href = 'https://www.instagram.com/kevi1no/';
    badge.target = '_blank';
    badge.rel = 'noopener noreferrer';
    badge.className = 'kevi1no-floating-badge';
    badge.setAttribute('aria-label', 'Instagram de Kevin @kevi1no');
    badge.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
      <span>Instagram: <strong>@kevi1no</strong></span>
    `;
    document.body.appendChild(badge);
  }

  function ensureHeroLogo() {
    const p = window.location.pathname.replace(/^\/PAGE/, '');
    if (p !== '/' && p !== '' && p !== '/index.html') return;
    if (document.getElementById('instante-hero-logo')) return;
    const heroH1 = document.querySelector('section.container.pt-10 h1');
    if (!heroH1) return;

    const banner = document.createElement('div');
    banner.id = 'instante-hero-logo';
    banner.className = 'mx-auto mb-6 flex justify-center';
    const basePath = window.location.pathname.startsWith('/PAGE') ? '/PAGE' : '';
    banner.innerHTML = `
      <div class="relative overflow-hidden rounded-2xl border border-pink-500/25 bg-black/40 p-2 shadow-[0_0_35px_rgba(225,48,108,0.25)] backdrop-blur transition-transform duration-300 hover:scale-105">
        <img src="${basePath}/assets/logo-horizontal.jpg" alt="INSTANTE" class="h-16 sm:h-20 md:h-24 w-auto object-contain rounded-xl" />
      </div>
    `;
    heroH1.parentElement.insertBefore(banner, heroH1);
  }

  function cleanupHero() {
    const hero = document.querySelector('section.container.pt-10');
    if (!hero) return;

    hero.querySelectorAll('.lucide-shield.text-emerald-500').forEach(svg => {
      const parent = svg.closest('.inline-flex') || svg.parentElement;
      if (parent) {
        parent.remove();
      } else {
        svg.remove();
      }
    });

    // Remove loose text nodes with 'never leave' or 'salen de tu dispositivo' inside top hero
    const walker = document.createTreeWalker(hero, NodeFilter.SHOW_TEXT);
    const toRemove = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue && (node.nodeValue.includes('leave') || node.nodeValue.includes('salen'))) {
        if (!node.parentElement.closest('[role="presentation"]')) {
          toRemove.push(node);
        }
      }
    }
    toRemove.forEach(n => n.remove());
  }

  function init() {
    injectStyles();
    ensureFloatingBadge();
    ensureHeroLogo();
    cleanupHero();
    setTimeout(() => { ensureHeroLogo(); cleanupHero(); }, 200);
    setTimeout(() => { ensureHeroLogo(); cleanupHero(); }, 600);
    setTimeout(() => { ensureHeroLogo(); cleanupHero(); }, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
