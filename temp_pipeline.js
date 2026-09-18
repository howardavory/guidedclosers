const fs = require('fs');
let c = fs.readFileSync('src/components/dashboard/Pipeline.jsx', 'utf-8');

// Replace standard bg colors with white / comic borders
c = c.replace(/bg-bg-surface/g, 'bg-white');
c = c.replace(/bg-bg-card-soft/g, 'bg-white');
c = c.replace(/bg-bg-card-hover/g, 'bg-gray-100');
c = c.replace(/border-border-strong/g, 'border-4 border-black');
c = c.replace(/border-border-subtle/g, 'border-2 border-black');

// Text colors - since bg is white, text should be black
c = c.replace(/text-white/g, 'text-black');
c = c.replace(/text-text-soft/g, 'text-gray-800 text-xs font-bold font-sans uppercase');
c = c.replace(/text-blue-500/g, 'text-[#00E5FF] drop-shadow-sm font-bangers text-lg tracking-widest');

// Replace main wrapper
c = c.replace(/className=\"flex flex-col h-full bg-white border-4 border-black rounded-2xl overflow-hidden\"/g, 'className="flex flex-col h-full bg-white border-4 border-black overflow-hidden relative shadow-[8px_8px_0px_#000]"');

// Pipeline cards need to look like comic panels
c = c.replace(/className=\"p-4 bg-white border-2 border-black rounded-xl cursor-pointer hover:bg-gray-100 transition-all border border-border-subtle hover:border-accent-blue/g, 'className="p-4 bg-white border-4 border-black shadow-[4px_4px_0px_#000] transform transition-all hover:-translate-y-1 hover:translate-x-1 hover:shadow-[8px_8px_0px_#00E5FF] cursor-pointer');

// Pipeline columns
c = c.replace(/className=\"flex-1 min-w-\[300px\] flex flex-col bg-black\/20 rounded-xl p-4\"/g, 'className="flex-1 min-w-[300px] flex flex-col bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-4 comic-halftone"');
c = c.replace(/<div className=\"flex-1 overflow-y-auto pr-2 space-y-4 hide-scrollbar\">/g, '<div className=\"flex-1 overflow-y-auto pr-2 space-y-6 hide-scrollbar pt-2\">');
c = c.replace(/<h3 className=\"font-bold mb-4 flex justify-between items-center text-gray-800 text-xs font-bold font-sans uppercase\">/g, '<h3 className=\"font-bangers text-2xl tracking-widest mb-4 flex justify-between items-center text-black bg-yellow-400 px-2 py-1 border-2 border-black inline-flex shadow-[4px_4px_0px_#000] transform -skew-x-2\">');

fs.writeFileSync('src/components/dashboard/Pipeline.jsx', c);
