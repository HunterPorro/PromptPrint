/* Stewardship tab: See–Judge–Act, four principles, integral-ecology web, pledge */
(function () {
  const S = PP.svgEl;
  const $ = (s, r) => (r || document).querySelector(s);
  let inited = false;

  const PRINCIPLES = [
    {
      name: 'Dignity of the human person', icon: 'user-round', c: 'var(--c1)',
      short: 'Every person has a worth no technology can measure.',
      body: `<p><i>Magnifica Humanitas</i> insists each person has “an infinite dignity, inalienably grounded in his or her very being” (§53). AI must serve persons, never the reverse.</p>
             <p>That dignity belongs equally to the people who carry AI’s physical costs, like neighbors of water-stressed data centers and workers who mine the minerals in chips, and to the people who enjoy its convenience. It also concerns the learner: <i>Antiqua et Nova</i> warns that leaning on AI can erode the skills education is meant to grow (§81).</p>`,
      ask: 'Does this use of AI help me grow, or does it do my thinking for me?', src: ['mh', 'aen']
    },
    {
      name: 'The common good', icon: 'landmark', c: 'var(--c2)',
      short: 'Some goods belong to everyone, or they don’t exist at all.',
      body: `<p>The common good is “the sum total of social conditions which allow people… to reach their fulfillment more fully and more easily” (<i>MH</i> §60).</p>
             <p>Watersheds, clean air, a stable climate and an affordable power grid are exactly such conditions, and AI’s growth draws on all of them. The earth’s goods are given “to the entire human family… without excluding or favoring anyone” (§65).</p>`,
      ask: 'Who else shares the water and power my prompts use?', src: ['mh']
    },
    {
      name: 'Subsidiarity', icon: 'layers', c: 'var(--c3)',
      short: 'Decisions belong at the level closest to the people they affect.',
      body: `<p>Leo XIV gives “local communities, intermediary organizations, schools, universities” a voice in “the discernment of choices affecting people’s daily lives” (<i>MH</i> §71). AI’s footprint shouldn’t be decided by a handful of companies alone.</p>
             <p>Campuses can set AI and sustainability policies; towns can weigh whether to host a data center. But the encyclical adds a warning: “When subsidiarity is not linked to solidarity, it ends up merely protecting particular interests” (§73).</p>`,
      ask: 'What can my campus decide for itself, instead of waiting on tech companies?', src: ['mh']
    },
    {
      name: 'Solidarity', icon: 'hand-helping', c: 'var(--c4)',
      short: '“No one is saved alone.”',
      body: `<p>Solidarity is a firm commitment to the good of all, especially those with the least voice. <i>Laudato Si’</i> asks us to “hear both the cry of the earth and the cry of the poor” (§49). Climate impacts fall hardest on people who did least to cause them.</p>
             <p>“Intergenerational solidarity is not optional, but rather a basic question of justice” (<i>LS</i> §159). Using a powerful tool with restraint is one small, concrete way to practice it.</p>`,
      ask: 'Who pays the cost of my convenience, and do they have a say?', src: ['ls', 'mh']
    }
  ];

  const NODES = [
    { id: 'prompt', x: 300, y: 230, r: 38, label: 'Your prompt', icon: 'message-square', c: 'var(--ink)', title: 'Your prompt', text: 'A single request, multiplied by millions of students and billions of daily uses. It’s where a personal choice meets global infrastructure.' },
    { id: 'energy', x: 150, y: 120, r: 28, label: 'Electricity', icon: 'zap', c: 'var(--energy)', title: 'Electricity', text: 'Data centers used about 415 TWh in 2024, and that is projected to more than double to ~945 TWh by 2030.', src: 'iea' },
    { id: 'water', x: 120, y: 290, r: 28, label: 'Water', icon: 'droplet', c: 'var(--water)', title: 'Water', text: 'Evaporated for cooling and consumed by power plants. AI data centers’ water footprint could reach 9.3 trillion litres by 2030.', src: 'unu' },
    { id: 'climate', x: 300, y: 70, r: 28, label: 'Climate', icon: 'thermometer-sun', c: 'var(--carbon)', title: 'Climate', text: 'On the average U.S. grid, each kWh emits about 348 g of CO₂. Google’s emissions rose 48% from 2019 to 2023, largely from data centers.', src: 'googleEnv' },
    { id: 'minerals', x: 470, y: 120, r: 28, label: 'Minerals & e-waste', icon: 'cpu', c: 'var(--c3)', title: 'Minerals & e-waste', text: 'Chips are mined, refined and eventually discarded. Generative AI could add 1.2–5 million tonnes of e-waste by 2030.', src: 'wang' },
    { id: 'communities', x: 170, y: 410, r: 28, label: 'Local communities', icon: 'house', c: 'var(--c2)', title: 'Local communities', text: 'Data centers draw on local water and grid capacity, so siting decisions land on neighbors who may never use the service.' },
    { id: 'poor', x: 430, y: 410, r: 28, label: 'The poor', icon: 'hand-heart', c: 'var(--c4)', title: 'The poor', text: '“Hear both the cry of the earth and the cry of the poor.” Those with the least often face the worst effects of a warming, water-stressed world.', src: 'ls' },
    { id: 'future', x: 490, y: 280, r: 28, label: 'Future generations', icon: 'baby', c: 'var(--c1)', title: 'Future generations', text: '“Intergenerational solidarity is not optional, but rather a basic question of justice” (Laudato Si’ §159).', src: 'ls' },
    { id: 'mind', x: 300, y: 400, r: 28, label: 'Your mind', icon: 'brain', c: 'var(--accent)', title: 'Your own mind', text: 'Integral ecology includes human ecology. Over-reliance on AI can erode the very skills that learning is meant to build (Antiqua et Nova §81).', src: 'aen' }
  ];
  const EDGES = [['prompt', 'energy'], ['prompt', 'mind'], ['prompt', 'minerals'], ['energy', 'water'], ['energy', 'climate'], ['water', 'communities'], ['climate', 'poor'], ['climate', 'future'], ['minerals', 'poor'], ['communities', 'poor'], ['minerals', 'future'], ['mind', 'future'], ['prompt', 'water']];

  function orbit() {
    const el = $('#stOrbit');
    const svg = S('svg', { viewBox: '-300 -300 600 600', 'aria-hidden': 'true' }, el);
    svg.innerHTML = `
      <defs>
        <radialGradient id="stSea" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#9fd2f0"/><stop offset=".6" stop-color="#3b8fc9"/><stop offset="1" stop-color="#21598f"/></radialGradient>
        <radialGradient id="stLand" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#bfe39a"/><stop offset="1" stop-color="#4f8f4b"/></radialGradient>
        <radialGradient id="stHalo"><stop offset=".55" stop-color="#bfe3c4" stop-opacity=".55"/><stop offset="1" stop-color="#bfe3c4" stop-opacity="0"/></radialGradient>
        <radialGradient id="stShine" cx=".3" cy=".25" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <filter id="stShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#1d3a28" flood-opacity=".18"/></filter>
        <clipPath id="stClip"><circle r="80"/></clipPath>
      </defs>
      <circle r="140" fill="url(#stHalo)"/>
      <circle r="250" fill="none" stroke="rgba(15,17,16,.12)" stroke-dasharray="1 7" stroke-linecap="round"/>
      <circle r="180" fill="none" stroke="rgba(15,17,16,.1)"/>
      <g id="globe" filter="url(#stShadow)">
        <circle r="80" fill="url(#stSea)"/>
        <g clip-path="url(#stClip)"><g id="stLands">
          <path d="M-62,-34 C-40,-60 0,-48 12,-24 C24,0 -12,12 -24,36 C-36,58 -66,36 -72,12 Z M24,-66 C48,-60 72,-36 70,-6 C54,-12 36,-24 24,-36 Z M30,18 C54,18 66,36 48,60 C30,72 18,48 30,18 Z M110,-40 C130,-50 150,-20 140,10 C120,0 108,-20 110,-40 Z" fill="url(#stLand)"/>
        </g></g>
        <circle r="80" fill="url(#stShine)"/>
      </g>
      <g id="orb1">${sat(180, 0, 'var(--energy)', 'M-5,-9 L2,-1 L-2,-1 L5,9 L-2,1 L2,1 Z')}${sat(180, 180, 'var(--water)', 'M0,-9 C5,-2 7,2 7,4 a7,7 0 0 1 -14,0 C-7,2 -5,-2 0,-9Z')}</g>
      <g id="orb2">${sat(250, 60, 'var(--accent)', 'M0,8 C0,0 -2,-4 -8,-6 C-2,-8 0,-4 0,0 C0,-6 4,-10 9,-9 C6,-5 3,-2 0,2')}${sat(250, 200, 'var(--carbon)', 'M-7,3 a5,5 0 0 1 3,-9 a6,6 0 0 1 11,2 a4,4 0 0 1 0,8 z')}${sat(250, 300, 'var(--c4)', 'M0,8 L-7,1 a4,4 0 0 1 7,-6 a4,4 0 0 1 7,6 Z')}</g>`;
    function sat(rad, deg, color, d) {
      const a = deg * Math.PI / 180, x = Math.cos(a) * rad, y = Math.sin(a) * rad;
      return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><g class="sat"><circle r="26" fill="#ffffff" filter="url(#stShadow)"/><g transform="scale(1.3)"><path d="${d}" fill="${color}" stroke="${color}" stroke-width="1" stroke-linejoin="round"/></g></g></g>`;
    }
    if (PP.reduce) return;
    gsap.to('#stLands', { x: -60, duration: 14, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('#orb1', { rotation: 360, svgOrigin: '0 0', duration: 60, repeat: -1, ease: 'none' });
    gsap.to('#orb2', { rotation: -360, svgOrigin: '0 0', duration: 90, repeat: -1, ease: 'none' });
    gsap.to('#orb1 .sat', { rotation: -360, transformOrigin: '50% 50%', duration: 60, repeat: -1, ease: 'none' });
    gsap.to('#orb2 .sat', { rotation: 360, transformOrigin: '50% 50%', duration: 90, repeat: -1, ease: 'none' });
    gsap.from('#globe', { scale: 0, transformOrigin: '50% 50%', duration: 1.4, ease: 'elastic.out(1, .6)' });
  }

  function seeYou() {
    const saved = PP.store.load();
    const a = saved || PP.TYPICAL;
    const r = PP.compute(a);
    const E = PP.fmt.energy(r.yearWh), W = PP.fmt.water(r.waterMl), C = PP.fmt.co2(r.co2g);
    const nat = PP.fmt.energy(r.yearWh * PP.F.usStudents);
    $('#seeYou').innerHTML = `<div class="see-you">
      <span class="tile-label">${saved ? 'Your AI year, from the calculator' : 'A typical student’s AI year (illustrative)'}</span>
      <div class="sy-big">${E.v} <small>${E.u}</small></div>
      <div class="sy-row"><div><b>${W.v} ${W.u}</b><span>water</span></div><div><b>${C.v} ${C.u}</b><span>carbon</span></div><div><b>${nat.v} ${nat.u}</b><span>× every U.S. student</span></div></div>
      <p>${saved ? 'Small for one person, and large in aggregate.' : '<a href="#/calculate" data-start="1">Take the calculator</a> to see your own numbers here.'} Seeing honestly means holding both: the individual print is modest, while the collective trajectory is steep.</p>
    </div>`;
  }

  function principles() {
    const wrap = $('#principles');
    wrap.innerHTML = PRINCIPLES.map((p, i) => `
      <article class="pr" style="--pc:${p.c}">
        <button class="pr-head" type="button" aria-expanded="false" aria-controls="pr${i}">
          <span class="pr-num">0${i + 1}</span>
          <span class="pr-ic"><i data-lucide="${p.icon}"></i></span>
          <b>${p.name}</b><small>${p.short}</small>
          <span class="pr-more">Apply it to AI <i data-lucide="chevron-down"></i></span>
        </button>
        <div class="pr-body" id="pr${i}"><div class="pr-body-in">${p.body}<p class="pr-ask"><i data-lucide="help-circle"></i>${p.ask}</p><p class="fine">${p.src.map(s => PP.cite(s)).join(' · ')}</p></div></div>
      </article>`).join('');
    wrap.querySelectorAll('.pr').forEach(pr => {
      const btn = pr.querySelector('.pr-head'), body = pr.querySelector('.pr-body');
      btn.onclick = () => {
        const open = !pr.classList.contains('is-open');
        pr.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open);
        if (PP.reduce) { body.style.height = open ? 'auto' : '0'; return; }
        gsap.to(body, { height: open ? 'auto' : 0, duration: .55, ease: 'power3.inOut' });
      };
    });
    if (!PP.reduce) {
      gsap.set('.pr', { opacity: 0, y: 30 });
      PP.onVisible(wrap, () => gsap.to('.pr', { opacity: 1, y: 0, stagger: .1, duration: .8, ease: 'power3.out' }));
    }
  }

  function web() {
    const host = $('#ecoWeb');
    const svg = S('svg', { viewBox: '0 0 600 470' }, host);
    S('defs', {}, svg).innerHTML = '<filter id="webSh" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#1d3a28" flood-opacity=".14"/></filter>';
    const eg = S('g', {}, svg), ng = S('g', {}, svg);
    const byId = Object.fromEntries(NODES.map(n => [n.id, n]));
    const edges = EDGES.map(([a, b]) => {
      const A = byId[a], B = byId[b];
      const mx = (A.x + B.x) / 2 + (A.y - B.y) * .12, my = (A.y + B.y) / 2 + (B.x - A.x) * .12;
      const p = S('path', { d: `M${A.x},${A.y} Q${mx},${my} ${B.x},${B.y}`, fill: 'none', stroke: 'var(--ink)', 'stroke-opacity': .18, 'stroke-width': 1.5, class: 'edge' }, eg);
      return { a, b, p };
    });
    const nodes = NODES.map(n => {
      const g = S('g', { class: 'node', transform: `translate(${n.x},${n.y})`, tabindex: 0, role: 'button', 'aria-label': n.title }, ng);
      S('circle', { r: n.r + 8, fill: n.c, opacity: 0, class: 'n-halo' }, g);
      S('circle', { r: n.r, fill: '#ffffff', stroke: 'rgba(15,17,16,.1)', 'stroke-width': 1, class: 'n-bg', filter: 'url(#webSh)' }, g);
      const fo = S('foreignObject', { x: -11, y: -11, width: 22, height: 22 }, g);
      fo.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" class="n-ic" style="color:${n.c}"><i data-lucide="${n.icon}"></i></div>`;
      const t = S('text', { y: n.r + 18, 'text-anchor': 'middle', class: 'n-label' }, g);
      t.textContent = n.label;
      return { n, g };
    });
    const info = $('#ecoInfo');
    const select = id => {
      const n = byId[id];
      const linked = new Set([id]);
      edges.forEach(e => {
        const on = e.a === id || e.b === id;
        if (on) { linked.add(e.a); linked.add(e.b); }
        gsap.to(e.p, { attr: { 'stroke-opacity': on ? .9 : .08, 'stroke-width': on ? 2.5 : 1.5 }, stroke: on ? n.c : 'var(--ink)', duration: .4 });
      });
      nodes.forEach(({ n: m, g }) => {
        gsap.to(g.querySelector('.n-halo'), { opacity: m.id === id ? .25 : 0, duration: .4 });
        gsap.to(g, { opacity: linked.has(m.id) ? 1 : .35, duration: .4 });
      });
      info.innerHTML = `<span class="web-kicker" style="color:${n.c}">${[...linked].length - 1} connections</span><h3>${n.title}</h3><p>${n.text}</p>${n.src ? `<p class="fine">${PP.cite(n.src)}</p>` : ''}`;
      if (!PP.reduce) gsap.fromTo(info.children, { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: .05, duration: .4 });
    };
    nodes.forEach(({ n, g }) => {
      g.addEventListener('pointerenter', () => select(n.id));
      g.addEventListener('click', () => select(n.id));
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(n.id); } });
    });
    if (!PP.reduce) {
      edges.forEach(e => { const L = e.p.getTotalLength(); gsap.set(e.p, { strokeDasharray: L, strokeDashoffset: L }); });
      gsap.set(nodes.map(n => n.g), { opacity: 0 });
      PP.onVisible(host, () => {
        gsap.to(nodes.map(n => n.g), { opacity: 1, duration: .5, stagger: .07 });
        gsap.to(edges.map(e => e.p), { strokeDashoffset: 0, duration: 1.2, stagger: .06, ease: 'power2.inOut', delay: .3, onComplete() { this.targets().forEach(p => p.style.strokeDasharray = 'none'); } });
        gsap.delayedCall(1.6, () => select('prompt'));
      }, .3);
    } else select('prompt');
  }

  function stewardArt() {
    const el = $('#stewardArt');
    el.innerHTML = `<svg viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <radialGradient id="swBg" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3efe0"/></radialGradient>
        <linearGradient id="swSoil" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#c9a77a"/><stop offset="1" stop-color="#9b7a52"/></linearGradient>
        <linearGradient id="swLeaf" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#bfe39a"/><stop offset="1" stop-color="#3f8a55"/></linearGradient>
        <linearGradient id="swLeaf2" x1="1" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d5ecc0"/><stop offset="1" stop-color="#2f7a3e"/></linearGradient>
        <linearGradient id="swSkin" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f6d2ae"/><stop offset="1" stop-color="#e2a97e"/></linearGradient>
        <filter id="swSh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#1d3a28" flood-opacity=".18"/></filter>
      </defs>
      <circle cx="200" cy="200" r="175" fill="url(#swBg)"/>
      <ellipse cx="200" cy="314" rx="150" ry="22" fill="url(#swSoil)"/>
      <g stroke="#7a5e3e" stroke-width="2" fill="none" opacity=".5" class="roots" stroke-linecap="round">
        <path d="M200,312 c-6,10 -20,14 -30,22"/><path d="M200,312 c8,8 22,10 32,18"/><path d="M200,312 v18"/>
      </g>
      <path class="stem" d="M200,310 C198,260 204,220 200,170" stroke="#3f8a55" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path class="leaf l1" d="M200,236 C170,230 150,206 148,180 C176,184 196,204 200,236 Z" fill="url(#swLeaf)"/>
      <path class="leaf l2" d="M201,206 C232,198 252,170 252,142 C222,150 204,174 201,206 Z" fill="url(#swLeaf2)"/>
      <path class="leaf l3" d="M200,172 C188,150 190,124 204,104 C216,126 214,152 200,172 Z" fill="url(#swLeaf)"/>
      <g class="hands" fill="url(#swSkin)" filter="url(#swSh)">
        <path d="M60,290 C90,270 130,272 160,290 L190,300 C196,304 192,312 184,310 L150,304 C130,320 90,330 60,322 Z"/>
        <path d="M340,290 C310,270 270,272 240,290 L210,300 C204,304 208,312 216,310 L250,304 C270,320 310,330 340,322 Z"/>
      </g>
      <g class="sparks" fill="var(--energy)">${[[120, 120], [290, 100], [320, 200], [90, 210]].map(([x, y]) => `<path transform="translate(${x},${y})" d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z"/>`).join('')}</g>
    </svg>`;
    if (PP.reduce) return;
    const stem = el.querySelector('.stem'), L = stem.getTotalLength();
    gsap.set(stem, { strokeDasharray: L, strokeDashoffset: L });
    gsap.set(el.querySelectorAll('.leaf'), { scale: 0, transformOrigin: '50% 100%' });
    gsap.set(el.querySelectorAll('.sparks path'), { scale: 0, transformOrigin: '50% 50%' });
    PP.onVisible(el, () => {
      const tl = gsap.timeline();
      tl.from(el.querySelectorAll('.hands path'), { y: 30, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out' })
        .to(stem, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' }, '-=.2')
        .to(el.querySelectorAll('.leaf'), { scale: 1, duration: .7, stagger: .18, ease: 'back.out(2)' }, '-=.6')
        .to(el.querySelectorAll('.sparks path'), { scale: 1, duration: .5, stagger: .1, ease: 'back.out(3)' }, '-=.3');
      gsap.to(el.querySelectorAll('.leaf'), { rotation: 3, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.5, stagger: .3 });
      gsap.to(el.querySelectorAll('.sparks path'), { opacity: .3, duration: 1.2, repeat: -1, yoyo: true, stagger: .3, delay: 3 });
    }, .3);
  }

  function pledge() {
    const saved = PP.store.load();
    const a = saved || PP.TYPICAL;
    if (saved) $('#pledgeBasis').innerHTML = 'Based on your calculator answers.';
    const list = $('#pledgeList'), on = new Set();
    const items = PP.LEVERS.map(l => ({ l, s: PP.leverSavings(a, [l.key]) })).filter(x => x.s > 0.01).sort((x, y) => y.s - x.s);
    list.innerHTML = items.map(({ l, s }) => {
      const e = PP.fmt.energy(s);
      return `<li class="lever" data-k="${l.key}" role="switch" aria-checked="false" tabindex="0"><span class="lv-ic"><i data-lucide="${l.icon}"></i></span><span class="lv-txt"><b>${l.label}</b></span><span class="lv-save">−${e.v} ${e.u}</span><span class="switch"></span></li>`;
    }).join('');
    PP.icons();
    const campus = $('#campusN');
    const upd = () => {
      const s = PP.leverSavings(a, [...on]);
      const e = PP.fmt.energy(s), c = PP.fmt.energy(s * Math.max(0, +campus.value || 0));
      $('#pledgeSave').textContent = e.v + ' ' + e.u;
      $('#campusSave').textContent = c.v + ' ' + c.u;
      if (!PP.reduce) gsap.fromTo(['#pledgeSave', '#campusSave'], { scale: 1.08 }, { scale: 1, duration: .35 });
    };
    list.querySelectorAll('.lever').forEach(li => {
      const t = () => { const k = li.dataset.k; on.has(k) ? on.delete(k) : on.add(k); li.classList.toggle('is-on', on.has(k)); li.setAttribute('aria-checked', on.has(k)); upd(); };
      li.onclick = t; li.onkeydown = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); t(); } };
    });
    campus.oninput = upd;
    upd();
  }

  function reveals() {
    if (PP.reduce) return;
    document.querySelectorAll('#view-stewardship .ch-head, #view-stewardship .st-card, #view-stewardship .sja-step, #view-stewardship .rq, #view-stewardship .pull, #view-stewardship .see-facts > div, #view-stewardship .steward-text > *').forEach(el => {
      gsap.set(el, { opacity: 0, y: 30 });
      PP.onVisible(el, () => gsap.to(el, { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }), .12);
    });
  }

  document.addEventListener('pp:results', () => { if (inited) { seeYou(); pledge(); } });

  PP.stewardInit = function () {
    if (inited) { seeYou(); pledge(); return; }
    inited = true;
    const root = $('#view-stewardship');
    PP.initSrc(root);
    orbit(); seeYou(); principles(); web(); stewardArt(); pledge(); reveals();
    PP.icons();
    if (!PP.reduce) gsap.from('.st-hero .wrap > *', { opacity: 0, y: 30, stagger: .1, duration: .9, ease: 'power3.out' });
  };
})();
