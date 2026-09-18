const fs = require('fs');
const path = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Initial State
code = code.replace(
  /mfConfig: '',/,
  "mfConfig: '',\n    mfUtilities: '',\n    vacantReason: '',"
);

// 2. Boolean definitions
code = code.replace(
  /const isTenant = formData\.occupancy === 'Tenant';/,
  "const isTenant = formData.occupancy === 'Tenant' || formData.occupancy === 'Fully Tenanted' || formData.occupancy === 'Partially Vacant' || formData.occupancy === 'Owner + Tenants';"
);
code = code.replace(
  /const isVacant = formData\.occupancy === 'Vacant';/,
  "const isVacant = formData.occupancy === 'Vacant' || formData.occupancy === 'Fully Vacant';"
);

// 3. Multi-Family Block
const oldMfBlock = `"Okay, good to know. Since it is a multi-unit, how many units are we talking, and what does the bed/bath mix look like for each?"
                  <div style={{ marginTop: '15px', background: 'transparent', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input type="number" placeholder="Number of Units..." value={formData.mfUnits} onChange={(e) => setFormData({...formData, mfUnits: e.target.value})} className="w-full p-3 bg-[#111] text-white border-2 border-white/20 font-bold text-lg focus:outline-none focus:bg-black focus:border-[#00E5FF] focus:shadow-[4px_4px_0px_#00E5FF] transition-all skew-x-[-2deg]" />
                      <input type="text" placeholder="Config (e.g. 4 units - 2b/1b)..." value={formData.mfConfig} onChange={(e) => setFormData({...formData, mfConfig: e.target.value})} className="w-full p-3 bg-[#111] text-white border-2 border-white/20 font-bold text-lg focus:outline-none focus:bg-black focus:border-[#00E5FF] focus:shadow-[4px_4px_0px_#00E5FF] transition-all skew-x-[-2deg]" />
                    </div>
                  </div>`;

const newMfBlock = `"Okay, good to know. Since it is a multi-unit, how many units are we talking, and what does the bed/bath mix look like for each? ... Got it. And are the tenants paying their own utilities, or are you covering water and power?"
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
                  </div>`;
code = code.replace(oldMfBlock, newMfBlock);

// 4. Occupancy Toggles
const oldOccToggles = `<button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.occupancy === 'Owner' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleSingleSelect('occupancy', 'Owner')}>Owner Occupied</button>
                  <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.occupancy === 'Tenant' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleSingleSelect('occupancy', 'Tenant')}>Tenant Occupied</button>
                  <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.occupancy === 'Vacant' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleSingleSelect('occupancy', 'Vacant')}>Vacant</button>`;

const newOccToggles = `{formData.propertyType === 'Multi-Family' ? (
                    <>
                      <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.occupancy === 'Fully Tenanted' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleSingleSelect('occupancy', 'Fully Tenanted')}>Fully Tenanted</button>
                      <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.occupancy === 'Partially Vacant' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleSingleSelect('occupancy', 'Partially Vacant')}>Partially Vacant</button>
                      <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.occupancy === 'Owner + Tenants' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleSingleSelect('occupancy', 'Owner + Tenants')}>Owner + Tenants</button>
                      <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.occupancy === 'Fully Vacant' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleSingleSelect('occupancy', 'Fully Vacant')}>Fully Vacant</button>
                    </>
                  ) : (
                    <>
                      <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.occupancy === 'Owner' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleSingleSelect('occupancy', 'Owner')}>Owner Occupied</button>
                      <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.occupancy === 'Tenant' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleSingleSelect('occupancy', 'Tenant')}>Tenant Occupied</button>
                      <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.occupancy === 'Vacant' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleSingleSelect('occupancy', 'Vacant')}>Vacant</button>
                    </>
                  )}`;
code = code.replace(oldOccToggles, newOccToggles);

// 5. Tenant Follow-up Block
const oldTenantText = `"And are they currently paying on time? What are they paying in rent right now, and are they on a month-to-month or long-term lease?"`;
const newTenantText = `{formData.propertyType === 'Multi-Family'
                    ? "And for the units that are occupied, is everyone currently paying on time? What is the total gross rent you're collecting right now, and are they on month-to-month or long-term leases?"
                    : "And are they currently paying on time? What are they paying in rent right now, and are they on a month-to-month or long-term lease?"}`;
