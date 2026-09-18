const fs = require('fs');

let c = fs.readFileSync('src/components/script/CallScript.jsx', 'utf-8');

// 1. FAST FACTS -> Taped Notepad Paper
const fastFactsOld = `className="w-80 bg-white border border-black rounded-2xl flex-shrink-0 flex flex-col hide-scrollbar"`;
const fastFactsNew = `className="w-80 bg-[#FFFCE8] border-4 border-black flex-shrink-0 flex flex-col hide-scrollbar shadow-[8px_8px_0px_#000] transform rotate-1 relative"`;
c = c.replace(fastFactsOld, fastFactsNew);

// Add the tape to the top of fast facts
c = c.replace(
  `<div className="p-4 border-b-4 border-black flex items-center justify-between bg-white relative z-10">`,
  `<div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/60 border border-gray-300 transform -rotate-2 z-20 backdrop-blur-sm shadow-sm"></div>\n          <div className="p-4 border-b-4 border-black flex items-center justify-between bg-[#FFFCE8] relative z-10">`
);

// 2. PILLARS -> Thick Vertical Comic Spines
// Replace the generic accordion tab styling
c = c.replace(/className=\"w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 border-b border-black transition-colors\"/g, 
  'className="w-full flex items-center justify-between p-5 bg-white hover:bg-[#FF0055] hover:text-white border-b-4 border-black transition-colors group"');

// Make the active pillar look like it's bursting out
c = c.replace(/<div className="w-full flex items-center justify-between p-4 bg-\[\#00E5FF\] border-b border-black text-black">/g, 
  '<div className="w-full flex items-center justify-between p-5 bg-[#00E5FF] border-b-4 border-black text-black shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]">');

// 3. SPEECH BUBBLES -> Jagged Comic Balloons
const agentBubbleOld = /className="relative bg-white border border-black rounded-2xl rounded-tl-none p-5 shadow-sm text-lg font-bold text-gray-800 leading-relaxed"/g;
const agentBubbleNew = `className="relative bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-gray-800 leading-relaxed transform -skew-x-2" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 98% 100%, 2% 98%)' }}`;
c = c.replace(agentBubbleOld, agentBubbleNew);

// Add the comic tail pointing left
c = c.replace(
  /<div className="absolute -left-2 top-0 w-4 h-4 bg-white border-l border-t border-black transform -translate-x-1\/2 translate-y-1\/2 rotate-45"><\/div>/g,
  `<div className="absolute -left-4 top-4 w-6 h-6 bg-white border-l-4 border-t-4 border-black transform -skew-x-12 rotate-45 z-[-1]"></div>`
);

const sellerBubbleOld = /className="relative bg-gray-100 border border-black rounded-2xl rounded-tr-none p-5 shadow-sm text-lg text-gray-800 leading-relaxed italic"/g;
const sellerBubbleNew = `className="relative bg-gray-200 border-4 border-black p-6 shadow-[6px_6px_0px_#000] text-lg text-gray-800 leading-relaxed italic transform skew-x-2" style={{ clipPath: 'polygon(2% 2%, 98% 0%, 100% 98%, 0% 100%)' }}`;
c = c.replace(sellerBubbleOld, sellerBubbleNew);

// 4. REBUTTAL BUTTONS -> Slashed Ribbons
const rebuttalBtnOld = /className=\{clsx\(\n\s*"px-4 py-2 rounded-full border border-black text-sm font-bold transition-all hover:-translate-y-0.5",/g;
const rebuttalBtnNew = `className={clsx(\n                            "px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-[4px_4px_0px_#000] transform -skew-x-12",`;
c = c.replace(rebuttalBtnOld, rebuttalBtnNew);

// 5. Container tweaks
// Replace the inner active pillar container
c = c.replace(/className="p-6 bg-white flex flex-col gap-8 overflow-y-auto"/g, 'className="p-8 bg-white comic-halftone flex flex-col gap-10 overflow-y-auto"');

fs.writeFileSync('src/components/script/CallScript.jsx', c);
