const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/script/CallScript.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /<div style=\{\{ marginTop: '15px', background: 'rgba\(255,255,255,0\.4\)', padding: '15px', borderRadius: '12px' \}\}>[\s\S]*?<\/div>\s*<\/div>\s*\)\}/;

const replacement = `<div className="bg-white border-4 border-black box-border shadow-[8px_8px_0px_#FF00FF] p-6 mb-6 rounded-none mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input type="text" placeholder="RENT AMOUNT ($)..." value={formData.rentAmount || ''} onChange={(e) => updateForm('rentAmount', e.target.value)} className="bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                    <input type="text" placeholder="HOW DO THEY PAY? (ZELLE, CASH)..." value={formData.rentMethod || ''} onChange={(e) => updateForm('rentMethod', e.target.value)} className="bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                      <button className={"px-4 py-3 transition-all " + (formData.leaseType === 'M2M' ? "bg-[#00FFFF] border-4 border-black rounded-none text-black font-black italic shadow-[4px_4px_0px_#000]" : "bg-white border-2 border-black rounded-none text-black font-bold uppercase")} onClick={() => updateForm('leaseType', 'M2M')}>MONTH-TO-MONTH</button>
                      <button className={"px-4 py-3 transition-all " + (formData.leaseType === 'Lease' ? "bg-[#00FFFF] border-4 border-black rounded-none text-black font-black italic shadow-[4px_4px_0px_#000]" : "bg-white border-2 border-black rounded-none text-black font-bold uppercase")} onClick={() => updateForm('leaseType', 'Lease')}>FIXED LEASE</button>
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
                </div>
              </div>
            )}`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content);
    console.log("Tenant Follow-Up section updated to Neo-Brutalist successfully.");
} else {
    console.log("Regex did not match.");
}
