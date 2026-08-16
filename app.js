/* ============================================================
   Longitudinal Record — application logic
   State lives in localStorage under one key. Export writes JSON.
   ============================================================ */

const KEY = 'rc2026-record-v1';

const DEFAULT_STATE = {
  done: {},          // milestoneId -> true
  sessions: {},      // 'YYYY-MM-DD' -> 1 (studied) | 2 (studied + produced output)
  costs: {},         // costId -> cad amount (overrides seed)
  funding: {},       // fundingId -> status
  saved: 0,
  savedTarget: 60000,
  fx: { rwf: 1030, usd: 0.73 },
  notes: [],         // {id, date, body}
  lastExport: null   // 'YYYY-MM-DD' — drives the backup reminder
};

let S = load();

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return structuredClone(DEFAULT_STATE);
    return Object.assign(structuredClone(DEFAULT_STATE), JSON.parse(raw));
  }catch(e){
    console.warn('Could not read saved data, starting fresh.', e);
    return structuredClone(DEFAULT_STATE);
  }
}
function save(){
  try{ localStorage.setItem(KEY, JSON.stringify(S)); }
  catch(e){ console.warn('Could not save.', e); }
}

/* ---------- date helpers ---------- */
const iso = d => d.toISOString().slice(0,10);
const today = () => iso(new Date());
function daysBetween(a,b){ return Math.round((new Date(b) - new Date(a)) / 86400000); }
function fmtDate(s){
  const d = new Date(s+'T00:00:00');
  return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
}
function isWeekday(d){ const n = d.getDay(); return n>=1 && n<=5; }

/* ---------- money helpers ---------- */
const costAmt = c => (S.costs[c.id] !== undefined ? S.costs[c.id] : c.cad);
function money(n, cur){
  const v = cur==='CAD' ? n : cur==='USD' ? n*S.fx.usd : n*S.fx.rwf;
  const dp = cur==='RWF' ? 0 : 0;
  return v.toLocaleString('en-US',{maximumFractionDigits:dp});
}

/* ============================================================
   NAV
   ============================================================ */
document.querySelectorAll('.rail-btn').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.rail-btn').forEach(x=>x.classList.remove('is-on'));
    document.querySelectorAll('.view').forEach(x=>x.classList.remove('is-on'));
    b.classList.add('is-on');
    document.getElementById('view-'+b.dataset.view).classList.add('is-on');
    window.scrollTo({top:0,behavior:'instant'});
  });
});

/* ============================================================
   OVERVIEW
   ============================================================ */
function renderAxis(){
  const start = PHASES[0].from, end = PHASES[PHASES.length-1].to;
  const span = end - start;
  const now = new Date();
  const nowYr = now.getFullYear() + (now.getMonth()/12);
  const pct = Math.max(0, Math.min(100, ((nowYr - start)/span)*100));

  const axis = document.getElementById('axis');
  axis.innerHTML = PHASES.map(p=>{
    const cls = nowYr >= p.to ? 'done' : (nowYr >= p.from ? 'now' : '');
    return `<div class="ph ${cls}" style="flex:${p.to-p.from}">
              <span class="ph-l">${p.label}</span>
              <span class="ph-y">${p.from}–${p.to}</span>
            </div>`;
  }).join('') + `<div class="marker" style="left:${pct}%"></div>`;

  document.getElementById('axisScale').innerHTML =
    [start,2028,2030,2032,2034,end].map(y=>`<span>${y}</span>`).join('');

  const cur = PHASES.find(p=>nowYr>=p.from && nowYr<p.to) || PHASES[0];
  document.getElementById('axisNow').textContent = `Now: ${cur.label} — ${cur.note}`;
}

