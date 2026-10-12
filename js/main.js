// K1 Fact Finder Center — 공통 스크립트
(function () {
  // 모바일 메뉴
  var btn = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (btn && nav) btn.addEventListener('click', function () { nav.classList.toggle('open'); });
  // 현재 페이지 메뉴 강조
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (a) {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
  // 연도
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// 헤더 그림자 + 스크롤 등장 효과
(function () {
  var h = document.querySelector('.site-header');
  var onS=function () { if (h) h.classList.toggle('scrolled', window.scrollY > 40); }; window.addEventListener('scroll', onS); onS();
  document.querySelectorAll('.nav a').forEach(function(a){a.addEventListener('click',function(){var n=document.querySelector('.nav');if(n)n.classList.remove('open');});});
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
})();
