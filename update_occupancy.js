const fs = require('fs');
const path = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add isMfComplete logic near isTenant
code = code.replace(
  /const isTenant = .*?;/,
  `const isTenant = formData.occupancy === 'Tenant' || formData.occupancy === 'Fully Tenanted' || formData.occupancy === 'Partially Vacant' || formData.occupancy === 'Owner + Tenants';
  const isMfComplete = formData.propertyType === 'Multi-Family' && formData.mfUnitCount !== '' && formData.mfUnitsData.every(u => u.occupancy && (u.occupancy !== 'Tenant Occupied' || (u.leaseType && u.paymentStatus && u.rentAmount)));`
);

// 2. We need to hide the generic Occupancy block if Multi-Family
// Find the block: {formData.propertyType !== 'Multi-Family' && ( ... )}

const genericOccRegex = /\{\/\* Occupancy Script \*\/\}([\s\S]*?)<div className="flex flex-wrap gap-3 mt-4" style=\{\{ marginTop: '1\.5rem', marginBottom: '1rem' \}\}>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*\)\}/;

const newGenericOcc = `{/* Occupancy Script */}
            {formData.propertyType !== 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Occupancy)</div>
                <div className="relative bg-black/60 backdrop-blur-md border-4 border-[#00E5FF] p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6">
                  {formData.propertyType === 'Single Family' && (
                    <span>"So to get a better idea of what we're working with... are you guys living in the property right now, or is it tenanted out?"</span>
                  )}
                  {formData.propertyType === 'Condo/Townhome' && (
                    <span>"So to get a better idea of what we're working with... are you guys living in the condo right now, or is it tenanted out?"</span>
                  )}
                  {formData.propertyType === 'Mobile Home' && (
                    <span>"So to get a better idea of what we're working with... are you living in the mobile home right now, or is it tenanted out?"</span>
                  )}
                  {formData.propertyType === 'Land' && (
                    <span>"So to get a better idea of what we're working with... are there any structures on the land right now, or are you renting it out to anyone?"</span>
                  )}

                {/* Occupancy Toggles */}
                <div className="flex flex-wrap gap-3 mt-4" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                      <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.occupancy === 'Owner' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleSingleSelect('occupancy', 'Owner')}>Owner Occupied</button>
                      <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.occupancy === 'Tenant' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleSingleSelect('occupancy', 'Tenant')}>Tenant Occupied</button>
                      <button className={\`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu \${formData.occupancy === 'Vacant' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}\`} onClick={() => handleSingleSelect('occupancy', 'Vacant')}>Vacant</button>
                </div>
                </div>
              </div>
            )}`;

code = code.replace(genericOccRegex, newGenericOcc);

// 3. Hide Dynamic Follow-up: Tenant if Multi-Family
// Multi-Family now handles Tenant Follow-up per unit card
code = code.replace(
  /\{isTenant && \(/g,
  `{isTenant && formData.propertyType !== 'Multi-Family' && (`
);

// 4. Hide Dynamic Follow-up: Vacant if Multi-Family
code = code.replace(
  /\{isVacant && \(/g,
  `{isVacant && formData.propertyType !== 'Multi-Family' && (`
);

// 5. Decision Makers Check
code = code.replace(
  /\{formData\.occupancy && \(/,
  `{(formData.occupancy || isMfComplete) && (`
);

fs.writeFileSync(path, code);
console.log('Update Complete!');
