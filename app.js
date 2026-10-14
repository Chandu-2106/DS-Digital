/* MBU Data Science Learning Portal — vanilla JS */
const student = { name: "Chandu Poola", rollNumber: "24102A030097", section: "2", branch: "Data Science", year: "3rd Year", photo: "assets/student.png", faculty: { name: "S. Bosubabu", designation: "Asst. Professor" }, github: "https://github.com/Chandu-2106", linkedin: "https://www.linkedin.com/in/chandu-poola-60518a3a2/?isSelfProfile=true", youtube: "https://www.youtube.com/", instagram: "YOUR_INSTAGRAM_URL" };
const modules = [1, 2, 3, 4, 5].map(n => ({ id: `module-0${n}`, number: `0${n}`, title: BOOK[`module-0${n}`].title }));
const tl = (name, category, description, pkg, url) => { const p = pkg && pkg.replace('scikit-learn', 'sklearn').replace('-', '_'); return { id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name, category, description, install: pkg ? `pip install ${pkg}` : 'See the official website for installation.', usage: pkg ? `import ${p} as lib\nprint(lib.__version__)` : '', website: url, docs: url } };
const tools = [tl("Python", "Programming", "General-purpose language for data work.", null, "https://www.python.org"), tl("Jupyter Notebook", "Programming", "Interactive notebooks for code and narrative.", "notebook", "https://jupyter.org"), tl("Google Colab", "Programming", "Hosted notebooks with free compute.", null, "https://colab.research.google.com"),
tl("NumPy", "Data Processing", "N-dimensional arrays and numerical routines.", "numpy", "https://numpy.org/doc"), tl("Pandas", "Data Processing", "DataFrames for data analysis and manipulation.", "pandas", "https://pandas.pydata.org/docs"), tl("Polars", "Data Processing", "Fast columnar DataFrame library.", "polars", "https://docs.pola.rs"),
tl("Matplotlib", "Visualization", "Foundational plotting library.", "matplotlib", "https://matplotlib.org"), tl("Seaborn", "Visualization", "Statistical graphics on top of Matplotlib.", "seaborn", "https://seaborn.pydata.org"), tl("Plotly", "Visualization", "Interactive charts.", "plotly", "https://plotly.com/python"),
tl("Scikit-learn", "Machine Learning", "Classical machine learning algorithms.", "scikit-learn", "https://scikit-learn.org"), tl("XGBoost", "Machine Learning", "Gradient boosted trees.", "xgboost", "https://xgboost.readthedocs.io"),
tl("TensorFlow", "Deep Learning", "End-to-end deep learning platform.", "tensorflow", "https://www.tensorflow.org"), tl("Keras", "Deep Learning", "High-level neural network API.", "keras", "https://keras.io"), tl("PyTorch", "Deep Learning", "Flexible deep learning framework.", "torch", "https://pytorch.org"),
tl("MySQL", "Databases", "Relational database.", null, "https://dev.mysql.com/doc"), tl("MongoDB", "Databases", "Document database.", null, "https://www.mongodb.com/docs"),
tl("Git", "Development", "Version control.", null, "https://git-scm.com/doc"), tl("GitHub", "Development", "Code hosting and collaboration.", null, "https://docs.github.com"), tl("VS Code", "Development", "Code editor.", null, "https://code.visualstudio.com/docs")];
const ARCH = ["Dataset", "Data Collection", "Preprocessing", "Analysis", "Visualization", "Output"];
const sub = (id, title, exp) => ({ id, title, aim: `To perform ${title.toLowerCase()} as part of ${exp}.`, procedure: ["Load the dataset.", `Apply the ${title.toLowerCase()} steps.`, "Inspect intermediate results.", "Record observations."], code: `import pandas as pd\n\ndf = pd.read_csv("dataset.csv")\n# ${title}\nprint(df.head())`, output: "   id  value\n0   1   10.5\n1   2   11.2\n(demo output)" });
const ex = (number, title, description, module, difficulty, tools, subs) => ({ id: `seed-${number}`, number, title, description, module, difficulty, tools, overview: { summary: description + " Students work through six sub-experiments that build from raw data to a final analysis.", architecture: ARCH }, aim: `To understand ${title.toLowerCase()}.`, procedure: ["Prepare the environment.", "Work through sub-experiments A to F."], code: "", output: "", subExperiments: subs.map((s, i) => sub("ABCDEF"[i], s, title)) });
const seedE = [ex("01", "Python Data Analysis", "Learn Python techniques for loading, manipulating, analyzing and visualizing real-world datasets.", "Types of Data Analysis", "Beginner", ["Python", "Pandas", "NumPy"], ["Data Collection", "Data Cleaning", "Exploratory Analysis", "Data Visualization", "Model Building", "Result Analysis"]),
ex("02", "Data Cleaning", "Clean messy data by handling missing values, duplicates, outliers and inconsistent formats.", "Extracting Meaning from Data", "Intermediate", ["Pandas", "NumPy"], ["Missing Values", "Duplicates", "Outliers", "Type Conversion", "Encoding", "Validation"]),
ex("03", "Exploratory Data Analysis", "Summarise distributions, correlations and patterns to understand a dataset before modelling.", "Extracting Meaning from Data", "Intermediate", ["Pandas", "Seaborn", "Matplotlib"], ["Summary Statistics", "Distributions", "Correlation", "Group Analysis", "Outlier Review", "Findings"])];
const seedM = [];

/* ---------- storage ---------- */
const LS = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d } catch { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true } catch { return false } } };
const S = { E: LS.get("mbu_experiments", null) || seedE, M: LS.get("mbu_materials", null) || seedM, manage: true, theme: localStorage.getItem("mbu_theme") || "dark" };
const saveE = () => LS.set("mbu_experiments", S.E);
const TOOBIG = "This PDF is too large for browser LocalStorage. Connect a backend or file-storage service for production use.";
const saveM = () => LS.set("mbu_materials", S.M) || (toast(TOOBIG, "err"), false);
const MAX = 2 * 1024 * 1024;
const BACKEND_URL = localStorage.getItem("mbu_backend_url") || "http://127.0.0.1:8000";
async function runCode(code) { const r = await fetch(BACKEND_URL + '/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) }); const data = await r.json().catch(() => ({})); if (!r.ok) throw new Error(data.error || 'Execution service error'); return data }

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const app = $("#app");
function toast(m, t = "ok") { const d = document.createElement("div"); d.className = "toast " + t; d.textContent = (t === "err" ? "✕ " : "✓ ") + m; $("#toasts").append(d); setTimeout(() => d.remove(), 3500) }
function modal(title, html, wide) {
  $("#modal").innerHTML = `<div class="ov"><div class="box glass ${wide ? "w" : ""}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="mh"><span>${title}</span><button aria-label="Close" data-close>✕</button></div>${html}</div></div>`;
  $("#modal .ov").onclick = e => { if (e.target.classList.contains("ov") || e.target.hasAttribute("data-close")) closeModal() }
}
const closeModal = () => $("#modal").innerHTML = "";
function confirmDel(title, name, label, fn) { modal(title, `<p class="sm">Are you sure you want to delete:</p><p><b>"${esc(name)}"</b></p><p class="mute sm">This action cannot be undone.</p><div class="ft"><button class="btn" data-close>Cancel</button><button class="btn d" id="ok">${label}</button></div>`); $("#ok").onclick = () => { fn(); closeModal() } }
const crumbs = a => `<nav class="crumbs" aria-label="Breadcrumb">${a.map((c, i) => (i ? "<span>/</span>" : "") + (c[1] ? `<a href="${c[1]}">${c[0]}</a>` : `<span>${c[0]}</span>`)).join("")}</nav>`;
const sec = (t, b, r = "") => `<section class="sec"><div class="sech"><h2>${t}</h2>${r}</div>${b}</section>`;
const code = (c, l = "CODE") => `<div class="code glass"><div class="h"><span>${l}</span><button data-copy="${esc(c)}">Copy Code</button></div><pre><code>${esc(c) || "(empty)"}</code></pre></div>`;
const empty = (t, b, x = "") => `<div class="c"><p><b>${t}</b></p><p class="mute sm">${b}</p>${x}</div>`;
const size = b => b ? (b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.round(b / 1024) + " KB") : "—";
const cnt = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
const blobUrl = d => { const bin = atob(d.split(",")[1]); const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++)a[i] = bin.charCodeAt(i); return URL.createObjectURL(new Blob([a], { type: "application/pdf" })) };
const readFile = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(new Error("Could not read file")); r.readAsDataURL(f) });
const Q = (x, l) => `<div><div class="lbl">${l}</div><div class="val">${esc(x)}</div></div>`;
const qr = s => `<svg width="${s}" height="${s}" viewBox="0 0 7 7" role="img" aria-label="QR placeholder">${[...Array(49)].map((_, i) => (i * 7 + (i >> 2) * 3) % 5 < 2 ? `<rect x="${i % 7}" y="${Math.floor(i / 7)}" width="1" height="1" fill="currentColor"/>` : "").join("")}</svg>`;

