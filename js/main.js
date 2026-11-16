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

// 상담 신청서: 동의 후 제출 → FormSubmit으로 contact@k1ff.com 발송 (실패 시 메일 작성 창으로 대체)
(function () {
  var f = document.getElementById('inquiry'); if (!f) return;
  var btn = f.querySelector('.fsubmit'), agree = f.querySelector('[name=agree]'), msg = f.querySelector('.fmsg');
  var LABEL = '상담 신청하기 →';
  agree.addEventListener('change', function () { btn.disabled = !agree.checked; });
  function v(n) { var e = f.querySelector('[name=' + n + ']'); return e ? e.value.trim() : ''; }
  function say(cls, t) { msg.className = 'fmsg ' + cls; msg.textContent = t; }
  function mailtoFallback(data) {
    var body = Object.keys(data).filter(function (k) { return k.charAt(0) !== '_'; }).map(function (k) { return k + ': ' + data[k]; }).join('\n');
    location.href = 'mailto:contact@k1ff.com?subject=' + encodeURIComponent(data._subject) + '&body=' + encodeURIComponent(body);
  }
  f.addEventListener('submit', function (e) {
    e.preventDefault(); say('', '');
    if (v('_honey')) return; // 스팸 차단
    if (!agree.checked) { say('err', '개인정보 수집·이용에 동의해 주세요.'); return; }
    var miss = ['company', 'name', 'email', 'message'].filter(function (n) { return !v(n); });
    if (miss.length || !f.querySelector('[name=email]').checkValidity()) { say('err', '필수 항목(회사명·담당자명·이메일·문의 내용)을 정확히 입력해 주세요.'); return; }
    var data = {
      _subject: '[K1FF 상담 신청] ' + v('company') + ' / ' + v('name'),
      _template: 'table', _captcha: 'false', _replyto: v('email'),
      '회사명': v('company'), '담당자명': v('name'), '이메일': v('email'), '연락처': v('phone') || '-',
      '관심 서비스': v('service') || '-', '희망 일정': v('schedule') || '-', '조사 필요 기업': v('target') || '-',
      '문의 내용': v('message'), '개인정보 동의': '동의함 (' + new Date().toLocaleString('ko-KR') + ')'
    };
    var ep = f.getAttribute('data-endpoint') || 'https://formsubmit.co/ajax/contact@k1ff.com';
    btn.disabled = true; btn.textContent = '전송 중…';
    fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        var success = res.ok && String(res.j.success) === 'true';
        if (!success) throw new Error(res.j.message || 'send failed');
        say('ok', '상담 신청이 접수되었습니다. 영업일 기준 1일 이내에 ' + data['이메일'] + ' 으로 회신드리겠습니다.');
        f.reset(); btn.disabled = true; btn.textContent = LABEL;
      })
      .catch(function (err) {
        btn.disabled = false; btn.textContent = LABEL;
        msg.className = 'fmsg err';
        msg.innerHTML = '일시적으로 자동 전송이 되지 않았습니다. 잠시 후 다시 시도하시거나 <a href="#" class="mfb">이메일로 직접 보내기</a>를 눌러 주세요. (contact@k1ff.com)';
        msg.querySelector('.mfb').addEventListener('click', function (ev) { ev.preventDefault(); mailtoFallback(data); });
        if (window.console) console.warn('FormSubmit:', err.message);
      });
  });
})();

/* 헤더 v4: 회로선 + 빛 펄스 애니메이션 (장식, 접근성 숨김) */
(function () {
  var h = document.querySelector('.site-header'); if (!h || !window.HTMLCanvasElement) return;
  var c = document.createElement('canvas'); c.className = 'hdr-fx'; c.setAttribute('aria-hidden', 'true'); h.insertBefore(c, h.firstChild);
  var x = c.getContext('2d'), W = 0, H = 0, dpr = 1, traces = [], pulses = [], nodes = [];
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2); W = h.clientWidth; H = h.clientHeight;
    c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    traces = []; nodes = []; pulses = [];
    var n = Math.max(8, Math.round(W / 90));
    for (var i = 0; i < n; i++) {
      var y = rnd(8, H - 8), x0 = rnd(-40, W), len = rnd(120, 320), dir = Math.random() < .5 ? -1 : 1;
      var bx = x0 + len * rnd(.35, .65), dy = rnd(10, 22) * (y > H / 2 ? -1 : 1);
      var p = [[x0, y], [bx, y], [bx + Math.abs(dy), y + dy], [x0 + len + Math.abs(dy), y + dy]];
      if (dir < 0) p.reverse();
      traces.push(p); nodes.push(p[p.length - 1]); if (Math.random() < .5) nodes.push(p[0]);
    }
    for (var k = 0; k < Math.round(n * .6); k++) pulses.push({ t: traces[k % traces.length], s: Math.random(), v: rnd(.0015, .004) });
  }
  function seg(p) { var L = [0]; for (var i = 1; i < p.length; i++) L.push(L[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); return L; }
  function at(p, u) { var L = seg(p), d = u * L[L.length - 1]; for (var i = 1; i < p.length; i++) if (d <= L[i]) { var r = (d - L[i - 1]) / (L[i] - L[i - 1] || 1); return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * r, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * r]; } return p[p.length - 1]; }
  function draw(tm) {
    x.clearRect(0, 0, W, H);
    var g = x.createRadialGradient(W * .5, H * .5, 0, W * .5, H * .5, W * .35);
    g.addColorStop(0, 'rgba(70,190,230,.18)'); g.addColorStop(1, 'rgba(70,190,230,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.lineWidth = 1; x.strokeStyle = 'rgba(120,210,240,.22)';
    traces.forEach(function (p) { x.beginPath(); x.moveTo(p[0][0], p[0][1]); for (var i = 1; i < p.length; i++) x.lineTo(p[i][0], p[i][1]); x.stroke(); });
    nodes.forEach(function (q, i) { var a = .45 + .35 * Math.sin((tm || 0) / 700 + i); x.beginPath(); x.arc(q[0], q[1], 2.2, 0, 6.283); x.fillStyle = 'rgba(150,230,250,' + a + ')'; x.fill(); });
    pulses.forEach(function (o) {
      o.s += still ? 0 : o.v; if (o.s > 1) { o.s = 0; o.t = traces[Math.floor(Math.random() * traces.length)]; }
      var q = at(o.t, o.s), r = x.createRadialGradient(q[0], q[1], 0, q[0], q[1], 9);
      r.addColorStop(0, 'rgba(190,245,255,.95)'); r.addColorStop(1, 'rgba(110,220,245,0)'); x.fillStyle = r; x.beginPath(); x.arc(q[0], q[1], 9, 0, 6.283); x.fill();
    });
    if (!still) requestAnimationFrame(draw);
  }
  build(); draw(0); var to; window.addEventListener('resize', function () { clearTimeout(to); to = setTimeout(function () { build(); if (still) draw(0); }, 150); });
})();
