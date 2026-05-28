#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import json
import re

# Comprehensive AI Tools Database - from data.js
TOOLS = [
    # AI Assistants
    {"id": 1, "name": "ChatGPT", "cat": "AI Assistants", "emoji": "bot", "logo": "openai.com", "pricing": "freemium", "url": "https://chat.openai.com", "desc": "Advanced conversational AI from OpenAI", "rating": 4.9, "reviews": "98.2k", "price": "Free; Plus $20/month", "features": ["GPT-5 powered", "Real-time responses"], "alts": [{"n": "Claude", "t": "Freemium"}, {"n": "Gemini", "t": "Free"}], "freeAlt": "Gemini"},
    {"id": 2, "name": "Claude", "cat": "AI Assistants", "emoji": "bot", "logo": "claude.ai", "pricing": "freemium", "url": "https://claude.ai", "desc": "Leading AI assistant by Anthropic", "rating": 4.9, "reviews": "22.1k", "price": "Free; Pro $20/month", "features": ["Advanced reasoning", "1M token context"], "alts": [{"n": "ChatGPT", "t": "Freemium"}], "freeAlt": "ChatGPT"},
    {"id": 3, "name": "Gemini", "cat": "AI Assistants", "emoji": "bot", "logo": "gemini.google.com", "pricing": "freemium", "url": "https://gemini.google.com", "desc": "Google's multimodal AI assistant", "rating": 4.8, "reviews": "31.5k", "price": "Free; AI Pro $19.99/month", "features": ["Multimodal", "Google integrated"], "alts": [{"n": "ChatGPT", "t": "Freemium"}], "freeAlt": "Gemini"},
    {"id": 4, "name": "Microsoft Copilot", "cat": "AI Assistants", "emoji": "bot", "logo": "copilot.microsoft.com", "pricing": "freemium", "url": "https://copilot.microsoft.com", "desc": "AI assistant integrated across Microsoft products", "rating": 4.6, "reviews": "18.7k", "price": "Free; Copilot Pro $20/month", "features": ["Windows integrated", "Office integration"], "alts": [{"n": "ChatGPT", "t": "Freemium"}], "freeAlt": "ChatGPT"},
    {"id": 5, "name": "DeepSeek", "cat": "AI Assistants", "emoji": "bot", "logo": "deepseek.com", "pricing": "free", "url": "https://chat.deepseek.com", "desc": "Open-source AI assistant for coding and reasoning", "rating": 4.8, "reviews": "14.3k", "price": "Free", "features": ["Open source", "Coding focused"], "alts": [{"n": "ChatGPT", "t": "Freemium"}], "freeAlt": "DeepSeek"},
    
    # Image Generation
    {"id": 16, "name": "DALL-E 3", "cat": "Image Generation", "emoji": "art", "logo": "openai.com", "pricing": "freemium", "url": "https://openai.com/dall-e-3", "desc": "State-of-the-art image generation model", "rating": 4.7, "reviews": "11.2k", "price": "Included with ChatGPT Plus", "features": ["High-fidelity", "GPT-5 integrated"], "alts": [{"n": "Midjourney", "t": "Paid"}], "freeAlt": "Bing Image Creator"},
    {"id": 15, "name": "Midjourney", "cat": "Image Generation", "emoji": "art", "logo": "midjourney.com", "pricing": "paid", "url": "https://www.midjourney.com", "desc": "Leading AI image generator for artistic visuals", "rating": 4.9, "reviews": "12.4k", "price": "From $10/month", "features": ["Artistic quality", "Advanced prompting"], "alts": [{"n": "Leonardo AI", "t": "Freemium"}], "freeAlt": "Leonardo AI"},
    {"id": 17, "name": "Stable Diffusion", "cat": "Image Generation", "emoji": "art", "logo": "stability.ai", "pricing": "free", "url": "https://stability.ai", "desc": "Open-source text-to-image model", "rating": 4.7, "reviews": "22.1k", "price": "Free (model)", "features": ["Open source", "Customizable"], "alts": [{"n": "Midjourney", "t": "Paid"}], "freeAlt": "Stable Diffusion"},
    {"id": 18, "name": "Adobe Firefly", "cat": "Image Generation", "emoji": "art", "logo": "firefly.adobe.com", "pricing": "freemium", "url": "https://firefly.adobe.com", "desc": "Generative AI integrated into Adobe Creative Cloud", "rating": 4.6, "reviews": "9.3k", "price": "Included with Creative Cloud", "features": ["Adobe integrated", "Professional tools"], "alts": [{"n": "Bing Image Creator", "t": "Free"}], "freeAlt": "Bing Image Creator"},
    {"id": 19, "name": "Leonardo AI", "cat": "Image Generation", "emoji": "art", "logo": "leonardo.ai", "pricing": "freemium", "url": "https://leonardo.ai", "desc": "Popular generative AI for image creation and 3D assets", "rating": 4.6, "reviews": "7.4k", "price": "Free; Paid from $10/month", "features": ["Custom models", "3D generation"], "alts": [{"n": "Midjourney", "t": "Paid"}], "freeAlt": "Leonardo AI"},
    {"id": 20, "name": "Bing Image Creator", "cat": "Image Generation", "emoji": "art", "logo": "bing.com", "pricing": "free", "url": "https://www.bing.com/images/create", "desc": "Free image generation powered by DALL-E", "rating": 4.4, "reviews": "8.1k", "price": "Free", "features": ["DALL-E powered", "Free access"], "alts": [{"n": "Adobe Firefly", "t": "Freemium"}], "freeAlt": "Bing Image Creator"},

    # Video Editing  
    {"id": 24, "name": "Runway Gen-3", "cat": "Video Editing", "emoji": "film", "logo": "runwayml.com", "pricing": "freemium", "url": "https://runwayml.com", "desc": "Text-to-video AI model", "rating": 4.7, "reviews": "5.1k", "price": "From $12/month", "features": ["Video generation", "AI editing"], "alts": [{"n": "Pika Labs", "t": "Freemium"}], "freeAlt": "Pika Labs"},
    {"id": 30, "name": "CapCut", "cat": "Video Editing", "emoji": "film", "logo": "capcut.com", "pricing": "free", "url": "https://www.capcut.com", "desc": "Popular free video editing with AI features", "rating": 4.5, "reviews": "14.2k", "price": "Free; Pro $7.99/month", "features": ["AI editing", "Auto captions"], "alts": [{"n": "Descript", "t": "Freemium"}], "freeAlt": "CapCut"},

    # Code Assistants
    {"id": 31, "name": "GitHub Copilot", "cat": "Code Assistant", "emoji": "code", "logo": "github.com", "pricing": "freemium", "url": "https://github.com/features/copilot", "desc": "AI pair programmer for real-time code suggestions", "rating": 4.7, "reviews": "18.4k", "price": "Free limited; Pro $10/month", "features": ["Real-time suggestions", "Multi-language"], "alts": [{"n": "Codeium", "t": "Free"}], "freeAlt": "Codeium"},
    {"id": 32, "name": "Cursor", "cat": "Code Assistant", "emoji": "code", "logo": "cursor.sh", "pricing": "freemium", "url": "https://cursor.sh", "desc": "AI-first code editor", "rating": 4.8, "reviews": "9.6k", "price": "Free; Pro $20/month", "features": ["AI editor", "Code generation"], "alts": [{"n": "GitHub Copilot", "t": "Freemium"}], "freeAlt": "Codeium"},
    {"id": 34, "name": "Codeium", "cat": "Code Assistant", "emoji": "code", "logo": "codeium.com", "pricing": "free", "url": "https://codeium.com", "desc": "Free AI code completion and chat", "rating": 4.6, "reviews": "6.2k", "price": "Free", "features": ["Free unlimited", "Multi-language"], "alts": [{"n": "GitHub Copilot", "t": "Freemium"}], "freeAlt": "Codeium"},

    # Writing & Copy
    {"id": 39, "name": "Jasper AI", "cat": "Writing & Copy", "emoji": "pen", "logo": "jasper.ai", "pricing": "paid", "url": "https://www.jasper.ai", "desc": "Enterprise AI for content creation", "rating": 4.5, "reviews": "7.8k", "price": "From $39/month", "features": ["Brand voice", "Long-form"], "alts": [{"n": "Copy.ai", "t": "Freemium"}], "freeAlt": "Copy.ai"},
    {"id": 40, "name": "Copy.ai", "cat": "Writing & Copy", "emoji": "pen", "logo": "copy.ai", "pricing": "freemium", "url": "https://www.copy.ai", "desc": "AI content generation platform", "rating": 4.4, "reviews": "5.3k", "price": "Free; Pro $49/month", "features": ["Multiple templates", "AI writing"], "alts": [{"n": "Jasper", "t": "Paid"}], "freeAlt": "Copy.ai"},
    {"id": 42, "name": "Grammarly", "cat": "Writing & Copy", "emoji": "pen", "logo": "grammarly.com", "pricing": "freemium", "url": "https://www.grammarly.com", "desc": "AI writing assistant for clarity and correctness", "rating": 4.7, "reviews": "31.4k", "price": "Free; Premium $12/month", "features": ["Grammar checks", "AI rephrasing"], "alts": [{"n": "ProWritingAid", "t": "Freemium"}], "freeAlt": "Grammarly"},

    # Research
    {"id": 14, "name": "Perplexity AI", "cat": "Research", "emoji": "search", "logo": "perplexity.ai", "pricing": "freemium", "url": "https://www.perplexity.ai", "desc": "AI search engine for research", "rating": 4.8, "reviews": "8.9k", "price": "Free; Pro $20/month", "features": ["Real-time info", "Citations"], "alts": [{"n": "You.com", "t": "Free"}], "freeAlt": "You.com"},
    {"id": 55, "name": "NotebookLM", "cat": "Research", "emoji": "search", "logo": "notebooklm.google", "pricing": "free", "url": "https://notebooklm.google", "desc": "Google's AI research assistant", "rating": 4.8, "reviews": "7.1k", "price": "Free", "features": ["Document analysis", "Gemini powered"], "alts": [{"n": "Perplexity", "t": "Freemium"}], "freeAlt": "NotebookLM"},

    # Voice & Speech
    {"id": 44, "name": "ElevenLabs", "cat": "Voice & Speech", "emoji": "mic", "logo": "elevenlabs.io", "pricing": "freemium", "url": "https://elevenlabs.io", "desc": "Advanced AI speech synthesis and voice cloning", "rating": 4.9, "reviews": "6.7k", "price": "Free; From $5/month", "features": ["Voice cloning", "30+ languages"], "alts": [{"n": "PlayHT", "t": "Freemium"}], "freeAlt": "PlayHT"},
    {"id": 45, "name": "Whisper (OpenAI)", "cat": "Voice & Speech", "emoji": "mic", "logo": "openai.com", "pricing": "free", "url": "https://openai.com/research/whisper", "desc": "Robust speech-to-text model", "rating": 4.8, "reviews": "12.3k", "price": "Free", "features": ["100+ languages", "Open source"], "alts": [{"n": "ElevenLabs", "t": "Freemium"}], "freeAlt": "Whisper"},

    # Audio & Music
    {"id": 47, "name": "Suno AI", "cat": "Audio & Music", "emoji": "music", "logo": "suno.ai", "pricing": "freemium", "url": "https://suno.ai", "desc": "AI music generator for full songs", "rating": 4.7, "reviews": "4.2k", "price": "Free; Pro $10/month", "features": ["Full songs", "Vocal synthesis"], "alts": [{"n": "Udio", "t": "Freemium"}], "freeAlt": "Udio"},
    {"id": 48, "name": "Udio", "cat": "Audio & Music", "emoji": "music", "logo": "udio.com", "pricing": "freemium", "url": "https://www.udio.com", "desc": "Advanced AI music composition", "rating": 4.6, "reviews": "3.1k", "price": "Free; Creator $8/month", "features": ["Music composition", "Custom vocals"], "alts": [{"n": "Suno AI", "t": "Freemium"}], "freeAlt": "Suno AI"},

    # Graphic Design
    {"id": 49, "name": "Canva AI", "cat": "Graphic Design", "emoji": "design", "logo": "canva.com", "pricing": "freemium", "url": "https://www.canva.com", "desc": "AI-powered graphic design platform", "rating": 4.6, "reviews": "24.8k", "price": "Free; Pro $12.99/month", "features": ["Magic Design", "AI editing"], "alts": [{"n": "Adobe Express", "t": "Free"}], "freeAlt": "Microsoft Designer"},
    {"id": 50, "name": "Microsoft Designer", "cat": "Graphic Design", "emoji": "design", "logo": "designer.microsoft.com", "pricing": "free", "url": "https://designer.microsoft.com", "desc": "Microsoft's AI design tool with DALL-E 3", "rating": 4.3, "reviews": "4.2k", "price": "Free", "features": ["DALL-E 3", "Microsoft integrated"], "alts": [{"n": "Canva AI", "t": "Freemium"}], "freeAlt": "Microsoft Designer"},

    # PDF & Docs
    {"id": 69, "name": "ChatPDF", "cat": "PDF & Docs", "emoji": "doc", "logo": "chatpdf.com", "pricing": "freemium", "url": "https://www.chatpdf.com", "desc": "Chat with PDF documents", "rating": 4.5, "reviews": "5.9k", "price": "Free limited; Premium $6.99/month", "features": ["PDF Q&A", "Summarization"], "alts": [{"n": "Humata", "t": "Freemium"}], "freeAlt": "NotebookLM"},
    {"id": 70, "name": "Humata AI", "cat": "PDF & Docs", "emoji": "doc", "logo": "humata.ai", "pricing": "freemium", "url": "https://www.humata.ai", "desc": "AI insights from documents", "rating": 4.5, "reviews": "2.8k", "price": "Free; From $1.99/month", "features": ["Document analysis", "AI extraction"], "alts": [{"n": "ChatPDF", "t": "Freemium"}], "freeAlt": "NotebookLM"},

    # Data Analysis
    {"id": 65, "name": "Julius AI", "cat": "Data Analysis", "emoji": "chart", "logo": "julius.ai", "pricing": "freemium", "url": "https://julius.ai", "desc": "AI assistant for data analysis", "rating": 4.6, "reviews": "3.2k", "price": "Free; Pro $19/month", "features": ["Natural language", "Visualizations"], "alts": [{"n": "Rows AI", "t": "Freemium"}], "freeAlt": "Julius AI"},

    # Chatbots
    {"id": 67, "name": "Intercom Fin", "cat": "Chatbots", "emoji": "chat", "logo": "intercom.com", "pricing": "paid", "url": "https://www.intercom.com/fin", "desc": "AI chatbot for customer support", "rating": 4.6, "reviews": "4.8k", "price": "From $99/month", "features": ["Query resolution", "Human handoff"], "alts": [{"n": "Tidio AI", "t": "Freemium"}], "freeAlt": "Botpress"},
    {"id": 68, "name": "Botpress", "cat": "Chatbots", "emoji": "chat", "logo": "botpress.com", "pricing": "freemium", "url": "https://botpress.com", "desc": "Open-source chatbot platform", "rating": 4.5, "reviews": "3.6k", "price": "Free; From $49/month", "features": ["Visual builder", "AI responses"], "alts": [{"n": "Tidio AI", "t": "Freemium"}], "freeAlt": "Botpress"},

    # SEO & Marketing
    {"id": 60, "name": "Semrush AI", "cat": "SEO & Marketing", "emoji": "growth", "logo": "semrush.com", "pricing": "paid", "url": "https://www.semrush.com", "desc": "AI SEO and marketing platform", "rating": 4.7, "reviews": "12.1k", "price": "From $129.95/month", "features": ["SEO optimization", "AI content"], "alts": [{"n": "Ahrefs", "t": "Paid"}], "freeAlt": "Ubersuggest"},
    {"id": 61, "name": "Surfer SEO", "cat": "SEO & Marketing", "emoji": "growth", "logo": "surferseo.com", "pricing": "paid", "url": "https://surferseo.com", "desc": "AI content optimization for SEO", "rating": 4.6, "reviews": "5.7k", "price": "From $89/month", "features": ["Content editor", "Keyword research"], "alts": [{"n": "Semrush", "t": "Paid"}], "freeAlt": "NeuronWriter"},

    # Automation
    {"id": 57, "name": "Zapier AI", "cat": "Automation", "emoji": "auto", "logo": "zapier.com", "pricing": "freemium", "url": "https://zapier.com", "desc": "Automation platform with AI", "rating": 4.6, "reviews": "9.2k", "price": "Free; From various prices", "features": ["6000+ integrations", "AI automation"], "alts": [{"n": "Make", "t": "Freemium"}], "freeAlt": "n8n"},
    {"id": 58, "name": "Make (Integromat)", "cat": "Automation", "emoji": "auto", "logo": "make.com", "pricing": "freemium", "url": "https://www.make.com", "desc": "Visual automation for workflows", "rating": 4.6, "reviews": "6.1k", "price": "Free; From $9/month", "features": ["Visual builder", "Integrations"], "alts": [{"n": "Zapier", "t": "Freemium"}], "freeAlt": "n8n"},
    {"id": 59, "name": "n8n", "cat": "Automation", "emoji": "auto", "logo": "n8n.io", "pricing": "free", "url": "https://n8n.io", "desc": "Open-source workflow automation", "rating": 4.7, "reviews": "5.3k", "price": "Free self-hosted", "features": ["Open source", "350+ apps"], "alts": [{"n": "Zapier", "t": "Freemium"}], "freeAlt": "n8n"},

    # Photo Editing
    {"id": 62, "name": "Adobe Photoshop AI", "cat": "Photo Editing", "emoji": "photo", "logo": "adobe.com", "pricing": "paid", "url": "https://www.adobe.com/products/photoshop", "desc": "Professional photo editing with Firefly AI", "rating": 4.8, "reviews": "19.4k", "price": "From $22.99/month", "features": ["Generative Fill", "Firefly AI"], "alts": [{"n": "Canva AI", "t": "Freemium"}], "freeAlt": "Canva AI"},
    {"id": 64, "name": "Remove.bg", "cat": "Photo Editing", "emoji": "photo", "logo": "remove.bg", "pricing": "freemium", "url": "https://www.remove.bg", "desc": "AI background removal tool", "rating": 4.7, "reviews": "7.8k", "price": "Free low-res; From 0.20/image", "features": ["Background removal", "High accuracy"], "alts": [{"n": "Canva AI", "t": "Freemium"}], "freeAlt": "Remove.bg"},

    # Video Avatars
    {"id": 52, "name": "HeyGen", "cat": "Video Avatars", "emoji": "avatar", "logo": "heygen.com", "pricing": "freemium", "url": "https://www.heygen.com", "desc": "AI video generation with avatars", "rating": 4.6, "reviews": "3.9k", "price": "Free trial; From $29/month", "features": ["Custom avatars", "Voice cloning"], "alts": [{"n": "Synthesia", "t": "Paid"}], "freeAlt": "D-ID"},
    {"id": 53, "name": "Synthesia", "cat": "Video Avatars", "emoji": "avatar", "logo": "synthesia.io", "pricing": "paid", "url": "https://www.synthesia.io", "desc": "Professional AI video generation", "rating": 4.5, "reviews": "4.6k", "price": "From $22/month", "features": ["100+ avatars", "200+ languages"], "alts": [{"n": "HeyGen", "t": "Freemium"}], "freeAlt": "D-ID"},

    # Notes & PKM
    {"id": 43, "name": "Notion AI", "cat": "Notes & PKM", "emoji": "note", "logo": "notion.so", "pricing": "paid", "url": "https://www.notion.so", "desc": "AI inside Notion workspace", "rating": 4.5, "reviews": "11.2k", "price": "Free for personal; Plus $8/month", "features": ["Writing assist", "Database automation"], "alts": [{"n": "Obsidian", "t": "Free"}], "freeAlt": "Obsidian"},
    {"id": 166, "name": "Obsidian", "cat": "Notes & PKM", "emoji": "note", "logo": "obsidian.md", "pricing": "free", "url": "https://obsidian.md", "desc": "Powerful knowledge base", "rating": 4.9, "reviews": "28.9k", "price": "Free", "features": ["Local markdown", "Graph view"], "alts": [{"n": "Logseq", "t": "Free"}], "freeAlt": "Obsidian"},

    # Productivity
    {"id": 74, "name": "Otter AI", "cat": "Productivity", "emoji": "prod", "logo": "otter.ai", "pricing": "freemium", "url": "https://otter.ai", "desc": "AI meeting assistant", "rating": 4.6, "reviews": "8.4k", "price": "Free; Pro $16.99/month", "features": ["Real-time transcription", "Action items"], "alts": [{"n": "Fireflies.ai", "t": "Freemium"}], "freeAlt": "Fathom"},
    {"id": 76, "name": "Gamma AI", "cat": "Productivity", "emoji": "prod", "logo": "gamma.app", "pricing": "freemium", "url": "https://gamma.app", "desc": "AI presentation creator", "rating": 4.7, "reviews": "5.8k", "price": "Free; From $10/month", "features": ["AI generation", "Interactive content"], "alts": [{"n": "Tome AI", "t": "Freemium"}], "freeAlt": "Gamma AI"},

    # 3D & AR
    {"id": 72, "name": "Spline AI", "cat": "3D & AR", "emoji": "3d", "logo": "spline.design", "pricing": "freemium", "url": "https://spline.design", "desc": "AI 3D design tool", "rating": 4.5, "reviews": "3.1k", "price": "Free; From $7/month", "features": ["Text-to-3D", "Animation"], "alts": [{"n": "Meshy AI", "t": "Freemium"}], "freeAlt": "Spline AI"},
    {"id": 73, "name": "Meshy AI", "cat": "3D & AR", "emoji": "3d", "logo": "meshy.ai", "pricing": "freemium", "url": "https://www.meshy.ai", "desc": "3D model generation", "rating": 4.5, "reviews": "2.4k", "price": "Free; From $12/month", "features": ["Text-to-3D", "Textures"], "alts": [{"n": "Spline AI", "t": "Freemium"}], "freeAlt": "Meshy AI"},
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
        alt_slug = get_tool_slug(alt['n'])
        alternatives_html += f"          <div><a href='/tool/{alt_slug}/'>{alt['n']} ({alt['t']})</a></div>\n"
    
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
<meta property="og:description" content="Honest {tool['name']} review: pricing, features, pros and cons in 2026.">
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
a {{ color: #10b981; text-decoration: none; }} a:hover {{ text-decoration: underline; }}
.btn {{ display: inline-block; padding: 1rem 2rem; background: #10b981; color: white; border-radius: 8px; font-weight: bold; }}
</style>
</head>
<body>
<main>
  <nav><a href="/">Home</a> > <a href="/tools/">Tools</a> > <a href="/tools/?cat={tool['cat']}">{tool['cat']}</a> > {tool['name']}</nav>
  <h1>{tool['name']}</h1>
  <p>{tool['desc']}</p>
  <div class="meta">
    <div class="meta-item"><strong>Rating:</strong> {tool['rating']}/5</div>
    <div class="meta-item"><strong>Pricing:</strong> {tool['pricing'].upper()}</div>
    <div class="meta-item"><strong>Category:</strong> {tool['cat']}</div>
    <div class="meta-item"><strong>Reviews:</strong> {tool['reviews']}</div>
  </div>
  <div class="section">
    <h2>Overview</h2>
    <p>{tool['desc']}</p>
    <p><strong>Pricing:</strong> {tool['price']}</p>
    <p><strong>Free Alternative:</strong> <a href="/tool/{get_tool_slug(tool.get('freeAlt', 'ChatGPT'))}/">{tool.get('freeAlt', 'ChatGPT')}</a></p>
  </div>
  <div class="section">
    <h2>Key Features</h2>
    <div>{features_html}    </div>
  </div>
  <div class="section">
    <h2>Similar Tools</h2>
    <div>{alternatives_html}    </div>
  </div>
  <div class="section">
    <h2>Visit {tool['name']}</h2>
    <a href="{tool['url']}" target="_blank" class="btn">Visit {tool['name']} →</a>
  </div>
</main>
<footer style="text-align: center; padding: 2rem; border-top: 1px solid #333; margin-top: 2rem;">
  <p>&copy; 2026 FindBestAI - Discover the best AI tools</p>
</footer>
<script src="/assets/js/data.js"></script>
<script src="/assets/js/app.js"></script>
</body>
</html>"""
    return html

def create_all_tool_pages():
    """Create all tool pages"""
    base_dir = "tool"
    os.makedirs(base_dir, exist_ok=True)
    
    success_count = 0
    for tool in TOOLS:
        try:
            slug = get_tool_slug(tool['name'])
            tool_dir = os.path.join(base_dir, slug)
            os.makedirs(tool_dir, exist_ok=True)
            
            html = generate_tool_page_html(tool)
            html_path = os.path.join(tool_dir, 'index.html')
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(html)
            
            print(f"Created: {slug}")
            success_count += 1
        except Exception as e:
            print(f"Error: {tool.get('name')}: {str(e)}")
    
    print(f"\n{'='*60}")
    print(f"Generated {success_count} tool pages successfully!")
    print(f"Total tools: {len(TOOLS)}")
    print(f"{'='*60}")

if __name__ == '__main__':
    print("Starting comprehensive tool page generator...")
    print("="*60)
    create_all_tool_pages()
