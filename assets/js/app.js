/* ════════════════════════════════════════
   AI HUB — SHARED APP LOGIC
════════════════════════════════════════ */

/* ── THEME ── */
let isDark = true;
const themeBtn = document.getElementById('themeBtn');

function toggleTheme(){
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  if(themeBtn){
    themeBtn.textContent = isDark ? '🌙' : '☀️';
    themeBtn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }
  localStorage.setItem('aihub-theme', isDark ? 'dark' : 'light');
}
if(themeBtn) themeBtn.addEventListener('click', toggleTheme);
const savedTheme = localStorage.getItem('aihub-theme');
if(savedTheme === 'light'){ isDark = true; toggleTheme(); }

/* ── MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if(hamburger && mobileMenu){
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    hamburger.querySelectorAll('span').forEach((s,i) => {
      if(open){
        if(i===0) s.style.transform='rotate(45deg) translate(5px,5px)';
        if(i===1) s.style.opacity='0';
        if(i===2) s.style.transform='rotate(-45deg) translate(5px,-5px)';
      } else {
        s.style.transform=''; s.style.opacity='';
      }
    });
  });
}
function closeMobile(){
  if(mobileMenu) mobileMenu.classList.remove('open');
  if(hamburger){
    hamburger.setAttribute('aria-expanded','false');
    hamburger.querySelectorAll('span').forEach(s=>{ s.style.transform=''; s.style.opacity=''; });
  }
}

/* ── TOAST ── */
let toastTimer;
function showToast(msg, icon=''){
  const t = document.getElementById('toast');
  if(!t) return;
  const parts = msg.match(/^([^\s]+)\s(.+)$/);
  document.getElementById('toastIc').textContent = parts ? parts[1] : icon;
  document.getElementById('toastMsg').textContent = parts ? parts[2] : msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 3000);
}