/* ---------- layout ---------- */
const NAV = [["HOME", "#/"], ["MODULES", "#/modules"], ["EXPERIMENTS", "#/experiments"], ["TOOLS", "#/tools"], ["RESOURCES", "#/resources"]];
const IC = (p, w = 20) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I = {
  search: IC('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  sun: IC('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: IC('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
  menu: IC('<path d="M4 6h16M4 12h16M4 18h16"/>'),
  prev: IC('<path d="m15 18-6-6 6-6"/>', 18), next: IC('<path d="m9 18 6-6-6-6"/>', 18), minus: IC('<path d="M5 12h14"/>', 18), plus: IC('<path d="M12 5v14M5 12h14"/>', 18),
  eye: IC('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', 18), edit: IC('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>', 18), trash: IC('<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>', 18),
  download: IC('<path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16"/>', 18), ext: IC('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', 18), full: IC('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>', 18)
};
function drawHeader() {
  const h = location.hash || "#/"; const on = t => t === "#/" ? h === "#/" || h === "" : h.startsWith(t);
  $("#header").innerHTML = `<header class="glass"><div class="in"><a href="#/" style="display:flex;gap:.75rem;align-items:center"><div class="logo"><img src="assets/mbu-logo.png" alt="MBU"/></div><div><div class="sm" style="font-weight:700;letter-spacing:.15em">MOHAN BABU UNIVERSITY</div><div class="mute" style="font-size:.62rem;letter-spacing:.25em">DATA SCIENCE LEARNING PORTAL</div></div></a>
  <nav class="m" aria-label="Main">${NAV.map(([l, t]) => `<a href="${t}" class="${on(t) ? "on" : ""}">${l}</a>`).join("")}</nav>
  <div class="tools" style="margin-left:auto"><button class="profile-trigger" id="profile-open" aria-label="Open profile"><img src="${localStorage.getItem("mbu_photo") || "assets/student.png"}" alt="Profile"/></button><button class="ib" aria-label="Toggle theme" id="th">${S.theme === "dark" ? I.sun : I.moon}</button><button class="ib" id="menu" aria-label="Menu">${I.menu}</button></div></div>
  <nav id="mnav">${NAV.map(([l, t]) => `<a href="${t}" class="mute" style="padding:.5rem 0;letter-spacing:.2em;font-size:.75rem">${l}</a>`).join("")}</nav></header>`;
  $("#th").onclick = () => { S.theme = S.theme === "dark" ? "light" : "dark"; applyTheme(); drawHeader() };
  $("#menu").onclick = () => $("#mnav").classList.toggle("open"); $$("#mnav a").forEach(a => a.onclick = () => $("#mnav").classList.remove("open"));
  $("#profile-open").onclick = openProfile
}
const applyTheme = () => { document.documentElement.classList.toggle("light", S.theme === "light"); localStorage.setItem("mbu_theme", S.theme) };
$("#footer").innerHTML = `<footer><div style="font-weight:700;letter-spacing:.15em">MOHAN BABU UNIVERSITY</div><div class="mute" style="font-size:.75rem;letter-spacing:.25em;margin-bottom:1rem">DATA SCIENCE LEARNING PORTAL</div><div class="l"><a href="#/">Home</a><a href="#/modules">Modules</a><a href="#/experiments">Experiments</a><a href="#/tools">Tools</a><a href="#/resources">Resources</a></div><div class="l"><a href="${student.github}" target="_blank" rel="noreferrer">GitHub</a><a href="${student.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a></div><div class="mute xs">© 2026 Mohan Babu University</div></footer>`;

/* ---------- search ---------- */
function index() {
  return [...S.E.map(e => ({ type: "Experiment", title: e.title, sub: `Experiment ${e.number}`, to: `#/experiments/${e.id}/overview`, text: [e.title, e.description, e.module, ...e.tools].join(" ") })),
  ...S.E.flatMap(e => e.subExperiments.map(s => ({ type: "Sub-experiment", title: s.title, sub: `${e.title} · ${s.id}`, to: `#/experiments/${e.id}/${s.id}`, text: s.title + " " + (s.aim || "") }))),
  ...modules.map(m => ({ type: "Module", title: m.title, sub: `Module ${+m.number}`, to: `#/modules/${m.id}`, text: m.title + " " + BOOK[m.id].pages.map(p => p.split("|")[0]).join(" ") })),
  ...tools.map(t => ({ type: "Tool", title: t.name, sub: t.category, to: `#/tools/${t.id}`, text: t.name + " " + t.description })),
  ...S.M.map(m => ({ type: "Study material", title: m.title, sub: m.fileName, to: `#/materials/${m.id}`, text: m.title + " " + (m.description || "") })), ...LS.get("mbu_resources",[]).map(r=>({type:"Resource",title:r.title,sub:r.type,to:"#/resources",text:r.title+" "+(r.description||"")}))]
}
function initSearch() {
  const inp = $("#sq"), out = $("#sr"); let res = [], sel = 0;
  const draw = () => {
    const t = inp.value.trim().toLowerCase(); $("#sx").textContent = inp.value ? "✕" : "ESC"; if (!t) { out.innerHTML = ""; return }
    res = index().filter(r => r.text.toLowerCase().includes(t)).slice(0, 12); sel = 0;
    out.innerHTML = res.length ? `<ul class="res glass" role="listbox">${res.map((r, i) => `<li><button data-to="${r.to}" class="${i === sel ? "sel" : ""}"><div class="ac" style="font-size:.62rem;letter-spacing:.2em">${r.type.toUpperCase()}</div><div style="font-weight:500">${esc(r.title)}</div><div class="mute xs">${esc(r.sub)}</div></button></li>`).join("")}</ul>` : `<div class="res glass mute sm c" style="padding:1.25rem">No results found. Try another search.</div>`;
    $$("[data-to]", out).forEach(b => b.onclick = () => location.hash = b.dataset.to)
  };
  inp.oninput = draw; $("#sx").onclick = () => { inp.value = ""; draw() };
  inp.onkeydown = e => { if (e.key === "Escape") { inp.value = ""; draw() } const bs = $$("[data-to]", out); if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, Math.min(bs.length - 1, sel + (e.key === "ArrowDown" ? 1 : -1))); bs.forEach((b, i) => b.classList.toggle("sel", i === sel)) } if (e.key === "Enter" && bs[sel]) location.hash = bs[sel].dataset.to }
}

