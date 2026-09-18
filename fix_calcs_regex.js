const fs = require('fs');

const filePath = "src/components/script/CallScript.jsx";
let c = fs.readFileSync(filePath, "utf-8");

// REPAIRS
c = c.replace(/\{\/\*\s*REPAIRS CALCULATOR\s*\*\/\}[\s\S]*?<div className="flex items-center gap-2 text-black font-bold">[\s\S]*?<Wrench size=\{18\} className="text-red-600" \/>[\s\S]*?Repairs Calculator[\s\S]*?<\/div>[\s\S]*?<\/div>/, 
`{/* REPAIRS CALCULATOR */}
            <div className="bg-black border-4 border-black shadow-[8px_8px_0px_#FF0055] hover:shadow-[12px_12px_0px_#FF0055] transition-all overflow-hidden flex-shrink-0 relative group transform -rotate-1 mb-2">
              <div className="absolute top-0 bottom-0 left-[-10%] w-[50%] bg-[#FF0055] transform skew-x-[25deg] origin-bottom border-r-4 border-black group-hover:w-[60%] transition-all duration-300 pointer-events-none"></div>
              <div className="p-5 flex justify-between items-center cursor-pointer relative z-10" onClick={() => setActiveCalc(activeCalc === 'repairs' ? null : 'repairs')}>
                <div className="flex items-center gap-3 text-white font-bangers text-3xl tracking-widest drop-shadow-[2px_2px_0px_#000]">
                  <Wrench size={28} className="text-black drop-shadow-[1px_1px_0px_#fff]" />
                  REPAIRS
                </div>
                {activeCalc === 'repairs' ? <ChevronDown size={28} className="text-white drop-shadow-[2px_2px_0px_#000]" /> : <ChevronRight size={28} className="text-white drop-shadow-[2px_2px_0px_#000]" />}
              </div>`);

// CASH
c = c.replace(/\{\/\*\s*CASH CALCULATOR\s*\*\/\}[\s\S]*?<div className="flex items-center gap-2 text-black font-bold">[\s\S]*?<Calculator size=\{18\} className="text-green-600" \/>[\s\S]*?Cash Exit Calculator[\s\S]*?<\/div>[\s\S]*?<\/div>/,
`{/* CASH CALCULATOR */}
            <div className="bg-black border-4 border-black shadow-[8px_8px_0px_#00FF66] hover:shadow-[12px_12px_0px_#00FF66] transition-all overflow-hidden flex-shrink-0 relative group transform rotate-1 mb-2">
              <div className="absolute top-0 bottom-0 right-[-10%] w-[50%] bg-[#00FF66] transform skew-x-[-25deg] origin-bottom border-l-4 border-black group-hover:w-[60%] transition-all duration-300 pointer-events-none"></div>
              <div className="p-5 flex justify-between items-center cursor-pointer relative z-10" onClick={() => setActiveCalc(activeCalc === 'cash' ? null : 'cash')}>
                <div className="flex items-center gap-3 text-white font-bangers text-3xl tracking-widest drop-shadow-[2px_2px_0px_#000]">
                  <Calculator size={28} className="text-[#00FF66] drop-shadow-[1px_1px_0px_#000]" />
                  CASH EXIT
                </div>
                {activeCalc === 'cash' ? <ChevronDown size={28} className="text-black drop-shadow-[1px_1px_0px_#fff]" /> : <ChevronRight size={28} className="text-black drop-shadow-[1px_1px_0px_#fff]" />}
              </div>`);

// CREATIVE
c = c.replace(/\{\/\*\s*CREATIVE CALCULATOR\s*\*\/\}[\s\S]*?<div className="flex items-center gap-2 text-black font-bold">[\s\S]*?<Calculator size=\{18\} className="text-accent-secondary" \/>[\s\S]*?Creative \/ SubTo Calculator[\s\S]*?<\/div>[\s\S]*?<\/div>/,
`{/* CREATIVE CALCULATOR */}
            <div className="bg-black border-4 border-black shadow-[8px_8px_0px_#00E5FF] hover:shadow-[12px_12px_0px_#00E5FF] transition-all overflow-hidden flex-shrink-0 relative group transform -rotate-1 mb-2">
              <div className="absolute top-0 bottom-0 left-[-10%] w-[60%] bg-[#00E5FF] transform skew-x-[25deg] origin-bottom border-r-4 border-black group-hover:w-[70%] transition-all duration-300 pointer-events-none"></div>
              <div className="p-5 flex justify-between items-center cursor-pointer relative z-10" onClick={() => setActiveCalc(activeCalc === 'creative' ? null : 'creative')}>
                <div className="flex items-center gap-3 text-black font-bangers text-3xl tracking-widest drop-shadow-[2px_2px_0px_#fff]">
                  <Calculator size={28} className="text-black drop-shadow-[1px_1px_0px_#fff]" />
                  CREATIVE / SUBTO
                </div>
                {activeCalc === 'creative' ? <ChevronDown size={28} className="text-white drop-shadow-[2px_2px_0px_#000]" /> : <ChevronRight size={28} className="text-white drop-shadow-[2px_2px_0px_#000]" />}
              </div>`);

fs.writeFileSync(filePath, c);
console.log("Calculators successfully replaced via robust regex!");
