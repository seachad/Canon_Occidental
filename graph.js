/* El Canon de Occidente — globo semántico 3D (Three.js r128)
   Los nodos viven sobre la superficie de una esfera: girar el globo es navegar el canon.
   Sin dependencias más allá de three.min.js. Todo el estado vive en este módulo. */
(function () {
  'use strict';

  var mount = document.getElementById('graph3d');
  if (!mount) return;

  function fail(msg) {
    mount.innerHTML = '<div class="g-fallback"><strong>' + msg + '</strong>' +
      '<p>Prueba con un navegador con WebGL activado.</p></div>';
    ['.g-bar', '#g-toolbar', '#g-compass', '#g-time', '#g-hint'].forEach(function (sel) {
      var e = document.querySelector(sel);
      if (e) e.style.display = 'none';
    });
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

  var R = 60;              // radio del globo
  var ARC_SEG = 16;        // segmentos por arista

  /* ============================================================
     1. Índices, grados y cronología
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

  var ROMAN = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  function roman(s) {
    var v = 0;
    for (var i = 0; i < s.length; i++) {
      var c = ROMAN[s[i]], nx = ROMAN[s[i + 1]];
      v += (nx && nx > c) ? -c : c;
    }
    return v;
  }

  /* '470–399 a. C.' · 's. VIII a. C.' · '63 a. C. – 14 d. C.' · '476' · '—' */
  function parseYears(str) {
    if (!str || str === '—') return null;
    var s = str.replace(/([–—-])\s*([IVXLCDM]+)\b/g, '$1s. $2');
    var re = /(\d+)|s\.\s*([IVXLCDM]+)/g, m, out = [];
    while ((m = re.exec(s)) !== null) {
      var rest = s.slice(m.index);
      var ia = rest.indexOf('a. C.'), id = rest.indexOf('d. C.');
      var bc = ia !== -1 && (id === -1 || ia < id);
      var v = m[1] ? parseInt(m[1], 10) : roman(m[2]) * 100 - 50;
      out.push(bc ? -v : v);
    }
    if (!out.length) return null;
    return { a: out[0], b: out[out.length - 1] };
  }

  NODES.forEach(function (n) {
    var y = parseYears(n.d);
    n.y0 = y ? y.a : null;
    n.y1 = y ? y.b : null;
  });

  /* ============================================================
     2. Layout esférico dirigido por fuerzas (determinista)
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
    var rnd = mulberry32(20260821);
    var N = NODES.length;
    var px = new Float64Array(N), py = new Float64Array(N), pz = new Float64Array(N);
    var fx = new Float64Array(N), fy = new Float64Array(N), fz = new Float64Array(N);

    /* semilla: espiral de Fibonacci con jitter → reparto inicial uniforme */
    var GA = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < N; i++) {
      var y = 1 - (i + 0.5) * 2 / N;
      var rad = Math.sqrt(Math.max(0, 1 - y * y));
      var th = GA * i + rnd() * 0.7;
      px[i] = R * rad * Math.cos(th); py[i] = R * y; pz[i] = R * rad * Math.sin(th);
    }

    var groupKeys = Object.keys(GROUPS);
    var gIndex = {};
    groupKeys.forEach(function (g, i) { gIndex[g] = i; });
    var cx = new Float64Array(groupKeys.length), cy = new Float64Array(groupKeys.length),
        cz = new Float64Array(groupKeys.length), cn = new Float64Array(groupKeys.length);

    var REP = 900, REST = 22, KS = 0.06, GK = 0.014, ITER = 600;

    for (var it = 0; it < ITER; it++) {
      fx.fill(0); fy.fill(0); fz.fill(0);
      cx.fill(0); cy.fill(0); cz.fill(0); cn.fill(0);

      for (var c = 0; c < N; c++) {
        var gi = gIndex[NODES[c].g];
        cx[gi] += px[c]; cy[gi] += py[c]; cz[gi] += pz[c]; cn[gi]++;
      }

      for (var a = 0; a < N; a++) {
        for (var b = a + 1; b < N; b++) {
          var dx = px[a] - px[b], dy = py[a] - py[b], dz = pz[a] - pz[b];
          var d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < 0.01) { d2 = 0.01; dx = (rnd() - 0.5) * 0.1; dy = (rnd() - 0.5) * 0.1; }
          var f = REP / d2 / Math.sqrt(d2);
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

      /* cohesión suave por grupo: regiones de color legibles en el globo */
      for (var k = 0; k < N; k++) {
        var g2 = gIndex[NODES[k].g];
        if (cn[g2] > 1) {
          fx[k] += (cx[g2] / cn[g2] - px[k]) * GK;
          fy[k] += (cy[g2] / cn[g2] - py[k]) * GK;
          fz[k] += (cz[g2] / cn[g2] - pz[k]) * GK;
        }
      }

      var cool = 1 - it / ITER;
      var step = 0.5 + cool * 1.7;
      for (var m = 0; m < N; m++) {
        var fl = Math.sqrt(fx[m] * fx[m] + fy[m] * fy[m] + fz[m] * fz[m]) || 1;
        var cl = Math.min(1, step / fl);
        px[m] += fx[m] * cl; py[m] += fy[m] * cl; pz[m] += fz[m] * cl;
        /* proyección a la esfera: el grafo es siempre un globo */
        var len = Math.sqrt(px[m] * px[m] + py[m] * py[m] + pz[m] * pz[m]) || 1;
        px[m] = px[m] / len * R; py[m] = py[m] / len * R; pz[m] = pz[m] / len * R;
      }
    }

    NODES.forEach(function (n, i) {
      n.dir = new THREE.Vector3(px[i], py[i], pz[i]).normalize();
      n.radius = 1.35 + Math.sqrt(n.deg) * 0.7;
      n.pos = n.dir.clone().multiplyScalar(R + n.radius * 0.55);
      n.surf = n.dir.clone().multiplyScalar(R);
    });
  }

  computeLayout();

  /* ============================================================
     3. Escena
     ============================================================ */
  var BG = 0x050b16;
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  scene.fog = new THREE.FogExp2(BG, 0.0026);

  var camera = new THREE.PerspectiveCamera(50, 1, 0.5, 1400);
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: !isSmall, powerPreference: 'high-performance' });
  } catch (err) {
    fail('Tu navegador no tiene WebGL disponible.');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.6 : 2));
  mount.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  var keyLight = new THREE.DirectionalLight(0xdfeaff, 0.85);
  scene.add(keyLight);
  var rimLight = new THREE.DirectionalLight(0x7f6bff, 0.35);
  rimLight.position.set(-1, 0.6, -1);
  scene.add(rimLight);

  /* --- estrellas --- */
  (function stars() {
    var COUNT = 1500, rnd = mulberry32(7727);
    var pos = new Float32Array(COUNT * 3), col = new Float32Array(COUNT * 3);
    var tint = [new THREE.Color(0xffffff), new THREE.Color(0xa9c6ff), new THREE.Color(0xffd9a8)];
    for (var i = 0; i < COUNT; i++) {
      var u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, sp = Math.sqrt(1 - u * u);
      var r = 340 + rnd() * 420;
      pos[i * 3] = r * sp * Math.cos(th); pos[i * 3 + 1] = r * u; pos[i * 3 + 2] = r * sp * Math.sin(th);
      var c = tint[(rnd() * 3) | 0].clone().multiplyScalar(0.45 + rnd() * 0.55);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
      size: 1.8, sizeAttenuation: true, vertexColors: true,
      transparent: true, opacity: 0.9, fog: false, depthWrite: false
    })));
  })();

  /* --- núcleo opaco: oculta la cara oculta del globo y da profundidad --- */
  var core = new THREE.Mesh(
    new THREE.SphereGeometry(R * 0.985, 56, 40),
    new THREE.MeshPhongMaterial({
      color: 0x0a1730, emissive: 0x050d1c, specular: 0x1d3355, shininess: 14,
      transparent: true, opacity: 0.94
    })
  );
  scene.add(core);

  /* --- retícula de meridianos y paralelos --- */
  function circlePoints(radius, lat, tilt) {
    var pts = [], SEG = 96;
    for (var i = 0; i <= SEG; i++) {
      var t = i / SEG * Math.PI * 2;
      var y = Math.sin(lat) * radius, rr = Math.cos(lat) * radius;
      var v = new THREE.Vector3(rr * Math.cos(t), y, rr * Math.sin(t));
      if (tilt) v.applyAxisAngle(new THREE.Vector3(0, 0, 1), tilt);
      pts.push(v);
    }
    return pts;
  }

  function addLineLoop(pts, color, opacity) {
    var geo = new THREE.BufferGeometry().setFromPoints(pts);
    var line = new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: color, transparent: true, opacity: opacity, depthWrite: false
    }));
    scene.add(line);
    return line;
  }

  (function grid() {
    var GR = R * 0.995;
    for (var i = 0; i < 12; i++) addLineLoop(circlePoints(GR, 0, 0).map(function (p) {
      return p.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), i * Math.PI / 12);
    }), 0x2b4c7d, 0.34);
    [-60, -30, 30, 60].forEach(function (lat) {
      addLineLoop(circlePoints(GR, lat * Math.PI / 180, 0), 0x2b4c7d, 0.3);
    });
    addLineLoop(circlePoints(GR, 0, 0), 0x6ea8fe, 0.5);          // ecuador
    addLineLoop(circlePoints(R * 1.17, 0, 0), 0xb28cff, 0.22);   // anillo orbital
  })();

  /* --- atmósfera (fresnel) --- */
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.13, 48, 32),
    new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(0x3d7ddb) }, uInt: { value: 0.85 } },
      vertexShader: 'varying vec3 vN; varying vec3 vP;' +
        'void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0);' +
        ' vP = mv.xyz; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 uColor; uniform float uInt; varying vec3 vN; varying vec3 vP;' +
        'void main(){ float f = pow(1.0 - abs(dot(vN, normalize(-vP))), 2.7);' +
        ' gl_FragColor = vec4(uColor, f * uInt); }',
      side: THREE.BackSide, blending: THREE.AdditiveBlending,
      transparent: true, depthWrite: false
    })
  ));

  /* --- halo de nodo --- */
  var glowTex = (function () {
    var c = document.createElement('canvas');
    c.width = c.height = 128;
    var g = c.getContext('2d');
    var grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.22, 'rgba(255,255,255,.62)');
    grd.addColorStop(0.55, 'rgba(255,255,255,.16)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    var t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  })();

  var sphereGeo = new THREE.SphereGeometry(1, 20, 16);
  var nodeGroup = new THREE.Group();
  scene.add(nodeGroup);

  NODES.forEach(function (n) {
    var col = new THREE.Color(GROUPS[n.g].color);
    n.baseColor = col;
    n.mat = new THREE.MeshPhongMaterial({
      color: col.clone(), emissive: col.clone().multiplyScalar(0.3),
      specular: 0x9fb6d8, shininess: 55, transparent: true, opacity: 1
    });
    n.mesh = new THREE.Mesh(sphereGeo, n.mat);
    n.mesh.position.copy(n.pos);
    n.mesh.scale.setScalar(n.radius);
    n.mesh.userData.node = n;
    nodeGroup.add(n.mesh);

    n.glowMat = new THREE.SpriteMaterial({
      map: glowTex, color: col.clone(), transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false, fog: false
    });
    n.glow = new THREE.Sprite(n.glowMat);
    n.glow.position.copy(n.pos);
    n.glow.scale.setScalar(n.radius * 5.5);
    nodeGroup.add(n.glow);
  });

  /* --- aristas como arcos sobre la superficie --- */
  var _a = new THREE.Vector3(), _b = new THREE.Vector3();
  edges.forEach(function (e) {
    var va = e.a.dir, vb = e.b.dir;
    var dot = Math.max(-1, Math.min(1, va.dot(vb)));
    var ang = Math.acos(dot);
    var lift = 1 + 0.055 + 0.2 * Math.min(1, ang / 1.6);
    var ca = e.a.baseColor, cb = e.b.baseColor;
    var pts = [], cols = [];
    for (var i = 0; i <= ARC_SEG; i++) {
      var t = i / ARC_SEG, v;
      if (ang < 1e-4) v = va.clone();
      else {
        _a.copy(va).multiplyScalar(Math.sin((1 - t) * ang) / Math.sin(ang));
        _b.copy(vb).multiplyScalar(Math.sin(t * ang) / Math.sin(ang));
        v = _a.clone().add(_b).normalize();
      }
      pts.push(v.multiplyScalar(R * (1 + (lift - 1) * Math.sin(Math.PI * t))));
      cols.push(ca.clone().lerp(cb, t));
    }
    /* pares de vértices para LineSegments */
    var lp = new Float32Array(ARC_SEG * 6), lc = new Float32Array(ARC_SEG * 6), lh = new Float32Array(ARC_SEG * 6);
    for (var s = 0; s < ARC_SEG; s++) {
      var o = s * 6;
      lp[o] = pts[s].x; lp[o + 1] = pts[s].y; lp[o + 2] = pts[s].z;
      lp[o + 3] = pts[s + 1].x; lp[o + 4] = pts[s + 1].y; lp[o + 5] = pts[s + 1].z;
      var c1 = cols[s], c2 = cols[s + 1];
      lc[o] = c1.r; lc[o + 1] = c1.g; lc[o + 2] = c1.b;
      lc[o + 3] = c2.r; lc[o + 4] = c2.g; lc[o + 5] = c2.b;
      var h1 = c1.clone().lerp(new THREE.Color(0xffffff), 0.55);
      var h2 = c2.clone().lerp(new THREE.Color(0xffffff), 0.55);
      lh[o] = h1.r; lh[o + 1] = h1.g; lh[o + 2] = h1.b;
      lh[o + 3] = h2.r; lh[o + 4] = h2.g; lh[o + 5] = h2.b;
    }
    e.lp = lp; e.lc = lc; e.lh = lh;
  });

  function makeArcLayer(opacity) {
    var geo = new THREE.BufferGeometry();
    var cap = edges.length * ARC_SEG * 6;
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(cap), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cap), 3));
    var ls = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: opacity,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    ls.frustumCulled = false;
    scene.add(ls);
    return ls;
  }
  var baseArcs = makeArcLayer(0.38);
  var hiArcs = makeArcLayer(1);

  function rebuildArcs() {
    var bp = baseArcs.geometry.attributes.position.array, bc = baseArcs.geometry.attributes.color.array;
    var hp = hiArcs.geometry.attributes.position.array, hc = hiArcs.geometry.attributes.color.array;
    var bi = 0, hi = 0, len = ARC_SEG * 6;
    for (var i = 0; i < edges.length; i++) {
      var e = edges[i];
      if (!visible(e.a) || !visible(e.b)) continue;
      if (selected && (e.a === selected || e.b === selected)) {
        hp.set(e.lp, hi); hc.set(e.lh, hi); hi += len;
      } else {
        bp.set(e.lp, bi); bc.set(e.lc, bi); bi += len;
      }
    }
    baseArcs.geometry.setDrawRange(0, bi / 3);
    hiArcs.geometry.setDrawRange(0, hi / 3);
    baseArcs.geometry.attributes.position.needsUpdate = true;
    baseArcs.geometry.attributes.color.needsUpdate = true;
    hiArcs.geometry.attributes.position.needsUpdate = true;
    hiArcs.geometry.attributes.color.needsUpdate = true;
    baseArcs.material.opacity = selected ? 0.14 : 0.38;
  }

  /* ============================================================
     4. Estado (persistente: todo lo que elige el usuario se guarda)
     ============================================================ */
  var STORE_KEY = 'canon.state.v1';
  var DEFAULT_ID = 'socrates';
  var DEFAULT_YEARS = 50;
  var YEARS_MIN = 1, YEARS_MAX = 1000000;

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (err) { return {}; }
  }
  var saved = loadState();

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        sel: selected ? selected.id : DEFAULT_ID,
        years: years,
        groups: activeGroups,
        timeTypes: timeTypes,
        timeUserSet: timeUserSet,
        labelMode: labelMode,
        timeCollapsed: timeCollapsed
      }));
    } catch (err) { /* almacenamiento no disponible */ }
  }

  var activeGroups = {};
  Object.keys(GROUPS).forEach(function (g) {
    activeGroups[g] = saved.groups && typeof saved.groups[g] === 'boolean' ? saved.groups[g] : true;
  });
  if (!Object.keys(activeGroups).some(function (g) { return activeGroups[g]; })) {
    Object.keys(activeGroups).forEach(function (g) { activeGroups[g] = true; });
  }

  var years = Math.max(YEARS_MIN, Math.min(YEARS_MAX, parseInt(saved.years, 10) || DEFAULT_YEARS));

  /* siempre hay un elemento seleccionado: es el centro de la ventana temporal */
  var selected = byId[saved.sel] || byId[DEFAULT_ID] || NODES[0];
  var hovered = null;
  var labelMode = saved.labelMode || (isSmall ? 'clave' : 'todas');   // todas | clave | ninguna
  var timeCollapsed = !!saved.timeCollapsed;

  /* La ventana se mide contra el intervalo del elemento seleccionado.
     Los nodos sin fecha (lugares) permanecen siempre: son el tejido conectivo. */
  function inWindow(n) {
    if (n === selected) return true;
    if (n.y0 === null || !selected || selected.y0 === null) return true;
    var lo = Math.min(selected.y0, selected.y1) - years;
    var hi = Math.max(selected.y0, selected.y1) + years;
    return Math.max(n.y0, n.y1) >= lo && Math.min(n.y0, n.y1) <= hi;
  }

  function visible(n) { return (activeGroups[n.g] && inWindow(n)) || n === selected; }

  function isNeighbor(n) {
    if (!selected || n === selected) return false;
    for (var i = 0; i < selected.nbrs.length; i++) if (selected.nbrs[i].id === n.id) return true;
    return false;
  }

  function relWith(n) {
    if (!selected) return null;
    for (var i = 0; i < selected.nbrs.length; i++) {
      if (selected.nbrs[i].id === n.id) {
        var nb = selected.nbrs[i];
        return nb.dir === 'out' ? nb.rel : '← ' + nb.rel;
      }
    }
    return null;
  }

  function applyStyles() {
    NODES.forEach(function (n) {
      var vis = visible(n);
      n.mesh.visible = vis; n.glow.visible = vis;
      if (!vis) return;
      var dim = selected && n !== selected && !isNeighbor(n);
      n.mat.opacity = dim ? 0.55 : 1;
      n.glowMat.opacity = dim ? 0.28 : (n === selected ? 0.95 : (n === hovered ? 0.75 : 0.5));
      n.mat.color.copy(n.baseColor);
      n.mat.emissive.copy(n.baseColor).multiplyScalar(n === selected ? 0.62 : 0.3);
      var s = n.radius * (n === selected ? 1.6 : (n === hovered ? 1.25 : 1));
      n.mesh.scale.setScalar(s);
      n.glow.scale.setScalar(s * 5.5);
    });
    rebuildArcs();
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
  var _v = new THREE.Vector3(), _c = new THREE.Vector3();

  function updateLabels(w, h) {
    for (var i = 0; i < NODES.length; i++) {
      var n = NODES[i], el = n.label;
      var show = visible(n);
      if (show) {
        if (labelMode === 'ninguna') show = (n === selected || n === hovered);
        else if (labelMode === 'clave') show = (n === selected || n === hovered || isNeighbor(n) || n.deg >= KEY_DEG);
        if (selected && !(n === selected || isNeighbor(n)) && labelMode !== 'todas') show = false;
      }
      /* cara oculta del globo: fuera */
      if (show) {
        _c.copy(camera.position).sub(n.pos);
        if (n.dir.dot(_c.normalize()) < 0.06) show = false;
      }
      if (!show) { if (el.style.display !== 'none') el.style.display = 'none'; continue; }

      _v.copy(n.pos).project(camera);
      if (_v.z > 1) { el.style.display = 'none'; continue; }

      var x = (_v.x * 0.5 + 0.5) * w, y = (-_v.y * 0.5 + 0.5) * h;
      var dist = camera.position.distanceTo(n.pos);
      var op = dist > 230 ? 0 : dist > 165 ? 0.4 : 1;
      if (selected && (n === selected || isNeighbor(n))) op = 1;
      if (op === 0) { el.style.display = 'none'; continue; }

      el.style.display = 'block';
      el.style.opacity = op;
      el.style.transform = 'translate3d(' + Math.round(x) + 'px,' + Math.round(y) + 'px,0) translate(-50%,-50%)';
      el.classList.toggle('is-selected', n === selected);
    }
  }

  /* ============================================================
     6. Órbita alrededor del globo (ratón + táctil + teclado)
     ============================================================ */
  var R_MIN = 84, R_MAX = 330, R_HOME = 168, R_FOCUS = 112;
  var sph = { r: R_HOME + 60, theta: 0.6, phi: 1.1 };
  var goal = { r: R_HOME, theta: 0.6, phi: 1.1 };
  var autoSpin = true;

  function clampPhi(p) { return Math.max(0.16, Math.min(Math.PI - 0.16, p)); }
  function clampR(r) { return Math.max(R_MIN, Math.min(R_MAX, r)); }

  function updateCamera() {
    sph.r += (goal.r - sph.r) * 0.09;
    sph.theta += (goal.theta - sph.theta) * 0.11;
    sph.phi += (goal.phi - sph.phi) * 0.11;
    var sp = Math.sin(sph.phi);
    camera.position.set(sph.r * sp * Math.sin(sph.theta), sph.r * Math.cos(sph.phi), sph.r * sp * Math.cos(sph.theta));
    camera.lookAt(0, 0, 0);
    keyLight.position.copy(camera.position).multiplyScalar(0.6);
    keyLight.position.y += 60;
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
    autoSpin = false; lastPinch = 0;
    hideHint();
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
      if (lastPinch) goal.r = clampR(goal.r * (lastPinch / dist));
      lastPinch = dist;
    } else {
      flight = null;
      goal.theta -= dx * 0.0052;
      goal.phi = clampPhi(goal.phi - dy * 0.0052);
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
    autoSpin = false; hideHint();
    goal.r = clampR(goal.r * (1 + Math.sign(ev.deltaY) * 0.1));
  }, { passive: false });

  document.addEventListener('keydown', function (ev) {
    if (ev.target && /^(INPUT|TEXTAREA)$/.test(ev.target.tagName)) return;
    var k = ev.key;
    if (k === 'Escape') { closePanel(); return; }
    if (k === 'ArrowLeft') { goal.theta += 0.16; autoSpin = false; flight = null; }
    else if (k === 'ArrowRight') { goal.theta -= 0.16; autoSpin = false; flight = null; }
    else if (k === 'ArrowUp') { goal.phi = clampPhi(goal.phi - 0.12); autoSpin = false; flight = null; }
    else if (k === 'ArrowDown') { goal.phi = clampPhi(goal.phi + 0.12); autoSpin = false; flight = null; }
    else if (k === '+' || k === '=') goal.r = clampR(goal.r * 0.88);
    else if (k === '-' || k === '_') goal.r = clampR(goal.r * 1.12);
    else return;
    ev.preventDefault();
    hideHint();
  });

  /* ============================================================
     7. Selección por raycasting
     ============================================================ */
  var raycaster = new THREE.Raycaster();
  var ndc = new THREE.Vector2();
  var _f = new THREE.Vector3();

  function facing(n) {
    _f.copy(camera.position).sub(n.pos).normalize();
    return n.dir.dot(_f) > 0;
  }

  function nodeAt(cx, cy) {
    var r = el.getBoundingClientRect();
    ndc.x = ((cx - r.left) / r.width) * 2 - 1;
    ndc.y = -((cy - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    var meshes = [];
    for (var i = 0; i < NODES.length; i++) if (visible(NODES[i]) && facing(NODES[i])) meshes.push(NODES[i].mesh);
    var hits = raycaster.intersectObjects(meshes, false);
    return hits.length ? hits[0].object.userData.node : null;
  }

  function pickAt(x, y) {
    var n = nodeAt(x, y);
    if (n) select(n, true); else closePanel();
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
     8. Giro del globo hacia un nodo
     ============================================================ */
  var flight = null;
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function flyTo(node) {
    var toPhi = clampPhi(Math.acos(Math.max(-1, Math.min(1, node.dir.y))));
    var toTheta = Math.atan2(node.dir.x, node.dir.z);
    flight = {
      t0: performance.now(), dur: 900,
      from: { theta: goal.theta, phi: goal.phi, r: goal.r },
      to: { theta: toTheta, phi: toPhi, r: Math.min(goal.r, R_FOCUS) }
    };
  }

  function stepFlight(now) {
    if (!flight) return;
    var k = Math.min(1, (now - flight.t0) / flight.dur), e = easeInOut(k);
    var f = flight.from, t = flight.to;
    var dth = ((t.theta - f.theta + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
    goal.theta = f.theta + dth * e;
    goal.phi = f.phi + (t.phi - f.phi) * e;
    goal.r = f.r + (t.r - f.r) * e;
    if (k >= 1) flight = null;
  }

  /* ============================================================
     9. Ficha del nodo
     ============================================================ */
  var panel = document.getElementById('g-panel');
  var panelBody = document.getElementById('g-panel-body');

  function wikiURL(t) { return 'https://es.wikipedia.org/wiki/' + encodeURIComponent(t.replace(/ /g, '_')); }
  function sourceURL(t) { return 'https://es.wikisource.org/wiki/' + encodeURIComponent(t.replace(/ /g, '_')); }

  function el2(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function singular(g) { return GROUPS[g].label.replace(/s$/, ''); }

  function renderPanel(n) {
    panelBody.innerHTML = '';

    var head = el2('div', 'g-panel-head');
    head.appendChild(el2('span', 'g-pill g-' + n.g, singular(n.g)));
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
      b.appendChild(el2('span', 'g-dot g-' + t.g));
      var txt = el2('span', 'g-travel-txt');
      txt.appendChild(el2('strong', null, t.n));
      txt.appendChild(el2('em', null, (nb.dir === 'out' ? '' : '← ') + nb.rel));
      b.appendChild(txt);
      b.addEventListener('click', function () {
        if (!visible(t)) { activeGroups[t.g] = true; syncGroupUI(); }
        select(t, true);
      });
      list.appendChild(b);
    });
    panelBody.appendChild(list);

    panel.classList.add('is-open');
  }

  function buildGroupChips() {
    var wrap = el2('div', 'g-chips');
    Object.keys(GROUPS).forEach(function (g) {
      var count = NODES.filter(function (n) { return n.g === g; }).length;
      var b = el2('button', 'g-chip g-' + g);
      b.type = 'button';
      b.dataset.group = g;
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
    if (activeGroups[g] && on.length === 1) return;   // nunca dejar el globo vacío
    activeGroups[g] = !activeGroups[g];
    syncGroupUI();
  }

  function syncGroupUI() {
    document.querySelectorAll('.g-chip').forEach(function (b) {
      b.setAttribute('aria-pressed', String(activeGroups[b.dataset.group]));
    });
    refresh();
  }

  /* Recalcula todo lo que depende de la selección, los grupos o la ventana */
  function refresh() {
    applyStyles();
    if (panelOpen && selected) renderPanel(selected);
    renderTime();
    syncWindowUI();
    save();
  }

  var panelOpen = false;

  function select(n, fly) {
    selected = n;
    panelOpen = true;
    autoSpin = false;
    hideHint();
    if (fly) flyTo(n);
    focusTimeTypes(n);        // ajusta los tipos de la cronología
    refresh();                // renderiza la ficha, el globo y la cronología
  }

  function closePanel() {
    panelOpen = false;
    panel.classList.remove('is-open');
  }

  document.getElementById('g-close').addEventListener('click', closePanel);

  /* ============================================================
     10. Cronología (filtrable por tipo, sincronizada con la selección)
     ============================================================ */
  var timeTypes = {};
  var TIME_DEFAULT = { persona: true, obra: false, idea: false, evento: true, lugar: false };
  Object.keys(GROUPS).forEach(function (g) {
    timeTypes[g] = saved.timeTypes && typeof saved.timeTypes[g] === 'boolean'
      ? saved.timeTypes[g] : !!TIME_DEFAULT[g];
  });
  if (!Object.keys(timeTypes).some(function (g) { return timeTypes[g]; })) {
    Object.keys(timeTypes).forEach(function (g) { timeTypes[g] = !!TIME_DEFAULT[g]; });
  }
  var timeUserSet = !!saved.timeUserSet;

  var tTypes = document.getElementById('t-types');
  var tTrack = document.getElementById('t-track');
  var tContext = document.getElementById('t-context');
  var tMin = document.getElementById('t-min');
  var tMax = document.getElementById('t-max');

  Object.keys(GROUPS).forEach(function (g) {
    var b = el2('button', 't-type g-' + g);
    b.type = 'button';
    b.dataset.group = g;
    b.appendChild(el2('span', 'g-dot g-' + g));
    b.appendChild(el2('span', null, GROUPS[g].label));
    b.appendChild(el2('span', 't-type-n', String(NODES.filter(function (n) { return n.g === g; }).length)));
    b.addEventListener('click', function () {
      var on = Object.keys(timeTypes).filter(function (k) { return timeTypes[k]; });
      if (timeTypes[g] && on.length === 1) return;      // al menos un tipo
      timeTypes[g] = !timeTypes[g];
      timeUserSet = true;
      if (timeTypes[g] && !activeGroups[g]) { activeGroups[g] = true; syncGroupUI(); return; }
      refresh();
    });
    tTypes.appendChild(b);
  });

  function syncTypeChips() {
    tTypes.querySelectorAll('.t-type').forEach(function (b) {
      b.setAttribute('aria-pressed', String(timeTypes[b.dataset.group]));
    });
  }

  /* al seleccionar: por defecto la cronología de su mismo tipo */
  function focusTimeTypes(n) {
    if (!timeUserSet) {
      Object.keys(timeTypes).forEach(function (g) { timeTypes[g] = (g === n.g); });
    } else if (!timeTypes[n.g]) {
      timeTypes[n.g] = true;
    }
  }

  function timeItems() {
    return NODES.filter(function (n) { return timeTypes[n.g] && visible(n); })
      .sort(function (a, b) {
        if (a.y0 === null && b.y0 === null) return a.n.localeCompare(b.n, 'es');
        if (a.y0 === null) return 1;
        if (b.y0 === null) return -1;
        return a.y0 - b.y0 || (a.y1 - b.y1);
      });
  }

  function renderTime() {
    syncTypeChips();
    var items = timeItems();
    var labels = Object.keys(GROUPS).filter(function (g) { return timeTypes[g]; })
      .map(function (g) { return GROUPS[g].label.toLowerCase(); }).join(' + ');
    var win = (selected && selected.y0 !== null) ? ' · ±' + years + ' años' : '';
    tContext.textContent = (selected ? selected.n + ' · ' : '') + labels + ' (' + items.length + ')' + win;

    var dated = items.filter(function (n) { return n.y0 !== null; });
    tMin.textContent = dated.length ? dated[0].d : '';
    tMax.textContent = dated.length ? dated[dated.length - 1].d : '';

    tTrack.innerHTML = '';
    if (!items.length) {
      tTrack.appendChild(el2('p', 't-empty', 'Ningún elemento con los tipos activos.'));
      return;
    }

    var selCard = null;
    items.forEach(function (n) {
      var b = el2('button', 't-card g-' + n.g);
      b.type = 'button';
      var rel = relWith(n);
      if (n === selected) { b.classList.add('is-selected'); selCard = b; }
      else if (rel) b.classList.add('is-linked');
      b.appendChild(el2('span', 't-year', n.d && n.d !== '—' ? n.d : 'sin fecha'));
      b.appendChild(el2('span', 't-name', n.n));
      b.appendChild(el2('span', 't-rel', n === selected ? 'en el centro del grafo' : (rel || singular(n.g))));
      b.addEventListener('click', function () { select(n, true); });
      tTrack.appendChild(b);
    });

    if (selCard) {
      tTrack.scrollLeft = Math.max(0, selCard.offsetLeft - tTrack.clientWidth / 2 + selCard.offsetWidth / 2);
    } else {
      tTrack.scrollLeft = 0;
    }
  }

  var tToggle = document.getElementById('t-toggle');
  var timeBox = document.getElementById('g-time');

  function syncTimeCollapsed() {
    timeBox.classList.toggle('is-collapsed', timeCollapsed);
    tToggle.textContent = timeCollapsed ? 'Mostrar' : 'Ocultar';
    tToggle.setAttribute('aria-expanded', String(!timeCollapsed));
    if (timeCollapsed) document.documentElement.style.setProperty('--time-h', '44px');
    else document.documentElement.style.removeProperty('--time-h');
  }
  tToggle.addEventListener('click', function () {
    timeCollapsed = !timeCollapsed;
    syncTimeCollapsed();
    save();
  });
  syncTimeCollapsed();

  /* ============================================================
     10 bis. Ventana temporal alrededor del elemento seleccionado
     ============================================================ */
  var yearsInput = document.getElementById('g-years');
  var rangeInput = document.getElementById('g-range');
  var countOut = document.getElementById('g-count');
  var spanOut = document.getElementById('g-span');

  var S_MIN = 50, S_MAX = 100000, S_RATIO = S_MAX / S_MIN;

  function sliderToYears(v) {
    var y = S_MIN * Math.pow(S_RATIO, v / 100);
    if (y < 100) return Math.round(y / 5) * 5;
    if (y < 1000) return Math.round(y / 10) * 10;
    if (y < 10000) return Math.round(y / 100) * 100;
    return Math.round(y / 500) * 500;
  }
  function yearsToSlider(y) {
    var v = 100 * Math.log(Math.max(1, y) / S_MIN) / Math.log(S_RATIO);
    return Math.max(0, Math.min(100, Math.round(v)));
  }
  function fmtYear(y) {
    return y < 0 ? Math.abs(y) + ' a. C.' : (y === 0 ? '0' : y + ' d. C.');
  }

  function setYears(v, fromSlider) {
    var y = Math.round(v);
    if (!isFinite(y) || y < YEARS_MIN) y = YEARS_MIN;
    if (y > YEARS_MAX) y = YEARS_MAX;
    years = y;
    yearsInput.value = String(years);
    if (!fromSlider) rangeInput.value = String(yearsToSlider(years));
    refresh();
  }

  function syncWindowUI() {
    var vis = NODES.filter(visible).length;
    countOut.textContent = vis + ' de ' + NODES.length + ' nodos';
    if (selected && selected.y0 !== null) {
      var lo = Math.min(selected.y0, selected.y1) - years;
      var hi = Math.max(selected.y0, selected.y1) + years;
      spanOut.textContent = fmtYear(lo) + ' → ' + fmtYear(hi);
    } else {
      spanOut.textContent = 'sin fecha: todo el canon';
    }
  }

  rangeInput.addEventListener('input', function () {
    setYears(sliderToYears(parseInt(rangeInput.value, 10) || 0), true);
  });
  yearsInput.addEventListener('change', function () {
    setYears(parseInt(yearsInput.value, 10) || DEFAULT_YEARS, false);
  });
  yearsInput.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter') { ev.preventDefault(); yearsInput.blur(); }
  });

  yearsInput.value = String(years);
  rangeInput.value = String(yearsToSlider(years));

  /* ============================================================
     11. Barra superior
     ============================================================ */
  document.getElementById('g-chipbox').appendChild(buildGroupChips());

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
    save();
  });
  syncLabelBtn();

  document.getElementById('g-reset').addEventListener('click', function () {
    closePanel();
    Object.keys(activeGroups).forEach(function (g) { activeGroups[g] = true; });
    Object.keys(timeTypes).forEach(function (g) { timeTypes[g] = !!TIME_DEFAULT[g]; });
    timeUserSet = false;
    selected = byId[DEFAULT_ID] || NODES[0];
    labelMode = isSmall ? 'clave' : 'todas';
    syncLabelBtn();
    setYears(DEFAULT_YEARS, false);
    goal.r = R_HOME; flight = null; autoSpin = true;
    flyTo(selected);
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

  var hint = document.getElementById('g-hint');
  var hintGone = false;
  function hideHint() {
    if (hintGone || !hint) return;
    hintGone = true;
    hint.classList.add('is-gone');
    setTimeout(function () { if (hint.parentNode) hint.parentNode.removeChild(hint); }, 600);
  }
  setTimeout(hideHint, 9000);

  /* ============================================================
     12. Brújula de orientación
     ============================================================ */
  var cDot = document.getElementById('c-dot');
  var cRead = document.getElementById('c-read');

  function updateCompass() {
    if (!cDot) return;
    var sp = Math.sin(sph.phi);
    var x = 32 + 24 * sp * Math.sin(sph.theta);
    var y = 32 - 24 * Math.cos(sph.phi);
    var front = sp * Math.cos(sph.theta);
    cDot.setAttribute('cx', x.toFixed(1));
    cDot.setAttribute('cy', y.toFixed(1));
    cDot.setAttribute('r', front >= 0 ? '3.4' : '2.2');
    cDot.style.opacity = front >= 0 ? '1' : '.45';

    var lat = 90 - sph.phi * 180 / Math.PI;
    var lon = ((sph.theta * 180 / Math.PI) % 360 + 540) % 360 - 180;
    cRead.textContent = Math.abs(lat).toFixed(0) + '° ' + (lat >= 0 ? 'N' : 'S') + ' · ' +
      Math.abs(lon).toFixed(0) + '° ' + (lon >= 0 ? 'E' : 'O');
  }

  /* ============================================================
     13. Bucle
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
    new IntersectionObserver(function (entries) { running = entries[0].isIntersecting; },
      { threshold: 0.01 }).observe(mount);
  }

  /* estado inicial: siempre hay un elemento seleccionado (el último del usuario) */
  if (!saved.timeTypes) focusTimeTypes(selected);   // primera visita: su mismo tipo
  refresh();
  flyTo(selected);
  if (!isSmall) { panelOpen = true; renderPanel(selected); }

  function loop(now) {
    requestAnimationFrame(loop);
    if (!running) return;
    stepFlight(now);
    if (autoSpin && !dragging && !flight) goal.theta += 0.0005;
    if (selected && selected.glow.visible) {
      var pulse = 1 + Math.sin(now * 0.0035) * 0.12;
      selected.glow.scale.setScalar(selected.radius * 1.6 * 5.5 * pulse);
    }
    updateCamera();
    updateCompass();
    renderer.render(scene, camera);
    updateLabels(W, H);
  }
  requestAnimationFrame(loop);

  el.style.cursor = 'grab';
})();