/* ---------- pages ---------- */
const ICONS = {
  github: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`
};
const AVATAR = `<svg viewBox="0 0 100 130" role="img" aria-label="Photo placeholder"><defs><linearGradient id="ag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b4a9c"/><stop offset="1" stop-color="#0f766e"/></linearGradient></defs><rect width="100" height="130" fill="url(#ag)"/><circle cx="50" cy="48" r="20" fill="rgba(255,255,255,.85)"/><path d="M12 130c0-28 17-44 38-44s38 16 38 44z" fill="rgba(255,255,255,.85)"/></svg>`;
function idCard() {
  const s = student, ph = localStorage.getItem("mbu_photo") || "assets/student.png";
  return `<div class="idc" id="idc"><div class="idshine"></div><div class="idtop"><div class="logo"><img src="assets/mbu-logo.png" alt="MBU"/></div><div><div class="sm" style="font-weight:700;letter-spacing:.15em">MOHAN BABU UNIVERSITY</div><div class="lbl">DATA SCIENCE</div></div><span class="idtag">STUDENT ID</span></div>
  <div class="idbody"><label class="idphoto" title="Click to change photo"><input type="file" id="ph" accept="image/*" hidden/>${ph ? `<img src="${ph}" alt="${esc(s.name)} photograph"/>` : AVATAR}<span>Change photo</span></label><div class="idinfo"><div class="idname">${esc(s.name)}</div>${Q(s.rollNumber, "ROLL NO")}<div class="two">${Q(s.year, "YEAR")}${Q(s.section, "SECTION")}</div>${Q(s.branch, "BRANCH")}</div></div>
  <div class="idfac">${Q(s.faculty.name, "FACULTY")}${Q(s.faculty.designation, "DESIGNATION")}</div>
  <div class="idsoc">${["github", "linkedin", "youtube", "instagram"].map(k => `<a class="soc" data-soc="${k}" href="${/^https?:/.test(s[k]) ? s[k] : "#"}" target="_blank" rel="noreferrer" aria-label="${k[0].toUpperCase() + k.slice(1)}">${ICONS[k]}</a>`).join("")}</div></div>`
}
function home() {
  const s = student, subs = S.E.reduce((n, e) => n + e.subExperiments.length, 0);
  const st = [[S.E.length, "EXPERIMENTS"], [modules.length, "MODULES"], [subs, "SUB-EXPERIMENTS"], [tools.length, "TOOLS"], [S.M.length + modules.length, "STUDY MATERIALS"]];
  app.innerHTML = `<main class="wrap"><section class="hero"><div style="padding:3rem 0"><p class="ac t" style="letter-spacing:.4em">MOHAN BABU UNIVERSITY</p><h1 class="big">DATA SCIENCE<br/>LEARNING PORTAL</h1><p class="ac" style="letter-spacing:.3em;margin-top:1rem">Learn • Experiment • Analyze • Build</p><p class="mute" style="max-width:36rem">An interactive learning environment for Data Science students to explore modules, experiments, tools, documentation and practical code.</p><div style="display:flex;gap:.75rem;margin-top:1.5rem"><a class="btn p" href="#/experiments">Explore Experiments</a><a class="btn" href="#/modules">Explore Modules</a></div></div>
  <div><p class="mute t" style="margin-bottom:1rem">DIGITAL UNIVERSITY ID</p>${idCard()}</div></section>
  <br>
  <div class="sec"><div class="search glass"><span>🔍</span><input id="sq" aria-label="Search" placeholder="Search experiments, modules, tools..." autocomplete="off"/><button id="sx" class="mute xs" aria-label="Clear search">ESC</button></div><div id="sr"></div></div>
  ${sec("LEARNING OVERVIEW", `<div class="stats">${st.map(([n, l]) => `<div><b data-n="${n}">0</b><span class="mute" style="font-size:.62rem;letter-spacing:.15em">${l}</span></div>`).join("")}</div>`)}
  ${sec("EXPERIMENT DIRECTORY", S.E.length ? S.E.map(e => `<a href="#/experiments/${e.id}/overview" class="row"><span class="n">${esc(e.number)}</span><div class="grow"><div style="font-size:1.1rem;font-weight:500">${esc(e.title)}</div><div class="mute sm">${esc(e.module)} · ${e.difficulty} · ${e.subExperiments.length} Sub Experiments</div><div class="mute sm hid-s" style="margin-top:.25rem">${esc(e.description)}</div></div><span class="go sm">Overview <i>→</i></span></a>`).join("") : `<p class="mute sm">No experiments found.</p>`, `<a class="ac xs" href="#/experiments">View all →</a>`)}
  ${sec("LEARNING PROGRESS", modules.map(m => { const c = S.E.filter(e => e.module === m.title).length; return `<div class="sm" style="margin-bottom:.75rem"><div style="display:flex;justify-content:space-between;margin-bottom:.25rem"><span>${m.title}</span><span class="mute">${c} experiment${c !== 1 ? "s" : ""}</span></div><div style="height:4px;background:rgba(127,127,127,.2)"><div style="height:4px;background:var(--ac);width:${Math.min(100, c * 33)}%;transition:width .8s"></div></div></div>` }).join(""))}
  ${sec("QUICK MANAGEMENT", `<div class="mute sm" style="display:flex;flex-wrap:wrap;gap:1rem"><a href="#/experiments">+ Add Experiment</a><a href="#/experiments">Manage Experiments</a><a href="#/modules">Manage Study Materials</a></div>`)}</main>`;
  $$("[data-soc]").forEach(a => a.onclick = e => { if (!/^https?:/.test(student[a.dataset.soc])) { e.preventDefault(); toast("Add your " + a.dataset.soc + " link in app.js", "err") } });
  $("#ph").onchange = e => {
    const f = e.target.files[0]; if (!f) return; if (!f.type.startsWith("image/")) return toast("Please choose an image file.", "err"); if (f.size > 1.5 * 1024 * 1024) return toast("Image is too large (max 1.5 MB).", "err");
    readFile(f).then(d => { try { localStorage.setItem("mbu_photo", d) } catch { return toast("Could not save the photo in browser storage.", "err") } toast("Photo updated successfully"); home() })
  }; initSearch();
  $$("[data-n]").forEach(el => { const to = +el.dataset.n, t0 = performance.now(); (function f(t) { const p = Math.min(1, (t - t0) / 1000); el.textContent = Math.round(to * p); if (p < 1) requestAnimationFrame(f) })(t0) });
  const c = $("#idc"); c.onmousemove = e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg) scale(1.02)` }; c.onmouseleave = () => c.style.transform = ""
}

