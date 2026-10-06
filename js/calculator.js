/* The survey, live meter, crunch animation and results */
(function () {
  const Q = PP.QUESTIONS;
  const $ = (s, r) => (r || document).querySelector(s);
  let idx = 0, answers = {}, chosen = {};

  function defaults() {
    const a = Object.assign({}, PP.TYPICAL);
    Q.forEach(q => { if (q.def !== undefined && !(q.key in a)) a[q.key] = Array.isArray(q.def) ? q.def.slice() : q.def; });
    return a;
  }
  function current() { return Object.assign(defaults(), answers); }
  // the live meter only counts what you've actually answered, so it grows from zero
  const ZERO = { days: 0, perDay: 0, tier: 'standard', longShare: 0, redo: 1, reason: 0, code: 0, search: 0, apps: 0, images: 0, videos: 0, weeks: 32 };
  function answeredOnly() {
    const a = Object.assign({}, ZERO);
    Object.keys(chosen).forEach(k => { a[k] = answers[k]; });
    if (!('days' in chosen) && 'perDay' in chosen) a.days = PP.TYPICAL.days;
    if ('days' in chosen && !('perDay' in chosen)) a.perDay = PP.TYPICAL.perDay;
    return a;
  }

  /* ---------- Levers (shared with Stewardship) ---------- */
  PP.LEVERS = [
    { key: 'redo', icon: 'target', label: 'Write one clear prompt instead of rerolling', desc: 'No more regenerate loops', apply: a => (a.redo = 1, a) },
    { key: 'tier', icon: 'feather', label: 'Use a lightweight model for everyday questions', desc: 'mini / flash models use about half the energy', apply: a => (a.tier = 'small', a) },
    { key: 'reason', icon: 'brain', label: 'Save reasoning mode for problems that need it', desc: 'Half as many reasoning prompts', apply: a => (a.reason *= 0.5, a) },
    { key: 'long', icon: 'file-minus', label: 'Summarize long readings once, then work from the summary', desc: 'Half as many long-input prompts', apply: a => (a.longShare *= 0.5, a) },
    { key: 'search', icon: 'search-x', label: 'Skip the AI summary when a plain search will do', desc: 'Half as many AI search answers', apply: a => (a.search *= 0.5, a) },
    { key: 'code', icon: 'code-xml', label: 'Batch coding questions and send only the files needed', desc: '30% fewer coding requests', apply: a => (a.code *= 0.7, a) },
    { key: 'images', icon: 'image-minus', label: 'Only generate images you’ll actually use', desc: 'Half as many images', apply: a => (a.images *= 0.5, a) },
    { key: 'video', icon: 'video-off', label: 'Skip AI video for throwaway clips', desc: 'No AI video', apply: a => (a.videos = 0, a) }
  ];
  PP.leverSavings = function (a, keys) {
    const base = PP.compute(a).yearWh;
    let m = Object.assign({}, a);
    PP.LEVERS.filter(l => keys.includes(l.key)).forEach(l => { m = l.apply(m); });
    return base - PP.compute(m).yearWh;
  };

  PP.store = {
    save(a) { try { localStorage.setItem('pp-answers', JSON.stringify(a)); } catch (e) {} },
    load() { try { return JSON.parse(localStorage.getItem('pp-answers') || 'null'); } catch (e) { return null; } }
  };

  /* ---------- Live meter ---------- */
  const meterState = { wh: 0 };
  function updateMeter(animate) {
    const to = PP.compute(answeredOnly()).yearWh;
    const setVals = wh => {
      const e = PP.fmt.energy(wh), w = PP.fmt.water(wh * PP.F.waterMlPerWh), c = PP.fmt.co2(wh * PP.F.co2gPerWh);
      $('#mEnergy').textContent = e.v; $('#mEnergyU').textContent = e.u;
      $('#mWater').textContent = w.v; $('#mWaterU').textContent = w.u;
      $('#mCarbon').textContent = c.v; $('#mCarbonU').textContent = c.u;
    };
    if (animate === false || PP.reduce) { meterState.wh = to; setVals(to); }
    else gsap.to(meterState, { wh: to, duration: .8, ease: 'power2.out', onUpdate: () => setVals(meterState.wh), overwrite: true });
    PP.scene.setLevel(PP.scene.levelFor(to));
  }

  /* ---------- Progress ---------- */
  function isAnswered(q) { return q.type === 'slider' || q.type === 'multi' || (q.key in chosen); }

  function renderProgress() {
    const el = $('#progress');
    if (!el.children.length) el.innerHTML = PP.CATS.map(c => `<div class="pg-cat"><span>${c}</span><div class="pg-track"><div class="pg-fill"></div></div></div>`).join('');
    PP.CATS.forEach((c, ci) => {
      const ids = Q.map((q, i) => q.cat === ci ? i : -1).filter(i => i >= 0);
      const start = ids[0], n = ids.length;
      let p = (idx - start + (isAnswered(Q[idx]) ? 1 : 0.4)) / n;
      if (idx > start + n - 1) p = 1; if (idx < start) p = 0;
      const cat = el.children[ci];
      cat.querySelector('.pg-fill').style.width = Math.max(0, Math.min(1, p)) * 100 + '%';
      cat.classList.toggle('is-on', idx >= start);
    });
  }

  /* ---------- Render a question ---------- */
  function optHTML(o, i, multi) {
    return `<button class="opt" data-i="${i}" type="button" role="${multi ? 'checkbox' : 'radio'}" aria-checked="false">
      <span class="o-key">${multi ? '' : i + 1}</span>
      <span class="o-ic"><i data-lucide="${o.icon}"></i></span>
      <span class="o-txt"><b>${o.label}</b>${o.hint ? `<small>${o.hint}</small>` : ''}</span>
      <span class="o-check"><i data-lucide="check"></i></span>
    </button>`;
  }

  function bodyHTML(q) {
    if (q.type === 'slider') {
      const v = answers[q.key] != null ? answers[q.key] : q.def;
      return `<div class="sl-val"><b id="slNum">${v}</b><span>${q.unit}</span><em class="sl-desc" id="slDesc"></em></div>
        <input type="range" class="range" id="slRange" min="${q.min}" max="${q.max}" step="${q.step}" value="${v}" aria-label="${q.title.replace(/"/g, '')}">
        <div class="sl-marks">${q.marks.map(m => `<button type="button" data-v="${m[0]}" style="left:${(m[0] - q.min) / (q.max - q.min) * 100}%"><b>${m[0]}</b><span>${m[1]}</span></button>`).join('')}</div>
        <div class="sl-impact" id="slImpact"><i data-lucide="zap"></i><span></span></div>`;
    }
    const multi = q.type === 'multi';
    return `<div class="opts${multi ? ' is-chips' : ''}${q.options.length >= 5 && !multi ? ' is-dense' : ''}" role="${multi ? 'group' : 'radiogroup'}">${q.options.map((o, i) => optHTML(o, i, multi)).join('')}</div>
      ${q.type === 'guess' ? '<div class="reveal" id="reveal" hidden></div>' : ''}`;
  }

  function renderQ(dir) {
    const q = Q[idx];
    const card = $('#qcard');
    const inner = document.createElement('div');
    inner.className = 'q-inner';
    const last = idx === Q.length - 1;
    inner.innerHTML = `
      <div class="q-meta"><span class="q-cat"><i data-lucide="${['repeat-2', 'message-square-text', 'globe', 'calendar-check'][q.cat]}"></i>${PP.CATS[q.cat]}</span><span class="q-count">${String(idx + 1).padStart(2, '0')}<i> / ${Q.length}</i></span></div>
      ${q.type === 'guess' ? '<span class="q-badge"><i data-lucide="brain-circuit"></i>Quick quiz</span>' : ''}
      <h2 class="q-title">${q.title}</h2>
      <p class="q-sub">${q.sub}</p>
      <div class="q-body">${bodyHTML(q)}</div>
      <details class="q-fact" ${window.innerHeight > 820 ? 'open' : ''}><summary><i data-lucide="lightbulb"></i>Did you know?</summary><p>${q.fact.text} ${PP.cite(q.fact.src)}</p></details>
      <div class="q-nav">
        <button class="btn btn-ghost btn-icon" id="qBack" type="button" aria-label="Previous question" ${idx === 0 ? 'disabled' : ''}><i data-lucide="arrow-left"></i></button>
        <div class="q-dots" aria-hidden="true">${Q.map((_, i) => `<i class="${i < idx ? 'done' : i === idx ? 'now' : ''}"></i>`).join('')}</div>
        <button class="btn btn-primary" id="qNext" type="button"><span>${last ? 'See my print' : 'Continue'}</span><i data-lucide="${last ? 'sparkles' : 'arrow-right'}"></i></button>
      </div>`;

    const old = card.querySelector('.q-inner');
    const swapIn = () => {
      if (old) old.remove();
      card.appendChild(inner);
      card.scrollTop = 0;
      PP.icons();
      wire(q, inner);
      if (!PP.reduce) {
        gsap.fromTo(inner, { x: 36 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: .55, ease: 'expo.out' });
        gsap.fromTo(inner.querySelectorAll('.q-title, .q-sub'), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .06, ease: 'power3.out' });
        gsap.fromTo(inner.querySelectorAll('.opt, .sl-val, .range, .sl-marks, .sl-impact, .q-fact'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .04, delay: .1, ease: 'power3.out' });
      }
    };
    if (old && !PP.reduce) gsap.to(old, { x: -36 * dir, opacity: 0, duration: .22, ease: 'power2.in', onComplete: swapIn });
    else swapIn();
    renderProgress();
  }

  function wire(q, inner) {
    const next = inner.querySelector('#qNext');
    inner.querySelector('#qBack').onclick = () => go(-1);
    next.onclick = () => go(1);
    const setNext = () => { next.disabled = !isAnswered(q); };

    if (q.type === 'slider') {
      const r = inner.querySelector('#slRange'), num = inner.querySelector('#slNum'), desc = inner.querySelector('#slDesc'), imp = inner.querySelector('#slImpact span');
      const marks = [...inner.querySelectorAll('.sl-marks button')];
      let lastV = null;
      const upd = live => {
        const v = +r.value;
        answers[q.key] = v; chosen[q.key] = true;
        r.style.setProperty('--p', ((v - q.min) / (q.max - q.min) * 100) + '%');
        num.textContent = v;
        if (live && lastV !== null && v !== lastV && !PP.reduce) gsap.fromTo(num, { scale: 1.06 }, { scale: 1, duration: .25, overwrite: true });
        lastV = v;
        let lab = q.marks[0][1], li = 0;
        q.marks.forEach((m, i) => { if (v >= m[0]) { lab = m[1]; li = i; } });
        desc.textContent = lab;
        marks.forEach((b, i) => b.classList.toggle('is-on', i === li));
        const a = current(), z = Object.assign({}, a, { [q.key]: 0 });
        const add = PP.compute(a).yearWh - PP.compute(z).yearWh;
        const e = PP.fmt.energy(add), w = PP.fmt.water(add * PP.F.waterMlPerWh);
        imp.innerHTML = `Adds <b>${e.v} ${e.u}</b> of electricity and <b>${w.v} ${w.u}</b> of water to your year`;
        if (live) updateMeter();
      };
      r.addEventListener('input', () => upd(true));
      marks.forEach(b => b.onclick = () => {
        const o = { v: +r.value };
        gsap.to(o, { v: +b.dataset.v, duration: .5, ease: 'power2.out', onUpdate: () => { r.value = Math.round(o.v / q.step) * q.step; upd(true); } });
      });
      upd(false); updateMeter(); setNext();
      return;
    }

    const opts = [...inner.querySelectorAll('.opt')];
    const optsWrap = inner.querySelector('.opts');

    if (q.type === 'multi') {
      if (!answers[q.key]) answers[q.key] = (q.def || []).slice();
      const sync = () => opts.forEach((b, i) => {
        const on = answers[q.key].includes(q.options[i].value);
        b.classList.toggle('is-sel', on); b.setAttribute('aria-checked', on);
      });
      opts.forEach((b, i) => b.onclick = () => {
        const v = q.options[i].value, arr = answers[q.key], k = arr.indexOf(v);
        if (k >= 0) arr.splice(k, 1); else arr.push(v);
        chosen[q.key] = true; sync();
        if (!PP.reduce) gsap.fromTo(b, { scale: .94 }, { scale: 1, duration: .45, ease: 'back.out(3)' });
      });
      sync(); setNext();
      return;
    }

    if (q.type === 'guess') {
      const lock = (i, animate) => {
        optsWrap.classList.add('is-locked');
        opts.forEach((b, j) => {
          const o = q.options[j];
          b.classList.toggle('is-right', !!o.correct);
          b.classList.toggle('is-wrong', j === i && !o.correct);
          b.classList.toggle('is-dim', j !== i && !o.correct);
          b.setAttribute('aria-checked', j === i);
        });
        const rv = inner.querySelector('#reveal'), right = q.options[i].correct;
        rv.innerHTML = `<div class="rv-head"><i data-lucide="${right ? 'party-popper' : 'info'}"></i>${right ? 'Nailed it' : 'Not quite'}</div><p>${q.reveal}</p>`;
        rv.hidden = false;
        rv.classList.toggle('is-right', !!right);
        PP.icons();
        if (animate && !PP.reduce) {
          gsap.fromTo(rv, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: .55, ease: 'power3.out' });
          if (right) confetti(opts[i]); else gsap.fromTo(opts[i], { x: -8 }, { x: 0, duration: .6, ease: 'elastic.out(1, .3)' });
        }
        setNext();
      };
      opts.forEach((b, i) => b.onclick = () => {
        if (q.key in chosen) return;
        answers[q.key] = q.options[i].value; chosen[q.key] = true;
        lock(i, true);
      });
      if (q.key in chosen) lock(q.options.findIndex(o => o.value === answers[q.key]), false);
      setNext();
      return;
    }

    const sync = () => opts.forEach((b, i) => {
      const on = (q.key in chosen) && answers[q.key] === q.options[i].value;
      b.classList.toggle('is-sel', on); b.setAttribute('aria-checked', on);
    });
    opts.forEach((b, i) => b.onclick = () => {
      answers[q.key] = q.options[i].value; chosen[q.key] = true;
      sync(); setNext(); updateMeter(); renderProgress();
      if (!PP.reduce) gsap.fromTo(b.querySelector('.o-ic'), { rotate: -14, scale: .8 }, { rotate: 0, scale: 1, duration: .55, ease: 'back.out(3)' });
    });
    sync(); setNext(); updateMeter();
  }

  function confetti(anchor) {
    const r = anchor.getBoundingClientRect();
    const colors = ['#8ef0b4', '#ffd36e', '#6fc8ff', '#ff9a70', '#a99cf5'];
    for (let i = 0; i < 34; i++) {
      const d = document.createElement('i');
      d.style.cssText = `position:fixed;z-index:95;left:${r.left + 40}px;top:${r.top + r.height / 2}px;width:7px;height:${4 + Math.random() * 7}px;background:${colors[i % 5]};border-radius:2px;pointer-events:none`;
      document.body.appendChild(d);
      gsap.to(d, { x: (Math.random() - .2) * 320, y: -70 - Math.random() * 140, rotation: Math.random() * 600, duration: .7, ease: 'power2.out' });
      gsap.to(d, { y: '+=220', opacity: 0, duration: .9, delay: .6, ease: 'power1.in', onComplete: () => d.remove() });
    }
  }

  function go(d) {
    const q = Q[idx];
    if (d > 0 && !isAnswered(q)) {
      if (!PP.reduce) gsap.fromTo('#qcard .opts', { x: -6 }, { x: 0, duration: .5, ease: 'elastic.out(1, .3)' });
      return;
    }
    if (d > 0 && idx === Q.length - 1) return finish();
    idx = Math.max(0, Math.min(Q.length - 1, idx + d));
    renderQ(d);
  }

  document.addEventListener('keydown', e => {
    if ($('#survey').hidden || PP.route !== 'calculate') return;
    const q = Q[idx];
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SUMMARY') { e.preventDefault(); go(1); }
    else if (e.target.tagName !== 'INPUT' && /^[1-9]$/.test(e.key) && q.options && q.type !== 'multi') {
      const b = document.querySelectorAll('#qcard .opt')[+e.key - 1];
      if (b) b.click();
    }
  });

  /* ---------- Start / finish ---------- */
  PP.startSurvey = function () {
    const stage = $('#stage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $('#results').hidden = true;
    const res = $('.stage-result'); if (res) res.remove();
    stage.classList.add('is-survey');
    PP.scene.showWord(false);
    const show = () => {
      $('#landing').hidden = true;
      $('#survey').hidden = false;
      idx = 0; answers = {}; chosen = {};
      renderProgress(); renderQ(1); updateMeter(false);
      if (!PP.reduce) {
        gsap.fromTo('#qcard', { y: 60, opacity: 0, scale: .97 }, { y: 0, opacity: 1, scale: 1, duration: .8, ease: 'expo.out' });
        gsap.fromTo('.survey-hud', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: .6, delay: .15 });
      }
    };
    const land = $('#landing');
    if (!land.hidden && !PP.reduce) gsap.to(land.children, { opacity: 0, y: -24, stagger: .04, duration: .35, ease: 'power2.in', onComplete: () => { gsap.set(land.children, { opacity: 1, y: 0 }); show(); } });
    else show();
  };

  function finish() {
    const a = current();
    PP.store.save(a);
    const crunch = $('#crunch'), msg = $('#crunchMsg');
    const done = () => {
      crunch.hidden = true;
      $('#survey').hidden = true;
      $('#stage').classList.remove('is-survey');
      renderResults(a);
    };
    if (PP.reduce) return done();
    crunch.hidden = false;
    const msgs = ['Tallying your prompts…', 'Following the power lines…', 'Measuring the water…', 'Checking the grid mix…', 'Scaling to 19.4 million students…'];
    gsap.fromTo(crunch, { opacity: 0 }, { opacity: 1, duration: .35 });
    gsap.fromTo('#crArc', { attr: { 'stroke-dashoffset': 314.16 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 3.1, ease: 'power1.inOut' });
    msgs.forEach((m, i) => gsap.delayedCall(i * .64, () => { msg.textContent = m; gsap.fromTo(msg, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .3 }); }));
    gsap.delayedCall(3.4, () => gsap.to(crunch, { opacity: 0, duration: .35, onComplete: done }));
  }

  /* ---------- Results ---------- */
  const ICON = {
    battery: '<svg viewBox="0 0 24 24" fill="none" stroke="#ffd36e" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2"/><path d="M6 10v4M10 10v4"/></svg>',
    bottle: '<svg viewBox="0 0 24 24" fill="#6fc8ff" fill-opacity=".25" stroke="#6fc8ff" stroke-width="1.8" stroke-linejoin="round"><path d="M10 2h4v3l2 3v13a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8l2-3z"/><path d="M8 13h8"/></svg>',
    car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>'
  };
  function niceUnit(n, cap) {
    if (n <= cap) return 1;
    const raw = n / cap, p = Math.pow(10, Math.floor(Math.log10(raw)));
    return [1, 2, 5, 10].map(m => m * p).find(u => u >= raw);
  }
  function iconGrid(count, svg, cap) {
    const unit = niceUnit(count, cap);
    const n = Math.max(1, Math.round(count / unit));
    return { html: `<div class="icon-grid">${Array.from({ length: Math.min(n, cap) }, () => svg).join('')}</div>`, unit };
  }

  const TIPS = {
    writing: ['pen-line', 'Writing', 'Draft first, then ask for targeted feedback one section at a time. Fewer, sharper prompts beat regenerate-until-perfect.'],
    study: ['book-open', 'Studying', 'Ask AI to quiz you instead of re-explaining the same idea. Active recall uses fewer prompts and sticks better.'],
    coding: ['code-xml', 'Coding', 'Give coding tools only the files they need. Every request ships its context along with it.'],
    research: ['search', 'Research', 'Use AI to find leads, then read the actual sources. A library database search costs a tiny fraction of a reasoning run.'],
    ideas: ['sparkles', 'Brainstorming', 'Ask for ten ideas in one prompt rather than one idea ten times.'],
    images: ['image', 'Images', 'Describe the layout fully in words and generate once. Every reroll is another ~1.35 Wh.'],
    fun: ['smile', 'Personal & fun', 'Fun counts, but it’s the easiest place to cut. One AI video clip ≈ 3,000 text prompts.'],
    career: ['briefcase', 'Career prep', 'Save a strong résumé or cover-letter prompt as a template instead of starting from scratch every time.']
  };

  function guessCard(q, val, title) {
    if (val == null) return '';
    const o = q.options.find(x => x.value === val), right = o && o.correct, c = q.options.find(x => x.correct);
    return `<div class="gr ${right ? 'ok' : 'no'}"><div class="gr-ic"><i data-lucide="${right ? 'check' : 'x'}"></i></div><div><h4>${title}</h4><p>You guessed <b>${o ? o.label.toLowerCase() : '?'}</b>. ${right ? 'Spot on.' : `Answer: <b>${c.label.toLowerCase()}</b>.`}</p></div></div>`;
  }

  function renderResults(a) {
    const r = PP.compute(a), F = PP.F;
    const E = PP.fmt.energy(r.yearWh), Wt = PP.fmt.water(r.waterMl), C = PP.fmt.co2(r.co2g);
    const typ = PP.compute(PP.TYPICAL);
    const ratio = r.yearWh / typ.yearWh;
    const nat = r.yearWh * F.usStudents, natE = PP.fmt.energy(nat);
    const homes = nat / (F.homeKWhYear * 1000);
    const pools = r.waterMl * F.usStudents / 1000 / 2.5e6;
    const natT = r.co2g * F.usStudents / 1e6;
    const phones = r.yearWh / F.phoneWh, bottles = r.waterMl / F.bottleMl, miles = r.co2g / F.carGPerMile, hours = r.yearWh / F.streamWhPerHour;
    const pg = iconGrid(phones, ICON.battery, 48), bg = iconGrid(bottles, ICON.bottle, 48);
    const homeDays = r.yearWh / (F.homeKWhYear * 1000 / 365);
    const cmpWord = ratio > 1.15 ? `<b>${PP.fmt.num(ratio, 1)}×</b> our illustrative typical student` : ratio < 0.87 ? `<b>${PP.fmt.num(1 / ratio, 1)}× lighter</b> than our illustrative typical student` : 'right around our illustrative typical student';
    const parts = PP.PART_META.map(m => Object.assign({ v: r.parts[m.key] }, m));
    const top = parts.slice().sort((x, y) => y.v - x.v)[0];
    const uses = (a.uses || []).filter(u => TIPS[u]);
    const level = PP.scene.levelFor(r.yearWh);
    const grade = level < .2 ? ['Featherweight', 'var(--accent)'] : level < .38 ? ['Light footprint', 'var(--accent)'] : level < .55 ? ['Moderate footprint', 'var(--energy)'] : level < .75 ? ['Heavy footprint', 'var(--carbon)'] : ['Very heavy footprint', 'var(--carbon)'];

    const el = $('#results');
    el.innerHTML = `
      <div class="wrap" id="resultsTop">
        <div class="r-tiles">
          <div class="r-tile t-energy"><div class="rt-top"><div class="rt-ic"><i data-lucide="zap"></i></div><span class="rt-label">Energy / year</span></div><div class="rt-val"><span data-to="${E.n}">0</span><small>${E.u}</small></div><div class="rt-sub">${PP.fmt.num(r.weekWh)} Wh per week</div></div>
          <div class="r-tile t-water"><div class="rt-top"><div class="rt-ic"><i data-lucide="droplet"></i></div><span class="rt-label">Water / year</span></div><div class="rt-val"><span data-to="${Wt.n}">0</span><small>${Wt.u}</small></div><div class="rt-sub">cooling + power generation · ${PP.cite('li', 'Li et al.')}</div></div>
          <div class="r-tile t-carbon"><div class="rt-top"><div class="rt-ic"><i data-lucide="cloud"></i></div><span class="rt-label">Carbon / year</span></div><div class="rt-val"><span data-to="${C.n}">0</span><small>${C.u}</small></div><div class="rt-sub">U.S. average grid · ${PP.cite('egrid', 'EPA eGRID')}</div></div>
        </div>
        <p class="r-summary">About <b>${PP.fmt.compact(r.totalRequests)} AI requests</b> a year, ${cmpWord}. Your biggest slice is <b>${top.label.toLowerCase()}</b>.</p>

        <section class="r-section">
          <div class="r-head"><span class="r-kicker">01</span><div><h2 class="r-h2">What that looks like</h2><p class="r-h2-sub">Your year of AI, in everyday things. ${PP.cite('epaEq', 'EPA')} · ${PP.cite('ieaStream', 'IEA')}</p></div></div>
          <div class="equivs">
            <div class="eq"><div class="eq-vis">${pg.html}</div><b data-to="${phones}">0</b><span>smartphone charges</span><span class="unit-note">${pg.unit > 1 ? `each icon = ${PP.fmt.num(pg.unit)} charges` : 'each icon = 1 charge'}</span></div>
            <div class="eq"><div class="eq-vis">${bg.html}</div><b data-to="${bottles}">0</b><span>500 mL water bottles</span><span class="unit-note">${bg.unit > 1 ? `each icon = ${PP.fmt.num(bg.unit)} bottles` : 'each icon = 1 bottle'}</span></div>
            <div class="eq"><div class="eq-vis"><div class="road"><div class="road-line"></div><div class="road-fill" id="roadFill"></div><div class="road-car" id="roadCar">${ICON.car}</div></div></div><b data-to="${miles}">0</b><span>miles in an average gas car, same CO₂</span></div>
            <div class="eq"><div class="eq-vis"><div class="tv"><div class="tv-screen"><span></span></div><div class="tv-stand"></div></div></div><b data-to="${hours}">0</b><span>hours of streaming video</span></div>
          </div>
        </section>

        <section class="r-section">
          <div class="r-head"><span class="r-kicker">02</span><div><h2 class="r-h2">Where it comes from</h2><p class="r-h2-sub">Your yearly energy by activity. Hover a segment for details.</p></div></div>
          <div class="stack-card">
            <div class="stackbar" id="stackbar">${parts.filter(p => p.v > 0).map(p => {
              const pct = p.v / r.yearWh * 100;
              return `<div class="sb" data-k="${p.key}" data-w="${pct}" style="background:${p.color}">${pct >= 12 ? `<span>${PP.fmt.num(pct, 0)}%</span>` : ''}</div>`;
            }).join('')}</div>
            <div class="legend">${parts.filter(p => p.v > 0).map(p => `<span class="lg"><i style="background:${p.color}"></i>${p.label} <b>${PP.fmt.num(p.v / r.yearWh * 100 || 0, 0)}%</b></span>`).join('')}</div>
            <details class="table-toggle"><summary>View as table</summary><div id="partsTable"></div></details>
          </div>
        </section>

        <section class="r-section">
          <div class="r-head"><span class="r-kicker">03</span><div><h2 class="r-h2">How you compare</h2><p class="r-h2-sub">Yearly electricity on a log scale. “Typical student” is an illustrative profile built from the survey defaults, not a measured average.</p></div></div>
          <div class="chart-card"><div class="chart" id="chartCompare"></div></div>
        </section>

        <section class="r-section">
          <div class="r-head"><span class="r-kicker">04</span><div><h2 class="r-h2">If every U.S. college student used AI like you</h2><p class="r-h2-sub">${PP.fmt.num(F.usStudents / 1e6, 1)} million students were enrolled in fall 2025 ${PP.cite('nsc')}. Here’s your habit at that scale, for one year.</p></div></div>
          <div class="scale">
            <div class="scale-hero">
              <span class="tile-label">Electricity</span>
              <div><b class="huge" data-to="${natE.n}">0</b><span class="huge-u">${natE.u}</span></div>
              <p>Enough to power about <b>${PP.fmt.num(homes, 0)}</b> average U.S. homes for a full year ${PP.cite('epaEq')}.</p>
              <div class="mini-homes" id="miniHomes"></div>
            </div>
            <div class="scale-list">
              <div class="scale-item"><div class="si-ic" style="color:var(--water)"><i data-lucide="waves"></i></div><div><b>${PP.fmt.num(pools, pools < 10 ? 1 : 0)}</b><span>Olympic pools of water (2.5 million L each)</span></div></div>
              <div class="scale-item"><div class="si-ic" style="color:var(--carbon)"><i data-lucide="factory"></i></div><div><b>${PP.fmt.num(natT, 0)} t CO₂</b><span>on the average U.S. grid</span></div></div>
              <div class="scale-item"><div class="si-ic" style="color:var(--energy)"><i data-lucide="house"></i></div><div><b>${PP.fmt.num(homeDays, homeDays < 10 ? 1 : 0)} days</b><span>how long <i>your</i> AI year would power one U.S. home</span></div></div>
            </div>
          </div>
        </section>

        <section class="r-section">
          <div class="r-head"><span class="r-kicker">05</span><div><h2 class="r-h2">Lighten your print</h2><p class="r-h2-sub">Toggle the changes you’d actually make. Savings are recalculated from your answers.</p></div></div>
          <div class="levers">
            <ul class="lever-list" id="leverList"></ul>
            <div class="lever-sum">
              <span class="ls-label">You’d save each year</span>
              <div class="ls-big" id="lsBig">0 Wh</div>
              <span class="ls-label" id="lsPct">Pick a change to see the impact</span>
              <div class="ls-bars">
                <div class="ls-row"><span>Now</span><div class="ls-track"><div class="ls-fill" style="width:100%;background:var(--s1)"></div></div><span class="num" id="lsNowV"></span></div>
                <div class="ls-row"><span>After</span><div class="ls-track"><div class="ls-fill" id="lsAfter" style="width:100%;background:var(--accent)"></div></div><span class="num" id="lsAfterV"></span></div>
              </div>
            </div>
          </div>
          ${uses.length ? `<h3 class="tips-h">Tips for how you use AI</h3><div class="tips">${uses.slice(0, 4).map(u => `<div class="tip"><span class="tip-ic"><i data-lucide="${TIPS[u][0]}"></i></span><div><b>${TIPS[u][1]}</b><p>${TIPS[u][2]}</p></div></div>`).join('')}</div>` : ''}
        </section>

        ${a.guessEnergy != null || a.guessWater != null ? `
        <section class="r-section">
          <div class="r-head"><span class="r-kicker">06</span><div><h2 class="r-h2">How were your guesses?</h2></div></div>
          <div class="guess-recap">${guessCard(Q[0], a.guessEnergy, 'Energy per prompt')}${guessCard(Q[Q.length - 1], a.guessWater, 'Where the water goes')}</div>
        </section>` : ''}

        <section class="r-section">
          <div class="perspective">
            <div class="persp-ic"><i data-lucide="scale"></i></div>
            <div>
              <h3>Keeping it in perspective</h3>
              <p>Your whole AI year emits about <b>${C.v} ${C.u}</b>. Driving one mile in an average gas car emits ${PP.fmt.num(F.carGPerMile)} g ${PP.cite('epaEq')}. For text-heavy users, AI is a small slice of a personal footprint. Reasoning modes, images and especially video change that fast.</p>
              <p>The bigger story is <b>scale and trajectory</b>. Data-center electricity is on track to more than double by 2030 ${PP.cite('iea')}, and new power plants and cooling towers get built to meet total demand: millions of people making the same small choices.</p>
            </div>
          </div>
        </section>

        <div class="r-ctas">
          <a class="btn btn-primary" href="#/learn"><i data-lucide="chart-no-axes-combined"></i><span>Explore the data</span></a>
          <a class="btn btn-ghost" href="#/stewardship"><i data-lucide="sprout"></i><span>Reflect: Stewardship</span></a>
          <button class="btn btn-ghost" id="copyBtn" type="button"><i data-lucide="copy"></i><span>Copy my results</span></button>
          <button class="btn btn-ghost" id="retakeBtn" type="button"><i data-lucide="rotate-ccw"></i><span>Retake</span></button>
        </div>
      </div>`;
    el.hidden = false;

    const stage = $('#stage');
    let badge = $('.stage-result');
    if (!badge) { badge = document.createElement('div'); badge.className = 'stage-result'; stage.appendChild(badge); }
    badge.innerHTML = `<div class="sr-card">
        <p class="eyebrow"><span class="dot"></span>Your AI year</p>
        <div class="sr-big"><span id="rBig">0</span><span class="sr-unit">${E.u}</span></div>
        <span class="grade" style="--gc:${grade[1]}">${grade[0]}</span>
        <div class="sr-chips">
          <span><i data-lucide="droplet"></i>${Wt.v} ${Wt.u}</span>
          <span><i data-lucide="cloud"></i>${C.v} ${C.u}</span>
          <span><i data-lucide="battery-charging"></i>${PP.fmt.num(phones, 0)} phone charges</span>
        </div>
        <div class="cta-row"><button class="btn btn-primary" id="seeResults" type="button"><span>See the breakdown</span><i data-lucide="arrow-down"></i></button><button class="btn btn-ghost btn-icon" id="retake2" type="button" aria-label="Retake"><i data-lucide="rotate-ccw"></i></button></div>
      </div>`;
    PP.icons();
    $('#seeResults').onclick = () => $('#resultsTop').scrollIntoView({ behavior: 'smooth' });
    $('#retake2').onclick = () => PP.startSurvey();
    $('#retakeBtn').onclick = () => PP.startSurvey();
    $('#copyBtn').onclick = () => {
      const txt = `My AI year on PromptPrint: ${E.v} ${E.u} of electricity, ${Wt.v} ${Wt.u} of water, ${C.v} ${C.u} (≈ ${PP.fmt.num(phones, 0)} phone charges). ${location.href.split('#')[0]}`;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => {
        const s = $('#copyBtn span'); s.textContent = 'Copied!';
        setTimeout(() => { s.textContent = 'Copy my results'; }, 2000);
      }).catch(() => {});
    };
    PP.scene.setLevel(level, 2.2);
    PP.countUp($('#rBig'), E.n, { dec: E.n < 10 ? 2 : E.n < 100 ? 1 : 0, dur: 2.4 });
    if (!PP.reduce) {
      gsap.fromTo('.sr-card', { opacity: 0, y: 30, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .9, ease: 'expo.out' });
      gsap.fromTo('.sr-card > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .08, duration: .6, delay: .15, ease: 'power3.out' });
    }

    el.querySelectorAll('[data-to]').forEach(n => {
      const v = parseFloat(n.dataset.to);
      PP.onVisible(n, () => PP.countUp(n, v, { dec: v < 10 ? 2 : v < 100 ? 1 : 0 }), 0.3);
    });
    el.querySelectorAll('.icon-grid').forEach(g => {
      if (!PP.reduce) gsap.set(g.children, { opacity: 0, scale: .3, y: 10 });
      PP.onVisible(g, () => gsap.to(g.children, { opacity: 1, scale: 1, y: 0, duration: .4, stagger: .025, ease: 'back.out(2)' }), .3);
    });
    PP.onVisible($('#roadFill'), () => {
      const pct = Math.min(96, 10 + Math.log10(Math.max(miles, 0.1) * 10 + 1) * 24);
      gsap.to('#roadFill', { width: pct + '%', duration: 2.2, ease: 'power2.inOut' });
      gsap.to('#roadCar', { left: `calc(${pct}% - 30px)`, duration: 2.2, ease: 'power2.inOut' });
    }, .4);
    const sb = $('#stackbar');
    PP.onVisible(sb, () => sb.querySelectorAll('.sb').forEach((s, i) => gsap.to(s, { width: s.dataset.w + '%', duration: 1.2, delay: i * .1, ease: 'expo.out' })), .4);
    sb.querySelectorAll('.sb').forEach(s => {
      const p = parts.find(x => x.key === s.dataset.k);
      PP.bindTip(s, () => { const e = PP.fmt.energy(p.v); return `<b>${p.label}</b><span class="tt-val">${e.v} ${e.u}/yr · ${PP.fmt.num(p.v / r.yearWh * 100, 1)}%</span>`; });
    });
    PP.table($('#partsTable'), ['Activity', 'Wh / year', 'Share'], parts.map(p => [p.label, PP.fmt.num(p.v, 0), PP.fmt.num(p.v / r.yearWh * 100 || 0, 1) + '%']));

    const mh = $('#miniHomes'), hu = niceUnit(homes, 120), nh = Math.min(120, Math.max(1, Math.round(homes / hu)));
    mh.innerHTML = Array.from({ length: nh }, () => '<i></i>').join('') + `<small>${hu > 1 ? 'each = ' + PP.fmt.num(hu) + ' homes' : 'each = 1 home'}</small>`;
    if (!PP.reduce) { gsap.set(mh.querySelectorAll('i'), { opacity: 0, scale: 0 }); PP.onVisible(mh, () => gsap.to(mh.querySelectorAll('i'), { opacity: 1, scale: 1, stagger: .012, duration: .3, ease: 'back.out(3)' })); }

    const cmp = [
      { label: 'You', value: r.yearWh, highlight: true, color: 'var(--accent)' },
      { label: 'Typical student (illustrative)', value: typ.yearWh },
      { label: 'Charging a phone daily, 1 year', value: F.phoneWh * 365, note: '19 Wh × 365', src: 'epaEq' },
      { label: 'Streaming 1 hr/day, 1 year', value: F.streamWhPerHour * 365, note: '0.077 kWh × 365', src: 'ieaStream' },
      { label: 'Average U.S. home, 1 day', value: F.homeKWhYear * 1000 / 365, note: '12,194 kWh ÷ 365', src: 'epaEq' }
    ].sort((x, y) => x.value - y.value);
    const cmax = Math.pow(10, Math.ceil(Math.log10(Math.max(...cmp.map(c => c.value)) * 1.4)));
    const cmin = Math.pow(10, Math.floor(Math.log10(Math.min(...cmp.map(c => c.value)) / 1.4)));
    const ef = v => { const e = PP.fmt.energy(v); return e.v + ' ' + e.u; };
    PP.hbar($('#chartCompare'), cmp, { log: true, min: cmin, max: cmax, fmt: ef, tickFmt: ef });

    const ll = $('#leverList'), on = new Set();
    const items = PP.LEVERS.map(l => ({ l, save: PP.leverSavings(a, [l.key]) })).sort((x, y) => y.save - x.save);
    ll.innerHTML = items.map(({ l, save }) => {
      const e = PP.fmt.energy(save);
      return `<li class="lever${save < 0.01 ? ' is-zero' : ''}" data-k="${l.key}" role="switch" aria-checked="false" tabindex="0">
        <span class="lv-ic"><i data-lucide="${l.icon}"></i></span><span class="lv-txt"><b>${l.label}</b><small>${l.desc}</small></span>
        <span class="lv-save">${save < 0.01 ? 'already there' : '−' + e.v + ' ' + e.u}</span><span class="switch"></span></li>`;
    }).join('');
    PP.icons();
    const lsState = { v: 0 };
    const updLevers = () => {
      const save = PP.leverSavings(a, [...on]), after = r.yearWh - save;
      gsap.to(lsState, { v: save, duration: .6, ease: 'power2.out', overwrite: true, onUpdate: () => { const e = PP.fmt.energy(lsState.v); $('#lsBig').textContent = e.v + ' ' + e.u; } });
      $('#lsPct').textContent = on.size ? `${PP.fmt.num(save / r.yearWh * 100, 0)}% less energy, water and carbon` : 'Pick a change to see the impact';
      $('#lsAfter').style.width = (after / r.yearWh * 100) + '%';
      $('#lsNowV').textContent = ef(r.yearWh); $('#lsAfterV').textContent = ef(after);
    };
    ll.querySelectorAll('.lever').forEach(li => {
      const t = () => { const k = li.dataset.k; on.has(k) ? on.delete(k) : on.add(k); li.classList.toggle('is-on', on.has(k)); li.setAttribute('aria-checked', on.has(k)); updLevers(); };
      li.onclick = t; li.onkeydown = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); t(); } };
    });
    updLevers();
    document.dispatchEvent(new CustomEvent('pp:results', { detail: a }));
  }

  PP.calcInit = function () {
    $('#startBtn').onclick = () => PP.startSurvey();
  };
})();
