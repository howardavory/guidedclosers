const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

const newRules = `

/* =========================================
   BULLETPROOF AESTHETIC FIXES (Phase 2 & 4)
   Using attribute selectors to bypass Next.js escaping bugs
   ========================================= */

/* Fix 1: The White "Seller Responses" Container */
.theme-antigravity div[class*="bg-white"] {
  background-color: #0f172a !important; /* bg-slate-900 */
  border-color: #1e293b !important; /* border-slate-800 */
  color: #f8fafc !important;
}
.theme-antigravity div[class*="bg-white"] p, 
.theme-antigravity div[class*="bg-white"] span {
  color: #94a3b8 !important; /* text-slate-400 */
}

/* Fix 2: All Interactive Toggles (Unselected state) */
.theme-antigravity button[class*="border-black"],
.theme-antigravity button[class*="bg-white"] {
  background-color: #1e293b !important;
  color: #f1f5f9 !important;
  border: 1px solid #C0C0C0 !important; /* Silver metallic edge */
  box-shadow: none !important;
  transition: all 0.2s ease-in-out !important;
  text-shadow: none !important;
}
.theme-antigravity button[class*="border-black"]:hover,
.theme-antigravity button[class*="bg-white"]:hover {
  background-color: #334155 !important;
  box-shadow: inset 0 0 12px rgba(192, 192, 192, 0.2) !important;
}

/* Fix 3: Active State Toggles (Neon Yellow/Green etc) */
.theme-antigravity button[class*="bg-[#FFFF00]"],
.theme-antigravity button[class*="bg-[#00FFFF]"],
.theme-antigravity button[class*="bg-[#FF1111]"] {
  background: linear-gradient(90deg, #06b6d4 0%, #2563eb 100%) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.4) !important;
  transform: none !important; /* Strip skews */
}

/* Fix 4: Agent Script Bubbles */
.theme-antigravity div[class*="bg-black/60"][class*="leading-relaxed"] {
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
console.log('Bulletproof fixes applied!');