/* ── LOGO HELPER ── */
/* ── DIRECT LOGO OVERRIDES (high-quality SVG/PNG from official CDNs) ── */
const LOGO_OVERRIDES = {
  'openai.com':           'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/180px-ChatGPT_logo.svg.png',
  'claude.ai':            'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Claude_AI_logo.svg/180px-Claude_AI_logo.svg.png',
  'gemini.google.com':    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/180px-Google_Gemini_logo.svg.png',
  'copilot.microsoft.com':'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Microsoft_365_Copilot_Icon.svg/180px-Microsoft_365_Copilot_Icon.svg.png',
  'deepseek.com':         'https://logo.clearbit.com/deepseek.com?size=120',
  'grok.com':             'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Grok_logo.svg/180px-Grok_logo.svg.png',
  'midjourney.com':       'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Midjourney_Emblem.png/180px-Midjourney_Emblem.png',
  'stability.ai':         'https://logo.clearbit.com/stability.ai?size=120',
  'firefly.adobe.com':    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Firefly_wordmark.svg/180px-Adobe_Firefly_wordmark.svg.png',
  'leonardo.ai':          'https://logo.clearbit.com/leonardo.ai?size=120',
  'ideogram.ai':          'https://logo.clearbit.com/ideogram.ai?size=120',
  'blackforestlabs.ai':   'https://logo.clearbit.com/blackforestlabs.ai?size=120',
  'runwayml.com':         'https://logo.clearbit.com/runwayml.com?size=120',
  'pika.art':             'https://logo.clearbit.com/pika.art?size=120',
  'klingai.com':          'https://logo.clearbit.com/klingai.com?size=120',
  'sora.com':             'https://logo.clearbit.com/sora.com?size=120',
  'lumalabs.ai':          'https://logo.clearbit.com/lumalabs.ai?size=120',
  'descript.com':         'https://logo.clearbit.com/descript.com?size=120',
  'capcut.com':           'https://logo.clearbit.com/capcut.com?size=120',
  'github.com':           'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/180px-Octicons-mark-github.svg.png',
  'cursor.sh':            'https://logo.clearbit.com/cursor.sh?size=120',
  'codeium.com':          'https://logo.clearbit.com/codeium.com?size=120',
  'bolt.new':             'https://logo.clearbit.com/bolt.new?size=120',
  'v0.dev':               'https://logo.clearbit.com/v0.dev?size=120',
  'replit.com':           'https://logo.clearbit.com/replit.com?size=120',
  'jasper.ai':            'https://logo.clearbit.com/jasper.ai?size=120',
  'copy.ai':              'https://logo.clearbit.com/copy.ai?size=120',
  'writesonic.com':       'https://logo.clearbit.com/writesonic.com?size=120',
  'grammarly.com':        'https://logo.clearbit.com/grammarly.com?size=120',
  'notion.so':            'https://logo.clearbit.com/notion.so?size=120',
  'elevenlabs.io':        'https://logo.clearbit.com/elevenlabs.io?size=120',
  'murf.ai':              'https://logo.clearbit.com/murf.ai?size=120',
  'suno.ai':              'https://logo.clearbit.com/suno.ai?size=120',
  'udio.com':             'https://logo.clearbit.com/udio.com?size=120',
  'canva.com':            'https://logo.clearbit.com/canva.com?size=120',
  'figma.com':            'https://logo.clearbit.com/figma.com?size=120',
  'heygen.com':           'https://logo.clearbit.com/heygen.com?size=120',
  'synthesia.io':         'https://logo.clearbit.com/synthesia.io?size=120',
  'perplexity.ai':        'https://logo.clearbit.com/perplexity.ai?size=120',
  'notebooklm.google':    'https://logo.clearbit.com/notebooklm.google?size=120',
  'you.com':              'https://logo.clearbit.com/you.com?size=120',
  'zapier.com':           'https://logo.clearbit.com/zapier.com?size=120',
  'make.com':             'https://logo.clearbit.com/make.com?size=120',
  'n8n.io':               'https://logo.clearbit.com/n8n.io?size=120',
  'semrush.com':          'https://logo.clearbit.com/semrush.com?size=120',
  'surferseo.com':        'https://logo.clearbit.com/surferseo.com?size=120',
  'adobe.com':            'https://logo.clearbit.com/adobe.com?size=120',
  'remove.bg':            'https://logo.clearbit.com/remove.bg?size=120',
  'julius.ai':            'https://logo.clearbit.com/julius.ai?size=120',
  'tableau.com':          'https://logo.clearbit.com/tableau.com?size=120',
  'intercom.com':         'https://logo.clearbit.com/intercom.com?size=120',
  'botpress.com':         'https://logo.clearbit.com/botpress.com?size=120',
  'chatpdf.com':          'https://logo.clearbit.com/chatpdf.com?size=120',
  'humata.ai':            'https://logo.clearbit.com/humata.ai?size=120',
  'instantly.ai':         'https://logo.clearbit.com/instantly.ai?size=120',
  'spline.design':        'https://logo.clearbit.com/spline.design?size=120',
  'meshy.ai':             'https://logo.clearbit.com/meshy.ai?size=120',
  'otter.ai':             'https://logo.clearbit.com/otter.ai?size=120',
  'fireflies.ai':         'https://logo.clearbit.com/fireflies.ai?size=120',
  'gamma.app':            'https://logo.clearbit.com/gamma.app?size=120',
  'loom.com':             'https://logo.clearbit.com/loom.com?size=120',
  'character.ai':         'https://logo.clearbit.com/character.ai?size=120',
  'cognition.ai':         'https://logo.clearbit.com/cognition.ai?size=120',
  'fathom.video':         'https://logo.clearbit.com/fathom.video?size=120',
  'phind.com':            'https://logo.clearbit.com/phind.com?size=120',
  'elicit.com':           'https://logo.clearbit.com/elicit.com?size=120',
  'consensus.app':        'https://logo.clearbit.com/consensus.app?size=120',
  'mistral.ai':           'https://logo.clearbit.com/mistral.ai?size=120',
  'meta.ai':              'https://logo.clearbit.com/meta.ai?size=120',
  'pi.ai':                'https://logo.clearbit.com/pi.ai?size=120',
  'skylum.com':           'https://logo.clearbit.com/skylum.com?size=120',
  'playground.com':       'https://logo.clearbit.com/playground.com?size=120',
  'bing.com':             'https://logo.clearbit.com/bing.com?size=120',
  'designer.microsoft.com': 'https://logo.clearbit.com/microsoft.com?size=120',
  'huggingface.co':       'https://logo.clearbit.com/huggingface.co?size=120',
  'ai.google.dev':        'https://logo.clearbit.com/google.com?size=120',
  'qwen.ai':              'https://logo.clearbit.com/qwen.ai?size=120',
};


