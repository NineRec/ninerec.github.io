// Bits shared by several games: speech bubbles, trays of choices, Zoey as a host on the stage.
import { el } from '../core.js';
import { Zoey } from '../zoey.js';

/** A speech bubble centred at (cx, cy). */
export function bubble(ctx, cx, cy, w, h, html = '', tail = '30%') {
  return ctx.add(el('div', { class: 'bubble-box', html, style: { left: `${cx - w / 2}px`, top: `${cy - h / 2}px`, width: `${w}px`, height: `${h}px`, '--tail': tail } }));
}

/**
 * A tray of choices centred at (cx, cy). items: [{ key, html }] or [{ key, color }].
 * Returns { el, chips, select(key), clear() }.
 */
export function tray(ctx, cx, cy, items, onPick, o = {}) {
  const { cls = '', width = 0, select = true } = o;
  const box = el('div', { class: `tray no-rub ${cls}`, style: { left: `${cx}px`, top: `${cy}px`, transform: 'translate(-50%, -50%)', width: width ? `${width}px` : '', maxWidth: `${ctx.W - 40}px` } });
  const chips = new Map();
  const api = {
    el: box, chips,
    select(key) { for (const [k, c] of chips) c.classList.toggle('on', k === key); },
    clear() { for (const c of chips.values()) c.classList.remove('on'); },
  };
  for (const item of items) {
    const chip = item.color
      ? el('button', { class: 'swatch', type: 'button', style: { background: item.color } })
      : el('button', { class: `chip ${item.cls || ''}`, type: 'button', html: item.html });
    chip.addEventListener('click', () => {
      if (!ctx.alive) return;
      if (select) api.select(item.key);
      onPick(item, chip);
    });
    chips.set(item.key, chip);
    box.append(chip);
  }
  ctx.add(box);
  return api;
}

/** Zoey standing on the stage, feet at (cx, bottom). */
export function host(ctx, cx, bottom, h = 420) {
  const w = h * 0.75;
  const node = el('div', { class: 'host', style: { position: 'absolute', width: `${w}px`, height: `${h}px`, left: `${cx - w / 2}px`, top: `${bottom - h * 0.97}px` } });
  ctx.add(node);
  const z = new Zoey(node);
  ctx.cleanups.push(() => z.stop());
  return z;
}
