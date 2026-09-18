const fs = require('fs');

const filePath = "src/components/script/CallScript.jsx";
let c = fs.readFileSync(filePath, "utf-8");

const replacement = `<button 
          onClick={() => {
            if (onReturn) onReturn();
          }} 
          className="mb-6 flex items-center gap-2 px-6 py-2 bg-black border-4 border-black text-white hover:text-[#FFE600] hover:bg-[#FF0055] transition-all font-bangers text-xl tracking-widest shadow-[4px_4px_0px_#00E5FF] transform -skew-x-2"
        >
          &larr; Return to Dispatch
        </button>

          {/* LEAD CONTEXT (Always Visible) */}
          <div className="mb-6 p-5 bg-black border-4 border-black shadow-[8px_8px_0px_#FFE600] transform skew-x-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-full bg-[#FFE600] opacity-10 transform skew-x-12"></div>
            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div>
                <label className="text-sm font-bangers tracking-widest text-[#FFE600] uppercase mb-2 block drop-shadow-[1px_1px_0px_#000]">Lead Source</label>
                <select value={formData.activeSource} onChange={e => updateForm('activeSource', e.target.value)} className="w-full bg-black/60 backdrop-blur-md border-2 border-[#FFE600] p-3 text-white font-bangers text-xl tracking-widest focus:border-[#00E5FF] outline-none cursor-pointer">
                  <option value="In-House">In-House</option>
                  <option value="Bold Street">Bold Street</option>
                  <option value="Self Gen">Self Gen</option>
                  <option value="Agent Outreach">Agent Outreach</option>
                  <option value="PPC">PPC / Web</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bangers tracking-widest text-[#FFE600] uppercase mb-2 block drop-shadow-[1px_1px_0px_#000]">Ownership Profile</label>
                <select value={formData.manualEntityType} onChange={e => updateForm('manualEntityType', e.target.value)} className="w-full bg-black/60 backdrop-blur-md border-2 border-[#FFE600] p-3 text-white font-bangers text-xl tracking-widest focus:border-[#00E5FF] outline-none cursor-pointer">
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="TRUST">Trust</option>
                  <option value="LLC">LLC</option>
                </select>
              </div>
            </div>
          </div>

        {activeLead?.isManual && (
          <div className="mb-6 p-6 bg-black border-4 border-black shadow-[8px_8px_0px_#00E5FF] transform -skew-x-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-full bg-[#00E5FF] opacity-10 transform -skew-x-12"></div>
            <h4 className="text-[#00E5FF] font-bangers text-3xl tracking-widest drop-shadow-[2px_2px_0px_#000] mb-4 flex items-center gap-3 relative z-10"><MapPin size={24} className="text-[#FF0055]" /> MANUAL SUBMISSION DETAILS</h4>
            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div>
                <label className="text-sm font-bangers tracking-widest text-[#00E5FF] uppercase mb-2 block drop-shadow-[1px_1px_0px_#000]">Lead Name</label>
                <input type="text" value={formData.manualName} onChange={e => updateForm('manualName', e.target.value)} className="w-full bg-black/60 backdrop-blur-md border-2 border-[#00E5FF] p-3 text-white font-bold focus:border-[#FF0055] outline-none placeholder-gray-600" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-sm font-bangers tracking-widest text-[#00E5FF] uppercase mb-2 block drop-shadow-[1px_1px_0px_#000]">Property Address</label>
                <div className="flex gap-3">
                  {isLoaded ? (
                    <Autocomplete onLoad={(auto) => autocompleteRef.current = auto} onPlaceChanged={handlePlaceChanged} className="flex-1">
                      <input type="text" value={formData.manualAddress} onChange={e => updateForm('manualAddress', e.target.value)} className="w-full bg-black/60 backdrop-blur-md border-2 border-[#00E5FF] p-3 text-white font-bold focus:border-[#FF0055] outline-none placeholder-gray-600" placeholder="Search Google Maps..." />
                    </Autocomplete>
                  ) : (
                    <input type="text" value={formData.manualAddress} onChange={e => updateForm('manualAddress', e.target.value)} className="w-full bg-black/60 backdrop-blur-md border-2 border-[#00E5FF] p-3 text-white font-bold focus:border-[#FF0055] outline-none placeholder-gray-600" placeholder="123 Main St..." />
                  )}
                  <button onClick={pullBatchLeadsData} disabled={isPullingData} className="px-6 bg-[#00E5FF] text-black border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] font-bangers tracking-widest text-xl hover:bg-[#FF0055] hover:text-white transition-all flex items-center justify-center transform skew-x-2">
                    {isPullingData ? '...' : <Database size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
`;

c = c.replace(/<div className="flex-1 overflow-y-auto pr-4 pb-32 hide-scrollbar mt-10">[\s\S]*?\{\/\*\s*PILLAR 1: OPENER\s*\*\/\}/, 
  '<div className="flex-1 overflow-y-auto pr-4 pb-32 hide-scrollbar mt-10">\n' + replacement + '\n\n        {/* PILLAR 1: OPENER */}');

fs.writeFileSync(filePath, c);
console.log("Restored and styled the missing header section successfully!");
