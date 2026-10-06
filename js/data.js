/* PromptPrint: every number on the site lives here, with its source.
   Change a factor here and the calculator, charts and methodology table all update. */
window.PP = window.PP || {};

PP.SOURCES = {
  epoch:    { cite: 'Epoch AI (2025)', title: 'How much energy does ChatGPT use?', url: 'https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use' },
  google:   { cite: 'Google (2025)', title: 'Measuring the environmental impact of AI inference (median Gemini Apps text prompt)', url: 'https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference' },
  altman:   { cite: 'Altman (2025)', title: 'The Gentle Singularity (average ChatGPT query)', url: 'https://blog.samaltman.com/the-gentle-singularity' },
  jegham:   { cite: 'Jegham et al. (2025)', title: 'How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference', url: 'https://arxiv.org/abs/2505.09598' },
  luccioni: { cite: 'Luccioni, Jernite & Strubell (2024)', title: 'Power Hungry Processing: Watts Driving the Cost of AI Deployment?', url: 'https://arxiv.org/abs/2311.16863' },
  mittr:    { cite: 'MIT Technology Review (2025)', title: 'We did the math on AI’s energy footprint', url: 'https://www.technologyreview.com/2025/05/20/1116327/ai-energy-usage-climate-footprint-big-tech/' },
  li:       { cite: 'Li, Yang, Islam & Ren (2023, rev. 2025)', title: 'Making AI Less “Thirsty”: Uncovering and Addressing the Secret Water Footprint of AI Models', url: 'https://arxiv.org/abs/2304.03271' },
  egrid:    { cite: 'U.S. EPA eGRID2023', title: 'eGRID summary data: U.S. average CO₂ output emission rate, 767.2 lb/MWh', url: 'https://www.epa.gov/egrid/summary-data' },
  epaEq:    { cite: 'U.S. EPA', title: 'Greenhouse Gas Equivalencies Calculator: Calculations and References', url: 'https://www.epa.gov/energy/greenhouse-gases-equivalencies-calculator-calculations-and-references' },
  iea:      { cite: 'International Energy Agency (2025)', title: 'Energy and AI: Executive Summary', url: 'https://www.iea.org/reports/energy-and-ai/executive-summary' },
  ieaStream:{ cite: 'IEA (2020)', title: 'The carbon footprint of streaming video: fact-checking the headlines', url: 'https://www.iea.org/commentaries/the-carbon-footprint-of-streaming-video-fact-checking-the-headlines' },
  lbnl:     { cite: 'Lawrence Berkeley National Laboratory (2024)', title: '2024 United States Data Center Energy Usage Report', url: 'https://eta-publications.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report' },
  unu:      { cite: 'UN University INWEH (2026)', title: 'AI’s environmental costs threaten water, land and climate (UNRIC summary)', url: 'https://unric.org/en/ais-environmental-costs-threaten-water-land-and-climate/' },
  patterson:{ cite: 'Patterson et al. (2021)', title: 'Carbon Emissions and Large Neural Network Training', url: 'https://arxiv.org/abs/2104.10350' },
  wang:     { cite: 'Wang et al., Nature Computational Science (2024)', title: 'E-waste challenges of generative artificial intelligence', url: 'https://www.nature.com/articles/s43588-024-00712-6' },
  googleEnv:{ cite: 'Google (2024)', title: '2024 Environmental Report', url: 'https://www.gstatic.com/gumdrop/sustainability/google-2024-environmental-report.pdf' },
  msEnv:    { cite: 'Microsoft (2024)', title: '2024 Environmental Sustainability Report', url: 'https://www.microsoft.com/en-us/corporate-responsibility/sustainability/report' },
  gallup:   { cite: 'Lumina Foundation–Gallup (2026)', title: 'AI use routine for college students despite campus limits', url: 'https://news.gallup.com/poll/704090/routine-college-students-despite-campus-limits.aspx' },
  dec:      { cite: 'Digital Education Council (2024)', title: 'Global AI Student Survey 2024', url: 'https://www.digitaleducationcouncil.com/post/digital-education-council-global-ai-student-survey-2024' },
  hepi:     { cite: 'HEPI & Kortext (2025)', title: 'Student Generative AI Survey 2025', url: 'https://www.hepi.ac.uk/2025/02/26/student-generative-ai-survey-2025/' },
  nsc:      { cite: 'National Student Clearinghouse (2026)', title: 'Fall 2025 enrollment estimates', url: 'https://nscresearchcenter.org/final-fall-enrollment-trends/' },
  search09: { cite: 'Google (2009)', title: 'Powering a Google search', url: 'https://googleblog.blogspot.com/2009/01/powering-google-search.html' },
  // Stewardship tab
  mh:       { cite: 'Leo XIV, Magnifica Humanitas (2026)', title: 'Encyclical on Safeguarding the Human Person in the Time of Artificial Intelligence', url: 'https://www.vatican.va/content/leo-xiv/en/encyclicals/documents/20260515-magnifica-humanitas.html' },
  aen:      { cite: 'Antiqua et Nova (2025)', title: 'Note on the Relationship Between Artificial Intelligence and Human Intelligence', url: 'https://www.vatican.va/roman_curia/congregations/cfaith/documents/rc_ddf_doc_20250128_antiqua-et-nova_en.html' },
  ls:       { cite: 'Francis, Laudato Si’ (2015)', title: 'Encyclical on Care for Our Common Home', url: 'https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20150524_enciclica-laudato-si.html' },
  mm:       { cite: 'John XXIII, Mater et Magistra (1961)', title: 'Encyclical on Christianity and Social Progress (§236: look, judge, act)', url: 'https://www.vatican.va/content/john-xxiii/en/encyclicals/documents/hf_j-xxiii_enc_15051961_mater.html' },
  compendium:{ cite: 'Compendium of the Social Doctrine of the Church (2004)', title: '§160: the permanent principles of the Church’s social doctrine', url: 'https://www.vatican.va/roman_curia/pontifical_councils/justpeace/documents/rc_pc_justpeace_doc_20060526_compendio-dott-soc_en.html' },
  vnMH:     { cite: 'Vatican News (2026)', title: 'Pope Leo’s ‘Magnifica humanitas’: AI must serve humanity not concentrate power', url: 'https://www.vaticannews.va/en/pope/news/2026-05/pope-leo-xiv-encyclical-magnifica-humanitas-ai.html' }
};