const F = { q: "", mod: "All", lvl: "All", tech: "All", sort: "number" };
const TECH = ["All", "Python", "NumPy", "Pandas", "Matplotlib", "Statistics", "Machine Learning", "Deep Learning"];
function ytId(u) {
  u = (u || "").trim(); if (!u) return ""; let m; if (m = u.match(/^(?:https?:\/\/)?(?:www\.|m\.)?youtu\.be\/([\w-]{11})/)) return m[1];
  if (m = u.match(/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)([\w-]{11})/)) return m[1]; return null
}
function experiments() {
  const list = S.E.filter(e => (F.mod === "All" || e.module === F.mod) && (F.lvl === "All" || e.difficulty === F.lvl) && (F.tech === "All" || e.tools.some(t => t.toLowerCase() === F.tech.toLowerCase())) && (!F.q || (e.title + e.description + e.tools.join()).toLowerCase().includes(F.q.toLowerCase())))
    .sort((a, b) => F.sort === "title" ? a.title.localeCompare(b.title) : F.sort === "difficulty" ? a.difficulty.localeCompare(b.difficulty) : a.number.localeCompare(b.number, undefined, { numeric: true }));
  const opts = (a, v) => a.map(x => `<option ${x === v ? "selected" : ""}>${esc(x)}</option>`).join("");
  app.innerHTML = `<main class="wrap"><div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:1.5rem"><div><h1>EXPERIMENTS</h1><p class="mute" style="margin:0">Explore practical Data Science experiments</p></div><button class="btn p" id="add">+ ADD EXPERIMENT</button></div>
  <div class="ctl" style="grid-template-columns:1fr"><input class="inp" id="fq" aria-label="Search experiments" placeholder="Search experiments..." value="${esc(F.q)}"/></div>
  ${list.length ? `<div style="overflow-x:auto"><table><thead><tr><th>NO.</th><th>EXPERIMENT</th><th class="hid-s">MODULE</th><th>LEVEL</th><th></th></tr></thead><tbody>${list.map(e => `<tr><td style="font-size:1.25rem;font-weight:300">${esc(e.number)}</td><td><div style="font-weight:500">${esc(e.title)}</div><div class="mute xs">${esc(e.tools.join(" · "))}</div></td><td class="mute hid-s">${esc(e.module)}</td><td>${e.difficulty}</td><td class="r"><a class="ib" href="#/experiments/${e.id}/overview" title="View" aria-label="View ${esc(e.title)}">${I.eye}</a>${S.manage ? `<button class="ib" data-ed="${e.id}" title="Edit" aria-label="Edit ${esc(e.title)}">${I.edit}</button><button class="ib dng" data-dl="${e.id}" title="Delete" aria-label="Delete ${esc(e.title)}">${I.trash}</button>` : ""}</td></tr>`).join("")}</tbody></table></div>` : empty("No experiments found.", "Try another search.")}</main>`;
  const keep = (id, fn) => { const el = $("#" + id); el.oninput = el.onchange = () => { fn(el.value); const p = el.selectionStart; experiments(); const n = $("#" + id); if (id === "fq") { n.focus(); n.setSelectionRange(p, p) } } };
  keep("fq", v => F.q = v);
  $("#add") && ($("#add").onclick = () => editor(null)); $$("[data-ed]").forEach(b => b.onclick = () => editor(S.E.find(e => e.id === b.dataset.ed)));
  $$("[data-dl]").forEach(b => b.onclick = () => { const e = S.E.find(x => x.id === b.dataset.dl); confirmDel("DELETE EXPERIMENT?", e.title, "Delete Experiment", () => { S.E = S.E.filter(x => x.id !== e.id); saveE(); toast("Experiment deleted successfully"); experiments() }) })
}
function editor(init) {
  const W = JSON.parse(JSON.stringify(init || { number: "", title: "", description: "", module: modules[0].title, difficulty: "Beginner", tools: [], aim: "", procedure: [], code: "", output: "", overview: { summary: "", architecture: ARCH }, subExperiments: [] })); let open = -1;
  const L = l => String.fromCharCode(65 + l);
  const subs = () => {
    $("#subs").innerHTML = W.subExperiments.map((s, i) => `<div style="padding:.5rem 0;border-bottom:1px solid var(--line)"><div style="display:flex;gap:.5rem;align-items:center"><b class="ac" style="width:1.25rem">${s.id}</b><input class="inp" data-k="title" data-i="${i}" aria-label="Sub-experiment ${s.id} title" value="${esc(s.title)}"/><button class="btn" data-o="${i}">${open === i ? "Done" : "Edit"}</button><button data-x="${i}" aria-label="Delete sub-experiment ${s.id}">🗑</button></div>${open === i ? `<div style="display:grid;gap:.5rem;padding:.5rem 0 0 1.75rem"><textarea class="inp mono" rows="4" data-k="code" data-i="${i}" placeholder="Code">${esc(s.code)}</textarea><textarea class="inp mono" rows="2" data-k="output" data-i="${i}" placeholder="Output">${esc(s.output)}</textarea></div>` : ""}</div>`).join("");
    $$("#subs [data-k]").forEach(el => el.oninput = () => { const s = W.subExperiments[+el.dataset.i], k = el.dataset.k; s[k] = k === "procedure" ? el.value.split("\n") : el.value });
    $$("#subs [data-o]").forEach(b => b.onclick = () => { open = open === +b.dataset.o ? -1 : +b.dataset.o; subs() });
    $$("#subs [data-x]").forEach(b => b.onclick = () => { W.subExperiments.splice(+b.dataset.x, 1); W.subExperiments.forEach((s, n) => s.id = L(n)); open = -1; subs() })
  };
  const o = (a, v) => a.map(x => `<option ${x === v ? "selected" : ""}>${esc(x)}</option>`).join("");
  modal(init ? "EDIT EXPERIMENT" : "ADD NEW EXPERIMENT", `<div class="two" style="grid-template-columns:120px 1fr"><label class="f"><span>EXPERIMENT NUMBER</span><input class="inp" id="en" value="${esc(W.number)}" placeholder="01"/></label><label class="f"><span>TITLE</span><input class="inp" id="et" value="${esc(W.title)}"/></label></div>
  <label class="f"><span>DESCRIPTION (≈15 words)</span><textarea class="inp" id="ed" rows="2">${esc(W.description)}</textarea></label><div class="two"><label class="f"><span>MODULE</span><select class="inp" id="em">${o(modules.map(m => m.title), W.module)}</select></label><label class="f"><span>DIFFICULTY</span><select class="inp" id="el">${o(["Beginner", "Intermediate", "Advanced"], W.difficulty)}</select></label></div>
  <label class="f"><span>YOUTUBE LINK (preview video)</span><input class="inp" id="ev" placeholder="https://www.youtube.com/watch?v=..." value="${esc(W.video || "")}"/></label><label class="f"><span>TOOLS (comma separated)</span><input class="inp" id="eto" value="${esc(W.tools.join(", "))}"/></label><label class="f"><span>SUMMARY</span><textarea class="inp" id="esu" rows="3">${esc(W.overview?.summary || "")}</textarea></label><label class="f"><span>ARCHITECTURE (one step per line, in order)</span><textarea class="inp" id="eac" rows="5">${esc((W.overview?.architecture || ARCH).join("\n"))}</textarea></label><label class="f"><span>AIM</span><textarea class="inp" id="ea" rows="2">${esc(W.aim)}</textarea></label><label class="f"><span>PROCEDURE (one step per line)</span><textarea class="inp" id="ep" rows="3">${esc(W.procedure.join("\n"))}</textarea></label>
  <label class="f"><span>CODE</span><textarea class="inp mono" id="ec" rows="4">${esc(W.code)}</textarea></label><label class="f"><span>OUTPUT</span><textarea class="inp mono" id="eo" rows="2">${esc(W.output)}</textarea></label>
  <div class="rule t" style="padding-bottom:.5rem">SUB-EXPERIMENTS</div><div id="subs"></div><button class="btn" id="as" style="margin-top:.75rem">+ Add Sub-Experiment</button><p class="err" id="er" role="alert"></p><div class="ft"><button class="btn" data-close>Cancel</button><button class="btn p" id="sv">${init ? "Save Changes" : "Create Experiment"}</button></div>`, true);
  subs(); $("#as").onclick = () => { W.subExperiments.push({ id: L(W.subExperiments.length), title: "New Sub-Experiment", aim: "", procedure: [], code: "", output: "" }); subs() };
  $("#sv").onclick = () => {
    const v = id => $("#" + id).value; if (!v("et").trim() || !v("en").trim()) return $("#er").textContent = "Experiment number and title are required.";
    if (ytId(v("ev")) === null) return $("#er").textContent = "Please enter a valid YouTube link.";
    const d = { ...W, video: v("ev").trim(), number: v("en").trim(), title: v("et").trim(), description: v("ed"), module: v("em"), difficulty: v("el"), tools: v("eto").split(",").map(s => s.trim()).filter(Boolean), aim: v("ea"), procedure: v("ep").split("\n"), code: v("ec"), output: v("eo") }; d.overview = { ...d.overview, summary: v("esu").trim() || d.description, architecture: (a => a.length ? a : ARCH)(v("eac").split("\n").map(x => x.trim()).filter(Boolean)) };
    if (init) { S.E = S.E.map(e => e.id === init.id ? { ...d, id: init.id } : e); toast("Experiment updated successfully") } else { S.E.push({ ...d, id: crypto.randomUUID() }); toast("Experiment created successfully") }
    saveE(); closeModal(); route()
  }
}
function overview(id) {
  const e = S.E.find(x => x.id === id); if (!e) return app.innerHTML = `<main class="wrap">${empty("Experiment not found", "It may have been deleted.", `<a class="btn" href="#/experiments">Back to Experiments</a>`)}</main>`;
  app.innerHTML = `<main class="wrap">${crumbs([["Home", "#/"], ["Experiments", "#/experiments"], [`Experiment ${e.number}`]])}<p class="ac t" style="letter-spacing:.3em">EXPERIMENT ${esc(e.number)}</p><h1>${esc(e.title)}</h1><p class="mute" style="margin-bottom:2.5rem">${esc(e.module)} · ${e.difficulty} · ${e.subExperiments.length} Sub Experiments</p>
  ${ytId(e.video) ? sec("PREVIEW VIDEO", `<div style="position:relative;max-width:48rem;aspect-ratio:16/9;border-radius:.5rem;overflow:hidden;border:1px solid var(--line);background:#000"><iframe src="https://www.youtube.com/embed/${ytId(e.video)}" title="${esc(e.title)} preview video" style="position:absolute;inset:0;width:100%;height:100%;border:0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`) : ""}
  ${sec("SUMMARY", `<p style="max-width:48rem;font-size:1.1rem;line-height:1.7">${esc(e.overview?.summary || e.description)}</p>`)}
  ${sec("EXPERIMENT INFORMATION", `<dl>${[["Module", e.module], ["Difficulty", e.difficulty], ["Sub Experiments", e.subExperiments.length], ["Tools", e.tools.join(" / ")]].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`)}
  ${sec("ARCHITECTURE", `<div class="pipe">${(e.overview?.architecture || []).map((n, i, a) => `<div class="node glass">${esc(n.toUpperCase())}</div>${i < a.length - 1 ? '<div class="ln"></div>' : ""}`).join("")}</div>`)}
  ${sec("SUB EXPERIMENTS", e.subExperiments.length ? `<ol class="tl">${e.subExperiments.map(s => `<li><a href="#/experiments/${e.id}/${s.id}"><span class="dot">${s.id}</span><b>${esc(s.title)} →</b><p>${esc(s.aim)}</p></a></li>`).join("")}</ol>` : `<p class="mute sm">No sub-experiments yet.</p>`)}</main>`
}
function subexp(id, sid) {
  const e = S.E.find(x => x.id === id), s = e?.subExperiments.find(x => x.id === sid); if (!s) return app.innerHTML = `<main class="wrap">${empty("Sub-experiment not found", "It may have been deleted.", `<a class="btn" href="#/experiments">Back to Experiments</a>`)}</main>`;
  app.innerHTML = `<main class="wrap">${crumbs([["Home", "#/"], ["Experiments", "#/experiments"], [`Experiment ${e.number}`, `#/experiments/${e.id}/overview`], [s.title]])}<p class="ac t" style="letter-spacing:.3em">EXPERIMENT ${esc(e.number)} · SUB-EXPERIMENT ${s.id}</p><h1 style="margin-bottom:2.5rem">${esc(s.title)}</h1>
  ${sec("CODE", code(s.code))}${sec("OUTPUT", code(s.output, "OUTPUT"))}
  ${sec("SANDBOX", `<div class="code glass"><div class="h"><span style="letter-spacing:.15em">DATA SCIENCE SANDBOX</span><select id="lang" class="inp" style="width:auto;padding:.25rem .5rem"><option value="python">Python</option><option value="java">Java</option></select></div><textarea class="inp mono" id="sc" rows="10" aria-label="Sandbox code" style="border:0">${esc(s.code || "print(\"Hello, Data Science!\")")}</textarea><div style="display:flex;gap:.5rem;padding:0 .75rem .75rem;border-bottom:1px solid var(--line)"><button class="btn p" id="run">Run</button><button class="btn" id="rst">Reset</button><button class="btn" id="cp">Copy</button></div><div style="padding:1rem"><div class="mute xs" id="ss" style="letter-spacing:.1em;margin-bottom:.5rem">OUTPUT · PYTHON / JAVA</div><pre id="so" style="margin:0;white-space:pre-wrap;min-height:3rem" class="sm">Run the code to see output.</pre><div id="plots" class="sandbox-plots"></div></div></div>`)}</main>`;
  const so = $("#so"), ss = $("#ss"), plots = $("#plots"), lang = $("#lang");
  const pyDefault = s.code || 'print("Hello, Data Science!")';
  const javaDefault = 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}';
  lang.onchange = () => { const current = $("#sc").value.trim(); if (!current || current === pyDefault || current === javaDefault) $("#sc").value = lang.value === "java" ? javaDefault : pyDefault; so.textContent = "Run the code to see output."; plots.innerHTML = ""; };
  $("#run").onclick = async () => {
    const c = $("#sc").value; so.style.color = ""; plots.innerHTML = ""; if (!c.trim()) { so.style.color = "#f87171"; so.textContent = "Error: nothing to run."; return } $("#run").textContent = "Running…"; $("#run").disabled = true;
    try { const r = await fetch(BACKEND_URL + '/run', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({code:c, language:lang.value}) }); const data = await r.json(); if (!r.ok) throw new Error(data.error || 'Execution service error'); so.textContent = (data.stdout || "") + (data.stderr ? "\n" + data.stderr : "") || (data.returncode === 0 ? "Code executed successfully (no text output)." : "No output."); ss.textContent = `OUTPUT · ${lang.value.toUpperCase()} · EXIT ${data.returncode}`; (data.figures || []).forEach(src => { const im = document.createElement("img"); im.src = "data:image/png;base64," + src; im.alt = "Python plot output"; plots.append(im); });
    } catch (x) { so.style.color = "#f87171"; so.textContent = x.message + (lang.value === "java" ? "\nCheck that JDK (javac/java) is installed and on PATH." : "\nStart the backend with: python backend.py"); } finally { $("#run").textContent = "Run"; $("#run").disabled = false; }
  };
  $("#rst").onclick = () => { $("#sc").value = lang.value === "java" ? javaDefault : pyDefault; so.textContent = "Run the code to see output."; plots.innerHTML = "" }; $("#cp").onclick = () => navigator.clipboard?.writeText($("#sc").value)
}
function modulesPage() { app.innerHTML = `<main class="wrap modules-page"><div class="module-page-head"><div><p class="ac t">LEARNING MATERIAL</p><h1>MODULES</h1><p class="mute">Explore the five Data Science learning modules and their study PDFs.</p></div><div class="module-count">${modules.length}<span>MODULES</span></div></div><div class="module-list">${modules.map(m => `<a href="#/modules/${m.id}" class="module-item glass"><span class="module-no">${m.number}</span><span class="grow"><span class="module-title">${esc(m.title)}</span><span class="mute xs">${BOOK[m.id].pages.length} study pages · Module ${+m.number}</span></span><span class="ib" aria-hidden="true">${I.next}</span></a>`).join("")}</div></main>` }
let KV = () => { };
let CUR = {};
function moduleDetails(id) {
  if (OURL) { URL.revokeObjectURL(OURL); OURL = null } const m = modules.find(x => x.id === id); if (!m) return app.innerHTML = `<main class="wrap">${empty("Module not found", "", `<a class="btn" href="#/modules">Back</a>`)}</main>`;
  const mats = S.M.filter(x => x.moduleId === m.id), cur = mats.find(x => x.id === CUR[id]) || mats[mats.length - 1]; let pg = 1, zoom = 100, url = null, err = "";
  if (cur?.fileData) { try { url = blobUrl(cur.fileData); OURL = url } catch { err = "Unable to load material. Try again." } }
  const viewer = !cur ? empty("NO PDF ADDED YET", "Add a PDF to this module and it will open here as a viewer.", `<button class="btn p" id="ap">+ Add PDF</button>`) :
    `<p class="mute sm" style="margin:0 0 .5rem">${esc(cur.title)} · ${esc(cur.fileName)}</p><div class="glass sm" style="display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;padding:.5rem .75rem;border-radius:.25rem;margin-bottom:.5rem"><button class="ib" id="pv" aria-label="Previous page">${I.prev}</button><span id="pn">Page 1</span><button class="ib" id="nx" aria-label="Next page">${I.next}</button><span class="mute">|</span><button class="ib" id="zo" aria-label="Zoom out">${I.minus}</button><span id="zv">100%</span><button class="ib" id="zi" aria-label="Zoom in">${I.plus}</button>${url ? `<span style="margin-left:auto;display:flex;gap:.5rem"><a class="ib" href="${url}" download="${esc(cur.fileName)}" aria-label="Download">${I.download}</a><a class="ib" href="${url}" target="_blank" rel="noreferrer" aria-label="Open in new tab">${I.ext}</a><button class="ib" id="fs" aria-label="Full screen">${I.full}</button></span>` : ""}</div>
   ${err ? `<p class="err" role="alert">${err}</p>` : url ? `<iframe id="pdf" title="${esc(cur.title)}" style="width:100%;height:75vh;border:1px solid var(--line);border-radius:.25rem;background:#fff"></iframe>` : empty("No file attached", "This PDF has no file data. Add it again to view it here.")}`;
  app.innerHTML = `<main class="wrap">${crumbs([["Home", "#/"], ["Modules", "#/modules"], [`Module ${+m.number}`]])}<div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem"><h1 style="font-size:1.9rem;margin:0">Module ${+m.number}: ${esc(m.title)}</h1><button class="btn p" id="ap2">+ ADD PDF</button></div>${viewer}
  ${mats.length ? `<div style="margin-top:3rem">${sec("PDFS IN THIS MODULE", `<div style="overflow-x:auto"><table><thead><tr><th>TYPE</th><th>TITLE</th><th>SIZE</th><th></th></tr></thead><tbody>${mats.map(x => `<tr ${x === cur ? 'style="background:var(--glass)"' : ""}><td>PDF</td><td>${esc(x.title)}<div class="mute xs">${esc(x.fileName)}</div></td><td>${size(x.fileSize)}</td><td class="r module-actions"><button class="ib" data-v="${x.id}" title="View" aria-label="View ${esc(x.title)}">${I.eye}</button>${x.fileData ? `<button class="ib" data-dw="${x.id}" title="Download" aria-label="Download ${esc(x.fileName)}">${I.download}</button>` : ""}<button class="ib" data-me="${x.id}" title="Edit" aria-label="Edit ${esc(x.title)}">${I.edit}</button><button class="ib dng" data-md="${x.id}" title="Delete" aria-label="Delete ${esc(x.title)}">${I.trash}</button></td></tr>`).join("")}</tbody></table></div>`)}</div>` : ""}</main>`;
  const up = () => { if (!url) return; $("#pn").textContent = "Page " + pg; $("#zv").textContent = zoom + "%"; $("#pdf").src = `${url}#page=${pg}&zoom=${zoom}` };
  if (url) { up(); $("#pv").onclick = () => { pg = Math.max(1, pg - 1); up() }; $("#nx").onclick = () => { pg++; up() }; $("#zo").onclick = () => { zoom = Math.max(50, zoom - 25); up() }; $("#zi").onclick = () => { zoom += 25; up() }; $("#fs").onclick = () => $("#pdf").requestFullscreen?.() }
  [$("#ap"), $("#ap2")].forEach(b => b && (b.onclick = () => matForm(m.id, null)));
  $$("[data-v]").forEach(b => b.onclick = () => { CUR[id] = b.dataset.v; moduleDetails(id) });
  $$("[data-me]").forEach(b => b.onclick = () => matForm(m.id, S.M.find(x => x.id === b.dataset.me)));
  $$("[data-md]").forEach(b => b.onclick = () => { const x = S.M.find(y => y.id === b.dataset.md); confirmDel("DELETE STUDY MATERIAL?", x.fileName || x.title, "Delete PDF", () => { S.M = S.M.filter(y => y.id !== x.id); saveM(); toast("Study material deleted successfully"); moduleDetails(id) }) });
  $$("[data-dw]").forEach(b => b.onclick = () => { const x = S.M.find(y => y.id === b.dataset.dw), a = document.createElement("a"); a.href = x.fileData; a.download = x.fileName; a.click() })
}
function matForm(mid, init) {
  const o = modules.map(m => `<option value="${m.id}" ${m.id === (init?.moduleId || mid) ? "selected" : ""}>${m.title}</option>`).join("");
  modal(init ? "EDIT STUDY MATERIAL" : "ADD STUDY MATERIAL", `<label class="f"><span>MODULE</span><select class="inp" id="mm_">${o}</select></label><label class="f"><span>PDF TITLE</span><input class="inp" id="mt" value="${esc(init?.title || "")}"/></label><label class="f"><span>DESCRIPTION (optional)</span><textarea class="inp" id="md_" rows="2">${esc(init?.description || "")}</textarea></label>${init ? "" : `<label class="f"><span>PDF FILE</span><input type="file" class="inp" id="mf" accept=".pdf,application/pdf"/></label>`}<p class="err" id="er" role="alert"></p><div class="ft"><button class="btn" data-close>Cancel</button><button class="btn p" id="sv">${init ? "Save Changes" : "Add PDF"}</button></div>`);
  $("#sv").onclick = async () => {
    const err = t => $("#er").textContent = t, f = { title: $("#mt").value.trim(), description: $("#md_").value, moduleId: $("#mm_").value }; if (!f.title) return err("Please enter a title.");
    if (init) { Object.assign(init, f); if (!saveM()) return; toast("PDF updated successfully"); closeModal(); return moduleDetails(mid) }
    const file = $("#mf").files[0]; if (!file) return err("Please select a PDF file."); if (file.size === 0) return err("The selected file is empty."); if (file.type !== "application/pdf" || !/\.pdf$/i.test(file.name)) return err("Only PDF files are supported."); if (file.size > MAX) return err(TOOBIG);
    try { const fileData = await readFile(file); const rec = { ...f, id: crypto.randomUUID(), fileName: file.name, fileType: file.type, fileSize: file.size, fileData, pages: null, uploadedAt: new Date().toISOString() }; S.M.push(rec); if (!saveM()) { S.M.pop(); return err(TOOBIG) } CUR[rec.moduleId] = rec.id; toast("PDF uploaded successfully"); closeModal(); moduleDetails(mid) } catch (x) { err(x.message) }
  }
}
let OURL = null;
function viewer(id) {
  const m = S.M.find(x => x.id === id); if (!m) return app.innerHTML = `<main class="wrap">${empty("Material not found", "It may have been deleted.", `<a class="btn" href="#/modules">Back to Modules</a>`)}</main>`;
  let pg = 1, zoom = 100, url = null, err = ""; if (m.fileData) { try { url = blobUrl(m.fileData); OURL = url } catch { err = "Unable to load material. Try again." } }
  app.innerHTML = `<main class="wrap">${crumbs([["Home", "#/"], ["Modules", "#/modules"], [m.moduleId.replace("module-", "Module "), `#/modules/${m.moduleId}`], [esc(m.title)]])}<h1 style="font-size:1.9rem">${esc(m.title)}</h1><p class="mute sm">${esc(m.description || m.fileName)}</p><div class="glass sm" style="display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;padding:.5rem .75rem;border-radius:.25rem;margin:1rem 0 .5rem"><button id="pp" aria-label="Previous page">◀</button><span id="pn">Page 1</span><button id="pnx" aria-label="Next page">▶</button><span>|</span><button id="zo" aria-label="Zoom out">−</button><span id="zv">100%</span><button id="zi" aria-label="Zoom in">+</button>${url ? `<span style="margin-left:auto;display:flex;gap:.75rem"><a href="${url}" download="${esc(m.fileName)}" aria-label="Download">⬇</a><a href="${url}" target="_blank" rel="noreferrer" aria-label="Open in new tab">↗</a><button id="fs" aria-label="Full screen">⛶</button></span>` : ""}</div>
  ${err ? `<p class="err" role="alert">${err}</p>` : url ? `<iframe id="pdf" title="${esc(m.title)}" style="width:100%;height:75vh;border:1px solid var(--line);border-radius:.25rem;background:#fff"></iframe>` : empty("No file attached", "This is seeded sample metadata. Upload a PDF in Management Mode, or connect real files via a storage service.")}</main>`;
  const up = () => { $("#pn").textContent = "Page " + pg; $("#zv").textContent = zoom + "%"; if (url) $("#pdf").src = `${url}#page=${pg}&zoom=${zoom}` }; up();
  $("#pp").onclick = () => { pg = Math.max(1, pg - 1); up() }; $("#pnx").onclick = () => { pg++; up() }; $("#zo").onclick = () => { zoom = Math.max(50, zoom - 25); up() }; $("#zi").onclick = () => { zoom += 25; up() }; $("#fs") && ($("#fs").onclick = () => $("#pdf").requestFullscreen?.())
}
function toolsPage() { const cats = [...new Set(tools.map(t => t.category))]; app.innerHTML = `<main class="wrap"><h1>TOOLS</h1><p class="mute" style="margin-bottom:2rem">The Data Science toolchain.</p>${cats.map(c => sec(c.toUpperCase(), tools.filter(t => t.category === c).map(t => `<div class="row" style="flex-wrap:wrap"><span class="logo" style="width:2.25rem;height:2.25rem">${t.name[0]}</span><div class="grow"><a href="#/tools/${t.id}" style="font-weight:500">${t.name}</a><div class="mute sm">${t.description}</div></div><a class="ac sm" href="${t.docs}" target="_blank" rel="noreferrer"> </a><a class="mute sm" href="${t.website}" target="_blank" rel="noreferrer">Official Website →</a></div>`).join(""))).join("")}</main>` }
function toolDetails(id) {
  const t = tools.find(x => x.id === id); if (!t) return app.innerHTML = `<main class="wrap">${empty("Tool not found", "", `<a class="btn" href="#/tools">Back</a>`)}</main>`; const used = S.E.filter(e => e.tools.some(x => x.toLowerCase() === t.name.toLowerCase()));
  app.innerHTML = `<main class="wrap">${crumbs([["Home", "#/"], ["Tools", "#/tools"], [t.name]])}<h1>${t.name.toUpperCase()}</h1><p class="ac" style="margin-bottom:2.5rem">${t.category}</p>${sec("OVERVIEW", `<p>${t.description}</p>`)}${sec("INSTALLATION", code(t.install, "TERMINAL"))}${t.usage ? sec("BASIC USAGE", code(t.usage)) : ""}
  ${sec("EXPERIMENTS USING THIS TOOL", used.length ? used.map(e => `<a class="row" href="#/experiments/${e.id}/overview" style="padding:.75rem .5rem">${esc(e.number)} — ${esc(e.title)}</a>`).join("") : `<p class="mute sm">No experiments use this tool yet.</p>`)}${sec("DOCUMENTATION", `<a class="ac" href="${t.docs}" target="_blank" rel="noreferrer">Documentation →</a> &nbsp; <a class="mute" href="${t.website}" target="_blank" rel="noreferrer">Official Website →</a>`)}</main>`
}
const notFound = () => app.innerHTML = `<main class="wrap"><div class="c" style="padding:6rem 0"><div style="font-size:6rem;font-weight:700">404</div><p class="mute">Page Not Found</p><a class="btn p" href="#/">Return Home</a></div></main>`;

