const fs = require('fs');

let code = fs.readFileSync('src/components/calculators/CreativeCalculator.jsx', 'utf8');

const targetBlockStart = `<div className="flex flex-col gap-2 bg-[#0A0A0F]/90 border border-[#333333] rounded-xl p-3">`;
const targetBlockEnd = `</div>
    </div>`; // This is the end of the first column

const startIndex = code.indexOf(targetBlockStart);
// find the second </div> of that block
const firstDivEnd = code.indexOf(`</div>`, startIndex);
const secondDivEnd = code.indexOf(`</div>`, firstDivEnd + 1); // inner flex block
const thirdDivEnd = code.indexOf(`</div>`, secondDivEnd + 1); // inner flex block
const fourthDivEnd = code.indexOf(`</div>`, thirdDivEnd + 1); // column end

if (startIndex !== -1 && fourthDivEnd !== -1) {
  const blockToReplace = code.substring(startIndex, fourthDivEnd + 6);
  
  const newBlock = `<div className="flex flex-col gap-2 bg-[#0A0A0F]/90 border border-[#333333] rounded-xl p-3">
      <div className="flex flex-col flex-1">
        <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">ARV (Est. Value)</label>
        <div className="w-full flex items-center gap-2 bg-[#050505]/80 border border-[#222222] focus-within:border-[#E5C158] rounded-lg p-2 text-[#FFFFFF] font-semibold transition-all">
          <span className="text-[#FFFFFF] font-bold mr-1">$</span>
          <input type="number" value={arvValue} onChange={e => updateGlobalArv ? updateGlobalArv(e.target.value) : {}} className="appearance-none bg-transparent text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0" />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">Total Debt</label>
        <div className="w-full flex items-center gap-2 bg-[#050505]/80 border border-[#222222] focus-within:border-[#E5C158] rounded-lg p-2 text-[#FFFFFF] font-semibold transition-all">
          <span className="text-[#FFFFFF] font-bold mr-1">$</span>
          <input type="number" value={mortgageBalance} onChange={e => setMortgageBalance(Number(e.target.value))} className="appearance-none bg-transparent text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0" />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">Interest Rate (%)</label>
        <div className="w-full flex items-center justify-between gap-2 bg-[#050505]/80 border border-[#222222] focus-within:border-[#E5C158] rounded-lg p-2 text-[#FFFFFF] font-semibold transition-all">
          <input type="number" step="0.1" value={underlyingInterest} onChange={e => setUnderlyingInterest(Number(e.target.value))} className="appearance-none bg-transparent text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0" />
          <span className="text-[#FFFFFF] font-bold">%</span>
        </div>
      </div>
    </div>`;

  code = code.replace(blockToReplace, newBlock);
  fs.writeFileSync('src/components/calculators/CreativeCalculator.jsx', code);
  console.log("Phase 1: CreativeCalculator upgraded successfully.");
} else {
  console.log("Phase 1: Target block not found.");
}
