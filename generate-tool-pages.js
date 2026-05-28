#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════
// TOOL PAGE GENERATOR - Creates detail pages for all AI tools
// Usage: node generate-tool-pages.js
// ═══════════════════════════════════════════════════════════════════

const TOOLS_DATA = require('./assets/js/data.js');

// Extract TOOLS and CATS from the data
const TOOLS = TOOLS_DATA.TOOLS;
const CATS = TOOLS_DATA.CATS;

// Helper function to convert tool name to URL slug
function getToolSlug(toolName) {
  return toolName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to get pricing color
function getPricingBadgeClass(pricing) {
  const pricingMap = {
    'free': 'b-free',
    'freemium': 'b-freemium',
    'paid': 'b-paid'
  };
  return pricingMap[pricing.toLowerCase()] || 'b-freemium';
}

// Helper function to get category slug
function getCategorySlug(catName) {
  return catName
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
}

// Helper function to generate star rating HTML
function getStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '★';
  }
  if (hasHalf) {
    stars += '½';
  }
  
  return stars;
}

// Helper function to generate pros based on tool type
function generatePros(tool, toolCategory) {
  const prosMap = {
    'AI Assistants': [
      'Advanced reasoning and contextual understanding',
      'Seamless multi-turn conversation capabilities',
      'Quick and accurate response generation',
      'Integration with various external tools and services',
      'Consistent performance across different use cases'
    ],
    'Image Generation': [
      'Produces high-quality, detailed images',
      'Easy to use interface for various skill levels',
      'Fast generation time with quality output',
      'Diverse style options and customization',
      'Regular updates with new features and improvements'
    ],
    'Video Editing': [
      'Streamlines video production workflow significantly',
      'Professional-grade output quality',
      'User-friendly interface for quick edits',
      'Powerful automation features save time',
      'Great for both beginners and professionals'
    ],
    'Code Assistant': [
      'Speeds up development significantly',
      'Supports multiple programming languages',
      'Accurate code suggestions and completions',
      'Helps with debugging and optimization',
      'Learns from your coding patterns'
    ],
    'Writing & Copy': [
      'Generates high-quality content quickly',
      'Versatile for various writing styles',
      'Improves consistency in tone and voice',
      'Saves significant time on content creation',
      'Helps overcome writer block'
    ],
    'Research': [
      'Quickly synthesizes large amounts of information',
      'Provides cited and sourced answers',
      'Great for literature reviews and summaries',
      'Saves hours of manual research time',
      'Organizes information effectively'
    ],
    'Voice & Speech': [
      'Natural-sounding voice output',
      'Supports multiple languages and accents',
      'Fast processing speeds',
      'Customizable voice parameters',
      'Reliable transcription accuracy'
    ],
    'Audio & Music': [
      'Generates unique original compositions',
      'Royalty-free music for commercial use',
      'Quick turnaround for content creators',
      'No musical skills required',
      'Diverse genre and style options'
    ],
    'Graphic Design': [
      'Accelerates design workflow',
      'Professional-quality output',
      'Great for non-designers',
      'Wide range of templates and options',
      'Collaborative features for teams'
    ],
    'PDF & Docs': [
      'Quickly extracts key information from documents',
      'Supports various document formats',
      'Accurate summarization and analysis',
      'Great for research and knowledge management',
      'Saves hours of manual reading'
    ],
    'Notes & PKM': [
      'Organizes knowledge effectively',
      'AI-powered connections and discovery',
      'Improves information retention',
      'Great for researchers and students',
      'Flexible and customizable structure'
    ],
    'Data Analysis': [
      'Transforms raw data into insights quickly',
      'No coding required for analysis',
      'Beautiful visualizations',
      'Handles large datasets efficiently',
      'Natural language querying'
    ],
    'Chatbots': [
      'Handles customer inquiries automatically',
      'Reduces support team workload',
      'Available 24/7 for users',
      'Improves customer satisfaction',
      'Easy to set up and customize'
    ],
    'SEO & Marketing': [
      'Improves search engine rankings',
      'Data-driven content strategy',
      'Saves time on keyword research',
      'Competitive analysis tools',
      'Actionable insights and recommendations'
    ],
    'Automation': [
      'Automates repetitive tasks',
      'Integrates with hundreds of apps',
      'No coding required',
      'Saves hours of manual work',
      'Improves workflow efficiency'
    ],
    'Photo Editing': [
      'Professional-quality photo enhancements',
      'Intuitive and easy to use',
      'Advanced features for experts',
      'Quick batch processing',
      'AI-powered automatic adjustments'
    ],
    'Email & Outreach': [
      'Increases email open and response rates',
      'Personalization at scale',
      'Time-saving automation',
      'Analytics and tracking',
      'Integration with CRM platforms'
    ],
    'Video Avatars': [
      'Creates professional videos without cameras',
      'Realistic and customizable avatars',
      'Multi-language support',
      'Scales video production',
      'Perfect for training and marketing'
    ],
    '3D & AR': [
      'Democratizes 3D content creation',
      'Fast generation from text or images',
      'High-quality 3D models',
      'Export to various formats',
      'Great for games and design'
    ],
    'Productivity': [
      'Boosts overall productivity',
      'Streamlines workflow',
      'Integrates with existing tools',
      'Saves time on routine tasks',
      'Improves team collaboration'
    ]
  };
  
  return prosMap[toolCategory] || prosMap['AI Assistants'];
}

