const fs = require('fs');
const path = 'src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

// Target 1: Main Lead Profile Lot Size
// It starts with: <div>\n                  <label className="text-[#E5C158] font-extrabold text-[10px] uppercase tracking-widest mb-2">Lot Size ({formData.lotSizeMeasure})</label>
// And ends after the two buttons.
const oldProfileLotSize = `                <div>
                  <label className="text-[#E5C158] font-extrabold text-[10px] uppercase tracking-widest mb-2">Lot Size ({formData.lotSizeMeasure})</label>
                  <div className="flex gap-2 items-center">
                    <input type="number" value={formData.lotSize || ''} onChange={e => updateForm('lotSize', e.target.value)} placeholder="0" className="flex-1 w-full bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all" />
                    <div className="w-full bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all">
                      <button 
                        className={clsx("", formData.lotSizeMeasure === 'SQFT' ? "bg-[#1A1A1A] text-[#E5C158] shadow-sm" : "text-gray-500 hover:text-gray-700")} 
                        onClick={() => {
                          if (formData.lotSizeMeasure !== 'SQFT') {
                            if (formData.lotSize) {
                              updateForm('lotSize', Math.round(parseFloat(formData.lotSize) * 43560).toString());
                            }
                            updateForm('lotSizeMeasure', 'SQFT');
                          }
                        }}
                      >
                        SQFT
                      </button>
                      <button 
                        className={clsx("", formData.lotSizeMeasure === 'ACRES' ? "bg-[#1A1A1A] text-[#E5C158] shadow-sm" : "text-gray-500 hover:text-gray-700")} 
                        onClick={() => {
                          if (formData.lotSizeMeasure !== 'ACRES') {
                            if (formData.lotSize) {
                              const sqft = parseFloat(formData.lotSize);
                              updateForm('lotSize', (sqft / 43560).toFixed(4).replace(/.?0+$/, ''));
                            }
                            updateForm('lotSizeMeasure', 'ACRES');
                          }
                        }}
                      >
                        ACRES
                      </button>
                    </div>
                  </div>
                </div>`;

const newProfileLotSize = `                <div>
                  <label className="text-[#E5C158] font-extrabold text-[10px] uppercase tracking-widest mb-2">Lot Size ({formData.lotSizeMeasure})</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="number" 
                      value={formData.lotSize || ''} 
                      onChange={e => updateForm('lotSize', e.target.value)} 
                      placeholder="0" 
                      className="flex-1 w-full bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all" 
                    />
                    <div className="flex bg-[#1A1A1A] border border-[#333333] rounded-xl p-1 shrink-0">
                      <button 
                        className={clsx("text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer", formData.lotSizeMeasure === 'SQFT' ? "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] shadow-md" : "text-[#A0A0A0] hover:text-[#F5F5F5]")} 
                        onClick={() => {
                          if (formData.lotSizeMeasure !== 'SQFT') {
                            if (formData.lotSize) {
                              updateForm('lotSize', Math.round(parseFloat(formData.lotSize) * 43560).toString());
                            }
                            updateForm('lotSizeMeasure', 'SQFT');
                          }
                        }}
                      >
                        SQFT
                      </button>
                      <button 
                        className={clsx("text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer", formData.lotSizeMeasure === 'ACRES' ? "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] shadow-md" : "text-[#A0A0A0] hover:text-[#F5F5F5]")} 
                        onClick={() => {
                          if (formData.lotSizeMeasure !== 'ACRES') {
                            if (formData.lotSize) {
                              const sqft = parseFloat(formData.lotSize);
                              updateForm('lotSize', (sqft / 43560).toFixed(4).replace(/.?0+$/, ''));
                            }
                            updateForm('lotSizeMeasure', 'ACRES');
                          }
                        }}
                      >
                        ACRES
                      </button>
                    </div>
                  </div>
                </div>`;


// Target 2: Land-Specific Lot Size (Pillar 2)
const oldLandLotSize = `                      <div>
                        <label className="text-[#E5C158] font-extrabold text-[10px] uppercase tracking-widest mb-2">Lot Size / Acreage</label>
                        <div className="flex bg-gray-200 rounded p-0.5 mb-2 w-max">
                          <button className={clsx("px-3 py-1 text-xs font-bold  rounded", formData.landSizeMeasure === 'SQFT' ? "bg-[#1A1A1A]/80 text-white shadow-sm" : "text-gray-500 hover:bg-gray-300")} onClick={() => updateForm('landSizeMeasure', 'SQFT')}>SQFT</button>
                          <button className={clsx("px-3 py-1 text-xs font-bold  rounded", formData.landSizeMeasure === 'ACRES' ? "bg-[#1A1A1A]/80 text-white shadow-sm" : "text-gray-500 hover:bg-gray-300")} onClick={() => updateForm('landSizeMeasure', 'ACRES')}>ACRES</button>
                        </div>
                        <input 
                          type="number" 
                          value={formData.landSize || ''} 
                          onChange={e => updateForm('landSize', e.target.value)} 
                          className="w-full bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all" 
                          placeholder={formData.landSizeMeasure === 'SQFT' ? "e.g. 43560" : "e.g. 1.5"}
                        />
                      </div>`;

const newLandLotSize = `                      <div>
                        <label className="text-[#E5C158] font-extrabold text-[10px] uppercase tracking-widest mb-2">Lot Size / Acreage</label>
                        <div className="flex bg-[#1A1A1A] border border-[#333333] rounded-xl p-1 w-max mb-3">
                          <button className={clsx("px-4 py-2 text-xs font-bold rounded-lg transition-all", formData.landSizeMeasure === 'SQFT' ? "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] shadow-md" : "text-[#A0A0A0] hover:text-[#F5F5F5]")} onClick={() => updateForm('landSizeMeasure', 'SQFT')}>SQFT</button>
                          <button className={clsx("px-4 py-2 text-xs font-bold rounded-lg transition-all", formData.landSizeMeasure === 'ACRES' ? "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] shadow-md" : "text-[#A0A0A0] hover:text-[#F5F5F5]")} onClick={() => updateForm('landSizeMeasure', 'ACRES')}>ACRES</button>
                        </div>
                        <input 
                          type="number" 
                          value={formData.landSize || ''} 
                          onChange={e => updateForm('landSize', e.target.value)} 
                          className="w-full bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all" 
                          placeholder={formData.landSizeMeasure === 'SQFT' ? "e.g. 43560" : "e.g. 1.5"}
                        />
                      </div>`;

let count = 0;
if (code.includes(oldProfileLotSize)) {
    code = code.split(oldProfileLotSize).join(newProfileLotSize);
    count++;
} else {
    console.log("Could not find oldProfileLotSize block");
}

if (code.includes(oldLandLotSize)) {
    code = code.split(oldLandLotSize).join(newLandLotSize);
    count++;
} else {
    console.log("Could not find oldLandLotSize block");
}

if (count > 0) {
    fs.writeFileSync(path, code);
    console.log(`Replaced ${count} blocks successfully.`);
}

