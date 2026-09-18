const fs = require('fs');

let c = fs.readFileSync('src/components/script/CallScript.jsx', 'utf-8');

// Find the index of {/* CASH CALCULATOR */} and cut everything after it.
const splitIndex = c.indexOf('{/* CASH CALCULATOR */}');
if (splitIndex !== -1) {
  c = c.substring(0, splitIndex);
}

const correctBottom = `{/* CASH CALCULATOR */}
          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_#000] overflow-hidden flex-shrink-0">
            <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setActiveCalc(activeCalc === 'cash' ? null : 'cash')}>
              <div className="flex items-center gap-2 text-black font-bold">
                <Calculator size={18} className="text-green-600" />
                Cash Exit Calculator
              </div>
              {activeCalc === 'cash' ? <ChevronDown size={18} className="text-gray-800" /> : <ChevronRight size={18} className="text-gray-800" />}
            </div>
            <div className={clsx("transition-all duration-300", activeCalc === 'cash' ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0 overflow-hidden")}>
              <div className="p-4 border-t border-black">
                <CashCalculator askingPrice={formData.askingPrice} />
              </div>
            </div>
          </div>

          {/* CREATIVE CALCULATOR */}
          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_#000] overflow-hidden flex-shrink-0">
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
              onClick={() => setShowDisqualifyMenu(!showDisqualifyMenu)} 
              className="w-full py-4 border-4 border-black text-white font-bangers text-3xl tracking-widest transition-all hover:-translate-y-1 shadow-[8px_8px_0px_#000] flex justify-center items-center gap-3 transform -skew-x-2" style={{ background: 'repeating-linear-gradient(45deg, #000, #000 15px, #FF0055 15px, #FF0055 30px)' }}
            >
              <ShieldAlert size={20} className="text-white" strokeWidth={3} />
              DISQUALIFY / STOP
            </button>

            {showDisqualifyMenu && (
              <div className="absolute bottom-[calc(100%+20px)] left-0 w-full bg-white border-4 border-black shadow-[8px_8px_0px_#000] flex flex-col p-2 z-50 animate-slideIn">
                <button onClick={() => onReturn && onReturn({ type: 'stop' })} className="py-3 px-4 text-left font-bold text-black border-b-2 border-black hover:bg-gray-100 transition-colors uppercase">Stop</button>
                <button onClick={() => onReturn && onReturn({ type: 'pull_away' })} className="py-3 px-4 text-left font-bold text-black border-b-2 border-black hover:bg-gray-100 transition-colors uppercase">Pull Away (Follow Up)</button>
                <button onClick={() => {
                    const pillarNames = { 1: 'Intro', 2: 'Occupancy', 3: 'Condition', 4: 'Timeline', 5: 'Financials', 6: 'Contracting' };
                    if (onReturn) onReturn({ type: 'drop_off', pillar: pillarNames[activePillar] || 'Intro' });
                  }} className="py-3 px-4 text-left font-bold text-black border-b-2 border-black hover:bg-gray-100 transition-colors uppercase">
                    Log Drop-off (Current Pillar)
                  </button>
                <button onClick={() => onReturn && onReturn({ type: 'disqualified', reason: 'Not Selling' })} className="py-2.5 px-4 text-left text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors">Not Selling</button>
                <button onClick={() => onReturn && onReturn({ type: 'disqualified', reason: 'DNC' })} className="py-2.5 px-4 text-left text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors">DNC</button>
                <button onClick={() => onReturn && onReturn({ type: 'disqualified', reason: 'Hostile' })} className="py-2.5 px-4 text-left text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors">Hostile</button>
              </div>
            )}

            <button 
              onClick={() => onReturn && onReturn({ type: 'voicemail' })} 
              className="w-full py-3 bg-white hover:bg-white/5 border border-black rounded-xl text-gray-800 font-bold text-sm tracking-wide transition-all flex justify-center items-center gap-2"
            >
              <Mic size={16} className="text-purple-400"/>
              LEFT VOICEMAIL
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/script/CallScript.jsx', c + correctBottom);
