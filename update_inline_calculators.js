const fs = require('fs');

let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

// Phase 1: Purge the Global Calculator Drawer
const drawerStartStr = `{activeGlobalDrawer === 'calculators' && (`;
const drawerStartIndex = code.indexOf(drawerStartStr);
if (drawerStartIndex !== -1) {
  // Find the end of the calculator drawer block
  // The block looks like:
  // {activeGlobalDrawer === 'calculators' && (
  //   <div className="flex flex-col h-full">
  //     ...
  //     </div>
  //   </div>
  // )}
  // Let's use string indexOf to precisely cut it out.
  const repairsCalcStr = `<RepairsCalculator`;
  const creativeCalcStr = `<CreativeCalculator`;
  if (code.includes(repairsCalcStr, drawerStartIndex) && code.includes(creativeCalcStr, drawerStartIndex)) {
    const blockEndIndex = code.indexOf(`)}`, code.indexOf(creativeCalcStr, drawerStartIndex)) + 2;
    const drawerBlock = code.substring(drawerStartIndex, blockEndIndex);
    code = code.replace(drawerBlock, '');
    console.log("Phase 1: Global Drawer purged.");
  }
} else {
  console.log("Phase 1: activeGlobalDrawer === 'calculators' not found (might have been removed already).");
}

// Phase 2: Inject Repairs Engine into Pillar 2
const pillar2Target = `{currentStep === 2 && (`;
const pillar2Index = code.indexOf(pillar2Target);
if (pillar2Index !== -1) {
  // We want to insert just below this line.
  const insertionPoint = pillar2Index + pillar2Target.length;
  const repairsBlock = `
              {/* INLINE REPAIRS ENGINE - EXECUTED DURING CONDITION DISCOVERY */}
              <div className="mt-8 pt-8 border-t border-[#333333] w-full">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-[#1A1A1A] p-2 rounded-lg border border-[#333333]">
                    <Wrench size={18} className="text-[#E5C158]" />
                  </span>
                  <div>
                    <h3 className="text-[#E5C158] font-black tracking-widest text-sm uppercase">Inline Repairs Engine</h3>
                    <p className="text-[#888888] text-xs font-bold mt-1">Calculate rehab costs in real-time as the seller details the property condition.</p>
                  </div>
                </div>
                
                <div className="bg-[#0A0A0F]/50 border border-[#222222] rounded-xl p-4 md:p-6 shadow-inner">
                  <RepairsCalculator formData={formData} updateForm={updateForm} lead={activeLead} />
                </div>
              </div>
`;
  if (!code.includes('Inline Repairs Engine')) {
    code = code.substring(0, insertionPoint) + repairsBlock + code.substring(insertionPoint);
    console.log("Phase 2: Repairs Engine injected.");
  } else {
    console.log("Phase 2: Repairs Engine already injected.");
  }
}

// Phase 3: Inject MAO & Creative into Pillar 5
const pillar5Target = `{/* Final Negotiated Price */}`;
const pillar5Index = code.indexOf(pillar5Target);
if (pillar5Index !== -1) {
  const offerBlock = `{/* INLINE OFFER UNDERWRITING - EXECUTED DURING PIVOT */}
<div className="mt-8 pt-8 border-t border-[#333333] w-full mb-8">
  <div className="flex items-center gap-3 mb-6">
    <span className="bg-[#1A1A1A] p-2 rounded-lg border border-[#333333]">
      <Calculator size={18} className="text-[#E5C158]" />
    </span>
    <div>
      <h3 className="text-[#E5C158] font-black tracking-widest text-sm uppercase">Live Offer Underwriting</h3>
      <p className="text-[#888888] text-xs font-bold mt-1">Determine MAO and Creative viability before dropping the anchor price.</p>
    </div>
  </div>

  <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
    <div className="bg-[#0A0A0F]/50 border border-[#222222] rounded-xl p-4 shadow-inner">
      <CashCalculator 
        askingPrice={formData.askingPrice || formData.price} 
        globalArv={formData.arv || 0} 
        updateGlobalArv={(val) => updateForm('arv', val)} 
        solarAssumable={formData.solarAssumable} 
        solarMonthlyPayment={formData.solarMonthlyPayment} 
        isEviction={formData.tenantStatus?.includes('Eviction Needed')} 
      />
    </div>
    <div className="bg-[#0A0A0F]/50 border border-[#222222] rounded-xl p-4 shadow-inner">
      <CreativeCalculator 
        globalArv={formData.arv || 0} 
        updateGlobalArv={(val) => updateForm('arv', val)} 
        solarAssumable={formData.solarAssumable} 
        solarMonthlyPayment={formData.solarMonthlyPayment} 
      />
    </div>
  </div>
</div>

  `;
  if (!code.includes('Live Offer Underwriting')) {
    code = code.substring(0, pillar5Index) + offerBlock + code.substring(pillar5Index);
    console.log("Phase 3: MAO & Creative Calculators injected.");
  } else {
    console.log("Phase 3: MAO & Creative Calculators already injected.");
  }
}

// Let's also check for calculator icon in the header or sidebar that the user wanted removed, but there wasn't any in CallScript.jsx itself.
// But wait, there is a header for activeGlobalDrawer in CallScript.jsx.
// {activeGlobalDrawer === 'calculators' && <span className="text-[#E5C158] flex items-center gap-3"><Calculator size={28} /> DEAL CALCULATORS</span>}
const calculatorHeaderStr = `{activeGlobalDrawer === 'calculators' && <span className="text-[#E5C158] flex items-center gap-3"><Calculator size={28} /> DEAL CALCULATORS</span>}`;
if (code.includes(calculatorHeaderStr)) {
  code = code.replace(calculatorHeaderStr, '');
  console.log("Phase 1b: Removed calculators header from CallScript.");
}

// And remove the "calculators" state check from the activeGlobalDrawer backdrop/overlay?
// The overlay just checks `activeGlobalDrawer && activeGlobalDrawer !== 'playbook'`.
// The sidebar has the toggle button. We will modify Sidebar.jsx in a separate step or right here.

fs.writeFileSync('src/components/script/CallScript.jsx', code);
console.log('CallScript.jsx restructuring complete.');