/* ---------- resources and student profile ---------- */
function resourcesPage(){
 const resources=LS.get("mbu_resources",[]);
 app.innerHTML=`<main class="wrap"><div class="resource-head"><div><p class="ac t">LEARNING LIBRARY</p><h1>RESOURCES</h1><p class="mute">Useful notes, links, PDFs, datasets and references for your Data Science learning.</p></div><button class="btn p" id="add-resource">+ ADD RESOURCE</button></div><div class="resource-grid">${resources.map(r=>`<article class="glass resource-card"><div class="ac t">${esc(r.type||"LINK")}</div><h3>${esc(r.title)}</h3><p class="mute sm">${esc(r.description||"")}</p>${r.url?`<a class="btn" href="${esc(r.url)}" target="_blank" rel="noreferrer">Open resource ↗</a>`:""}${r.fileData?`<a class="btn" href="${r.fileData}" download="${esc(r.fileName||r.title)}">Download file ↓</a>`:""}<button class="btn d" data-resource-delete="${r.id}">Remove</button></article>`).join("")}</div>${resources.length ? "" : `<div class="c glass"><h3>No resources added yet</h3><p class="mute">Use Add Resource to save links, notes or PDFs here.</p></div>`}</main>`;
 $("#add-resource").onclick=()=>{modal("ADD RESOURCE",`<label class="f"><span>TITLE</span><input class="inp" id="rt" required placeholder="Python documentation"/></label><label class="f"><span>TYPE</span><select class="inp" id="rtype"><option>Link</option><option>PDF</option><option>Dataset</option><option>Notes</option><option>Video</option></select></label><label class="f"><span>DESCRIPTION</span><textarea class="inp" id="rd" rows="2"></textarea></label><label class="f"><span>URL (optional)</span><input class="inp" id="ru" type="url" placeholder="https://..."/></label><label class="f"><span>FILE (optional)</span><input class="inp" id="rf" type="file" accept=".pdf,.csv,.txt,.ipynb,.py,.java,.zip"/></label><p class="err" id="re"></p><div class="ft"><button class="btn" data-close>Cancel</button><button class="btn p" id="rsave">Save Resource</button></div>`,true);
 $("#rsave").onclick=async()=>{const title=$("#rt").value.trim(), file=$("#rf").files[0], url=$("#ru").value.trim(); if(!title)return $("#re").textContent="Enter a title."; if(!url&&!file)return $("#re").textContent="Add a URL or choose a file."; if(file&&file.size>2*1024*1024)return $("#re").textContent="File limit is 2 MB for browser storage."; const rec={id:crypto.randomUUID(),title,type:$("#rtype").value,description:$("#rd").value,url,fileName:file?.name||"",fileData:file?await readFile(file):""};resources.push(rec); if(!LS.set("mbu_resources",resources))return $("#re").textContent="Browser storage is full; use a smaller file.";closeModal();resourcesPage();};};
 $$('[data-resource-delete]').forEach(b=>b.onclick=()=>{const next=resources.filter(r=>r.id!==b.dataset.resourceDelete);LS.set("mbu_resources",next);resourcesPage()});
}
function openProfile(){
 const resume=LS.get("mbu_resume",{headline:"Data Science Student",summary:"Interested in data analysis, machine learning and software development.",skills:"Python, Java, SQL, Pandas, NumPy",education:"B.Tech — Data Science, Mohan Babu University",projects:"IoT-based Smart Health Monitoring & Alert System"});
 modal("STUDENT PROFILE",`<div class="profile-layout"><div>${idCard()}</div><section class="resume-panel"><div class="resource-head"><h2>MY RESUME</h2><button class="btn p" id="edit-resume">EDIT RESUME</button></div><h3>${esc(student.name)}</h3><p class="ac">${esc(resume.headline)}</p><h4>PROFILE</h4><p>${esc(resume.summary)}</p><h4>EDUCATION</h4><p>${esc(resume.education)}</p><h4>SKILLS</h4><p>${esc(resume.skills)}</p><h4>PROJECTS</h4><p>${esc(resume.projects)}</p><button class="btn" id="print-resume">Print / Save Resume as PDF</button></section></div>`,true);
 // Make only the profile modal full-screen; other dialogs keep their existing layout.
 $("#modal .ov").classList.add("profile-overlay");
 $("#modal .box").classList.add("profile-fullscreen");
 const photoInput=$("#ph"); if(photoInput)photoInput.onchange=async()=>{const f=photoInput.files[0];if(!f)return;const data=await readFile(f);LS.set("mbu_photo",data);openProfile()};
 $("#edit-resume").onclick=()=>{modal("EDIT RESUME",`<label class="f"><span>HEADLINE</span><input class="inp" id="rh" value="${esc(resume.headline)}"/></label><label class="f"><span>SUMMARY</span><textarea class="inp" id="rs" rows="3">${esc(resume.summary)}</textarea></label><label class="f"><span>EDUCATION</span><textarea class="inp" id="red" rows="2">${esc(resume.education)}</textarea></label><label class="f"><span>SKILLS</span><textarea class="inp" id="rskills" rows="2">${esc(resume.skills)}</textarea></label><label class="f"><span>PROJECTS</span><textarea class="inp" id="rprojects" rows="3">${esc(resume.projects)}</textarea></label><div class="ft"><button class="btn" data-close>Cancel</button><button class="btn p" id="save-resume">Save Resume</button></div>`);$("#save-resume").onclick=()=>{LS.set("mbu_resume",{headline:$("#rh").value,summary:$("#rs").value,education:$("#red").value,skills:$("#rskills").value,projects:$("#rprojects").value});openProfile()};};
 $("#print-resume").onclick=()=>window.print();
}