/* Per-activity energy (Wh, at the data center, incl. cooling & overhead) */
PP.F = {
  chatWh: 0.3,        // typical chatbot prompt, GPT-4o class (Epoch AI); cf. Google 0.24, Altman 0.34
  longWh: 2.5,        // prompt carrying ~10k tokens of pasted input (Epoch AI)
  reasonWh: 5.15,     // reasoning model (o3), medium prompt (Jegham et al. 2025)
  searchWh: 0.24,     // one AI answer in search, using Google's median Gemini text prompt (Google 2025)
  imageWh: 1.35,      // one AI image, median across models: 1.35 kWh per 1,000 (Luccioni et al.)
  videoWh: 944,       // one ~5-second AI video clip, 3.4 MJ (MIT Technology Review)
  tier: { small: 0.5, standard: 1, large: 2.2 }, // GPT-4.1 nano 0.207 Wh / GPT-4o 0.423 / Claude 3.7 Sonnet 0.950, short prompts (Jegham)
  waterMlPerWh: 3.692, // 0.550 L/kWh on-site cooling + 3.142 L/kWh to generate the power, U.S. avg (Li et al.)
  co2gPerWh: 0.348,    // 767.2 lb CO2/MWh, U.S. grid avg (EPA eGRID2023)
  // comparisons
  phoneWh: 19,          // one smartphone charge: 0.019 kWh (EPA)
  carGPerMile: 393,     // avg gasoline car: 3.93e-4 t CO2e/mile (EPA)
  streamWhPerHour: 77,  // one hour of streaming video: 0.077 kWh (IEA 2020)
  googleWh: 0.3,        // one classic Google search (Google 2009)
  ledW: 10,             // a typical LED bulb (~60 W-equivalent)
  bottleMl: 500,
  homeKWhYear: 12194,   // avg U.S. home (EPA, 2022 data)
  usStudents: 19.4e6    // U.S. postsecondary enrollment, fall 2025 (NSC)
};