code = code.replace(oldTenantText, newTenantText);

code = code.replace(
  /placeholder="Rent Amount \(\$\)\.\.\."/,
  `placeholder={formData.propertyType === 'Multi-Family' ? "Total Gross Rent ($)..." : "Rent Amount ($)..."}`
);

// 6. Vacant Follow-up Block
const oldVacantText = `"Okay, since it's vacant, how long has it been sitting empty? Have you had any issues with squatters or break-ins that we should know about?"
                  
                  <div style={{ marginTop: '15px', background: 'transparent', padding: '15px', borderRadius: '12px' }}>
                    <input type="text" placeholder="How long vacant? (e.g., 6 months)..." value={formData.vacantLength} onChange={(e) => setFormData({...formData, vacantLength: e.target.value})} className="w-full p-3 bg-[#111] text-white border-2 border-white/20 font-bold text-lg focus:outline-none focus:bg-black focus:border-[#00E5FF] focus:shadow-[4px_4px_0px_#00E5FF] transition-all skew-x-[-2deg]" style={{ width: '100%', marginBottom: '10px' }} />
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.vacantIssues.includes('Boarded Up') ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleToggle('vacantIssues', 'Boarded Up')}>Boarded Up</button>
                      <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.vacantIssues.includes('Squatters') ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleToggle('vacantIssues', 'Squatters')}>Squatters</button>
                      <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.vacantIssues.includes('Vandalism') ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleToggle('vacantIssues', 'Vandalism')}>Vandalized</button>
                    </div>
                  </div>`;

const newVacantText = `{formData.propertyType === 'Multi-Family' && formData.occupancy === 'Fully Vacant'
                    ? "Oh, the whole property is empty? Good to know. Were you in the middle of remodeling the units, or did the last batch of tenants just move out?"
                    : "Okay, since it's vacant, how long has it been sitting empty? Have you had any issues with squatters or break-ins that we should know about?"}
                  
                  {formData.propertyType === 'Multi-Family' && formData.occupancy === 'Fully Vacant' ? (
                    <div style={{ marginTop: '15px', background: 'transparent', padding: '15px', borderRadius: '12px' }}>
                      <input type="text" placeholder="Reason for Vacancy..." value={formData.vacantReason} onChange={(e) => setFormData({...formData, vacantReason: e.target.value})} className="w-full p-3 bg-[#111] text-white border-2 border-white/20 font-bold text-lg focus:outline-none focus:bg-black focus:border-[#00E5FF] focus:shadow-[4px_4px_0px_#00E5FF] transition-all skew-x-[-2deg]" style={{ width: '100%' }} />
                    </div>
                  ) : (
                    <div style={{ marginTop: '15px', background: 'transparent', padding: '15px', borderRadius: '12px' }}>
                      <input type="text" placeholder="How long vacant? (e.g., 6 months)..." value={formData.vacantLength} onChange={(e) => setFormData({...formData, vacantLength: e.target.value})} className="w-full p-3 bg-[#111] text-white border-2 border-white/20 font-bold text-lg focus:outline-none focus:bg-black focus:border-[#00E5FF] focus:shadow-[4px_4px_0px_#00E5FF] transition-all skew-x-[-2deg]" style={{ width: '100%', marginBottom: '10px' }} />
                      <div className="flex flex-wrap gap-3 mt-4">
                        <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.vacantIssues.includes('Boarded Up') ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleToggle('vacantIssues', 'Boarded Up')}>Boarded Up</button>
                        <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.vacantIssues.includes('Squatters') ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleToggle('vacantIssues', 'Squatters')}>Squatters</button>
                        <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.vacantIssues.includes('Vandalism') ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleToggle('vacantIssues', 'Vandalism')}>Vandalized</button>
                      </div>
                    </div>
                  )}`;

code = code.replace(oldVacantText, newVacantText);

fs.writeFileSync(path, code);
console.log('Update Complete!');
