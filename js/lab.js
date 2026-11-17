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