/* The survey. Types: guess | multi | choice | slider. Each writes PP.answers[key]. */
PP.QUESTIONS = [
  {
    key: 'guessEnergy', cat: 0, type: 'guess',
    title: 'Warm-up: how much electricity do you think one AI prompt uses?',
    sub: 'Go with your gut. We’ll show you the research.',
    options: [
      { label: 'A camera flash', hint: '≈ 0.003 Wh', value: 0.003, icon: 'zap' },
      { label: 'An LED bulb for ~2 minutes', hint: '≈ 0.3 Wh', value: 0.3, icon: 'lightbulb', correct: true },
      { label: 'A full phone charge', hint: '≈ 19 Wh', value: 19, icon: 'battery-charging' },
      { label: 'A microwave for 10 minutes', hint: '≈ 170 Wh', value: 170, icon: 'microwave' }
    ],
    reveal: 'A typical text prompt is about <b>0.3 Wh</b>. Google measured 0.24 Wh for its median Gemini prompt; OpenAI reports 0.34 Wh. The catch: long inputs, reasoning modes, images and video cost far more. That’s what the next questions measure.',
    fact: { text: 'Older headlines said ~3 Wh per ChatGPT query. Newer hardware and better measurement put a typical prompt nearer 0.3 Wh, about the same as a 2009 Google search.', src: 'epoch' }
  },
  {
    key: 'uses', cat: 0, type: 'multi',
    title: 'What do you use AI for?',
    sub: 'Pick everything that applies. We’ll tailor your tips to it.',
    options: [
      { label: 'Writing & essays', value: 'writing', icon: 'pen-line' },
      { label: 'Studying & explanations', value: 'study', icon: 'book-open' },
      { label: 'Coding', value: 'coding', icon: 'code-xml' },
      { label: 'Research & sources', value: 'research', icon: 'search' },
      { label: 'Brainstorming', value: 'ideas', icon: 'sparkles' },
      { label: 'Images & design', value: 'images', icon: 'image' },
      { label: 'Personal & fun', value: 'fun', icon: 'smile' },
      { label: 'Job & internship prep', value: 'career', icon: 'briefcase' }
    ],
    def: ['study', 'writing'],
    fact: { text: 'Globally, 86% of students say they use AI in their studies, averaging more than two different tools each.', src: 'dec' }
  },
  {
    key: 'days', cat: 0, type: 'choice',
    title: 'How many days a week do you use an AI chatbot?',
    sub: 'ChatGPT, Gemini, Claude, Copilot, Perplexity… any of them count.',
    options: [
      { label: 'Rarely', hint: 'less than once a week', value: 0.5, icon: 'moon' },
      { label: '1–2 days', hint: 'when an assignment calls for it', value: 1.5, icon: 'calendar' },
      { label: '3–4 days', hint: 'a regular study tool', value: 3.5, icon: 'calendar-range' },
      { label: '5–6 days', hint: 'most of the week', value: 5.5, icon: 'calendar-days' },
      { label: 'Every day', hint: 'always open in a tab', value: 7, icon: 'infinity' }
    ],
    def: 3.5,
    fact: { text: 'In a 2026 Lumina–Gallup study, 57% of U.S. college students used AI for coursework at least weekly, about one in five daily.', src: 'gallup' }
  },
  {
    key: 'perDay', cat: 0, type: 'slider',
    title: 'On those days, how many prompts do you send?',
    sub: 'Count every message. A back-and-forth study session adds up fast.',
    min: 1, max: 100, step: 1, def: 12, unit: 'prompts / day',
    marks: [[1, 'one quick question'], [10, 'a study session'], [30, 'a full essay draft'], [60, 'all-day companion'], [100, 'power user']],
    fact: { text: 'A typical chatbot prompt uses about 0.3 Wh: roughly a 10-watt LED bulb running for two minutes.', src: 'epoch' }
  },
  {
    key: 'tier', cat: 0, type: 'choice',
    title: 'Which kind of model do you usually pick?',
    sub: 'Most apps have a model menu. Not sure? Choose “Whatever’s default”.',
    options: [
      { label: 'Lightweight', hint: '“mini”, “flash”, “nano” models', value: 'small', icon: 'feather' },
      { label: 'Whatever’s default', hint: 'I never change it', value: 'standard', icon: 'circle-dot' },
      { label: 'The biggest model', hint: 'premium / “pro” tier', value: 'large', icon: 'mountain' }
    ],
    def: 'standard',
    fact: { text: 'Model size matters: in one benchmark a short prompt took 0.21 Wh on GPT-4.1 nano, 0.42 Wh on GPT-4o and 0.95 Wh on Claude 3.7 Sonnet.', src: 'jegham' }
  },
  {
    key: 'longShare', cat: 1, type: 'choice',
    title: 'How often do you paste in long material?',
    sub: 'Readings, PDFs, lecture transcripts, whole code files, long essays to review.',
    options: [
      { label: 'Never', hint: 'short questions only', value: 0, icon: 'message-circle' },
      { label: 'Sometimes', hint: '~1 in 10 prompts', value: 0.1, icon: 'file-text' },
      { label: 'Often', hint: '~3 in 10 prompts', value: 0.3, icon: 'files' },
      { label: 'Almost always', hint: '~6 in 10 prompts', value: 0.6, icon: 'library' }
    ],
    def: 0.1,
    fact: { text: 'Input length matters: a prompt carrying ~10,000 tokens of pasted text needs roughly 2.5 Wh, about 8× a short question.', src: 'epoch' }
  },
  {
    key: 'redo', cat: 1, type: 'choice',
    title: 'How often do you hit “regenerate” or re-ask the same thing?',
    sub: 'Every retry is a brand-new request to the data center.',
    options: [
      { label: 'Rarely', hint: 'first answer is usually fine', value: 1.0, icon: 'check' },
      { label: 'Sometimes', hint: '~1 retry per 10 prompts', value: 1.1, icon: 'refresh-cw' },
      { label: 'Often', hint: '~1 retry per 4 prompts', value: 1.25, icon: 'repeat' },
      { label: 'Constantly', hint: 'I reroll until it’s perfect', value: 1.5, icon: 'dices' }
    ],
    def: 1.1,
    fact: { text: 'Retries add up one-for-one: there is no “free” draft. A clearer first prompt is the cheapest efficiency gain there is.', src: 'epoch' }
  },
  {
    key: 'reason', cat: 1, type: 'slider',
    title: 'How many “think longer” or reasoning prompts per week?',
    sub: 'Reasoning modes, “thinking” models, deep-research style requests.',
    min: 0, max: 60, step: 1, def: 3, unit: 'per week',
    marks: [[0, 'never'], [5, 'a hard problem set'], [20, 'my default'], [60, 'everything']],
    fact: { text: 'Reasoning models write long hidden chains of thought. A medium-length o3 query was benchmarked at ~5.2 Wh, about 17× a standard prompt.', src: 'jegham' }
  },
  {
    key: 'code', cat: 1, type: 'slider',
    title: 'How many coding-assistant requests do you make per week?',
    sub: 'Copilot, Cursor, Claude Code, ChatGPT on your code… each completion, chat or agent step.',
    min: 0, max: 300, step: 5, def: 0, unit: 'requests / week',
    marks: [[0, 'I don’t code'], [20, 'a CS assignment'], [100, 'side project'], [300, 'agent all day']],
    fact: { text: 'Coding tools send your surrounding files along with every request, so each one behaves like a long-input prompt (~2.5 Wh).', src: 'epoch' }
  },
  {
    key: 'search', cat: 2, type: 'slider',
    title: 'How many of your daily web searches show an AI summary?',
    sub: 'AI Overviews, Copilot answers, Perplexity: AI that answers before you click.',
    min: 0, max: 40, step: 1, def: 4, unit: 'per day',
    marks: [[0, 'none'], [5, 'a few'], [15, 'most of them'], [40, 'I live in search']],
    fact: { text: 'Google measured its median Gemini text prompt at 0.24 Wh and 0.26 mL of on-site water, about five drops.', src: 'google' }
  },
  {
    key: 'apps', cat: 2, type: 'slider',
    title: 'How many messages do you send to AI built into other apps?',
    sub: 'Snapchat My AI, Meta AI in Instagram, Notion or Grammarly AI, email “help me write”…',
    min: 0, max: 150, step: 1, def: 5, unit: 'per week',
    marks: [[0, 'none'], [10, 'occasionally'], [50, 'daily chats'], [150, 'constantly']],
    fact: { text: 'AI is increasingly built into tools you already use, so a lot of usage doesn’t feel like “using AI” at all.', src: 'iea' }
  },
  {
    key: 'images', cat: 2, type: 'slider',
    title: 'How many AI images do you generate per week?',
    sub: 'Slides, posters, memes, profile pics, “make it Ghibli”…',
    min: 0, max: 100, step: 1, def: 2, unit: 'images / week',
    marks: [[0, 'none'], [5, 'a slide deck'], [25, 'creative hobby'], [100, 'meme factory']],
    fact: { text: 'Across 88 models, image generation was the most energy-hungry task tested: a median ~1.35 Wh per image, and up to ~11 Wh for the least efficient model.', src: 'luccioni' }
  },
  {
    key: 'videos', cat: 2, type: 'slider',
    title: 'How many short AI video clips do you make per week?',
    sub: 'Each ~5-second clip from a text-to-video tool.',
    min: 0, max: 20, step: 1, def: 0, unit: 'clips / week',
    marks: [[0, 'none'], [2, 'just trying it'], [10, 'content creator'], [20, 'video studio']],
    fact: { text: 'One 5-second AI video took ~3.4 million joules (944 Wh) in MIT Technology Review’s tests, more than 3,000 text prompts’ worth.', src: 'mittr' }
  },
  {
    key: 'weeks', cat: 3, type: 'choice',
    title: 'Do you keep using AI over breaks and summer?',
    sub: 'This sets how many weeks a year your habits run.',
    options: [
      { label: 'School weeks only', hint: '~32 weeks / year', value: 32, icon: 'graduation-cap' },
      { label: 'A bit less on breaks', hint: '~42 weeks / year', value: 42, icon: 'sun' },
      { label: 'Same all year', hint: '52 weeks / year', value: 52, icon: 'globe' }
    ],
    def: 32,
    fact: { text: 'About 19.4 million students were enrolled in U.S. colleges in fall 2025. Small habits multiplied by that many people become infrastructure.', src: 'nsc' }
  },
  {
    key: 'guessWater', cat: 3, type: 'guess',
    title: 'Last one: where does most of AI’s water footprint come from?',
    sub: 'Think about the whole chain, not just the building.',
    options: [
      { label: 'Cooling the servers', hint: 'evaporating in cooling towers', value: 'cooling', icon: 'thermometer-snowflake' },
      { label: 'Generating the electricity', hint: 'power plants upstream', value: 'power', icon: 'factory', correct: true },
      { label: 'Making the chips', hint: 'semiconductor fabs', value: 'chips', icon: 'cpu' },
      { label: 'It’s basically zero', hint: 'closed-loop everything', value: 'zero', icon: 'circle-off' }
    ],
    reveal: 'Mostly <b>the power plants</b>. In U.S.-average conditions, cooling evaporates about 0.55 L per kWh on site, but generating that kWh consumes about 3.1 L more, roughly 85% of the total. (Chip-making water is real too, but it’s spread over a chip’s whole life.)',
    fact: { text: 'Many data-center water figures count only on-site cooling. Including the water consumed to generate the power multiplies the footprint several times.', src: 'li' }
  }
];

