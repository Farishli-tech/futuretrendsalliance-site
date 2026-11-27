// Abstract flowing lines in the hero + scroll reveal + card glow
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Card glow follows the cursor
  document.querySelectorAll('.card').forEach(function (c) {
    c.addEventListener('mousemove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--x', (e.clientX - r.left) + 'px');
      c.style.setProperty('--y', (e.clientY - r.top) + 'px');
    });
  });

  // Flowing lines canvas
  var cv = document.getElementById('flow');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d'), w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var mx = 0.5, my = 0.5;
  function size() {
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size(); window.addEventListener('resize', size);
  window.addEventListener('mousemove', function (e) { mx = e.clientX / window.innerWidth; my = e.clientY / window.innerHeight; });

  var LINES = 26;
  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < LINES; i++) {
      var p = i / LINES;
      var amp = 40 + 90 * p + 40 * (my - 0.5);
      var base = h * (0.25 + 0.6 * p);
      ctx.beginPath();
      for (var x = -20; x <= w + 20; x += 14) {
        var k = x / w;
        var y = base
          + Math.sin(k * 4 + t * 0.00035 + p * 3) * amp * 0.6
          + Math.sin(k * 9 - t * 0.0005 + p * 6 + mx * 2) * amp * 0.25
          + Math.cos(k * 2 + t * 0.0002) * 30;
        if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      var a = 0.05 + 0.22 * Math.sin(p * Math.PI);
      ctx.strokeStyle = i % 3 === 0 ? 'rgba(151,172,200,' + a + ')' : 'rgba(182,191,193,' + (a * 0.6) + ')';
      ctx.lineWidth = i % 5 === 0 ? 1.2 : 0.6;
      ctx.stroke();
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
