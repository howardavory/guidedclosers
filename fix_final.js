const fs = require('fs');
let c = fs.readFileSync('src/components/script/CallScript.jsx', 'utf-8');

// 1. FAST FACTS
c = c.replace(/<div className="comic-glass border-4 border-black p-6 shadow-\[8px_8px_0px_#000\] shrink-0 relative overflow-visible transform rotate-1">/g,
  `<div className="bg-[#fffdf0] border-4 border-black p-6 shadow-[8px_8px_0px_#000] shrink-0 relative overflow-visible transform rotate-1">`);

// 2. REPAIRS CALCULATOR
c = c.replace(
  /<div className="comic-glass border-4 border-black shadow-\[4px_4px_0px_#000\] overflow-hidden flex-shrink-0">\s*<div className="p-4 flex justify-between items-center cursor-pointer hover:bg-white\/5 transition-colors" onClick={\(\) => setActiveCalc\(activeCalc === 'repairs' \? null : 'repairs'\)}>\s*<div className="flex items-center gap-2 text-black font-bold">\s*<Wrench size={18} className="text-red-600" \/>\s*Repairs Calculator\s*<\/div>\s*\{activeCalc === 'repairs' \? <ChevronDown size={18} className="text-gray-800" \/> : <ChevronRight size={18} className="text-gray-800" \/>\}\s*<\/div>/,
  `<div className="bg-black border-4 border-black shadow-[8px_8px_0px_#FF0055] hover:shadow-[12px_12px_0px_#FF0055] transition-all overflow-hidden flex-shrink-0 relative group transform -rotate-1 mb-2">
    <div className="absolute inset-0 bg-black comic-halftone pointer-events-none"></div>
    <div className="absolute top-0 bottom-0 left-[-10%] w-[50%] bg-[#FF0055] transform skew-x-[25deg] origin-bottom border-r-4 border-black group-hover:w-[60%] transition-all duration-300 pointer-events-none"></div>
    <div className="p-5 flex justify-between items-center cursor-pointer relative z-10" onClick={() => setActiveCalc(activeCalc === 'repairs' ? null : 'repairs')}>
      <div className="flex items-center gap-3 text-white font-bangers text-3xl tracking-widest drop-shadow-[2px_2px_0px_#000]">
        <Wrench size={28} className="text-black drop-shadow-[1px_1px_0px_#fff]" />
        REPAIRS
      </div>
      {activeCalc === 'repairs' ? <ChevronDown size={28} className="text-white drop-shadow-[2px_2px_0px_#000]" /> : <ChevronRight size={28} className="text-white drop-shadow-[2px_2px_0px_#000]" />}
    </div>`
);

// 3. CASH CALCULATOR
c = c.replace(
  /<div className="comic-glass border-4 border-black shadow-\[4px_4px_0px_#000\] overflow-hidden flex-shrink-0">\s*<div className="p-4 flex justify-between items-center cursor-pointer hover:bg-white\/5 transition-colors" onClick={\(\) => setActiveCalc\(activeCalc === 'cash' \? null : 'cash'\)}>\s*<div className="flex items-center gap-2 text-black font-bold">\s*<Calculator size={18} className="text-green-600" \/>\s*Cash Exit Calculator\s*<\/div>\s*\{activeCalc === 'cash' \? <ChevronDown size={18} className="text-gray-800" \/> : <ChevronRight size={18} className="text-gray-800" \/>\}\s*<\/div>/,
  `<div className="bg-black border-4 border-black shadow-[8px_8px_0px_#00FF66] hover:shadow-[12px_12px_0px_#00FF66] transition-all overflow-hidden flex-shrink-0 relative group transform rotate-1 mb-2">
    <div className="absolute inset-0 bg-black comic-halftone pointer-events-none"></div>
    <div className="absolute top-0 bottom-0 right-[-10%] w-[50%] bg-[#00FF66] transform skew-x-[-25deg] origin-bottom border-l-4 border-black group-hover:w-[60%] transition-all duration-300 pointer-events-none"></div>
    <div className="p-5 flex justify-between items-center cursor-pointer relative z-10" onClick={() => setActiveCalc(activeCalc === 'cash' ? null : 'cash')}>
      <div className="flex items-center gap-3 text-white font-bangers text-3xl tracking-widest drop-shadow-[2px_2px_0px_#000]">
        <Calculator size={28} className="text-[#00FF66] drop-shadow-[1px_1px_0px_#000]" />
        CASH EXIT
      </div>
      {activeCalc === 'cash' ? <ChevronDown size={28} className="text-black drop-shadow-[1px_1px_0px_#fff]" /> : <ChevronRight size={28} className="text-black drop-shadow-[1px_1px_0px_#fff]" />}
    </div>`
);

