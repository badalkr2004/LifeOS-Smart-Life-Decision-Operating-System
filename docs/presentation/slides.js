/**
 * LifeOS Presentation — Slide Navigation Engine
 */
(function () {
  let current = 0;
  const slides = document.querySelectorAll('.slide');
  const total = slides.length;
  const bar = document.getElementById('progress-bar');
  const numEl = document.getElementById('slide-num');

  function go(idx) {
    if (idx < 0 || idx >= total) return;
    slides[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    bar.style.width = ((current + 1) / total * 100) + '%';
    numEl.textContent = (current + 1) + ' / ' + total;
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(current + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(current - 1); }
    if (e.key === 'Home') { e.preventDefault(); go(0); }
    if (e.key === 'End') { e.preventDefault(); go(total - 1); }
  });

  // Touch swipe support
  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
  document.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 60) diff > 0 ? go(current + 1) : go(current - 1);
  });

  // Click navigation (left/right halves)
  document.addEventListener('click', (e) => {
    if (e.target.closest('a, button, input')) return;
    e.clientX > window.innerWidth / 2 ? go(current + 1) : go(current - 1);
  });

  // Initialize
  go(0);
})();
