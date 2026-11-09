const layers = require('@hugeicons/core-free-icons/Layers01Icon');
const menu = require('@hugeicons/core-free-icons/Menu01Icon');
const moon = require('@hugeicons/core-free-icons/Moon02Icon');
const sun = require('@hugeicons/core-free-icons/Sun01Icon');
const trash = require('@hugeicons/core-free-icons/Delete02Icon');

const icons = { layers, menu, moon, sun, 'trash-2': trash };

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function icon(name, className = '') {
  if (!Object.hasOwn(icons, name)) throw new Error(`Unknown icon: ${name}`);
  const shapes = icons[name]
    .map(([tag, attributes]) => {
      const attrs = Object.entries(attributes)
        .filter(([key]) => key !== 'key')
        .map(
          ([key, value]) =>
            `${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${escapeAttribute(value)}"`
        )
        .join(' ');
      return `<${tag} ${attrs}></${tag}>`;
    })
    .join('');
  const classes = className ? `hugeicon ${escapeAttribute(className)}` : 'hugeicon';
  return `<svg class="${classes}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">${shapes}</svg>`;
}

function faviconDataUrl() {
  const mark = icon('layers').replace('<svg ', '<svg x="5" y="5" width="22" height="22" ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" color="#25201b"><rect width="32" height="32" rx="7" fill="#ed9d4a"/>${mark}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

module.exports = { icon, faviconDataUrl };
