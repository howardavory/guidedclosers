const fs = require('fs');

// Fix CallScript.jsx
let c = fs.readFileSync('src/components/script/CallScript.jsx', 'utf-8');
c = c.replace(/className=\"bg-white border border-black rounded-xl overflow-hidden flex-shrink-0\"/g, 'className="bg-white border-4 border-black shadow-[4px_4px_0px_#000] overflow-hidden flex-shrink-0"');

// Fix the DISQUALIFY button
const oldDisqualify = `className="w-full py-4 bg-[#FF0055] hover:bg-red-600 border-4 border-black text-white font-bangers text-2xl tracking-widest transition-all hover:-translate-y-1 shadow-[6px_6px_0px_#000] neon-glow-red flex justify-center items-center gap-2 transform -skew-x-2 uppercase"`;
const newDisqualify = `className="w-full py-4 border-4 border-black text-white font-bangers text-3xl tracking-widest transition-all hover:-translate-y-1 shadow-[8px_8px_0px_#000] flex justify-center items-center gap-3 transform -skew-x-2" style={{ background: 'repeating-linear-gradient(45deg, #000, #000 15px, #FF0055 15px, #FF0055 30px)' }}`;
c = c.replace(oldDisqualify, newDisqualify);

fs.writeFileSync('src/components/script/CallScript.jsx', c);

// Fix TearSheet.jsx
let t = fs.readFileSync('src/components/documents/TearSheet.jsx', 'utf-8');

// Replace the container to look like a classified top-secret folder
t = t.replace(/className=\"bg-white border-4 border-black shadow-\[6px_6px_0px_\#000\] overflow-hidden\"/g, 'className="bg-[#FFE4B5] border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden relative"');

// Replace the THWIP button area to be more bespoke
const oldThwip = `<div className="w-full h-full flex items-center justify-center font-bangers text-6xl text-[#FF0055] drop-shadow-md transform -skew-x-6" style={{textShadow: "4px 4px 0px #000"}}>THWIP!</div>`;
const newThwip = `
<div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-black comic-halftone">
  <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400 border-l-4 border-b-4 border-black transform translate-x-8 -translate-y-8 rotate-45 z-10"></div>
  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
  <div className="font-bangers text-7xl text-yellow-400 transform -skew-x-6 z-10" style={{textShadow: "6px 6px 0px #FF0055, 10px 10px 0px #000"}}>BOOM!</div>
  <div className="mt-4 font-sans font-bold text-white uppercase tracking-widest text-xs z-10 bg-black px-2 py-1 border border-white">Classified Intel</div>
</div>
`;
t = t.replace(oldThwip, newThwip);

// Update button at bottom of tearsheet
t = t.replace(/bg-\[\#FF0055\] hover:bg-\[\#00E5FF\] hover:text-black text-white hover:shadow-\[6px_6px_0px_\#000\]/g, 'bg-yellow-400 hover:bg-[#FF0055] hover:text-white text-black shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#00E5FF] font-bangers text-2xl tracking-widest');

fs.writeFileSync('src/components/documents/TearSheet.jsx', t);