/* ---------- router ---------- */
function route() {
  document.removeEventListener("keydown", KV); if (OURL) { URL.revokeObjectURL(OURL); OURL = null } const p = (location.hash || "#/").slice(2).split("/").filter(Boolean); drawHeader(); window.scrollTo(0, 0);
  if (!p.length) home(); else if (p[0] === "modules") p[1] ? moduleDetails(p[1]) : modulesPage(); else if (p[0] === "experiments") { if (!p[1]) experiments(); else if (!p[2] || p[2] === "overview") (p[2] ? overview(p[1]) : (location.replace(`#/experiments/${p[1]}/overview`))); else subexp(p[1], p[2]) }
  else if (p[0] === "tools") p[1] ? toolDetails(p[1]) : toolsPage(); else if (p[0] === "resources") resourcesPage(); else if (p[0] === "materials" && p[1]) viewer(p[1]); else notFound()
}
document.addEventListener("click", e => { const b = e.target.closest("[data-copy]"); if (b) { navigator.clipboard?.writeText(b.dataset.copy); b.textContent = "Copied"; setTimeout(() => b.textContent = "Copy Code", 1500) } });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal() });
window.addEventListener("hashchange", route); applyTheme(); route();

/* ---------- subtle particle background (disabled on mobile / reduced motion) ---------- */
(() => {
  const c = $("#bg"); if (innerWidth < 768 || matchMedia("(prefers-reduced-motion: reduce)").matches) { c.remove(); return } const x = c.getContext("2d"); let w, h, mx = 0, my = 0; const P = [...Array(70)].map(() => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .0002, vy: (Math.random() - .5) * .0002 }));
  const rs = () => { w = c.width = innerWidth; h = c.height = innerHeight }; rs(); addEventListener("resize", rs); addEventListener("mousemove", e => { mx = e.clientX / w - .5; my = e.clientY / h - .5 });
  (function f() {
    x.clearRect(0, 0, w, h); P.forEach(p => { p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1; p.px = p.x * w + mx * 30; p.py = p.y * h + my * 30; x.fillStyle = "rgba(125,211,252,.55)"; x.fillRect(p.px, p.py, 2, 2) });
    x.strokeStyle = "rgba(99,102,241,.15)"; for (let i = 0; i < P.length; i++)for (let j = i + 1; j < P.length; j++) { const d = Math.hypot(P[i].px - P[j].px, P[i].py - P[j].py); if (d < 120) { x.beginPath(); x.moveTo(P[i].px, P[i].py); x.lineTo(P[j].px, P[j].py); x.stroke() } } requestAnimationFrame(f)
  })()
})();