// Helper function to generate cons based on tool type
function generateCons(tool, toolCategory) {
  const consMap = {
    'AI Assistants': [
      'May require API key for advanced usage',
      'Response quality depends on prompt clarity',
      'Some limitations with real-time information',
      'Token limits for longer conversations',
      'Can be expensive at high volumes'
    ],
    'Image Generation': [
      'Quality varies with prompt specificity',
      'Steep learning curve for optimal prompts',
      'Some output quality limitations',
      'Limited free tier on most platforms',
      'Copyright and ethical considerations'
    ],
    'Video Editing': [
      'Rendering can be time consuming',
      'Large file sizes require storage',
      'Learning curve for advanced features',
      'Expensive for professional plans',
      'Limited offline capabilities'
    ],
    'Code Assistant': [
      'Doesn\'t understand complex project context fully',
      'May suggest outdated approaches',
      'Requires careful code review',
      'Can be resource intensive',
      'Best for small to medium snippets'
    ],
    'Writing & Copy': [
      'May require editing and refinement',
      'Can be repetitive without variation',
      'Limited understanding of brand voice',
      'Requires human oversight',
      'Potential plagiarism concerns'
    ],
    'Research': [
      'Information may not be perfectly current',
      'Can hallucinate or be inaccurate',
      'Limited to indexed sources',
      'Doesn\'t replace thorough research',
      'Requires verification of sources'
    ],
    'Voice & Speech': [
      'Some quality issues in edge cases',
      'Limited language support for some platforms',
      'Voice cloning requires training data',
      'Subscription costs add up',
      'Not suitable for all accents'
    ],
    'Audio & Music': [
      'Generated music can sound robotic',
      'Limited customization in some platforms',
      'Quality inconsistency across genres',
      'Commercial rights vary by platform',
      'Still developing technology'
    ],
    'Graphic Design': [
      'Output may require manual refinement',
      'Learning curve for optimization',
      'Limited for highly custom designs',
      'Some tools charge per generation',
      'Ethical concerns about AI art'
    ],
    'PDF & Docs': [
      'May struggle with complex layouts',
      'Scanned documents require OCR',
      'Large files may be slow',
      'Subscription models required',
      'Privacy concerns for sensitive documents'
    ],
    'Notes & PKM': [
      'Initial setup and learning curve',
      'Requires consistent note taking habits',
      'Information overload if not managed',
      'Limited mobile experience on some platforms',
      'May be overwhelming for simple use cases'
    ],
    'Data Analysis': [
      'Requires clean, structured data',
      'Complex queries need refinement',
      'Large datasets can be slow',
      'Privacy concerns with data uploads',
      'Learning curve for optimal results'
    ],
    'Chatbots': [
      'Can misunderstand complex queries',
      'Requires training for specific use cases',
      'Limited emotional intelligence',
      'May need human handoff capability',
      'Performance varies by implementation'
    ],
    'SEO & Marketing': [
      'Algorithm changes affect recommendations',
      'Requires expertise to implement',
      'Results take time to show',
      'Competitive market dynamics',
      'Tool limitations on new trends'
    ],
    'Automation': [
      'Complex workflows may need custom code',
      'Limited integration availability',
      'Error handling can be tricky',
      'Maintenance required for stability',
      'Learning curve for advanced features'
    ],
    'Photo Editing': [
      'May require manual touch ups',
      'Expensive for advanced features',
      'Large file processing can be slow',
      'Limited to photo specific tasks',
      'Quality depends on input quality'
    ],
    'Email & Outreach': [
      'Deliverability concerns',
      'Requires careful personalization',
      'Spam filter risks',
      'Limited A/B testing options',
      'Subscription costs for full features'
    ],
    'Video Avatars': [
      'Avatar customization limited',
      'Rendering time can be lengthy',
      'Expensive for high volume',
      'Somewhat unnatural in some cases',
      'Limited language support'
    ],
    '3D & AR': [
      'Steep learning curve for some tools',
      'Output may require refinement',
      'File formats compatibility issues',
      'Rendering can be resource intensive',
      'Still developing field'
    ],
    'Productivity': [
      'Not all tools integrate well',
      'Learning new platforms takes time',
      'Subscription costs add up',
      'Transition costs from existing tools',
      'May require training'
    ]
  };
  
  return consMap[toolCategory] || consMap['AI Assistants'];
}

