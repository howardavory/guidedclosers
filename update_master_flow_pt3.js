const fs = require('fs');
const path = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

const mfStartStr = "{formData.propertyType === 'Multi-Family' && (";
const mfEndStr = "{formData.propertyType === 'Condo/Townhome' && (";

const startIndex = code.indexOf(mfStartStr);
const endIndex = code.indexOf(mfEndStr);

if (startIndex !== -1 && endIndex !== -1) {
  const newMfBlock = `{formData.propertyType === 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Multi-Family Phase 1 & 2)</div>
                <div className="relative bg-black/60 backdrop-blur-md border-4 border-[#00E5FF] p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6">
                  {formData.mfBuildingConfig === '' && (
                    <span>"Got it, a multi-unit. First, just so I can accurately picture the lot, is this all one single building, or are there multiple structures on the property?"</span>
                  )}
                  {formData.mfBuildingConfig !== '' && formData.mfUnitCount === '' && (
                    <span>"Makes sense. Let's break down the rent roll real quick so I can start running my formulas. How many units total are we talking?"</span>
                  )}
                  {formData.mfUnitCount !== '' && formData.mfUnitsData.some(u => !u.occupancy || (u.occupancy === 'Tenant Occupied' && (!u.leaseType || !u.paymentStatus || !u.rentAmount))) && (
                    <span>"Okay, makes sense. Let's break down the rent roll real quick so I can start running my formulas. For the first unit, what's the bed and bath count? ... And is someone living in that one, or is it vacant right now?"</span>
                  )}
                  {formData.mfUnitCount !== '' && formData.mfUnitsData.every(u => u.occupancy && (u.occupancy !== 'Tenant Occupied' || (u.leaseType && u.paymentStatus && u.rentAmount))) && (
                    <span>"Perfect. And just to cap off the rental side—are the meters fully split so the tenants pay their own utilities, or are you footing the bill for things like water or trash?"</span>
                  )}
                  
                  <div style={{ marginTop: '15px', background: 'transparent', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                    
                    <div className="mb-6">
                      <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Building Configuration</div>
                      <div className="flex flex-wrap gap-3">
                        {['1 Single Building', 'Multiple Buildings', 'Main House + ADU(s)'].map(config => (
                          <button key={config} 
                            className={\`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-[2px_2px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.mfBuildingConfig === config ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[2px_2px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} 
                            onClick={() => setFormData({...formData, mfBuildingConfig: config})}>
                            {config}
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.mfBuildingConfig !== '' && (
                      <div className="mb-6">
                        <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Total Units</div>
                        <div className="flex flex-wrap gap-3">
                          {['2 Units', '3 Units', '4 Units'].map(count => (
                            <button key={count} 
                              className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.mfUnitCount === count ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} 
                              onClick={() => {
                                const numUnits = parseInt(count.charAt(0));
                                setFormData({...formData, mfUnitCount: count, mfUnitsData: Array.from({length: numUnits}, () => ({layoutBeds: '', layoutBaths: '', condition: '', occupancy: '', leaseType: '', paymentStatus: '', rentAmount: ''}))});
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
                            <div className="text-[#00E5FF] font-bold uppercase tracking-widest mb-3 border-b border-gray-700 pb-2">Unit {String.fromCharCode(65 + index)}</div>
                            
                            <div className="mb-4">
                              <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Layout</div>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {['Studio', '1 Bed', '2 Bed', '3+ Bed'].map(bed => (
                                  <button key={bed} className={\`px-3 py-1.5 border font-bold text-xs \${unit.layoutBeds === bed ? 'bg-[#3b82f6] text-white border-[#3b82f6]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all\`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].layoutBeds = bed; setFormData({...formData, mfUnitsData: newData});
                                  }}>{bed}</button>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {['1 Bath', '1.5 Bath', '2+ Bath'].map(bath => (
                                  <button key={bath} className={\`px-3 py-1.5 border font-bold text-xs \${unit.layoutBaths === bath ? 'bg-[#3b82f6] text-white border-[#3b82f6]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all\`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].layoutBaths = bath; setFormData({...formData, mfUnitsData: newData});
                                  }}>{bath}</button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Condition</div>
                              <div className="flex flex-wrap gap-2">
                                {['Turnkey / Updated', 'Dated / Livable', 'Needs Heavy Rehab'].map(cond => (
                                  <button key={cond} className={\`px-3 py-1.5 border font-bold text-xs \${unit.condition === cond ? 'bg-[#FF0055] text-white border-[#FF0055]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all\`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].condition = cond; setFormData({...formData, mfUnitsData: newData});
                                  }}>{cond}</button>
                                ))}
                              </div>
                            </div>

                            <div className="mb-2">
                              <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Occupancy Status</div>
                              <div className="flex flex-wrap gap-2">
                                {['Owner Occupied', 'Tenant Occupied', 'Vacant'].map(occ => (
                                  <button key={occ} className={\`px-3 py-1.5 border font-bold text-xs \${unit.occupancy === occ ? 'bg-[#00E676] text-black border-[#00E676]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all\`} onClick={() => {
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
                                      <button key={lt} className={\`flex-1 py-1.5 border font-bold text-xs \${unit.leaseType === lt ? 'bg-[#FF0055] text-white border-[#FF0055]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all\`} onClick={() => {
                                        const newData = [...formData.mfUnitsData]; newData[index].leaseType = lt; setFormData({...formData, mfUnitsData: newData});
                                      }}>{lt}</button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Payment Status</div>
                                  <div className="flex gap-2">
                                    {['On Time', 'Behind'].map(ps => (
                                      <button key={ps} className={\`flex-1 py-1.5 border font-bold text-xs \${unit.paymentStatus === ps ? 'bg-[#FF0055] text-white border-[#FF0055]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all\`} onClick={() => {
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
                          <button className={\`px-4 py-3 border-2 font-bold tracking-widest text-sm shadow-[2px_2px_0px_#fff] skew-x-[-2deg] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.mfUtilityMetering === 'Separately Metered (Tenant Pays All)' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[2px_2px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => setFormData({...formData, mfUtilityMetering: 'Separately Metered (Tenant Pays All)', mfOwnerUtilities: [], mfUtilityCost: ''})}>Tenants Pay All</button>
                          <button className={\`px-4 py-3 border-2 font-bold tracking-widest text-sm shadow-[2px_2px_0px_#fff] skew-x-[-2deg] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.mfUtilityMetering === 'Landlord Pays Some/All' ? 'bg-[#FFE600] text-black border-[#FFE600] shadow-[2px_2px_0px_#FFE600]' : 'bg-black border-white text-white'}\`} onClick={() => setFormData({...formData, mfUtilityMetering: 'Landlord Pays Some/All'})}>Landlord Pays Some/All</button>
                        </div>
                        
                        {formData.mfUtilityMetering === 'Landlord Pays Some/All' && (
                          <div className="mt-4 p-4 bg-black border border-gray-800 rounded-lg">
                            <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Which Utilities?</div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {['Water', 'Sewer', 'Trash', 'Gas', 'Electric', 'Landscaping'].map(util => (
                                <button key={util} 
                                  className={\`px-4 py-1.5 border font-bold text-xs shadow-[2px_2px_0px_#fff] skew-x-[-5deg] \${formData.mfOwnerUtilities.includes(util) ? 'bg-[#FFE600] text-black border-[#FFE600] shadow-[2px_2px_0px_#FFE600]' : 'bg-black border-gray-600 text-gray-300'} transition-all\`} 
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
            
`;
  code = code.substring(0, startIndex) + newMfBlock + code.substring(endIndex);
  fs.writeFileSync(path, code);
  console.log('Fixed Phases 1-3 with Unit Condition & Rent labels');
} else {
  console.log('Could not find replace targets');
}
