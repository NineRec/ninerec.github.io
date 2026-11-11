// 涂色本 — pick a picture, then tap its shapes to fill them with colour, sparkle patterns or the magic wand.
import { el, anim, sample, shuffle } from '../core.js';
import { ANIMALS, LAND, SEA } from '../art/animals.js';
import { foodInner } from '../art/food.js';
import { room } from '../art/scenes.js';
import { BOX, R, P, C, star, starPath, heartPath, INK } from '../art/base.js';
import { doll } from '../art/girl.js';
import { tray } from './kit.js';

const COLORS = ['#ff5a5a', '#ff9d2e', '#ffe45c', '#7ed957', '#3fb4ff', '#5f6bf0', '#9a7bf5', '#ff7fb0', '#a8693a', '#ffffff', '#38334d'];
const PATTERNS = {
  hearts: `<pattern id="pt-hearts" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#ffd0e3"/><path d="${heartPath(13, 13, 6)}" fill="#ff5c8a"/></pattern>`,
  stars: `<pattern id="pt-stars" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#5f6bf0"/><path d="${starPath(14, 14, 8, 3.6)}" fill="#ffe45c"/></pattern>`,
  rainbow: `<linearGradient id="pt-rainbow" x1="0" y1="0" x2="0" y2="1">${['#ff5a5a', '#ff9d2e', '#ffe45c', '#7ed957', '#3fb4ff', '#9a7bf5'].map((col, i) => `<stop offset="${i / 6}" stop-color="${col}"/><stop offset="${(i + 1) / 6}" stop-color="${col}"/>`).join('')}</linearGradient>`,
};
const princess = () => `<g transform="translate(-10 -6) scale(.31)">${doll({ hair: 'long', outfit: 'princess', shoes: 'mary', head: 'crown', hand: 'wand', back: 'fairy' })}</g>`;
const mermaid = () => `<g transform="translate(-10 -6) scale(.31)">${doll({ hair: 'curly', outfit: 'mermaid', head: 'wreath', hand: null, back: null })}</g>`;
const PAGES = [
  ...['unicorn', 'rabbit', 'cat', 'lion', 'elephant', 'owl', 'penguin', 'fox', 'giraffe', 'whale', 'octopus', 'fish', 'turtle'].map((k) => ({ key: k, draw: () => ANIMALS[k]() })),
  { key: 'princess', draw: princess }, { key: 'mermaid', draw: mermaid },
  ...['cupcake', 'strawberry', 'cherry', 'mushroom', 'donut'].map((k) => ({ key: k, draw: () => foodInner(k, { face: true }) })),
];
const DARK = ['#38334d', '#3f3a52', '#2c2840'];

/** Turn a flat picture into a colouring page: every shape white with a line around it, remembering its real colour. */
function page(markup) {
  const holder = document.createElement('div');
  holder.innerHTML = `<svg class="art page calm" viewBox="${BOX}"><defs>${Object.values(PATTERNS).join('')}</defs>${markup}</svg>`;
  const svg = holder.firstElementChild;
  let total = 0;
  svg.querySelectorAll('ellipse, path, rect, circle').forEach((node) => {
    if (node.closest('clipPath, defs, .eye, .eyes-joy, .mouth-open')) return;
    const fill = node.getAttribute('fill'), stroke = node.getAttribute('stroke');
    if (node.classList.contains('t') || (fill === 'none' && stroke && !node.classList.contains('d'))) {
      const edge = node.cloneNode();
      edge.setAttribute('class', 'edge'); edge.setAttribute('stroke', INK); edge.setAttribute('stroke-width', +node.getAttribute('stroke-width') + 7);
      node.before(edge);
      node.dataset.real = stroke; node.dataset.kind = 'stroke'; node.setAttribute('stroke', '#ffffff'); node.classList.add('zone-line');
    } else if (fill && fill !== 'none' && !fill.startsWith('rgba') && !node.hasAttribute('opacity') && !(node.classList.contains('d') && DARK.includes(fill.toLowerCase()))) {
      node.dataset.real = fill; node.dataset.kind = 'fill'; node.setAttribute('fill', '#ffffff'); node.classList.add('zone');
    } else if (node.hasAttribute('opacity') || (fill && fill.startsWith('rgba')) || (fill === 'none' && stroke && !DARK.includes(stroke.toLowerCase()))) { node.style.display = 'none'; return; } else return;
    total++;
  });
  svg.dataset.total = total;
  return svg;
}