PP.CATS = ['Habits', 'Prompts', 'Everywhere', 'Your year'];

/* An illustrative "typical student", built from the survey defaults */
PP.TYPICAL = { days: 3.5, perDay: 12, tier: 'standard', longShare: 0.1, redo: 1.1, reason: 3, code: 0, search: 4, apps: 5, images: 2, videos: 0, weeks: 32 };

PP.compute = function (a) {
  const tier = PP.F.tier[a.tier] || 1;
  const prompts = a.days * a.perDay * a.redo;                 // chatbot prompts per week
  const chat = prompts * ((1 - a.longShare) * PP.F.chatWh + a.longShare * PP.F.longWh) * tier;
  const reason = a.reason * PP.F.reasonWh;
  const code = a.code * PP.F.longWh;
  const everywhere = a.search * 7 * PP.F.searchWh + a.apps * PP.F.chatWh;
  const image = a.images * PP.F.imageWh;
  const video = a.videos * PP.F.videoWh;
  const weekWh = chat + reason + code + everywhere + image + video;
  const w = a.weeks;
  const yearWh = weekWh * w;
  return {
    prompts, weekWh, yearWh,
    totalRequests: (prompts + a.reason + a.code + a.search * 7 + a.apps + a.images + a.videos) * w,
    parts: { chat: chat * w, reason: reason * w, code: code * w, everywhere: everywhere * w, image: image * w, video: video * w },
    waterMl: yearWh * PP.F.waterMlPerWh,
    co2g: yearWh * PP.F.co2gPerWh,
    weekWater: weekWh * PP.F.waterMlPerWh,
    weekCo2: weekWh * PP.F.co2gPerWh
  };
};