function renderStats(){
  const doneN = MILESTONES.filter(m=>S.done[m.id]).length;
  const next = MILESTONES.filter(m=>!S.done[m.id]).sort((a,b)=>a.target<b.target?-1:1)[0];
  const dLeft = next ? daysBetween(today(), next.target) : 0;
  const obs = daysBetween(STUDY_START, today()) + 1;

  document.getElementById('obsDay').textContent = obs>0 ? `Day ${obs}` : 'Day 0';
  document.getElementById('startDate').textContent = fmtDate(STUDY_START);

  document.getElementById('statRow').innerHTML = `
    <div class="stat"><span class="stat-n">${doneN}/${MILESTONES.length}</span><span class="stat-l">Milestones cleared</span></div>
    <div class="stat"><span class="stat-n">${Object.keys(S.sessions).length}</span><span class="stat-l">Study sessions</span></div>
    <div class="stat"><span class="stat-n">${next?(dLeft<0?Math.abs(dLeft):dLeft):'—'}</span><span class="stat-l">${next?(dLeft<0?'Days overdue':'Days to next'):'All clear'}</span></div>
    <div class="stat"><span class="stat-n">${S.notes.length}</span><span class="stat-l">Field notes</span></div>`;
}

function renderNext(){
  const list = MILESTONES.filter(m=>!S.done[m.id])
    .sort((a,b)=>a.target<b.target?-1:1).slice(0,5);
  const el = document.getElementById('nextList');
  if(!list.length){ el.innerHTML = `<p class="empty">Every milestone is ticked. Time to extend the plan.</p>`; return; }
  el.innerHTML = list.map(m=>{
    const d = daysBetween(today(), m.target);
    const cls = d<0 ? 'late' : d<60 ? 'soon' : '';
    const txt = d<0 ? `${Math.abs(d)} days overdue` : `${d} days — ${fmtDate(m.target)}`;
    return `<li><span class="next-t">${m.title}</span><span class="next-d ${cls}">${txt}</span></li>`;
  }).join('');
}

function renderTracks(){
  document.getElementById('trackList').innerHTML = TRACKS.map(t=>`
    <li>
      <div class="tk-top">
        <span class="tk-n">${t.name}</span>
        <span class="pill pill-${t.status}">${t.status}</span>
      </div>
      <div class="tk-d">${t.desc}</div>
    </li>`).join('');
}

/* ============================================================
   CREDENTIALS LADDER
   ============================================================ */
function renderLadder(){
  document.getElementById('ladder').innerHTML = PHASES.map(p=>{
    const ms = MILESTONES.filter(m=>m.phase===p.id);
    const doneN = ms.filter(m=>S.done[m.id]).length;
    return `<div class="ph-block">
      <div class="ph-head">
        <h2>${p.label}</h2>
        <span class="yr">${p.from}–${p.to} · ${doneN}/${ms.length} done</span>
      </div>
      <p class="ph-note">${p.note}</p>
      ${ms.map(m=>`
        <div class="ms ${S.done[m.id]?'done':''}" data-ms="${m.id}" role="button" tabindex="0"
             aria-pressed="${!!S.done[m.id]}">
          <div class="box" aria-hidden="true"></div>
          <div>
            <span class="ms-t">${m.title}</span>
            ${m.detail?`<span class="ms-d">${m.detail}</span>`:''}
          </div>
          <span class="ms-x">${fmtDate(m.target)}</span>
        </div>`).join('')}
    </div>`;
  }).join('');

  document.querySelectorAll('[data-ms]').forEach(el=>{
    const toggle = ()=>{
      const id = el.dataset.ms;
      if(S.done[id]) delete S.done[id]; else S.done[id]=true;
      save(); renderLadder(); renderStats(); renderNext();
    };
    el.addEventListener('click',toggle);
    el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); }});
  });
}

/* ============================================================
   STUDY LOG
   ============================================================ */
function streak(){
  let n=0; const d=new Date();
  for(let i=0;i<400;i++){
    const k=iso(d);
    if(S.sessions[k]) n++;
    else if(isWeekday(d) && k!==today()) break;
    d.setDate(d.getDate()-1);
  }
  return n;
}
function weekdayRate(){
  const d=new Date(); let wd=0, hit=0;
  for(let i=0;i<30;i++){
    if(isWeekday(d)){ wd++; if(S.sessions[iso(d)]) hit++; }
    d.setDate(d.getDate()-1);
  }
  return wd ? Math.round((hit/wd)*100)+'%' : '—';
}