// Helper function to generate features
function generateFeatures(tool) {
  return tool.features || [];
}

// Helper function to format pricing string
function formatPricingString(price) {
  if (!price) return 'Contact for pricing';
  return price.substring(0, 200) + (price.length > 200 ? '...' : '');
}

// Helper function to get related tools (same category, excluding current)
function getRelatedTools(toolCategory, currentToolId, limit = 8) {
  return TOOLS
    .filter(t => t.cat === toolCategory && t.id !== currentToolId)
    .slice(0, limit);
}

// Main template generator function
function generateToolPageHTML(tool) {
  const slug = getToolSlug(tool.name);
  const categorySlug = getCategorySlug(tool.cat);
  const pricingBadge = getPricingBadgeClass(tool.pricing);
  const stars = getStarRating(tool.rating);
  const pros = generatePros(tool, tool.cat);
  const cons = generateCons(tool, tool.cat);
  const features = generateFeatures(tool);
  const relatedTools = getRelatedTools(tool.cat, tool.id);
  
  // Generate pros HTML
  const prosHTML = pros.map(p => `<div class="pc-item pc-pro"><span class="pc-icon">✓</span><span>${p}</span></div>`).join('\n                ');
  
  // Generate cons HTML
  const consHTML = cons.map(c => `<div class="pc-item pc-con"><span class="pc-icon">✗</span><span>${c}</span></div>`).join('\n                ');
  
  // Generate features HTML
  const featuresHTML = features.map(f => `<div class="feature-item"><span class="feat-icon">→</span><span>${f}</span></div>`).join('\n          ');
  
  // Generate alternatives HTML (tools in same category)
  const alternativesHTML = tool.alts.map(alt => {
    const altTool = TOOLS.find(t => t.name === alt.n);
    if (!altTool) return '';
    const altSlug = getToolSlug(altTool.name);
    const altBadge = getPricingBadgeClass(alt.t.toLowerCase());
    return `<a href="/tool/${altSlug}/" class="alt-card">
            <div class="alt-logo">
              <img src="https://www.google.com/s2/favicons?sz=32&domain=${altTool.logo}" alt="${alt.n}" width="18" height="18" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='${alt.n.charAt(0)}'">
            </div>
            <div class="alt-info">
              <div class="alt-name">${alt.n}</div>
              <span class="badge b-${alt.t.toLowerCase()}">${alt.t.toUpperCase()}</span>
            </div>
          </a>`;
  }).join('\n          ');
  
  // Generate comparison table with related tools
  const compTools = [tool, ...relatedTools.slice(0, 3)];
  const compTableHeaders = compTools.map((t, idx) => {
    const highlightClass = idx === 0 ? ' comp-th-highlight' : '';
    return `<th class="${highlightClass}">${t.name}</th>`;
  }).join('\n              ');
  
  const compTableRows = [
    {name: 'Rating', getData: (t) => `<span class="stars-sm">${getStarRating(t.rating)}</span> ${t.rating}`},
    {name: 'Pricing', getData: (t) => `<span class="badge b-${t.pricing.toLowerCase()}">${t.pricing.toUpperCase()}</span>`},
    {name: 'Category', getData: (t) => t.cat},
    {name: 'Best For', getData: (t) => t.desc.substring(0, 40) + '...'}
  ].map(row => {
    const cells = compTools.map((t, idx) => {
      const highlightClass = idx === 0 ? ' comp-col-highlight' : '';
      return `<td${highlightClass}>${row.getData(t)}</td>`;
    }).join('\n                ');
    return `<tr>
                <td>${row.name}</td>
                ${cells}
              </tr>`;
  }).join('\n              ');
  
  // Generate related tools cards
  const relatedToolsHTML = relatedTools.map(relTool => {
    const relSlug = getToolSlug(relTool.name);
    const relPricingBadge = getPricingBadgeClass(relTool.pricing);
    const relStars = getStarRating(relTool.rating);
    return `<!-- ${relTool.name} -->
      <div class="more-card reveal">
        <div class="mc-top">
          <div class="mc-logo mc-logo--rounded">
            <img src="https://www.google.com/s2/favicons?sz=64&domain=${relTool.logo}" alt="${relTool.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='${relTool.name.charAt(0)}'">
          </div>
          <span class="mc-pricing b-${relTool.pricing.toLowerCase().replace('freemium', 'freemium')}">${relTool.pricing.toUpperCase()}</span>
        </div>
        <div class="mc-name">${relTool.name}</div>
        <div class="mc-cat">${relTool.cat.toUpperCase()}</div>
        <div class="mc-desc">${relTool.desc}</div>
        <div class="mc-rating">
          <span class="mc-stars">${relStars}</span>
          <span class="mc-score">${relTool.rating}</span>
        </div>
        <div class="mc-divider"></div>
        <div class="mc-footer">
          <a href="/tool/${relSlug}/" class="mc-details-btn">View Details →</a>
        </div>
      </div>`;
  }).join('\n\n      ');

  const bestFreeAlt = tool.freeAlt || 'View alternatives';
  const bestFreeAltSlug = getToolSlug(bestFreeAlt);

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Is ${tool.name} Worth It? Pricing, Features & Free Alternatives | FindBestAI</title>
<meta name="description" content="Read our complete overview of ${tool.name} before you buy. Discover its hidden features, pros and cons and explore the best free alternatives available today.">
<meta name="keywords" content="${tool.name} review, ${tool.name} pricing 2026, ${tool.name} features, ${tool.name} free alternative, best ${tool.cat.toLowerCase()} 2026, AI tools comparison">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="https://findbestai.app/tool/${slug}/">
<meta property="og:title" content="${tool.name} Review 2026: Pricing, Features and Free Alternatives">
<meta property="og:description" content="Honest ${tool.name} review: pricing, key features, pros and cons, and the best free alternatives in 2026. Is it worth it? We break it all down.">
<meta property="og:url" content="https://findbestai.app/tool/${slug}/">
<meta property="og:type" content="article">
<meta property="og:image" content="https://findbestai.app/featured-image-findbestai.png">
<meta property="og:site_name" content="FindBestAI">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${tool.name} Review 2026: Pricing, Features and Free Alternatives">
<meta name="twitter:description" content="Is ${tool.name} worth it in 2026? Full review covering pricing, features, pros, cons, and top free alternatives. Updated for ${new Date().getFullYear()}.">
<meta name="twitter:image" content="https://findbestai.app/featured-image-findbestai.png">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"${tool.name}","description":"${tool.desc}","url":"${tool.url}","applicationCategory":"${tool.cat}","operatingSystem":"Web","offers":{"@type":"Offer","price":"${tool.price || 'Contact'}","priceCurrency":"USD"},"aggregateRating":{"@type":"AggregateRating","ratingValue":"${tool.rating}","reviewCount":"${tool.reviews.replace('k', '000')}","bestRating":"5","worstRating":"1"}}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://findbestai.app"},{"@type":"ListItem","position":2,"name":"All AI Tools","item":"https://findbestai.app/tools/"},{"@type":"ListItem","position":3,"name":"${tool.cat}","item":"https://findbestai.app/tools/?cat=${encodeURIComponent(tool.cat)}"},{"@type":"ListItem","position":4,"name":"${tool.name}","item":"https://findbestai.app/tool/${slug}/"}]}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/main.css">
<link rel="stylesheet" href="/assets/css/tool-detail.css">
<style>
  .hero-card { min-height: 0 !important; padding-top: 1.75rem !important; }
  .hero-bg-blob { display: none !important; }
  .hero-ring-wrap { min-height: 0 !important; }
  .more-see-all-wrap { display: flex; justify-content: center; margin-top: 2rem; }
  .more-see-all-wrap .sc-visit-btn { width: auto !important; display: inline-flex !important; align-items: center; justify-content: center; gap: .5rem; padding: 1.05rem 2.4rem !important; font-size: 1.05rem !important; font-weight: 700 !important; letter-spacing: .01em !important; }
  @media (max-width: 768px) {
    .more-see-all-wrap .sc-visit-btn { padding: 0.65rem 1.4rem !important; font-size: 0.82rem !important; font-weight: 600 !important; }
  }
  .more-section h2, .detail-section .section-title { font-size: 1.6rem !important; font-weight: 800 !important; color: var(--text) !important; letter-spacing: -.02em; margin: 0 0 1.25rem 0 !important; display: flex; align-items: center; gap: .6rem; padding: 0 !important; border: 0 !important; background: none !important; }
  .detail-section .section-title::before, .detail-section .section-title::after { display: none !important; content: none !important; }
  .detail-section .section-title .sec-num { font-family: 'JetBrains Mono', monospace; font-size: 1rem; font-weight: 600; color: var(--accent2); background: none !important; padding: 0 !important; border: 0 !important; }
  .more-card { display: flex; flex-direction: column; gap: 0; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 22px 22px 18px 22px; cursor: default; position: relative; overflow: visible; isolation: isolate; text-decoration: none !important; transition: transform 0.28s cubic-bezier(0.23,1,0.32,1), box-shadow 0.28s cubic-bezier(0.23,1,0.32,1), border-color 0.28s, background 0.35s; }
  .more-card::before { content: ''; position: absolute; inset: -2px; border-radius: 22px; background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3), var(--accent)); background-size: 300% 300%; opacity: 0; z-index: -1; transition: opacity 0.3s ease; animation: ringGlow 4s ease infinite; box-shadow: 0 0 32px var(--glow), 0 0 64px var(--glow2); }
  .more-card::after { content: ''; position: absolute; inset: 1px; border-radius: 19px; background: var(--surface); z-index: -1; transition: background 0.35s; }
  .more-card:hover { transform: translateY(-6px); box-shadow: 0 0 40px var(--glow), 0 0 80px var(--glow2), var(--shadow-lg); border-color: transparent; }
  .more-card:hover::before { opacity: 1; }
  .more-card > * { position: relative; z-index: 1; }
  .mc-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0; }
  .mc-top .mc-logo { margin-bottom: 16px; }
  .mc-pricing { font-size: 0.62rem; font-weight: 700; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em; padding: 4px 9px; border-radius: 6px; white-space: nowrap; line-height: 1; }
  .mc-pricing.b-free { background: color-mix(in srgb, #22c55e 15%, transparent); color: #22c55e; border: 1px solid color-mix(in srgb, #22c55e 35%, transparent); }
  .mc-pricing.b-freemium { background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent); }
  .mc-pricing.b-paid { background: color-mix(in srgb, #f59e0b 15%, transparent); color: #f59e0b; border: 1px solid color-mix(in srgb, #f59e0b 35%, transparent); }
  .mc-logo { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; background: #111 !important; border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.22), 0 0 0 1.5px rgba(0,0,0,0.08); margin-bottom: 16px; transition: transform 0.3s; }
  .more-card:hover .mc-logo { transform: scale(1.07) rotate(-2deg); }
  .mc-logo img { width: 100%; height: 100%; object-fit: contain; padding: 7px; box-sizing: border-box; display: block; }
  .mc-logo--circle { border-radius: 50% !important; }
  .mc-logo--circle img { border-radius: 50% !important; padding: 6px; }
  .mc-logo--rounded { border-radius: 14px !important; }
  .mc-logo--rounded img { border-radius: 0 !important; }
  [data-theme="light"] .mc-logo { box-shadow: 0 3px 16px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.07); }
  .mc-name { font-size: 1.05rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text); margin-bottom: 4px; line-height: 1.25; }
  .mc-cat { font-size: 0.65rem; font-weight: 600; font-family: 'JetBrains Mono', monospace; color: var(--text3); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
  .mc-desc { font-size: 0.84rem; color: var(--text2); line-height: 1.68; flex: 1; margin-bottom: 16px; }
  .mc-rating { display: flex; align-items: center; gap: 7px; margin-bottom: 16px; }
  .mc-stars { color: var(--gold); font-size: 0.82rem; letter-spacing: -0.5px; }
  .mc-score { font-size: 0.76rem; font-weight: 700; color: var(--text2); font-family: 'JetBrains Mono', monospace; }
  .mc-divider { height: 1px; background: var(--border); margin-bottom: 16px; border: none; flex-shrink: 0; }
  .mc-footer { display: flex; align-items: center; }
  .mc-details-btn { padding: 7px 18px; border-radius: 9px; border: 1px solid color-mix(in srgb, var(--accent) 65%, transparent); background: transparent; color: color-mix(in srgb, var(--accent) 85%, var(--text2)); font-size: 0.8rem; font-weight: 500; font-family: 'Outfit', sans-serif; text-decoration: none !important; cursor: pointer; transition: background .22s, color .22s, border-color .22s, transform .22s; display: inline-flex; align-items: center; gap: 4px; }
  .mc-details-btn:hover { background: linear-gradient(135deg, var(--accent), var(--accent2)); border-color: transparent; color: #fff; transform: translateY(-1px); }
  .sec-num { display: none !important; }
  .badge { width: fit-content !important; display: inline-block !important; }
  .alt-logo { width: 38px !important; height: 38px !important; border-radius: 10px !important; overflow: hidden !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; background: #111 !important; box-shadow: 0 2px 8px rgba(0,0,0,0.22), 0 0 0 1.5px rgba(0,0,0,0.08) !important; }
  .alt-logo img { width: 100% !important; height: 100% !important; object-fit: contain !important; padding: 5px !important; box-sizing: border-box !important; display: block !important; border-radius: 0 !important; }
  .alt-logo.circle { border-radius: 50% !important; }
  .btn-compare { background: linear-gradient(135deg, var(--accent), var(--accent2)) !important; color: #fff !important; border-color: transparent !important; box-shadow: 0 0 20px var(--glow), 0 4px 14px rgba(0,0,0,0.25) !important; font-weight: 600 !important; }
  .btn-compare:hover { transform: translateY(-2px) !important; box-shadow: 0 0 32px var(--glow), 0 0 64px var(--glow2), 0 6px 18px rgba(0,0,0,0.3) !important; color: #fff !important; }
  .btn-bing-style { background: transparent !important; color: var(--text) !important; border: 1.5px solid var(--border-md) !important; border-radius: 10px !important; font-weight: 500 !important; box-shadow: none !important; transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease !important; }
  .btn-bing-style:hover { background: var(--surface3) !important; border-color: var(--border-hi) !important; color: var(--text) !important; transform: translateY(-2px) !important; box-shadow: none !important; }
  @media (max-width: 768px) {
    .more-card { border-radius: 16px; padding: 18px 18px 14px 18px; overflow: hidden; }
    .more-card::before { border-radius: 18px; }
    .more-card::after { border-radius: 15px; }
    .mc-logo { width: 44px; height: 44px; margin-bottom: 12px; }
    .mc-name { font-size: 0.95rem; }
    html, body { overflow-x: hidden !important; max-width: 100vw !important; }
    .tool-detail-main, .detail-content, .detail-left, .more-section, .hero-ring-wrap, .hero-card { overflow-x: hidden !important; max-width: 100% !important; }
    .comp-table-wrap { overflow-x: auto !important; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: var(--accent) var(--surface); padding-bottom: 6px; }
    .comp-table-wrap::-webkit-scrollbar { height: 5px; }
    .comp-table-wrap::-webkit-scrollbar-track { background: var(--surface); border-radius: 4px; }
    .comp-table-wrap::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 4px; }
    .comp-table { min-width: 480px; }
    .sidebar-card, .sidebar-freealt { display: none !important; }
    .more-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
    .more-card { padding: 14px 13px 12px 13px !important; }
    .mc-desc { font-size: 0.78rem !important; line-height: 1.55 !important; }
    .mc-name { font-size: 0.88rem !important; }
    .mc-cat { font-size: 0.58rem !important; }
    .mc-stars { font-size: 0.74rem !important; }
    .mc-score { font-size: 0.7rem !important; }
    .mc-details-btn { font-size: 0.72rem !important; padding: 6px 10px !important; }
  }
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
    <a href="/tools/?cat=${encodeURIComponent(tool.cat)}">${tool.cat}</a><span class="bc-sep">›</span>
    <span class="bc-current">${tool.name}</span>
  </nav>

  <div class="hero-ring-wrap">
    <div class="hero-card">
      <div class="hero-logo-wrap">
        <div class="hero-logo" style="border-radius:14px;overflow:hidden;background:#111;width:52px;height:52px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 10px rgba(0,0,0,0.3);">
          <img src="https://www.google.com/s2/favicons?sz=64&domain=${tool.logo}"
               alt="${tool.name} logo" width="52" height="52" loading="eager" style="width:100%;height:100%;object-fit:contain;padding:8px;box-sizing:border-box;border-radius:0;"
               onerror="this.style.display='none';this.parentElement.innerHTML='<span style=font-size:1.4rem>${tool.emoji}</span>'">
        </div>
        <div class="hero-logo-info">
          <h1 class="hero-name">${tool.name}</h1>
          <div class="hero-cat-row">
            <a href="/tools/?cat=${encodeURIComponent(tool.cat)}" class="hero-cat">${tool.cat}</a>
            <span class="badge ${pricingBadge}">${tool.pricing.toUpperCase()}</span>
            ${tool.badge ? `<span class="badge b-badge">🔥 ${tool.badge.charAt(0).toUpperCase() + tool.badge.slice(1)}</span>` : ''}
          </div>
        </div>
      </div>

      <div class="hero-meta-grid">
        <div class="meta-item">
          <div class="meta-label">Rating</div>
          <div class="meta-val">
            <span class="stars-gold">${stars}</span>
            <span>${tool.rating}</span>
          </div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Reviews</div>
          <div class="meta-val" style="font-family:'JetBrains Mono',monospace">${tool.reviews}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Pricing</div>
          <div class="meta-val" style="color:var(--gold);font-weight:800">${tool.pricing.toUpperCase()}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Category</div>
          <div class="meta-val" style="font-size:.82rem">${tool.cat}</div>
        </div>
      </div>

      <div class="best-for-badge">
        <span class="bf-label">Best For</span>
        <span class="bf-val">${tool.desc}</span>
      </div>

      <p class="hero-desc">${tool.desc}</p>

      <div class="hero-actions">
        <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="btn-visit">
          Visit ${tool.name} →
        </a>
        <a href="/tools/?cat=${encodeURIComponent(tool.cat)}" class="btn-alt btn-bing-style">Browse More Tools</a>
        <a href="/compare/" class="btn-compare btn-bing-style">Compare Tools</a>
      </div>
    </div>
  </div>

  <div class="detail-content">
    <div class="detail-left">
      <div class="detail-section reveal">
        <h2 class="section-title">Overview</h2>
        <p class="section-desc">${tool.desc}</p>
        <div class="price-box">
          <span class="price-label">💰 Pricing</span>
          <span class="price-val">${formatPricingString(tool.price)}</span>
        </div>
        <div class="free-alt-box">
          <span class="fa-label">🆓 Best Free Alternative</span>
          <a href="/tool/${bestFreeAltSlug}/" class="fa-link">${bestFreeAlt} →</a>
        </div>
      </div>

      <div class="detail-section reveal">
        <h2 class="section-title">Pros and Cons</h2>
        <div class="pros-cons-grid">
          <div class="pros-box">
            <div class="pc-header pc-header-pro">✓ What We Like</div>
            ${prosHTML}
          </div>
          <div class="cons-box">
            <div class="pc-header pc-header-con">✗ Limitations</div>
            ${consHTML}
          </div>
        </div>
      </div>

      <div class="detail-section reveal">
        <h2 class="section-title">Key Features</h2>
        <div class="features-list">
          ${featuresHTML}
        </div>
      </div>

      <div class="detail-section reveal">
        <h2 class="section-title">Similar Alternatives</h2>
        <div class="alts-grid">
          ${alternativesHTML}
        </div>
      </div>

      <div class="detail-section reveal">
        <h2 class="section-title">Compare with Similar Tools</h2>
        <div class="comp-table-wrap">
          <table class="comp-table">
            <thead>
              <tr>
                <th>Feature</th>
                ${compTableHeaders}
              </tr>
            </thead>
            <tbody>
              ${compTableRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <aside class="detail-sidebar" aria-label="Tool information">
      <div class="sidebar-card reveal">
        <div class="sc-title">Tool Stats</div>
        <div class="sc-row"><span class="sc-lbl">Rating</span><span class="sc-val">${tool.rating} / 5.0</span></div>
        <div class="sc-row"><span class="sc-lbl">Reviews</span><span class="sc-val">${tool.reviews}</span></div>
        <div class="sc-row"><span class="sc-lbl">Pricing</span><span class="sc-val" style="color:var(--gold)">${tool.pricing.toUpperCase()}</span></div>
        <div class="sc-row"><span class="sc-lbl">Category</span><a href="/tools/?cat=${encodeURIComponent(tool.cat)}" class="sc-link">${tool.cat}</a></div>
        <div class="sc-row"><span class="sc-lbl">Developer</span><span class="sc-val">${tool.name}</span></div>
        <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="sc-visit-btn">
          Visit ${tool.name} →
        </a>
      </div>

      <div class="sidebar-card sidebar-freealt reveal">
        <div class="sfa-title">💰 Don't want to pay?</div>
        <div class="sfa-sub">Best free alternative to ${tool.name}:</div>
        <a href="/tool/${bestFreeAltSlug}/" class="sfa-btn">${bestFreeAlt} — Free →</a>
      </div>
    </aside>
  </div>

  <section class="more-section">
    <div class="more-header">
      <h2>More ${tool.cat} Tools</h2>
    </div>
    <div class="more-grid">
      ${relatedToolsHTML}
    </div>
    <div class="more-see-all-wrap">
      <a href="/tools/?cat=${encodeURIComponent(tool.cat)}" class="sc-visit-btn">
        View all ${tool.cat} tools →
      </a>
    </div>
  </section>
</main>

<footer id="site-footer" role="contentinfo"></footer>
<script src="/assets/js/data.js"></script>
<script src="/assets/js/app.js"></script>
<script src="/assets/js/nav.js"></script>
<script>
  if(typeof initCommonUI==='function') initCommonUI();
  (function(){
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, {threshold: 0.07, rootMargin: '0px 0px -30px 0px'});
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  })();
</script>
</body>
</html>`;

  return html;
}

// Main function to create all tool pages
function createAllToolPages() {
  const baseDir = path.join(__dirname, 'tool');
  
  // Create tool directory if it doesn't exist
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  TOOLS.forEach(tool => {
    try {
      const slug = getToolSlug(tool.name);
      const toolDir = path.join(baseDir, slug);
      
      // Create tool-specific directory
      if (!fs.existsSync(toolDir)) {
        fs.mkdirSync(toolDir, { recursive: true });
      }
      
      // Generate and write HTML file
      const html = generateToolPageHTML(tool);
      const htmlPath = path.join(toolDir, 'index.html');
      fs.writeFileSync(htmlPath, html, 'utf-8');
      
      console.log(`✓ Created: /tool/${slug}/index.html`);
      successCount++;
    } catch (error) {
      console.error(`✗ Error creating page for ${tool.name}:`, error.message);
      errorCount++;
    }
  });
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Generated ${successCount} tool pages successfully!`);
  if (errorCount > 0) {
    console.log(`Failed to generate ${errorCount} pages.`);
  }
  console.log(`${'='.repeat(60)}`);
}

// Run the generator
createAllToolPages();
