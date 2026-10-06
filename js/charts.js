/* Shared UI + hand-built SVG charts (animated, with tooltips) */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  PP.reduce = reduce;

  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  PP.svgEl = svgEl;

  /* ---------- tooltip ---------- */
  const tip = {
    el: null,
    show(html, e) {
      if (!this.el) this.el = document.getElementById('tooltip');
      this.el.innerHTML = html;
      this.el.hidden = false;
      this.move(e);
    },
    move(e) {
      if (!this.el || this.el.hidden) return;
      const p = e.touches ? e.touches[0] : e;
      const r = this.el.getBoundingClientRect();
      let x = p.clientX + 14, y = p.clientY + 14;
      if (x + r.width > window.innerWidth - 8) x = p.clientX - r.width - 14;
      if (y + r.height > window.innerHeight - 8) y = p.clientY - r.height - 14;
      this.el.style.left = x + 'px';
      this.el.style.top = y + 'px';
    },
    hide() { if (this.el) this.el.hidden = true; }
  };
  PP.tip = tip;

  function bindTip(node, htmlFn) {
    node.addEventListener('pointerenter', e => tip.show(htmlFn(), e));
    node.addEventListener('pointermove', e => tip.move(e));
    node.addEventListener('pointerleave', () => tip.hide());
  }
  PP.bindTip = bindTip;

  /* ---------- visibility + count-up ---------- */
  PP.onVisible = function (el, cb, threshold) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { cb(); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { io.disconnect(); cb(); } });
    }, { threshold: threshold == null ? 0.25 : threshold });
    io.observe(el);
  };

  PP.countUp = function (el, to, o) {
    o = o || {};
    const dec = o.dec || 0, pre = o.prefix || '', suf = o.suffix || '';
    const fmt = v => pre + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    if (reduce) { el.textContent = fmt(to); return; }
    const from = o.from || 0;
    const obj = { v: from };
    gsap.to(obj, { v: to, duration: o.dur || 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(obj.v); } });
  };

  // auto count-ups for [data-count] inside a root
  PP.initCounts = function (root) {
    root.querySelectorAll('[data-count]').forEach(el => {
      PP.onVisible(el, () => PP.countUp(el, parseFloat(el.dataset.count), {
        dec: parseInt(el.dataset.dec || '0', 10), prefix: el.dataset.prefix || '', suffix: el.dataset.suffix || ''
      }), 0.4);
    });
  };

  // inline source chips: <span class="src" data-src="key">
  PP.initSrc = function (root) {
    root.querySelectorAll('.src[data-src]').forEach(el => {
      if (el.dataset.done) return;
      el.dataset.done = 1;
      el.innerHTML = PP.cite(el.dataset.src);
    });
  };

  function debounce(fn, ms) { let t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }

  /* ---------- horizontal bar chart (linear or log) ---------- */
  PP.hbar = function (el, data, opts) {
    opts = Object.assign({ log: false, min: 0, max: null, fmt: v => PP.fmt.num(v), refs: [], ticks: null, tickFmt: null, unit: '' }, opts);
    let animated = false, showRefs = true;

    function render(animate) {
      el.innerHTML = '';
      const W = Math.max(300, el.clientWidth);
      const narrow = W < 560;
      const labelW = narrow ? 0 : Math.min(230, W * 0.32);
      const rowH = narrow ? 52 : 40, barH = 18, top = 34, right = 70;
      const H = top + data.length * rowH + 8;
      const plotW = W - labelW - right;
      const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, height: H, role: 'presentation' }, el);
      const max = opts.max || Math.max(...data.map(d => d.value)) * 1.05;
      const min = opts.log ? opts.min : 0;
      const x = v => {
        if (opts.log) {
          const lv = Math.log10(Math.max(v, min));
          return labelW + (lv - Math.log10(min)) / (Math.log10(max) - Math.log10(min)) * plotW;
        }
        return labelW + (v - min) / (max - min) * plotW;
      };
      // grid + ticks
      const ticks = opts.ticks || (opts.log ? (() => { const t = []; for (let p = Math.ceil(Math.log10(min)); Math.pow(10, p) <= max; p++) t.push(Math.pow(10, p)); return t; })() : [0, max * .25, max * .5, max * .75, max]);
      ticks.forEach(t => {
        const gx = x(t);
        svgEl('line', { x1: gx, x2: gx, y1: top - 6, y2: H - 4, stroke: 'var(--grid)', 'stroke-width': 1 }, svg);
        const tx = svgEl('text', { x: gx, y: top - 14, 'text-anchor': 'middle', fill: 'var(--muted)', 'font-size': 11, style: 'font-variant-numeric: tabular-nums' }, svg);
        tx.textContent = opts.tickFmt ? opts.tickFmt(t) : PP.fmt.num(t);
      });
      // reference lines
      const refG = svgEl('g', { class: 'refs', opacity: showRefs ? 1 : 0 }, svg);
      opts.refs.forEach((r, i) => {
        const rx = x(r.value);
        svgEl('line', { x1: rx, x2: rx, y1: top - 4, y2: H - 4, stroke: 'var(--energy)', 'stroke-width': 1, 'stroke-opacity': .6 }, refG);
        const lbl = svgEl('text', { x: rx + 5, y: H - 8 - i * 14, fill: 'var(--energy)', 'font-size': 10.5, opacity: .9 }, refG);
        lbl.textContent = r.label;
      });
      el._refG = refG;
      // baseline
      svgEl('line', { x1: labelW, x2: labelW, y1: top - 6, y2: H - 4, stroke: 'var(--axis)', 'stroke-width': 1 }, svg);

      data.forEach((d, i) => {
        const y0 = top + i * rowH;
        const by = narrow ? y0 + 24 : y0 + (rowH - barH) / 2;
        const g = svgEl('g', { class: 'row' }, svg);
        const lx = narrow ? labelW : labelW - 12;
        const lt = svgEl('text', { x: lx, y: narrow ? y0 + 15 : by + barH / 2 + 4, 'text-anchor': narrow ? 'start' : 'end', fill: d.highlight ? 'var(--ink)' : 'var(--ink-2)', 'font-size': 12.5, 'font-weight': d.highlight ? 600 : 400 }, g);
        lt.textContent = d.label;
        const w = Math.max(2, x(d.value) - labelW);
        const barD = ww => { ww = Math.max(.5, ww); const r = Math.min(4, ww / 2); return `M${labelW},${by} h${ww - r} a${r},${r} 0 0 1 ${r},${r} v${barH - 2 * r} a${r},${r} 0 0 1 -${r},${r} h-${ww - r} z`; };
        const bar = svgEl('path', { d: barD(w), fill: d.color || (d.highlight ? 'var(--accent)' : 'var(--s1)'), opacity: d.dim ? .45 : 1 }, g);
        const vt = svgEl('text', { x: labelW + w + 8, y: by + barH / 2 + 4, fill: 'var(--ink)', 'font-size': 12, 'font-weight': 600, style: 'font-variant-numeric: tabular-nums' }, g);
        vt.textContent = opts.fmt(d.value);
        const hit = svgEl('rect', { x: 0, y: y0, width: W, height: rowH, fill: 'transparent' }, g);
        bindTip(hit, () => `<b>${d.label}</b><span class="tt-val">${opts.fmt(d.value)}</span>${d.note ? '<br>' + d.note : ''}${d.src ? '<br><small>' + PP.SOURCES[d.src].cite + '</small>' : ''}`);
        hit.addEventListener('pointerenter', () => { bar.style.opacity = .8; });
        hit.addEventListener('pointerleave', () => { bar.style.opacity = ''; });
        if (animate && !reduce) {
          const prog = { p: 0 }; bar.setAttribute('d', barD(0));
          gsap.to(prog, { p: 1, duration: 1.1, delay: i * 0.09, ease: 'power3.out', onUpdate: () => bar.setAttribute('d', barD(w * prog.p)) });
          gsap.fromTo(vt, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: .5, delay: .6 + i * 0.09 });
        }
      });
    }
    render(false);
    el.style.opacity = 0;
    PP.onVisible(el, () => { el.style.opacity = 1; animated = true; render(true); }, 0.3);
    window.addEventListener('resize', debounce(() => { if (el.offsetParent) render(false); }, 200));
    return {
      toggleRefs(on) { showRefs = on; if (el._refG) gsap.to(el._refG, { opacity: on ? 1 : 0, duration: .4 }); },
      rerender() { render(!animated); animated = true; el.style.opacity = 1; }
    };
  };

  /* ---------- column chart with projection ranges ---------- */
  PP.cols = function (el, data, opts) {
    opts = Object.assign({ max: null, unit: 'TWh' }, opts);
    let animated = false;
    function render(animate) {
      el.innerHTML = '';
      const W = Math.max(280, el.clientWidth), H = 260;
      const left = 40, right = 10, top = 24, bottom = 34;
      const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, height: H }, el);
      const max = opts.max || Math.max(...data.map(d => d.hi || d.value)) * 1.1;
      const y = v => top + (1 - v / max) * (H - top - bottom);
      const step = (W - left - right) / data.length;
      const cw = Math.min(24, step * 0.4);
      const ticks = opts.ticks || [0, max / 2, max];
      ticks.forEach(t => {
        svgEl('line', { x1: left, x2: W - right, y1: y(t), y2: y(t), stroke: t === 0 ? 'var(--axis)' : 'var(--grid)', 'stroke-width': 1 }, svg);
        const tx = svgEl('text', { x: left - 8, y: y(t) + 4, 'text-anchor': 'end', fill: 'var(--muted)', 'font-size': 11, style: 'font-variant-numeric: tabular-nums' }, svg);
        tx.textContent = PP.fmt.num(t, 0);
      });
      data.forEach((d, i) => {
        const cx = left + step * i + step / 2;
        const g = svgEl('g', {}, svg);
        const lab = svgEl('text', { x: cx, y: H - 12, 'text-anchor': 'middle', fill: 'var(--ink-2)', 'font-size': 12 }, g);
        lab.textContent = d.label;
        // every shape is drawn by draw(p), p = 0..1 grow progress, so animation never relies on SVG transforms
        const base = H - bottom, x0 = cx - cw / 2;
        const colD = (v) => { const h = Math.max(0, base - y(v)), r = Math.min(4, h); return `M${x0},${base} v-${h - r} a${r},${r} 0 0 1 ${r},-${r} h${cw - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${h - r} z`; };
        let draw, valText;
        if (d.hi != null) {
          // projection range: solid up to the low case, a lighter wash from low to high, with caps
          const solid = svgEl('path', { fill: 'var(--s1)', 'fill-opacity': .55 }, g);
          const wash = svgEl('rect', { x: x0, width: cw, rx: 4, fill: 'var(--s1)', 'fill-opacity': .25 }, g);
          const capLo = svgEl('line', { x1: x0 - 4, x2: x0 + cw + 4, stroke: 'var(--s1)', 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
          const capHi = svgEl('line', { x1: x0 - 4, x2: x0 + cw + 4, stroke: 'var(--s1)', 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
          draw = p => {
            const lo = d.lo * p, hi = d.hi * p;
            solid.setAttribute('d', colD(lo));
            wash.setAttribute('y', y(hi)); wash.setAttribute('height', Math.max(0, y(lo) - y(hi)));
            capLo.setAttribute('y1', y(lo)); capLo.setAttribute('y2', y(lo));
            capHi.setAttribute('y1', y(hi)); capHi.setAttribute('y2', y(hi));
          };
          valText = svgEl('text', { x: cx, y: y(d.hi) - 10, 'text-anchor': 'middle', fill: 'var(--ink)', 'font-size': 12, 'font-weight': 600 }, g);
          valText.textContent = PP.fmt.num(d.lo, 0) + '–' + PP.fmt.num(d.hi, 0);
        } else {
          const bar = svgEl('path', { fill: 'var(--s1)', 'fill-opacity': d.projected ? .55 : 1 }, g);
          draw = p => bar.setAttribute('d', colD(d.value * p));
          valText = svgEl('text', { x: cx, y: y(d.value) - 10, 'text-anchor': 'middle', fill: 'var(--ink)', 'font-size': 12, 'font-weight': 600 }, g);
          valText.textContent = (d.approx ? '~' : '') + PP.fmt.num(d.value, 0);
        }
        draw(1);
        if (d.projected || d.hi != null) {
          const pt = svgEl('text', { x: cx, y: H - 0, 'text-anchor': 'middle', fill: 'var(--muted)', 'font-size': 9.5, 'letter-spacing': '.06em' }, g);
          pt.textContent = 'PROJECTED';
        }
        const hit = svgEl('rect', { x: cx - step / 2, y: top, width: step, height: H - top - bottom, fill: 'transparent' }, g);
        bindTip(hit, () => `<b>${d.label}${d.projected || d.hi != null ? ' (projected)' : ''}</b><span class="tt-val">${d.hi != null ? PP.fmt.num(d.lo, 0) + '–' + PP.fmt.num(d.hi, 0) : (d.approx ? '~' : '') + PP.fmt.num(d.value, 0)} ${opts.unit}</span>${d.note ? '<br>' + d.note : ''}`);
        if (animate && !reduce) {
          const prog = { p: 0 }; draw(0);
          gsap.to(prog, { p: 1, duration: 1.1, delay: i * .15, ease: 'power3.out', onUpdate: () => draw(prog.p) });
          gsap.fromTo(valText, { opacity: 0 }, { opacity: 1, duration: .4, delay: .7 + i * .15 });
        }
      });
    }
    render(false);
    el.style.opacity = 0;
    PP.onVisible(el, () => { el.style.opacity = 1; animated = true; render(true); }, 0.3);
    window.addEventListener('resize', debounce(() => { if (el.offsetParent) render(false); }, 200));
    return { rerender() { render(!animated); animated = true; el.style.opacity = 1; } };
  };

  PP.table = function (el, head, rows) {
    el.innerHTML = '<table class="dtable"><thead><tr>' + head.map((h, i) => `<th${i ? ' class="num"' : ''}>${h}</th>`).join('') +
      '</tr></thead><tbody>' + rows.map(r => '<tr>' + r.map((c, i) => `<td${i && i < r.length ? ' class="num"' : ''}>${c}</td>`).join('') + '</tr>').join('') + '</tbody></table>';
  };

  PP.icons = function () { if (window.lucide) lucide.createIcons(); };
})();
