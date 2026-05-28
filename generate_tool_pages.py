#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import re
import sys
import subprocess

# ═══════════════════════════════════════════════════════════════════
# TOOL PAGE GENERATOR - Creates detail pages for all AI tools
# ═══════════════════════════════════════════════════════════════════

def extract_tools_from_data_js():
    """Extract TOOLS array from data.js"""
    try:
        data_js_path = "assets/js/data.js"
        with open(data_js_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract the TOOLS array using regex
        match = re.search(r'const TOOLS = \[(.*?)\];', content, re.DOTALL)
        if match:
            tools_str = '[' + match.group(1) + ']'
            
            # Clean up JavaScript object syntax to JSON
            # Replace unquoted keys with quoted keys
            tools_str = re.sub(r'(\w+):', r'"\1":', tools_str)
            # Replace single quotes with double quotes (but be careful with existing doubles)
            tools_str = re.sub(r"'([^']*)'", r'"\1"', tools_str)
            # Remove trailing commas before closing braces
            tools_str = re.sub(r',\s*}', '}', tools_str)
            # Remove trailing commas before closing brackets
            tools_str = re.sub(r',\s*\]', ']', tools_str)
            # Fix double-quoted keys that got double-escaped
            tools_str = re.sub(r'""(\w+)"":', r'"\1":', tools_str)
            
            tools = json.loads(tools_str)
            return tools
    except Exception as e:
        print(f"Error parsing data.js: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

# Try to load from data.js, fallback to sample data
TOOLS = extract_tools_from_data_js()
if not TOOLS:
    print("Warning: Could not extract tools from data.js, using sample data")
    TOOLS = [
        {
            "id": 1,
            "name": "ChatGPT",
            "cat": "AI Assistants",
            "emoji": "🤖",
            "logo": "openai.com",
            "pricing": "freemium",
            "badge": "popular",
            "url": "https://chat.openai.com",
            "desc": "ChatGPT is an advanced conversational AI from OpenAI, powered by the GPT-5 model.",
            "rating": 4.9,
            "reviews": "98.2k",
            "price": "Free; Plus $20/month",
            "features": ["Powered by GPT-5 family", "Real-time responses"],
            "alts": [{"n": "Claude", "t": "Freemium"}],
            "freeAlt": "Gemini"
        }
    ]
else:
    print(f"Successfully loaded {len(TOOLS)} tools from data.js")

def get_tool_slug(tool_name):
    """Convert tool name to URL slug"""
    slug = tool_name.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'--+', '-', slug)
    slug = re.sub(r'^-+|-+$', '', slug)
    return slug

def get_pricing_badge_class(pricing):
    """Get pricing badge class"""
    pricing_map = {
        'free': 'b-free',
        'freemium': 'b-freemium',
        'paid': 'b-paid'
    }
    return pricing_map.get(pricing.lower(), 'b-freemium')

def get_category_slug(cat_name):
    """Get category slug"""
    slug = cat_name.lower()
    slug = re.sub(r'[^\w\s]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    return slug

def get_star_rating(rating):
    """Generate star rating HTML"""
    full_stars = int(rating)
    has_half = rating % 1 != 0
    stars = '★' * full_stars
    if has_half:
        stars += '½'
    return stars

def generate_tool_page_html(tool):
    """Generate complete HTML for a tool page"""
    slug = get_tool_slug(tool['name'])
    category_slug = get_category_slug(tool['cat'])
    pricing_badge = get_pricing_badge_class(tool['pricing'])
    stars = get_star_rating(tool['rating'])
    
    # Generate alternatives HTML
    alternatives_html = ""
    for alt in tool.get('alts', []):
        alt_name = alt['n']
        alt_type = alt['t']
        alt_slug = get_tool_slug(alt_name)
        alt_badge = get_pricing_badge_class(alt_type)
        alt_emoji = alt_name[0].upper()
        
        alternatives_html += f"""          <a href="/tool/{alt_slug}/" class="alt-card">
            <div class="alt-logo">
              <img src="https://www.google.com/s2/favicons?sz=32&domain=example.com" alt="{alt_name}" width="18" height="18" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='{alt_emoji}'">
            </div>
            <div class="alt-info">
              <div class="alt-name">{alt_name}</div>
              <span class="badge b-{alt_type.lower()}">{alt_type.upper()}</span>
            </div>
          </a>
"""
    
    # Generate features HTML
    features_html = ""
    for feature in tool.get('features', []):
        features_html += f"""          <div class="feature-item"><span class="feat-icon">→</span><span>{feature}</span></div>
"""
    
    html = f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Is {tool['name']} Worth It? Pricing, Features & Free Alternatives | FindBestAI</title>
<meta name="description" content="Read our complete overview of {tool['name']} before you buy. Discover its hidden features, pros and cons and explore the best free alternatives available today.">
<meta name="keywords" content="{tool['name']} review, {tool['name']} pricing 2026, {tool['name']} features, best {tool['cat'].lower()} 2026, AI tools">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="https://findbestai.app/tool/{slug}/">
<meta property="og:title" content="{tool['name']} Review 2026: Pricing, Features and Free Alternatives">
<meta property="og:description" content="Honest {tool['name']} review: pricing, key features, pros and cons, and alternatives in 2026.">
<meta property="og:url" content="https://findbestai.app/tool/{slug}/">
<meta property="og:type" content="article">
<meta property="og:image" content="https://findbestai.app/featured-image-findbestai.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/main.css">
<link rel="stylesheet" href="/assets/css/tool-detail.css">
<style>
  .hero-card {{ min-height: 0 !important; padding-top: 1.75rem !important; }}
  .hero-bg-blob {{ display: none !important; }}
  .hero-ring-wrap {{ min-height: 0 !important; }}
</style>
</head>
<body>
<div class="bg-grid" aria-hidden="true"></div>
<div class="bg-orb orb-a" aria-hidden="true"></div>
<div class="bg-orb orb-b" aria-hidden="true"></div>
<nav id="topnav" role="navigation" aria-label="Main navigation"></nav>
<div id="mobileMenu" class="mobile-menu" role="navigation" aria-label="Mobile menu"></div>

<main class="tool-detail-main">
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/">Home</a><span class="bc-sep">›</span>
    <a href="/tools/">Tools</a><span class="bc-sep">›</span>
    <a href="/tools/?cat={tool['cat']}">{tool['cat']}</a><span class="bc-sep">›</span>
    <span class="bc-current">{tool['name']}</span>
  </nav>

  <div class="hero-ring-wrap">
    <div class="hero-card">
      <div class="hero-logo-wrap">
        <div class="hero-logo" style="border-radius:14px;overflow:hidden;background:#111;width:52px;height:52px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 10px rgba(0,0,0,0.3);">
          <img src="https://www.google.com/s2/favicons?sz=64&domain={tool['logo']}" alt="{tool['name']} logo" width="52" height="52" loading="eager" style="width:100%;height:100%;object-fit:contain;padding:8px;box-sizing:border-box;border-radius:0;" onerror="this.style.display='none';this.parentElement.innerHTML='<span style=font-size:1.4rem>{tool['emoji']}</span>'">
        </div>
        <div class="hero-logo-info">
          <h1 class="hero-name">{tool['name']}</h1>
          <div class="hero-cat-row">
            <a href="/tools/?cat={tool['cat']}" class="hero-cat">{tool['cat']}</a>
            <span class="badge {pricing_badge}">{tool['pricing'].upper()}</span>
            {'<span class="badge b-badge">🔥 ' + tool['badge'].capitalize() + '</span>' if tool.get('badge') else ''}
          </div>
        </div>
      </div>

      <div class="hero-meta-grid">
        <div class="meta-item">
          <div class="meta-label">Rating</div>
          <div class="meta-val">
            <span class="stars-gold">{stars}</span>
            <span>{tool['rating']}</span>
          </div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Reviews</div>
          <div class="meta-val" style="font-family:'JetBrains Mono',monospace">{tool['reviews']}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Pricing</div>
          <div class="meta-val" style="color:var(--gold);font-weight:800">{tool['pricing'].upper()}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Category</div>
          <div class="meta-val" style="font-size:.82rem">{tool['cat']}</div>
        </div>
      </div>

      <div class="best-for-badge">
        <span class="bf-label">Best For</span>
        <span class="bf-val">{tool['desc'][:100]}...</span>
      </div>

      <p class="hero-desc">{tool['desc']}</p>

      <div class="hero-actions">
        <a href="{tool['url']}" target="_blank" rel="noopener noreferrer" class="btn-visit">
          Visit {tool['name']} →
        </a>
        <a href="/tools/?cat={tool['cat']}" class="btn-alt btn-bing-style">Browse More Tools</a>
        <a href="/compare/" class="btn-compare btn-bing-style">Compare Tools</a>
      </div>
    </div>
  </div>

  <div class="detail-content">
    <div class="detail-left">
      <div class="detail-section reveal">
        <h2 class="section-title">Overview</h2>
        <p class="section-desc">{tool['desc']}</p>
        <div class="price-box">
          <span class="price-label">💰 Pricing</span>
          <span class="price-val">{tool['price']}</span>
        </div>
        <div class="free-alt-box">
          <span class="fa-label">🆓 Best Free Alternative</span>
          <a href="/tool/{get_tool_slug(tool['freeAlt'])}/" class="fa-link">{tool['freeAlt']} →</a>
        </div>
      </div>

      <div class="detail-section reveal">
        <h2 class="section-title">Key Features</h2>
        <div class="features-list">
{features_html}        </div>
      </div>

      <div class="detail-section reveal">
        <h2 class="section-title">Similar Alternatives</h2>
        <div class="alts-grid">
{alternatives_html}        </div>
      </div>
    </div>

    <aside class="detail-sidebar" aria-label="Tool information">
      <div class="sidebar-card reveal">
        <div class="sc-title">Tool Stats</div>
        <div class="sc-row"><span class="sc-lbl">Rating</span><span class="sc-val">{tool['rating']} / 5.0</span></div>
        <div class="sc-row"><span class="sc-lbl">Reviews</span><span class="sc-val">{tool['reviews']}</span></div>
        <div class="sc-row"><span class="sc-lbl">Pricing</span><span class="sc-val" style="color:var(--gold)">{tool['pricing'].upper()}</span></div>
        <div class="sc-row"><span class="sc-lbl">Category</span><a href="/tools/?cat={tool['cat']}" class="sc-link">{tool['cat']}</a></div>
        <a href="{tool['url']}" target="_blank" rel="noopener noreferrer" class="sc-visit-btn">
          Visit {tool['name']} →
        </a>
      </div>
    </aside>
  </div>
</main>

<footer id="site-footer" role="contentinfo"></footer>
<script src="/assets/js/data.js"></script>
<script src="/assets/js/app.js"></script>
<script src="/assets/js/nav.js"></script>
<script>
  if(typeof initCommonUI==='function') initCommonUI();
  (function(){{
    const obs = new IntersectionObserver(entries => {{
      entries.forEach(e => {{
        if(e.isIntersecting){{ e.target.classList.add('visible'); obs.unobserve(e.target); }}
      }});
    }}, {{threshold: 0.07, rootMargin: '0px 0px -30px 0px'}});
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }})();
</script>
</body>
</html>"""
    
    return html

def create_all_tool_pages():
    """Create all tool pages"""
    base_dir = "tool"
    
    # Create base tool directory
    os.makedirs(base_dir, exist_ok=True)
    
    success_count = 0
    
    for tool in TOOLS:
        try:
            slug = get_tool_slug(tool['name'])
            tool_dir = os.path.join(base_dir, slug)
            
            # Create tool-specific directory
            os.makedirs(tool_dir, exist_ok=True)
            
            # Generate and write HTML file
            html = generate_tool_page_html(tool)
            html_path = os.path.join(tool_dir, 'index.html')
            
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(html)
            
            print(f"✓ Created: /tool/{slug}/index.html")
            success_count += 1
        except Exception as e:
            print(f"✗ Error creating page for {tool['name']}: {str(e)}")
    
    print(f"\n{'='*60}")
    print(f"Generated {success_count} tool pages successfully!")
    print(f"{'='*60}")

if __name__ == '__main__':
    print("Starting tool page generator...")
    print("="*60)
    create_all_tool_pages()
