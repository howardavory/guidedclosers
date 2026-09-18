const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Phase 1: Re-map the gradient CTA buttons to solid Cyan #00E5FF
css = css.replace(/background-image:\s*linear-gradient\(90deg,\s*#06b6d4\s*0%,\s*#2563eb\s*100%\)\s*!important;/g,
                  'background-image: none !important;\n  background-color: #00E5FF !important;');

// Add hover cyan glow
if (!css.includes('/* Phase 1: Electric Cyan CTA Hover States */')) {
  css += `\n/* Phase 1: Electric Cyan CTA Hover States */
.theme-antigravity button.bg-\\[\\#FF0055\\]:hover,
.theme-antigravity button.bg-\\[\\#00FF00\\]:hover,
.theme-antigravity button.bg-\\[\\#FFE600\\]:hover {
  background-color: #00E5FF !important;
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.4) !important;
}\n`;
}

// Phase 2: Silver Lining Toggles
if (!css.includes('/* Phase 2: Silver Lining Toggles */')) {
  css += `\n/* Phase 2: Silver Lining Toggles */
.theme-antigravity button.bg-white {
  background-color: #1e293b !important; /* Dark slate */
  color: #f1f5f9 !important;
  border: 1px solid #C0C0C0 !important; /* Silver metallic edge */
  box-shadow: none !important;
  transition: all 0.2s ease-in-out !important;
}
.theme-antigravity button.bg-white:hover {
  background-color: #334155 !important;
  box-shadow: inset 0 0 12px rgba(192, 192, 192, 0.2) !important;
}\n`;
}

// Phase 3: Solid Pillar Containers
// The pillars use .comic-glass (and some others might use it too).
// Let's add a specific rule overriding .comic-glass inside .theme-antigravity to be solid slate-900.
if (!css.includes('/* Phase 3: Solid Pillar Containers */')) {
  css += `\n/* Phase 3: Solid Pillar Containers */
.theme-antigravity .comic-glass {
  background-image: none !important;
  background-color: #0f172a !important; /* bg-slate-900 */
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border: 1px solid #1e293b !important; /* border-slate-800 */
  box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
}\n`;
}

// Phase 4: Agent Bubbles
// The agent bubbles use .bg-black/60 and .leading-relaxed
// I will target them explicitly so we don't mess up other things.
if (!css.includes('/* Phase 4: Silver-Purple-Peach Agent Bubbles */')) {
  css += `\n/* Phase 4: Silver-Purple-Peach Agent Bubbles */
.theme-antigravity .bg-black\\/60.leading-relaxed {
  background-image: linear-gradient(to bottom right, #334155, rgba(88, 28, 135, 0.6), rgba(124, 45, 18, 0.6)) !important;
  background-color: transparent !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1rem !important; /* rounded-2xl */
  border-top-left-radius: 0.125rem !important; /* rounded-tl-sm */
  padding: 1rem !important; /* p-4 */
  color: #ffffff !important;
  font-weight: 500 !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
}\n`;
}

// Also, the previous V4 CSS might be styling `.theme-antigravity .bg-black\/60` directly. Let's make sure our new rule has higher specificity, or we replace it.
// I will just let the higher specificity / order handle it since it's at the end.
// Wait, `.bg-black\/60` is in a list of selectors:
// .theme-antigravity .bg-black\/60,
// We should remove it from that list so it doesn't conflict, just to be safe.
css = css.replace(/\.theme-antigravity\s*\.bg-black\\\/60,/g, '');

// Also remove cyan quotation marks from script text if they exist
css = css.replace(/\.theme-antigravity\s*\.leading-relaxed::before\s*\{[^}]+\}/g, '');
css = css.replace(/\.theme-antigravity\s*\.leading-relaxed::after\s*\{[^}]+\}/g, '');

fs.writeFileSync('src/app/globals.css', css);
console.log('Successfully updated globals.css');