function renderLog(){
  document.getElementById('streakN').textContent = streak();
  document.getElementById('totalN').textContent = Object.keys(S.sessions).length;
  document.getElementById('rateN').textContent = weekdayRate();

  const btn = document.getElementById('btnToday');
  const lv = S.sessions[today()];
  btn.textContent = !lv ? "Log today's session"
    : lv===1 ? 'Logged — add output?' : 'Logged with output ✓';
  btn.classList.toggle('is-done', lv===2);

  // 12-week grid, Monday-first columns
  const cal = document.getElementById('cal');
  const end = new Date(); end.setDate(end.getDate() + (7 - ((end.getDay()||7))));
  const start = new Date(end); start.setDate(start.getDate() - (12*7) + 1);
  let html='';
  for(let d=new Date(start); d<=end; d.setDate(d.getDate()+1)){
    const k=iso(d);
    const fut = k>today();
    const lvl = S.sessions[k]||0;
    html += `<div class="cell ${fut?'fut':'l'+lvl}" title="${fmtDate(k)}${lvl?' — logged':''}"></div>`;
  }
  cal.innerHTML = html;
}

document.getElementById('btnToday').addEventListener('click',()=>{
  const k = today();
  const lv = S.sessions[k]||0;
  S.sessions[k] = lv===0 ? 1 : lv===1 ? 2 : 0;
  if(S.sessions[k]===0) delete S.sessions[k];
  save(); renderLog(); renderStats();
});

function renderCurric(){
  document.getElementById('curric').innerHTML = CURRICULUM.map(m=>`
    <div class="mo">
      <div class="mo-h"><h3>${m.month}</h3><span class="mo-w">${m.window}</span></div>
      <p class="mo-th">${m.theme}</p>
      ${m.weeks.length ? m.weeks.map(w=>`
        <div class="wk">
          <div><span class="wk-h">${w.label}</span> — <span class="wk-f">${w.focus}</span></div>
          ${w.days.length ? `<ol>${w.days.map(d=>`<li>${d}</li>`).join('')}</ol>`
                          : `<p class="tbd">Daily detail to be set at the next check-in.</p>`}
        </div>`).join('')
      : `<p class="tbd" style="margin-top:10px">Weekly detail to be set closer to the time.</p>`}
    </div>`).join('');
}

/* ============================================================
   FINANCES
   ============================================================ */
function renderFx(){
  document.getElementById('fxRwf').value = S.fx.rwf;
  document.getElementById('fxUsd').value = S.fx.usd;
}
['fxRwf','fxUsd'].forEach(id=>{
  document.getElementById(id).addEventListener('input',e=>{
    const v = parseFloat(e.target.value);
    if(!isNaN(v) && v>0){ S.fx[id==='fxRwf'?'rwf':'usd'] = v; save(); renderMoney(); }
  });
});

