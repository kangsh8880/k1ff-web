/* K1 Lab — 분야 필터 */
(function () {
  var bar = document.querySelector('.lab-filter'); if (!bar) return;
  var cards = document.querySelectorAll('.lab-card[data-g]');
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    bar.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
    var f = b.getAttribute('data-f');
    cards.forEach(function (c) { c.classList.toggle('hide', f !== 'all' && c.getAttribute('data-g') !== f); });
  });
})();
/* 실제 화면 크게 보기 */
(function () {
  var lb = document.createElement('div'); lb.className = 'lab-lb'; lb.innerHTML = '<img alt="">'; document.body.appendChild(lb);
  document.addEventListener('click', function (e) {
    var s = e.target.closest('.shot'); if (s) { lb.querySelector('img').src = s.getAttribute('data-src'); lb.querySelector('img').alt = s.getAttribute('aria-label') || ''; lb.classList.add('on'); return; }
    if (e.target.closest('.lab-lb')) lb.classList.remove('on');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('on'); });
})();