export default {
  id: 'coloring', name: '涂色本', colors: ['#fff0f6', '#ffc4de'], intro: 'color-intro',
  icon: () => `<svg viewBox="0 0 230 200">${R(30, 16, 150, 170, 18, '#fff')}<g transform="translate(46 34) scale(.6)" class="calm">${ANIMALS.unicorn()}</g>
    <g transform="rotate(35 180 110)">${R(166, 40, 30, 110, 8, '#ff7fb0')}${P('M166 150 h30 l-15 30z', '#ffd6b3')}${P('M175 168 h12 l-6 12z', '#ff7fb0')}${R(166, 40, 30, 18, 8, '#e64f8b')}</g>${star(40, 170, 14, '#ffc21f')}</svg>`,

  start(ctx) {
    const { W } = ctx;
    ctx.scene(room(W, '#fff3f8', '#ffe0ee', '#ffd0e3', 700));
    let chooser = null;

    function choose() {
      chooser = ctx.add(el('div', { class: 'cl-chooser' }));
      sample(PAGES, 8).forEach((pg, i) => {
        const svg = page(pg.draw());
        if (+svg.dataset.total < 4) return;   // too little to colour
        const b = el('button', { class: 'cl-thumb', type: 'button', style: { animationDelay: `${i * 0.05}s` } }, svg);
        b.addEventListener('click', () => { ctx.sfx('pop'); chooser.remove(); paint(pg); });
        chooser.append(b);
      });
    }

    function paint(pg) {
      const svg = page(pg.draw());
      const cx = W * 0.44, size = 600;
      const paper = ctx.add(el('div', { class: 'cl-paper', style: { left: `${cx - size / 2}px`, top: `${400 - size / 2 - 10}px`, width: `${size}px`, height: `${size}px` } }, svg));
      anim(paper, 'in', 350);
      let color = COLORS[0], painted = new Set(), wand = false, won = false;
      const total = +svg.dataset.total;
      const items = [...COLORS.map((col) => ({ key: col, color: col })),
        ...Object.keys(PATTERNS).map((k) => ({ key: `url(#pt-${k})`, html: `<svg viewBox="0 0 60 60"><defs>${PATTERNS[k]}</defs><circle cx="30" cy="30" r="30" fill="url(#pt-${k})"/></svg>`, cls: 'cl-pattern' }))];
      const pal = tray(ctx, W - 150, 360, items, (item) => { color = item.key; wand = false; wandB.classList.remove('on'); ctx.sfx('tap'); }, { width: 250, cls: 'cl-palette' });
      pal.select(color);
      const wandB = ctx.button('star', W - 220, 712, 'yellow', '魔法棒', () => { wand = !wand; wandB.classList.toggle('on', wand); pal.clear(); if (!wand) pal.select(color); ctx.sfx('sparkle'); });
      ctx.button('eraser', W - 110, 712, 'blue', '全部擦掉', () => {
        svg.querySelectorAll('.zone, .zone-line').forEach((n) => n.setAttribute(n.dataset.kind, '#ffffff')); painted.clear(); ctx.sfx('water');
      });
      ctx.button('back', 70, 716, '', '换一张', () => { paper.remove(); pal.el.remove(); ctx.stage.querySelectorAll('.stage-button').forEach((b) => b.remove()); choose(); });
      ctx.button('check', 180, 716, 'green', '画好了', () => finish());

      const finish = () => {
        if (won) return;
        if (painted.size < Math.min(4, total)) { ctx.sfx('bad'); anim(paper, 'wiggle', 400); return; }
        won = true;
        svg.classList.remove('calm'); svg.classList.add('done');
        ctx.sfx('great'); anim(paper, 'pop', 500);
        ctx.burst(cx, 400, { n: 24, spread: 380, size: 44 });
        ctx.win({ voice: 'color-done', delay: 1200 });
      };
      svg.addEventListener('click', (ev) => {
        const node = ev.target.closest('.zone, .zone-line');
        if (!node || won) return;
        node.setAttribute(node.dataset.kind, wand ? node.dataset.real : color);
        node.animate([{ opacity: 0.3 }, { opacity: 1 }], 250);
        painted.add(node);
        ctx.sfx('pop'); ctx.note(painted.size % 8);
        const pt = ctx.point(ev);
        ctx.burst(pt.x, pt.y, { n: 4, spread: 60, size: 22, shapes: ['star', 'dot'] });
        if (painted.size === total) ctx.after(500, finish);
      });
    }
    choose();
  },
};
