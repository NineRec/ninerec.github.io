/* One success pause, one next round. Timers pause when the game is hidden. */
(() => {
  const delay = 2400;
  let pending = null, timer = null, started = 0, remaining = 0;

  function cancel() {
    clearTimeout(timer);
    timer = null;
    pending = null;
    document.body.removeAttribute('data-next-round');
    document.getElementById('round-star')?.remove();
  }

  function arm() {
    if (!pending || document.hidden || timer !== null) return;
    started = performance.now();
    timer = setTimeout(() => {
      const next = pending;
      cancel();
      next?.();
    }, remaining);
  }

  window.PlayFlow = {
    cancel,
    after(next, wait = Math.max(delay, Math.min(14000, (window.AdventureBook?.audioRemaining() || 0) + 250))) {
      cancel();
      pending = next;
      remaining = wait;
      document.body.dataset.nextRound = 'true';
      const star = document.createElement('div');
      star.id = 'round-star';
      star.setAttribute('aria-hidden', 'true');
      star.innerHTML = '<span>★</span><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44"/></svg>';
      star.style.setProperty('--next-delay', `${wait}ms`);
      document.body.append(star);
      arm();
    },
    get pending() { return !!pending; }
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) document.body.dataset.sleeping = 'true';
    else document.body.removeAttribute('data-sleeping');
    if (document.hidden && pending && timer !== null) {
      remaining = Math.max(0, remaining - (performance.now() - started));
      clearTimeout(timer);
      timer = null;
    } else arm();
  });
  window.addEventListener('pagehide', cancel);
})();
