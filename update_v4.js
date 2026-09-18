const fs = require('fs');
const css = fs.readFileSync('src/app/globals.css', 'utf8');
const lines = css.split('\n');
const idx = lines.findIndex(l => l.includes('.theme-antigravity {'));
if (idx !== -1) {
  const baseCss = lines.slice(0, idx - 3).join('\n'); // Keep up to before the comment
  const newCss = `
/* ========================================================
   ANTI GRAVITY V4: OBSIDIAN & NEON GLASSMORPHISM
   ======================================================== */

@keyframes spin-border {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes smooth-slide-in {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.theme-antigravity {
  /* 1. Global Background - Obsidian with radial spotlight */
  background-color: #09090B !important;
  background-image: radial-gradient(circle at top center, #1a1a24 0%, #09090b 100%) !important;
  background-attachment: fixed !important;
  color: #94a3b8 !important; /* text-slate-400 */
}

/* 2. Glassmorphism Containers */
.theme-antigravity .comic-halftone,
.theme-antigravity .comic-paper,
.theme-antigravity .bg-black\\/60,
.theme-antigravity .bg-black\\/40,
.theme-antigravity .bg-\\[\\#00E5FF\\],
.theme-antigravity .bg-\\[\\#FF0055\\],
.theme-antigravity .bg-\\[\\#FFE600\\],
.theme-antigravity .bg-\\[\\#00FF66\\] {
  background-image: none !important;
  background-color: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3) !important;
}

/* Hover Glows for Containers */
.theme-antigravity .bg-black\\/60:hover,
.theme-antigravity .bg-\\[\\#00E5FF\\]:hover,
.theme-antigravity .bg-\\[\\#FFE600\\]:hover,
.theme-antigravity .bg-\\[\\#FF0055\\]:hover,
.theme-antigravity .bg-\\[\\#00FF66\\]:hover {
  border-color: rgba(6, 182, 212, 0.3) !important;
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.15) !important;
  transition: all 0.3s ease !important;
}

/* Strip hard legacy borders */
.theme-antigravity .border-4,
.theme-antigravity .border-\\[\\#00E5FF\\],
.theme-antigravity .border-black {
  border-width: 1px !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}
.theme-antigravity .shadow-\\[6px_6px_0px_\\#000\\],
.theme-antigravity .shadow-\\[8px_8px_0px_\\#000\\],
.theme-antigravity .shadow-\\[4px_4px_0px_\\#000\\] {
  box-shadow: none !important;
}

/* 3. Typography & Headers */
.theme-antigravity .font-bangers,
.theme-antigravity .comic-title,
.theme-antigravity .font-black {
  font-family: 'Space Grotesk', 'Inter Tight', 'Inter', system-ui, sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: -0.025em !important;
  text-transform: none !important;
  text-shadow: none !important;
}

/* Headers Text Gradient */
.theme-antigravity h1.comic-title,
.theme-antigravity .text-white {
  background: linear-gradient(to right, #ffffff, #64748b) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  color: transparent !important;
}

/* Focus Mode Script Text */
.theme-antigravity .leading-relaxed {
  font-size: 1.125rem !important; /* text-lg */
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  font-weight: 500 !important;
  letter-spacing: 0.025em !important; /* tracking-wide */
  position: relative !important;
  padding: 0 1.5rem !important;
  display: block;
}

/* Cyan Quotation Marks for Script Text */
.theme-antigravity .leading-relaxed::before {
  content: '"';
  position: absolute;
  left: -5px;
  top: -10px;
  font-size: 2rem;
  color: #06b6d4; /* cyan-500 */
  opacity: 0.6;
}
.theme-antigravity .leading-relaxed::after {
  content: '"';
  position: absolute;
  right: -5px;
  bottom: -25px;
  font-size: 2rem;
  color: #06b6d4; /* cyan-500 */
  opacity: 0.6;
}

/* 4. Magnetic Buttons & Animated Gradients */
.theme-antigravity button.bg-\\[\\#00FF00\\],
.theme-antigravity button.bg-\\[\\#FF0055\\],
.theme-antigravity button.bg-\\[\\#00E5FF\\] {
  background: linear-gradient(90deg, #06b6d4 0%, #2563eb 100%) !important;
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  border: none !important;
  border-radius: 9999px !important;
  position: relative;
  z-index: 1;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  box-shadow: 0 10px 25px -5px rgba(6, 182, 212, 0.4) !important;
  overflow: hidden;
}
.theme-antigravity button.bg-\\[\\#00FF00\\]:hover,
.theme-antigravity button.bg-\\[\\#FF0055\\]:hover,
.theme-antigravity button.bg-\\[\\#00E5FF\\]:hover {
  transform: scale(1.02) !important;
  box-shadow: 0 15px 35px -5px rgba(6, 182, 212, 0.6) !important;
}
.theme-antigravity button.bg-\\[\\#00FF00\\]:active,
.theme-antigravity button.bg-\\[\\#FF0055\\]:active,
.theme-antigravity button.bg-\\[\\#00E5FF\\]:active {
  transform: scale(0.98) !important;
}

/* Subtle border animation wrapper effect */
.theme-antigravity button.bg-\\[\\#00FF00\\]::before,
.theme-antigravity button.bg-\\[\\#FF0055\\]::before,
.theme-antigravity button.bg-\\[\\#00E5FF\\]::before {
  content: '';
  position: absolute;
  inset: -150%;
  border-radius: 9999px;
  background: conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
  z-index: -1;
  animation: spin-border 3s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.theme-antigravity button.bg-\\[\\#00FF00\\]:hover::before,
.theme-antigravity button.bg-\\[\\#FF0055\\]:hover::before,
.theme-antigravity button.bg-\\[\\#00E5FF\\]:hover::before {
  opacity: 1;
}

/* Inputs and Standard Toggles */
.theme-antigravity input,
.theme-antigravity select {
  border-radius: 1.5rem !important;
  border: 1px solid rgba(255,255,255,0.15) !important;
  background-color: rgba(255,255,255,0.05) !important;
  color: #f1f5f9 !important;
  padding-left: 1.5rem !important;
  padding-right: 1.5rem !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
}
.theme-antigravity input:focus,
.theme-antigravity select:focus {
  border-color: #06b6d4 !important;
  box-shadow: 0 0 15px rgba(6,182,212,0.2) !important;
  outline: none !important;
}

/* Geometry */
.theme-antigravity .rounded-2xl,
.theme-antigravity .rounded-tl-none,
.theme-antigravity .rounded-none {
  border-radius: 24px !important; /* Soft corners for glass boxes */
}

/* Whitespace & Padding */
.theme-antigravity .p-6 {
  padding: 2.5rem 2rem !important;
}

/* Header Specific Fixes */
.theme-antigravity .text-\\[\\#00E5FF\\],
.theme-antigravity .text-\\[\\#FF0055\\] {
  color: #e2e8f0 !important;
  -webkit-text-fill-color: #e2e8f0 !important;
}
.theme-antigravity .text-\\[\\#00FF00\\] {
  color: #06b6d4 !important;
  -webkit-text-fill-color: #06b6d4 !important;
}

/* Smooth Reveals */
.theme-antigravity .animate-slideIn {
  animation: smooth-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
  will-change: transform, opacity;
}

/* Strip Skews */
.theme-antigravity .transform,
.theme-antigravity .skew-x-1,
.theme-antigravity .skew-x-2,
.theme-antigravity .skew-x-3,
.theme-antigravity .skew-x-\\[-5deg\\],
.theme-antigravity .-skew-x-1,
.theme-antigravity .-skew-x-2,
.theme-antigravity .-skew-x-6,
.theme-antigravity .-skew-x-12 {
  transform: none !important;
}
`;
  fs.writeFileSync('src/app/globals.css', baseCss + '\n' + newCss);
  console.log('Successfully applied V4 styles!');
} else {
  console.log('Could not find .theme-antigravity block.');
}
