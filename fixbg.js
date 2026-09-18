const fs = require('fs');
let c = fs.readFileSync('src/components/script/CallScript.jsx', 'utf-8');

// Replace Fast Facts outer beige background
c = c.replace(/bg-\[\#FFFCE8\]/g, 'bg-white/10 backdrop-blur-md');

// Replace Calculators outer white background
c = c.replace(/className="bg-white border-4 border-black shadow-\[4px_4px_0px_\#000\] overflow-hidden flex-shrink-0"/g, 
  'className="bg-white/10 backdrop-blur-md border-4 border-black shadow-[4px_4px_0px_#000] overflow-hidden flex-shrink-0"');

// Replace inner Fast Facts cards
c = c.replace(/className="p-3 bg-white border border-black rounded-lg"/g, 
  'className="p-3 bg-white/30 backdrop-blur-md border border-black rounded-lg"');

c = c.replace(/className="mt-4 p-3 bg-white border border-black rounded-xl"/g, 
  'className="mt-4 p-3 bg-white/30 backdrop-blur-md border border-black rounded-xl"');

// Voicemail Button
c = c.replace(/className="w-full py-3 bg-white hover:bg-white\/5 border border-black rounded-xl text-gray-800 font-bold text-sm tracking-wide transition-all flex justify-center items-center gap-2"/g, 
  'className="w-full py-3 bg-white/20 backdrop-blur-sm hover:bg-white/40 border border-black rounded-xl text-black font-bold text-sm tracking-wide transition-all flex justify-center items-center gap-2"');

fs.writeFileSync('src/components/script/CallScript.jsx', c);