PP.PART_META = [
  { key: 'chat',       label: 'Chatbot prompts',    color: 'var(--s1)' },
  { key: 'reason',     label: 'Reasoning prompts',  color: 'var(--s2)' },
  { key: 'code',       label: 'Coding assistant',   color: 'var(--s3)' },
  { key: 'everywhere', label: 'Search & in-app AI', color: 'var(--s4)' },
  { key: 'image',      label: 'Images',             color: 'var(--s5)' },
  { key: 'video',      label: 'Video clips',        color: 'var(--s6)' }
];

/* Formatting helpers */
PP.fmt = {
  num(n, d) {
    if (!isFinite(n)) return '0';
    if (d === undefined) d = Math.abs(n) >= 100 ? 0 : Math.abs(n) >= 10 ? 1 : 2;
    return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: d });
  },
  energy(wh) {
    if (wh >= 1e9) return { v: PP.fmt.num(wh / 1e9), u: 'GWh', n: wh / 1e9 };
    if (wh >= 1e6) return { v: PP.fmt.num(wh / 1e6), u: 'MWh', n: wh / 1e6 };
    if (wh >= 1000) return { v: PP.fmt.num(wh / 1000), u: 'kWh', n: wh / 1000 };
    return { v: PP.fmt.num(wh), u: 'Wh', n: wh };
  },
  water(ml) {
    if (ml >= 1e9) return { v: PP.fmt.num(ml / 1e9), u: 'million L', n: ml / 1e9 };
    if (ml >= 1000) return { v: PP.fmt.num(ml / 1000), u: 'L', n: ml / 1000 };
    return { v: PP.fmt.num(ml), u: 'mL', n: ml };
  },
  co2(g) {
    if (g >= 1e6) return { v: PP.fmt.num(g / 1e6), u: 't CO₂', n: g / 1e6 };
    if (g >= 1000) return { v: PP.fmt.num(g / 1000), u: 'kg CO₂', n: g / 1000 };
    return { v: PP.fmt.num(g), u: 'g CO₂', n: g };
  },
  compact(n) {
    if (n >= 1e9) return PP.fmt.num(n / 1e9, 1) + 'B';
    if (n >= 1e6) return PP.fmt.num(n / 1e6, 1) + 'M';
    if (n >= 1e4) return PP.fmt.num(n / 1e3, 0) + 'K';
    return PP.fmt.num(n);
  }
};

PP.cite = function (key, label) {
  const s = PP.SOURCES[key];
  if (!s) return '';
  return '<a class="cite" href="' + s.url + '" target="_blank" rel="noopener" title="' +
    s.title.replace(/"/g, '&quot;') + '">' + (label || s.cite) + '</a>';
};
