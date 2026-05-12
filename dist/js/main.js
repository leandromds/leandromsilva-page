/* ----- block 1 ----- */

  // Mobile nav toggle
  (function(){
    var btn = document.getElementById('navToggle');
    var menu = document.getElementById('navMobile');
    if (!btn || !menu) return;
    btn.addEventListener('click', function(){
      var open = menu.hasAttribute('hidden') ? false : true;
      if (open) {
        menu.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('[data-open]').textContent = 'menu';
      } else {
        menu.removeAttribute('hidden');
        btn.setAttribute('aria-expanded', 'true');
        btn.querySelector('[data-open]').textContent = 'fechar';
      }
    });
    // Close on nav click
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        menu.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('[data-open]').textContent = 'menu';
      });
    });
  })();


/* ----- block 2 ----- */

  // Scroll → CSS variables para o fundo decorativo + progress bar
  (function(){
    var doc = document.documentElement;
    var srVal = document.getElementById('srVal');
    var ticking = false;
    function update() {
      var max = doc.scrollHeight - window.innerHeight;
      var y = window.scrollY || window.pageYOffset || 0;
      var pct = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      doc.style.setProperty('--scroll-px', y + 'px');
      doc.style.setProperty('--scroll-pct', (pct * 100).toFixed(2) + '%');
      if (srVal) srVal.textContent = String(Math.round(pct * 100)).padStart(2, '0');
      ticking = false;
    }
    function onScroll(){
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();


/* ----- block 3 ----- */

  // Hero: wireframe trefoil torus knot
  (function(){
    var cvs = document.getElementById('knot');
    if (!cvs) return;
    var ctx = cvs.getContext('2d');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var P = 2, Q = 3, R0 = 2, r0 = 1, tubeR = 0.42;
    var U = 240, V = 12;

    function curve(t){
      var ct = Math.cos(P*t), st = Math.sin(P*t);
      var cq = Math.cos(Q*t), sq = Math.sin(Q*t);
      var w = R0 + r0*cq;
      return [w*ct, w*st, r0*sq];
    }
    function norm(v){ var L = Math.hypot(v[0],v[1],v[2])||1; return [v[0]/L,v[1]/L,v[2]/L]; }
    function cross(a,b){ return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
    function diff(t, fn){
      var h = 0.0008;
      var a = fn(t-h), b = fn(t+h);
      return [(b[0]-a[0])/(2*h),(b[1]-a[1])/(2*h),(b[2]-a[2])/(2*h)];
    }

    // Precompute mesh (parallel transport for stable frame)
    var mesh = [];
    var prevN = null;
    for (var i = 0; i < U; i++){
      var t = (i/U)*Math.PI*2;
      var c = curve(t);
      var T = norm(diff(t, curve));
      var N;
      if (!prevN){
        // initialize: use an arbitrary up vector orthogonal-ized to T
        var up = Math.abs(T[1]) < 0.9 ? [0,1,0] : [1,0,0];
        var B0 = norm(cross(T, up));
        N = norm(cross(B0, T));
      } else {
        // project previous N onto plane perpendicular to current T
        var dot = prevN[0]*T[0]+prevN[1]*T[1]+prevN[2]*T[2];
        N = norm([prevN[0]-dot*T[0], prevN[1]-dot*T[1], prevN[2]-dot*T[2]]);
      }
      var B = norm(cross(T, N));
      prevN = N;
      var ring = [];
      for (var j = 0; j < V; j++){
        var a = (j/V)*Math.PI*2;
        var ca = Math.cos(a), sa = Math.sin(a);
        ring.push([
          c[0] + tubeR*(ca*N[0] + sa*B[0]),
          c[1] + tubeR*(ca*N[1] + sa*B[1]),
          c[2] + tubeR*(ca*N[2] + sa*B[2])
        ]);
      }
      mesh.push(ring);
    }

    var rotY = 0, rotX = -0.55, dpr = 1, w = 0, h = 0;

    function resize(){
      var rect = cvs.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      cvs.width  = Math.floor(w * dpr);
      cvs.height = Math.floor(h * dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }

    function project(p){
      var cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      var cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      var x = p[0], y = p[1], z = p[2];
      var y1 = y*cosX - z*sinX;
      var z1 = y*sinX + z*cosX;
      y = y1; z = z1;
      var x1 = x*cosY + z*sinY;
      var z2 = -x*sinY + z*cosY;
      return [x1, y, z2];
    }

    function draw(){
      ctx.clearRect(0,0,w,h);
      var scale = Math.min(w,h) * 0.135;
      var cx = w/2, cy = h/2;

      // Collect projected points
      var pts = [];
      for (var i = 0; i < U; i++){
        var row = [];
        for (var j = 0; j < V; j++){
          var pr = project(mesh[i][j]);
          row.push([cx + pr[0]*scale, cy + pr[1]*scale, pr[2]]);
        }
        pts.push(row);
      }

      ctx.lineWidth = 0.45;

      // Longitudinal lines
      for (var j2 = 0; j2 < V; j2++){
        ctx.beginPath();
        for (var i2 = 0; i2 <= U; i2++){
          var ii = i2 % U;
          var p = pts[ii][j2];
          // depth-based opacity
          var alpha = 0.18 + Math.max(0, Math.min(1, (p[2]+2.5)/5)) * 0.45;
          if (i2 === 0){ ctx.moveTo(p[0], p[1]); }
          else {
            ctx.strokeStyle = 'rgba(55, 65, 81, ' + alpha.toFixed(3) + ')';
            ctx.lineTo(p[0], p[1]);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(p[0], p[1]);
          }
        }
      }
      // Cross-section rings
      for (var i3 = 0; i3 < U; i3 += 1){
        ctx.beginPath();
        for (var j3 = 0; j3 <= V; j3++){
          var jj = j3 % V;
          var p2 = pts[i3][jj];
          var alpha2 = 0.14 + Math.max(0, Math.min(1, (p2[2]+2.5)/5)) * 0.40;
          if (j3 === 0){ ctx.moveTo(p2[0], p2[1]); }
          else {
            ctx.strokeStyle = 'rgba(55, 65, 81, ' + alpha2.toFixed(3) + ')';
            ctx.lineTo(p2[0], p2[1]);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(p2[0], p2[1]);
          }
        }
      }
    }

    resize();
    draw();

    var last = performance.now();
    function tick(now){
      var dt = (now - last)/1000; last = now;
      rotY += dt * 0.10;
      rotX += dt * 0.018;
      draw();
      requestAnimationFrame(tick);
    }
    if (!reduce) requestAnimationFrame(tick);

    var ro;
    if (window.ResizeObserver){
      ro = new ResizeObserver(function(){ resize(); draw(); });
      ro.observe(cvs);
    } else {
      window.addEventListener('resize', function(){ resize(); draw(); });
    }
  })();