const LOGO_SOURCES = [
  d => `https://logo.clearbit.com/${d}?size=120`,
  d => `https://img.logo.dev/${d}?token=pk_X7dkNxoKQHa2RfwzKpIGJg&size=120`,
  d => `https://icons.duckduckgo.com/ip3/${d}.ico`,
  d => `https://www.google.com/s2/favicons?domain=${d}&sz=128`,
];

function toolLogo(t, size){
  if(!t.logo) return t.emoji || '';
  // If logo is a URL or absolute path (uploaded image), render directly
  if(/^(https?:|\/)/.test(t.logo)){
    const emoji=(t.emoji||'').replace(/'/g,"\\'");
    return `<img src="${t.logo}" alt="${(t.name||'').replace(/"/g,'&quot;')} logo" onerror="this.onerror=null;this.style.display='none';var sp=document.createElement('span');sp.textContent='${emoji}';sp.style.cssText='font-size:1.3em;line-height:1';this.parentNode.appendChild(sp);" style="display:block;width:100%;height:100%;object-fit:contain;">`;
  }
  const domain  = t.logo;
  const emoji   = (t.emoji || '').replace(/'/g, "\\'");
  const name    = (t.name  || '').replace(/"/g, '&quot;');
  const brand   = t.brand || '';

  // Use high-quality override as first source, then fallback chain
  const firstSrc = LOGO_OVERRIDES[domain] || LOGO_SOURCES[0](domain);
  const allSrcs  = [firstSrc, ...LOGO_SOURCES.map(fn => fn(domain))];
  const unique   = [...new Set(allSrcs)].join('|');

  // onload: apply brand bg to parent container
  const onload = brand
    ? `this.parentNode.style.background='${brand}';this.parentNode.style.border='none';`
    : '';

  return `<img src="${firstSrc}" alt="${name} logo" data-srcs="${unique}" data-src-idx="0" data-brand="${brand}" onload="${onload}" onerror="(function(el){var i=parseInt(el.getAttribute('data-src-idx'))||0,s=el.getAttribute('data-srcs').split('|');i++;if(i<s.length){el.setAttribute('data-src-idx',i);el.src=s[i];}else{el.onerror=null;el.style.display='none';var sp=document.createElement('span');sp.textContent='${emoji}';sp.style.cssText='font-size:1.3em;line-height:1';el.parentNode.appendChild(sp);}})(this)" style="display:block;width:100%;height:100%;object-fit:contain;">`;
}

/* ── SEARCH ── */
const searchInput = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');

const SEARCH_EXTRA = [
  {name:'Stable Diffusion',cat:'Image Generation',emoji:'🖼️',logo:'stability.ai',brand:'#7C3AED',bg:'linear-gradient(135deg,#4f46e5,#7c3aed)'},
  {name:'Synthesia',cat:'Video Avatars',emoji:'🎥',logo:'synthesia.io',brand:'#6D28D9',bg:'linear-gradient(135deg,#10b981,#059669)'},
  {name:'Otter.ai',cat:'Transcription',emoji:'🎤',logo:'otter.ai',brand:'#0EA5E9',bg:'linear-gradient(135deg,#0ea5e9,#0284c7)'},
  {name:'Copy.ai',cat:'Writing & Copy',emoji:'📋',logo:'copy.ai',brand:'#7C3AED',bg:'linear-gradient(135deg,#8b5cf6,#7c3aed)'},
  {name:'Lensa AI',cat:'Photo Editing',emoji:'📸',logo:'lensa.ai',brand:'#F43F5E',bg:'linear-gradient(135deg,#f43f5e,#be123c)'},
  {name:'Gamma App',cat:'Presentations',emoji:'⚡',logo:'gamma.app',brand:'#8B5CF6',bg:'linear-gradient(135deg,#a855f7,#7c3aed)'},
];

function getSearchAll(){
  return [
    ...TOOLS.map(t=>({name:t.name,cat:t.cat,emoji:t.emoji,logo:t.logo,brand:t.brand,bg:t.bg,id:t.id,pricing:t.pricing})),
    ...SEARCH_EXTRA
  ];
}

function runSearch(q){
  if(!q){ searchDropdown.classList.remove('open'); return; }

  let hits = [];
  /* Special: "free" filter — show free tools */
  const isFreeQuery = q === 'free' || q === 'free only' || q === 'freeonly';
  if(isFreeQuery){
    hits = TOOLS.filter(t=>t.pricing==='free').slice(0,7)
      .map(t=>({name:t.name,cat:t.cat,emoji:t.emoji,logo:t.logo,brand:t.brand,bg:t.bg,id:t.id,pricing:t.pricing}));
    /* Add a "View all free tools" shortcut at top */
    searchDropdown.innerHTML = `
      <div class="sd-item" onclick="window.location='/tools/?pricing=free'" style="background:color-mix(in srgb,var(--green) 6%,transparent);border-bottom:1px solid var(--border)">
        <div class="sd-icon" style="background:linear-gradient(135deg,var(--green),#059669)">🆓</div>
        <div><div class="sd-name" style="color:var(--green)">Browse All Free AI Tools</div><div class="sd-cat">${TOOLS.filter(t=>t.pricing==='free').length}+ free tools in directory</div></div>
      </div>
      ${hits.map(h=>`
        <div class="sd-item" onclick="openModal(${h.id})" role="option" tabindex="0">
          <div class="sd-icon" style="background:${h.brand||h.bg}">${toolLogo(h,38)}</div>
          <div>
            <div class="sd-name">${h.name}</div>
            <div class="sd-cat">${h.cat} · <span style="color:var(--green)">FREE</span></div>
          </div>
        </div>
      `).join('')}
    `;
    searchDropdown.classList.add('open');
    return;
  }

  /* Normal search — name + cat match */
  hits = getSearchAll().filter(i=>
    i.name.toLowerCase().includes(q) ||
    i.cat.toLowerCase().includes(q) ||
    (i.pricing && i.pricing.toLowerCase().includes(q))
  ).slice(0,7);

  if(!hits.length){
    searchDropdown.innerHTML=`<div class="sd-empty">No results for "<strong>${q}</strong>" — <a href="/tools/" style="color:var(--accent)">Browse all tools →</a></div>`;
  } else {
    searchDropdown.innerHTML = hits.map(h=>`
      <div class="sd-item" onclick="${h.id ? `openModal(${h.id})` : `window.location='/tools/'`}" role="option" tabindex="0">
        <div class="sd-icon" style="background:${h.brand||h.bg}">${toolLogo(h,38)}</div>
        <div><div class="sd-name">${h.name}</div><div class="sd-cat">${h.cat}</div></div>
      </div>
    `).join('');
  }
  searchDropdown.classList.add('open');
}

if(searchInput && searchDropdown){
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    runSearch(q);
  });
  document.addEventListener('click', e=>{ if(!e.target.closest('.search-wrap')) searchDropdown.classList.remove('open'); });
  searchInput.addEventListener('keydown', e=>{ if(e.key==='Escape') searchDropdown.classList.remove('open'); });
}

function setSearch(q){
  if(searchInput){
    searchInput.value=q;
    runSearch(q.toLowerCase().trim());
    searchInput.focus();
  }
}

/* Free Only hint chip — goes directly to filtered tools page */
function goFreeOnly(){
  window.location='/tools/?pricing=free';
}

function performSearch(){
  if(searchInput){
    const q=searchInput.value.trim();
    if(!q) return;
    runSearch(q.toLowerCase());
  }
}

/* ── CARD FACTORY ── */
function mkBadges(t){
  let b='';
  if(t.badge==='best') b+=`<span class="badge b-best">✦ BEST</span>`;
  if(t.badge==='new')  b+=`<span class="badge b-new">NEW</span>`;
  if(t.pricing==='free') b+=`<span class="badge b-free">FREE</span>`;
  else if(t.pricing==='freemium') b+=`<span class="badge b-freemium">FREEMIUM</span>`;
  else b+=`<span class="badge b-paid">PAID</span>`;
  return b;
}

function makeCard(t, featured=false){
  const div = document.createElement('div');
  div.className = 'card' + (featured ? ' featured' : '') + ' reveal';
  div.setAttribute('role','article');
  div.setAttribute('aria-label', t.name + ' - ' + t.cat);
  div.innerHTML = `
    ${featured ? '<div class="featured-mark">⭐ EDITOR\'S PICK</div>' : ''}
    <div class="card-top">
      <div style="display:flex;flex-direction:column;gap:8px">
        <div class="tool-icon" style="background:${t.brand||t.bg}">${toolLogo(t,52)}</div>
        <div class="tool-name">${t.name}</div>
        <div class="tool-cat">${t.cat.toUpperCase()}</div>
      </div>
      <div class="badges">${mkBadges(t)}</div>
    </div>
    <div class="tool-desc">${t.desc}</div>
    <div class="stars-row">
      <span class="stars">${'★'.repeat(Math.floor(t.rating))}${'☆'.repeat(5-Math.floor(t.rating))}</span>
      <span class="stars-num">${t.rating} (${t.reviews} reviews)</span>
    </div>
    <div class="tags-row">${t.tags.map(tg=>`<span class="tag">${tg}</span>`).join('')}</div>
    <div class="card-footer">
      <div class="alt-hint">🔀 Free alt: <span>${t.freeAlt}</span></div>
      <button class="card-btn" onclick="openModal(${t.id})" aria-label="View ${t.name} details">Details →</button>
    </div>
  `;
  return div;
}

/* ── MODAL ── */
function openModal(id){
  const tool = TOOLS.find(t=>t.id===id);
  if(!tool) return;
  /* Trim description to 160 chars max to guarantee fit */
  const desc = tool.desc.length > 160 ? tool.desc.slice(0,157).replace(/\s\S*$/,'') + '…' : tool.desc;
  /* Show only first 3 features to keep modal compact and scroll-free */
  const features = tool.features.slice(0,3);
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-logo-row">
      <div class="modal-icon" style="background:${tool.brand||tool.bg}">${toolLogo(tool,58)}</div>
      <div>
        <h2>${tool.name}</h2>
        <div class="modal-sub">// ${tool.cat.toUpperCase()} · ${tool.price}</div>
      </div>
    </div>
    <p class="modal-desc">${desc}</p>
    <div class="modal-stitle">// KEY FEATURES</div>
    ${features.map(f=>`<div class="modal-feature">${f}</div>`).join('')}
    <div class="modal-stitle">// FREE ALTERNATIVES</div>
    <div class="modal-alts">${tool.alts.map(a=>`<div class="modal-alt"><span class="modal-alt-name">${a.n}</span><span class="badge ${a.t==='Free'?'b-free':a.t==='Freemium'?'b-freemium':'b-paid'}">${a.t.toUpperCase()}</span></div>`).join('')}</div>
    <div class="modal-stitle">// COMMUNITY RATING</div>
    <div class="modal-rating-row">
      <div class="modal-rating-num">${tool.rating}</div>
      <div>
        <div style="color:var(--gold);font-size:1.1rem">${'★'.repeat(Math.floor(tool.rating))}${'☆'.repeat(5-Math.floor(tool.rating))}</div>
        <div style="font-size:0.72rem;color:var(--text3);font-family:'JetBrains Mono',monospace;margin-top:2px">${tool.reviews} verified reviews</div>
      </div>
    </div>
    <div class="modal-btn-row">
      <a class="modal-btn-p" href="${tool.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center" onclick="showToast('🚀 Opening ${tool.name}...')">Visit ${tool.name} →</a>
      <button class="modal-btn-s" onclick="window.location='/compare/'">Compare Tools</button>
    </div>
  `;
  document.getElementById('modalBg').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e){
  if(e && e.target !== document.getElementById('modalBg')) return;
  document.getElementById('modalBg').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const modalBox = document.getElementById('modalBox');
  if(modalBox){
    modalBox.querySelector('.modal-close').addEventListener('click', ()=>{
      document.getElementById('modalBg').classList.remove('open');
      document.body.style.overflow='';
    });
  }
});

document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){
    const bg = document.getElementById('modalBg');
    if(bg){ bg.classList.remove('open'); document.body.style.overflow=''; }
  }
});

/* ── SCROLL REVEAL ── */
function triggerReveal(){
  setTimeout(()=>{
    document.querySelectorAll('.reveal:not(.visible)').forEach((el,i)=>{
      setTimeout(()=>el.classList.add('visible'), i*60);
    });
  }, 50);
}

const revealObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});

function initReveal(){
  document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));
}

/* ── RENDER HELPERS ── */
function renderCats(containerId, clickCallback){
  const c = document.getElementById(containerId);
  if(!c) return;
  CATS.forEach((cat,i)=>{
    const el = document.createElement('div');
    el.className = 'cat-pill' + (i===0 ? ' active' : '');
    el.setAttribute('role','listitem');
    el.innerHTML = `${cat.icon} ${cat.name} <span class="cat-cnt">${cat.count}</span>`;
    el.addEventListener('click', ()=>{
      c.querySelectorAll('.cat-pill').forEach(p=>p.classList.remove('active'));
      el.classList.add('active');
      if(clickCallback) clickCallback(cat);
    });
    c.appendChild(el);
  });
}

function renderTrending(containerId){
  const g = document.getElementById(containerId);
  if(!g) return;
  TRENDING.forEach(t=>{
    const card = document.createElement('div');
    card.className='trend-card reveal';
    if(t.id){ card.style.cursor='pointer'; card.setAttribute('role','button'); card.setAttribute('tabindex','0'); }
    card.innerHTML=`
      <div class="trend-n">${t.num}</div>
      <div class="trend-info">
        <div class="trend-name">${t.name}</div>
        <div class="trend-cat">${t.cat}</div>
      </div>
      <div class="trend-up">▲ ${t.up}</div>
    `;
    if(t.id){
      card.addEventListener('click', ()=>{ if(typeof openModal==='function') openModal(t.id); });
      card.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); if(typeof openModal==='function') openModal(t.id);} });
    }
    g.appendChild(card);
  });
}

function renderArticleCards(containerId, limit){
  const g = document.getElementById(containerId);
  if(!g) return;
  const list = limit ? ARTICLES.slice(0, limit) : ARTICLES;
  list.forEach(a=>{
    const card = document.createElement('div');
    card.className='article-card reveal';
    card.innerHTML=`
      <div class="article-thumb" style="background:${a.thumb}">${a.image?`<img src="${a.image}" alt="${(a.title||'').replace(/"/g,'&quot;')}" style="width:100%;height:100%;object-fit:cover;display:block">`:(a.emoji||'')}</div>
      <div class="article-body">
        <div class="article-meta">
          <span class="article-tag">${a.cat}</span>
          <span class="article-date">${a.date}</span>
        </div>
        <div class="article-title">${a.title}</div>
        <div class="article-excerpt">${a.excerpt}</div>
      </div>
    `;
    card.addEventListener('click', ()=>{ window.location='/blog/'+a.slug+'/'; });
    g.appendChild(card);
  });
}

function renderCompareTable(tbodyId, data, extraHeaders, extraColsFn){
  const tbody = document.getElementById(tbodyId);
  if(!tbody) return;
  data.forEach(rawRow=>{
    // Merge in logo/brand from matching TOOLS entry (by name) so compare tables
    // use the same uploaded logos / brand domains as the rest of the site.
    const match = (typeof TOOLS!=='undefined') ? TOOLS.find(t=>t.name.toLowerCase()===rawRow.name.toLowerCase()
      || t.name.toLowerCase().startsWith(rawRow.name.toLowerCase().split(' ')[0])) : null;
    const row = Object.assign({}, rawRow, {
      logo:  rawRow.logo  || (match && match.logo),
      brand: rawRow.brand || (match && match.brand),
      emoji: rawRow.emoji || (match && match.emoji),
    });
    const tr = document.createElement('tr');
    if(row.best) tr.className='best-row';
    const freeClass = row.free && row.free.includes('✓') ? 'tick' : 'cross';
    const extraCols = extraColsFn ? extraColsFn(row) : [];
    tr.innerHTML=`
      <td><div class="td-name"><div class="mini-ico" style="background:${row.brand||row.bg}">${toolLogo(row,32)}</div><div>${row.name}${row.best?'<br><span style="font-size:0.62rem;color:var(--accent);font-family:JetBrains Mono,monospace">BEST</span>':''}</div></div></td>
      <td class="${freeClass}">${row.free}</td>
      <td class="${row.price==='Free'?'price-free':'price-paid'}">${row.price}</td>
      ${extraCols.map(c=>`<td style="color:var(--text2)">${c}</td>`).join('')}
      <td style="font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:700">${row.rating}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ── MISC ── */
/* ── NEWSLETTER — uses Web3Forms (free, no backend needed)
   Replace YOUR_WEB3FORMS_ACCESS_KEY below after signing up at https://web3forms.com
   They'll send submissions to your email address for free. ── */
const WEB3FORMS_KEY = 'd9a8fc3c-5b28-421c-afb4-3896ec892a7e';

async function subscribeNewsletter(btn){
  const form = (btn && btn.closest && btn.closest('.nl-form')) || document.querySelector('.nl-form');
  if(!form){ showToast('⚠️ Form not found.'); return; }
  const input = form.querySelector('input[type="email"]');
  const email = (input?.value || '').trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if(!re.test(email)){
    if(input){ input.focus(); input.style.borderColor='var(--red,#ef4444)'; setTimeout(()=>{input.style.borderColor='';},1800); }
    showToast('⚠️ Please enter a valid email.');
    return;
  }
  // Duplicate check
  try{
    const list = JSON.parse(localStorage.getItem('fba_newsletter')||'[]');
    if(list.includes(email.toLowerCase())){ showToast('✨ You\'re already subscribed!'); return; }
  }catch(e){}

  // Disable button while sending
  if(btn && btn.tagName==='BUTTON'){ btn.disabled=true; btn.textContent='Sending…'; }
  try{
    if(WEB3FORMS_KEY && WEB3FORMS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY'){
      const res = await fetch('https://api.web3forms.com/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'New Newsletter Subscriber — Find Best AI',
          email,
          message: `New subscriber: ${email}\nDate: ${new Date().toISOString()}`
        })
      });
      const data = await res.json();
      if(!data.success) throw new Error(data.message || 'Submission failed');
    }
    // Save locally
    try{
      const list = JSON.parse(localStorage.getItem('fba_newsletter')||'[]');
      list.push(email.toLowerCase());
      localStorage.setItem('fba_newsletter', JSON.stringify(list));
    }catch(e){}
    if(input) input.value='';
    showToast('✅ You\'re subscribed! Check your inbox.');
  }catch(err){
    console.error('Newsletter error:',err);
    showToast('⚠️ Something went wrong. Please try again.');
  }finally{
    if(btn && btn.tagName==='BUTTON'){ btn.disabled=false; btn.textContent='Subscribe'; }
  }
}
function submitContact(){
  const n=document.getElementById('cf-name');
  const e=document.getElementById('cf-email');
  if(!n||!e||!n.value||!e.value){ showToast('⚠️ Please fill in all required fields.'); return; }
  showToast('✅ Message sent! We\'ll reply within 48 hours.');
  [n,e,document.getElementById('cf-msg')].forEach(el=>{if(el)el.value='';});
}

