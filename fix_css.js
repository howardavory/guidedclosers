const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Phase 1: Cyan CTAs
// Replace the old background rule:
css = css.replace(/background:\s*linear-gradient\(90deg,\s*#06b6d4\s*0%,\s*#2563eb\s*100%\)\s*!important;/g, 
  'background-image: none !important;\n  background-color: #00E5FF !important;');

// Ensure the buttons also have a dark text so they're readable against neon cyan
css = css.replace(/\.theme-antigravity\s*button\.bg-\\[\\#00FF00\\],[\s\S]*?\{[\s\S]*?-webkit-text-fill-color:\s*#ffffff\s*!important;/g, (match) => {
  return match.replace(/-webkit-text-fill-color: #ffffff !important;/, '-webkit-text-fill-color: #09090b !important;\n  color: #09090b !important;');
});

// Remove any conflicting bg-black/60 rules that could be intercepting Phase 3 and 4.
// Specifically the group block for glassmorphism
css = css.replace(/\.theme-antigravity\s*\.bg-black\\\/60,/g, ''); 

// Ensure we don't have multiple copies of my appended blocks
css = css.replace(/\/\* Phase 1: Electric Cyan CTA[\s\S]*?(?=(\/\*|$))/g, '');
css = css.replace(/\/\* Phase 2: Silver Lining[\s\S]*?(?=(\/\*|$))/g, '');
css = css.replace(/\/\* Phase 3: Solid Pillar[\s\S]*?(?=(\/\*|$))/g, '');
css = css.replace(/\/\* Phase 4: Silver-Purple[\s\S]*?(?=(\/\*|$))/g, '');

const newRules = `

/* Phase 1: Electric Cyan CTA Hover States */
.theme-antigravity button.bg-\\[\\#FF0055\\]:hover,
.theme-antigravity button.bg-\\[\\#00FF00\\]:hover,
.theme-antigravity button.bg-\\[\\#FFE600\\]:hover {
  background-color: #00E5FF !important;
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.4) !important;
}

/* Phase 2: Silver Lining Toggles */
.theme-antigravity button.bg-white {
  background-color: #1e293b !important;
  color: #f1f5f9 !important;
  border: 1px solid #C0C0C0 !important;
  box-shadow: none !important;
  transition: all 0.2s ease-in-out !important;
}
.theme-antigravity button.bg-white:hover {
  background-color: #334155 !important;
  box-shadow: inset 0 0 12px rgba(192, 192, 192, 0.2) !important;
}

/* Phase 3: Solid Pillar Containers */
.theme-antigravity .comic-glass {
  background-image: none !important;
  background-color: #0f172a !important; 
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border: 1px solid #1e293b !important; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
}

/* Phase 4: Silver-Purple-Peach Agent Bubbles */
.theme-antigravity .bg-black\\/60.leading-relaxed {
  background-image: linear-gradient(to bottom right, #334155, rgba(88, 28, 135, 0.6), rgba(124, 45, 18, 0.6)) !important;
  background-color: transparent !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1rem !important; 
  border-top-left-radius: 0.125rem !important; 
  padding: 1rem !important; 
  color: #ffffff !important;
  font-weight: 500 !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
  transform: none !important;
}
`;

fs.writeFileSync('src/app/globals.css', css + newRules);
console.log('Fixed applied!');
