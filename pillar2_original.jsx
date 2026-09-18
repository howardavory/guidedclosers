{renderPillar(2, "Property Details & Occupancy", <Home size={20} />, (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col mb-2 animate-slideIn">
               {!formData.fromPrematurePrice && (
                 <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
                   <span className="font-bold">
                     {`"Public records show this as a ${formData.expectedPropertyType || 'single-family home'}. Is that accurate?"`}
                   </span>
                 </div>
               )}

                 <div>
                   <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Select Property Type</label>
                   <div className="flex flex-wrap gap-3 mb-4">
                     {['Single Family', 'Multi-Family', 'Condo/Townhome', 'Mobile Home', 'Land'].map(type => (
                       <button key={type} onClick={() => {
                         const newType = formData.propertyType === type ? '' : type;
                         setFormData(prev => {
                           let updates = { propertyType: newType };
                           if (prev.propertyType === 'Multi-Family' && newType !== 'Multi-Family') {
                             updates.mfUnitCount = '';
                             updates.mfUnitsData = [];
                             updates.mfTotalRents = '';
                             updates.mfGrossRent = '';
                           }
                           if (prev.propertyType === 'Land' && newType !== 'Land') {
                             updates.landZoning = '';
                             updates.landUtilities = '';
                           }
                           return { ...prev, ...updates };
                         });
                       }} className={clsx("", formData.propertyType === type ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{type}</button>
                     ))}
                   </div>
                 </div>
            </div>

            {formData.propertyType && formData.propertyType !== 'Multi-Family' && formData.propertyType !== 'Land' && (
              <>
                {/* 1. DECISION MAKERS */}
                <div className="flex flex-col mb-2 animate-slideIn">
                   <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
                     <div className="text-[#F5F5F5] text-[#E2E8F0] font-medium text-lg leading-relaxed font-medium mb-4">
                       {`"Perfect. And before we get into the house itself, are you the sole owner on title, or is there a spouse or partner we'd need to loop in eventually?"`}
                     </div>

                     <div>
                       <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Decision Makers</label>
                       <div className="flex flex-wrap gap-3 mb-4">
                         {['Sole Owner', 'Spouse/Partner', 'Trust/Probate/Multiple'].map(dm => (
                           <button key={dm} onClick={() => updateForm('decisionMakers', formData.decisionMakers === dm ? '' : dm)} className={clsx("", formData.decisionMakers === dm ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{dm}</button>
                         ))}
                                     {formData.decisionMakers === 'Trust/Probate/Multiple' && (
                          <div className="mt-4 p-4 border border-[#333333] bg-[#1A1A1A] shadow-md relative">
                            <div className="mb-6">
                              <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
                                <span className="font-bold">"I know that managing a property with multiple family members or partners can be a heavy administrative burden. My goal is to make this as seamless as possible for everyone involved. Just so I can organize the paperwork on my end and make sure everyone's voice is respected, exactly how many decision makers are we coordinating with?"</span>
                              </div>
                            </div>
                            
                            <div className="mb-6">
                              <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Total Decision Makers</label>
                              <input 
                                type="number" 
                                min="2" 
                                max="10" 
                                value={formData.dmCount || ''} 
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val) && val > 0) {
                                    updateForm('dmCount', val);
                                    if (!formData.activeDm || formData.activeDm > val) {
                                      updateForm('activeDm', 1);
                                    }
                                  } else {
                                    updateForm('dmCount', '');
                                  }
                                }}
                                className="w-full bg-[#050505]/80 text-[#F5F5F5] border border-[#222222] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/50 transition-all outline-none placeholder-[#444444]"
                                placeholder="#"
                              />
                            </div>

                            {formData.dmCount >= 2 && (
                              <div className="animate-slideIn border-t-4 border-[#333333] pt-6">
                                <div className="mb-6">
                                  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
                                    <span className="font-bold">"Got it, so there are {formData.dmCount} of you. And just so I know who I'm addressing when we eventually get to the title phase, what is the best way to list everyone's relationship to the property? Like siblings, partners, trustees?"</span>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <div className="flex flex-wrap gap-3 mb-4">
                                    {Array.from({ length: formData.dmCount }).map((_, i) => (
                                      <button 
                                        key={i} 
                                        onClick={() => updateForm('activeDm', i+1)} 
                                        className={clsx("px-4 py-2 font-black border border-[#333333] shadow-md transition-transition-all duration-300 hover:-translate-y-0.5  text-xs tracking-wider", (formData.activeDm || 1) === i+1  ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                                      >
                                        DM {i+1}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="bg-[#1A1A1A] border border-[#333333] p-5 rounded-xl mb-5">
                                  <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Relationship (DM {formData.activeDm || 1})</label>
                                  <div className="flex flex-wrap gap-3 mb-4">
                                    {['Sibling', 'Ex-Spouse', 'Business Partner', 'Heir', 'Parent', 'Child', 'Attorney', 'Trustee', 'Executor'].map(rel => (
                                      <button 
                                        key={rel} 
                                        onClick={() => updateForm(`dmRel_${formData.activeDm || 1}`, formData[`dmRel_${formData.activeDm || 1}`] === rel ? '' : rel)} 
                                        className={clsx("font-black text-xs  px-4 py-2 border-2 border-[#333333] shadow-md transition-transition-all duration-300 hover:-translate-y-0.5", formData[`dmRel_${formData.activeDm || 1}`] === rel  ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                                      >
                                        {rel}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                              <div className="animate-slideIn border-t-4 border-[#333333] pt-6 mt-6">
                                <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
                                  <span className="font-bold">"Since it's in a trust or probate, has the probate process officially started yet? And who is acting as the primary Executor or Administrator?"</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6 mb-4">
                                  <div>
                                    <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Probate Started?</label>
                                    <div className="flex gap-2">
                                      {['Yes', 'No'].map(opt => (
                                        <button 
                                          key={opt} 
                                          onClick={() => updateForm('probateStarted', formData.probateStarted === (opt === 'Yes') ? null : (opt === 'Yes'))}
                                          className={clsx("flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center ", formData.probateStarted === (opt === 'Yes')  ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                                        >
                                          {opt}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Executor / Admin Name</label>
                                    <input 
                                      type="text" 
                                      placeholder="Name..." 
                                      value={formData.executor || ''} 
                                      onChange={e => updateForm('executor', e.target.value)} 
                                      className="w-full bg-[#050505]/80 text-[#F5F5F5] border border-[#222222] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/50 transition-all outline-none placeholder-[#444444]"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                     </div>
                  </div>

                 </div>
               </div>
                {/* 2. PROPERTY SPECS */}
                {formData.decisionMakers && (
                  <>
                    <div className="flex flex-col mb-2 animate-slideIn">
                       <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
                         <span className="font-bold">
                           {formData.propertyType === 'Single Family' || formData.propertyType === 'Condo/Townhome' ? (
                             (() => {
                               if (!formData.publicBeds && !formData.publicBaths && !formData.publicSqft && !formData.beds && !formData.baths && !formData.sqft) {
                                 return `"The county records are actually coming up completely blank on my end today. Just so I'm totally accurate, what do you currently have it listed as for beds and baths?"`;
                               }
                               let intro = "So ";
                               if (formData.decisionMakers === 'Sole Owner') intro = "Perfect, keeps things simple. So ";
                               else if (formData.decisionMakers === 'Spouse/Partner' || formData.decisionMakers === 'Trust/Probate/Multiple') intro = "Got it, so we'll just make sure they're looped in on the numbers when the time comes. So ";
                               
                               const displayBeds = formData.beds ? formData.beds.replace(/[^0-9+]/g, '') : formData.publicBeds || '{Beds}';
                               const displayBaths = formData.baths ? formData.baths.replace(/[^0-9.+]/g, '') : formData.publicBaths || '{Baths}';
                               const displaySqft = formData.sqft ? Number(formData.sqft).toLocaleString() : formData.publicSqft ? Number(formData.publicSqft).toLocaleString() : '{SqFt}';

                               return `"${intro}on my end I see that it's a ${displayBeds} bed, ${displayBaths} bath, right around ${displaySqft} square feet. Have you guys added on to it at all${displayBeds !== '{Beds}' && displayBaths !== '{Baths}' && displaySqft !== '{SqFt}' ? ", or is this still the current layout?" : "?"}"`;
                             })()
                           ) : formData.propertyType === 'Mobile Home' ? (
                             `"Is that sitting on its own land that you own, or is it in a park where you're paying lot rent? And what's the bed/bath count on the unit itself?"`
                           ) : ""}
                         </span>
                       </div>
                         <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Beds</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {['1 Bed', '2 Beds', '3 Beds', '4 Beds', '5+ Beds'].map(bed => (
                            <button key={bed} onClick={() => updateForm('beds', formData.beds === bed ? '' : bed)} className={clsx("", formData.beds === bed ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{bed}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Baths</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {['1 Bath', '1.5 Baths', '2 Baths', '2.5 Baths', '3+ Baths'].map(bath => (
                            <button key={bath} onClick={() => updateForm('baths', formData.baths === bath ? '' : bath)} className={clsx("", formData.baths === bath ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{bath}</button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 mt-2">
                         <div>
                           <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Sqft</label>
                           <input type="number" value={formData.sqft} onChange={e => updateForm('sqft', e.target.value)} className="w-full bg-[#050505]/80 text-[#F5F5F5] border border-[#222222] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/50 transition-all outline-none placeholder-[#444444]" />
                         </div>
                         <div>
                           <div className="flex justify-between items-center mb-1">
                             <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Lot Size ({formData.lotSizeMeasure})</label>
                             <div className="flex bg-gray-200 rounded p-0.5">
                               <button className={clsx("px-2 py-0.5 text-[10px] font-bold  rounded", formData.lotSizeMeasure === 'SQFT' ? "bg-[#1A1A1A]/80 text-white shadow-sm" : "text-gray-500")} onClick={() => updateForm('lotSizeMeasure', 'SQFT')}>SQFT</button>
                               <button className={clsx("px-2 py-0.5 text-[10px] font-bold  rounded", formData.lotSizeMeasure === 'ACRES' ? "bg-[#1A1A1A]/80 text-white shadow-sm" : "text-gray-500")} onClick={() => updateForm('lotSizeMeasure', 'ACRES')}>ACRES</button>
                             </div>
                           </div>
                           <input type="number" value={formData.lotSize} onChange={e => updateForm('lotSize', e.target.value)} className="w-full bg-[#050505]/80 text-[#F5F5F5] border border-[#222222] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/50 transition-all outline-none placeholder-[#444444]" />
                           {formData.lotSize && (
                             <div className="text-[10px] text-gray-500 font-medium italic text-right pr-1">
                               {formData.lotSizeMeasure === 'SQFT' ? `(${(Number(formData.lotSize) / 43560).toFixed(2)} acres)` : `(${(Number(formData.lotSize) * 43560).toLocaleString()} sqft)`}
                             </div>
                           )}
                         </div>
                      </div>
                    </div>
                  </div>
              </>
                )}

                {/* 3. OCCUPANCY */}
                {formData.decisionMakers && (
                  <>
                    <div className="flex flex-col mb-2 animate-slideIn">
                       <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
                         <span className="font-bold">
                           "Sounds good, now are you currently living in the property right now or is it a rental?"
                         </span>
                       </div>
                         <div>
                           <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Occupancy Status</label>
                           <div className="flex flex-wrap gap-3 mb-4">
                        {['Owner Occupied', 'Tenant Occupied', 'Vacant'].map(occ => (
                          <button key={occ} onClick={() => {
                            const newOcc = formData.occupancy === occ ? '' : occ;
                            setFormData(prev => {
                              let updates = { occupancy: newOcc };
                              if (prev.occupancy === 'Tenant Occupied' && newOcc !== 'Tenant Occupied') {
                                updates.rentAmount = '';
                                updates.leaseType = '';
                                updates.tenantStatus = [];
                                updates.rentArrears = '';
                                updates.section8Status = '';
                              }
                              return { ...prev, ...updates };
                            });
                          }} className={clsx("", formData.occupancy === occ ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{occ}</button>
                        ))}
                      </div>
                            
                            {formData.occupancy === 'Tenant Occupied' && (
                              <div className="w-full flex flex-col gap-6 mt-4">
                                
                                <div className="relative border-l-4 border-transparent focus-within:border-[#D4AF37] focus-within:bg-[#121212]/80 bg-[#1A1A1A] w-full p-5 md:p-8 shadow-sm rounded-xl transition-all">
                                  <span className="font-bold text-[#F5F5F5] text-lg">
                                    "Got it. And just so we are totally respectful of their space, do the tenants know you are considering selling, or is that kept quiet for now? Are they currently paying on time?"
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Rent Amount</label>
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                      <input 
                                        type="number" 
                                        placeholder="e.g. 1500" 
                                        value={formData.rentAmount || ''} 
                                        onChange={e => updateForm('rentAmount', e.target.value)} 
                                        className="w-full bg-[#121212] border border-[#333333] rounded-xl p-3 pl-7 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Lease Type</label>
                                    <div className="flex flex-wrap gap-2">
                                      {['Month-to-Month', 'Annual'].map(lt => (
                                        <button 
                                          key={lt} 
                                          onClick={() => updateForm('leaseType', formData.leaseType === lt ? '' : lt)} 
                                          className={clsx("", formData.leaseType === lt  ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                                        >
                                          {lt}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">How Do They Pay?</label>
                                    <input 
                                      type="text" 
                                      placeholder="e.g. Zelle, Cash, Portal..." 
                                      value={formData.rentMethod || ''} 
                                      onChange={e => updateForm('rentMethod', e.target.value)} 
                                      className="w-full bg-[#050505]/80 text-[#F5F5F5] border border-[#222222] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/50 transition-all outline-none placeholder-[#444444]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Tenant Relationship</label>
                                    <div className="flex flex-wrap gap-2">
                                      {['Standard Renter', 'Family Member', 'Friend'].map(rel => (
                                        <button 
                                          key={rel} 
                                          onClick={() => updateForm('sfTenantRel', formData.sfTenantRel === rel ? '' : rel)} 
                                          className={clsx("", formData.sfTenantRel === rel  ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                                        >
                                          {rel}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Payment Status</label>
                                  <div className="flex flex-wrap gap-2">
                                    <button 
                                      className={clsx("", formData.tenantStatus?.includes('Paying on Time') ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                                      onClick={() => {
                                        const current = formData.tenantStatus || [];
                                        updateForm('tenantStatus', current.includes('Paying on Time') ? current.filter(x => x !== 'Paying on Time') : [...current, 'Paying on Time']);
                                      }}
                                    >
                                      Paying on Time
                                    </button>
                                    <button 
                                      className={clsx("", formData.tenantStatus?.includes('Behind on Rent') ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                                      onClick={() => {
                                        const current = formData.tenantStatus || [];
                                        updateForm('tenantStatus', current.includes('Behind on Rent') ? current.filter(x => x !== 'Behind on Rent') : [...current, 'Behind on Rent']);
                                      }}
                                    >
                                      Behind on Rent
                                    </button>
                                    <button 
                                      className={clsx("", formData.tenantStatus?.includes('Eviction Needed') ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                                      onClick={() => {
                                        const current = formData.tenantStatus || [];
                                        updateForm('tenantStatus', current.includes('Eviction Needed') ? current.filter(x => x !== 'Eviction Needed') : [...current, 'Eviction Needed']);
                                      }}
                                    >
                                      Eviction Needed
                                    </button>
                                  </div>
                                </div>

                                {(formData.tenantStatus?.includes('Behind on Rent') || formData.tenantStatus?.includes('Eviction Needed')) && (
                                  <div className="animate-slideIn">
                                    <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Amount Behind</label>
                                    <div className="relative max-w-xs">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                      <input 
                                        type="number" 
                                        placeholder="0" 
                                        value={formData.rentArrears || ''} 
                                        onChange={(e) => updateForm('rentArrears', e.target.value)} 
                                        className="w-full bg-[#121212] border border-[#333333] rounded-xl p-3 pl-7 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all"
                                      />
                                    </div>
                                  </div>
                                )}

                                <div className="border-t border-[#333333] pt-6 mt-2">
                                  <div className="text-[#F5F5F5] font-medium italic text-lg mb-6">
                                    "Just so we have the full picture on the lease... how much are you currently holding for their security deposit, who is currently paying for the utilities, and is any of that rent being subsidized by Section 8?"
                                  </div>
                                  
                                  <div className="flex flex-col gap-6">
                                    <div>
                                      <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Security Deposit Held</label>
                                      <div className="relative max-w-xs">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                        <input 
                                          type="number" 
                                          placeholder="0" 
                                          value={formData.securityDeposit || ''} 
                                          onChange={(e) => updateForm('securityDeposit', e.target.value)} 
                                          className="w-full bg-[#121212] border border-[#333333] rounded-xl p-3 pl-7 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Utilities Payment</label>
                                      <div className="flex flex-wrap gap-2">
                                        {['Tenant Pays All', 'Landlord Pays Some', 'Landlord Pays All'].map(opt => (
                                          <button 
                                            key={opt} 
                                            onClick={() => updateForm('utilityStatus', formData.utilityStatus === opt ? '' : opt)} 
                                            className={clsx("", formData.utilityStatus === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                                          >
                                            {opt}
                                          </button>
                                        ))}
                                      </div>
                                      {(formData.utilityStatus === 'Landlord Pays Some' || formData.utilityStatus === 'Landlord Pays All') && (
                                        <div className="mt-3 animate-slideIn">
                                          <div className="relative max-w-xs">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                            <input 
                                              type="number" 
                                              placeholder="Landlord Cost / Mo" 
                                              value={formData.landlordUtilityCost || ''} 
                                              onChange={(e) => updateForm('landlordUtilityCost', e.target.value.replace(/[^0-9.]/g, ''))} 
                                              className="w-full bg-[#121212] border border-[#333333] rounded-xl p-3 pl-7 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <div>
                                      <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Section 8 / Subsidies</label>
                                      <div className="flex flex-wrap gap-2">
                                        {['No Section 8', 'Partial Section 8', 'Full Section 8'].map(opt => (
                                          <button 
                                            key={opt} 
                                            onClick={() => updateForm('section8Status', formData.section8Status === opt ? '' : opt)} 
                                            className={clsx("", formData.section8Status === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                                          >
                                            {opt}
                                          </button>
                                        ))}
                                      </div>
                                      {(formData.section8Status === 'Partial Section 8' || formData.section8Status === 'Full Section 8') && (
                                        <div className="mt-3 animate-slideIn">
                                          <div className="relative max-w-xs">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                            <input 
                                              type="number" 
                                              placeholder="Section 8 Coverage / Mo" 
                                              value={formData.section8Coverage || ''} 
                                              onChange={(e) => updateForm('section8Coverage', e.target.value.replace(/[^0-9.]/g, ''))} 
                                              className="w-full bg-[#121212] border border-[#333333] rounded-xl p-3 pl-7 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                  </div>
              </>
            )}

              </>
            )}
            {formData.propertyType === 'Land' && (
               <div className="flex flex-col mb-2 animate-slideIn">
                  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
                    <span className="font-bold">
                      "Understood. Do you happen to know the exact acreage or lot size? And are there any existing utilities pulled to the property, like water or power?"
                    </span>
                  </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Lot Size / Acreage</label>
                        <div className="flex bg-[#1A1A1A] border border-[#333333] rounded-xl p-1 w-max mb-3">
                          <button className={clsx("px-4 py-2 text-xs font-bold rounded-lg transition-all", formData.landSizeMeasure === 'SQFT' ? "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] shadow-md" : "text-[#A0A0A0] hover:text-[#F5F5F5]")} onClick={() => updateForm('landSizeMeasure', 'SQFT')}>SQFT</button>
                          <button className={clsx("px-4 py-2 text-xs font-bold rounded-lg transition-all", formData.landSizeMeasure === 'ACRES' ? "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] shadow-md" : "text-[#A0A0A0] hover:text-[#F5F5F5]")} onClick={() => updateForm('landSizeMeasure', 'ACRES')}>ACRES</button>
                        </div>
                        <input 
                          type="number" 
                          value={formData.landSize || ''} 
                          onChange={e => updateForm('landSize', e.target.value)} 
                          className="w-full bg-[#050505]/80 text-[#F5F5F5] border border-[#222222] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/50 transition-all outline-none placeholder-[#444444]" 
                          placeholder={formData.landSizeMeasure === 'SQFT' ? "e.g. 43560" : "e.g. 1.5"}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Utilities Access</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {['City Water/Sewer', 'Well/Septic', 'No Utilities'].map(opt => (
                            <button 
                              key={opt} 
                              onClick={() => updateForm('landUtilities', formData.landUtilities === opt ? '' : opt)} 
                              className={clsx("px-4 py-2 font-black border-2 border-[#333333] shadow-md transition-transition-all duration-300 hover:-translate-y-0.5 text-xs ", formData.landUtilities === opt  ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Road Access</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {['Paved Road', 'Dirt Road', 'Landlocked / No Legal Access'].map(opt => (
                            <button 
                              key={opt} 
                              onClick={() => updateForm('landAccess', formData.landAccess === opt ? '' : opt)} 
                              className={clsx("px-4 py-2 font-black border-2 border-[#333333] shadow-md transition-transition-all duration-300 hover:-translate-y-0.5 text-xs ", formData.landAccess === opt  ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Topography</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {['Flat / Buildable', 'Sloped', 'Steep / Mountainous'].map(opt => (
                            <button 
                              key={opt} 
                              onClick={() => updateForm('landTopo', formData.landTopo === opt ? '' : opt)} 
                              className={clsx("px-4 py-2 font-black border-2 border-[#333333] shadow-md transition-transition-all duration-300 hover:-translate-y-0.5 text-xs ", formData.landTopo === opt  ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
               </div>
             )}

            {/* Property Dynamics Inputs */}
            {formData.propertyType === 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
                  <span className="font-bold">
                    {formData.mfBuildingConfig === '' && (
                      <span>"Okay, good to know. Since it is a multi-unit, how many units are we talking, and what does the bed/bath mix look like for each? ... And just so I can accurately picture the lot, is this all one single building, or are there multiple structures on the property?"</span>
                    )}
                    {formData.mfBuildingConfig === '1 Single Building' && formData.mfUnitCount === '' && (
                      <span>"Okay, easy enough. Since it's all under one roof, let's just break down the rent roll real quick so I can run my formulas. How many units total are inside the building?"</span>
                    )}
                    {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === '' && (
                      <span>"Got it, detached structures. From an underwriting standpoint, I have to account for multiple roofs and foundations. Were all these buildings built around the same time, or were they added on in different decades?"</span>
                    )}
                    {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'All Built Same Year' && formData.mfYearBuilt === '' && (
                      <span>"Got it. From an underwriting standpoint, I just have to account for the roofs and foundations. Since they were all built around the same time, what year were they constructed?"</span>
                    )}
                    {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'Different Ages/Styles' && formData.mfUnitCount === '' && (
                      <span>"Got it. Since they were built at different times, let's just make sure we track the age for each one as we go through the layout. Roughly how many units are we talking total across all the buildings?"</span>
                    )}
                    {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'All Built Same Year' && formData.mfYearBuilt !== '' && formData.mfUnitCount === '' && (
                      <span>"Makes sense. And how many units are we talking total across all the buildings?"</span>
                    )}
                    {formData.mfBuildingConfig === 'Main House + ADU/Conversion' && formData.mfAduOrigin === '' && (
                      <span>"Okay, a house with a separate unit. Before we get into the rents, I need to know how that second unit was set up for city zoning. Was that built from the ground up, or is it a garage or interior conversion?"</span>
                    )}
                    {formData.mfBuildingConfig === 'Main House + ADU/Conversion' && formData.mfAduOrigin !== '' && formData.mfAduLegality === '' && (
                    <span>"Got it. And do you know for a fact if the city permits were fully pulled and closed out for that, or was it done under the table?"</span>
                  )}
                  {formData.mfBuildingConfig === 'Main House + ADU/Conversion' && formData.mfAduLegality !== '' && formData.mfAduMetering === '' && (
                    <span>"I've got that noted. And for utilities, does the ADU have its own address and meters, or is everything shared with the main house?"</span>
                  )}
                  {formData.mfBuildingConfig === 'Main House + ADU/Conversion' && formData.mfAduMetering !== '' && formData.mfUnitCount !== '' && formData.mfUnitsData.some(u => !u.occupancy || (u.occupancy === 'Tenant Occupied' && (!u.leaseType || !u.paymentStatus || !u.rentAmount))) && (
                    <span>"Perfect. So looking at the Main House first, what is the bed and bath count on that one?"</span>
                  )}

                  {formData.mfBuildingConfig !== 'Main House + ADU/Conversion' && formData.mfUnitCount !== '' && formData.mfUnitsData.some(u => !u.occupancy || (u.occupancy === 'Tenant Occupied' && (!u.leaseType || !u.paymentStatus || !u.rentAmount))) && (
                    <span>"Makes sense. And just for my underwriting, what are the current rents looking like across the board? Let's break it down—for the first unit, what is the current rent, and are they on a month-to-month or a yearly lease?"</span>
                  )}
                  {formData.mfUnitCount !== '' && formData.mfUnitsData.every(u => u.occupancy && (u.occupancy !== 'Tenant Occupied' || (u.leaseType && u.paymentStatus && u.rentAmount))) && (
                    <span>"Perfect. Also, are the tenants paying their own utilities, or are you covering water and power?"</span>
                  )}
                  </span>
                </div>
                  
                  <div style={{ marginTop: '15px', background: 'transparent', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                    
                    <div className="mb-6">
                      <div className="text-sm text-gray-400 mb-2  tracking-widest font-medium">Building Configuration</div>
                      <div className="flex flex-wrap gap-3">
                        {['1 Single Building', 'Multiple Detached Buildings', 'Main House + ADU/Conversion'].map(config => (
                          <button key={config} 
                            className={`px-4 py-2 border-2 font-medium tracking-widest text-xs shadow-sm' : 'bg-[#1A1A1A]/80 border-white text-white'}`} 
                            onClick={() => {
                              setFormData({...formData, mfBuildingConfig: config, mfStructureConsistency: '', mfYearBuilt: '', mfAduOrigin: '', mfAduLegality: '', mfAduMetering: '', mfUnitCount: '', mfUnitsData: []});
                            }}>
                            {config}
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.mfBuildingConfig === 'Multiple Detached Buildings' && (
                      <div className="mb-6 animate-slideIn">
                        <div className="text-sm text-gray-400 mb-2  tracking-widest font-medium">Structure Consistency</div>
                        <div className="flex flex-wrap gap-3">
                          {['All Built Same Year', 'Different Ages/Styles'].map(opt => (
                            <button key={opt} 
                              className={`px-4 py-2 border-2 font-medium tracking-widest text-xs shadow-sm' : 'bg-[#1A1A1A]/80 border-white text-white'}`} 
                              onClick={() => setFormData({...formData, mfStructureConsistency: opt})}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'All Built Same Year' && (
                      <div className="mb-6 animate-slideIn">
                        <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Estimated Year Built</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 1985" 
                          value={formData.mfYearBuilt} 
                          onChange={e => updateForm('mfYearBuilt', e.target.value)} 
                          className="w-full bg-[#1A1A1A]/80 border-2 border-white rounded-lg p-3 text-white focus:border-white/50 focus:outline-none font-medium placeholder-gray-600" 
                        />
                      </div>
                    )}

                    {formData.mfBuildingConfig === 'Main House + ADU/Conversion' && (
                      <div className="mb-6 animate-slideIn flex flex-col gap-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-2  tracking-widest font-medium">ADU Origin</div>
                          <div className="flex flex-wrap gap-3">
                            {['Ground-Up Build', 'Garage Conversion', 'Interior Split/Cut'].map(opt => (
                              <button key={opt} 
                                className={`px-4 py-2 border-2 font-medium tracking-widest text-xs shadow-sm' : 'bg-[#1A1A1A]/80 border-white text-white'}`} 
                                onClick={() => setFormData({...formData, mfAduOrigin: opt})}>
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {formData.mfAduOrigin !== '' && (
                          <div className="animate-slideIn">
                            <div className="text-sm text-gray-400 mb-2  tracking-widest font-medium">City Permits / Legality</div>
                            <div className="flex flex-wrap gap-3">
                              {['Fully Permitted', 'Unpermitted / Unknown'].map(opt => (
                                <button key={opt} 
                                  className={`px-4 py-2 border-2 font-medium tracking-widest text-xs shadow-[2px_2px_0px_#fff]  hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfAduLegality === opt ? 'bg-[#1A1A1A] text-white border-[#D4AF37] shadow-[2px_2px_0px_#D4AF37]' : 'bg-[#1A1A1A]/80 border-white text-white'}`} 
                                  onClick={() => setFormData({...formData, mfAduLegality: opt})}>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {formData.mfAduLegality !== '' && (
                          <div className="animate-slideIn">
                            <div className="text-sm text-gray-400 mb-2  tracking-widest font-medium">Utility Metering</div>
                            <div className="flex flex-wrap gap-3">
                              {['Own Address & Meters', 'Shared with Main House'].map(opt => (
                                <button key={opt} 
                                  className={`px-4 py-2 border-2 font-medium tracking-widest text-xs shadow-sm' : 'bg-[#1A1A1A]/80 border-white text-white'}`} 
                                  onClick={() => {
                                    setFormData({...formData, mfAduMetering: opt, mfUnitCount: '2 Units', mfUnitsData: [
                                      {yearBuilt: '', layoutBeds: '', layoutBaths: '', condition: '', occupancy: '', leaseType: '', paymentStatus: '', rentAmount: ''},
                                      {yearBuilt: '', layoutBeds: '', layoutBaths: '', condition: '', occupancy: '', leaseType: '', paymentStatus: '', rentAmount: ''}
                                    ]});
                                  }}>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {((formData.mfBuildingConfig === '1 Single Building') || (formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency !== '')) && (
                      <div className="mb-6 animate-slideIn">
                        <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Total Units</label>
                        <input 
                          type="number" 
                          min="2" 
                          value={formData.mfUnitCount || ''} 
                          onChange={(e) => {
                            const count = parseInt(e.target.value);
                            if (!isNaN(count) && count > 0) {
                              setFormData({
                                ...formData, 
                                mfUnitCount: count, 
                                mfUnitsData: Array.from({length: count <= 4 ? count : 0}, () => ({yearBuilt: '', layoutBeds: '', layoutBaths: '', condition: '', occupancy: '', leaseType: '', paymentStatus: '', rentAmount: ''}))
                              });
                            } else {
                              setFormData({...formData, mfUnitCount: '', mfUnitsData: []});
                            }
                          }}
                          className="w-full bg-[#050505]/80 text-[#F5F5F5] border border-[#222222] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/50 transition-all outline-none placeholder-[#444444]"
                          placeholder="#"
                        />
                      </div>
                    )}

                    {formData.mfUnitCount > 4 && (
                      <div className="mb-6 animate-slideIn border border-[#333333] bg-[#1A1A1A] p-6 shadow-md">
                        <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
                          <span className="font-bold">
                            "Got it, so a fairly sizable operation. Just so I have a baseline for my underwriting, what does the total monthly gross rent look like right now, and roughly what is your current vacancy rate?"
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Total Monthly Gross Rent</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                              <input 
                                type="number" 
                                placeholder="e.g. 8500" 
                                value={formData.mfGrossRent || ''} 
                                onChange={e => updateForm('mfGrossRent', e.target.value)} 
                                className="w-full bg-[#050505]/80 text-[#F5F5F5] border border-[#222222] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/50 transition-all outline-none placeholder-[#444444]"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Current Vacancy Rate</label>
                            <div className="relative">
                              <input 
                                type="number" 
                                placeholder="e.g. 10" 
                                value={formData.mfVacancyRate || ''} 
                                onChange={e => updateForm('mfVacancyRate', e.target.value)} 
                                className="w-full bg-[#050505]/80 text-[#F5F5F5] border border-[#222222] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/50 transition-all outline-none placeholder-[#444444]"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.mfUnitCount <= 4 && formData.mfUnitsData.length > 0 && (
                      <div className="flex flex-col gap-4 mb-6">
                        {formData.mfUnitsData.map((unit, index) => (
                          <div key={index} className="bg-[#111] border-2 border-[#3b82f6] p-4 rounded-lg shadow-md">
                            <div className="text-[#00E5FF] font-medium  tracking-widest mb-3 border-b border-gray-700 pb-2">
                              {formData.mfBuildingConfig === 'Main House + ADU/Conversion' 
                                ? (index === 0 ? 'MAIN HOUSE' : 'ADU / GUEST HOUSE')
                                : `Unit ${String.fromCharCode(65 + index)}`
                              }
                            </div>
                            
                            {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'Different Ages/Styles' && (
                              <div className="mb-4">
                                <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Year Built</label>
                                <input 
                                  type="number" 
                                  placeholder="e.g. 1950" 
                                  value={unit.yearBuilt || ''} 
                                  onChange={e => {
                                    const newData = [...formData.mfUnitsData]; newData[index].yearBuilt = e.target.value; setFormData({...formData, mfUnitsData: newData});
                                  }} 
                                  className="w-full bg-[#1A1A1A]/80 border border-gray-600 rounded-lg p-2 text-white focus:border-[#3b82f6] focus:outline-none font-medium placeholder-gray-600 text-sm" 
                                />
                              </div>
                            )}

                            <div className="mb-4">
                              <div className="text-xs text-gray-400 mb-2  tracking-widest font-medium">Layout</div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {['Studio', '1 Bed', '2 Bed', '3+ Bed'].map(bed => (
                                  <button key={bed} className={`px-3 py-1.5 border font-bold text-xs ${unit.layoutBeds === bed ? 'bg-[#3b82f6] text-white border-[#3b82f6]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].layoutBeds = bed; setFormData({...formData, mfUnitsData: newData});
                                  }}>{bed}</button>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {['1 Bath', '1.5 Bath', '2+ Bath'].map(bath => (
                                  <button key={bath} className={`px-3 py-1.5 border font-bold text-xs ${unit.layoutBaths === bath ? 'bg-[#3b82f6] text-white border-[#3b82f6]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].layoutBaths = bath; setFormData({...formData, mfUnitsData: newData});
                                  }}>{bath}</button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <div className="text-xs text-gray-400 mb-2  tracking-widest font-medium">Condition</div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {['Turnkey / Updated', 'Dated / Livable', 'Needs Heavy Rehab'].map(cond => (
                                  <button key={cond} className={`px-3 py-1.5 border font-bold text-xs ${unit.condition === cond ? 'bg-[#1A1A1A] text-white border-[#D4AF37]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].condition = cond; setFormData({...formData, mfUnitsData: newData});
                                  }}>{cond}</button>
                                ))}
                              </div>
                            </div>

                            <div className="mb-2">
                              <div className="text-xs text-gray-400 mb-2  tracking-widest font-medium">Occupancy Status</div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {['Owner Occupied', 'Tenant Occupied', 'Vacant'].map(occ => (
                                  <button key={occ} className={`px-3 py-1.5 border font-bold text-xs ${unit.occupancy === occ ? 'bg-[#00E676] text-[#F5F5F5] border-[#00E676]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; 
                                    newData[index].occupancy = occ; 
                                    if(occ !== 'Tenant Occupied') {
                                      newData[index].leaseType = ''; newData[index].paymentStatus = ''; newData[index].rentAmount = '';
                                    }
                                    setFormData({...formData, mfUnitsData: newData});
                                  }}>{occ}</button>
                                ))}
                              </div>
                            </div>

                            {unit.occupancy === 'Tenant Occupied' && (
                              <div className="mt-4 p-3 bg-[#1A1A1A]/80 border border-gray-800 rounded flex flex-col gap-3">
                                <div>
                                  <div className="text-[10px] text-gray-500 mb-1  tracking-widest font-medium">Current Rent $</div>
                                  <input type="number" placeholder="e.g. 1500" value={unit.rentAmount} onChange={(e) => {
                                    const newData = [...formData.mfUnitsData]; newData[index].rentAmount = e.target.value; setFormData({...formData, mfUnitsData: newData});
                                  }} className="w-full p-2 bg-[#222] text-white border border-gray-600 font-medium text-sm focus:outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all" />
                                </div>
                                <div>
                                  <div className="text-[10px] text-gray-500 mb-1  tracking-widest font-medium">Lease Type</div>
                                  <div className="flex gap-2">
                                    {['MTM', 'Annual'].map(lt => (
                                      <button key={lt} className={`flex-1 py-1.5 border font-bold text-xs ${unit.leaseType === lt ? 'bg-[#1A1A1A] text-white border-[#D4AF37]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                        const newData = [...formData.mfUnitsData]; newData[index].leaseType = lt; setFormData({...formData, mfUnitsData: newData});
                                      }}>{lt}</button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[10px] text-gray-500 mb-1  tracking-widest font-medium">Payment Status</div>
                                  <div className="flex gap-2">
                                    {['On Time', 'Behind'].map(ps => (
                                      <button key={ps} className={`flex-1 py-1.5 border font-bold text-xs ${unit.paymentStatus === ps ? 'bg-[#1A1A1A] text-white border-[#D4AF37]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                        const newData = [...formData.mfUnitsData]; newData[index].paymentStatus = ps; setFormData({...formData, mfUnitsData: newData});
                                      }}>{ps}</button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    )}

                    {formData.mfUnitsData.length > 0 && formData.mfUnitsData.every(u => u.occupancy && (u.occupancy !== 'Tenant Occupied' || (u.leaseType && u.paymentStatus && u.rentAmount))) && (
                      <div className="mt-4 border-t border-gray-700 pt-4">
                        <div className="text-sm text-gray-400 mb-2  tracking-widest font-medium">Utility Metering</div>
                        <div className="flex flex-col gap-4 mb-4">
                          <button className={`px-4 py-3 border-2 font-bold tracking-widest text-sm shadow-sm' : 'bg-[#1A1A1A]/80 border-white text-white'}`} onClick={() => setFormData({...formData, mfUtilityMetering: 'Separately Metered (Tenant Pays All)', mfOwnerUtilities: [], mfUtilityCost: ''})}>Tenants Pay All</button>
                          <button className={`px-4 py-3 border-2 font-bold tracking-widest text-sm shadow-[2px_2px_0px_#fff] skew-x-[-2deg] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfUtilityMetering === 'Landlord Pays Some/All' ? 'bg-[#1A1A1A] text-[#F5F5F5] border-[#FFE600] shadow-[2px_2px_0px_#FFE600]' : 'bg-[#1A1A1A]/80 border-white text-white'}`} onClick={() => setFormData({...formData, mfUtilityMetering: 'Landlord Pays Some/All'})}>Landlord Pays Some/All</button>
                        </div>
                        
                        {formData.mfUtilityMetering === 'Landlord Pays Some/All' && (
                          <div className="mt-4 p-4 bg-[#1A1A1A]/80 border border-gray-800 rounded-lg">
                            <div className="text-xs text-gray-400 mb-2  tracking-widest font-medium">Which Utilities?</div>
                            <div className="flex flex-wrap gap-3 mb-4">
                              {['Water', 'Sewer', 'Trash', 'Gas', 'Electric', 'Landscaping'].map(util => (
                                <button key={util} 
                                  className={`px-4 py-1.5 border font-medium text-xs shadow-[2px_2px_0px_#fff]  ${formData.mfOwnerUtilities.includes(util) ? 'bg-[#1A1A1A] text-[#F5F5F5] border-[#FFE600] shadow-[2px_2px_0px_#FFE600]' : 'bg-[#1A1A1A]/80 border-gray-600 text-gray-300'} transition-all`} 
                                  onClick={() => {
                                    let newUtils = [...formData.mfOwnerUtilities];
                                    if (newUtils.includes(util)) {
                                      newUtils = newUtils.filter(u => u !== util);
                                    } else {
                                      newUtils.push(util);
                                    }
                                    setFormData({...formData, mfOwnerUtilities: newUtils});
                                  }}>
                                  {util}
                                </button>
                              ))}
                            </div>
                            <div>
                              <div className="text-[10px] text-gray-500 mb-1  tracking-widest font-medium">Est. Monthly Utility Cost $</div>
                              <input type="number" placeholder="e.g. 350" value={formData.mfUtilityCost} onChange={(e) => setFormData({...formData, mfUtilityCost: e.target.value})} className="w-full p-3 bg-[#222] text-white border-2 border-gray-600 font-medium text-sm focus:outline-none focus:border-[#FFE600] transition-all skew-x-[-2deg]" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
            )}
            
{formData.propertyType === 'Condo/Townhome' && (
              <div className="p-4 bg-[#1A1A1A] border border-[#333333] rounded-xl animate-slideIn">
                <p className="text-sm text-[#F5F5F5] mb-2">"Condos are great. Usually, the biggest hurdle for us are the HOA rules. What's the name of the HOA, what's the monthly fee, and do they have any rental restrictions?"</p>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="HOA Name..." value={formData.hoaName} onChange={e => updateForm('hoaName', e.target.value)} className="flex-1 bg-[#1A1A1A] border border-[#333333] rounded-lg p-2 text-[#F5F5F5] outline-none" />
                  <input type="text" placeholder="HOA Fee / Mo ($)..." value={formData.hoaFee} onChange={e => updateForm('hoaFee', e.target.value)} className="flex-1 bg-[#1A1A1A] border border-[#333333] rounded-lg p-2 text-[#F5F5F5] outline-none" />
                </div>
                <input type="text" placeholder="Any Rental Restrictions?" value={formData.hoaRestrictions} onChange={e => updateForm('hoaRestrictions', e.target.value)} className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg p-2 text-[#F5F5F5] outline-none" />
              </div>
            )}

            {formData.propertyType === 'Mobile Home' && (
              <div className="p-4 bg-[#1A1A1A] border border-[#333333] rounded-xl animate-slideIn">
                <p className="text-sm text-[#F5F5F5] mb-2">"Mobile homes are great. Is it located inside a park, and if so, what's the space rent?"</p>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="Park Name / Location..." value={formData.mhParkName} onChange={e => updateForm('mhParkName', e.target.value)} className="flex-1 bg-[#1A1A1A] border border-[#333333] rounded-lg p-2 text-[#F5F5F5] outline-none" />
                  <input type="text" placeholder="Space Rent / Fee ($)..." value={formData.mhParkFee} onChange={e => updateForm('mhParkFee', e.target.value)} className="flex-1 bg-[#1A1A1A] border border-[#333333] rounded-lg p-2 text-[#F5F5F5] outline-none" />
                </div>
                <div className="flex gap-2">
                  <button className={clsx("", formData.mh55Plus ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")} onClick={() => updateForm('mh55Plus', !formData.mh55Plus)}>55+ Community</button>
                  <button className={clsx("", formData.mh433A ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")} onClick={() => updateForm('mh433A', !formData.mh433A)}>433A (Perm Foundation)</button>
                </div>
              </div>
            )}

            {formData.propertyType === 'Land' && (
              <div className="p-4 bg-[#1A1A1A] border border-[#333333] rounded-xl animate-slideIn">
                <p className="text-sm text-[#F5F5F5] mb-2">"Gotcha. For vacant land, the most important things we look at are utilities and zoning. Do you know what it's currently zoned for, and does it have city water and sewer?"</p>
                <input type="text" placeholder="Current Zoning (e.g. R1, Ag)..." value={formData.landZoning} onChange={e => updateForm('landZoning', e.target.value)} className="w-full bg-[#1A1A1A]/30 backdrop-blur-md backdrop-blur-md border-2 border-white/50 rounded-lg p-2 text-white outline-none mb-2 placeholder-gray-400" />
                <div className="flex gap-2 mb-2 flex-wrap">
                  {['Water', 'Sewer', 'Electric', 'Well/Septic'].map(util => {
                    const isSelected = formData.landUtilities?.includes(util);
                    return (
                      <button key={util} className={clsx("", isSelected ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")} onClick={() => {
                        const current = formData.landUtilities || [];
                        updateForm('landUtilities', isSelected ? current.filter(u => u !== util) : [...current, util]);
                      }}>{util}</button>
                    )

                  })}
                </div>
                <div className="flex gap-2">
                  <button className={clsx("", formData.landPaved === true ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")} onClick={() => handleSingleSelect('landPaved', true)}>Paved Access</button>
                  <button className={clsx("", formData.landPaved === false ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")} onClick={() => handleSingleSelect('landPaved', false)}>Dirt Road Access</button>
                </div>
              </div>
            )}



            {/* Dynamic Follow-up: Vacant */}
            {isVacant && formData.propertyType !== 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
                  "Okay, since it's vacant, how long has it been sitting empty? Have you had any issues with squatters or break-ins that we should know about?"
                </div>
                  
                <div style={{ marginTop: '15px', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '12px' }}>
                  <input type="text" placeholder="How long vacant? (e.g., 6 months)..." value={formData.vacantLength} onChange={(e) => setFormData({...formData, vacantLength: e.target.value})} className="modern-input" style={{ width: '100%', marginBottom: '10px' }} />
                  <div className="toggles-row">
                    <button className={`toggle-pill ${formData.vacantIssues.includes('Boarded Up') ? 'active' : ''}`} onClick={() => handleToggle('vacantIssues', 'Boarded Up')}>Boarded Up</button>
                    <button className={clsx("", formData.vacantIssues.includes('Squatters') ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")} onClick={() => handleToggle('vacantIssues', 'Squatters')}>Squatters</button>
                    <button className={clsx("", formData.vacantIssues.includes('Vandalism') ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")} onClick={() => handleToggle('vacantIssues', 'Vandalism')}>Vandalized</button>
                  </div>
                </div>
              </div>
            )}



            {/* Dynamic Condition Bridges */}
            
            
            {isTenant && formData.tenantStatus.includes('Paying on Time') && formData.leaseType === 'M2M' && !formData.tenantStatus.includes('Eviction Needed') && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2.5rem', animation: 'slideInUp 0.3s ease' }}>
  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
    "Okay, month-to-month and paying on time. We could probably just inherit them as tenants. With that in mind, what's the actual condition of the property?"
  </div>
</div>
            )}

            {isVacant && formData.propertyType !== 'Multi-Family' && (formData.vacantIssues.includes('Squatters') || formData.vacantIssues.includes('Boarded Up') || formData.vacantIssues.includes('Vandalism')) && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2.5rem', animation: 'slideInUp 0.3s ease' }}>
  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
    "Wow, sorry you're dealing with that. We buy properties with those issues all the time so we can definitely take that burden off your hands. Since we can't always get inside right away, what do you remember about the major stuff?"
  </div>
</div>
            )}

            {/* Core Condition Questions */}
            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: ((isTenant && formData.tenantStatus.length > 0) || (isVacant && formData.vacantIssues.length > 0)) ? '1.5rem' : '2.5rem' }}>
  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
    
    <div className="text-[#F5F5F5] text-[#E2E8F0] font-medium text-lg leading-relaxed font-medium mb-4">
      "Got it. Now, to make sure my repair estimates are accurate, let's start with the roof—roughly how many years old is it, and is it holding up alright or needing some major patchwork?"
    </div>
    
    {formData.propertyType !== 'Multi-Family' && (
      <div className="mb-8">
        <div className="mb-4">
          <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Roof Age</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {['0-5 Years', '5-10 Years', '10-15 Years', '15+ Years'].map(age => (
              <button key={age} onClick={() => updateForm('roofAge', formData.roofAge === age ? '' : age)} className={clsx("", formData.roofAge === age ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{age}</button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Roof Condition</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {[{label: 'Roof: Good ($0/sqft)', mult: 0}, {label: 'Roof: Needs Overlay ($4/sqft)', mult: 4}, {label: 'Roof: Full Tear-Off ($8/sqft)', mult: 8}].map(opt => (
              <button key={opt.label} onClick={() => { if (formData.sfRoof === opt.label) { updateForm('sfRoof', ''); updateForm('roofMult', 0); } else { updateForm('sfRoof', opt.label); updateForm('roofMult', opt.mult); } }} className={clsx("", formData.sfRoof === opt.label ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt.label}</button>
            ))}
          </div>
        </div>
      </div>
    )}

    <div className="mt-8 pt-6 border-t-2 border-gray-300 text-xl font-black italic text-[#F5F5F5] leading-relaxed mb-6">
      "Okay, makes sense. And what about the HVAC system? Do you know about what year the AC was installed, and is it running perfectly as-is?"
    </div>
    
    {formData.propertyType !== 'Multi-Family' && (
      <div>
        <div className="mb-4">
          <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">HVAC Age</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {['0-5 Years', '5-10 Years', '10-15 Years', '15+ Years'].map(age => (
              <button key={age} onClick={() => updateForm('hvacAge', formData.hvacAge === age ? '' : age)} className={clsx("", formData.hvacAge === age ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{age}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">HVAC Status</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {[{label: 'AC: Good ($0/sqft)', mult: 0}, {label: 'AC: Condenser Unit Only ($6.5k)', mult: 0}, {label: 'AC: Full System + Ducts ($7/SQFT)', mult: 0}].map(opt => (
              <button key={opt.label} onClick={() => { if (formData.sfHVAC === opt.label) { updateForm('sfHVAC', ''); updateForm('hvacMult', 0); } else { updateForm('sfHVAC', opt.label); updateForm('hvacMult', opt.mult); } }} className={clsx("", formData.sfHVAC === opt.label ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt.label}</button>
            ))}
          </div>
        </div>
      </div>
    )}

  </div>
</div>
            
            {/* Toggles moved to sidebar */}

            {/* Dynamic Reaction 1 */}
            {showedRoofHVACReaction && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ animation: 'slideInUp 0.3s ease forwards' }}>
  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
    "Got it. Don't worry too much about that, we deal with replacing those all the time."
  </div>
</div>
            )}

            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
    <div className="text-[#F5F5F5] font-black italic text-lg mb-8">
      "Okay, and for the plumbing, is that original or have you ever had to repipe the house?"
    </div>

    {formData.propertyType !== 'Multi-Family' && (
      <div className="mb-6">
        <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Plumbing Age</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {['0-5 Years', '5-15 Years', '15-30 Years', 'Original / 30+'].map(opt => (
            <button key={opt} onClick={() => updateForm('plumbingAge', formData.plumbingAge === opt ? '' : opt)} className={clsx("", formData.plumbingAge === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt}</button>
          ))}
        </div>

        <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Plumbing Condition</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {[{label: 'Copper/PEX ($0/sqft)', mult: 0}, {label: 'Minor Leaks / Patch ($2/sqft)', mult: 2}, {label: 'Needs Full Repipe ($5/sqft)', mult: 5}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfPlumbing === opt.label) { updateForm('sfPlumbing', ''); updateForm('plumbingMult', 0); } else { updateForm('sfPlumbing', opt.label); updateForm('plumbingMult', opt.mult); } }} className={clsx("", formData.sfPlumbing === opt.label ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt.label}</button>
          ))}
        </div>

        <div className="text-[#F5F5F5] font-medium italic text-md mt-6 mb-2">
          "While we're talking about the plumbing, do you happen to know if the water heater is relatively new, or is it getting up there in age?"
        </div>
        <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Water Heater</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {[{label: '0-5 YEARS / GOOD ($0)', flatAdd: 0}, {label: '5-10 YEARS / AGING ($1,000)', flatAdd: 1000}, {label: '10+ YEARS / DEAD ($2,000)', flatAdd: 2000}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfWaterHeater === opt.label) { updateForm('sfWaterHeater', ''); updateForm('waterHeaterMult', 0); } else { updateForm('sfWaterHeater', opt.label); updateForm('waterHeaterMult', opt.flatAdd); } }} className={clsx("", formData.sfWaterHeater === opt.label ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt.label}</button>
          ))}
        </div>
      </div>
    )}

    <div className="border-t-2 border-gray-300 pt-6 mt-6">
      <div className="text-[#F5F5F5] font-black italic text-lg mb-8">
        "Got it. And what about the electrical system? Is that still original or have you ever had to update the panel or the wiring throughout the house?"
      </div>
    </div>

    {formData.propertyType !== 'Multi-Family' && (
      <div>
        <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Electrical Age</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {['0-5 Years', '5-15 Years', '15-30 Years', 'Original / 30+'].map(opt => (
            <button key={opt} onClick={() => updateForm('electricalAge', formData.electricalAge === opt ? '' : opt)} className={clsx("", formData.electricalAge === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt}</button>
          ))}
        </div>

        <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Electrical Condition</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {[{label: 'Updated System ($0/sqft)', mult: 0}, {label: 'Panel Upgrade Needed ($3k)', mult: 0}, {label: 'Needs Full Rewire ($5/SQFT + Panel)', mult: 0}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfElectrical === opt.label) { updateForm('sfElectrical', ''); updateForm('electricalMult', 0); } else { updateForm('sfElectrical', opt.label); updateForm('electricalMult', opt.mult); } }} className={clsx("", formData.sfElectrical === opt.label ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt.label}</button>
          ))}
        </div>
      </div>
    )}
  </div>
</div>

            {/* Toggles moved to sidebar */}

            {/* Dynamic Reaction 2 */}
            {showedPlumbingReaction && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ animation: 'slideInUp 0.3s ease forwards' }}>
  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
    "Okay, yeah, we usually end up having to repipe and rewire those older setups anyway, so that's not a deal breaker."
  </div>
</div>
            )}

            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
              <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
                
                <div className="text-[#F5F5F5] font-black italic text-lg mb-8">
                  "Is the property on city sewer or are they on a septic system?"
                </div>
              
                <div className="mb-6">
                  <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Sewer / Septic</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {['City Sewer', 'Septic System'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => updateForm('septicSewer', formData.septicSewer === opt ? '' : opt)} 
                        className={clsx("", formData.septicSewer === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {formData.septicSewer === 'Septic System' && (
                    <div className="mt-4 mb-4">
                      <div className="text-[#F5F5F5] font-medium italic text-md mt-4 mb-2">
                        "And do you know roughly when the last time it was pumped or inspected was?"
                      </div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Recently Pumped', 'Aging (5+ Years)', 'Unknown / Never Pumped'].map(opt => (
                          <button key={opt} onClick={() => updateForm('septicCondition', formData.septicCondition === opt ? '' : opt)} className={clsx("", formData.septicCondition === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t-2 border-gray-300 pt-6 mt-6">
                    <div className="text-[#F5F5F5] font-black italic text-lg mb-8 flex items-center gap-2">
                      <span>"Also, are there any solar panels on the roof?"</span>
                      <div className="relative group inline-block">
                        <button className="text-[10px] bg-[#1A1A1A]/80 text-[#FFFF00] px-2 py-0.5 rounded font-black  shadow-[2px_2px_0px_#FFFF00] hover:-translate-y-0.5 transition-transform">
                          [?] LEASE VS PPA
                        </button>
                        <div className="absolute left-0 bottom-full mb-2 w-72 bg-[#1A1A1A] border-2 border-[#333333] p-3 text-xs text-[#F5F5F5] font-normal not-italic shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          Quick Explainer: A standard LEASE is a fixed monthly payment to rent the equipment. A PPA (Power Purchase Agreement) means the homeowner buys the actual power the panels produce at a set rate, meaning their bill fluctuates depending on the season.
                        </div>
                      </div>
                    </div>
                  </div>

                  <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Solar panels</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {['No Solar', 'Solar (Owned)', 'Solar (Lease)', 'Solar (PPA)'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => updateForm('solarSystem', formData.solarSystem === opt ? '' : opt)} 
                        className={clsx("", formData.solarSystem === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  
                  {(formData.solarSystem && formData.solarSystem !== 'No Solar') && (
                    <div className="mb-4">
                      <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Solar Age</label>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Brand New (0-5 Yrs)', 'Mid-Life (5-15 Yrs)', 'Older (15+ Yrs)'].map(opt => (
                          <button key={opt} onClick={() => updateForm('solarAge', formData.solarAge === opt ? '' : opt)} className={clsx("", formData.solarAge === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(formData.solarSystem === 'Solar (Lease)' || formData.solarSystem === 'Solar (PPA)') && (
                    <div className="mt-4">
                      <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Solar Lease Details</label>
                      <div className="grid grid-cols-2 gap-6 mt-4">
                        <input type="text" value={formData.solarCompany || ''} onChange={(e) => updateForm('solarCompany', e.target.value)} placeholder="SOLAR COMPANY NAME" className="w-full bg-[#050505]/80 text-[#F5F5F5] border border-[#222222] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/50 transition-all outline-none placeholder-[#444444]" />
                        <input type="text" value={formData.solarMonthlyPayment || ''} onChange={(e) => updateForm('solarMonthlyPayment', e.target.value.replace(/[^0-9]/g, ''))} placeholder="MONTHLY PAYMENT $" className="w-full bg-[#050505]/80 text-[#F5F5F5] border border-[#222222] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/50 transition-all outline-none placeholder-[#444444]" />
                        <input type="text" value={formData.solarPayoffAmount || ''} onChange={(e) => updateForm('solarPayoffAmount', e.target.value.replace(/[^0-9]/g, ''))} placeholder="TOTAL PAYOFF BALANCE $" className="w-full bg-[#050505]/80 text-[#F5F5F5] border border-[#222222] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/50 transition-all outline-none placeholder-[#444444]" />
                      </div>

                      <div className="text-[#F5F5F5] font-medium italic text-sm mt-4 mb-2 flex items-center gap-2">
                        <span>"Is the contract assumable by a new buyer?"</span>
                        <div className="relative group inline-block">
                          <button className="text-[10px] bg-[#1A1A1A]/80 text-[#FFFF00] px-2 py-0.5 rounded font-black  shadow-[2px_2px_0px_#FFFF00] hover:-translate-y-0.5 transition-transform">
                            [?] Explain Assumable
                          </button>
                          <div className="absolute left-0 bottom-full mb-2 w-64 bg-[#1A1A1A] border-2 border-[#333333] p-3 text-xs text-[#F5F5F5] not-italic font-normal shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            ASSUMABLE: The new buyer takes over the monthly payments. <br/><br/>
                            MUST PAYOFF: The seller must pay off the entire remaining balance at closing from their proceeds.
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Yes (Assumable)', 'No (Must Payoff)', 'Unknown'].map(opt => (
                          <button key={opt} onClick={() => updateForm('solarAssumable', formData.solarAssumable === opt ? '' : opt)} className={clsx("", formData.solarAssumable === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col mb-2 animate-slideIn">
                <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
      <div className="text-[#F5F5F5] text-[#E2E8F0] font-medium text-lg leading-relaxed font-medium mb-4">
      {formData.propertyType === 'Multi-Family' ? 
                    "Got it. And as far as the inside of the units go... are the kitchens and bathrooms fairly modern across the board, or are they a bit more dated and in need of some work?" :
                   formData.cosmeticsKitchen.length > 0 && formData.cosmeticsBaths.length > 0 ? "You already gave me a good idea of the kitchen and bath conditions..." :
                   hasMajorRepairs
                    ? "Makes sense. It sounds like the house just needs some TLC, which is totally fine—that's what we do. As for the inside, have you updated the kitchens or the bathrooms, or are those mostly original?"
                    : "So it sounds like the bones of the house are pretty solid... as far as the inside goes, if I walked through the front door today, are the kitchens and bathrooms fairly modern, or a bit more dated?"
                  }
      </div>
  
  {formData.propertyType !== 'Multi-Family' && (
      <div className="mb-6 animate-slideIn">
        <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Kitchen Condition</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {[{label: 'Turnkey / Clean'}, {label: 'Dated / Livable'}, {label: 'Needs Heavy Rehab'}].map(opt => (
              <button key={`k-${opt.label}`} onClick={() => { updateForm('cosmeticsKitchen', opt.label); }} className={clsx("", formData.cosmeticsKitchen === opt.label ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt.label}</button>
            ))}
          </div>
          
          {(() => {
            const bathsCount = Math.ceil(parseFloat(String(formData.baths || '1').replace(/[^0-9.]/g, '')) || 1);
            const bathData = formData.cosmeticsBathsData || {};
            
            return Array.from({length: bathsCount}).map((_, i) => (
              <div key={`bath-${i}`} className="mb-4 animate-slideIn">
                <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Bath {i + 1} Condition</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {[{label: 'Turnkey / Clean'}, {label: 'Dated / Livable'}, {label: 'Needs Heavy Rehab'}].map(opt => (
                    <button key={`b-${i}-${opt.label}`} onClick={() => { 
                      const newData = {...bathData, [i]: opt.label};
                      updateForm('cosmeticsBathsData', newData); 
                    }} className={clsx("", bathData[i] === opt.label ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt.label}</button>
                  ))}
                </div>
              </div>
            ));
          })()}

          <div className="mt-6 border-t border-[#333333] pt-6">
            <div className="text-[#F5F5F5] font-black italic text-lg mb-4">
              "And what about the outside of the house? Does the stucco and paint look pretty good, and are the windows the original single-pane or have they been updated?"
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Exterior / Stucco Condition</label>
                <div className="flex flex-col gap-2">
                  {['Good / Minor Wear', 'Needs Paint / Stucco Patch', 'Heavy Dry Rot / Siding Replacement'].map(opt => (
                    <button 
                      key={opt} 
                      onClick={() => updateForm('exteriorCondition', formData.exteriorCondition === opt ? '' : opt)}
                      className={clsx("text-left", formData.exteriorCondition === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Windows</label>
                <div className="flex flex-col gap-2">
                  {['Original Single-Pane', 'Updated Dual-Pane', 'Mixed / Partial Update'].map(opt => (
                    <button 
                      key={opt} 
                      onClick={() => updateForm('windowCondition', formData.windowCondition === opt ? '' : opt)}
                      className={clsx("text-left", formData.windowCondition === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
  </div>
</div>
  
              {/* Toggles moved to sidebar */}
  
              {/* Dynamic Reaction 3 */}
              {(formData.cosmeticsKitchen.includes('Heavy Rehab') || Object.values(formData.cosmeticsBathsData || {}).some(v => typeof v === 'string' && v.includes('Heavy Rehab'))) && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ animation: 'slideInUp 0.3s ease forwards' }}>
  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
    "Gotcha. Sounds like it needs some pretty heavy cosmetic love. That's right up our alley."
  </div>
</div>
            )}

        {formData.propertyType !== 'Multi-Family' && (
                <div className="flex flex-col mb-2 animate-slideIn">
                  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
                    "Perfect. And just for my own records as I'm writing this up, is there a pool in the backyard, and is the property part of an active HOA?"
                  </div>

                  <div className="flex flex-col gap-6">
                    <div>
                      <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Pool</label>
                      <div className="flex flex-wrap gap-3">
                        {['Has Pool', 'No Pool'].map(opt => (
                          <button key={opt} onClick={() => updateForm('amenityPool', opt)} className={clsx("", formData.amenityPool === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>
                      {formData.amenityPool === 'Has Pool' && (
                        <div className="mt-3 p-4 bg-[#121212] border border-[#333333] rounded-xl animate-slideIn">
                          <div className="text-sm text-[#F5F5F5] mb-3 italic">"Is the pool currently full and functioning, or is it empty/green?"</div>
                          <div className="flex flex-wrap gap-2">
                            {['Clean & Functioning', 'Needs Plaster/Equipment', 'Empty / Green (Requires Demo)'].map(cond => (
                              <button 
                                key={cond} 
                                onClick={() => updateForm('poolCondition', formData.poolCondition === cond ? '' : cond)}
                                className={clsx("text-xs font-bold", formData.poolCondition === cond ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "px-4 py-2 bg-[#1A1A1A] text-[#A0A0A0] border border-[#333333] hover:border-[#D4AF37]/50")}
                              >
                                {cond}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">HOA Status</label>
                      <div className="flex flex-wrap gap-3">
                        {['Active HOA', 'No HOA'].map(opt => (
                          <button key={opt} onClick={() => updateForm('amenityHOA', opt)} className={clsx("", formData.amenityHOA === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>
                      {formData.amenityHOA === 'Active HOA' && (
                        <div className="mt-3 p-4 bg-[#121212] border border-[#333333] rounded-xl animate-slideIn">
                          <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">HOA Monthly Fee $</label>
                          <input 
                            type="number" 
                            placeholder="e.g. 250" 
                            value={formData.hoaMonthlyFee || ''} 
                            onChange={e => updateForm('hoaMonthlyFee', e.target.value)} 
                            className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg p-3 text-[#F5F5F5] focus:outline-none focus:border-[#E5C158] transition-all" 
                          />
                          <div className="mt-3">
                            <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Any Rental Restrictions?</label>
                            <div className="flex flex-wrap gap-2">
                              {['None', 'No Short-Term (AirBnb)', 'No Rentals Allowed', 'Unknown'].map(res => (
                                <button 
                                  key={res} 
                                  onClick={() => updateForm('hoaRentalRestrictions', formData.hoaRentalRestrictions === res ? '' : res)}
                                  className={clsx("text-xs font-bold", formData.hoaRentalRestrictions === res ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "px-4 py-2 bg-[#1A1A1A] text-[#A0A0A0] border border-[#333333] hover:border-[#D4AF37]/50")}
                                >
                                  {res}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">RV Parking / Hookups</label>
                      <div className="flex flex-wrap gap-3">
                        {['Has RV Parking', 'No RV Parking'].map(opt => (
                          <button key={opt} onClick={() => updateForm('amenityRV', opt)} className={clsx("", formData.amenityRV === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Guest House / Casita</label>
                      <div className="flex flex-wrap gap-3">
                        {['Has Guest House', 'No Guest House'].map(opt => (
                          <button key={opt} onClick={() => updateForm('amenityGuestHouse', opt)} className={clsx("", formData.amenityGuestHouse === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>
                      {formData.amenityGuestHouse === 'Has Guest House' && (
                        <div className="mt-3 p-4 bg-[#121212] border border-[#333333] rounded-xl animate-slideIn">
                          <div className="flex flex-wrap gap-2">
                            {['Permitted ADU', 'Unpermitted Conversion', 'Detached Studio/Shed'].map(type => (
                              <button 
                                key={type} 
                                onClick={() => updateForm('guestHouseType', formData.guestHouseType === type ? '' : type)}
                                className={clsx("text-xs font-bold", formData.guestHouseType === type ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "px-4 py-2 bg-[#1A1A1A] text-[#A0A0A0] border border-[#333333] hover:border-[#D4AF37]/50")}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
    <div className="text-[#F5F5F5] text-[#E2E8F0] font-medium text-lg leading-relaxed font-medium mb-4">
    "Okay, that gives me a great picture of the inside. Last thing before we talk numbers—just to check my standard boxes, have you guys noticed any settling with the foundation, or are there any unpermitted add-ons we'd need to factor in?"
    </div>

  {formData.propertyType !== 'Multi-Family' && (
    <div className="mb-6 animate-slideIn">
      <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Structural Red Flags / Unpermitted Work</label>
      
              <div className="mb-6">
                <label className="block text-[#888888] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">MAJOR RED FLAGS (Select all that apply)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {['Foundation / Structural Issues', 'Unpermitted Additions / ADU', 'Fire Damage', 'Water Damage / Mold', 'City Code Violations / Red Tags', 'Known Liens / Judgments'].map(flag => {
                    const isSelected = formData.majorRedFlags?.includes(flag);
                    return (
                      <button 
                        key={flag}
                        onClick={() => {
                          const current = formData.majorRedFlags || [];
                          const nextFlags = isSelected ? current.filter(f => f !== flag) : [...current, flag];
                          setFormData(prev => {
                            let updates = { majorRedFlags: nextFlags };
                            if (isSelected) {
                              if (flag === 'Foundation / Structural Issues') {
                                updates.redFlagFoundation = '';
                                updates.redFlagFoundationDetails = '';
                              } else if (flag === 'Unpermitted Additions / ADU') {
                                updates.redFlagADUDesc = '';
                                updates.redFlagADUSqft = '';
                                updates.redFlagADUType = '';
                              } else if (flag === 'Fire Damage') {
                                updates.redFlagFire = '';
                                updates.redFlagFireDetails = '';
                              } else if (flag === 'Water / Flood Damage') {
                                updates.redFlagWater = '';
                                updates.redFlagWaterStatus = '';
                              } else if (flag === 'City / Code Violations') {
                                updates.redFlagFines = '';
                                updates.redFlagFinesStatus = '';
                              } else if (flag === 'Tax / Mechanic Liens') {
                                updates.redFlagLienType = '';
                                updates.redFlagLienAmount = '';
                              }
                            }
                            return { ...prev, ...updates };
                          });
                        }} 
                        className={clsx("", isSelected ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                      >
                        {flag}
                      </button>
                    )
                  })}
                </div>

                <div className="flex flex-col gap-4 mt-6">
                  {formData.majorRedFlags?.includes('Foundation / Structural Issues') && (
                    <div className="bg-[#1A1A1A] border border-[#333333] p-5 rounded-xl mb-5">
                      <div className="text-[#F5F5F5] font-black italic mb-8">"You mentioned the foundation—are we talking about standard hairline cracks, or has there been major sinking and shifting?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Minor Settling / Cracks', 'Major Sinking / Shifting'].map(opt => (
                          <button key={opt} onClick={() => updateForm('redFlagFoundation', opt)} className={clsx("", formData.redFlagFoundation === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>

                      {formData.redFlagFoundation === 'Minor Settling / Cracks' && (
                        <div className="mt-4 animate-slideIn">
                          <div className="text-[#F5F5F5] font-black italic mb-8 text-sm">"Got it, so just typical hairline cracks, nothing the city has ever been involved with or required underpinning for?"</div>
                          <div className="flex flex-wrap gap-3 mb-4">
                            {['Typical Settling (No Action)', 'Previously Repaired/Underpinned'].map(opt => (
                              <button key={opt} onClick={() => updateForm('redFlagFoundationDetails', opt)} className={clsx("", formData.redFlagFoundationDetails === opt ? "bg-[#FFFF00] border-2 border-[#333333] text-[#F5F5F5] font-black text-xs  px-3 py-1 cursor-pointer" : "bg-[#1A1A1A] border-2 border-[#333333] text-gray-600 font-bold text-xs  px-3 py-1 cursor-pointer")}>{opt}</button>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.redFlagFoundation === 'Major Sinking / Shifting' && (
                        <div className="mt-4 animate-slideIn">
                          <div className="text-[#F5F5F5] font-black italic mb-8 text-sm">"Since it's major shifting, has a structural engineer looked at it, or is the floor visibly slanting?"</div>
                          <div className="flex flex-wrap gap-3 mb-4">
                            {['Engineer Report Available', 'Visible Slant / Unassessed'].map(opt => (
                              <button key={opt} onClick={() => updateForm('redFlagFoundationDetails', opt)} className={clsx("", formData.redFlagFoundationDetails === opt ? "bg-[#FFFF00] border-2 border-[#333333] text-[#F5F5F5] font-black text-xs  px-3 py-1 cursor-pointer" : "bg-[#1A1A1A] border-2 border-[#333333] text-gray-600 font-bold text-xs  px-3 py-1 cursor-pointer")}>{opt}</button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Unpermitted Additions / ADU') && (
                    <div className="bg-[#1A1A1A] border border-[#333333] p-5 rounded-xl mb-5">
                      <div className="text-[#F5F5F5] font-black italic mb-8">"For that unpermitted space, what exactly was added, and roughly how many square feet is it?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Garage Conversion', 'Room Addition', 'Full ADU / Casita', 'Enclosed Patio'].map(opt => {
                          const isSelected = formData.unpermittedTypes?.includes(opt);
                          return (
                            <button 
                              key={opt} 
                              onClick={() => {
                                const current = formData.unpermittedTypes || [];
                                updateForm('unpermittedTypes', isSelected ? current.filter(x => x !== opt) : [...current, opt]);
                              }} 
                              className={clsx("", isSelected ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                      <div className="flex flex-col gap-3">
                        <input type="number" placeholder="EST. SQFT ADDED" value={formData.redFlagADUSqft || ''} onChange={(e) => updateForm('redFlagADUSqft', e.target.value)} className="w-full max-w-sm bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] outline-none focus:border-[#E5C158]" />
                      </div>
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Fire Damage') && (
                    <div className="bg-[#1A1A1A] border border-[#333333] p-5 rounded-xl mb-5">
                      <div className="text-[#F5F5F5] font-black italic mb-8">"With the fire damage, was it mostly cosmetic smoke damage, or did it burn into the structural framing?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Cosmetic / Smoke Only', 'Structural / Framing Damage'].map(opt => (
                          <button key={opt} onClick={() => updateForm('redFlagFire', opt)} className={clsx("", formData.redFlagFire === opt ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>

                      {formData.redFlagFire === 'Cosmetic / Smoke Only' && (
                        <div className="flex flex-wrap gap-2 mt-4 animate-slideIn">
                          {['Professionally Mitigated', 'Needs Smoke Remediation / Paint', 'Active Insurance Claim'].map(opt => (
                            <button key={opt} onClick={() => updateForm('redFlagFireDetails', opt)} className={clsx("", formData.redFlagFireDetails === opt ? "bg-[#FFFF00] border-2 border-[#333333] text-[#F5F5F5] font-black text-xs  px-3 py-1 cursor-pointer" : "bg-[#1A1A1A] border-2 border-[#333333] text-gray-600 font-bold text-xs  px-3 py-1 cursor-pointer")}>{opt}</button>
                          ))}
                        </div>
                      )}

                      {formData.redFlagFire === 'Structural / Framing Damage' && (
                        <div className="flex flex-wrap gap-2 mt-4 animate-slideIn">
                          {['Red Tagged / Condemned', 'Meters Pulled By City', 'Total Tear Down', 'Active Insurance Claim'].map(opt => (
                            <button key={opt} onClick={() => updateForm('redFlagFireDetails', opt)} className={clsx("", formData.redFlagFireDetails === opt ? "bg-[#FFFF00] border-2 border-[#333333] text-[#F5F5F5] font-black text-xs  px-3 py-1 cursor-pointer" : "bg-[#1A1A1A] border-2 border-[#333333] text-gray-600 font-bold text-xs  px-3 py-1 cursor-pointer")}>{opt}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Water Damage / Mold') && (
                    <div className="bg-[#1A1A1A] border border-[#333333] p-5 rounded-xl mb-5">
                      <div className="text-[#F5F5F5] font-black italic mb-8">"For the water/mold issue—is there still an active leak or standing water, or is it an old leak that has completely dried out?"</div>
                      <div className="flex flex-wrap gap-3">
                        {['Active Leak / Standing Water', 'Dried Out / Past Leak', 'Visible Mold Present', 'Professional Remediation Done', 'Active Insurance Claim'].map(opt => {
                          const isSelected = formData.waterDamageTypes?.includes(opt);
                          return (
                            <button 
                              key={opt} 
                              onClick={() => {
                                const current = formData.waterDamageTypes || [];
                                updateForm('waterDamageTypes', isSelected ? current.filter(x => x !== opt) : [...current, opt]);
                              }} 
                              className={clsx("", isSelected ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('City Code Violations / Red Tags') && (
                    <div className="bg-[#1A1A1A] border border-[#333333] p-5 rounded-xl mb-5">
                      <div className="text-[#F5F5F5] font-black italic mb-8">"Since the city is involved, do you know if there are any active fines or daily penalties adding up?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Active Fines Accumulating', 'Stop Work Order', 'Red Tagged'].map(opt => {
                          const isSelected = formData.cityViolations?.includes(opt);
                          return (
                            <button 
                              key={opt} 
                              onClick={() => {
                                const current = formData.cityViolations || [];
                                updateForm('cityViolations', isSelected ? current.filter(x => x !== opt) : [...current, opt]);
                              }} 
                              className={clsx("", isSelected ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                      <input type="number" placeholder="CURRENT FINE AMOUNT $" value={formData.redFlagFines || ''} onChange={(e) => updateForm('redFlagFines', e.target.value)} className="w-full max-w-sm bg-[#1A1A1A] border-2 border-[#333333] p-3 font-black  text-xs shadow-md focus:outline-none focus:translate-y-1 focus:shadow-none transition-all" />
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Known Liens / Judgments') && (
                    <div className="bg-[#1A1A1A] border border-[#333333] p-5 rounded-xl mb-5">
                      <div className="text-[#F5F5F5] font-black italic mb-8">"I appreciate you being upfront about that. Just so our title team knows what they are looking at when we pull the records, what kind of lien is it, and do you know roughly what the payoff amount is?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Tax Lien (Property/IRS)', 'Mechanic\'s Lien (Contractor)', 'HOA Lien', 'Child Support/Alimony', 'Mortgage Judgment'].map(opt => {
                          const isSelected = formData.lienTypes?.includes(opt);
                          return (
                            <button 
                              key={opt} 
                              onClick={() => {
                                const current = formData.lienTypes || [];
                                updateForm('lienTypes', isSelected ? current.filter(x => x !== opt) : [...current, opt]);
                              }} 
                              className={clsx("", isSelected ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                      <input type="number" placeholder="EST. PAYOFF AMOUNT $" value={formData.redFlagLienAmount || ''} onChange={(e) => updateForm('redFlagLienAmount', e.target.value)} className="w-full max-w-sm bg-[#1A1A1A] border-2 border-[#333333] p-3 font-black  text-xs shadow-md focus:outline-none focus:translate-y-1 focus:shadow-none transition-all" />
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

                  </div>
                </div>
              )}
  
              {currentStep === 2 && (
              <div className="mt-12 mb-8 flex justify-center">
                  <button 
                    onClick={() => {
                      handleProceed(3);
                      setTimeout(() => {
                        document.getElementById('pillar-3')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 350);
                    }}
                    className="w-full py-3.5 my-4 bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] font-extrabold text-center rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(229,193,88,0.5)] hover:opacity-95 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    PROCEED TO PILLAR 3 &rarr;
                  </button>
                </div>
            )}
          </div>
        ))}

        