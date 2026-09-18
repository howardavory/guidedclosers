const fs = require('fs');

let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

// Import SellerFinanceCalculator
if (!code.includes('SellerFinanceCalculator')) {
  const importStr = `import CreativeCalculator from '../calculators/CreativeCalculator';`;
  code = code.replace(importStr, `${importStr}\nimport SellerFinanceCalculator from '../calculators/SellerFinanceCalculator';`);
}

const targetStr = `{/* INLINE OFFER UNDERWRITING - EXECUTED DURING PIVOT */}
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
</div>`;

const newStr = `{/* INLINE OFFER UNDERWRITING - EXECUTED DURING PIVOT */}
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

  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
    
    {/* CALCULATOR 1: CASH OFFER */}
    <div className="bg-[#0A0A0F]/50 border border-[#222222] rounded-xl p-4 shadow-inner flex flex-col">
      <h4 className="text-[#FFFFFF] font-black tracking-widest text-[11px] uppercase border-b border-[#333333] pb-2 mb-3">1. Cash Offer</h4>
      <CashCalculator 
        askingPrice={formData.askingPrice || formData.price} 
        globalArv={formData.arv || 0} 
        updateGlobalArv={(val) => updateForm('arv', val)} 
        solarAssumable={formData.solarAssumable} 
        solarMonthlyPayment={formData.solarMonthlyPayment} 
        isEviction={formData.tenantStatus?.includes('Eviction Needed')} 
      />
    </div>

    {/* CALCULATOR 2: SUBJECT-TO (DEBT) */}
    <div className="bg-[#0A0A0F]/50 border border-[#222222] rounded-xl p-4 shadow-inner flex flex-col">
      <h4 className="text-[#FFFFFF] font-black tracking-widest text-[11px] uppercase border-b border-[#333333] pb-2 mb-3">2. Subject-To (Existing Debt)</h4>
      <CreativeCalculator 
        globalArv={formData.arv || 0} 
        updateGlobalArv={(val) => updateForm('arv', val)} 
        solarAssumable={formData.solarAssumable} 
        solarMonthlyPayment={formData.solarMonthlyPayment} 
      />
    </div>

    {/* CALCULATOR 3: SELLER FINANCE */}
    <div className="bg-[#0A0A0F]/50 border border-[#222222] rounded-xl p-4 shadow-inner flex flex-col">
      <h4 className="text-[#FFFFFF] font-black tracking-widest text-[11px] uppercase border-b border-[#333333] pb-2 mb-3">3. Seller Finance (New Debt)</h4>
      <SellerFinanceCalculator />
    </div>

  </div>
</div>`;

// Check if we can find the exact string to replace, due to possible whitespace differences.
if (code.includes('Live Offer Underwriting')) {
  // Let's do a substring replace to be safe.
  const startIndex = code.indexOf(`{/* INLINE OFFER UNDERWRITING - EXECUTED DURING PIVOT */}`);
  // Find the end of this block which is before `{/* Final Negotiated Price */}`
  const endIndex = code.indexOf(`{/* Final Negotiated Price */}`, startIndex);
  if (startIndex !== -1 && endIndex !== -1) {
    const blockToReplace = code.substring(startIndex, endIndex);
    code = code.replace(blockToReplace, newStr + '\n\n  ');
    fs.writeFileSync('src/components/script/CallScript.jsx', code);
    console.log("Phase 3: Restructured Pillar 5 Layout.");
  } else {
    console.log("Phase 3: Could not find exact block bounds.");
  }
} else {
  console.log("Phase 3: Target block not found.");
}
