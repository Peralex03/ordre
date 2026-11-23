/* Ordre : de l'appréhension du problème à la donnée d'ordres. Interface. Tout reste sur l'appareil. */
'use strict';
(() => {
const M = METHOD;
const store = makeStore('ordre.v1', { list: [], cur: '', step: 'pb', big: false });
const D = store.data;
const str = (v, n) => typeof v === 'string' ? v.slice(0, n || 2000) : '';
const arr = (v, f, n) => (Array.isArray(v) ? v : []).slice(0, n || 40).map(f).filter(Boolean);
function fix(o) {
  if (!o || typeof o !== 'object') return null;
  const g = (a, b) => (a && typeof a === 'object' ? a : {})[b];
  const q = { id: str(o.id, 24) || uid(), title: str(o.title, 60) || 'Nouvel ordre', at: Number.isFinite(o.at) ? o.at : Date.now(),
    pb: { event: str(g(o.pb, 'event')), running: str(g(o.pb, 'running')), missing: str(g(o.pb, 'missing')), parts: arr(g(o.pb, 'parts'), x => x && str(x.t, 300) ? { t: str(x.t, 300), p: [1, 2, 3].includes(x.p) ? x.p : 2, who: str(x.who, 60) } : null, 12) },
    urg: arr(o.urg, x => x && str(x.t, 300) ? { t: str(x.t, 300), ok: !!x.ok } : null),
    time: { recv: str(g(o.time, 'recv'), 5), exec: str(g(o.time, 'exec'), 5), items: arr(g(o.time, 'items'), x => x && (str(x.t, 200) || str(x.h, 5)) ? { h: str(x.h, 5), t: str(x.t, 200) } : null) },
    app: {}, dec: { v1: str(g(o.dec, 'v1')), v2: str(g(o.dec, 'v2')), pick: g(o.dec, 'pick') === 2 ? 2 : 1, minus: str(g(o.dec, 'minus')), pr: arr(g(o.dec, 'pr'), x => typeof x === 'string' ? x : null, 8) },
    intent: str(o.intent), concept: str(o.concept),
    o: { terrain: str(g(o.o, 'terrain')), adv: str(g(o.o, 'adv')), mission: str(g(o.o, 'mission')), voisins: str(g(o.o, 'voisins')) },
    missions: arr(o.missions, x => x && (str(x.who, 60) || str(x.what)) ? { who: str(x.who, 60), what: str(x.what) } : null, 20),
    disp: {}, empl: str(o.empl), si: str(o.si), ecart: str(o.ecart), debrief: str(o.debrief) };
  for (const f of M.steps.find(s => s.k === 'app').factors) q.app[f.k] = arr(g(o.app, f.k), x => x && (str(x.f, 400) || str(x.d, 400) || str(x.c, 400)) ? { f: str(x.f, 400), d: str(x.d, 400), c: str(x.c, 400) } : null, 12);
  for (const [k] of M.dispo) { const v = str(g(o.disp, k), 600); if (v) q.disp[k] = v; }
  return q;
}
D.list = D.list.map(fix).filter(Boolean);
const cur = () => D.list.find(o => o.id === D.cur) || null;
const save = () => store.save();
const hm = s => { const m = /^(\d{1,2}):(\d{2})$/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : null; };
const fhm = m => { m = ((Math.round(m) % 1440) + 1440) % 1440; return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`; };
const fDur = m => { m = Math.round(m); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${pad2(m % 60)}`; };

const app = $('#app');
const VIEWS = [...M.steps.map(s => s.k), 'out'];
if (!VIEWS.includes(D.step)) D.step = 'pb';

/* ---------- briques ---------- */
const area = (obj, key, ph, rows) => textField(obj[key], v => { obj[key] = v; save(); }, { area: true, rows: rows || 2, ph, max: 2000, spell: true });
function helpCard(s) {
  const kids = [h('p', { class: 'lead', text: s.lead })];
  if (s.guide) kids.push(h('ul', { class: 'guide' }, ...s.guide.map(q => h('li', { text: q }))));
  if (s.rules) kids.push(h('details', null, h('summary', { text: s.rules.t }), h('ul', { class: 'guide' }, ...s.rules.l.map(q => h('li', { text: q })))));
  kids.push(h('p', { class: 'ref', text: `${M.source} · ${s.ref}` }));
  return h('div', { class: 'card help' }, ...kids);
}
/* liste modifiable : une carte par élément, ajout en bas */
function listEdit(list, draw, make, addLabel, max) {
  const box = h('div');
  const redraw = () => box.replaceChildren(...list.map((x, i) => h('div', { class: 'card item' }, ...[].concat(draw(x)), h('button', { type: 'button', class: 'del', 'aria-label': 'Retirer', html: icon('x'), onclick: () => { list.splice(i, 1); save(); redraw(); } }))),
    list.length < (max || 20) ? h('button', { type: 'button', class: 'btn sec wide add', html: icon('plus') + `<span>${esc(addLabel)}</span>`, onclick: () => { list.push(make()); save(); redraw(); const f = box.querySelectorAll('.item')[list.length - 1]; if (f) { const t = f.querySelector('textarea,input'); if (t) t.focus(); } } }) : '');
  redraw();
  return box;
}

/* ---------- accueil : les ordres de l'appareil ---------- */
function viewHome() {
  app.classList.remove('tabbed');
  const main = h('div', { class: 'main' });
  main.append(h('div', { class: 'acts', style: 'margin-top:4px' },
    h('button', { type: 'button', class: 'btn', html: icon('plus') + '<span>Nouvel ordre</span>', onclick: () => { const o = fix({}); D.list.unshift(o); D.cur = o.id; D.step = 'pb'; save(); render(); } }),
    h('button', { type: 'button', class: 'btn sec', style: 'flex:0 0 auto', html: icon('import') + '<span>Fichier</span>', onclick: async () => { const f = await pickFile('.json,application/json'); if (!f) return; const d = readFileData('ordre', f.text); if (d) incoming(d); else toast('Ce fichier n’est pas un ordre'); } })));
  if (!D.list.length) main.append(h('div', { class: 'empty' }, h('b', { text: 'Aucun ordre' }), 'L’app suit les activités de conduite dans l’ordre : problème, mesures d’urgence et plan horaire, appréciation, décision, plan, donnée d’ordres, suivi.'));
  else main.append(h('div', { class: 'label', text: 'Sur cet appareil' }), h('div', { class: 'list' }, ...D.list.map(o => h('button', { type: 'button', class: 'row', onclick: () => { D.cur = o.id; save(); render(); } },
    h('div', { class: 't' }, h('b', { text: o.title }), h('small', { text: `${new Date(o.at).toLocaleDateString('fr-CH')} · ${progress(o)} étapes sur ${M.steps.length} commencées` })), h('span', { class: 'chev', html: icon('chev') })))));
  main.append(h('p', { class: 'note', text: `Canevas : ${M.source}. ${M.note}` }),
    h('p', { class: 'note', text: 'Rien ne quitte ce téléphone sans un partage volontaire. Ne pas y saisir d’informations classifiées : l’app est un outil d’instruction et de préparation.' }));
  app.replaceChildren(h('header', { class: 'head' }, h('h1', { text: 'Ordre' })), main);
}
const filled = { pb: o => o.pb.event || o.pb.running || o.pb.missing || o.pb.parts.length, urg: o => o.urg.length || o.time.items.length || o.time.exec, app: o => Object.values(o.app).some(l => l.length), dec: o => o.dec.v1 || o.dec.v2, plan: o => o.intent || o.concept || o.si, ord: o => o.o.terrain || o.o.adv || o.o.mission || o.missions.length || o.empl || Object.keys(o.disp).length, suivi: o => o.ecart || o.debrief };
const progress = o => M.steps.filter(s => filled[s.k](o)).length;

/* ---------- un ordre : étapes ---------- */
function viewOrder() {
  const o = cur(), main = h('div', { class: 'main' });
  const title = h('h1', { class: 'sm', text: o.title });
  const head = h('header', { class: 'head' }, h('button', { type: 'button', class: 'iconbtn', 'aria-label': 'Tous les ordres', html: icon('back'), onclick: () => { D.cur = ''; save(); render(); } }), title,
    h('button', { type: 'button', class: 'iconbtn', 'aria-label': 'Nom, copie, suppression', html: icon('edit'), onclick: () => openMeta(o) }));
  const nav = h('div', { class: 'steps' }, ...M.steps.map(s => h('button', { type: 'button', class: 'stp' + (D.step === s.k ? ' on' : '') + (filled[s.k](o) ? ' done' : ''), 'data-k': s.k, onclick: () => go(s.k) }, h('i', { text: String(s.n) }), h('span', { text: s.short }))),
    h('button', { type: 'button', class: 'stp out' + (D.step === 'out' ? ' on' : ''), 'data-k': 'out', onclick: () => go('out') }, h('i', { html: icon('flag') }), h('span', { text: 'Fiche' })));
  const go = k => { D.step = k; save(); render(); };
  const s = M.steps.find(x => x.k === D.step);
  if (s) { main.append(h('h2', { class: 'stitle', text: s.t }), helpCard(s), ...STEP[s.k](o)); }
  else main.append(...viewOut(o));
  const i = VIEWS.indexOf(D.step);
  main.append(h('div', { class: 'acts nextrow' },
    i > 0 ? h('button', { type: 'button', class: 'btn sec', html: icon('back') + '<span>Précédent</span>', onclick: () => go(VIEWS[i - 1]) }) : null,
    i < VIEWS.length - 1 ? h('button', { type: 'button', class: 'btn', text: i === VIEWS.length - 2 ? 'Voir la fiche d’ordre' : 'Suivant', onclick: () => go(VIEWS[i + 1]) }) : null));
  app.replaceChildren(head, nav, main);
  const on = nav.querySelector('.on'); if (on) on.scrollIntoView({ inline: 'center', block: 'nearest' });
}
const STEP = {
  pb: o => [h('div', { class: 'label', text: 'De quoi s’agit-il ?' }), area(o.pb, 'event', 'Mission reçue, événement ou changement de situation ; objectif, état final recherché, délais', 3),
    h('div', { class: 'label', text: 'Informations manquantes' }), area(o.pb, 'missing', 'Ce qu’il faut encore savoir, et auprès de qui'),
    h('div', { class: 'label', text: 'Déjà en cours' }), area(o.pb, 'running', 'Activités en cours, dont il faut tenir compte'),
    h('div', { class: 'label', text: 'Problèmes partiels' }),
    listEdit(o.pb.parts, x => [textField(x.t, v => { x.t = v; save(); }, { area: true, rows: 1, ph: 'Problème partiel, tâche à résoudre', max: 300, spell: true }),
      h('div', { class: 'chk', style: 'margin-top:8px' }, seg([[1, 'Priorité 1'], [2, '2'], [3, '3']], x.p, v => { x.p = v; save(); }), textField(x.who, v => { x.who = v; save(); }, { ph: 'Qui s’en charge', max: 60 }))], () => ({ t: '', p: 2, who: '' }), 'Problème partiel', 12),
    h('p', { class: 'note', text: 'La priorité traduit l’importance et l’urgence : ce qui se passe si la solution est remise à plus tard.' })],
  urg: o => {
    const calc = h('p', { class: 'note' });
    const upd = () => { const a = hm(o.time.recv), b = hm(o.time.exec); if (a == null || b == null) { calc.textContent = 'Avec l’heure de réception et l’heure d’exécution, l’app indique le temps disponible.'; return; } const tot = ((b - a) % 1440 + 1440) % 1440 || 1440;
      calc.textContent = `Temps disponible : ${fDur(tot)}. Règle des quarts : ${fDur(tot / 4)} pour sa propre planification, soit une donnée d’ordres au plus tard à ${fhm(a + tot / 4)} ; les subordonnés gardent ${fDur(tot * 3 / 4)}.`; };
    const t = (k, lab) => h('input', { class: 'field time', type: 'time', value: o.time[k], 'aria-label': lab, onchange: e => { o.time[k] = e.target.value; save(); upd(); } });
    upd();
    return [h('div', { class: 'label', text: 'Mesures d’urgence' }),
      listEdit(o.urg, x => [h('div', { class: 'chk' }, sw(x.ok, v => { x.ok = v; save(); }), textField(x.t, v => { x.t = v; save(); }, { area: true, rows: 1, ph: 'Qui fait quoi, tout de suite', max: 300 }))], () => ({ t: '', ok: false }), 'Mesure d’urgence'),
      h('div', { class: 'label', text: 'Plan horaire' }), h('div', { class: 'card' }, frow('Mission reçue à', null, t('recv', 'Heure de réception')), frow('Exécution à', null, t('exec', 'Heure d’exécution'))), calc,
      listEdit(o.time.items, x => [h('div', { class: 'chk' }, h('input', { class: 'field time', type: 'time', value: x.h, 'aria-label': 'Heure', onchange: e => { x.h = e.target.value; save(); } }), textField(x.t, v => { x.t = v; save(); }, { ph: 'Activité (reconnaissance, donnée d’ordres, contrôle…)', max: 200 }))], () => ({ h: '', t: '' }), 'Échéance', 30)];
  },
  app: o => { const out = [];
    for (const f of M.steps.find(s => s.k === 'app').factors) out.push(h('div', { class: 'label', text: f.t }), h('details', { class: 'qs' }, h('summary', { text: 'Questions guides' }), h('ul', { class: 'guide' }, ...f.q.map(q => h('li', { text: q })))),
      listEdit(o.app[f.k], x => [h('div', { class: 'cons', style: 'margin-top:0' }, h('span', { text: 'É' }), textField(x.f, v => { x.f = v; save(); }, { area: true, rows: 1, ph: 'Énoncé : fait, donnée, chiffre', max: 400, spell: true })), h('div', { class: 'cons' }, h('span', { text: 'D' }), textField(x.d, v => { x.d = v; save(); }, { area: true, rows: 1, ph: 'Déduction : ce que cela signifie', max: 400, spell: true })), h('div', { class: 'cons' }, h('span', { text: 'C' }), textField(x.c, v => { x.c = v; save(); }, { area: true, rows: 1, ph: 'Conséquence concrète pour l’action', max: 400, spell: true }))], () => ({ f: '', d: '', c: '' }), 'Énoncé', 12));
    return out; },
  dec: o => { const s = M.steps.find(x => x.k === 'dec');
    return [h('div', { class: 'label', text: 'Variante 1' }), area(o.dec, 'v1', 'Nom de code, tâches essentielles, effort principal, forces et faiblesses'), h('div', { class: 'label', text: 'Variante 2' }), area(o.dec, 'v2', 'Nom de code, tâches essentielles, effort principal, forces et faiblesses'),
      h('div', { class: 'label', text: 'Choix' }), seg([[1, 'Variante 1'], [2, 'Variante 2']], o.dec.pick, v => { o.dec.pick = v; save(); }),
      h('div', { class: 'label', text: 'Désavantages de la solution retenue' }), area(o.dec, 'minus', 'Ce que l’adversaire pourrait exploiter, et comment y parer'),
      h('div', { class: 'label', text: 'Principes d’engagement respectés' }), h('div', { class: 'list' }, ...s.principles.map(p => h('div', { class: 'row' }, h('div', { class: 't' }, h('b', { text: p })), sw(o.dec.pr.includes(p), v => { o.dec.pr = o.dec.pr.filter(x => x !== p); if (v) o.dec.pr.push(p); save(); }))))]; },
  plan: o => [h('div', { class: 'label', text: 'Intention' }), area(o, 'intent', 'Je veux… (ce qui doit être atteint, en une ou deux phrases)', 3),
    o.dec[o.dec.pick === 2 ? 'v2' : 'v1'] ? h('p', { class: 'note', text: `Solution retenue : ${o.dec[o.dec.pick === 2 ? 'v2' : 'v1']}` }) : null,
    h('div', { class: 'label', text: 'Déroulement' }), area(o, 'concept', 'Phases de l’action : dans une première phase… ; ensuite…', 4),
    h('div', { class: 'label', text: 'Planification prévisionnelle' }), area(o, 'si', 'Si… alors… : évolutions possibles et décisions réservées', 3)].filter(Boolean),
  ord: o => { const out = [], O = M.order[0];
    out.push(h('div', { class: 'label', text: '1 · Orientation' }));
    for (const [k, t, ph] of O.sub) out.push(h('div', { class: 'sublab', text: t }), area(o.o, k, ph));
    out.push(h('div', { class: 'label', text: '2 · Intention' }), area(o, 'intent', 'Je veux…', 3));
    out.push(h('div', { class: 'label', text: '3 · Missions' }), h('details', { class: 'qs' }, h('summary', { text: 'Ce que précise chaque type de mission' }), h('ul', { class: 'guide' }, ...M.missionTypes.map(m => h('li', null, h('b', { text: m[1] + ' : ' }), m[2])))),
      listEdit(o.missions, x => [textField(x.who, v => { x.who = v; save(); }, { ph: 'À qui (équipe, groupe, nom)', max: 60 }), h('div', { style: 'margin-top:8px' }, textField(x.what, v => { x.what = v; save(); }, { area: true, rows: 2, ph: 'Mission, si nécessaire phase par phase', max: 2000, spell: true }))], () => ({ who: '', what: '' }), 'Mission'));
    out.push(h('div', { class: 'label', text: '4 · Dispositions particulières' }), h('p', { class: 'note', style: 'margin-top:0', text: 'Ne remplir que les points nécessaires à l’action.' }));
    for (const [k, t] of M.dispo) { const open = !!o.disp[k]; const f = textField(o.disp[k] || '', v => { if (v.trim()) o.disp[k] = v; else delete o.disp[k]; save(); }, { area: true, rows: 1, ph: t, max: 600, spell: true });
      out.push(h('details', { class: 'disp', open: open ? true : null }, h('summary', { text: t }), f)); }
    out.push(h('div', { class: 'label', text: '5 · Emplacements des installations de conduite' }), area(o, 'empl', M.order[4].hint));
    return out; },
  suivi: o => [h('div', { class: 'label', text: 'État voulu, état réel' }), area(o, 'ecart', 'Écarts constatés et corrections', 3), h('div', { class: 'label', text: 'Débriefing' }), area(o, 'debrief', 'Ce qui a bien marché, ce qui est à corriger, enseignements', 4)]
};

/* ---------- fiche d'ordre : ce qui se dit devant la troupe ---------- */
let short = false;
function orderParts(o, brief) {
  const P = [], sub = M.order[0].sub.map(([k, t]) => [t, o.o[k]]).filter(x => x[1].trim());
  if (sub.length) P.push({ n: 1, t: 'Orientation', sub });
  if (o.intent.trim()) P.push({ n: 2, t: 'Intention', text: o.intent + (o.concept.trim() && !brief ? '\n' + o.concept : '') });
  const ms = o.missions.filter(m => m.who.trim() || m.what.trim());
  if (ms.length) P.push({ n: 3, t: 'Missions', sub: ms.map(m => [m.who || 'Mission', m.what]) });
  if (!brief) { const d = M.dispo.map(([k, t]) => [t, o.disp[k] || '']).filter(x => x[1].trim()); if (d.length) P.push({ n: 4, t: 'Dispositions particulières', sub: d }); if (o.empl.trim()) P.push({ n: 5, t: 'Emplacements', text: o.empl }); }
  return P;
}
const orderText = (o, brief) => [o.title.toUpperCase(), ...orderParts(o, brief).map(p => `\n${p.n}. ${p.t.toUpperCase()}\n` + (p.text || p.sub.map(([a, b]) => `${a} : ${b}`).join('\n')))].join('\n');
function viewOut(o) {
  const P = orderParts(o, short), out = [h('h2', { class: 'stitle', text: 'Fiche d’ordre' })];
  out.push(seg([[false, 'Cinq points'], [true, 'Sous pression de temps']], short, v => { short = v; render(); }),
    h('p', { class: 'note', text: short ? 'Schéma raccourci : orientation, intention, missions.' : 'Orientation, intention, missions, dispositions particulières, emplacements.' }));
  if (!P.length) { out.push(h('div', { class: 'empty' }, h('b', { text: 'Fiche vide' }), 'Elle se remplit à partir de l’étape 5, Donnée d’ordres.')); return out; }
  out.push(h('div', { class: 'sheetdoc' + (D.big ? ' bigtxt' : '') }, ...P.map(p => h('section', null, h('h3', null, h('i', { text: String(p.n) }), p.t), p.text ? h('p', { text: p.text }) : h('dl', null, ...p.sub.flatMap(([a, b]) => [h('dt', { text: a }), h('dd', { text: b })]))))));
  const miss = M.order.filter(x => !P.some(p => p.n === x.n) && !(short && x.n > 3)).map(x => x.t.toLowerCase());
  if (miss.length) out.push(h('p', { class: 'warn', text: `Points encore vides : ${miss.join(', ')}.` }));
  out.push(frow('Grands caractères', 'Pour lire l’ordre à voix haute', sw(D.big, v => { D.big = v; save(); render(); })));
  out.push(h('div', { class: 'acts' },
    h('button', { type: 'button', class: 'btn sec', html: icon('copy') + '<span>Copier</span>', onclick: () => copyText(orderText(o, short), 'Ordre copié') }),
    h('button', { type: 'button', class: 'btn sec', html: icon('print') + '<span>PDF</span>', onclick: () => doPrint(o) }),
    h('button', { type: 'button', class: 'btn sec', html: icon('share') + '<span>QR</span>', onclick: () => shareSheet('Partager l’ordre', 'ordre', o, slug(o) + '.json') })));
  out.push(h('p', { class: 'note', text: 'Le QR et le fichier contiennent tout le dossier (appréciation, décision, ordre). À ne partager qu’avec les personnes concernées.' }));
  return out;
}
const slug = o => o.title.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_') || 'ordre';
function doPrint(o) {
  const nodes = [h('h1', { text: o.title }), h('div', { class: 'meta', text: `Ordre en ${short ? 'trois' : 'cinq'} points · établi le ${new Date().toLocaleDateString('fr-CH')}` })];
  for (const p of orderParts(o, short)) { nodes.push(h('h2', { text: `${p.n}. ${p.t}` })); if (p.text) for (const l of p.text.split('\n')) nodes.push(h('p', { text: l })); else nodes.push(h('table', null, h('tbody', null, ...p.sub.map(([a, b]) => h('tr', null, h('th', { style: 'width:28%', text: a }), h('td', { style: 'white-space:pre-wrap', text: b })))))); }
  const tl = o.time.items.filter(x => x.t).sort((a, b) => (hm(a.h) ?? 1e9) - (hm(b.h) ?? 1e9));
  if (tl.length && !short) nodes.push(h('h2', { text: 'Plan horaire' }), h('table', null, h('tbody', null, ...tl.map(x => h('tr', null, h('th', { style: 'width:16%', text: x.h }), h('td', { text: x.t }))))));
  nodes.push(h('div', { class: 'foot', text: 'Établi avec Ordre, d’après le canevas des règlements 50.040 et 51.019.' }));
  printDoc(nodes);
}
function openMeta(o) {
  openSheet('Ordre', [textField(o.title, v => { o.title = v.trim().slice(0, 60) || 'Nouvel ordre'; save(); }, { ph: 'Titre de l’ordre', max: 60 }),
    h('div', { class: 'acts' }, h('button', { type: 'button', class: 'btn sec', html: icon('copy') + '<span>Dupliquer</span>', onclick: () => { const q = fix(JSON.parse(JSON.stringify(o))); q.id = uid(); q.title = (o.title + ' (copie)').slice(0, 60); q.at = Date.now(); D.list.unshift(q); D.cur = q.id; save(); closeSheet(); toast('Copie créée'); } }),
      h('button', { type: 'button', class: 'btn danger', text: 'Supprimer', onclick: () => confirmSheet('Supprimer cet ordre ?', `« ${o.title} » sera effacé de cet appareil.`, 'Supprimer', () => { D.list.splice(D.list.indexOf(o), 1); D.cur = ''; save(); render(); }, true) }))], () => render());
}
function incoming(d) {
  const q = fix(Object.assign({}, d, { id: uid() }));
  if (!q) { toast('Ordre illisible'); return; }
  confirmSheet('Ordre reçu', `« ${q.title} ». L’ajouter aux ordres de cet appareil ?`, 'Ajouter', () => { D.list.unshift(q); D.cur = q.id; D.step = 'out'; save(); render(); });
}
function render() { (cur() ? viewOrder : viewHome)(); }
render(); bootSW();
readIncoming('ordre', incoming);
})();
