/* Router, tab indicator, method page, boot */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  gsap.registerPlugin(MotionPathPlugin);

  const VIEWS = ['calculate', 'learn', 'stewardship', 'method'];
  PP.route = null;

  function moveInk() {
    const a = document.querySelector('.tabs a.is-active'), ink = $('#tabInk');
    if (!a) return;
    ink.style.left = a.offsetLeft + 'px';
    ink.style.width = a.offsetWidth + 'px';
  }

  function show(view, opts) {
    if (!VIEWS.includes(view)) view = 'calculate';
    const prev = PP.route;
    PP.route = view;
    document.querySelectorAll('.tabs a').forEach(a => {
      const on = a.dataset.view === view;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    moveInk();
    document.body.dataset.view = view;
    if (prev !== view) {
      VIEWS.forEach(v => { $('#view-' + v).hidden = v !== view; });
      window.scrollTo(0, 0);
      const el = $('#view-' + view);
      if (!PP.reduce && prev) gsap.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .55, ease: 'power3.out', clearProps: 'transform' });
      document.title = { calculate: 'PromptPrint', learn: 'Learn · PromptPrint', stewardship: 'Stewardship · PromptPrint', method: 'Method · PromptPrint' }[view];
    }
    if (view === 'learn') PP.learnInit();
    if (view === 'stewardship') PP.stewardInit();
    if (opts && opts.start) PP.startSurvey();
  }

  function route() {
    const h = location.hash;
    if (!h || h === '#') return show('calculate');
    if (h.startsWith('#/')) return show(h.slice(2).split('?')[0]);
    // in-page anchor: stay on current view
    if (!PP.route) show('calculate');
  }

  function method() {
    const F = PP.F;
    const rows = [
      ['Short chatbot prompt', F.chatWh + ' Wh', 'Typical text prompt, GPT-4o class. Cross-checked: Google 0.24 Wh, OpenAI 0.34 Wh.', ['epoch', 'google', 'altman']],
      ['Long-input prompt', F.longWh + ' Wh', 'Prompt carrying ~10,000 tokens of pasted text; also used for coding-assistant requests.', ['epoch']],
      ['Reasoning prompt', F.reasonWh + ' Wh', 'o3, medium-length prompt, full infrastructure overhead.', ['jegham']],
      ['AI search answer', F.searchWh + ' Wh', 'Google’s median Gemini Apps text prompt.', ['google']],
      ['AI image', F.imageWh + ' Wh', 'Median across image-generation models (1.35 kWh per 1,000).', ['luccioni']],
      ['5-second AI video', PP.fmt.num(F.videoWh) + ' Wh', '3.4 million joules for a 5-second, 16 fps clip.', ['mittr']],
      ['Model size factor', '×0.5 / ×1 / ×2.2', 'Ratios of GPT-4.1 nano (0.207 Wh) and Claude 3.7 Sonnet (0.950 Wh) to GPT-4o (0.423 Wh), short prompts.', ['jegham']],
      ['Water intensity', F.waterMlPerWh + ' mL / Wh', '0.550 L/kWh on-site cooling + 3.142 L/kWh to generate electricity, U.S. average.', ['li']],
      ['Carbon intensity', F.co2gPerWh + ' g CO₂ / Wh', 'U.S. average output emission rate, 767.2 lb/MWh.', ['egrid']],
      ['Smartphone charge', F.phoneWh + ' Wh', 'Equivalency for results.', ['epaEq']],
      ['Car mile', F.carGPerMile + ' g CO₂', 'Average gasoline passenger vehicle.', ['epaEq']],
      ['Hour of streaming', F.streamWhPerHour + ' Wh', 'Central 2019 estimate incl. networks and devices.', ['ieaStream']],
      ['U.S. home, yearly', PP.fmt.num(F.homeKWhYear) + ' kWh', 'Average delivered electricity per home.', ['epaEq']],
      ['U.S. college students', '19.4 million', 'Total postsecondary enrollment, fall 2025.', ['nsc']]
    ];
    $('#factorTable').innerHTML = '<thead><tr><th>Factor</th><th>Value</th><th>What it represents</th><th>Source</th></tr></thead><tbody>' +
      rows.map(r => `<tr><td>${r[0]}</td><td class="num">${r[1]}</td><td>${r[2]}</td><td>${r[3].map(k => PP.cite(k)).join('<br>')}</td></tr>`).join('') + '</tbody>';
    $('#refs').innerHTML = Object.keys(PP.SOURCES).map(k => {
      const s = PP.SOURCES[k];
      return `<li><b>${s.cite}.</b> <a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></li>`;
    }).join('');
  }

  function boot() {
    PP.scene.mount($('#sceneWrap'));
    PP.calcInit();
    method();
    PP.initSrc(document);
    PP.icons();
    document.addEventListener('click', e => {
      const a = e.target.closest('[data-start]');
      if (!a) return;
      e.preventDefault();
      if (location.hash !== '#/calculate') history.pushState(null, '', '#/calculate');
      show('calculate', { start: true });
    });
    window.addEventListener('hashchange', route);
    window.addEventListener('resize', moveInk);
    route();
    if (!PP.reduce && PP.route === 'calculate') {
      gsap.from('.landing > *', { opacity: 0, y: 30, stagger: .09, duration: 1, ease: 'power3.out', delay: .15 });
      gsap.from('.topbar', { y: -20, opacity: 0, duration: .8, ease: 'power3.out' });
    }
    document.fonts && document.fonts.ready.then(moveInk);
    // ?y=1200 jumps to a scroll position (handy for previews and screenshots)
    const y = new URLSearchParams(location.search).get('y');
    if (y) setTimeout(() => window.scrollTo({ top: +y, behavior: 'instant' }), 400);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
