/* 홍보영상: 화면 너비에 맞춰 가로/세로 영상 선택 */
(function () {
  var v = document.querySelector('video.pv'); if (!v) return;
  var mob = window.matchMedia('(max-width: 700px)').matches;
  v.poster = v.getAttribute(mob ? 'data-poster-v' : 'data-poster-h');
  v.src = v.getAttribute(mob ? 'data-v' : 'data-h');
})();
