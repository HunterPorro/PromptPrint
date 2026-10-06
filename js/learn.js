/* Learn tab: hero field, prompt journey, charts, water lab, myths */
(function () {
  const S = PP.svgEl;
  const $ = (s, r) => (r || document).querySelector(s);
  let inited = false;

  /* ---------- hero: flowing data field on canvas ---------- */
  function heroField() {
    const c = $('#learnCanvas'); if (!c) return;
    const ctx = c.getContext('2d');
    let w, h, dpr, pts = [];
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(w * h / 9000);
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, s: .3 + Math.random() * 1.2, r: Math.random() * 1.6 + .4, hue: Math.random() }));
    };
    resize();
    window.addEventListener('resize', resize);
    let t = 0, running = true;
    const io = new IntersectionObserver(e => { running = e[0].isIntersecting; if (running) loop(); });
    io.observe(c);
    function loop() {
      if (!running || PP.route !== 'learn') return;
      t += .004;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        const ang = Math.sin(p.y * .004 + t * 2) * .6 + Math.cos(p.x * .003 - t) * .4;
        p.x += Math.cos(ang) * p.s + .6 * p.s; p.y += Math.sin(ang) * p.s * .6;
        if (p.x > w + 10) { p.x = -10; p.y = Math.random() * h; }
        if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
        const col = p.hue < .6 ? '47,122,62' : p.hue < .85 ? '47,109,179' : '201,138,18';
        const fade = Math.min(1, p.x / (w * .5)) * .9;
        ctx.beginPath(); ctx.fillStyle = `rgba(${col},${(.15 + p.r * .25) * fade})`;
        ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    PP.learnLoop = loop;
    loop();
  }

  /* ---------- hero art: the cloud, opened up ---------- */
  function heroArt() {
    const el = $('#lhArt'); if (!el) return;
    const rack = (x) => `<g transform="translate(${x},0)"><rect x="0" y="0" width="54" height="128" rx="6" fill="#eef1ef"/>${[0, 1, 2, 3, 4, 5, 6].map(k => `<rect x="8" y="${10 + k * 16}" width="38" height="9" rx="2.5" fill="#dfe5e1"/><circle class="lh-led" cx="40" cy="${14.5 + k * 16}" r="2.2" fill="${k % 3 ? '#4f9a55' : '#2f6db3'}"/>`).join('')}</g>`;
    el.innerHTML = `<svg viewBox="0 0 560 600">
      <defs>
        <radialGradient id="lhCloud" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9eeec"/></radialGradient>
        <linearGradient id="lhRoom" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a3a36"/><stop offset="1" stop-color="#18221f"/></linearGradient>
        <linearGradient id="lhPipe" x1="0" x2="1"><stop offset="0" stop-color="#c9d1cd"/><stop offset=".5" stop-color="#f4f6f5"/><stop offset="1" stop-color="#b9c2bd"/></linearGradient>
        <filter id="lhShadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#1d3a28" flood-opacity=".18"/></filter>
        <clipPath id="lhClip"><path d="M120,250 h320 v130 a24,24 0 0 1 -24,24 h-272 a24,24 0 0 1 -24,-24 z"/></clipPath>
      </defs>
      <g id="lhFloat">
        <g filter="url(#lhShadow)">
          <path d="M92,262 C60,262 40,236 46,206 C52,176 82,160 110,166 C114,118 160,88 206,98 C226,58 284,44 326,70 C356,46 410,52 432,92 C478,90 516,124 510,168 C536,184 540,230 512,252 C500,262 486,264 470,262 Z" fill="url(#lhCloud)"/>
          <path d="M120,250 h320 v130 a24,24 0 0 1 -24,24 h-272 a24,24 0 0 1 -24,-24 z" fill="url(#lhRoom)"/>
        </g>
        <g clip-path="url(#lhClip)">
          <g transform="translate(142,266)">${rack(0)}${rack(68)}${rack(136)}${rack(204)}</g>
          <rect x="120" y="250" width="320" height="10" fill="#0f1714" opacity=".5"/>
          <path class="lh-heat" d="M170,262 q8,-10 0,-20 M262,262 q8,-10 0,-20 M354,262 q8,-10 0,-20" stroke="#ff9a70" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/>
        </g>
        <text x="280" y="236" text-anchor="middle" font-family="Inter Tight, Inter, sans-serif" font-size="13" font-weight="600" fill="#4b514d" letter-spacing=".14em">THE CLOUD</text>
        <rect x="186" y="404" width="16" height="96" fill="url(#lhPipe)"/>
        <rect x="358" y="404" width="16" height="70" fill="url(#lhPipe)"/>
        <path d="M374,466 h60 a10,10 0 0 1 10,10 v24" stroke="url(#lhPipe)" stroke-width="16" fill="none"/>
        <path d="M152,404 C150,450 120,470 90,520" stroke="#2b3a33" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M410,404 C420,440 470,450 500,500" stroke="#2b3a33" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path class="lh-volt" d="M152,404 C150,450 120,470 90,520" stroke="#f0b93a" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="4 26"/>
        <path class="lh-volt" d="M410,404 C420,440 470,450 500,500" stroke="#f0b93a" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="4 26"/>
        <g class="lh-drops">${[0, 1, 2].map(i => `<path d="M194,${506 + i * 0} q4,7 0,11 q-4,-4 0,-11z" fill="#2f6db3"/>`).join('')}${[0, 1].map(() => `<path d="M444,506 q4,7 0,11 q-4,-4 0,-11z" fill="#2f6db3"/>`).join('')}</g>
      </g>
      <ellipse cx="290" cy="572" rx="200" ry="10" fill="#1d3a28" opacity=".08"/>
      <g font-family="Inter Tight, Inter, sans-serif" font-size="12.5" font-weight="500" fill="#4b514d">
        <g class="lh-tag" transform="translate(22,540)"><rect x="0" y="-16" width="118" height="26" rx="13" fill="#fff" stroke="rgba(15,17,16,.1)"/><circle cx="14" cy="-3" r="4" fill="#c98a12"/><text x="24" y="1">Electricity in</text></g>
        <g class="lh-tag" transform="translate(206,548)"><rect x="0" y="-16" width="104" height="26" rx="13" fill="#fff" stroke="rgba(15,17,16,.1)"/><circle cx="14" cy="-3" r="4" fill="#2f6db3"/><text x="24" y="1">Water out</text></g>
        <g class="lh-tag" transform="translate(416,540)"><rect x="0" y="-16" width="96" height="26" rx="13" fill="#fff" stroke="rgba(15,17,16,.1)"/><circle cx="14" cy="-3" r="4" fill="#c4532f"/><text x="24" y="1">Heat out</text></g>
      </g>
    </svg>`;
    if (PP.reduce) return;
    gsap.to('#lhFloat', { y: -12, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to(el.querySelectorAll('.lh-led'), { opacity: .25, duration: .4, stagger: { each: .04, repeat: -1, yoyo: true, from: 'random' } });
    gsap.to(el.querySelectorAll('.lh-volt'), { attr: { 'stroke-dashoffset': -120 }, duration: 2.4, repeat: -1, ease: 'none' });
    gsap.fromTo(el.querySelectorAll('.lh-drops path'), { y: 0, opacity: 1 }, { y: 50, opacity: 0, duration: 1.4, stagger: { each: .35, repeat: -1 }, ease: 'power1.in' });
    gsap.to(el.querySelector('.lh-heat'), { y: -8, opacity: .2, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.from(el.querySelectorAll('.lh-tag'), { y: 16, opacity: 0, stagger: .15, duration: .8, delay: .6, ease: 'back.out(2)' });
    el.closest('.learn-hero').addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { rotationY: (e.clientX - r.left - r.width / 2) / 60, rotationX: -(e.clientY - r.top - r.height / 2) / 80, duration: .8, ease: 'power2.out' });
    });
  }

  /* ---------- journey diagram ---------- */
  let jStep = -1, J = {};
  function journey() {
    const host = $('#journeySvg');
    const svg = S('svg', { viewBox: '0 0 600 540', role: 'img', 'aria-label': 'Diagram of a prompt traveling from a laptop to a data center, which is cooled with water and powered by the grid' }, host);
    svg.innerHTML = `
      <defs>
        <radialGradient id="jGlow"><stop offset="0" stop-color="#7cc58a" stop-opacity=".45"/><stop offset="1" stop-color="#7cc58a" stop-opacity="0"/></radialGradient>
        <radialGradient id="jHeat"><stop offset="0" stop-color="#ff9a70" stop-opacity=".6"/><stop offset="1" stop-color="#ff9a70" stop-opacity="0"/></radialGradient>
        <filter id="jBlur"><feGaussianBlur stdDeviation="3"/></filter>
        <pattern id="jDots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#0f1110" opacity=".07"/></pattern>
      </defs>
      <rect width="600" height="540" fill="url(#jDots)"/>
      <path id="jFiber" d="M118,392 C170,330 210,300 262,282" fill="none" stroke="#dfe5e1" stroke-width="3" stroke-linecap="round"/>
      <path id="jReturn" d="M262,300 C215,320 175,345 126,404" fill="none" stroke="none"/>
      <path id="jCool" d="M352,230 C390,200 420,180 452,168" fill="none" stroke="#dfe5e1" stroke-width="3" stroke-linecap="round"/>
      <path id="jPower" d="M452,410 C410,380 380,340 350,300" fill="none" stroke="#dfe5e1" stroke-width="3" stroke-linecap="round"/>

      <g id="jLaptop" class="jn" transform="translate(90,410)">
        <circle r="62" fill="url(#jGlow)" class="jn-glow" opacity="0"/>
        <circle r="44" fill="#ffffff" stroke="#d5dcd6" stroke-width="2" class="jn-ring"/>
        <rect x="-22" y="-16" width="44" height="28" rx="3" fill="#cfd8dc"/><rect x="-18" y="-12" width="36" height="20" rx="2" fill="#8ef0b4" class="jl-screen"/>
        <path d="M-28,14 L28,14 L24,19 L-24,19 Z" fill="#9aa6ad"/>
        <text y="70" text-anchor="middle" class="jn-label">Your laptop</text>
      </g>

      <g id="jDC" class="jn" transform="translate(300,270)">
        <circle r="90" fill="url(#jHeat)" class="jn-heat" opacity="0"/>
        <circle r="70" fill="url(#jGlow)" class="jn-glow" opacity="0"/>
        <circle r="56" fill="#ffffff" stroke="#d5dcd6" stroke-width="2" class="jn-ring"/>
        <g class="jd-racks">
          ${[-24, -8, 8].map(x => `<rect x="${x}" y="-26" width="14" height="50" rx="2" fill="#eef1ef" stroke="#c9d1cd"/>` + [0, 1, 2, 3, 4].map(k => `<rect x="${x + 3}" y="${-21 + k * 9}" width="8" height="3" rx="1" fill="#2f6db3" class="jd-led" opacity=".35"/>`).join('')).join('')}
        </g>
        <text y="84" text-anchor="middle" class="jn-label">Data center · GPUs</text>
      </g>

      <g id="jTower" class="jn" transform="translate(480,150)">
        <circle r="62" fill="url(#jGlow)" class="jn-glow" opacity="0"/>
        <circle r="44" fill="#ffffff" stroke="#d5dcd6" stroke-width="2" class="jn-ring"/>
        <path d="M-16,22 Q-8,0 -11,-18 L11,-18 Q8,0 16,22 Z" fill="#d3d8d4"/>
        <g class="jt-steam" opacity=".3">${[0, 1, 2].map(i => `<circle cx="${-4 + i * 4}" cy="-24" r="6" fill="#dfe9ee" opacity=".7"/>`).join('')}</g>
        <g class="jt-drops">${[0, 1, 2].map(i => `<path d="M${-10 + i * 10},34 q3,5 0,8 q-3,-3 0,-8z" fill="#6fc8ff" opacity="0"/>`).join('')}</g>
        <text y="-56" text-anchor="middle" class="jn-label">Cooling · water</text>
      </g>

      <g id="jPlant" class="jn" transform="translate(480,420)">
        <circle r="62" fill="url(#jGlow)" class="jn-glow" opacity="0"/>
        <circle r="44" fill="#ffffff" stroke="#d5dcd6" stroke-width="2" class="jn-ring"/>
        <rect x="-20" y="-2" width="40" height="22" fill="#d3d8d4"/><rect x="4" y="-26" width="9" height="26" fill="#bfc6c1"/><rect x="-12" y="-16" width="8" height="16" fill="#bfc6c1"/>
        <g class="jp-smoke" opacity=".25">${[0, 1, 2].map(i => `<circle cx="${8 + i * 5}" cy="${-32 - i * 7}" r="${5 + i * 2}" fill="#8b8278"/>`).join('')}</g>
        <text y="70" text-anchor="middle" class="jn-label">Power grid</text>
      </g>

      <g id="jTags" font-family="Inter Tight, sans-serif">
        <g class="jtag" data-s="2" transform="translate(372,94)" opacity="0"><rect x="-6" y="-16" width="132" height="24" rx="12" fill="#e6eef8"/><text x="60" y="1" text-anchor="middle" fill="#2f6db3" font-size="12" font-weight="600">0.55 L / kWh on site</text></g>
        <g class="jtag" data-s="3" transform="translate(370,490)" opacity="0"><rect x="-6" y="-16" width="150" height="24" rx="12" fill="#f8e7df"/><text x="69" y="1" text-anchor="middle" fill="#c4532f" font-size="12" font-weight="600">348 g CO₂ + 3.1 L / kWh</text></g>
        <g class="jtag" data-s="4" transform="translate(140,250)" opacity="0"><rect x="-70" y="-16" width="140" height="24" rx="12" fill="#e9f3e7"/><text x="0" y="1" text-anchor="middle" fill="#2f7a3e" font-size="12" font-weight="600">≈ 0.3 Wh per answer</text></g>
        <g class="jtag" data-s="1" transform="translate(300,160)" opacity="0"><rect x="-74" y="-16" width="148" height="24" rx="12" fill="#f8e7df"/><text x="0" y="1" text-anchor="middle" fill="#c4532f" font-size="12" font-weight="600">~all power → heat</text></g>
      </g>
      <g id="jPulses"></g>`;
    J.svg = svg;
    J.pulses = svg.querySelector('#jPulses');
    J.tl = [];
    // pulses per path
    const mk = (pathId, color, n, dur, reverse) => {
      const arr = [];
      for (let i = 0; i < n; i++) {
        const c = S('circle', { r: 4, fill: color, opacity: 0 }, J.pulses);
        if (PP.reduce) continue;
        const tl = gsap.timeline({ repeat: -1, delay: i * dur / n, paused: true });
        tl.to(c, { motionPath: { path: '#' + pathId, align: '#' + pathId, alignOrigin: [.5, .5], start: reverse ? 1 : 0, end: reverse ? 0 : 1 }, duration: dur, ease: 'none' }, 0)
          .fromTo(c, { opacity: 0 }, { opacity: 1, duration: .2 }, 0).to(c, { opacity: 0, duration: .2 }, dur - .2);
        arr.push(tl);
      }
      return arr;
    };
    J.flows = {
      fiber: mk('jFiber', '#2f7a3e', 4, 1.6),
      cool: mk('jCool', '#2f6db3', 4, 1.6),
      power: mk('jPower', '#c98a12', 4, 1.4),
      back: mk('jReturn', '#2f6db3', 3, 1.4)
    };
    if (!PP.reduce) {
      J.ledTl = gsap.to(svg.querySelectorAll('.jd-led'), { opacity: 1, duration: .3, stagger: { each: .05, repeat: -1, yoyo: true }, paused: true });
      J.steamTl = gsap.to(svg.querySelectorAll('.jt-steam circle'), { attr: { cy: -60, r: 14 }, opacity: 0, duration: 2, stagger: { each: .5, repeat: -1 }, paused: true });
      J.dropTl = gsap.fromTo(svg.querySelectorAll('.jt-drops path'), { y: 0, opacity: 0 }, { y: 14, opacity: 1, duration: .9, stagger: { each: .3, repeat: -1 }, paused: true });
      J.smokeTl = gsap.to(svg.querySelectorAll('.jp-smoke circle'), { attr: { cy: '-=26' }, opacity: 0, duration: 2.2, stagger: { each: .6, repeat: -1 }, paused: true });
    }

    const steps = document.querySelectorAll('#journeySteps li');
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) setStep(+en.target.dataset.step); });
    }, { rootMargin: '-38% 0px -38% 0px' });
    steps.forEach(s => io.observe(s));
    steps.forEach(s => s.addEventListener('click', () => setStep(+s.dataset.step)));
    setStep(0);
  }

  function setStep(n) {
    if (n === jStep) return;
    jStep = n;
    document.querySelectorAll('#journeySteps li').forEach(li => li.classList.toggle('is-active', +li.dataset.step === n));
    const on = { jLaptop: n === 0 || n === 4, jDC: n >= 1, jTower: n === 2 || n === 4, jPlant: n === 3 || n === 4 };
    Object.keys(on).forEach(id => {
      const g = J.svg.querySelector('#' + id);
      gsap.to(g.querySelector('.jn-glow'), { opacity: on[id] ? 1 : 0, duration: .5 });
      g.querySelector('.jn-ring').setAttribute('stroke', on[id] ? '#2f7a3e' : '#d5dcd6');
    });
    gsap.to(J.svg.querySelector('.jn-heat'), { opacity: n === 1 ? 1 : n > 1 ? .4 : 0, duration: .6 });
    J.svg.querySelectorAll('.jtag').forEach(t => gsap.to(t, { opacity: +t.dataset.s === n || (n === 4 && +t.dataset.s !== 1) ? 1 : 0, y: +t.dataset.s === n ? 0 : 6, duration: .5 }));
    const play = (arr, yes) => arr.forEach(t => yes ? t.play() : t.pause());
    play(J.flows.fiber, n === 0 || n === 4);
    play(J.flows.cool, n === 2 || n === 4);
    play(J.flows.power, n === 3 || n === 4);
    play(J.flows.back, n === 4);
    ['jFiber', 'jCool', 'jPower'].forEach((id, i) => J.svg.querySelector('#' + id).setAttribute('stroke', [n === 0 || n === 4, n === 2 || n === 4, n === 3 || n === 4][i] ? '#2f7a3e' : '#dfe5e1'));
    if (J.ledTl) { n >= 1 ? J.ledTl.play() : J.ledTl.pause(); n >= 2 || n === 2 ? J.steamTl.play() : J.steamTl.pause(); n === 2 || n === 4 ? J.dropTl.play() : J.dropTl.pause(); n >= 3 ? J.smokeTl.play() : J.smokeTl.pause(); }
  }

  /* ---------- energy-per-task chart ---------- */
  function tasks() {
    const data = [
      { label: 'Google’s median Gemini prompt', value: 0.24, src: 'google', note: 'First-party measurement, May 2025' },
      { label: 'Typical chatbot prompt', value: 0.3, src: 'epoch', note: 'GPT-4o-class estimate', highlight: true, color: 'var(--accent)' },
      { label: 'Google search (2009)', value: 0.3, src: 'search09', note: 'Google’s 2009 figure, for comparison' },
      { label: 'AI image (median model)', value: 1.35, src: 'luccioni', note: '1.35 kWh per 1,000 images' },
      { label: 'Prompt with a long pasted document', value: 2.5, src: 'epoch', note: '~10k tokens of input' },
      { label: 'Reasoning prompt (o3, medium)', value: 5.15, src: 'jegham', note: 'Benchmarked with full overhead' },
      { label: 'DeepSeek-R1 reasoning prompt', value: 24.6, src: 'jegham', note: 'Medium prompt' },
      { label: 'One 5-second AI video', value: 944, src: 'mittr', note: '3.4 million joules', color: 'var(--s2)' }
    ];
    const chart = PP.hbar($('#chartTasks'), data, {
      log: true, min: 0.1, max: 2000, fmt: v => PP.fmt.num(v) + ' Wh',
      tickFmt: v => (v < 1 ? v : PP.fmt.num(v)) + ' Wh',
      refs: [{ value: 19, label: 'Phone charge 19 Wh' }, { value: 77, label: '1 hr streaming 77 Wh' }]
    });
    const btn = document.querySelector('[data-refs]');
    btn.onclick = () => { const on = !btn.classList.contains('is-on'); btn.classList.toggle('is-on', on); chart.toggleRefs(on); };
    PP.table($('#tableTasks'), ['Task', 'Wh per request', 'Source'], data.map(d => [d.label, PP.fmt.num(d.value), PP.SOURCES[d.src].cite]));
    PP.learnCharts.push(chart);
  }

  function growth() {
    PP.learnCharts.push(PP.cols($('#chartGlobal'), [
      { label: '2024', value: 415, note: '~1.5% of world electricity' },
      { label: '2030', value: 945, projected: true, approx: true, note: 'IEA Base Case' },
      { label: '2035', value: 1200, projected: true, approx: true, note: 'IEA Base Case' }
    ], { max: 1400, ticks: [0, 500, 1000], unit: 'TWh' }));
    PP.learnCharts.push(PP.cols($('#chartUS'), [
      { label: '2014', value: 58 },
      { label: '2023', value: 176, note: '4.4% of U.S. electricity' },
      { label: '2028', lo: 325, hi: 580, note: '6.7–12% of U.S. electricity' }
    ], { max: 650, ticks: [0, 300, 600], unit: 'TWh' }));
  }

  /* ---------- water bottle lab ---------- */
  function bottle() {
    const wrap = $('#bottleWrap');
    wrap.innerHTML = `<svg viewBox="0 0 120 260" aria-hidden="true">
      <defs><clipPath id="bClip"><path d="M44,10 h32 v26 l14,24 v180 a10,10 0 0 1 -10,10 h-40 a10,10 0 0 1 -10,-10 v-180 l14,-24z"/></clipPath>
      <linearGradient id="bWater" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6fc8ff"/><stop offset="1" stop-color="#2a78d6"/></linearGradient></defs>
      <g clip-path="url(#bClip)"><rect x="0" y="0" width="120" height="260" fill="#eef4f8"/>
        <g id="bFill" transform="translate(0,250)"><path id="bWave" d="M-120,0 q15,-8 30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0 v300 h-240z" fill="url(#bWater)"/></g>
      </g>
      <path d="M44,10 h32 v26 l14,24 v180 a10,10 0 0 1 -10,10 h-40 a10,10 0 0 1 -10,-10 v-180 l14,-24z" fill="none" stroke="#2f6db3" stroke-opacity=".5" stroke-width="2.5"/>
      <rect x="40" y="2" width="40" height="12" rx="3" fill="#2a78d6"/>
      <text x="60" y="160" text-anchor="middle" fill="#0f1110" font-size="13" font-weight="600" font-family="Inter Tight, sans-serif" id="bPct">0%</text>
    </svg>`;
    if (!PP.reduce) gsap.to('#bWave', { x: 60, duration: 2.2, repeat: -1, ease: 'none' });
    const r = $('#bottleRange'), perPrompt = PP.F.chatWh * PP.F.waterMlPerWh;
    const fill = { y: 250 };
    const upd = () => {
      const n = +r.value, ml = n * perPrompt, frac = (ml % 500) / 500, bottles = Math.floor(ml / 500);
      r.style.setProperty('--p', (n - 1) / 1999 * 100 + '%');
      $('#bottleN').textContent = PP.fmt.num(n);
      $('#bottleMl').textContent = PP.fmt.num(ml, 0);
      $('#bottleCount').textContent = PP.fmt.num(ml / 500, 1);
      $('#bPct').textContent = bottles ? `${bottles} full + ${Math.round(frac * 100)}%` : `${Math.round(frac * 100)}%`;
      gsap.to(fill, { y: 250 - (bottles && frac < .02 ? 1 : frac) * 200, duration: .5, ease: 'power2.out', onUpdate: () => $('#bFill').setAttribute('transform', `translate(0,${fill.y})`) });
    };
    r.addEventListener('input', upd);
    PP.onVisible(wrap, upd, .4);
  }

  function houses() {
    const h = $('#houses');
    const svg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3z"/></svg>';
    h.innerHTML = Array.from({ length: 106 }, () => svg).join('');
    PP.onVisible(h, () => gsap.to(h.children, { opacity: 1, duration: .25, stagger: .015 }), .3);
    PP.onVisible($('#splitBar'), () => $('#splitBar').classList.add('is-in'), .4);
  }

  function jevons() {
    const el = $('#jevons');
    el.innerHTML = `<svg viewBox="0 0 420 240" role="img" aria-label="Indexed bars: Google energy per median prompt fell to about 3 percent of its 2024 level, while world data center electricity is projected to rise to 228 percent of 2024 by 2030">
      <text x="10" y="18" fill="#8a8f8a" font-size="11" font-family="Inter Tight, sans-serif">Indexed: earlier year = 100</text>
      <line x1="10" x2="410" y1="200" y2="200" stroke="#d2d4cc"/>
      <line x1="10" x2="410" y1="${200 - 100 * .75}" y2="${200 - 100 * .75}" stroke="#ecede6"/>
      <text x="410" y="${196 - 100 * .75}" text-anchor="end" fill="#8a8f8a" font-size="10" font-family="Inter Tight, sans-serif">100</text>
      ${bar(40, 100, 'var(--s1)', '100', 'jv1')}${bar(90, 3, 'var(--s1)', '3', 'jv2')}
      ${bar(240, 100, 'var(--s2)', '100', 'jv3')}${bar(290, 228, 'var(--s2)', '228', 'jv4')}
      <text x="85" y="222" text-anchor="middle" fill="#4b514d" font-size="11.5" font-family="Inter Tight, sans-serif">Energy per prompt</text>
      <text x="85" y="236" text-anchor="middle" fill="#8a8f8a" font-size="10" font-family="Inter Tight, sans-serif">Google, 2024 → 2025</text>
      <text x="285" y="222" text-anchor="middle" fill="#4b514d" font-size="11.5" font-family="Inter Tight, sans-serif">World data-center power</text>
      <text x="285" y="236" text-anchor="middle" fill="#8a8f8a" font-size="10" font-family="Inter Tight, sans-serif">IEA, 2024 → 2030</text>
    </svg>`;
    function colD(x, h) { const w = 24, r = Math.min(4, h); return `M${x},200 v-${h - r} a${r},${r} 0 0 1 ${r},-${r} h${w - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${h - r} z`; }
    function bar(x, v, c, lab, id) {
      const h = v * .75;
      return `<path id="${id}" data-x="${x}" data-h="${h}" d="${colD(x, h)}" fill="${c}"/><text x="${x + 12}" y="${192 - h}" text-anchor="middle" fill="#0f1110" font-size="12" font-weight="600" font-family="Inter Tight, sans-serif">${lab}</text>`;
    }
    if (!PP.reduce) {
      const paths = [...el.querySelectorAll('path[data-h]')];
      paths.forEach(p => p.setAttribute('d', colD(+p.dataset.x, 0)));
      PP.onVisible(el, () => paths.forEach((p, i) => {
        const o = { p: 0 };
        gsap.to(o, { p: 1, duration: 1, delay: i * .2, ease: 'power3.out', onUpdate: () => p.setAttribute('d', colD(+p.dataset.x, +p.dataset.h * o.p)) });
      }), .4);
    }
  }

  function students() {
    const data = [
      { label: 'UK: use generative AI (HEPI 2025)', value: 92, src: 'hepi', note: 'Up from 66% in 2024' },
      { label: 'Global: use AI in studies (DEC 2024)', value: 86, src: 'dec' },
      { label: 'U.S.: use AI for coursework weekly+ (Gallup 2026)', value: 57, src: 'gallup' },
      { label: 'Global: use AI weekly+ (DEC 2024)', value: 54, src: 'dec' },
      { label: 'U.S.: use AI for coursework daily (Gallup 2026)', value: 20, src: 'gallup', note: '“about one in five”' }
    ];
    PP.learnCharts.push(PP.hbar($('#chartStudents'), data, { max: 100, fmt: v => v + '%', ticks: [0, 25, 50, 75, 100], tickFmt: v => v + '%' }));
    PP.table($('#tableStudents'), ['Survey', 'Share', 'Source'], data.map(d => [d.label, d.value + '%', PP.SOURCES[d.src].cite]));
  }

  function myths() {
    const M = [
      { claim: 'Every ChatGPT question drinks a whole bottle of water.', v: 'Myth', cls: 'v-myth', body: 'The famous estimate was ~500 mL for a conversation of roughly 20–50 questions, counting power-plant water. Per prompt that’s closer to ~1 mL on our full-chain estimate. Google measures 0.26 mL on site.', src: ['li', 'google'] },
      { claim: 'An AI prompt uses 10× the energy of a Google search.', v: 'Outdated', cls: 'v-half', body: 'That compared an old ~3 Wh estimate with Google’s 2009 figure of 0.3 Wh. Today’s typical text prompt is around 0.24–0.34 Wh. But reasoning, images and video still cost far more.', src: ['epoch', 'search09'] },
      { claim: 'Data centers already run on clean energy.', v: 'Partly', cls: 'v-half', body: 'Renewables supplied about 27% of data-center electricity in 2024, projected to reach ~50% by 2030. The rest is mostly fossil fuels and nuclear.', src: ['iea'] },
      { claim: 'Efficiency gains will solve AI’s footprint on their own.', v: 'Myth', cls: 'v-myth', body: 'Google cut its median prompt’s energy 33× in a year, yet its total emissions were 48% above 2019. Growth in use can outrun efficiency.', src: ['google', 'googleEnv'] }
    ];
    $('#flips').innerHTML = M.map((m, i) => `
      <button class="flip" type="button" aria-label="Flip card: ${m.claim}">
        <div class="flip-in">
          <div class="flip-face flip-front"><span class="ff-tag">Claim ${i + 1}</span><q>${m.claim}</q><span class="ff-tap"><i data-lucide="rotate-3d"></i>Tap to check</span></div>
          <div class="flip-face flip-back"><span class="verdict ${m.cls}">${m.v}</span><p>${m.body}</p><p class="fine">${m.src.map(s => PP.cite(s)).join(' · ')}</p></div>
        </div>
      </button>`).join('');
    document.querySelectorAll('.flip').forEach(f => f.addEventListener('click', e => { if (e.target.closest('a')) return; f.classList.toggle('is-flipped'); }));
    if (!PP.reduce) {
      gsap.set('.flip', { opacity: 0, y: 30 });
      PP.onVisible($('#flips'), () => gsap.to('.flip', { opacity: 1, y: 0, stagger: .1, duration: .7, ease: 'power3.out' }));
    }
  }

  function reveals() {
    if (PP.reduce) return;
    document.querySelectorAll('#view-learn .ch-head, #view-learn .chart-card, #view-learn .tile, #view-learn .water-hero > *, #view-learn .jevons').forEach(el => {
      gsap.set(el, { opacity: 0, y: 34 });
      PP.onVisible(el, () => gsap.to(el, { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }), .12);
    });
  }

  PP.learnCharts = [];
  PP.learnInit = function () {
    if (inited) { PP.learnCharts.forEach(c => c.rerender && c.rerender()); if (PP.learnLoop) PP.learnLoop(); return; }
    inited = true;
    const root = $('#view-learn');
    PP.initSrc(root);
    heroField(); heroArt(); journey(); tasks(); growth(); bottle(); houses(); jevons(); students(); myths(); reveals();
    PP.initCounts(root);
    PP.icons();
    if (!PP.reduce) gsap.from('.learn-hero .wrap > *', { opacity: 0, y: 30, stagger: .1, duration: .9, ease: 'power3.out' });
  };
})();