/* ── COMPARE BUILDER ── */
const selectedToolIds = new Set();

function renderToolSelector(){
  const grid = document.getElementById('toolSelectorGrid');
  if(!grid) return;
  const q = (document.getElementById('compareSearch')?.value||'').toLowerCase().trim();
  const cat = document.getElementById('compareCatFilter')?.value||'';
  grid.innerHTML='';
  const matches = TOOLS.filter(t=>(!cat||t.cat===cat)&&(!q||t.name.toLowerCase().includes(q)||t.cat.toLowerCase().includes(q)));
  if(!matches.length){
    grid.innerHTML=`<div style="grid-column:1/-1;padding:24px;text-align:center;color:var(--text3);font-size:0.85rem">No tools match your search.</div>`;
    return;
  }
  matches.forEach(t=>{
    const chip=document.createElement('div');
    chip.className='tool-select-chip'+(selectedToolIds.has(t.id)?' selected':'');
    chip.innerHTML=`<div class="chip-ico" style="background:${t.brand||t.bg}">${toolLogo(t,28)}</div><div class="chip-name">${t.name}</div><div class="chip-check">✓</div>`;
    chip.addEventListener('click',()=>{
      if(selectedToolIds.has(t.id)){ selectedToolIds.delete(t.id); }
      else{ if(selectedToolIds.size>=6){ showToast('Max 6 tools at a time'); return; } selectedToolIds.add(t.id); }
      renderToolSelector();
      updateSelectionCount();
    });
    grid.appendChild(chip);
  });
}

