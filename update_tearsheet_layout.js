const fs = require('fs');
let content = fs.readFileSync('src/components/documents/TearSheet.jsx', 'utf8');

// The goal is to restructure the `<div className="flex flex-col gap-4">` directly under the `<div className="bg-[#050505]/60 ... FAST FACTS ...">`
// We want to replace the `flex flex-col gap-4` with `grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start`.
// And place the elements into columns.

let replacement = `
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            {/* COLUMN 1: FAST FACTS & VIABILITY */}
            <div className="flex flex-col gap-6">
              <div className="">
                <h3 className="text-[#777777] font-black text-xs tracking-widest uppercase mb-3 flex items-center gap-2 border-b border-[#222222] pb-2">
                  FAST FACTS
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Lead & Occupancy */}
                  <div className="bg-[#050505]/80 border border-[#222222] rounded-xl p-3 shadow-inner">
                    <label className="text-[#888888] font-bold text-[9px] uppercase tracking-widest block mb-1">Lead Name</label>
                    <div className="text-[#F5F5F5] font-bold text-xs truncate">{formData.manualName || activeLead?.name || 'Unknown'}</div>
                  </div>
                  <div className="bg-[#050505]/80 border border-[#222222] rounded-xl p-3 shadow-inner">
                    <label className="text-[#888888] font-bold text-[9px] uppercase tracking-widest block mb-1">Occupancy</label>
                    <div className="text-[#E5C158] font-bold text-xs">{formData.occupancy || 'Unknown'}</div>
                  </div>

                  {/* Layout Metrics */}
                  <div className="bg-[#050505]/80 border border-[#222222] rounded-xl p-3 shadow-inner">
                    <label className="text-[#888888] font-bold text-[9px] uppercase tracking-widest block mb-1">Beds / Baths</label>
                    <div className="text-[#F5F5F5] font-bold text-xs">
                      {formData.beds || '-'} Bed / {formData.baths || '-'} Bath
                    </div>
                  </div>
                  <div className="bg-[#050505]/80 border border-[#222222] rounded-xl p-3 shadow-inner">
                    <label className="text-[#888888] font-bold text-[9px] uppercase tracking-widest block mb-1">Livable SqFt</label>
                    <div className="text-[#F5F5F5] font-bold text-xs">{formData.sqft || 'Unknown'} SqFt</div>
                  </div>

                  {/* Property Details */}
                  <div className="bg-[#050505]/80 border border-[#222222] rounded-xl p-3 shadow-inner">
                    <label className="text-[#888888] font-bold text-[9px] uppercase tracking-widest block mb-1">Lot Size</label>
                    <div className="text-[#F5F5F5] font-bold text-xs">{formData.lotSize || 'Unknown'}</div>
                  </div>
                  <div className="bg-[#050505]/80 border border-[#222222] rounded-xl p-3 shadow-inner">
                    <label className="text-[#888888] font-bold text-[9px] uppercase tracking-widest block mb-1">Year Built (Age)</label>
                    <div className="text-[#F5F5F5] font-bold text-xs">
                      {formData.yearBuilt || 'Unknown'} 
                      <span className="text-[#777777] font-normal ml-1">
                        {formData.yearBuilt ? \`(\${new Date().getFullYear() - formData.yearBuilt} yrs)\` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deal Score */}
              <div>
                <p className="text-[10px] text-[#F5F5F5] font-bold uppercase tracking-widest mb-1 font-bold">Deal Viability Score</p>
                <div className="flex items-center gap-2">
                  <div className="h-3 flex-1 border border-[#333333] rounded-full overflow-hidden bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[#F5F5F5] shadow-inner">
                    <div className="h-full transition-all duration-500 ease-out" style={{ width: \`\${dealScore}%\`, backgroundColor: scoreColor }}></div>
                  </div>
                  <span className={\`text-xs font-bold font-mono px-1 rounded-xl \${dealScore < 50 ? 'bg-[#E74C3C] text-white' : (dealScore >= 80 ? 'bg-[#D4AF37] text-[#F5F5F5]' : 'bg-[#121212] text-[#F5F5F5]')}\`}>{dealScore}/100</span>
                </div>
                {intelBrief && (
                  <p className="text-sm font-black italic uppercase mt-2 text-[#F5F5F5] leading-tight border-l-4 border-[#333333] pl-2">
                    {intelBrief}
                  </p>
                )}
              </div>
            </div>

            {/* COLUMN 2: DEAL FUNDAMENTALS & UTILITIES */}
            <div className="flex flex-col gap-6">
              <div className="">
                <h2 className="bg-gradient-to-r from-[#D4AF37] via-[#FFF3A3] to-[#B8860B] bg-clip-text text-transparent font-bold text-sm tracking-widest uppercase mb-4 border-b border-[#333333] pb-2">DEAL FUNDAMENTALS</h2>
                <div className="flex flex-col gap-3">
                  <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-3 flex flex-col">
                    <p className="text-[#888888] font-bold text-[10px] uppercase tracking-wider mb-1">MOTIVATION</p>
                    <p className="text-sm font-semibold text-[#F5F5F5] font-bold">{formData?.painPoints?.length > 0 ? formData.painPoints.join(', ') : 'Unknown'}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-3 flex flex-col">
                    <p className="text-[#888888] font-bold text-[10px] uppercase tracking-wider mb-1">TIMELINE</p>
                    <p className="text-sm font-semibold text-[#F5F5F5] font-bold">{formData?.timelineType || formData?.timeline || 'Unknown'}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-3 flex flex-col">
                    <p className="text-[#888888] font-bold text-[10px] uppercase tracking-wider mb-1">ASKING PRICE</p>
                    <p className="text-sm font-semibold text-[#F5F5F5] font-bold">{formData?.askingPrice ? \`$\${Number(formData.askingPrice).toLocaleString()}\` : 'TBD'}</p>
                  </div>
                </div>
              </div>

              {/* INFRASTRUCTURE & UTILITIES */}
              <div className="">
                <h3 className="text-[#777777] font-black text-xs tracking-widest uppercase mb-3 flex items-center gap-2 border-b border-[#222222] pb-2">
                  INFRASTRUCTURE & UTILITIES
                </h3>
                <div className="bg-[#050505]/80 border border-[#222222] border-l-2 border-l-[#E5C158] rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                  <ul className="flex flex-col gap-2">
                    <li className="text-[#F5F5F5] text-xs flex flex-col md:flex-row md:items-start gap-1 md:gap-2">
                      <span className="text-[#888888] font-bold text-[10px] uppercase tracking-wider md:w-24 shrink-0">• SOLAR:</span> 
                      <span className="flex-1">{formData.solarSystem || 'None'}</span>
                    </li>
                    <li className="text-[#F5F5F5] text-xs flex flex-col md:flex-row md:items-start gap-1 md:gap-2 pt-2 border-t border-[#222222]">
                      <span className="text-[#888888] font-bold text-[10px] uppercase tracking-wider md:w-24 shrink-0">• SEWER/SEPTIC:</span> 
                      <span className="flex-1">
                        {formData.septicSewer || 'Unknown'} 
                        {/* Ensure status displays cleanly without a weird box if it's a septic system */}
                        {formData.septicSewer === 'Septic System' && formData.septicCondition ? \` — (Status: \${formData.septicCondition})\` : ''}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* COLUMN 3/4: KNOWN CONDITIONS & RED FLAGS */}
            <div className="lg:col-span-1 xl:col-span-2 flex flex-col gap-6">
              <div className="">
                <h2 className="bg-gradient-to-r from-[#D4AF37] via-[#FFF3A3] to-[#B8860B] bg-clip-text text-transparent font-bold text-sm tracking-widest uppercase mb-4 border-b border-[#333333] pb-2">KNOWN CONDITIONS & RED FLAGS</h2>
                
                {/* Major Red Flags & Amenities */}
                {(formData?.majorRedFlags?.length > 0 || [formData?.amenityPool, formData?.amenityHOA, formData?.amenityRV, formData?.amenityGuestHouse].some(a => a && !a.startsWith('No '))) && (
                  <div className="mb-4 border border-[#333333] bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[#F5F5F5] p-3 shadow-md">
                     <p className="text-[10px] text-[#F5F5F5] uppercase tracking-widest mb-2 font-black">Risk & Value Indicators</p>
                     <div className="flex flex-wrap gap-3 mb-2">
                       {formData?.majorRedFlags?.map(flag => (
                         <span key={flag} className="bg-[#E74C3C] text-white text-xs px-2 py-1 font-black rounded-xl uppercase tracking-wider shadow-md">⚠️ {flag}</span>
                       ))}
                       {[formData?.amenityPool, formData?.amenityHOA, formData?.amenityRV, formData?.amenityGuestHouse]
                         .filter(a => a && !a.startsWith('No '))
                         .map(amenity => (
                           <span key={amenity} className="bg-[#1A1A1A] border border-[#D4AF37]/50 text-[#E5C158] text-[10px] px-2 py-1 font-black rounded-xl uppercase tracking-wider shadow-md">⭐ {amenity}</span>
                       ))}
                     </div>
                     {formData?.majorRedFlags && formData.majorRedFlags.length > 0 && (
                        <div>
                          <p className="text-xs text-[#E74C3C] mt-1 font-bold italic">Details: {formData.sfStructuralFlags || "Requires inspection."}</p>
                        </div>
                     )}
                  </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  {formData?.sfRoof && (
                    <div className="bg-[#050505]/80 border border-[#222222] border-l-2 border-l-[#E5C158] rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#111111]">
                      <h4 className="text-[#E5C158] font-black text-[10px] tracking-widest uppercase mb-2">ROOF</h4>
                      <ul className="flex flex-col gap-1.5">
                        <li className="text-[#F5F5F5] text-xs flex items-start gap-2">
                          <span className="text-[#888888] font-bold text-[10px] uppercase tracking-wider mt-0.5">• AGE:</span> 
                          <span className="flex-1">{formData.roofAge || 'Unknown'}</span>
                        </li>
                        <li className="text-[#F5F5F5] text-xs flex items-start gap-2">
                          <span className="text-[#888888] font-bold text-[10px] uppercase tracking-wider mt-0.5">• CONDITION:</span> 
                          <span className="flex-1">{formData.sfRoof}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {formData?.sfHVAC && (
                    <div className="bg-[#050505]/80 border border-[#222222] border-l-2 border-l-[#E5C158] rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#111111]">
                      <h4 className="text-[#E5C158] font-black text-[10px] tracking-widest uppercase mb-2">HVAC</h4>
                      <ul className="flex flex-col gap-1.5">
                        <li className="text-[#F5F5F5] text-xs flex items-start gap-2">
                          <span className="text-[#888888] font-bold text-[10px] uppercase tracking-wider mt-0.5">• AGE:</span> 
                          <span className="flex-1">{formData.hvacAge || 'Unknown'}</span>
                        </li>
                        <li className="text-[#F5F5F5] text-xs flex items-start gap-2">
                          <span className="text-[#888888] font-bold text-[10px] uppercase tracking-wider mt-0.5">• CONDITION:</span> 
                          <span className="flex-1">{formData.sfHVAC}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {formData?.sfPlumbing && (
                    <div className="bg-[#050505]/80 border border-[#222222] border-l-2 border-l-[#E5C158] rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#111111]">
                      <h4 className="text-[#E5C158] font-black text-[10px] tracking-widest uppercase mb-2">PLUMBING</h4>
                      <ul className="flex flex-col gap-1.5">
                        <li className="text-[#F5F5F5] text-xs flex items-start gap-2">
                          <span className="text-[#888888] font-bold text-[10px] uppercase tracking-wider mt-0.5">• AGE:</span> 
                          <span className="flex-1">{formData.plumbingAge || 'Unknown'}</span>
                        </li>
                        <li className="text-[#F5F5F5] text-xs flex items-start gap-2">
                          <span className="text-[#888888] font-bold text-[10px] uppercase tracking-wider mt-0.5">• CONDITION:</span> 
                          <span className="flex-1">{formData.sfPlumbing}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {formData?.sfElectrical && (
                    <div className="bg-[#050505]/80 border border-[#222222] border-l-2 border-l-[#E5C158] rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#111111]">
                      <h4 className="text-[#E5C158] font-black text-[10px] tracking-widest uppercase mb-2">ELECTRICAL</h4>
                      <ul className="flex flex-col gap-1.5">
                        <li className="text-[#F5F5F5] text-xs flex items-start gap-2">
                          <span className="text-[#888888] font-bold text-[10px] uppercase tracking-wider mt-0.5">• AGE:</span> 
                          <span className="flex-1">{formData.electricalAge || 'Unknown'}</span>
                        </li>
                        <li className="text-[#F5F5F5] text-xs flex items-start gap-2">
                          <span className="text-[#888888] font-bold text-[10px] uppercase tracking-wider mt-0.5">• CONDITION:</span> 
                          <span className="flex-1">{formData.sfElectrical}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {formData?.kitchenCondition && (
                    <div className="bg-[#050505]/80 border border-[#222222] border-l-2 border-l-[#E5C158] rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#111111]">
                      <h4 className="text-[#E5C158] font-black text-[10px] tracking-widest uppercase mb-2">KITCHEN</h4>
                      <ul className="flex flex-col gap-1.5">
                        <li className="text-[#F5F5F5] text-xs flex items-start gap-2">
                          <span className="text-[#888888] font-bold text-[10px] uppercase tracking-wider mt-0.5">• CONDITION:</span> 
                          <span className="flex-1">{formData.kitchenCondition}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {formData?.cosmeticsBathsData && Object.keys(formData.cosmeticsBathsData).length > 0 && (
                    <div className="bg-[#050505]/80 border border-[#222222] border-l-2 border-l-[#E5C158] rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#111111]">
                      <h4 className="text-[#E5C158] font-black text-[10px] tracking-widest uppercase mb-2">BATHROOMS</h4>
                      <ul className="flex flex-col gap-1.5">
                        {Object.entries(formData.cosmeticsBathsData).map(([i, cond]) => (
                          <li key={i} className="text-[#F5F5F5] text-xs flex items-start gap-2">
                            <span className="text-[#888888] font-bold text-[10px] uppercase tracking-wider mt-0.5">• BATH {parseInt(i)+1}:</span> 
                            <span className="flex-1">{cond}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {/* Triage Condition Fallbacks */}
                  {!formData?.sfRoof && formData?.roof?.length > 0 && <span className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[#F5F5F5]/60 text-white text-xs px-2 py-1 font-bold rounded-xl shadow-md">Roof: {formData.roof.join(', ')}</span>}
                  {!formData?.sfHVAC && formData?.hvac?.length > 0 && <span className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[#F5F5F5]/60 text-[#F5F5F5] text-xs px-2 py-1 font-bold rounded-xl shadow-md">HVAC: {formData.hvac.join(', ')}</span>}
                  {!formData?.sfPlumbing && formData?.plumbing?.length > 0 && <span className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[#F5F5F5]/60 text-[#F5F5F5] text-xs px-2 py-1 font-bold rounded-xl shadow-md">Plumbing: {formData.plumbing.join(', ')}</span>}
                  {!formData?.sfElectrical && formData?.electrical?.length > 0 && <span className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[#F5F5F5]/60 text-white text-xs px-2 py-1 font-bold rounded-xl shadow-md">Electrical: {formData.electrical.join(', ')}</span>}
                  
                  {(!formData?.sfRoof && !formData?.sfHVAC && !formData?.sfPlumbing && !formData?.sfElectrical && !formData?.roof?.length && !formData?.hvac?.length && !formData?.plumbing?.length && !formData?.electrical?.length) && (
                    <span className="text-sm font-bold text-[#F5F5F5] font-bold">No major issues reported</span>
                  )}
                </div>
              </div>
            </div>
          </div>
`;

// Find the start and end of the block we want to replace
const startIndex = content.indexOf('<div className="flex flex-col gap-4">', content.indexOf('FAST FACTS') - 150);
const endIndex = content.indexOf('        <div className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[#F5F5F5]/80 backdrop-blur-md border border-[#333333] shadow-sm rounded-xl p-5 mb-6 overflow-hidden relative transition-all duration-300">');

let newContent = content.substring(0, startIndex) + replacement + '\n      </div>\n\n' + content.substring(endIndex);

// Also replace any rounded-sm or rounded-none in TearSheet just in case
newContent = newContent.replace(/rounded-sm/g, 'rounded-xl').replace(/rounded-none/g, 'rounded-xl');

fs.writeFileSync('src/components/documents/TearSheet.jsx', newContent);
console.log('TearSheet.jsx updated.');
