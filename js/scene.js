/* The living landscape behind the calculator: soft, rounded, lush.
   A giant "PromptPrint" wordmark sits between the sky and the hills, so the land grows over it.
   PP.scene.setLevel(0..1) shifts sky, smog, data-center load, steam, smoke, lake level and foliage. */
(function () {
  const S = PP.svgEl;
  const W = 1600, H = 900;
  const lerp = (a, b, t) => gsap.utils.interpolate(a, b, t);
  // [clean, polluted]
  const PAL = {
    sky0: ['#ffffff', '#f1e8d8'], sky1: ['#eef5f5', '#e6d4b4'], sky2: ['#dcebe6', '#d5b585'],
    far: ['#cfe0dc', '#d6c7a8'], far2: ['#b7d4c2', '#c7b68e'],
    mid0: ['#a7d38a', '#bfb172'], mid1: ['#6eaa62', '#9b8b54'],
    near0: ['#95c97b', '#b3a465'], near1: ['#5b9a54', '#8c7b47'],
    fore0: ['#7cb96a', '#a29158'], fore1: ['#3f7c45', '#6e5f39'],
    leaf0: ['#bfe39a', '#d1c184'], leaf1: ['#4f8f4b', '#8a7840'],
    sage0: ['#d5ecc0', '#ddd09a'], sage1: ['#7fae7a', '#9a8b58'],
    teal0: ['#bfe6d6', '#d2c89a'], teal1: ['#4c9c86', '#8b8050'],
    lav0: ['#ead7f2', '#d8c9a2'], lav1: ['#a77fc0', '#9a8a5c'],
    sun0: ['#ffe9a8', '#f4c78a'], sun1: ['#f7c04f', '#e0904a'],
    water0: ['#a6dcf4', '#b1b38f'], water1: ['#3b8fc9', '#77775a']
  };
  const GRADS = ['sky', 'mid', 'near', 'fore', 'leaf', 'sage', 'teal', 'lav', 'sun', 'water'];

  let root, st = { e: 0 }, els = {}, particles = [], back = [], loops = [], litCount = -1;

  function mount(container) {
    root = S('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid slice', class: 'scene' }, container);
    const defs = S('defs', {}, root);
    defs.innerHTML = `
      <linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky0"/><stop offset=".55" class="sky1"/><stop offset="1" class="sky2"/></linearGradient>
      <linearGradient id="g-mid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="mid0"/><stop offset="1" class="mid1"/></linearGradient>
      <linearGradient id="g-near" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="near0"/><stop offset=".7" class="near1"/></linearGradient>
      <linearGradient id="g-fore" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="fore0"/><stop offset=".6" class="fore1"/></linearGradient>
      <radialGradient id="g-leaf" cx=".35" cy=".3" r=".75"><stop offset="0" class="leaf0"/><stop offset="1" class="leaf1"/></radialGradient>
      <radialGradient id="g-sage" cx=".35" cy=".3" r=".75"><stop offset="0" class="sage0"/><stop offset="1" class="sage1"/></radialGradient>
      <radialGradient id="g-teal" cx=".35" cy=".3" r=".75"><stop offset="0" class="teal0"/><stop offset="1" class="teal1"/></radialGradient>
      <radialGradient id="g-lav" cx=".35" cy=".3" r=".75"><stop offset="0" class="lav0"/><stop offset="1" class="lav1"/></radialGradient>
      <radialGradient id="g-sun" cx=".4" cy=".35" r=".7"><stop offset="0" class="sun0"/><stop offset="1" class="sun1"/></radialGradient>
      <radialGradient id="g-sunglow"><stop offset="0" stop-color="#fff3c4" stop-opacity=".9"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>
      <linearGradient id="g-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="water0"/><stop offset="1" class="water1"/></linearGradient>
      <linearGradient id="g-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe4e3"/></linearGradient>
      <linearGradient id="g-tower" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d5d8d3"/><stop offset=".45" stop-color="#fbfbf8"/><stop offset="1" stop-color="#c3c7c1"/></linearGradient>
      <linearGradient id="g-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9a873" stop-opacity=".1"/><stop offset=".6" stop-color="#b8925a" stop-opacity=".45"/><stop offset="1" stop-color="#8f6c40" stop-opacity=".6"/></linearGradient>
      <filter id="f-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
      <filter id="f-shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#1d3a28" flood-opacity=".18"/></filter>
      <clipPath id="lakeClip"><path d="M240,690 C280,660 420,652 520,660 C610,666 660,684 646,708 C632,736 520,750 400,746 C296,742 220,722 240,690 Z"/></clipPath>
    `;

    S('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#g-sky)' }, root);

    // sun
    els.sun = S('g', { transform: 'translate(1180,170)' }, root);
    S('circle', { r: 160, fill: 'url(#g-sunglow)' }, els.sun);
    S('circle', { r: 56, fill: 'url(#g-sun)' }, els.sun);

    // clouds
    els.clouds = S('g', {}, root);
    [[220, 210, 1.15], [760, 120, .8], [1380, 280, 1], [1580, 140, .85]].forEach(([x, y, s], i) => {
      const g = S('g', { transform: `translate(${x},${y}) scale(${s})` }, els.clouds);
      const inner = S('g', { opacity: .95 }, g);
      [[-40, 0, 34], [0, -16, 42], [42, -2, 32], [76, 8, 22], [-74, 10, 22]].forEach(([cx, cy, r]) => S('circle', { cx, cy, r, fill: '#ffffff' }, inner));
      S('rect', { x: -96, y: 8, width: 194, height: 26, rx: 13, fill: '#ffffff' }, inner);
      if (!PP.reduce) gsap.to(inner, { x: -200 - i * 30, duration: 60 + i * 14, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });

    // birds
    els.birds = S('g', { fill: 'none', stroke: '#2b3b33', 'stroke-width': 2.2, 'stroke-linecap': 'round', opacity: .7 }, root);
    [[300, 170], [336, 150], [372, 182]].forEach(([x, y], i) => {
      const b = S('path', { d: `M${x - 9},${y} q4.5,-6 9,0 q4.5,-6 9,0` }, els.birds);
      if (!PP.reduce) gsap.to(b, { x: 900, y: -40 + i * 12, duration: 42 + i * 6, repeat: -1, ease: 'none', delay: i });
    });

    // far mountains
    els.far = S('path', { d: 'M0,520 C80,500 120,440 200,445 C280,450 300,400 380,404 C470,408 500,460 590,450 C680,440 720,390 820,392 C920,394 960,452 1060,446 C1160,440 1200,400 1300,404 C1400,408 1450,460 1600,450 L1600,900 L0,900 Z' }, root);
    els.far2 = S('path', { d: 'M0,560 C140,520 240,540 360,528 C500,514 580,540 700,526 C840,510 940,536 1080,522 C1220,508 1340,534 1460,520 L1600,520 L1600,900 L0,900 Z' }, root);

    // giant wordmark (land grows over it)
    els.word = S('text', { x: 40, y: 640, class: 'scene-word', 'font-family': '"Inter Tight", Inter, sans-serif', 'font-weight': 500, 'letter-spacing': '-0.055em', fill: '#0f1110', 'font-size': 300 }, root);
    els.word.textContent = 'PromptPrint';

    // power plant
    els.plant = S('g', { filter: 'url(#f-shadow)' }, root);
    const pl = els.plant;
    S('rect', { x: 1190, y: 476, width: 150, height: 90, rx: 10, fill: 'url(#g-wall)' }, pl);
    S('rect', { x: 1296, y: 334, width: 26, height: 150, rx: 6, fill: 'url(#g-tower)' }, pl);
    S('rect', { x: 1262, y: 370, width: 20, height: 114, rx: 5, fill: 'url(#g-tower)' }, pl);
    S('rect', { x: 1296, y: 350, width: 26, height: 10, fill: '#d0603a' }, pl);
    S('rect', { x: 1262, y: 384, width: 20, height: 8, fill: '#d0603a' }, pl);
    for (let i = 0; i < 4; i++) S('rect', { x: 1206 + i * 32, y: 504, width: 18, height: 12, rx: 3, fill: '#f6cf6a' }, pl);
    els.smoke = S('g', { filter: 'url(#f-soft)' }, root);
    puffs(els.smoke, [[1309, 330], [1272, 366]], '#a19a90', 7, 150, 3.6);

    // pylons + line
    els.lines = S('g', {}, root);
    pylon(els.lines, 1120, 552, 115);
    pylon(els.lines, 1040, 560, 104);
    const lineD = 'M1196,478 Q1158,476 1120,445 Q1080,470 1040,464 Q975,482 905,498 Q880,502 870,500';
    S('path', { d: lineD, fill: 'none', stroke: '#55625c', 'stroke-width': 1.4 }, els.lines);
    els.pulse = S('path', { d: lineD, fill: 'none', stroke: '#f0b93a', 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-dasharray': '3 44' }, els.lines);

    // mid hills
    els.mid = S('path', { d: 'M0,610 C180,566 300,578 420,594 C560,612 640,566 780,570 C920,574 1000,606 1140,592 C1280,578 1420,566 1600,590 L1600,900 L0,900 Z', fill: 'url(#g-mid)' }, root);

    // back fluffy trees on the mid hill
    els.treesBack = S('g', {}, root);
    [[1080, 596, 26, 'leaf'], [1150, 590, 20, 'sage'], [1440, 572, 30, 'teal'], [1500, 580, 22, 'leaf'], [1560, 574, 26, 'sage'], [470, 600, 24, 'teal'], [530, 594, 30, 'leaf'], [110, 604, 22, 'sage'], [60, 600, 28, 'leaf']].forEach(t => fluffy(els.treesBack, ...t));

    // data center
    els.dc = S('g', { filter: 'url(#f-shadow)' }, root);
    const dc = els.dc;
    S('rect', { x: 598, y: 526, width: 40, height: 64, rx: 8, fill: 'url(#g-wall)' }, dc);
    S('rect', { x: 620, y: 470, width: 264, height: 120, rx: 14, fill: 'url(#g-wall)' }, dc);
    S('rect', { x: 620, y: 470, width: 264, height: 14, rx: 7, fill: '#d6dcdb' }, dc);
    [642, 692, 742, 792, 842].forEach(x => {
      S('rect', { x, y: 452, width: 34, height: 20, rx: 6, fill: '#e8ecea' }, dc);
      const fan = S('g', {}, dc);
      S('circle', { cx: x + 17, cy: 462, r: 6, fill: '#c7cfcd' }, fan);
      S('path', { d: `M${x + 17},456 L${x + 17},468 M${x + 11},462 L${x + 23},462`, stroke: '#8f9b98', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, fan);
      if (!PP.reduce) gsap.to(fan, { rotation: 360, svgOrigin: `${x + 17} 462`, duration: 1.2, repeat: -1, ease: 'none' });
    });
    els.windows = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 10; c++) {
      els.windows.push(S('rect', { x: 638 + c * 24, y: 496 + r * 24, width: 16, height: 10, rx: 3, fill: '#3a4a52' }, dc));
    }
    S('rect', { x: 726, y: 562, width: 52, height: 28, rx: 6, fill: '#cfd6d4' }, dc);
    els.beacon = S('circle', { cx: 872, cy: 446, r: 4.5, fill: '#e4573a' }, dc);
    S('line', { x1: 872, x2: 872, y1: 450, y2: 470, stroke: '#9aa3a1', 'stroke-width': 2 }, dc);
    if (!PP.reduce) gsap.to(els.beacon, { opacity: .2, duration: .8, repeat: -1, yoyo: true });

    // cooling towers + steam
    els.towers = S('g', { filter: 'url(#f-shadow)' }, root);
    tower(els.towers, 932, 596, 128, 78);
    tower(els.towers, 1010, 600, 108, 64);
    els.steam = S('g', { filter: 'url(#f-soft)' }, root);
    puffs(els.steam, [[932, 470], [1010, 494]], '#ffffff', 9, 180, 4.4);

    // near ground + lake
    els.near = S('path', { d: 'M0,660 C120,628 220,640 300,668 C420,708 620,708 760,680 C900,652 1040,660 1200,680 C1360,700 1480,668 1600,660 L1600,900 L0,900 Z', fill: 'url(#g-near)' }, root);
    const lake = S('g', {}, root);
    S('path', { d: 'M240,690 C280,660 420,652 520,660 C610,666 660,684 646,708 C632,736 520,750 400,746 C296,742 220,722 240,690 Z', fill: '#c8b48c' }, lake);
    const lakeIn = S('g', { 'clip-path': 'url(#lakeClip)' }, lake);
    els.water = S('rect', { x: 200, y: 656, width: 480, height: 120, fill: 'url(#g-water)' }, lakeIn);
    els.shine = S('g', { 'clip-path': 'url(#lakeClip)' }, lake);
    for (let i = 0; i < 4; i++) {
      const l = S('rect', { x: 360 + i * 46, y: 680 + i * 12, width: 34 - i * 4, height: 4, rx: 2, fill: '#ffffff', opacity: .75 }, els.shine);
      if (!PP.reduce) gsap.to(l, { x: '+=14', opacity: .3, duration: 1.8 + i * .3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    // front bushes & flowers
    els.treesFront = S('g', {}, root);
    [[700, 700, 26, 'lav'], [740, 708, 20, 'leaf'], [1180, 700, 30, 'sage'], [1236, 708, 22, 'lav'], [1300, 702, 26, 'teal'], [1500, 700, 34, 'leaf'], [1560, 712, 24, 'lav']].forEach(t => fluffy(els.treesFront, ...t, true));
    els.flowers = S('g', {}, root);
    [[820, 720], [860, 732], [960, 700], [1000, 714], [1120, 724], [1380, 726], [1420, 716], [660, 730]].forEach(([x, y], i) => {
      const f = S('g', { transform: `translate(${x},${y})` }, els.flowers);
      S('line', { x1: 0, y1: 0, x2: 0, y2: 14, stroke: '#4c8a4a', 'stroke-width': 2 }, f);
      const col = ['#ffd45e', '#ffffff', '#f2a2c0', '#c9a6e6'][i % 4];
      for (let k = 0; k < 5; k++) S('circle', { cx: Math.cos(k * 1.256) * 4.5, cy: Math.sin(k * 1.256) * 4.5, r: 3.4, fill: col }, f);
      S('circle', { r: 2.4, fill: '#f0a63a' }, f);
    });

    // foreground hill + oak + student
    els.fore = S('path', { d: 'M0,720 C80,660 220,628 330,680 C380,704 360,780 300,900 L0,900 Z', fill: 'url(#g-fore)' }, root);
    const kid = S('g', {}, root);
    S('path', { d: 'M92,654 C94,624 94,600 96,578 L104,578 C106,600 106,624 108,654 Z', fill: '#8b6a4b' }, kid);
    els.oak = S('g', {}, kid);
    [[98, 548, 46], [62, 570, 32], [134, 568, 34], [98, 516, 32], [70, 536, 28], [128, 534, 28]].forEach(([cx, cy, r]) => S('circle', { cx, cy, r, fill: 'url(#g-leaf)' }, els.oak));
    S('ellipse', { cx: 190, cy: 668, rx: 48, ry: 7, fill: '#1d3a28', opacity: .18 }, kid);
    S('path', { d: 'M168,668 C166,644 170,624 186,620 C200,618 207,632 207,650 L209,668 Z', fill: '#f2b84b' }, kid);
    S('circle', { cx: 188, cy: 606, r: 13, fill: '#f0c39b' }, kid);
    S('path', { d: 'M175,604 C174,588 201,586 202,604 C197,597 184,597 175,604 Z', fill: '#3a2a1f' }, kid);
    S('path', { d: 'M200,667 L242,667', stroke: '#39507a', 'stroke-width': 11, 'stroke-linecap': 'round' }, kid);
    S('path', { d: 'M206,662 L246,662 L252,667 L202,667 Z', fill: '#c4c9c7' }, kid);
    S('path', { d: 'M213,662 L219,634 L251,634 L245,662 Z', fill: '#e6eae8' }, kid);
    els.screen = S('path', { d: 'M217,659 L222,637 L247,637 L242,659 Z', fill: '#8fd6a8' }, kid);
    if (!PP.reduce) gsap.to(els.screen, { fill: '#c8f0d6', duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    // smog (over the whole landscape but under the foreground)
    els.haze = S('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#g-haze)', opacity: 0, 'pointer-events': 'none' }, root);
    root.insertBefore(els.haze, els.near);

    // prompt path + particles
    els.path = S('path', { d: 'M234,628 C300,430 520,370 700,476', fill: 'none', stroke: '#1f3d2c', 'stroke-opacity': .3, 'stroke-width': 2, 'stroke-dasharray': '0.5 10', 'stroke-linecap': 'round' }, root);
    for (let i = 0; i < 16; i++) particles.push(S('circle', { r: 5.5, fill: '#2f7a3e', stroke: '#ffffff', 'stroke-width': 2.2, opacity: 0 }, root));
    for (let i = 0; i < 6; i++) back.push(S('circle', { r: 4, fill: '#3b8fc9', stroke: '#ffffff', 'stroke-width': 1.8, opacity: 0 }, root));

    startLoops();
    apply(0);
    fitWord();
    if ('ResizeObserver' in window) new ResizeObserver(fitWord).observe(root);
    else window.addEventListener('resize', fitWord);
    if (document.fonts) document.fonts.ready.then(fitWord);
    return root;
  }

  // keep the wordmark inside the visible (cropped) part of the viewBox
  function fitWord() {
    if (!root || !root.clientWidth) return;
    const w = root.clientWidth, h = root.clientHeight;
    const scale = Math.max(w / W, h / H), visW = w / scale, x0 = (W - visW) / 2;
    const target = visW * 0.94;
    els.word.setAttribute('font-size', 100);
    const L = els.word.getComputedTextLength() || 520;
    const fs = Math.min(330, 100 * target / L);
    els.word.setAttribute('font-size', fs.toFixed(1));
    els.word.setAttribute('x', (x0 + visW * 0.03).toFixed(1));
    els.word.setAttribute('y', (470 + fs * 0.3).toFixed(1));
  }

  function fluffy(g, x, y, r, kind, low) {
    const t = S('g', { transform: `translate(${x},${y})` }, g);
    if (!low) S('rect', { x: -3, y: -r * .6, width: 6, height: r * .6 + 4, rx: 3, fill: '#8b6a4b' }, t);
    const cy = low ? -r * .6 : -r * 1.3;
    S('ellipse', { cx: 0, cy: low ? 2 : 4, rx: r * 1.05, ry: r * .22, fill: '#1d3a28', opacity: .14 }, t);
    [[0, cy, r], [-r * .55, cy + r * .3, r * .7], [r * .55, cy + r * .3, r * .72], [0, cy - r * .45, r * .66]].forEach(([cx, cyy, rr]) => S('circle', { cx, cy: cyy, r: rr, fill: `url(#g-${kind})` }, t));
    if (!PP.reduce) gsap.to(t, { rotation: low ? 1 : 2, svgOrigin: `${x} ${y}`, duration: 2.6 + Math.random() * 2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  function puffs(g, origins, color, n, rise, dur) {
    origins.forEach(([x, y]) => {
      for (let i = 0; i < n; i++) {
        const c = S('circle', { cx: x, cy: y, r: 9, fill: color, opacity: 0 }, g);
        if (PP.reduce) { c.setAttribute('opacity', .5); continue; }
        gsap.timeline({ repeat: -1, delay: (i / n) * dur })
          .fromTo(c, { attr: { cy: y, cx: x, r: 9 }, opacity: .95 }, { attr: { cy: y - rise, cx: x + 40 + Math.random() * 50, r: 30 + Math.random() * 12 }, opacity: 0, duration: dur, ease: 'sine.out' });
      }
    });
  }

  function tower(g, cx, base, h, w) {
    const d = `M${cx - w / 2},${base} Q${cx - w * .2},${base - h * .55} ${cx - w * .3},${base - h} L${cx + w * .3},${base - h} Q${cx + w * .2},${base - h * .55} ${cx + w / 2},${base} Z`;
    S('path', { d, fill: 'url(#g-tower)' }, g);
    S('ellipse', { cx, cy: base - h, rx: w * .3, ry: 4, fill: '#aeb3ad' }, g);
    S('path', { d: `M${cx - w * .27},${base - h * .32} Q${cx},${base - h * .35} ${cx + w * .27},${base - h * .32}`, fill: 'none', stroke: '#d0603a', 'stroke-width': 6, opacity: .85 }, g);
  }

  function pylon(g, x, base, h) {
    const o = { stroke: '#6c7873', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' };
    S('path', Object.assign({ d: `M${x - 13},${base} L${x - 3},${base - h} L${x + 3},${base - h} L${x + 13},${base}` }, o), g);
    S('path', Object.assign({ d: `M${x - 22},${base - h + 14} L${x + 22},${base - h + 14} M${x - 16},${base - h + 32} L${x + 16},${base - h + 32} M${x - 9},${base - 30} L${x + 9},${base - 62} M${x + 9},${base - 30} L${x - 9},${base - 62}` }, o), g);
  }

  function startLoops() {
    if (PP.reduce) {
      const L = els.path.getTotalLength();
      particles.slice(0, 5).forEach((p, i) => { const pt = els.path.getPointAtLength(L * (i + 1) / 6); p.setAttribute('cx', pt.x); p.setAttribute('cy', pt.y); p.setAttribute('opacity', 1); });
      return;
    }
    particles.forEach((p, i) => {
      const tl = gsap.timeline({ repeat: -1, delay: i * 0.32 });
      tl.to(p, { motionPath: { path: els.path, align: els.path, alignOrigin: [.5, .5] }, duration: 2.6, ease: 'power1.inOut' }, 0)
        .fromTo(p, { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .3 }, 0)
        .to(p, { opacity: 0, scale: .4, duration: .3 }, 2.3);
      loops.push(tl);
    });
    back.forEach((p, i) => {
      gsap.timeline({ repeat: -1, delay: 1.3 + i * .9 })
        .to(p, { motionPath: { path: els.path, align: els.path, alignOrigin: [.5, .5], start: 1, end: 0 }, duration: 2.2, ease: 'power1.inOut' }, 0)
        .fromTo(p, { opacity: 0 }, { opacity: 1, duration: .3 }, 0)
        .to(p, { opacity: 0, duration: .3 }, 1.9);
    });
    els.pulseTween = gsap.to(els.pulse, { attr: { 'stroke-dashoffset': -470 }, duration: 6, repeat: -1, ease: 'none' });
  }

  function apply(e) {
    const t = Math.min(1, Math.pow(e, 1.5) * 1.2);
    const c = k => lerp(PAL[k][0], PAL[k][1], t);
    Object.keys(PAL).forEach(k => root.querySelectorAll('stop.' + k).forEach(s => s.setAttribute('stop-color', c(k))));
    els.far.setAttribute('fill', c('far'));
    els.far2.setAttribute('fill', c('far2'));
    els.sun.setAttribute('opacity', (1 - e * .4).toFixed(3));
    els.flowers.setAttribute('opacity', (1 - e * .9).toFixed(3));
    els.birds.setAttribute('opacity', (.7 - e * .7).toFixed(3));
    els.haze.setAttribute('opacity', (t * .9).toFixed(3));
    els.steam.setAttribute('opacity', (.45 + e * .55).toFixed(3));
    els.smoke.setAttribute('opacity', (.15 + e * .85).toFixed(3));
    els.water.setAttribute('y', (656 + e * 56).toFixed(1));
    els.shine.setAttribute('transform', `translate(0, ${(e * 40).toFixed(1)})`);
    els.shine.setAttribute('opacity', (1 - e * .8).toFixed(3));
    const lit = Math.round(3 + e * 27);
    if (lit !== litCount) {
      litCount = lit;
      const order = [...els.windows.keys()].sort((a, b) => ((a * 7919) % 31) - ((b * 7919) % 31));
      els.windows.forEach(w => w.setAttribute('fill', '#3a4a52'));
      order.slice(0, lit).forEach(i => els.windows[i].setAttribute('fill', '#6cc6ff'));
    }
    const visible = Math.round(3 + e * 13);
    particles.forEach((p, i) => { p.style.visibility = i < visible ? 'visible' : 'hidden'; });
    if (els.pulseTween) els.pulseTween.timeScale(.6 + e * 3);
    loops.forEach(l => l.timeScale(.8 + e * 1.2));
  }

  PP.scene = {
    mount,
    level: 0,
    setLevel(e, dur) {
      e = Math.max(0, Math.min(1, e));
      this.level = e;
      if (!root) return;
      gsap.to(st, { e, duration: dur == null ? 1.4 : dur, ease: 'power2.out', onUpdate: () => apply(st.e), overwrite: true });
    },
    showWord(on) {
      if (!els.word) return;
      gsap.to(els.word, { opacity: on ? 1 : 0, y: on ? 0 : -30, duration: .8, ease: 'power3.inOut' });
    },
    levelFor(yearWh) {
      return Math.max(0, Math.min(1, Math.log10(Math.max(yearWh, 200) / 200) / Math.log10(300000 / 200)));
    },
    fit: fitWord
  };
})();
