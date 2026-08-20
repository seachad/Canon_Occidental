/* El Canon de Occidente — grafo semántico 3D (Three.js r128)
   Sin dependencias más allá de three.min.js. Todo el estado vive en este módulo. */
(function () {
  'use strict';

  var mount = document.getElementById('graph3d');
  if (!mount) return;

  function fail(msg) {
    mount.innerHTML = '<div class="g-fallback"><p><strong>' + msg + '</strong></p>' +
      '<p>Puedes seguir explorando las entidades destacadas más arriba.</p></div>';
    var bar = document.querySelector('.g-bar');
    if (bar) bar.style.display = 'none';
  }

  if (typeof THREE === 'undefined' || !window.CANON) {
    fail('No se ha podido cargar el motor 3D.');
    return;
  }

  var GROUPS = window.CANON.GROUPS;
  var NODES = window.CANON.NODES;
  var EDGES = window.CANON.EDGES;

  var isTouch = window.matchMedia('(hover: none)').matches;
  var isSmall = window.matchMedia('(max-width: 700px)').matches;

  /* ============================================================
     1. Índices y grados
     ============================================================ */
  var byId = {};
  NODES.forEach(function (n, i) { n.idx = i; n.deg = 0; n.nbrs = []; byId[n.id] = n; });

  var edges = [];
  EDGES.forEach(function (e) {
    var a = byId[e[0]], b = byId[e[1]];
    if (!a || !b) { console.warn('Arista huérfana:', e); return; }
    a.deg++; b.deg++;
    a.nbrs.push({ id: b.id, rel: e[2], dir: 'out' });
    b.nbrs.push({ id: a.id, rel: e[2], dir: 'in' });
    edges.push({ a: a, b: b, rel: e[2] });
  });

  /* ============================================================
     2. Layout dirigido por fuerzas (determinista)
     ============================================================ */
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function computeLayout() {
    var rnd = mulberry32(20260820);
    var N = NODES.length;
    var px = new Float64Array(N), py = new Float64Array(N), pz = new Float64Array(N);
    var fx = new Float64Array(N), fy = new Float64Array(N), fz = new Float64Array(N);

    for (var i = 0; i < N; i++) {
      var u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, r = 26 * Math.cbrt(rnd());
      var sp = Math.sqrt(1 - u * u);
      px[i] = r * sp * Math.cos(th); py[i] = r * sp * Math.sin(th); pz[i] = r * u;
    }

    var REP = 340, REST = 17, KS = 0.06, GRAV = 0.012, ITER = 520;

    for (var it = 0; it < ITER; it++) {
      fx.fill(0); fy.fill(0); fz.fill(0);

      for (var a = 0; a < N; a++) {
        for (var b = a + 1; b < N; b++) {
          var dx = px[a] - px[b], dy = py[a] - py[b], dz = pz[a] - pz[b];
          var d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < 0.01) { d2 = 0.01; dx = (rnd() - 0.5) * 0.1; dy = (rnd() - 0.5) * 0.1; }
          var d = Math.sqrt(d2), f = REP / d2 / d;
          fx[a] += dx * f; fy[a] += dy * f; fz[a] += dz * f;
          fx[b] -= dx * f; fy[b] -= dy * f; fz[b] -= dz * f;
        }
      }

      for (var e = 0; e < edges.length; e++) {
        var ia = edges[e].a.idx, ib = edges[e].b.idx;
        var ex = px[ib] - px[ia], ey = py[ib] - py[ia], ez = pz[ib] - pz[ia];
        var ed = Math.sqrt(ex * ex + ey * ey + ez * ez) || 0.001;
        var s = (ed - REST) * KS / ed;
        fx[ia] += ex * s; fy[ia] += ey * s; fz[ia] += ez * s;
        fx[ib] -= ex * s; fy[ib] -= ey * s; fz[ib] -= ez * s;
      }

      var cool = 1 - it / ITER;
      for (var k = 0; k < N; k++) {
        fx[k] -= px[k] * GRAV; fy[k] -= py[k] * GRAV; fz[k] -= pz[k] * GRAV;
        var step = Math.min(2.2, 0.55 + cool * 1.6);
        var fl = Math.sqrt(fx[k] * fx[k] + fy[k] * fy[k] + fz[k] * fz[k]) || 1;
        var cl = Math.min(1, step / fl);
        px[k] += fx[k] * cl; py[k] += fy[k] * cl; pz[k] += fz[k] * cl;
      }
    }

    var max = 0;
    for (var m = 0; m < N; m++) {
      var rr = Math.sqrt(px[m] * px[m] + py[m] * py[m] + pz[m] * pz[m]);
      if (rr > max) max = rr;
    }
    var scale = 58 / (max || 1);
    NODES.forEach(function (n, i) {
      n.pos = new THREE.Vector3(px[i] * scale, py[i] * scale, pz[i] * scale);
    });
  }

  computeLayout();

  /* ============================================================
     3. Escena
     ============================================================ */
  var BG = 0x07111f;
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  scene.fog = new THREE.FogExp2(BG, 0.0062);

  var camera = new THREE.PerspectiveCamera(52, 1, 0.5, 800);
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: !isSmall, powerPreference: 'high-performance' });
  } catch (err) {
    fail('Tu navegador no tiene WebGL disponible.');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.6 : 2));
  mount.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.62));
  var keyLight = new THREE.DirectionalLight(0xffffff, 0.75);
  scene.add(keyLight);

  var sphereGeo = new THREE.SphereGeometry(1, 18, 14);
  var nodeGroup = new THREE.Group();
  scene.add(nodeGroup);

  NODES.forEach(function (n) {
    var col = new THREE.Color(GROUPS[n.g].color);
    n.baseColor = col;
    n.radius = 1.15 + Math.sqrt(n.deg) * 0.62;
    n.mat = new THREE.MeshLambertMaterial({ color: col.clone(), transparent: true, opacity: 1 });
    n.mesh = new THREE.Mesh(sphereGeo, n.mat);
    n.mesh.position.copy(n.pos);
    n.mesh.scale.setScalar(n.radius);
    n.mesh.userData.node = n;
    nodeGroup.add(n.mesh);
  });

  function makeLines(color, opacity, width) {
    var mat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: opacity, linewidth: width || 1 });
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edges.length * 6), 3));
    var ls = new THREE.LineSegments(geo, mat);
    ls.frustumCulled = false;
    scene.add(ls);
    return ls;
  }
  var baseLines = makeLines(0x3d5c86, 0.34);
  var hiLines = makeLines(0x9ec5ff, 0.95, 2);

  function rebuildLines() {
    var basePos = baseLines.geometry.attributes.position.array;
    var hiPos = hiLines.geometry.attributes.position.array;
    var bi = 0, hi = 0;
    for (var i = 0; i < edges.length; i++) {
      var e = edges[i];
      if (!visible(e.a) || !visible(e.b)) continue;
      var isHi = selected && (e.a === selected || e.b === selected);
      var arr = isHi ? hiPos : basePos;
      var o = isHi ? hi : bi;
      arr[o] = e.a.pos.x; arr[o + 1] = e.a.pos.y; arr[o + 2] = e.a.pos.z;
      arr[o + 3] = e.b.pos.x; arr[o + 4] = e.b.pos.y; arr[o + 5] = e.b.pos.z;
      if (isHi) hi += 6; else bi += 6;
    }
    baseLines.geometry.setDrawRange(0, bi / 3);
    hiLines.geometry.setDrawRange(0, hi / 3);
    baseLines.geometry.attributes.position.needsUpdate = true;
    hiLines.geometry.attributes.position.needsUpdate = true;
  }

  /* ============================================================
     4. Estado
     ============================================================ */
  var activeGroups = {};
  Object.keys(GROUPS).forEach(function (g) { activeGroups[g] = true; });

  var selected = null, hovered = null;
  var labelMode = isSmall ? 'clave' : 'todas';   // todas | clave | ninguna

  function visible(n) { return activeGroups[n.g]; }

  function isNeighbor(n) {
    if (!selected || n === selected) return false;
    for (var i = 0; i < selected.nbrs.length; i++) if (selected.nbrs[i].id === n.id) return true;
    return false;
  }

  function applyStyles() {
    NODES.forEach(function (n) {
      var vis = visible(n);
      n.mesh.visible = vis;
      if (!vis) return;
      var dim = selected && n !== selected && !isNeighbor(n);
      n.mat.opacity = dim ? 0.22 : 1;
      n.mat.color.copy(n.baseColor);
      if (n === selected) n.mat.color.offsetHSL(0, 0, 0.22);
      var s = n.radius * (n === selected ? 1.55 : (n === hovered ? 1.25 : 1));
      n.mesh.scale.setScalar(s);
    });
    rebuildLines();
  }

  /* ============================================================
     5. Etiquetas HTML proyectadas
     ============================================================ */
  var labelLayer = document.createElement('div');
  labelLayer.className = 'g-labels';
  mount.appendChild(labelLayer);

  NODES.forEach(function (n) {
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'g-label g-' + n.g;
    el.textContent = n.n;
    el.addEventListener('click', function (ev) { ev.stopPropagation(); select(n, true); });
    labelLayer.appendChild(el);
    n.label = el;
  });

  var KEY_DEG = 6;
  var _v = new THREE.Vector3();

  function updateLabels(w, h) {
    for (var i = 0; i < NODES.length; i++) {
      var n = NODES[i], el = n.label;
      var show = visible(n);
      if (show) {
        if (labelMode === 'ninguna') show = (n === selected || n === hovered);
        else if (labelMode === 'clave') show = (n === selected || n === hovered || isNeighbor(n) || n.deg >= KEY_DEG);
        if (selected && !(n === selected || isNeighbor(n)) && labelMode !== 'todas') show = false;
      }
      if (!show) { if (el.style.display !== 'none') el.style.display = 'none'; continue; }

      _v.copy(n.pos).project(camera);
      if (_v.z > 1) { el.style.display = 'none'; continue; }

      var x = (_v.x * 0.5 + 0.5) * w, y = (-_v.y * 0.5 + 0.5) * h;
      var dist = camera.position.distanceTo(n.pos);
      var op = dist > 190 ? 0 : dist > 130 ? 0.35 : 1;
      if (selected && (n === selected || isNeighbor(n))) op = 1;
      if (op === 0) { el.style.display = 'none'; continue; }

      el.style.display = 'block';
      el.style.opacity = op;
      el.style.transform = 'translate3d(' + Math.round(x) + 'px,' + Math.round(y) + 'px,0) translate(-50%,-50%)';
      el.classList.toggle('is-selected', n === selected);
    }
  }

  /* ============================================================
     6. Controles de órbita (ratón + táctil)
     ============================================================ */
  var target = new THREE.Vector3(0, 0, 0);
  var sph = { r: 165, theta: 0.7, phi: 1.15 };
  var goal = { r: sph.r, theta: sph.theta, phi: sph.phi };
  var goalTarget = target.clone();
  var autoSpin = true;

  function clampPhi(p) { return Math.max(0.12, Math.min(Math.PI - 0.12, p)); }

  function updateCamera() {
    sph.r += (goal.r - sph.r) * 0.12;
    sph.theta += (goal.theta - sph.theta) * 0.14;
    sph.phi += (goal.phi - sph.phi) * 0.14;
    target.lerp(goalTarget, 0.1);
    var sp = Math.sin(sph.phi);
    camera.position.set(
      target.x + sph.r * sp * Math.sin(sph.theta),
      target.y + sph.r * Math.cos(sph.phi),
      target.z + sph.r * sp * Math.cos(sph.theta)
    );
    camera.lookAt(target);
    keyLight.position.copy(camera.position);
  }

  var pointers = {}, lastPinch = 0, dragging = false, moved = 0, downAt = 0, downPos = null;
  var el = renderer.domElement;
  el.style.touchAction = 'none';

  function pointerCount() { return Object.keys(pointers).length; }

  el.addEventListener('pointerdown', function (ev) {
    el.setPointerCapture(ev.pointerId);
    pointers[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
    dragging = true; moved = 0; downAt = Date.now();
    downPos = { x: ev.clientX, y: ev.clientY };
    autoSpin = false;
    lastPinch = 0;
  });

  el.addEventListener('pointermove', function (ev) {
    var p = pointers[ev.pointerId];
    if (!p) { if (!isTouch) hoverAt(ev); return; }
    var dx = ev.clientX - p.x, dy = ev.clientY - p.y;
    p.x = ev.clientX; p.y = ev.clientY;
    moved += Math.abs(dx) + Math.abs(dy);

    var ids = Object.keys(pointers);
    if (ids.length >= 2) {
      var a = pointers[ids[0]], b = pointers[ids[1]];
      var dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (lastPinch) goal.r = Math.max(38, Math.min(340, goal.r * (lastPinch / dist)));
      lastPinch = dist;
    } else {
      goal.theta -= dx * 0.005;
      goal.phi = clampPhi(goal.phi - dy * 0.005);
    }
  });

  function endPointer(ev) {
    var wasDrag = moved;
    delete pointers[ev.pointerId];
    if (pointerCount() === 0) {
      dragging = false; lastPinch = 0;
      if (wasDrag < 9 && Date.now() - downAt < 420 && downPos) pickAt(downPos.x, downPos.y);
    }
  }
  el.addEventListener('pointerup', endPointer);
  el.addEventListener('pointercancel', endPointer);

  el.addEventListener('wheel', function (ev) {
    ev.preventDefault();
    autoSpin = false;
    goal.r = Math.max(38, Math.min(340, goal.r * (1 + Math.sign(ev.deltaY) * 0.11)));
  }, { passive: false });

  /* ============================================================
     7. Selección por raycasting
     ============================================================ */
  var raycaster = new THREE.Raycaster();
  var ndc = new THREE.Vector2();

  function nodeAt(cx, cy) {
    var r = el.getBoundingClientRect();
    ndc.x = ((cx - r.left) / r.width) * 2 - 1;
    ndc.y = -((cy - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    var meshes = [];
    for (var i = 0; i < NODES.length; i++) if (visible(NODES[i])) meshes.push(NODES[i].mesh);
    var hits = raycaster.intersectObjects(meshes, false);
    return hits.length ? hits[0].object.userData.node : null;
  }

  function pickAt(x, y) {
    var n = nodeAt(x, y);
    if (n) select(n, true); else clearSelection();
  }

  function hoverAt(ev) {
    var n = nodeAt(ev.clientX, ev.clientY);
    if (n !== hovered) {
      hovered = n;
      el.style.cursor = n ? 'pointer' : 'grab';
      applyStyles();
    }
  }

  /* ============================================================
     8. Vuelo de cámara
     ============================================================ */
  var flight = null;
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function flyTo(node) {
    var toTheta = Math.atan2(node.pos.x, node.pos.z) + 0.55;
    var len = node.pos.length() || 1;
    var toPhi = clampPhi(Math.acos(Math.max(-1, Math.min(1, node.pos.y / len))) + 0.12);
    flight = {
      t0: performance.now(), dur: 950,
      from: { theta: goal.theta, phi: goal.phi, r: goal.r, tgt: goalTarget.clone() },
      to: { theta: toTheta, phi: toPhi, r: 62, tgt: node.pos.clone() }
    };
  }

  function stepFlight(now) {
    if (!flight) return;
    var k = Math.min(1, (now - flight.t0) / flight.dur), e = easeInOut(k);
    var f = flight.from, t = flight.to;
    var dth = ((t.theta - f.theta + Math.PI) % (Math.PI * 2)) - Math.PI;
    goal.theta = f.theta + dth * e;
    goal.phi = f.phi + (t.phi - f.phi) * e;
    goal.r = f.r + (t.r - f.r) * e;
    goalTarget.copy(f.tgt).lerp(t.tgt, e);
    if (k >= 1) flight = null;
  }

  /* ============================================================
     9. Panel flotante
     ============================================================ */
  var panel = document.getElementById('g-panel');
  var panelBody = document.getElementById('g-panel-body');

  function wikiURL(title) { return 'https://es.wikipedia.org/wiki/' + encodeURIComponent(title.replace(/ /g, '_')); }
  function sourceURL(title) { return 'https://es.wikisource.org/wiki/' + encodeURIComponent(title.replace(/ /g, '_')); }

  function el2(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function renderPanel(n) {
    panelBody.innerHTML = '';

    var head = el2('div', 'g-panel-head');
    var pill = el2('span', 'g-pill g-' + n.g, GROUPS[n.g].label.replace(/s$/, ''));
    head.appendChild(pill);
    if (n.d && n.d !== '—') head.appendChild(el2('span', 'g-dates', n.d));
    panelBody.appendChild(head);

    panelBody.appendChild(el2('h3', 'g-panel-title', n.n));
    panelBody.appendChild(el2('p', 'g-summary', n.s));

    var links = el2('div', 'g-links');
    var a1 = el2('a', 'g-link', 'Wikipedia');
    a1.href = wikiURL(n.w); a1.target = '_blank'; a1.rel = 'noopener noreferrer';
    links.appendChild(a1);
    if (n.t) {
      var a2 = el2('a', 'g-link', 'Texto completo');
      a2.href = sourceURL(n.t); a2.target = '_blank'; a2.rel = 'noopener noreferrer';
      links.appendChild(a2);
    }
    panelBody.appendChild(links);

    panelBody.appendChild(el2('h4', 'g-sub', 'Viajar a (' + n.nbrs.length + ')'));
    var list = el2('div', 'g-travel');
    n.nbrs.slice().sort(function (a, b) {
      return byId[a.id].n.localeCompare(byId[b.id].n, 'es');
    }).forEach(function (nb) {
      var t = byId[nb.id];
      var b = el2('button', 'g-travel-item');
      b.type = 'button';
      if (!visible(t)) b.classList.add('is-off');
      var dot = el2('span', 'g-dot g-' + t.g);
      var txt = el2('span', 'g-travel-txt');
      txt.appendChild(el2('strong', null, t.n));
      var relTxt = nb.dir === 'out' ? nb.rel : '← ' + nb.rel;
      txt.appendChild(el2('em', null, relTxt));
      b.appendChild(dot); b.appendChild(txt);
      b.addEventListener('click', function () {
        if (!visible(t)) { activeGroups[t.g] = true; syncGroupUI(); }
        select(t, true);
      });
      list.appendChild(b);
    });
    panelBody.appendChild(list);

    panelBody.appendChild(el2('h4', 'g-sub', 'Grupos activos'));
    panelBody.appendChild(buildGroupChips('panel'));

    panel.classList.add('is-open');
  }

  function buildGroupChips(scopeName) {
    var wrap = el2('div', 'g-chips');
    Object.keys(GROUPS).forEach(function (g) {
      var count = NODES.filter(function (n) { return n.g === g; }).length;
      var b = el2('button', 'g-chip g-' + g);
      b.type = 'button';
      b.dataset.group = g;
      b.dataset.scope = scopeName;
      b.setAttribute('aria-pressed', String(activeGroups[g]));
      b.appendChild(el2('span', 'g-dot g-' + g));
      b.appendChild(el2('span', null, GROUPS[g].label));
      b.appendChild(el2('span', 'g-count', String(count)));
      b.addEventListener('click', function () { toggleGroup(g); });
      wrap.appendChild(b);
    });
    return wrap;
  }

  function toggleGroup(g) {
    var on = Object.keys(activeGroups).filter(function (k) { return activeGroups[k]; });
    if (activeGroups[g] && on.length === 1) return;   // nunca dejar el grafo vacío
    activeGroups[g] = !activeGroups[g];
    if (selected && !visible(selected)) clearSelection();
    syncGroupUI();
  }

  function syncGroupUI() {
    document.querySelectorAll('.g-chip').forEach(function (b) {
      b.setAttribute('aria-pressed', String(activeGroups[b.dataset.group]));
    });
    document.querySelectorAll('.g-travel-item').forEach(function () { /* refrescado al reabrir */ });
    applyStyles();
    if (selected) renderPanel(selected);
  }

  function select(n, fly) {
    selected = n;
    applyStyles();
    renderPanel(n);
    if (fly) flyTo(n);
    autoSpin = false;
  }

  function clearSelection() {
    selected = null;
    panel.classList.remove('is-open');
    applyStyles();
  }

  document.getElementById('g-close').addEventListener('click', clearSelection);
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') clearSelection();
  });

  /* ============================================================
     10. Barra de herramientas
     ============================================================ */
  var toolbar = document.getElementById('g-toolbar');
  toolbar.appendChild(buildGroupChips('toolbar'));

  var search = document.getElementById('g-search');
  var results = document.getElementById('g-results');

  function closeResults() { results.innerHTML = ''; results.classList.remove('is-open'); }

  search.addEventListener('input', function () {
    var q = search.value.trim().toLowerCase();
    results.innerHTML = '';
    if (q.length < 2) { closeResults(); return; }
    var hits = NODES.filter(function (n) {
      return n.n.toLowerCase().indexOf(q) !== -1 || n.s.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 8);
    if (!hits.length) { closeResults(); return; }
    hits.forEach(function (n) {
      var b = el2('button', 'g-result');
      b.type = 'button';
      b.appendChild(el2('span', 'g-dot g-' + n.g));
      b.appendChild(el2('span', null, n.n));
      b.addEventListener('click', function () {
        if (!visible(n)) { activeGroups[n.g] = true; syncGroupUI(); }
        select(n, true);
        search.value = ''; closeResults();
      });
      results.appendChild(b);
    });
    results.classList.add('is-open');
  });
  search.addEventListener('blur', function () { setTimeout(closeResults, 180); });

  var labelBtn = document.getElementById('g-labels-btn');
  var LABEL_ORDER = ['todas', 'clave', 'ninguna'];
  var LABEL_TXT = { todas: 'Etiquetas: todas', clave: 'Etiquetas: clave', ninguna: 'Etiquetas: off' };
  function syncLabelBtn() { labelBtn.textContent = LABEL_TXT[labelMode]; }
  labelBtn.addEventListener('click', function () {
    labelMode = LABEL_ORDER[(LABEL_ORDER.indexOf(labelMode) + 1) % 3];
    syncLabelBtn();
  });
  syncLabelBtn();

  document.getElementById('g-reset').addEventListener('click', function () {
    clearSelection();
    Object.keys(activeGroups).forEach(function (g) { activeGroups[g] = true; });
    goal.r = 165; goal.theta = 0.7; goal.phi = 1.15;
    goalTarget.set(0, 0, 0);
    flight = null; autoSpin = true;
    syncGroupUI();
  });

  var fsBtn = document.getElementById('g-fullscreen');
  var stage = document.getElementById('g-stage');
  fsBtn.addEventListener('click', function () {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (stage.requestFullscreen) stage.requestFullscreen();
  });
  document.addEventListener('fullscreenchange', function () {
    fsBtn.textContent = document.fullscreenElement ? 'Salir' : 'Ampliar';
    resize();
  });

  /* ============================================================
     11. Bucle
     ============================================================ */
  var W = 0, H = 0;
  function resize() {
    var r = mount.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H, false);
  }
  window.addEventListener('resize', resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(mount);
  resize();

  var running = true;
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (entries) {
      running = entries[0].isIntersecting;
    }, { threshold: 0.01 }).observe(mount);
  }

  applyStyles();

  function loop(now) {
    requestAnimationFrame(loop);
    if (!running) return;
    stepFlight(now);
    if (autoSpin && !dragging && !flight) goal.theta += 0.00075;
    updateCamera();
    renderer.render(scene, camera);
    updateLabels(W, H);
  }
  requestAnimationFrame(loop);

  el.style.cursor = 'grab';
})();
