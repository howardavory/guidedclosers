const fs = require('fs');
let content = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

// Action 1: City Violations & Liens
// Replace <input type="number" placeholder="CURRENT FINE AMOUNT $" ... />
// With dynamic map over formData.cityViolations
let cityViolationsInput = '<input type="number" placeholder="CURRENT FINE AMOUNT $" value={formData.redFlagFines || \'\'} onChange={(e) => updateForm(\'redFlagFines\', e.target.value)} className="w-full max-w-sm bg-[#1A1A1A] rounded-xl border border-[#333333] p-3 font-black  text-xs shadow-md focus:outline-none focus:translate-y-1 focus:shadow-none transition-all" />';
let cityViolationsDynamic = `
                      {formData.cityViolations?.map(type => (
                         <div key={type} className="mb-3 animate-slideIn">
                           <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">{type} - FINE AMOUNT $</label>
                           <input type="number" placeholder="FINE AMOUNT $" value={formData.fineAmounts?.[type] || ''} onChange={(e) => updateForm('fineAmounts', { ...(formData.fineAmounts || {}), [type]: e.target.value })} className="w-full max-w-sm bg-[#1A1A1A] rounded-xl border border-[#333333] p-3 font-black text-xs shadow-md focus:outline-none focus:translate-y-1 focus:shadow-none transition-all" />
                         </div>
                      ))}
`;
content = content.replace(cityViolationsInput, cityViolationsDynamic);

// If the original input didn't have the replaced classes exactly, let's use a regex
content = content.replace(
  /<input type="number" placeholder="CURRENT FINE AMOUNT \$" [^>]*\/>/,
  cityViolationsDynamic.trim()
);

// Replace Liens input
let liensDynamic = `
                      {formData.lienTypes?.map(type => (
                         <div key={type} className="mb-3 animate-slideIn">
                           <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">{type} - PAYOFF AMOUNT $</label>
                           <input type="number" placeholder="LIEN AMOUNT $" value={formData.lienAmounts?.[type] || ''} onChange={(e) => updateForm('lienAmounts', { ...(formData.lienAmounts || {}), [type]: e.target.value })} className="w-full max-w-sm bg-[#1A1A1A] rounded-xl border border-[#333333] p-3 font-black text-xs shadow-md focus:outline-none focus:translate-y-1 focus:shadow-none transition-all" />
                         </div>
                      ))}
`;
content = content.replace(
  /<input type="number" placeholder="EST. PAYOFF AMOUNT \$" [^>]*\/>/,
  liensDynamic.trim()
);

// Action 2: Insurance Claims & Action 3: Professional Remediation

// Fire Insurance Claim Follow-up
// Find the end of `redFlagFire === 'Cosmetic / Smoke Only'` and `'Structural / Framing Damage'` and append.
let fireInsuranceBlock = `
                      {formData.redFlagFireDetails === 'Active Insurance Claim' && (
                         <div className="flex flex-col gap-3 mt-4 animate-slideIn border-l-2 border-[#E5C158] pl-3">
                           <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest">Insurance Claim Status</label>
                           <input type="text" placeholder="e.g. Filed, Adjuster Coming..." value={formData.fireClaimStatus || ''} onChange={(e) => updateForm('fireClaimStatus', e.target.value)} className="w-full max-w-sm bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] outline-none focus:border-[#E5C158] text-xs" />
                           <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mt-2">Expected Payout Amount $</label>
                           <input type="number" placeholder="Amount $" value={formData.fireClaimPayout || ''} onChange={(e) => updateForm('fireClaimPayout', e.target.value)} className="w-full max-w-sm bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] outline-none focus:border-[#E5C158] text-xs" />
                         </div>
                      )}
`;
// Let's insert this just before `</div>` of the Fire Damage section.
content = content.replace(
  /\s*<\/div>\s*\}\s*\{\/\* WATER DAMAGE \*\//i, // Using comment as anchor or find exactly. Wait, I don't have a comment.
  ''
);

// We'll place it by finding the block: 
// {formData.redFlagFire === 'Structural / Framing Damage' && ( ... )}
const structuralFramingEnd = content.indexOf("                      )}", content.indexOf("formData.redFlagFire === 'Structural / Framing Damage'"));
if (structuralFramingEnd !== -1) {
  content = content.substring(0, structuralFramingEnd + 24) + "\n" + fireInsuranceBlock + content.substring(structuralFramingEnd + 24);
}

// Water Damage Follow-ups
let waterFollowUps = `
                      {formData.waterDamageTypes?.includes('Active Insurance Claim') && (
                         <div className="flex flex-col gap-3 mt-4 animate-slideIn border-l-2 border-[#E5C158] pl-3">
                           <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest">Insurance Claim Status</label>
                           <input type="text" placeholder="e.g. Filed, Adjuster Coming..." value={formData.waterClaimStatus || ''} onChange={(e) => updateForm('waterClaimStatus', e.target.value)} className="w-full max-w-sm bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] outline-none focus:border-[#E5C158] text-xs" />
                           <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mt-2">Expected Payout Amount $</label>
                           <input type="number" placeholder="Amount $" value={formData.waterClaimPayout || ''} onChange={(e) => updateForm('waterClaimPayout', e.target.value)} className="w-full max-w-sm bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] outline-none focus:border-[#E5C158] text-xs" />
                         </div>
                      )}
                      {formData.waterDamageTypes?.includes('Professional Remediation Done') && (
                         <div className="flex flex-col gap-3 mt-4 animate-slideIn border-l-2 border-[#00E5FF] pl-3">
                           <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest">Who did the work?</label>
                           <input type="text" placeholder="Contractor / Company Name" value={formData.waterRemediationCompany || ''} onChange={(e) => updateForm('waterRemediationCompany', e.target.value)} className="w-full max-w-sm bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] outline-none focus:border-[#00E5FF] text-xs" />
                           <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mt-2">Did they get paid?</label>
                           <div className="flex gap-2">
                             {['Yes', 'No', 'Pending'].map(status => (
                               <button key={status} onClick={() => updateForm('waterRemediationPaid', status)} className={"flex-1 py-2 text-xs font-bold rounded-xl border " + (formData.waterRemediationPaid === status ? "bg-[#00E5FF] text-[#000000] border-[#00E5FF]" : "bg-[#121212] text-[#888888] border-[#333333]")}>{status}</button>
                             ))}
                           </div>
                         </div>
                      )}
`;

const waterDamageEnd = content.indexOf("                      </div>\n                    </div>\n                  )}", content.indexOf("formData.majorRedFlags?.includes('Water Damage / Mold')"));
if (waterDamageEnd !== -1) {
  content = content.substring(0, waterDamageEnd + 28) + "\n" + waterFollowUps + content.substring(waterDamageEnd + 28);
}

fs.writeFileSync('src/components/script/CallScript.jsx', content);
console.log('CallScript.jsx updated for Phase 2.');
