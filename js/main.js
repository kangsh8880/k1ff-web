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

// 첫 화면 BEFORE → AFTER 사진 전환
(function () {
  var hero = document.querySelector('.hero'); if (!hero || !hero.querySelector('.hero-slides')) return;
  var btns = hero.querySelectorAll('.hst'), s = 0, t;
  function set(n) { s = n; hero.classList.toggle('after', n === 1); btns.forEach(function (b, i) { b.classList.toggle('on', i === n); }); }
  function loop() { clearTimeout(t); t = setTimeout(function () { set(s ? 0 : 1); loop(); }, s ? 7000 : 3500); }
  btns.forEach(function (b, i) { b.addEventListener('click', function () { set(i); loop(); }); });
  set(0);
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { set(1); return; }
  loop();
})();

// 상담 신청서: 동의 후 제출 (data-endpoint 설정 시 전송 서비스, 미설정 시 메일 작성 창)
(function () {
  var f = document.getElementById('inquiry'); if (!f) return;
  var btn = f.querySelector('.fsubmit'), agree = f.querySelector('[name=agree]'), msg = f.querySelector('.fmsg');
  agree.addEventListener('change', function () { btn.disabled = !agree.checked; });
  function v(n) { var e = f.querySelector('[name=' + n + ']'); return e ? e.value.trim() : ''; }
  f.addEventListener('submit', function (e) {
    e.preventDefault(); msg.className = 'fmsg'; msg.textContent = '';
    if (!agree.checked) { msg.className = 'fmsg err'; msg.textContent = '개인정보 수집·이용에 동의해 주세요.'; return; }
    var miss = ['company', 'name', 'email', 'message'].filter(function (n) { return !v(n); });
    if (miss.length || !f.querySelector('[name=email]').checkValidity()) { msg.className = 'fmsg err'; msg.textContent = '필수 항목(회사명·담당자명·이메일·문의 내용)을 정확히 입력해 주세요.'; return; }
    var ep = f.getAttribute('data-endpoint');
    if (ep) {
      btn.disabled = true; btn.textContent = '전송 중…';
      fetch(ep, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw 0; msg.className = 'fmsg ok'; msg.textContent = '접수되었습니다. 영업일 기준 1일 이내에 회신드리겠습니다.'; f.reset(); btn.textContent = '상담 신청하기 →'; })
        .catch(function () { msg.className = 'fmsg err'; msg.textContent = '전송에 실패했습니다. contact@k1ff.com 으로 메일 주시기 바랍니다.'; btn.disabled = false; btn.textContent = '상담 신청하기 →'; });
      return;
    }
    var body = ['[상담 신청서]', '회사명: ' + v('company'), '담당자명: ' + v('name'), '이메일: ' + v('email'), '연락처: ' + v('phone'),
      '관심 서비스: ' + v('service'), '희망 일정: ' + v('schedule'), '조사 필요 기업: ' + v('target'), '', '문의 내용:', v('message'), '',
      '개인정보 수집·이용 동의: 동의함 (' + new Date().toLocaleString('ko-KR') + ')'].join('\n');
    location.href = 'mailto:contact@k1ff.com?subject=' + encodeURIComponent('[K1FF 상담 신청] ' + v('company')) + '&body=' + encodeURIComponent(body);
    msg.className = 'fmsg ok'; msg.textContent = '메일 작성 창이 열립니다. 내용을 확인한 뒤 [보내기]를 눌러 주세요.';
  });
})();
