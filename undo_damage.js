const fs = require('fs');
let c = fs.readFileSync('src/components/script/CallScript.jsx', 'utf-8');

const brokenPart = `<div className="bg-white border-4 border-black shadow-[4px_4px_0px_#000] overflow-hidden flex-shrink-0">
            <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setActiveCalc(activeCalc === 'creative' ? null : 'creative')}>
              onClick={() => setShowDisqualifyMenu(!showDisqualifyMenu)}`;

const fixedPart = `<div className="bg-white border-4 border-black shadow-[4px_4px_0px_#000] overflow-hidden flex-shrink-0">
            <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setActiveCalc(activeCalc === 'creative' ? null : 'creative')}>
              <div className="flex items-center gap-2 text-black font-bold">
                <Calculator size={18} className="text-accent-secondary" />
                Creative / SubTo Calculator
              </div>
              {activeCalc === 'creative' ? <ChevronDown size={18} className="text-gray-800" /> : <ChevronRight size={18} className="text-gray-800" />}
            </div>
            <div className={clsx("transition-all duration-300", activeCalc === 'creative' ? "max-h-[1400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden")}>
              <div className="p-4 border-t border-black">
                <CreativeCalculator />
              </div>
            </div>
          </div>
          
          {/* DISQUALIFY MENU & VOICEMAIL BUTTON */}
          <div className="mt-6 flex flex-col gap-4 flex-shrink-0 relative">
            <button 
              onClick={() => setShowDisqualifyMenu(!showDisqualifyMenu)}`;

c = c.replace(brokenPart, fixedPart);

fs.writeFileSync('src/components/script/CallScript.jsx', c);
