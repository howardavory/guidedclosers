const fs = require('fs');

let c = fs.readFileSync('src/components/script/CallScript.jsx', 'utf-8');

// Agent bubbles
// We have two variants: one with mb-6 and one without.
c = c.replace(/className="relative bg-white border-4 border-black p-6 shadow-\[6px_6px_0px_\#000\] text-xl font-bold text-black leading-relaxed transform -skew-x-2 mb-6" style=\{\{ clipPath: "polygon\(0% 0%, 100% 0%, 98% 100%, 2% 98%\)" \}\}/g, 
  'className="relative bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-black leading-relaxed rounded-2xl rounded-tl-none mb-6"');

c = c.replace(/className="relative bg-white border-4 border-black p-6 shadow-\[6px_6px_0px_\#000\] text-xl font-bold text-gray-800 leading-relaxed transform -skew-x-2" style=\{\{ clipPath: "polygon\(0% 0%, 100% 0%, 98% 100%, 2% 98%\)" \}\}/g, 
  'className="relative bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-gray-800 leading-relaxed rounded-2xl rounded-tl-none"');

// Agent tail (the triangle that points left)
// Currently: <div className="absolute -left-4 top-4 w-6 h-6 bg-white border-l-4 border-t-4 border-black transform -skew-x-12 rotate-45 z-[-1]"></div>
c = c.replace(/<div className="absolute -left-4 top-4 w-6 h-6 bg-white border-l-4 border-t-4 border-black transform -skew-x-12 rotate-45 z-\[-1\]"><\/div>/g, 
  '<div className="absolute -left-3 top-0 w-6 h-6 bg-white border-l-4 border-t-4 border-black transform rotate-45 z-[-1]"></div>');

// Seller bubbles
c = c.replace(/className="relative bg-gray-200 border-4 border-black p-6 shadow-\[6px_6px_0px_\#000\] text-lg text-gray-800 leading-relaxed italic transform skew-x-2" style=\{\{ clipPath: "polygon\(2% 2%, 98% 0%, 100% 98%, 0% 100%\)" \}\}/g, 
  'className="relative bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#00E5FF] text-lg text-gray-800 leading-relaxed italic rounded-2xl rounded-tr-none"');

// Seller tail
c = c.replace(/<div className="absolute -right-4 top-4 w-6 h-6 bg-gray-200 border-r-4 border-t-4 border-black transform skew-x-12 rotate-45 z-\[-1\]"><\/div>/g, 
  '<div className="absolute -right-3 top-0 w-6 h-6 bg-white border-r-4 border-t-4 border-black transform rotate-45 z-[-1]"></div>');

fs.writeFileSync('src/components/script/CallScript.jsx', c);
