const fs = require('fs');

let code = fs.readFileSync('src/components/documents/TearSheet.jsx', 'utf8');

// The block we need to replace starts at <p className="text-[10px] text-[#F5F5F5] font-bold uppercase tracking-widest mb-1 font-bold">Deal Viability Score</p>
// and ends after the intelBrief <p> element

const startIndex = code.indexOf(`{/* Deal Score */}`);
const endIndex = code.indexOf(`</div>`, code.indexOf(`{intelBrief}`, startIndex)) + 6;

const blockToReplace = code.substring(startIndex, endIndex);

const newUIBlock = `{/* Deal Score */}
<div className="border border-[#333333] rounded-xl p-4 bg-[#0A0A0F]/50 flex flex-col gap-3">
  <h4 className="text-[10px] font-black text-[#A0A0A0] uppercase tracking-widest">Deal Viability Score</h4>
  
  <div className="flex items-center justify-between">
    <div className="flex-1 bg-[#1A1A1A] h-3 rounded-full overflow-hidden border border-[#333333]">
      <div 
        className="h-full transition-all duration-1000 ease-out"
        style={{ 
          width: \`\${viabilityScore}%\`,
          backgroundColor: viabilityScore >= 75 ? '#00FF66' : viabilityScore >= 45 ? '#E5C158' : '#ef4444'
        }}
      />
    </div>
    <span className={clsx(
      "ml-4 font-black text-xs px-2 py-1 rounded-md border",
      viabilityConfig.color
    )}>
      {viabilityScore}/100
    </span>
  </div>

  <p className={clsx("text-xs font-bold italic tracking-wide mt-2", viabilityConfig.color.replace('bg-', '').replace('/20', ''))}>
    {viabilityConfig.text}
  </p>
</div>`;

code = code.replace(blockToReplace, newUIBlock);

fs.writeFileSync('src/components/documents/TearSheet.jsx', code);
console.log('TearSheet.jsx UI block updated successfully.');