// 4. CREATIVE CALCULATOR
c = c.replace(
  /<div className="comic-glass border-4 border-black shadow-\[4px_4px_0px_#000\] overflow-hidden flex-shrink-0">\s*<div className="p-4 flex justify-between items-center cursor-pointer hover:bg-white\/5 transition-colors" onClick={\(\) => setActiveCalc\(activeCalc === 'creative' \? null : 'creative'\)}>\s*<div className="flex items-center gap-2 text-black font-bold">\s*<Calculator size={18} className="text-accent-secondary" \/>\s*Creative \/ SubTo Calculator\s*<\/div>\s*\{activeCalc === 'creative' \? <ChevronDown size={18} className="text-gray-800" \/> : <ChevronRight size={18} className="text-gray-800" \/>\}\s*<\/div>/,
  `<div className="bg-black border-4 border-black shadow-[8px_8px_0px_#00E5FF] hover:shadow-[12px_12px_0px_#00E5FF] transition-all overflow-hidden flex-shrink-0 relative group transform -rotate-1 mb-2">
    <div className="absolute inset-0 bg-black comic-halftone pointer-events-none"></div>
    <div className="absolute top-0 bottom-0 left-[-10%] w-[60%] bg-[#00E5FF] transform skew-x-[25deg] origin-bottom border-r-4 border-black group-hover:w-[70%] transition-all duration-300 pointer-events-none"></div>
    <div className="p-5 flex justify-between items-center cursor-pointer relative z-10" onClick={() => setActiveCalc(activeCalc === 'creative' ? null : 'creative')}>
      <div className="flex items-center gap-3 text-black font-bangers text-3xl tracking-widest drop-shadow-[2px_2px_0px_#fff]">
        <Calculator size={28} className="text-black drop-shadow-[1px_1px_0px_#fff]" />
        CREATIVE / SUBTO
      </div>
      {activeCalc === 'creative' ? <ChevronDown size={28} className="text-white drop-shadow-[2px_2px_0px_#000]" /> : <ChevronRight size={28} className="text-white drop-shadow-[2px_2px_0px_#000]" />}
    </div>`
);

// 5. VOICEMAIL BUTTON
c = c.replace(
  /className="w-full py-3 comic-glass border-4 border-black text-black hover:scale-105 font-bold text-sm tracking-wide transition-all flex justify-center items-center gap-2"/,
  `className="w-full relative h-20 group overflow-hidden border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000] transition-all hover:-translate-y-1 bg-black comic-halftone transform rotate-1 cursor-pointer flex justify-center items-center"`
);
c = c.replace(
  /<Mic size={16} className="text-purple-400"\/>\s*LEFT VOICEMAIL/,
  `<div className="absolute inset-0 bg-[#B400FF] transform skew-x-[-30deg] translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-500 border-l-4 border-black pointer-events-none"></div>
   <div className="relative z-10 flex items-center gap-3">
     <Mic size={24} className="text-white drop-shadow-[2px_2px_0px_#000]" />
     <span className="font-bangers text-4xl text-white tracking-widest drop-shadow-[3px_3px_0px_#000] group-hover:scale-110 transition-transform">
       LEFT VOICEMAIL
     </span>
   </div>`
);

// 6. SCRIPT SPEECH BUBBLES
// Replace speech bubble wrapper
c = c.replace(/className="relative bg-white border-4 border-black p-6 shadow-\[6px_6px_0px_#000\] text-xl font-bold text-black leading-relaxed rounded-2xl rounded-tl-none mb-6"/g,
  'className="relative bg-black/60 backdrop-blur-md border-4 border-[#00E5FF] p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6"');

// Replace standard inputs
c = c.replace(/className="w-full bg-white border border-black rounded-lg p-2 text-black outline-none mb-2"/g,
  'className="w-full bg-black/40 backdrop-blur-md border-2 border-[#00E5FF] rounded-lg p-2 text-white outline-none mb-2 placeholder-gray-400"');

c = c.replace(/className="w-full bg-white border border-black rounded-lg p-2 text-black outline-none mb-3"/g,
  'className="w-full bg-black/40 backdrop-blur-md border-2 border-[#00E5FF] rounded-lg p-2 text-white outline-none mb-3 placeholder-gray-400"');

c = c.replace(/className="w-full bg-white border border-black rounded-lg p-3 text-black focus:border-accent-secondary outline-none"/g,
  'className="w-full bg-black/40 backdrop-blur-md border-2 border-[#00E5FF] rounded-lg p-3 text-white focus:border-[#FF0055] outline-none placeholder-gray-400"');

// Replace standard buttons inside script
c = c.replace(/"bg-white text-gray-800 border-black hover:bg-white\/5"/g,
  '"bg-black/60 text-white border-[#00E5FF] hover:bg-white/20"');

// Replace autocomplete inputs
c = c.replace(/className="w-full px-4 py-3 bg-white border-2 border-black rounded-xl text-black font-bold focus:border-accent-secondary outline-none"/g,
  'className="w-full px-4 py-3 bg-black/60 backdrop-blur-md border-2 border-[#00E5FF] rounded-xl text-white font-bold focus:border-[#FF0055] outline-none placeholder-gray-400"');

fs.writeFileSync('src/components/script/CallScript.jsx', c);