function updateSelectionCount(){
  const el=document.getElementById('selectionCount');
  if(el) el.textContent=selectedToolIds.size+' tools selected';
}

function clearSelection(){
  selectedToolIds.clear();
  renderToolSelector();
  updateSelectionCount();
  const r=document.getElementById('compareResult');
  if(r) r.classList.remove('visible');
}

function buildComparison(){
  if(selectedToolIds.size<2){ showToast('Select at least 2 tools'); return; }
  const picks=TOOLS.filter(t=>selectedToolIds.has(t.id));
  const table=document.getElementById('compareResultTable');
  if(!table) return;
  const head=`<thead><tr><th>FEATURE</th>${picks.map(p=>`<th><div class="td-name"><div class="mini-ico" style="background:${p.brand||p.bg}">${toolLogo(p,32)}</div><div>${p.name}</div></div></th>`).join('')}</tr></thead>`;
  const rows=[
    ['Category',picks.map(p=>p.cat)],
    ['Pricing',picks.map(p=>p.pricing.toUpperCase())],
    ['Price',picks.map(p=>p.price)],
    ['Rating',picks.map(p=>`★ ${p.rating} <span style="color:var(--text3);font-size:0.7rem">(${p.reviews})</span>`)],
    ['Free Alternative',picks.map(p=>p.freeAlt||'—')],
    ['Top Features',picks.map(p=>p.features.slice(0,3).map(f=>`• ${f}`).join('<br>'))],
    ['Visit',picks.map(p=>`<a href="${p.url}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);text-decoration:none;font-weight:600">Open ↗</a>`)],
  ];
  const body=`<tbody>${rows.map(([label,vals])=>`<tr><td style="font-weight:600;color:var(--text2)">${label}</td>${vals.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody>`;
  table.innerHTML=head+body;
  const titleEl=document.getElementById('compareResultTitle');
  if(titleEl) titleEl.textContent='Comparing '+picks.map(p=>p.name).join(' vs ');
  const r=document.getElementById('compareResult');
  if(r){ r.classList.add('visible'); r.scrollIntoView({behavior:'smooth',block:'start'}); }
}

function populateCompareCatFilter(){
  const sel=document.getElementById('compareCatFilter');
  if(!sel) return;
  CATS.forEach(c=>{
    const opt=document.createElement('option');
    opt.value=c.name; opt.textContent=c.icon+' '+c.name;
    sel.appendChild(opt);
  });
}

/* ── INIT (called per-page) ── */
function initCommonUI(){
  initReveal();
  triggerReveal();
  const mutObs=new MutationObserver(initReveal);
  mutObs.observe(document.body,{childList:true,subtree:true});
}
