const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/documents/TearSheet.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const triageReplacement = `
            {/* Utilities & Infrastructure */}
            <div className="mt-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Infrastructure & Utilities</p>
              <div className="flex flex-wrap gap-2">
                {formData?.septicSewer && <span className="bg-[#B400FF] text-white text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">Sewer: {formData.septicSewer}</span>}
                {formData?.solarSystem && <span className="bg-[#FFE600] text-black text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">Solar: {formData.solarSystem} {formData.solarMonthlyPayment ? \`($\${formData.solarMonthlyPayment}/mo)\` : ''}</span>}
                {formData?.timelineType && <span className="bg-[#00E5FF] text-black text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">Timeline: {formData.timelineType}</span>}
              </div>
            </div>

            {/* Danger Matrix */}
            {formData?.majorRedFlags && formData.majorRedFlags.length > 0 && (
              <div className="mt-2">
                <p className="text-[10px] text-[#FF1111] uppercase tracking-widest mb-1 font-black">MAJOR RED FLAGS</p>
                <div className="flex flex-wrap gap-1">
                  {formData.majorRedFlags.map((flag, idx) => (
                    <span key={idx} className="bg-[#FF1111] text-white text-xs px-2 py-1 font-black italic rounded-sm shadow-[2px_2px_0px_#000]">{flag}</span>
                  ))}
                </div>
                {formData?.sfStructuralFlags && (
                   <p className="text-xs text-red-600 mt-1 font-bold italic">Details: {formData.sfStructuralFlags}</p>
                )}
              </div>
            )}

            {/* Triage Condition */}
            <div className="mt-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Known Conditions</p>
              <div className="flex flex-wrap gap-2">
                {(formData?.roof?.length > 0) && <span className="bg-[#FF0055] text-white text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">Roof: {formData.roof.join(', ')}</span>}
                {(formData?.hvac?.length > 0) && <span className="bg-[#00E5FF] text-black text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">HVAC: {formData.hvac.join(', ')}</span>}
                {(formData?.plumbing?.length > 0) && <span className="bg-[#FFE600] text-black text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">Plumbing: {formData.plumbing.join(', ')}</span>}
                {(formData?.electrical?.length > 0) && <span className="bg-[#B400FF] text-white text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">Electrical: {formData.electrical.join(', ')}</span>}
                
                {(!formData?.roof?.length && !formData?.hvac?.length && !formData?.plumbing?.length && !formData?.electrical?.length) && (
                  <span className="text-sm font-bold text-gray-500">No major issues reported</span>
                )}
              </div>
            </div>
`;

// Replace Triage Condition section entirely
const oldTriageSectionRegex = /\{\/\*\s*Triage Condition\s*\*\/\}.*?(?=\{\/\*\s*Deal Score\s*\*\/\})/s;

if (oldTriageSectionRegex.test(content)) {
    content = content.replace(oldTriageSectionRegex, triageReplacement);
    fs.writeFileSync(filePath, content);
    console.log("TearSheet updated successfully with all fast facts.");
} else {
    console.log("Could not find Triage Condition block to replace.");
}
