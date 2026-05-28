#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import re

# Full tools database manually created from data.js
TOOLS = [
    {"id": 1, "name": "ChatGPT", "cat": "AI Assistants", "emoji": "bot", "logo": "openai.com", "pricing": "freemium", "badge": "popular", "url": "https://chat.openai.com", "desc": "ChatGPT is an advanced conversational AI from OpenAI", "rating": 4.9, "reviews": "98.2k", "price": "Free; Plus $20/month", "features": ["Powered by GPT-5", "Real-time responses"], "alts": [{"n": "Claude", "t": "Freemium"}], "freeAlt": "Gemini"},
    {"id": 16, "name": "DALL-E 3", "cat": "Image Generation", "emoji": "art", "logo": "openai.com", "pricing": "freemium", "badge": "popular", "url": "https://openai.com/dall-e-3", "desc": "DALL-E 3 is OpenAI's state-of-the-art image generation model", "rating": 4.7, "reviews": "11.2k", "price": "Included with ChatGPT Plus", "features": ["High-fidelity generation"], "alts": [{"n": "Midjourney", "t": "Paid"}], "freeAlt": "Bing Image Creator"},
    {"id": 2, "name": "Claude", "cat": "AI Assistants", "emoji": "bot", "logo": "claude.ai", "pricing": "freemium", "badge": "popular", "url": "https://claude.ai", "desc": "Claude is a leading AI assistant by Anthropic", "rating": 4.9, "reviews": "22.1k", "price": "Free; Pro $20/month", "features": ["Advanced reasoning"], "alts": [{"n": "ChatGPT", "t": "Freemium"}], "freeAlt": "ChatGPT"},
    {"id": 3, "name": "Gemini", "cat": "AI Assistants", "emoji": "bot", "logo": "gemini.google.com", "pricing": "freemium", "badge": "popular", "url": "https://gemini.google.com", "desc": "Gemini is Google's multimodal AI assistant", "rating": 4.8, "reviews": "31.5k", "price": "Free; Pro $19.99/month", "features": ["Multimodal understanding"], "alts": [{"n": "ChatGPT", "t": "Freemium"}], "freeAlt": "ChatGPT"},
    {"id": 15, "name": "Midjourney", "cat": "Image Generation", "emoji": "art", "logo": "midjourney.com", "pricing": "paid", "badge": "popular", "url": "https://www.midjourney.com", "desc": "Midjourney is a leading AI image generator", "rating": 4.9, "reviews": "12.4k", "price": "From $10/month", "features": ["Artistic quality"], "alts": [{"n": "Leonardo AI", "t": "Freemium"}], "freeAlt": "Leonardo AI"},
]

def get_tool_slug(tool_name):
    """Convert tool name to URL slug"""
    slug = tool_name.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'--+', '-', slug)
    slug = re.sub(r'^-+|-+$', '', slug)
    return slug

def generate_tool_page_html(tool):
    """Generate complete HTML for a tool page"""
    slug = get_tool_slug(tool['name'])
    
    # Generate alternatives HTML
    alternatives_html = ""
    for alt in tool.get('alts', []):
        alt_name = alt['n']
        alt_type = alt['t']
        alt_slug = get_tool_slug(alt_name)
        alternatives_html += f"          <div><a href='/tool/{alt_slug}/'>{alt_name} ({alt_type})</a></div>\n"
    
    # Generate features HTML
    features_html = ""
    for feature in tool.get('features', []):
        features_html += f"          <div>- {feature}</div>\n"
    
    html = f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{tool['name']} Review 2026: Pricing, Features and Alternatives | FindBestAI</title>
<meta name="description" content="Honest {tool['name']} review: pricing, key features, pros and cons, and alternatives in 2026.">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="https://findbestai.app/tool/{slug}/">
<meta property="og:title" content="{tool['name']} Review 2026: Pricing, Features and Alternatives">
<meta property="og:description" content="Honest {tool['name']} review: pricing, key features, pros and cons, and alternatives in 2026.">
<meta property="og:url" content="https://findbestai.app/tool/{slug}/">
<meta property="og:type" content="article">
<link rel="stylesheet" href="/assets/css/main.css">
<style>
body {{ background: #0f0f0f; color: #e0e0e0; font-family: 'Outfit', sans-serif; }}
main {{ max-width: 1200px; margin: 0 auto; padding: 2rem; }}
h1 {{ font-size: 2.5rem; margin-bottom: 1rem; }}
.meta {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }}
.meta-item {{ background: #1a1a1a; padding: 1rem; border-radius: 8px; border-left: 4px solid #10b981; }}
.section {{ margin: 2rem 0; padding: 1.5rem; background: #1a1a1a; border-radius: 8px; }}
a {{ color: #10b981; text-decoration: none; }}
a:hover {{ text-decoration: underline; }}
</style>
</head>
<body>
<main>
  <nav class="breadcrumb">
    <a href="/">Home</a> > <a href="/tools/">Tools</a> > <a href="/tools/?cat={tool['cat']}">{tool['cat']}</a> > {tool['name']}
  </nav>

  <h1>{tool['name']}</h1>
  <p>{tool['desc']}</p>

  <div class="meta">
    <div class="meta-item">
      <strong>Rating:</strong> {tool['rating']}/5 ({tool['reviews']} reviews)
    </div>
    <div class="meta-item">
      <strong>Pricing:</strong> {tool['pricing'].upper()}
    </div>
    <div class="meta-item">
      <strong>Category:</strong> {tool['cat']}
    </div>
    <div class="meta-item">
      <strong>Price:</strong> {tool['price']}
    </div>
  </div>

  <div class="section">
    <h2>Overview</h2>
    <p>{tool['desc']}</p>
    <p><strong>Pricing:</strong> {tool['price']}</p>
    <p><strong>Free Alternative:</strong> <a href="/tool/{get_tool_slug(tool['freeAlt'])}/">{tool['freeAlt']}</a></p>
  </div>

  <div class="section">
    <h2>Key Features</h2>
    <div>{features_html}    </div>
  </div>

  <div class="section">
    <h2>Similar Alternatives</h2>
    <div>{alternatives_html}    </div>
  </div>

  <div class="section">
    <h2>Visit {tool['name']}</h2>
    <a href="{tool['url']}" target="_blank" style="display: inline-block; padding: 1rem 2rem; background: #10b981; color: white; border-radius: 8px; font-weight: bold;">
      Visit {tool['name']} -->
    </a>
  </div>
</main>

<footer style="text-align: center; padding: 2rem; border-top: 1px solid #333; margin-top: 2rem;">
  <p>&copy; 2026 FindBestAI - Discover the best AI tools for your needs</p>
</footer>

<script src="/assets/js/data.js"></script>
<script src="/assets/js/app.js"></script>
</body>
</html>"""
    
    return html

def create_all_tool_pages():
    """Create all tool pages"""
    base_dir = "tool"
    
    # Create base tool directory
    os.makedirs(base_dir, exist_ok=True)
    
    success_count = 0
    error_count = 0
    
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
            
            print(f"Created: /tool/{slug}/index.html")
            success_count += 1
        except Exception as e:
            print(f"Error creating page for {tool.get('name', 'Unknown')}: {str(e)}")
            error_count += 1
    
    print(f"\n{'='*60}")
    print(f"Generated {success_count} tool pages successfully!")
    if error_count > 0:
        print(f"Encountered {error_count} errors")
    print(f"{'='*60}")

if __name__ == '__main__':
    print("Starting tool page generator...")
    print("="*60)
    create_all_tool_pages()
