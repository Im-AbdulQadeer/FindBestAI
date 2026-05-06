/* ════════════════════════════════════════
   SHARED NAV + FOOTER INJECTION
════════════════════════════════════════ */

(function(){
  const path = window.location.pathname.replace(/\/$/,'') || '/';
  const page = path.split('/').filter(Boolean)[0] || 'home';

  /* ── NAV ── */
  const navEl = document.getElementById('topnav');
  if(navEl){
    navEl.innerHTML = `
      <a class="nav-logo" href="/" aria-label="Find Best AI Home" style="display:flex;align-items:center;gap:9px;text-decoration:none;-webkit-text-fill-color:unset;margin-right:auto">
        <img src="/logo.webp" alt="Find Best AI Logo" width="34" height="34"
          style="width:34px;height:34px;border-radius:50%;object-fit:cover;flex-shrink:0;display:block"
          onerror="this.style.display='none'">
        <span style="background:linear-gradient(135deg,var(--accent),var(--accent2),var(--accent3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:900;font-size:1.05rem;letter-spacing:-0.03em;white-space:nowrap">Find Best AI</span>
      </a>
      <div class="nav-links">
        <a href="/" class="${page==='home'?'active':''}">Home</a>
        <a href="/tools/" class="${page==='tools'?'active':''}">All Tools</a>
        <a href="/compare/" class="${page==='compare'?'active':''}">Compare</a>
        <a href="/blog/" class="${page==='blog'?'active':''}">Blog</a>
        <a href="/about/" class="${page==='about'?'active':''}">About</a>
        <a href="/contact/" class="${page==='contact'?'active':''}">Contact</a>
      </div>
      <div class="nav-actions">
        <button class="theme-btn" id="themeBtn" aria-label="Toggle theme">🌙</button>
        <a href="/contact/" class="btn-outline">Submit Tool</a>
        <a href="/tools/" class="btn-primary">Explore →</a>
      </div>
      <div class="mobile-right-actions">
        <button class="theme-btn" id="themeBtnMobile" aria-label="Toggle theme">🌙</button>
        <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    `;
  }

  /* ── MOBILE MENU ── */
  const mobileEl = document.getElementById('mobileMenu');
  if(mobileEl){
    mobileEl.innerHTML = `
      <a href="/" onclick="closeMobile()">🏠 Home</a>
      <a href="/tools/" onclick="closeMobile()">🔧 All Tools</a>
      <a href="/compare/" onclick="closeMobile()">⚖️ Compare</a>
      <a href="/blog/" onclick="closeMobile()">📝 Blog</a>
      <a href="/about/" onclick="closeMobile()">ℹ️ About</a>
      <a href="/contact/" onclick="closeMobile()">✉️ Contact</a>
      <a href="/privacy/" onclick="closeMobile()">🔒 Privacy Policy</a>
      <a href="/terms/" onclick="closeMobile()">📋 Terms of Use</a>
    `;
  }

  /* ── FOOTER ── */
  const footerEl = document.getElementById('site-footer');
  if(footerEl){
    footerEl.innerHTML = `
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" style="display:inline-flex;align-items:center;gap:9px;margin-bottom:14px;text-decoration:none">
            <img src="/logo.webp" alt="Find Best AI" width="32" height="32"
              style="width:32px;height:32px;border-radius:50%;object-fit:cover;flex-shrink:0"
              onerror="this.style.display='none'">
            <span style="background:linear-gradient(135deg,var(--accent),var(--accent2),var(--accent3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:900;font-size:1.2rem;letter-spacing:-0.03em">Find Best AI</span>
          </a>
          <p>The world's most comprehensive AI tools directory. Compare 500+ AI tools, find free alternatives, and make smarter software decisions.</p>
          <div class="footer-socials">
            <a href="#" class="social-btn" aria-label="Twitter">𝕏</a>
            <a href="#" class="social-btn" aria-label="YouTube">▶</a>
            <a href="#" class="social-btn" aria-label="LinkedIn">in</a>
            <a href="#" class="social-btn" aria-label="RSS">⊕</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>CATEGORIES</h4>
          <a href="/tools/">🎨 Image Generation</a>
          <a href="/tools/">🎬 Video Editing</a>
          <a href="/tools/">✍️ Writing Tools</a>
          <a href="/tools/">💻 Code Assistants</a>
          <a href="/tools/">📄 PDF &amp; Docs</a>
          <a href="/tools/">🔬 Research Tools</a>
        </div>
        <div class="footer-col">
          <h4>RESOURCES</h4>
          <a href="/blog/">Blog &amp; Reviews</a>
          <a href="/compare/">Compare Tools</a>
          <a href="/tools/">Free AI Tools</a>
          <a href="/contact/">Submit a Tool</a>
          <a href="/blog/">AI Guides</a>
        </div>
        <div class="footer-col">
          <h4>COMPANY</h4>
          <a href="/about/">About Us</a>
          <a href="/contact/">Contact</a>
          <a href="/privacy/">Privacy Policy</a>
          <a href="/terms/">Terms of Use</a>
          <a href="/cookies/">Cookie Policy</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Find Best AI. All rights reserved.</span>
        <span>Made for the AI-powered world 🌍</span>
      </div>
    `;
  }

  /* ── THEME BUTTONS (sync both desktop + mobile) ── */
  function syncThemeBtns(){
    const t = isDark ? '🌙' : '☀️';
    ['themeBtn','themeBtnMobile'].forEach(id=>{
      const b = document.getElementById(id);
      if(b) b.textContent = t;
    });
  }
  syncThemeBtns();
  ['themeBtn','themeBtnMobile'].forEach(id=>{
    const b = document.getElementById(id);
    if(b) b.addEventListener('click', ()=>{ toggleTheme(); syncThemeBtns(); });
  });

  /* ── HAMBURGER ── */
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobileMenu');
  if(ham && mob){
    ham.addEventListener('click', ()=>{
      const open = mob.classList.toggle('open');
      ham.setAttribute('aria-expanded', open);
      ham.querySelectorAll('span').forEach((s,i)=>{
        if(open){
          if(i===0) s.style.transform='rotate(45deg) translate(5px,5px)';
          if(i===1) s.style.opacity='0';
          if(i===2) s.style.transform='rotate(-45deg) translate(5px,-5px)';
        } else { s.style.transform=''; s.style.opacity=''; }
      });
    });
  }
})();
