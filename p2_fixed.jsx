<> {renderPillar(2, "Property Details & Occupancy", <Home size={20} />, (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col mb-2 animate-slideIn">
               <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Property Type)</span>
               <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00E5FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                 {`"So public records are showing this as a ${formData.expectedPropertyType || 'standard single-family home'}. Is that right${(!formData.expectedPropertyType || formData.expectedPropertyType === 'standard single-family home') ? ', or are we looking at a multi-unit or mobile home?' : '?'}"`}
               </div>
            </div>

            <div className="mb-6">
              <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Select Property Type</label>
              <div className="flex flex-wrap gap-2">
                {['Single Family', 'Multi-Family', 'Condo/Townhome', 'Mobile Home', 'Land'].map(type => (
                  <button key={type} onClick={() => updateForm('propertyType', formData.propertyType === type ? '' : type)} className={clsx("", formData.propertyType === type ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{type}</button>
                ))}
              </div>
            </div>

            {formData.propertyType && formData.propertyType !== 'Multi-Family' && formData.propertyType !== 'Land' && (
              <>
                {/* 1. DECISION MAKERS */}
                <div className="flex flex-col mb-2 animate-slideIn">
                   <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Decision Makers)</span>
                   <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF0055] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                     {`"Perfect. And before we get into the house itself, are you the sole owner on title, or is there a spouse or partner we'd need to loop in eventually?"`}
                   </div>
                </div>

                <div className="mb-6 animate-slideIn">
                  <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Decision Makers</label>
                  <div className="flex flex-wrap gap-2">
                    {['Sole Owner', 'Spouse/Partner', 'Trust/Probate/Multiple'].map(dm => (
                      <button key={dm} onClick={() => updateForm('decisionMakers', formData.decisionMakers === dm ? '' : dm)} className={clsx("", formData.decisionMakers === dm ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{dm}</button>
                    ))}
                  </div>
                </div>

                {/* 2. PROPERTY SPECS */}
                {formData.decisionMakers && (
                  <>
                    <div className="flex flex-col mb-2 animate-slideIn">
                       <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Property Specs)</span>
                       <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                         {formData.propertyType === 'Single Family' || formData.propertyType === 'Condo/Townhome' ? (
                           (() => {
                             let intro = "So ";
                             if (formData.decisionMakers === 'Sole Owner') intro = "Perfect, keeps things simple. So ";
                             else if (formData.decisionMakers === 'Spouse/Partner' || formData.decisionMakers === 'Trust/Probate/Multiple') intro = "Got it, so we'll just make sure they're looped in on the numbers when the time comes. So ";
                             
                             return `"${intro}on my end I see that it's a ${formData.publicBeds || '{Beds}'} bed, ${formData.publicBaths || '{Baths}'} bath, right around ${formData.publicSqft ? Number(formData.publicSqft).toLocaleString() : '{SqFt}'} square feet. Have you guys added on to it at all${formData.publicBeds && formData.publicBaths && formData.publicSqft ? ", or is this still the current layout?" : "?"}"`;
                           })()
                         ) : formData.propertyType === 'Mobile Home' ? (
                           `"Is that sitting on its own land that you own, or is it in a park where you're paying lot rent? And what's the bed/bath count on the unit itself?"`
                         ) : ""}
                       </div>
                    </div>

                    <div className="mb-6 animate-slideIn flex flex-col gap-4">
                      <div>
                        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Beds</label>
                        <div className="flex flex-wrap gap-2">
                          {['1 Bed', '2 Beds', '3 Beds', '4 Beds', '5+ Beds'].map(bed => (
                            <button key={bed} onClick={() => updateForm('beds', formData.beds === bed ? '' : bed)} className={clsx("", formData.beds === bed ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{bed}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Baths</label>
                        <div className="flex flex-wrap gap-2">
                          {['1 Bath', '1.5 Baths', '2 Baths', '2.5 Baths', '3+ Baths'].map(bath => (
                            <button key={bath} onClick={() => updateForm('baths', formData.baths === bath ? '' : bath)} className={clsx("", formData.baths === bath ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{bath}</button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                         <div>
                           <label className="text-xs text-gray-800 uppercase block mb-1 font-bold">Sqft</label>
                           <input type="number" value={formData.sqft} onChange={e => updateForm('sqft', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                         </div>
                         <div>
                           <label className="text-xs text-gray-800 uppercase block mb-1 font-bold">Lot Size (Sqft)</label>
                         <input type="number" value={formData.lotSize} onChange={e => updateForm('lotSize', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                         </div>
                      </div>
                    </div>
                  </>
                )}

                {/* 3. OCCUPANCY */}
                {formData.decisionMakers && (
                  <>
                    <div className="flex flex-col mb-2 animate-slideIn">
                       <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Occupancy)</span>
                       <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00E5FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                         "Sounds good, now are you currently living in the property right now or is it a rental?"
                       </div>
                    </div>

                    <div className="mb-6 animate-slideIn">
                      <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Occupancy Status</label>
                      <div className="flex flex-wrap gap-2">
                        {['Owner Occupied', 'Tenant Occupied', 'Vacant'].map(occ => (
                          <button key={occ} onClick={() => updateForm('occupancy', formData.occupancy === occ ? '' : occ)} className={clsx("", formData.occupancy === occ ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{occ}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {formData.propertyType === 'Land' && (
              <div className="flex flex-col mb-2 animate-slideIn">
                 <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Land Specs)</span>
                 <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF0055] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                   "Understood. Do you happen to know the exact acreage or lot size? And are there any existing utilities pulled to the property, like water or power?"
                 </div>
              </div>
            )}

            {/* Property Dynamics Inputs */}
            {formData.propertyType === 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Multi-Family Phase 1 & 2)</div>
                <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
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
                  
                  <div style={{ marginTop: '15px', background: 'transparent', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                    
                    <div className="mb-6">
                      <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Building Configuration</div>
                      <div className="flex flex-wrap gap-3">
                        {['1 Single Building', 'Multiple Detached Buildings', 'Main House + ADU/Conversion'].map(config => (
                          <button key={config} 
                            className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-[2px_2px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfBuildingConfig === config ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[2px_2px_0px_#00E5FF]' : 'bg-black border-white text-white'}`} 
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
                        <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Structure Consistency</div>
                        <div className="flex flex-wrap gap-3">
                          {['All Built Same Year', 'Different Ages/Styles'].map(opt => (
                            <button key={opt} 
                              className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-[2px_2px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfStructureConsistency === opt ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[2px_2px_0px_#00E5FF]' : 'bg-black border-white text-white'}`} 
                              onClick={() => setFormData({...formData, mfStructureConsistency: opt})}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'All Built Same Year' && (
                      <div className="mb-6 animate-slideIn">
                        <label className="text-sm text-gray-400 uppercase block mb-2 font-bold tracking-widest">Estimated Year Built</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 1985" 
                          value={formData.mfYearBuilt} 
                          onChange={e => updateForm('mfYearBuilt', e.target.value)} 
                          className="w-full bg-black border-2 border-white rounded-lg p-3 text-white focus:border-[#00E5FF] focus:outline-none font-bold placeholder-gray-600" 
                        />
                      </div>
                    )}

                    {formData.mfBuildingConfig === 'Main House + ADU/Conversion' && (
                      <div className="mb-6 animate-slideIn flex flex-col gap-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">ADU Origin</div>
                          <div className="flex flex-wrap gap-3">
                            {['Ground-Up Build', 'Garage Conversion', 'Interior Split/Cut'].map(opt => (
                              <button key={opt} 
                                className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-[2px_2px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfAduOrigin === opt ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[2px_2px_0px_#00E5FF]' : 'bg-black border-white text-white'}`} 
                                onClick={() => setFormData({...formData, mfAduOrigin: opt})}>
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {formData.mfAduOrigin !== '' && (
                          <div className="animate-slideIn">
                            <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">City Permits / Legality</div>
                            <div className="flex flex-wrap gap-3">
                              {['Fully Permitted', 'Unpermitted / Unknown'].map(opt => (
                                <button key={opt} 
                                  className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-[2px_2px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfAduLegality === opt ? 'bg-[#FF0055] text-white border-[#FF0055] shadow-[2px_2px_0px_#FF0055]' : 'bg-black border-white text-white'}`} 
                                  onClick={() => setFormData({...formData, mfAduLegality: opt})}>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {formData.mfAduLegality !== '' && (
                          <div className="animate-slideIn">
                            <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Utility Metering</div>
                            <div className="flex flex-wrap gap-3">
                              {['Own Address & Meters', 'Shared with Main House'].map(opt => (
                                <button key={opt} 
                                  className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-[2px_2px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfAduMetering === opt ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[2px_2px_0px_#00E5FF]' : 'bg-black border-white text-white'}`} 
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
                        <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Total Units</div>
                        <div className="flex flex-wrap gap-3">
                          {['2 Units', '3 Units', '4 Units'].map(count => (
                            <button key={count} 
                              className={`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfUnitCount === count ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}`} 
                              onClick={() => {
                                const numUnits = parseInt(count.charAt(0));
                                setFormData({...formData, mfUnitCount: count, mfUnitsData: Array.from({length: numUnits}, () => ({yearBuilt: '', layoutBeds: '', layoutBaths: '', condition: '', occupancy: '', leaseType: '', paymentStatus: '', rentAmount: ''}))});
                              }}>
                              {count}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.mfUnitsData.length > 0 && (
                      <div className="flex flex-col gap-4 mb-6">
                        {formData.mfUnitsData.map((unit, index) => (
                          <div key={index} className="bg-[#111] border-2 border-[#3b82f6] p-4 rounded-lg shadow-[4px_4px_0px_#000]">
                            <div className="text-[#00E5FF] font-bold uppercase tracking-widest mb-3 border-b border-gray-700 pb-2">
                              {formData.mfBuildingConfig === 'Main House + ADU/Conversion' 
                                ? (index === 0 ? 'MAIN HOUSE' : 'ADU / GUEST HOUSE')
                                : `Unit ${String.fromCharCode(65 + index)}`
                              }
                            </div>
                            
                            {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'Different Ages/Styles' && (
                              <div className="mb-4">
                                <label className="text-xs text-gray-400 uppercase block mb-2 font-bold tracking-widest">Year Built</label>
                                <input 
                                  type="number" 
                                  placeholder="e.g. 1950" 
                                  value={unit.yearBuilt || ''} 
                                  onChange={e => {
                                    const newData = [...formData.mfUnitsData]; newData[index].yearBuilt = e.target.value; setFormData({...formData, mfUnitsData: newData});
                                  }} 
                                  className="w-full bg-black border border-gray-600 rounded-lg p-2 text-white focus:border-[#3b82f6] focus:outline-none font-bold placeholder-gray-600 text-sm" 
                                />
                              </div>
                            )}

                            <div className="mb-4">
                              <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Layout</div>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {['Studio', '1 Bed', '2 Bed', '3+ Bed'].map(bed => (
                                  <button key={bed} className={`px-3 py-1.5 border font-bold text-xs ${unit.layoutBeds === bed ? 'bg-[#3b82f6] text-white border-[#3b82f6]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].layoutBeds = bed; setFormData({...formData, mfUnitsData: newData});
                                  }}>{bed}</button>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {['1 Bath', '1.5 Bath', '2+ Bath'].map(bath => (
                                  <button key={bath} className={`px-3 py-1.5 border font-bold text-xs ${unit.layoutBaths === bath ? 'bg-[#3b82f6] text-white border-[#3b82f6]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].layoutBaths = bath; setFormData({...formData, mfUnitsData: newData});
                                  }}>{bath}</button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Condition</div>
                              <div className="flex flex-wrap gap-2">
                                {['Turnkey / Updated', 'Dated / Livable', 'Needs Heavy Rehab'].map(cond => (
                                  <button key={cond} className={`px-3 py-1.5 border font-bold text-xs ${unit.condition === cond ? 'bg-[#FF0055] text-white border-[#FF0055]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].condition = cond; setFormData({...formData, mfUnitsData: newData});
                                  }}>{cond}</button>
                                ))}
                              </div>
                            </div>

                            <div className="mb-2">
                              <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Occupancy Status</div>
                              <div className="flex flex-wrap gap-2">
                                {['Owner Occupied', 'Tenant Occupied', 'Vacant'].map(occ => (
                                  <button key={occ} className={`px-3 py-1.5 border font-bold text-xs ${unit.occupancy === occ ? 'bg-[#00E676] text-black border-[#00E676]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
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
                              <div className="mt-4 p-3 bg-black border border-gray-800 rounded flex flex-col gap-3">
                                <div>
                                  <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Current Rent $</div>
                                  <input type="number" placeholder="e.g. 1500" value={unit.rentAmount} onChange={(e) => {
                                    const newData = [...formData.mfUnitsData]; newData[index].rentAmount = e.target.value; setFormData({...formData, mfUnitsData: newData});
                                  }} className="w-full p-2 bg-[#222] text-white border border-gray-600 font-bold text-sm focus:outline-none focus:border-[#FF0055] transition-all" />
                                </div>
                                <div>
                                  <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Lease Type</div>
                                  <div className="flex gap-2">
                                    {['MTM', 'Annual'].map(lt => (
                                      <button key={lt} className={`flex-1 py-1.5 border font-bold text-xs ${unit.leaseType === lt ? 'bg-[#FF0055] text-white border-[#FF0055]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                        const newData = [...formData.mfUnitsData]; newData[index].leaseType = lt; setFormData({...formData, mfUnitsData: newData});
                                      }}>{lt}</button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Payment Status</div>
                                  <div className="flex gap-2">
                                    {['On Time', 'Behind'].map(ps => (
                                      <button key={ps} className={`flex-1 py-1.5 border font-bold text-xs ${unit.paymentStatus === ps ? 'bg-[#FF0055] text-white border-[#FF0055]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
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
                        <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Utility Metering</div>
                        <div className="flex flex-col gap-4 mb-4">
                          <button className={`px-4 py-3 border-2 font-bold tracking-widest text-sm shadow-[2px_2px_0px_#fff] skew-x-[-2deg] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfUtilityMetering === 'Separately Metered (Tenant Pays All)' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[2px_2px_0px_#00E5FF]' : 'bg-black border-white text-white'}`} onClick={() => setFormData({...formData, mfUtilityMetering: 'Separately Metered (Tenant Pays All)', mfOwnerUtilities: [], mfUtilityCost: ''})}>Tenants Pay All</button>
                          <button className={`px-4 py-3 border-2 font-bold tracking-widest text-sm shadow-[2px_2px_0px_#fff] skew-x-[-2deg] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfUtilityMetering === 'Landlord Pays Some/All' ? 'bg-[#FFE600] text-black border-[#FFE600] shadow-[2px_2px_0px_#FFE600]' : 'bg-black border-white text-white'}`} onClick={() => setFormData({...formData, mfUtilityMetering: 'Landlord Pays Some/All'})}>Landlord Pays Some/All</button>
                        </div>
                        
                        {formData.mfUtilityMetering === 'Landlord Pays Some/All' && (
                          <div className="mt-4 p-4 bg-black border border-gray-800 rounded-lg">
                            <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Which Utilities?</div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {['Water', 'Sewer', 'Trash', 'Gas', 'Electric', 'Landscaping'].map(util => (
                                <button key={util} 
                                  className={`px-4 py-1.5 border font-bold text-xs shadow-[2px_2px_0px_#fff] skew-x-[-5deg] ${formData.mfOwnerUtilities.includes(util) ? 'bg-[#FFE600] text-black border-[#FFE600] shadow-[2px_2px_0px_#FFE600]' : 'bg-black border-gray-600 text-gray-300'} transition-all`} 
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
                              <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Est. Monthly Utility Cost $</div>
                              <input type="number" placeholder="e.g. 350" value={formData.mfUtilityCost} onChange={(e) => setFormData({...formData, mfUtilityCost: e.target.value})} className="w-full p-3 bg-[#222] text-white border-2 border-gray-600 font-bold text-sm focus:outline-none focus:border-[#FFE600] transition-all skew-x-[-2deg]" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
{formData.propertyType === 'Condo/Townhome' && (
              <div className="p-4 bg-white border border-black rounded-xl animate-slideIn">
                <p className="text-sm text-black mb-2">"Condos are great. Usually, the biggest hurdle for us are the HOA rules. What's the name of the HOA, what's the monthly fee, and do they have any rental restrictions?"</p>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="HOA Name..." value={formData.hoaName} onChange={e => updateForm('hoaName', e.target.value)} className="flex-1 bg-white border border-black rounded-lg p-2 text-black outline-none" />
                  <input type="text" placeholder="HOA Fee / Mo ($)..." value={formData.hoaFee} onChange={e => updateForm('hoaFee', e.target.value)} className="flex-1 bg-white border border-black rounded-lg p-2 text-black outline-none" />
                </div>
                <input type="text" placeholder="Any Rental Restrictions?" value={formData.hoaRestrictions} onChange={e => updateForm('hoaRestrictions', e.target.value)} className="w-full bg-white border border-black rounded-lg p-2 text-black outline-none" />
              </div>
            )}

            {formData.propertyType === 'Mobile Home' && (
              <div className="p-4 bg-white border border-black rounded-xl animate-slideIn">
                <p className="text-sm text-black mb-2">"Mobile homes are great. Is it located inside a park, and if so, what's the space rent?"</p>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="Park Name / Location..." value={formData.mhParkName} onChange={e => updateForm('mhParkName', e.target.value)} className="flex-1 bg-white border border-black rounded-lg p-2 text-black outline-none" />
                  <input type="text" placeholder="Space Rent / Fee ($)..." value={formData.mhParkFee} onChange={e => updateForm('mhParkFee', e.target.value)} className="flex-1 bg-white border border-black rounded-lg p-2 text-black outline-none" />
                </div>
                <div className="flex gap-2">
                  <button className={clsx("", formData.mh55Plus ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => updateForm('mh55Plus', !formData.mh55Plus)}>55+ Community</button>
                  <button className={clsx("", formData.mh433A ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => updateForm('mh433A', !formData.mh433A)}>433A (Perm Foundation)</button>
                </div>
              </div>
            )}

            {formData.propertyType === 'Land' && (
              <div className="p-4 bg-white border border-black rounded-xl animate-slideIn">
                <p className="text-sm text-black mb-2">"Gotcha. For vacant land, the most important things we look at are utilities and zoning. Do you know what it's currently zoned for, and does it have city water and sewer?"</p>
                <input type="text" placeholder="Current Zoning (e.g. R1, Ag)..." value={formData.landZoning} onChange={e => updateForm('landZoning', e.target.value)} className="w-full bg-black/40 backdrop-blur-md border-2 border-[#00E5FF] rounded-lg p-2 text-white outline-none mb-2 placeholder-gray-400" />
                <div className="flex gap-2 mb-2 flex-wrap">
                  {['Water', 'Sewer', 'Electric', 'Well/Septic'].map(util => {
                    const isSelected = formData.landUtilities?.includes(util);
                    return (
                      <button key={util} className={clsx("", isSelected ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => {
                        const current = formData.landUtilities || [];
                        updateForm('landUtilities', isSelected ? current.filter(u => u !== util) : [...current, util]);
                      }}>{util}</button>
                    )

                  })}
                </div>
                <div className="flex gap-2">
                  <button className={clsx("", formData.landPaved === true ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => handleSingleSelect('landPaved', true)}>Paved Access</button>
                  <button className={clsx("", formData.landPaved === false ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => handleSingleSelect('landPaved', false)}>Dirt Road Access</button>
                </div>
              </div>
            )}

            {/* Dynamic Follow-up: Tenant */}
            {isTenant && formData.propertyType !== 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Tenant Follow-up)</span>
                <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00E5FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                  "And are they currently paying on time? What are they paying in rent right now, and are they on a month-to-month or long-term lease?"
                </div>
                  
                <div className="bg-white border-4 border-black box-border shadow-[8px_8px_0px_#FF00FF] p-6 mb-6 rounded-none mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input type="text" placeholder="RENT AMOUNT ($)..." value={formData.rentAmount || ''} onChange={(e) => updateForm('rentAmount', e.target.value)} className="bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                    <input type="text" placeholder="HOW DO THEY PAY? (ZELLE, CASH)..." value={formData.rentMethod || ''} onChange={(e) => updateForm('rentMethod', e.target.value)} className="bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                      <button className={clsx("", formData.leaseType === 'M2M' ? "bg-[#00FFFF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => updateForm('leaseType', formData.leaseType === 'M2M' ? '' : 'M2M')}>MONTH-TO-MONTH</button>
                      <button className={clsx("", formData.leaseType === 'Lease' ? "bg-[#00FFFF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => updateForm('leaseType', formData.leaseType === 'Lease' ? '' : 'Lease')}>FIXED LEASE</button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button className={"px-4 py-3 transition-all " + (formData.tenantStatus?.includes('Paying on Time') ? "bg-[#00FFFF] border-4 border-black rounded-none text-black font-black italic shadow-[4px_4px_0px_#000]" : "bg-white border-2 border-black rounded-none text-black font-bold uppercase")} 
                        onClick={() => {
                          const current = formData.tenantStatus || [];
                          updateForm('tenantStatus', current.includes('Paying on Time') ? current.filter(x => x !== 'Paying on Time') : [...current, 'Paying on Time']);
                        }}
                      >
                        PAYING ON TIME
                      </button>
                      <button className={"px-4 py-3 transition-all " + (formData.tenantStatus?.includes('Someone is Behind') ? "bg-[#00FFFF] border-4 border-black rounded-none text-black font-black italic shadow-[4px_4px_0px_#000]" : "bg-white border-2 border-black rounded-none text-black font-bold uppercase")} 
                        onClick={() => {
                          const current = formData.tenantStatus || [];
                          updateForm('tenantStatus', current.includes('Someone is Behind') ? current.filter(x => x !== 'Someone is Behind') : [...current, 'Someone is Behind']);
                        }}
                      >
                        BEHIND ON RENT
                      </button>
                    </div>
                  </div>
                  
                  {(formData.tenantStatus?.includes('Someone is Behind') || formData.tenantStatus?.includes('Eviction Needed')) && (
                    <div className="border-t-4 border-black pt-4 mt-6">
                       <label className="text-black uppercase font-black block mb-2">IF BEHIND ON RENT:</label>
                       <div className="flex flex-wrap gap-4 items-center">
                         <input type="text" placeholder="AMOUNT BEHIND ($)..." value={formData.rentArrears || ''} onChange={(e) => updateForm('rentArrears', e.target.value)} className="bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all w-48" />
                         <button className={"px-4 py-3 transition-all " + (formData.tenantStatus?.includes('Eviction Needed') ? "bg-[#FF1111] border-4 border-black rounded-none text-white font-black italic shadow-[4px_4px_0px_#000]" : "bg-white border-2 border-black rounded-none text-black font-bold uppercase")} 
                           onClick={() => {
                             const current = formData.tenantStatus || [];
                             updateForm('tenantStatus', current.includes('Eviction Needed') ? current.filter(x => x !== 'Eviction Needed') : [...current, 'Eviction Needed']);
                           }}
                         >
                           EVICTION NEEDED
                         </button>
                       </div>
                    </div>
                  )}

                  {/* NEW OCCUPANCY DATA EXPANSION */}
                    <div className="border-t-4 border-black pt-4 mt-6">
                      <div className="text-black font-bold italic text-md mb-4">
                        "Just so we have the full picture on the lease... how much are you currently holding for their security deposit, who is currently paying for the utilities, and is any of that rent being subsidized by Section 8?"
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="text-black uppercase font-black block mb-2">SECURITY DEPOSIT</label>
                          <input type="text" placeholder="DEPOSIT HELD ($)..." value={formData.securityDeposit || ''} onChange={(e) => updateForm('securityDeposit', e.target.value)} className="bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all w-full max-w-xs" />
                        </div>
  
                        <div>
                          <label className="text-black uppercase font-black block mb-2">UTILITIES</label>
                          <div className="flex flex-wrap gap-2">
                            {['TENANT PAYS ALL', 'LANDLORD PAYS W/S/T', 'LANDLORD PAYS ALL'].map(opt => (
                              <button key={opt} onClick={() => updateForm('utilityStatus', formData.utilityStatus === opt ? '' : opt)} className={opt === formData.utilityStatus ? "px-4 py-3 bg-[#00FFFF] border-4 border-black rounded-none text-black font-black italic shadow-[4px_4px_0px_#000] transition-all" : "px-4 py-3 bg-white border-2 border-black rounded-none text-black font-bold uppercase transition-all"}>{opt}</button>
                            ))}
                          </div>
                          {(formData.utilityStatus === 'LANDLORD PAYS W/S/T' || formData.utilityStatus === 'LANDLORD PAYS ALL') && (
                            <div className="mt-2 animate-slideIn">
                              <input type="text" placeholder="Landlord Cost / Mo ($)..." value={formData.landlordUtilityCost || ''} onChange={(e) => updateForm('landlordUtilityCost', e.target.value.replace(/[^0-9.]/g, ''))} className="bg-white border-2 border-black rounded-none p-2 text-black uppercase font-bold placeholder-gray-500 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all w-full max-w-xs" />
                            </div>
                          )}
                        </div>
  
                        <div>
                          <label className="text-black uppercase font-black block mb-2">SUBSIDIES</label>
                          <div className="flex flex-wrap gap-2">
                            {['NO SECTION 8', 'PARTIAL SECTION 8', 'FULL SECTION 8'].map(opt => (
                              <button key={opt} onClick={() => updateForm('section8Status', formData.section8Status === opt ? '' : opt)} className={opt === formData.section8Status ? "px-4 py-3 bg-[#00FFFF] border-4 border-black rounded-none text-black font-black italic shadow-[4px_4px_0px_#000] transition-all" : "px-4 py-3 bg-white border-2 border-black rounded-none text-black font-bold uppercase transition-all"}>{opt}</button>
                            ))}
                          </div>
                          {(formData.section8Status === 'PARTIAL SECTION 8' || formData.section8Status === 'FULL SECTION 8') && (
                            <div className="mt-2 animate-slideIn">
                              <input type="text" placeholder="Section 8 Coverage / Mo ($)..." value={formData.section8Coverage || ''} onChange={(e) => updateForm('section8Coverage', e.target.value.replace(/[^0-9.]/g, ''))} className="bg-white border-2 border-black rounded-none p-2 text-black uppercase font-bold placeholder-gray-500 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all w-full max-w-xs" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}


            {/* Dynamic Follow-up: Vacant */}
            {isVacant && formData.propertyType !== 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Vacant Follow-up)</span>
                <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF0055] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                  "Okay, since it's vacant, how long has it been sitting empty? Have you had any issues with squatters or break-ins that we should know about?"
                </div>
                  
                <div style={{ marginTop: '15px', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '12px' }}>
                  <input type="text" placeholder="How long vacant? (e.g., 6 months)..." value={formData.vacantLength} onChange={(e) => setFormData({...formData, vacantLength: e.target.value})} className="modern-input" style={{ width: '100%', marginBottom: '10px' }} />
                  <div className="toggles-row">
                    <button className={`toggle-pill ${formData.vacantIssues.includes('Boarded Up') ? 'active' : ''}`} onClick={() => handleToggle('vacantIssues', 'Boarded Up')}>Boarded Up</button>
                    <button className={clsx("", formData.vacantIssues.includes('Squatters') ? "bg-[#FFFF00] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => handleToggle('vacantIssues', 'Squatters')}>Squatters</button>
                    <button className={clsx("", formData.vacantIssues.includes('Vandalism') ? "bg-[#FFFF00] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => handleToggle('vacantIssues', 'Vandalism')}>Vandalized</button>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Follow-up: Trust/Probate */}
            {isTrust && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Trust/Probate Follow-up)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    "Since it's in a trust or probate, has the probate process officially started yet? And how many heirs or decision makers are involved? Does everyone agree on selling?"
                  
                  <div style={{ marginTop: '15px', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                       <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Probate Started?</label>
                       <button className={`toggle-pill ${formData.probateStarted === true ? 'active' : ''}`} onClick={() => handleSingleSelect('probateStarted', true)}>Yes</button>
                       <button className={`toggle-pill ${formData.probateStarted === false ? 'active' : ''}`} onClick={() => handleSingleSelect('probateStarted', false)}>No</button>
                    </div>
                    <input type="text" placeholder="Who is the Executor/Admin?" value={formData.executor} onChange={(e) => setFormData({...formData, executor: e.target.value})} className="modern-input" style={{ width: '100%', marginBottom: '10px' }} />
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                       <label style={{ fontSize: '0.9rem' }}>Total Heirs/Decision Makers:</label>
                       <input type="number" min="1" value={formData.trustHeadcount} onChange={(e) => setFormData({...formData, trustHeadcount: e.target.value})} className="modern-input" style={{ width: '80px' }} />
  </div>
</div>
                </div>
              </div>
            )}

            {/* Dynamic Condition Bridges */}
            
            
            {isTenant && formData.tenantStatus.includes('Paying on Time') && formData.leaseType === 'M2M' && !formData.tenantStatus.includes('Eviction Needed') && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2.5rem', animation: 'slideInUp 0.3s ease' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Transition)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF0055] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    "Okay, month-to-month and paying on time. We could probably just inherit them as tenants. With that in mind, what's the actual condition of the property?"
  </div>
</div>
            )}

            {isVacant && formData.propertyType !== 'Multi-Family' && (formData.vacantIssues.includes('Squatters') || formData.vacantIssues.includes('Boarded Up') || formData.vacantIssues.includes('Vandalism')) && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2.5rem', animation: 'slideInUp 0.3s ease' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Transition)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    "Wow, sorry you're dealing with that. We buy properties with those issues all the time so we can definitely take that burden off your hands. Since we can't always get inside right away, what do you remember about the major stuff?"
  </div>
</div>
            )}

            {/* Core Condition Questions */}
            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: ((isTenant && formData.tenantStatus.length > 0) || (isVacant && formData.vacantIssues.length > 0)) ? '1.5rem' : '2.5rem' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Roof & AC)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00E5FF] rounded-none mb-8">
    
    <div className="text-xl font-black italic text-black leading-relaxed mb-6">
      "Got it. Now, to make sure my repair estimates are accurate, I always start with the heavy-ticket items. Let's start with the roof—roughly how many years old is it, and is it holding up alright or needing some major patchwork?"
    </div>
    
    {formData.propertyType !== 'Multi-Family' && (
      <div className="mb-8">
        <div className="mb-4">
          <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Roof Age</label>
          <div className="flex flex-wrap gap-2">
            {['0-5 Years', '5-10 Years', '10-15 Years', '15+ Years'].map(age => (
              <button key={age} onClick={() => updateForm('roofAge', formData.roofAge === age ? '' : age)} className={clsx("", formData.roofAge === age ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{age}</button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Roof Condition</label>
          <div className="flex flex-wrap gap-2">
            {[{label: 'Roof: Good ($0/sqft)', mult: 0}, {label: 'Roof: Needs Overlay ($4/sqft)', mult: 4}, {label: 'Roof: Full Tear-Off ($8/sqft)', mult: 8}].map(opt => (
              <button key={opt.label} onClick={() => { if (formData.sfRoof === opt.label) { updateForm('sfRoof', ''); updateForm('roofMult', 0); } else { updateForm('sfRoof', opt.label); updateForm('roofMult', opt.mult); } }} className={clsx("", formData.sfRoof === opt.label ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt.label}</button>
            ))}
          </div>
        </div>
      </div>
    )}

    <div className="mt-8 pt-6 border-t-2 border-gray-300 text-xl font-black italic text-black leading-relaxed mb-6">
      "Okay, makes sense. And what about the HVAC system? Do you know about what year the AC was installed, and is it running perfectly as-is?"
    </div>
    
    {formData.propertyType !== 'Multi-Family' && (
      <div>
        <div className="mb-4">
          <label className="text-xs text-gray-800 uppercase font-bold block mb-2">HVAC Age</label>
          <div className="flex flex-wrap gap-2">
            {['0-5 Years', '5-10 Years', '10-15 Years', '15+ Years'].map(age => (
              <button key={age} onClick={() => updateForm('hvacAge', formData.hvacAge === age ? '' : age)} className={clsx("", formData.hvacAge === age ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{age}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-800 uppercase font-bold block mb-2">HVAC Status</label>
          <div className="flex flex-wrap gap-2">
            {[{label: 'AC: Good ($0/sqft)', mult: 0}, {label: 'AC: Unit Only ($3/sqft)', mult: 3}, {label: 'AC: Full System + Ducts ($7/sqft)', mult: 7}].map(opt => (
              <button key={opt.label} onClick={() => { if (formData.sfHVAC === opt.label) { updateForm('sfHVAC', ''); updateForm('hvacMult', 0); } else { updateForm('sfHVAC', opt.label); updateForm('hvacMult', opt.mult); } }} className={clsx("", formData.sfHVAC === opt.label ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt.label}</button>
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
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Reaction)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF0055] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    "Got it. Don't worry too much about that, we deal with replacing those all the time."
  </div>
</div>
            )}

            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Plumbing & Electrical)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00FF00] rounded-none mb-8">
    <div className="text-black font-black italic text-lg mb-4">
      "Do you know roughly how old the plumbing is and have you ever had repiped the house or is everything still original?"
    </div>

    {formData.propertyType !== 'Multi-Family' && (
      <div className="mb-6">
        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Plumbing Age</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {['0-5 Years', '5-15 Years', '15-30 Years', 'Original / 30+'].map(opt => (
            <button key={opt} onClick={() => updateForm('plumbingAge', formData.plumbingAge === opt ? '' : opt)} className={clsx("", formData.plumbingAge === opt ? "bg-[#FFFF00] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
          ))}
        </div>

        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Plumbing Condition</label>
        <div className="flex flex-wrap gap-2">
          {[{label: 'Copper/PEX ($0/sqft)', mult: 0}, {label: 'Minor Leaks / Patch ($2/sqft)', mult: 2}, {label: 'Needs Full Repipe ($5/sqft)', mult: 5}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfPlumbing === opt.label) { updateForm('sfPlumbing', ''); updateForm('plumbingMult', 0); } else { updateForm('sfPlumbing', opt.label); updateForm('plumbingMult', opt.mult); } }} className={clsx("", formData.sfPlumbing === opt.label ? "bg-[#FFFF00] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt.label}</button>
          ))}
        </div>

        <div className="text-black font-bold italic text-md mt-6 mb-2">
          "Got it. And just quickly while we're talking about the plumbing, do you happen to know if the water heater is relatively new, or is it getting up there in age?"
        </div>
        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Water Heater</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {[{label: '0-5 YEARS / GOOD ($0)', flatAdd: 0}, {label: '5-10 YEARS / AGING ($1,000)', flatAdd: 1000}, {label: '10+ YEARS / DEAD ($2,000)', flatAdd: 2000}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfWaterHeater === opt.label) { updateForm('sfWaterHeater', ''); updateForm('waterHeaterMult', 0); } else { updateForm('sfWaterHeater', opt.label); updateForm('waterHeaterMult', opt.flatAdd); } }} className={clsx("", formData.sfWaterHeater === opt.label ? "bg-[#FFFF00] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt.label}</button>
          ))}
        </div>
      </div>
    )}

    <div className="border-t-2 border-gray-300 pt-6 mt-6">
      <div className="text-black font-black italic text-lg mb-4">
        "Got it. And what about the electrical system? About how many years ago was the panel or wiring updated, or is that still original too?"
      </div>
    </div>

    {formData.propertyType !== 'Multi-Family' && (
      <div>
        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Electrical Age</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {['0-5 Years', '5-15 Years', '15-30 Years', 'Original / 30+'].map(opt => (
            <button key={opt} onClick={() => updateForm('electricalAge', formData.electricalAge === opt ? '' : opt)} className={clsx("", formData.electricalAge === opt ? "bg-[#FFFF00] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
          ))}
        </div>

        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Electrical Condition</label>
        <div className="flex flex-wrap gap-2">
          {[{label: 'Updated System ($0/sqft)', mult: 0}, {label: 'Panel Upgrade Needed ($2/sqft)', mult: 2}, {label: 'Needs Full Rewire ($4/sqft)', mult: 4}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfElectrical === opt.label) { updateForm('sfElectrical', ''); updateForm('electricalMult', 0); } else { updateForm('sfElectrical', opt.label); updateForm('electricalMult', opt.mult); } }} className={clsx("", formData.sfElectrical === opt.label ? "bg-[#FFFF00] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt.label}</button>
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
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Reaction)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00E5FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    "Okay, yeah, we usually end up having to repipe and rewire those older setups anyway, so that's not a deal breaker."
  </div>
</div>
            )}

            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Utilities & Exterior)</span>
              <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFFF00] rounded-none mb-8">
                
                <div className="text-black font-black italic text-lg mb-4">
                  "Is the property on city sewer or are they on a septic system?"
                </div>
              
                <div className="mb-6">
                  <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Sewer / Septic</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['City Sewer', 'Septic System'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => updateForm('septicSewer', formData.septicSewer === opt ? '' : opt)} 
                        className={clsx("", formData.septicSewer === opt ? "bg-[#FFFF00] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {formData.septicSewer === 'Septic System' && (
                    <div className="mt-4 mb-4">
                      <div className="text-black font-bold italic text-md mt-4 mb-2">
                        "And do you know roughly when the last time it was pumped or inspected was?"
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Recently Pumped', 'Aging (5+ Years)', 'Unknown / Never Pumped'].map(opt => (
                          <button key={opt} onClick={() => updateForm('septicCondition', formData.septicCondition === opt ? '' : opt)} className={clsx("", formData.septicCondition === opt ? "bg-[#FFFF00] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t-2 border-gray-300 pt-6 mt-6">
                    <div className="text-black font-black italic text-lg mb-4">
                      "Also, are there any solar panels on the roof?"
                    </div>
                  </div>

                  <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Solar panels</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['No Solar', 'Solar (Owned)', 'Solar (Leased)'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => updateForm('solarSystem', formData.solarSystem === opt ? '' : opt)} 
                        className={clsx("", formData.solarSystem === opt ? "bg-[#FFFF00] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  
                  {(formData.solarSystem === 'Solar (Leased)' || formData.solarSystem === 'Solar (Owned)') && (
                    <div className="mb-4">
                      <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Solar Age</label>
                      <div className="flex flex-wrap gap-2">
                        {['Brand New (0-5 Yrs)', 'Mid-Life (5-15 Yrs)', 'Older (15+ Yrs)'].map(opt => (
                          <button key={opt} onClick={() => updateForm('solarAge', formData.solarAge === opt ? '' : opt)} className={clsx("", formData.solarAge === opt ? "bg-[#FFFF00] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.solarSystem === 'Solar (Leased)' && (
                    <div className="mt-4">
                      <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Solar Lease Details</label>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <input type="text" value={formData.solarCompany || ''} onChange={(e) => updateForm('solarCompany', e.target.value)} placeholder="SOLAR COMPANY NAME" className="bg-gray-100 border-2 border-black p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all col-span-2 sm:col-span-1" />
                        <input type="text" value={formData.solarMonthlyPayment || ''} onChange={(e) => updateForm('solarMonthlyPayment', e.target.value.replace(/[^0-9]/g, ''))} placeholder="MONTHLY PAYMENT $" className="bg-gray-100 border-2 border-black p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all col-span-2 sm:col-span-1" />
                        <input type="text" value={formData.solarPayoffAmount || ''} onChange={(e) => updateForm('solarPayoffAmount', e.target.value.replace(/[^0-9]/g, ''))} placeholder="TOTAL PAYOFF BALANCE $" className="bg-gray-100 border-2 border-black p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all col-span-2" />
                      </div>

                      <div className="text-black font-bold italic text-sm mt-4 mb-2">
                        "Is the lease assumable by a new buyer?"
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Yes (Assumable)', 'No (Must Payoff)', 'Unknown'].map(opt => (
                          <button key={opt} onClick={() => updateForm('solarAssumable', formData.solarAssumable === opt ? '' : opt)} className={clsx("", formData.solarAssumable === opt ? "bg-[#FFFF00] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col mb-2 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Cosmetics & Inside)</span>
    <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF0055] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
      {formData.propertyType === 'Multi-Family' ? 
                    "Got it. And as far as the inside of the units go... are the kitchens and bathrooms fairly modern across the board, or are they a bit more dated and in need of some work?" :
                   formData.cosmeticsKitchen.length > 0 && formData.cosmeticsBaths.length > 0 ? "You already gave me a good idea of the kitchen and bath conditions..." :
                   hasMajorRepairs
                    ? "Makes sense. It sounds like the house just needs some TLC, which is totally fine—that's what we do. As for the inside, are the kitchens and bathrooms updated, or mostly original?"
                    : "So it sounds like the bones of the house are pretty solid... as far as the inside goes, if I walked through the front door today, are the kitchens and bathrooms fairly modern, or a bit more dated?"
                  }
    </div>
  
  {formData.propertyType !== 'Multi-Family' && (
      <div className="mb-6 animate-slideIn">
        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Kitchen Condition</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {[{label: 'Turnkey / Clean'}, {label: 'Dated / Livable'}, {label: 'Needs Heavy Rehab'}].map(opt => (
              <button key={`k-${opt.label}`} onClick={() => { updateForm('cosmeticsKitchen', opt.label); }} className={clsx("", formData.cosmeticsKitchen === opt.label ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt.label}</button>
            ))}
          </div>
          
          {(() => {
            const bathsCount = Math.ceil(parseFloat(String(formData.baths || '1').replace(/[^0-9.]/g, '')) || 1);
            const bathData = formData.cosmeticsBathsData || {};
            
            return Array.from({length: bathsCount}).map((_, i) => (
              <div key={`bath-${i}`} className="mb-4 animate-slideIn">
                <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Bath {i + 1} Condition</label>
                <div className="flex flex-wrap gap-2">
                  {[{label: 'Turnkey / Clean'}, {label: 'Dated / Livable'}, {label: 'Needs Heavy Rehab'}].map(opt => (
                    <button key={`b-${i}-${opt.label}`} onClick={() => { 
                      const newData = {...bathData, [i]: opt.label};
                      updateForm('cosmeticsBathsData', newData); 
                    }} className={clsx("", bathData[i] === opt.label ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt.label}</button>
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>
      )}
  </div>
  
              {/* Toggles moved to sidebar */}
  
              {/* Dynamic Reaction 3 */}
              {(formData.cosmeticsKitchen.includes('Heavy Rehab') || Object.values(formData.cosmeticsBathsData || {}).some(v => typeof v === 'string' && v.includes('Heavy Rehab'))) && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ animation: 'slideInUp 0.3s ease forwards' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Reaction)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    "Gotcha. Sounds like it needs some pretty heavy cosmetic love. That's right up our alley."
  </div>
</div>
            )}

            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Structure & Risk)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00E5FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    "Okay, that gives me a great picture of the inside. Last thing before we talk numbers—just to check my standard boxes, have you guys noticed any settling with the foundation, or are there any unpermitted add-ons we'd need to factor in?"
  </div>

  {formData.propertyType !== 'Multi-Family' && (
    <div className="mb-6 animate-slideIn">
      <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Structural Red Flags / Unpermitted Work</label>
      
              <div className="mb-6">
                <label className="text-xs text-black uppercase font-black block mb-2">MAJOR RED FLAGS (Select all that apply)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {['Foundation / Structural Issues', 'Unpermitted Additions / ADU', 'Fire Damage', 'Water Damage / Mold', 'City Code Violations / Red Tags', 'Known Liens / Judgments'].map(flag => {
                    const isSelected = formData.majorRedFlags?.includes(flag);
                    return (
                      <button 
                        key={flag}
                        onClick={() => {
                          const current = formData.majorRedFlags || [];
                          updateForm('majorRedFlags', isSelected ? current.filter(f => f !== flag) : [...current, flag]);
                        }} 
                        className={"px-4 py-3 text-xs tracking-wide uppercase transition-all cursor-pointer " + (isSelected ? "bg-[#FF1111] text-white font-black italic border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1" : "bg-white text-black font-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5")}
                      >
                        {flag}
                      </button>
                    )
                  })}
                </div>

                <div className="flex flex-col gap-4 mt-6">
                  {formData.majorRedFlags?.includes('Foundation / Structural Issues') && (
                    <div className="bg-red-50 p-4 border-4 border-[#FF1111] animate-slideIn">
                      <div className="text-black font-black italic mb-3">"You mentioned the foundation—are we talking about standard hairline cracks, or has there been major sinking and shifting?"</div>
                      <div className="flex flex-wrap gap-3">
                        {['Minor Settling / Cracks', 'Major Sinking / Shifting'].map(opt => (
                          <button key={opt} onClick={() => updateForm('redFlagFoundation', opt)} className={"px-4 py-2 font-black uppercase text-xs transition-all cursor-pointer " + (formData.redFlagFoundation === opt ? "bg-[#FF1111] text-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1" : "bg-white border-2 border-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Unpermitted Additions / ADU') && (
                    <div className="bg-red-50 p-4 border-4 border-[#FF1111] animate-slideIn">
                      <div className="text-black font-black italic mb-3">"For that unpermitted space, what exactly was added, and roughly how many square feet is it?"</div>
                      <div className="flex flex-col gap-3">
                        <input type="text" placeholder="ADDITION DESCRIPTION" value={formData.redFlagADUDesc || ''} onChange={(e) => updateForm('redFlagADUDesc', e.target.value)} className="w-full bg-white border-2 border-black p-3 font-black uppercase text-xs shadow-[2px_2px_0px_#000] focus:outline-none focus:translate-y-1 focus:shadow-none transition-all" />
                        <input type="number" placeholder="EST. SQFT" value={formData.redFlagADUSqft || ''} onChange={(e) => updateForm('redFlagADUSqft', e.target.value)} className="w-full max-w-sm bg-white border-2 border-black p-3 font-black uppercase text-xs shadow-[2px_2px_0px_#000] focus:outline-none focus:translate-y-1 focus:shadow-none transition-all" />
                      </div>
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Fire Damage') && (
                    <div className="bg-red-50 p-4 border-4 border-[#FF1111] animate-slideIn">
                      <div className="text-black font-black italic mb-3">"With the fire damage, was it mostly cosmetic smoke damage, or did it burn into the structural framing?"</div>
                      <div className="flex flex-wrap gap-3">
                        {['Cosmetic / Smoke Only', 'Structural / Framing Damage'].map(opt => (
                          <button key={opt} onClick={() => updateForm('redFlagFire', opt)} className={"px-4 py-2 font-black uppercase text-xs transition-all cursor-pointer " + (formData.redFlagFire === opt ? "bg-[#FF1111] text-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1" : "bg-white border-2 border-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Water Damage / Mold') && (
                    <div className="bg-red-50 p-4 border-4 border-[#FF1111] animate-slideIn">
                      <div className="text-black font-black italic mb-3">"For the water/mold issue—is there still an active leak or standing water, or is it an old leak that has completely dried out?"</div>
                      <div className="flex flex-wrap gap-3">
                        {['Active Leak / Wet', 'Past Damage (Dry)', 'Visible Mold Present'].map(opt => (
                          <button key={opt} onClick={() => updateForm('redFlagWater', opt)} className={"px-4 py-2 font-black uppercase text-xs transition-all cursor-pointer " + (formData.redFlagWater === opt ? "bg-[#FF1111] text-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1" : "bg-white border-2 border-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('City Code Violations / Red Tags') && (
                    <div className="bg-red-50 p-4 border-4 border-[#FF1111] animate-slideIn">
                      <div className="text-black font-black italic mb-3">"Since the city is involved, do you know if there are any active fines or daily penalties adding up?"</div>
                      <input type="number" placeholder="ACTIVE FINES / LIENS $" value={formData.redFlagFines || ''} onChange={(e) => updateForm('redFlagFines', e.target.value)} className="w-full max-w-sm bg-white border-2 border-black p-3 font-black uppercase text-xs shadow-[2px_2px_0px_#000] focus:outline-none focus:translate-y-1 focus:shadow-none transition-all" />
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

        {formData.propertyType !== 'Multi-Family' && (
                <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00E5FF] rounded-none mb-8 mt-12">
                  <div className="absolute top-0 left-0 bg-black text-white font-bangers tracking-widest px-4 py-1 uppercase text-sm -translate-y-1/2 translate-x-4 border-2 border-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    AGENT (AMENITIES & HOA)
                  </div>
                  
                  <div className="text-black font-black italic text-lg mb-6 leading-tight">
                    "Perfect. And just for my own records as I'm writing this up, is there a pool in the backyard, and is the property part of an active HOA?"
                  </div>

                  <div className="flex flex-col gap-6">
                    <div>
                      <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Pool</label>
                      <div className="flex flex-wrap gap-3">
                        {['Has Pool', 'No Pool'].map(opt => (
                          <button key={opt} onClick={() => updateForm('amenityPool', opt)} className={clsx("", formData.amenityPool === opt ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-800 uppercase font-bold block mb-2">HOA Status</label>
                      <div className="flex flex-wrap gap-3">
                        {['Active HOA', 'No HOA'].map(opt => (
                          <button key={opt} onClick={() => updateForm('amenityHOA', opt)} className={clsx("", formData.amenityHOA === opt ? "bg-[#00E5FF] text-black border-4 border-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-white border-2 border-black text-black font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                    </div>

                    {formData.amenityHOA === 'Active HOA' && (
                      <div className="animate-slideIn">
                        <label className="text-sm text-black uppercase font-black block mb-2">HOA Monthly Fee $</label>
                        <input type="number" placeholder="e.g. 250" value={formData.hoaMonthlyFee || ''} onChange={e => updateForm('hoaMonthlyFee', e.target.value)} className="w-full max-w-sm bg-white border-4 border-black rounded-none p-3 text-black focus:outline-none focus:shadow-[4px_4px_0px_#000] font-black uppercase transition-all" />
                      </div>
                    )}
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
                    className="w-full max-w-lg py-4 bg-[#FF00FF] text-[#000000] uppercase font-black italic text-2xl tracking-widest border-2 border-[#000000] rounded-none shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                  >
                    PROCEED TO PILLAR 3 &rarr;
                  </button>
                </div>
            )}
          </div>
        ))}} </>