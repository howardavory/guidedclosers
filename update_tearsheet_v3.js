const fs = require('fs');
const path = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/documents/TearSheet.jsx';
let code = fs.readFileSync(path, 'utf8');

const regex = /<p className="text-\[10px\] text-blue-600 uppercase tracking-widest mb-1 font-bold">Multi-Family Breakdown<\/p>([\s\S]*?)<\/div>\s*<\/div>\s*<div className="comic-paper/;

// Create replacement
const replacement = `<p className="text-[10px] text-blue-600 uppercase tracking-widest mb-1 font-bold">Multi-Family Breakdown</p>
                {formData?.mfUnitsData?.map((unit, idx) => (
                  <div key={idx} className="bg-white p-2 border border-black rounded text-sm shadow-[2px_2px_0px_#000]">
                    <div className="font-bold text-black border-b border-gray-200 mb-1 pb-1">Unit {String.fromCharCode(65 + idx)}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-gray-500 font-bold">Layout:</span> {unit.layoutBeds || '-'} / {unit.layoutBaths || '-'}</div>
                      <div><span className="text-gray-500 font-bold">Cond:</span> {unit.condition || '-'}</div>
                      <div><span className="text-gray-500 font-bold">Status:</span> <span className={unit.occupancy === 'Vacant' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{unit.occupancy || '-'}</span></div>
                      {unit.occupancy === 'Tenant Occupied' && (
                        <>
                          <div><span className="text-gray-500 font-bold">Rent:</span> \${unit.rentAmount || '-'} ({unit.leaseType || '-'})</div>
                          <div><span className="text-gray-500 font-bold">Payment:</span> {unit.paymentStatus || '-'}</div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                
                {formData?.mfUtilityMetering && (
                  <div className="mt-2 bg-gray-100 p-2 border border-gray-300 rounded text-xs">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Utilities</p>
                    <p className="font-bold text-black mb-1">{formData.mfUtilityMetering}</p>
                    {formData.mfUtilityMetering === 'Landlord Pays Some/All' && (
                      <>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {formData.mfOwnerUtilities?.map(util => (
                            <span key={util} className="bg-black text-white text-[10px] px-2 py-0.5 rounded-sm font-bold shadow-[2px_2px_0px_#00E5FF]">{util}</span>
                          ))}
                        </div>
                        <p className="text-gray-600 font-bold">Est Cost: <span className="text-black">\${formData.mfUtilityCost || '0'}/mo</span></p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Triage Condition */}
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Known Conditions</p>
              <div className="flex flex-wrap gap-2">
                {masterLead?.triageCondition?.roof && <span className="bg-[#FF0055] text-white text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">Roof: {masterLead.triageCondition.roof}</span>}
                {masterLead?.triageCondition?.hvac && <span className="bg-[#00E5FF] text-black text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">HVAC: {masterLead.triageCondition.hvac}</span>}
                {masterLead?.triageCondition?.plumbing && <span className="bg-[#FFE600] text-black text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">Plumbing: {masterLead.triageCondition.plumbing}</span>}
                {masterLead?.triageCondition?.electrical && <span className="bg-[#B400FF] text-white text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">Electrical: {masterLead.triageCondition.electrical}</span>}
                
                {(!masterLead?.triageCondition?.roof && !masterLead?.triageCondition?.hvac && !masterLead?.triageCondition?.plumbing && !masterLead?.triageCondition?.electrical) && (
                  <span className="text-sm font-bold text-gray-500">No major issues reported</span>
                )}
              </div>
            </div>
            
            {/* Deal Score */}
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Deal Viability Score</p>
              <div className="flex items-center gap-2">
                <div className="h-3 flex-1 border border-black rounded-full overflow-hidden bg-white shadow-inner">
                  <div className="h-full transition-all duration-500 ease-out" style={{ width: \`\${dealScore}%\`, backgroundColor: scoreColor }}></div>
                </div>
                <span className="text-xs font-bold text-black font-mono">{dealScore}/100</span>
              </div>
            </div>
          </div>
      </div>

        {!contractDraft ? (
          <div className="comic-paper`;

code = code.replace(regex, replacement);
fs.writeFileSync(path, code);
console.log('TearSheet V3 Logic Injected successfully!');
