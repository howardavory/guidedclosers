const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Fix 1: Glassmorphism Legibility (Opacity & Blur)
css = css.replace(/background-color:\s*rgba\(255,\s*255,\s*255,\s*0\.03\)\s*!important;/g, 
                  'background-color: rgba(15, 23, 42, 0.75) !important;'); // Dark slate background

css = css.replace(/backdrop-filter:\s*blur\(16px\)\s*!important;/g, 
                  'backdrop-filter: blur(24px) !important;');

css = css.replace(/-webkit-backdrop-filter:\s*blur\(16px\)\s*!important;/g, 
                  '-webkit-backdrop-filter: blur(24px) !important;');

// Fix 2: Add CSS to nuke any rogue vertical cyan lines globally inside .theme-antigravity
// In case the vertical line is coming from an unclosed or rogue class:
const rogueLineCSS = `
/* Nuke any rogue vertical cyan dividers */
.theme-antigravity .border-[#00E5FF],
.theme-antigravity .border-cyan-500 {
  border-right: none !important;
  border-left: none !important;
}
.theme-antigravity .divide-cyan-500 > * + * {
  border-color: transparent !important;
}
`;

if (!css.includes('Nuke any rogue vertical')) {
  css += '\n' + rogueLineCSS;
}

fs.writeFileSync('src/app/globals.css', css);
console.log('Fixed globals.css');