function renderMoney(){
  const total = FIN_COSTS.reduce((s,c)=>s+costAmt(c),0);
  document.getElementById('costTotals').innerHTML = ['CAD','USD','RWF'].map(cur=>`
    <div class="mcard">
      <span class="mcard-c">${cur}</span>
      <span class="mcard-n">${money(total,cur)}</span>
      <span class="mcard-l">Total projected cost, all phases</span>
    </div>`).join('');

  document.getElementById('costTable').innerHTML = PHASES.map(p=>{
    const rows = FIN_COSTS.filter(c=>c.phase===p.id);
    if(!rows.length) return '';
    const sub = rows.reduce((s,c)=>s+costAmt(c),0);
    return `<div class="grp">
      <div class="grp-h">${p.label} · ${p.from}–${p.to} · CAD ${sub.toLocaleString()}</div>
      ${rows.map(c=>{
        const a = costAmt(c);
        return `<div class="row">
          <span class="row-l">${c.label} <span class="flag flag-${c.status}">${c.status}</span></span>
          <input class="amt" type="number" step="50" value="${a}" data-cost="${c.id}" aria-label="${c.label} amount in CAD">
          <span class="row-alt">USD ${money(a,'USD')} · RWF ${money(a,'RWF')}</span>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');

  document.querySelectorAll('[data-cost]').forEach(inp=>{
    inp.addEventListener('input',e=>{
      const v = parseFloat(e.target.value);
      S.costs[e.target.dataset.cost] = isNaN(v)?0:v;
      save(); renderMoney();
    });
  });

  // savings
  document.getElementById('savedNow').value = S.saved;
  document.getElementById('savedTarget').value = S.savedTarget;
  const pct = S.savedTarget>0 ? Math.min(100,(S.saved/S.savedTarget)*100) : 0;
  document.getElementById('saveBar').style.width = pct+'%';
  const gap = Math.max(0, S.savedTarget - S.saved);
  document.getElementById('saveRead').textContent =
    `${pct.toFixed(1)}% of target. Gap: CAD ${gap.toLocaleString()} · USD ${money(gap,'USD')} · RWF ${money(gap,'RWF')}`;

  // funding
  document.getElementById('fundTable').innerHTML = FIN_FUNDING.map(f=>{
    const st = S.funding[f.id] || f.status;
    return `<div class="row">
      <span class="row-l">${f.label}<br><span style="font-size:11.5px;color:var(--slate)">${f.target}</span></span>
      <span class="odds">odds: ${f.odds}</span>
      <select class="sel" data-fund="${f.id}" aria-label="${f.label} status">
        ${['not started','researching','applied','shortlisted','awarded','declined']
          .map(o=>`<option ${o===st?'selected':''}>${o}</option>`).join('')}
      </select>
    </div>`;
  }).join('');

  document.querySelectorAll('[data-fund]').forEach(sel=>{
    sel.addEventListener('change',e=>{
      S.funding[e.target.dataset.fund] = e.target.value; save();
    });
  });

  document.getElementById('incomeTable').innerHTML = FIN_INCOME.map(i=>{
    const p = PHASES.find(x=>x.id===i.phase);
    return `<div class="row">
      <span class="row-l">${i.label}${i.note?`<br><span style="font-size:11.5px;color:var(--slate)">${i.note}</span>`:''}</span>
      <span class="odds">${p?p.label:''}</span>
    </div>`;
  }).join('');
}

['savedNow','savedTarget'].forEach(id=>{
  document.getElementById(id).addEventListener('input',e=>{
    const v = parseFloat(e.target.value);
    S[id==='savedNow'?'saved':'savedTarget'] = isNaN(v)?0:v;
    save(); renderMoney();
  });
});

/* ============================================================
   FIELD NOTES
   ============================================================ */
function renderNotes(){
  const el = document.getElementById('noteList');
  if(!S.notes.length){
    el.innerHTML = `<p class="empty">No notes yet. The first one can just be why you started.</p>`;
    return;
  }
  el.innerHTML = S.notes.slice().reverse().map(n=>{
    const obs = daysBetween(STUDY_START, n.date) + 1;
    return `<div class="note">
      <div class="note-meta">
        <span>${fmtDate(n.date)}</span><span>Day ${obs}</span>
        <button class="note-del" data-note="${n.id}">delete</button>
      </div>
      <p class="note-body">${escapeHtml(n.body)}</p>
    </div>`;
  }).join('');

  document.querySelectorAll('[data-note]').forEach(b=>{
    b.addEventListener('click',()=>{
      S.notes = S.notes.filter(n=>n.id!==b.dataset.note);
      save(); renderNotes(); renderStats();
    });
  });
}
function escapeHtml(s){
  return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
document.getElementById('btnNote').addEventListener('click',()=>{
  const ta = document.getElementById('noteBody');
  const body = ta.value.trim();
  if(!body) return;
  S.notes.push({ id:'n'+Date.now(), date:today(), body });
  ta.value=''; save(); renderNotes(); renderStats();
});

/* ============================================================
   EXPORT / IMPORT / BACKUP REMINDER
   ============================================================ */
function backupFilename(){ return `rc2026-record-${today()}.json`; }

async function doExport(){
  const json = JSON.stringify(S,null,2);
  const file = new File([json], backupFilename(), {type:'application/json'});

  // On phones the share sheet is far more useful than a download:
  // it drops the backup straight into Drive, Files or email.
  if(navigator.canShare && navigator.canShare({files:[file]})){
    try{
      await navigator.share({files:[file], title:'RC-2026 backup'});
      markExported();
      return;
    }catch(err){
      if(err && err.name === 'AbortError') return;   // dismissed
    }
  }

  const blob = new Blob([json],{type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = backupFilename();
  a.click();
  URL.revokeObjectURL(a.href);
  markExported();
}

function markExported(){
  S.lastExport = today();
  save();
  renderBackupWarn();
}

function renderBackupWarn(){
  const el = document.getElementById('backupWarn');
  if(!el) return;
  if(!S.lastExport){
    el.textContent = 'Saved on this device only. Export regularly.';
    el.classList.remove('warn-hot');
    return;
  }
  const d = daysBetween(S.lastExport, today());
  if(d >= 14){
    el.textContent = `Last backup ${d} days ago. Worth exporting.`;
    el.classList.add('warn-hot');
  }else{
    el.textContent = d === 0 ? 'Backed up today.' : `Last backup ${d} day${d===1?'':'s'} ago.`;
    el.classList.remove('warn-hot');
  }
}

document.getElementById('btnExport').addEventListener('click',doExport);
document.getElementById('btnImport').addEventListener('click',()=>document.getElementById('fileImport').click());
document.getElementById('fileImport').addEventListener('change',e=>{
  const f = e.target.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = () => {
    try{
      const incoming = JSON.parse(r.result);
      if(typeof incoming !== 'object' || incoming === null) throw new Error('bad shape');
      const mine   = Object.keys(S.sessions).length + S.notes.length;
      const theirs = Object.keys(incoming.sessions||{}).length + (incoming.notes||[]).length;
      if(mine > 0 && !confirm(
        `Replace what is on this device?\n\nHere now: ${mine} entries\nIn the file: ${theirs} entries\n\nThis cannot be undone.`
      )) return;
      S = Object.assign(structuredClone(DEFAULT_STATE), incoming);
      save(); renderAll();
    }catch(err){
      alert('That file could not be read. Import the JSON file produced by Export data.');
    }
  };
  r.readAsText(f);
  e.target.value='';
});

/* ---------- install prompt ---------- */
let deferredPrompt = null;
const btnInstall = document.getElementById('btnInstall');

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  btnInstall.hidden = false;
});

btnInstall.addEventListener('click', async () => {
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  btnInstall.hidden = true;
});

window.addEventListener('appinstalled', () => { btnInstall.hidden = true; });

// iOS never fires beforeinstallprompt, so offer the manual route instead.
(function iosHint(){
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = window.navigator.standalone === true ||
                     window.matchMedia('(display-mode: standalone)').matches;
  if(isIOS && !standalone){
    btnInstall.hidden = false;
    btnInstall.textContent = 'Add to Home Screen';
    btnInstall.addEventListener('click', () => {
      alert('In Safari: tap the Share button, then "Add to Home Screen".');
    });
  }
})();

/* ============================================================
   BOOT
   ============================================================ */
function renderAll(){
  renderAxis(); renderStats(); renderNext(); renderTracks();
  renderLadder(); renderLog(); renderCurric();
  renderFx(); renderMoney(); renderNotes(); renderBackupWarn();
}
renderAll();
