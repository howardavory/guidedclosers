const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/script/CallScript.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add state fields
if (!content.includes("septicSewer: ''")) {
    content = content.replace(
        "solarMonthlyPayment: '',",
        "solarMonthlyPayment: '',\n    septicSewer: '',\n    solarSystem: '',\n    majorRedFlags: [],"
    );
}

// 2. Fix layout
content = content.replace(
    '<div className="flex-1 overflow-y-auto pr-4 pb-32 hide-scrollbar mt-6">',
    '<div className="flex-1 overflow-y-auto px-8 lg:px-12 pb-32 hide-scrollbar mt-6">'
);

// Add box-border max-w-full mr-4 to Comic Panels (bg-white border-4)
// We'll replace all occurences of "relative bg-white border-4 border-black" with "relative bg-white border-4 border-black box-border max-w-full mr-4"
// except if they already have it.
content = content.replace(/relative bg-white border-4 border-black(?! box-border)/g, 'relative bg-white border-4 border-black box-border max-w-full mr-4');


// 3. Extract & Relocate Utilities
// Remove from Secondary Liabilities
content = content.replace(
    "['Active HOA', 'Solar (Leased)', 'Solar (Owned)', 'Pool', 'Septic']",
    "['Active HOA', 'Pool']"
);

// We want to inject the Utilities Panel immediately below the PLUMBING & ELECTRICAL panel.
// We'll search for the end of the Cosmetics block or PLUMBING & ELECTRICAL block.
// Wait, the new Utility block goes BEFORE Agent (Cosmetics & Inside) which is: <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Cosmetics & Inside)</span>
const utilitiesInjection = `
            {/* UTILITIES & EXTERIOR */}
            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Utilities & Exterior)</span>
              <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                "Got it. And just to check on a couple of major infrastructure items—is the property on city sewer, or do you have a private septic tank? And do you have any solar panels on the roof?"
              </div>
              
              <div className="mb-6">
                <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Sewer / Septic</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['City Sewer', 'Septic System'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => updateForm('septicSewer', opt)} 
                      className={"px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12 " + (formData.septicSewer === opt ? "bg-[#FFE600] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Solar panels</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['No Solar', 'Solar (Owned)', 'Solar (Leased)'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => updateForm('solarSystem', opt)} 
                      className={"px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12 " + (formData.solarSystem === opt ? "bg-[#FFE600] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                
                {formData.solarSystem === 'Solar (Leased)' && (
                  <div className="flex flex-col mt-4">
                    <label className="text-xs text-gray-800 uppercase font-bold block mb-1">Solar Monthly Payment $</label>
                    <input type="text" value={formData.solarMonthlyPayment || ''} onChange={(e) => updateForm('solarMonthlyPayment', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full max-w-sm bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                  </div>
                )}
              </div>
            </div>

`;

content = content.replace(
    '<span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Cosmetics & Inside)</span>',
    utilitiesInjection + '<span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Cosmetics & Inside)</span>'
);

// 4. Component Replacement: Major Red Flags
const oldRedFlagsRegex = /<input type="text" placeholder="e\.g\. Unpermitted garage conversion, foundation settling\.\.\." value=\{formData\.sfStructuralFlags\}[^>]+>/;
const newRedFlags = `
              <div className="mb-6">
                <label className="text-xs text-black uppercase font-black block mb-2">MAJOR RED FLAGS (Select all that apply)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {['Foundation / Structural Issues', 'Unpermitted Additions / ADU', 'Mold / Fire / Water Damage', 'City Code Violations / Red Tags', 'Known Liens / Judgments'].map(flag => {
                    const isSelected = formData.majorRedFlags?.includes(flag);
                    return (
                      <button 
                        key={flag}
                        onClick={() => {
                          const current = formData.majorRedFlags || [];
                          updateForm('majorRedFlags', isSelected ? current.filter(f => f !== flag) : [...current, flag]);
                        }} 
                        className={"px-4 py-3 text-xs tracking-wide uppercase transition-all " + (isSelected ? "bg-[#FF1111] text-white font-black italic border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]" : "bg-white text-black font-bold border-2 border-black")}
                      >
                        {flag}
                      </button>
                    )
                  })}
                </div>
                {formData.majorRedFlags && formData.majorRedFlags.length > 0 && (
                  <div className="flex flex-col mt-4">
                    <label className="text-xs text-[#FF1111] uppercase font-black block mb-1">Red Flag Details & Explanations...</label>
                    <input type="text" value={formData.sfStructuralFlags || ''} onChange={(e) => updateForm('sfStructuralFlags', e.target.value)} placeholder="Provide details on selected red flags..." className="w-full bg-red-50 border-2 border-[#FF1111] rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#FF1111] transition-all" />
                  </div>
                )}
              </div>
`;

content = content.replace(oldRedFlagsRegex, newRedFlags);

fs.writeFileSync(filePath, content);
console.log("Pillar 2 layout fix and Red Flags injection complete.");
