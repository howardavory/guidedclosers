const fs = require('fs');
const path = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldMfBlock = `{formData.propertyType === 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Multi-Family Details)</div>
                <div className="relative bg-black/60 backdrop-blur-md border-4 border-[#00E5FF] p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6">
                  "Okay, good to know. Since it is a multi-unit, how many units are we talking, and what does the bed/bath mix look like for each? ... Got it. And are the tenants paying their own utilities, or are you covering water and power?"
                  <div style={{ marginTop: '15px', background: 'transparent', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <input type="number" placeholder="Number of Units..." value={formData.mfUnits} onChange={(e) => setFormData({...formData, mfUnits: e.target.value})} className="w-full p-3 bg-[#111] text-white border-2 border-white/20 font-bold text-lg focus:outline-none focus:bg-black focus:border-[#00E5FF] focus:shadow-[4px_4px_0px_#00E5FF] transition-all skew-x-[-2deg]" />
                      <input type="text" placeholder="Config (e.g. 4 units - 2b/1b)..." value={formData.mfConfig} onChange={(e) => setFormData({...formData, mfConfig: e.target.value})} className="w-full p-3 bg-[#111] text-white border-2 border-white/20 font-bold text-lg focus:outline-none focus:bg-black focus:border-[#00E5FF] focus:shadow-[4px_4px_0px_#00E5FF] transition-all skew-x-[-2deg]" />
                    </div>
                    <select value={formData.mfUtilities} onChange={(e) => setFormData({...formData, mfUtilities: e.target.value})} className="w-full p-3 bg-[#111] text-white border-2 border-white/20 font-bold text-lg focus:outline-none focus:bg-black focus:border-[#00E5FF] focus:shadow-[4px_4px_0px_#00E5FF] transition-all skew-x-[-2deg] appearance-none">
                      <option value="" disabled>Select Utility Setup...</option>
                      <option value="Separately Metered">Separately Metered</option>
                      <option value="Owner Pays All">Owner Pays All</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                </div>
              </div>
            )}`;

const newMfBlock = `{formData.propertyType === 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Multi-Family Details)</div>
                <div className="relative bg-black/60 backdrop-blur-md border-4 border-[#00E5FF] p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6">
                  {formData.mfUnitCount === '' && (
                    <span>"Okay, good to know. Since it's a multi-family, how many units are we talking total?"</span>
                  )}
                  {formData.mfUnitCount !== '' && formData.mfUnitsData.some(u => !u.occupancy || (u.occupancy === 'Tenant Occupied' && (!u.leaseType || !u.paymentStatus || !u.rentAmount))) && (
                    <span>"Got it. Just so I can build out the profile for my underwriters, let's just go unit by unit real quick. For the first unit, what's the bed and bath count? ... And is that one vacant, or do you have a tenant in there?"</span>
                  )}
                  {formData.mfUnitCount !== '' && formData.mfUnitsData.every(u => u.occupancy && (u.occupancy !== 'Tenant Occupied' || (u.leaseType && u.paymentStatus && u.rentAmount))) && (
                    <span>"Perfect. Last thing on the rental side—are the tenants paying all their own utilities, or are you guys covering things like water, trash, or landscaping?"</span>
                  )}
                  
                  <div style={{ marginTop: '15px', background: 'transparent', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                    <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Number of Units</div>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {['2 Units', '3 Units', '4 Units'].map(count => (
                        <button key={count} 
                          className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.mfUnitCount === count ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} 
                          onClick={() => {
                            const numUnits = parseInt(count.charAt(0));
                            setFormData({...formData, mfUnitCount: count, mfUnitsData: Array.from({length: numUnits}, () => ({layoutBeds: '', layoutBaths: '', occupancy: '', leaseType: '', paymentStatus: '', rentAmount: ''}))});
                          }}>
                          {count}
                        </button>
                      ))}
                    </div>

                    {formData.mfUnitsData.length > 0 && (
                      <div className="flex flex-col gap-4 mb-6">
                        {formData.mfUnitsData.map((unit, index) => (
                          <div key={index} className="bg-[#111] border-2 border-[#3b82f6] p-4 rounded-lg shadow-[4px_4px_0px_#000]">
                            <div className="text-[#00E5FF] font-bold uppercase tracking-widest mb-3 border-b border-gray-700 pb-2">Unit {String.fromCharCode(65 + index)}</div>
                            
                            <div className="mb-4">
                              <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Layout (Beds/Baths)</div>
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
                                <div>
                                  <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Monthly Rent Amount $</div>
                                  <input type="number" placeholder="e.g. 1500" value={unit.rentAmount} onChange={(e) => {
                                    const newData = [...formData.mfUnitsData]; newData[index].rentAmount = e.target.value; setFormData({...formData, mfUnitsData: newData});
                                  }} className="w-full p-2 bg-[#222] text-white border border-gray-600 font-bold text-sm focus:outline-none focus:border-[#FF0055] transition-all" />
                                </div>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 border-t border-gray-700 pt-4">
                      <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Owner-Paid Utilities</div>
                      <div className="flex flex-wrap gap-2">
                        {['Water', 'Sewer', 'Trash', 'Gas', 'Electric', 'Landscaping', 'None'].map(util => (
                          <button key={util} 
                            className={\`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-[2px_2px_0px_#fff] skew-x-[-5deg] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.mfOwnerUtilities.includes(util) ? 'bg-[#FFE600] text-black border-[#FFE600] shadow-[2px_2px_0px_#FFE600]' : 'bg-black border-white text-white'}\`} 
                            onClick={() => {
                              let newUtils = [...formData.mfOwnerUtilities];
                              if (util === 'None') {
                                newUtils = ['None'];
                              } else {
                                newUtils = newUtils.filter(u => u !== 'None');
                                if (newUtils.includes(util)) {
                                  newUtils = newUtils.filter(u => u !== util);
                                } else {
                                  newUtils.push(util);
                                }
                              }
                              setFormData({...formData, mfOwnerUtilities: newUtils});
                            }}>
                            {util}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}`;

if(code.includes(oldMfBlock)) {
  code = code.replace(oldMfBlock, newMfBlock);
  fs.writeFileSync(path, code);
  console.log("Replaced successfully");
} else {
  console.log("Could not find old block");
}
