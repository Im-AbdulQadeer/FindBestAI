/* ════════════════════════════════════════
   SHARED NAV + FOOTER INJECTION
   Include this after app.js on every page
════════════════════════════════════════ */

(function(){
  /* ── Determine active page ── */
  const path = window.location.pathname.replace(/\/$/,'') || '/';
  const page = path.split('/').filter(Boolean)[0] || 'home';

  /* ── Inject nav ── */
  const navEl = document.getElementById('topnav');
  if(navEl){
    navEl.innerHTML = `
      <a class="nav-logo" href="/" aria-label="AI Hub Home">AI<span style="background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text"> Hub</span></a>
      <div class="nav-links">
        <a href="/" class="${page==='home'?'active':''}">Home</a>
        <a href="/tools/" class="${page==='tools'?'active':''}">All Tools</a>
        <a href="/compare/" class="${page==='compare'?'active':''}">Compare</a>
        <a href="/blog/" class="${page==='blog'?'active':''}">Blog</a>
        <a href="/about/" class="${page==='about'?'active':''}">About</a>
        <a href="/contact/" class="${page==='contact'?'active':''}">Contact</a>
      </div>
      <div class="nav-actions">
        <button class="theme-btn" id="themeBtn" aria-label="Toggle theme" title="Toggle dark/light mode">🌙</button>
        <a href="/contact/" class="btn-outline">Submit Tool</a>
        <a href="/tools/" class="btn-primary">Explore →</a>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    `;
  }

  /* ── Inject mobile menu ── */
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

  /* ── Inject footer ── */
  const footerEl = document.getElementById('site-footer');
  if(footerEl){
    footerEl.innerHTML = `
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="nav-logo" style="margin-bottom:14px;display:inline-block">AI Hub</div>
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
          <a href="/tools/">📄 PDF & Docs</a>
          <a href="/tools/">🔬 Research Tools</a>
        </div>
        <div class="footer-col">
          <h4>RESOURCES</h4>
          <a href="/blog/">Blog & Reviews</a>
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
        <span>© 2026 AI Hub. All rights reserved.</span>
        <span>Made for the AI-powered world 🌍</span>
      </div>
    `;
  }

  /* ── Re-init theme btn after nav injection ── */
  const newThemeBtn = document.getElementById('themeBtn');
  if(newThemeBtn){
    newThemeBtn.textContent = isDark ? '🌙' : '☀️';
    newThemeBtn.addEventListener('click', toggleTheme);
  }

  /* ── Re-init hamburger after nav injection ── */
  const newHamburger = document.getElementById('hamburger');
  const newMobileMenu = document.getElementById('mobileMenu');
  if(newHamburger && newMobileMenu){
    newHamburger.addEventListener('click', ()=>{
      const open = newMobileMenu.classList.toggle('open');
      newHamburger.setAttribute('aria-expanded', open);
      newHamburger.querySelectorAll('span').forEach((s,i)=>{
        if(open){
          if(i===0) s.style.transform='rotate(45deg) translate(5px,5px)';
          if(i===1) s.style.opacity='0';
          if(i===2) s.style.transform='rotate(-45deg) translate(5px,-5px)';
        } else { s.style.transform=''; s.style.opacity=''; }
      });
    });
  }
})();
