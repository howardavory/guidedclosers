const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/script/CallScript.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Inject masterLead into useStore if not there
if (content.includes('const { updateTriageCondition, updatePropertyDetails, updateDisposition } = useStore();')) {
    content = content.replace(
        'const { updateTriageCondition, updatePropertyDetails, updateDisposition } = useStore();',
        'const { updateTriageCondition, updatePropertyDetails, updateDisposition, masterLead } = useStore();\n  const totalMAO = masterLead?.financialEngine?.mao || 0;'
    );
} else if (content.includes('const { updateTriageCondition, updatePropertyDetails, updateDisposition, masterLead } = useStore();') && !content.includes('totalMAO')) {
    content = content.replace(
        'const { updateTriageCondition, updatePropertyDetails, updateDisposition, masterLead } = useStore();',
        'const { updateTriageCondition, updatePropertyDetails, updateDisposition, masterLead } = useStore();\n  const totalMAO = masterLead?.financialEngine?.mao || 0;'
    );
}

// 2. Replace Pillars 3-6
const startMarker = '{/* PILLAR 3: MOTIVATION & TIMELINE */}';
const endMarker = '{/* Completion state */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find start or end markers for replacement.");
    process.exit(1);
}

let beforeContent = content.substring(0, startIndex);
let afterContent = content.substring(endIndex);

const newContent = `{/* PILLAR 3: ESCROW TIMELINE & LOGISTICS */}
        {activeSource !== 'Agent Outreach' && (
          <div id="pillar-3" className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#FFFF00] rounded-none mb-8 transition-all duration-500 ease-in-out" style={{ 
            opacity: currentStep >= 3 ? 1 : 0.3,
            pointerEvents: currentStep >= 3 ? 'auto' : 'none',
            filter: currentStep >= 3 ? 'none' : 'grayscale(80%)'
          }}>
            <div className="flex items-center gap-2 mb-6 text-black">
              <Clock size={24} />
              <h3 className="m-0 uppercase tracking-widest font-black text-xl">Pillar 3: Escrow Timeline & Logistics</h3>
            </div>

            <div className="flex flex-col mb-2 animate-slideIn">
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Timeline / Relocation)</span>
              <div className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#FFFF00] text-xl font-black italic text-black leading-relaxed rounded-none mb-6">
                "Okay, I've got enough here on the condition. Let's just say we do agree on a price that makes sense... our average close time is about 30 to 40 days on average, how does that work for you? What are your guys' relocation plans looking like? Did you have somewhere to go, or is that something you guys have to figure out?"
              </div>
              
              <div className="mb-6">
                <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Target Timeline</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['ASAP (7-14 Days)', 'Standard (30 Days)', 'Needs Time (60+ Days)', 'Concurrent Close'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => updateForm('timelineType', opt)} 
                      className={clsx(
                        "px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12", 
                        formData.timelineType === opt 
                          ? "bg-[#FFFF00] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" 
                          : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-800 uppercase font-bold block mb-1">Target Close Date</label>
                    <input type="date" value={formData.targetCloseDate || ''} onChange={(e) => updateForm('targetCloseDate', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                  </div>
                  
                  {formData.timelineType === 'Concurrent Close' && (
                     <div className="flex flex-col">
                       <label className="text-xs text-gray-800 uppercase font-bold block mb-1">Concurrent Details</label>
                       <input type="text" placeholder="Concurrent Escrow details..." value={formData.timelineDetails || ''} onChange={(e) => updateForm('timelineDetails', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                     </div>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs text-gray-800 uppercase font-bold block mb-1">Relocation Plans</label>
                  <textarea placeholder="Where are they moving? How are they funding it?..." value={formData.relocationPlans || ''} onChange={(e) => updateForm('relocationPlans', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all min-h-[80px] resize-y" />
                </div>
              </div>
            </div>

            {currentStep === 3 && (
              <button 
                onClick={() => setFormData({...formData, currentStep: 4})}
                className="w-full bg-[#FFFF00] text-black border-4 border-black p-4 font-black uppercase text-xl transform transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:shadow-none active:translate-y-1 flex justify-center items-center gap-2"
              >
                Proceed to Financials <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}

        {/* PILLAR 4: FINANCIALS & DEBT */}
        {activeSource !== 'Agent Outreach' && (
          <div id="pillar-4" className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#00FF00] rounded-none mb-8 transition-all duration-500 ease-in-out" style={{ 
            opacity: currentStep >= 4 ? 1 : 0.3,
            pointerEvents: currentStep >= 4 ? 'auto' : 'none',
            filter: currentStep >= 4 ? 'none' : 'grayscale(80%)'
          }}>
            <div className="flex items-center gap-2 mb-6 text-black">
              <ShieldAlert size={24} />
              <h3 className="m-0 uppercase tracking-widest font-black text-xl">Pillar 4: Financials & Debt</h3>
            </div>

            <div className="flex flex-col mb-2 animate-slideIn">
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Transition to Financials)</span>
              <div className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#00FF00] text-xl font-black italic text-black leading-relaxed rounded-none mb-6">
                {formData.askingPrice 
                  ? \`"Got it, that timeline definitely sounds workable for us. Now, circling back to that $\${Number(formData.askingPrice.toString().replace(/[^0-9.-]+/g,"")).toLocaleString() || formData.askingPrice} number you mentioned earlier... for us to actually make that work and give you that certainty, we cover all the title and escrow fees so whatever number we agree on is exactly what you walk away with cleanly. But just so I can do the exact math... is the property owned free and clear, or is there an existing mortgage or any liens that need to be paid off at closing?"\`
                  : \`"Got it, that timeline definitely sounds workable for us. Now, if we can make the numbers work and give you that certainty, we cover all the title and escrow fees, so whatever number we end up at is exactly what you walk away with cleanly. Just so I can do the exact math... is the property owned free and clear, or is there an existing mortgage or any liens that need to be paid off at closing?"\`
                }
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button 
                  onClick={() => updateForm('freeAndClear', true)}
                  className={clsx(
                    "flex-1 px-5 py-4 text-sm font-bangers tracking-widest uppercase transition-all transform", 
                    formData.freeAndClear === true 
                      ? "bg-[#00FF00] text-black border-4 border-black shadow-[4px_4px_0px_#000] font-black italic" 
                      : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1"
                  )}
                >
                  Property is Free & Clear
                </button>
                <button 
                  onClick={() => updateForm('freeAndClear', false)}
                  className={clsx(
                    "flex-1 px-5 py-4 text-sm font-bangers tracking-widest uppercase transition-all transform", 
                    formData.freeAndClear === false 
                      ? "bg-[#FF1111] text-white border-4 border-black shadow-[4px_4px_0px_#000] font-black italic" 
                      : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1"
                  )}
                >
                  Has Existing Mortgage / Liens
                </button>
              </div>

              {formData.freeAndClear === false && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideIn">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-800 uppercase font-bold block mb-1">1st Mortgage Balance $</label>
                    <input type="text" value={formData.mortgageBalance || ''} onChange={(e) => updateForm('mortgageBalance', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-800 uppercase font-bold block mb-1">2nd Position / HELOC $</label>
                    <input type="text" value={formData.secondPosition || ''} onChange={(e) => updateForm('secondPosition', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-800 uppercase font-bold block mb-1">Additional Liens $</label>
                    <input type="text" value={formData.thirdPosition || ''} onChange={(e) => updateForm('thirdPosition', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-[#FF1111] uppercase font-black block mb-1">Arrears / Behind Amount $</label>
                    <input type="text" value={formData.arrearsAmount || ''} onChange={(e) => updateForm('arrearsAmount', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full bg-red-100 border-2 border-[#FF1111] rounded-none p-3 text-black uppercase font-black placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#FF1111] transition-all" />
                  </div>
                </div>
              )}
              
              <div className="mt-8 text-center border-t-4 border-black pt-6">
                <span className="uppercase font-black text-sm text-gray-500 block mb-1">Total Est. Debt</span>
                <span className="text-[#FF1111] font-black text-5xl tracking-tighter drop-shadow-md">
                  $\{( () => {
                    if (formData.freeAndClear) return '0';
                    const m1 = parseInt(formData.mortgageBalance || 0, 10);
                    const m2 = parseInt(formData.secondPosition || 0, 10);
                    const m3 = parseInt(formData.thirdPosition || 0, 10);
                    const arr = parseInt(formData.arrearsAmount || 0, 10);
                    return (m1 + m2 + m3 + arr).toLocaleString();
                  })() }
                </span>
              </div>
            </div>

            {currentStep === 4 && (
              <button 
                onClick={() => setFormData({...formData, currentStep: 5})}
                className="w-full bg-[#00FF00] text-black border-4 border-black p-4 font-black uppercase text-xl transform transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:shadow-none active:translate-y-1 flex justify-center items-center gap-2"
              >
                Proceed to The Offer <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}

        {/* PILLAR 5: THE OFFER PIVOT */}
        {activeSource !== 'Agent Outreach' && (
          <div id="pillar-5" className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#FF00FF] rounded-none mb-8 transition-all duration-500 ease-in-out" style={{ 
            opacity: currentStep >= 5 ? 1 : 0.3,
            pointerEvents: currentStep >= 5 ? 'auto' : 'none',
            filter: currentStep >= 5 ? 'none' : 'grayscale(80%)'
          }}>
            <div className="flex items-center gap-2 mb-6 text-black">
              <BrainCircuit size={24} />
              <h3 className="m-0 uppercase tracking-widest font-black text-xl">Pillar 5: The Offer (Pivot)</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
               <button 
                 className={clsx(
                   "flex-1 p-6 text-xl font-bangers tracking-widest uppercase transition-all transform", 
                   formData.pitchType === 'cash' 
                     ? "bg-[#00FF00] text-black border-4 border-black shadow-[8px_8px_0px_#000] font-black italic -skew-x-2" 
                     : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1 -skew-x-12"
                 )}
                 onClick={() => updateForm('pitchType', 'cash')}
               >
                 CASH OFFER PITCH
               </button>
               <button 
                 className={clsx(
                   "flex-1 p-6 text-xl font-bangers tracking-widest uppercase transition-all transform", 
                   formData.pitchType === 'creative' 
                     ? "bg-[#FF00FF] text-white border-4 border-black shadow-[8px_8px_0px_#000] font-black italic -skew-x-2" 
                     : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1 -skew-x-12"
                 )}
                 onClick={() => updateForm('pitchType', 'creative')}
               >
                 CREATIVE / SUB-TO PITCH
               </button>
            </div>

            {formData.pitchType === 'creative' ? (
              <div className="flex flex-col mb-2 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Creative Pivot)</span>
                <div className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#FF00FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-6">
                  "Okay, so based on the math, a cash offer is going to be too low for you. BUT, if you're willing to be a little flexible on terms, I can get you much closer to your retail asking price. If we agree on your price, would you be open to letting us take over the existing mortgage payments and paying you out your equity?"
                </div>
              </div>
            ) : (
              <div className="flex flex-col mb-2 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Voss No-Oriented Question)</span>
                <div className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#FF00FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-6">
                  "Okay, I've got my underwriters looking at it. Since we're paying cash, buying it completely as-is, and covering all of your closing costs... we're coming in right around <span className="text-[#00FF00] font-black bg-black px-2 mx-1 border-2 border-black shadow-[2px_2px_0px_#00FF00] transform inline-block skew-x-[-5deg]">$\{(totalMAO || 0).toLocaleString()}</span>. Would it be a ridiculous idea to consider an offer in that ballpark?"
                </div>
              </div>
            )}
            
            {/* Offer Rebuttals */}
            <div className="mt-8 border-t-4 border-black pt-6">
               <div className="text-black font-black uppercase text-sm mb-4">Offer Rebuttals (Click for rebuttal)</div>
               <div className="flex flex-wrap gap-2 mb-6">
                 <button className={clsx("px-4 py-2 font-black uppercase border-2 border-black transition-all", formData.activeObjection === 'too_low' ? "bg-black text-white shadow-[4px_4px_0px_#FF00FF]" : "bg-white hover:bg-gray-100")} onClick={() => updateForm('activeObjection', formData.activeObjection === 'too_low' ? null : 'too_low')}>
                   "That's too low"
                 </button>
                 <button className={clsx("px-4 py-2 font-black uppercase border-2 border-black transition-all", formData.activeObjection === 'think_about_it' ? "bg-black text-white shadow-[4px_4px_0px_#FF00FF]" : "bg-white hover:bg-gray-100")} onClick={() => updateForm('activeObjection', formData.activeObjection === 'think_about_it' ? null : 'think_about_it')}>
                   "I need to think about it"
                 </button>
                 <button className={clsx("px-4 py-2 font-black uppercase border-2 border-black transition-all", formData.activeObjection === 'other_offers' ? "bg-black text-white shadow-[4px_4px_0px_#FF00FF]" : "bg-white hover:bg-gray-100")} onClick={() => updateForm('activeObjection', formData.activeObjection === 'other_offers' ? null : 'other_offers')}>
                   "I have higher offers"
                 </button>
               </div>

               {formData.activeObjection === 'too_low' && (
                 <div className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#000] text-xl font-black italic text-black leading-relaxed rounded-none mb-6 animate-slideIn">
                   "I completely understand. If we could get up to your number, we absolutely would. But taking into consideration the cost of the updates, the holding costs, and paying all the closing fees... that's realistically where we need to be to make it make sense. Are we miles apart, or is there a number closer to that where we could shake hands?"
                 </div>
               )}

               {formData.activeObjection === 'think_about_it' && (
                 <div className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#000] text-xl font-black italic text-black leading-relaxed rounded-none mb-6 animate-slideIn">
                   "Absolutely, taking your time makes total sense. Usually when people need to think about it, there's a specific concern holding them back—is it the price, the timeline, or something else?"
                 </div>
               )}

               {formData.activeObjection === 'other_offers' && (
                 <div className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#000] text-xl font-black italic text-black leading-relaxed rounded-none mb-6 animate-slideIn">
                   "That's awesome, it sounds like you have some great options. Just be careful with out-of-state buyers who throw out a high number and then ask for massive price drops during inspections. Our offer is completely as-is with zero contingencies. Do their offers waive inspections? If we can guarantee our price, what number would we need to hit to get this locked up right now?"
                 </div>
               )}
            </div>

            {/* Offer Lock In Section */}
            <div className="mt-10 p-6 bg-gray-100 border-8 border-black relative overflow-hidden flex flex-col items-center">
              <div className="absolute inset-0 opacity-10 comic-halftone pointer-events-none"></div>
              <h4 className="m-0 mb-4 text-black text-lg uppercase tracking-widest font-black z-10 text-center">
                Final Negotiated Price
              </h4>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center z-10">
                <div className="relative w-full max-w-md">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00FF00] font-black text-3xl">$</span>
                  <input 
                    type="text" 
                    placeholder="AGREED PRICE" 
                    value={formData.lockedPrice || ''}
                    onChange={(e) => updateForm('lockedPrice', e.target.value.replace(/[^0-9]/g, ''))}
                    disabled={formData.isPriceLocked}
                    className="w-full text-4xl font-black text-[#00FF00] bg-black p-4 pl-12 border-4 border-[#00FF00] text-center focus:outline-none focus:shadow-[0_0_15px_#00FF00] transition-shadow disabled:opacity-90 placeholder-[#004400]"
                  />
                </div>
                
                <button 
                  onClick={() => updateForm('isPriceLocked', !formData.isPriceLocked)}
                  className={clsx(
                    "px-8 py-4 font-black uppercase text-xl border-4 transition-all whitespace-nowrap shadow-[4px_4px_0px_#000]",
                    formData.isPriceLocked 
                      ? "bg-black text-[#FF0055] border-black hover:bg-gray-900" 
                      : "bg-[#00FF00] text-black border-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-y-0 active:shadow-none"
                  )}
                >
                  {formData.isPriceLocked ? 'Unlock 🔓' : 'LOCK PRICE 🔒'}
                </button>
              </div>
            </div>

            {currentStep === 5 && formData.isPriceLocked && (
              <button 
                onClick={() => setFormData({...formData, currentStep: 6})}
                className="w-full mt-6 bg-[#FF00FF] text-white border-4 border-black p-4 font-black uppercase text-xl transform transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:shadow-none active:translate-y-1 flex justify-center items-center gap-2"
              >
                 Proceed to the Close <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}

        {/* PILLAR 6: THE CLOSE & LOGISTICS */}
        {activeSource !== 'Agent Outreach' && (
          <div id="pillar-6" className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#00FFFF] rounded-none mb-8 transition-all duration-500 ease-in-out" style={{ 
            opacity: currentStep >= 6 ? 1 : 0.3,
            pointerEvents: currentStep >= 6 ? 'auto' : 'none',
            filter: currentStep >= 6 ? 'none' : 'grayscale(80%)'
          }}>
            <div className="flex items-center gap-2 mb-6 text-black">
              <CheckCircle2 size={24} />
              <h3 className="m-0 uppercase tracking-widest font-black text-xl">Pillar 6: The Close & Logistics</h3>
            </div>

            <div className="flex flex-col mb-2 animate-slideIn">
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (The Assumptive Close)</span>
              <div className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#00FFFF] text-xl font-black italic text-black leading-relaxed rounded-none mb-6">
                "Okay perfect, it sounds like we're on the same page. What I'm going to do next is send over our standard, simple 2-page purchase agreement. You can review it, and once you sign it, I'll send it directly to our title company so they can start the process."
              </div>
            </div>

            <div className="flex flex-col mb-2 animate-slideIn mt-8">
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Logistics Gathering)</span>
              <div className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#00FFFF] text-xl font-black italic text-black leading-relaxed rounded-none mb-6">
                "Just so I can draft this up correctly, what is the exact legal name on the deed that we should use for the contract? And what's the best email address to send the DocuSign to?"
              </div>
              
              <div className="flex flex-col gap-4 mt-2">
                <input type="text" placeholder="Legal Name(s) for Contract..." value={formData.legalName || ''} onChange={(e) => updateForm('legalName', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-4 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                <input type="email" placeholder="Best Email Address..." value={formData.contactEmail || ''} onChange={(e) => updateForm('contactEmail', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-4 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                <input type="text" placeholder="Current Mailing Address (if different)..." value={formData.mailingAddress || ''} onChange={(e) => updateForm('mailingAddress', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-4 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
              </div>
            </div>

            <div className="flex flex-col mb-2 animate-slideIn mt-8">
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Final Next Steps)</span>
              <div className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#00FFFF] text-xl font-black italic text-black leading-relaxed rounded-none mb-6">
                "Awesome. I'm typing that up right now and it should hit your inbox in about 5 minutes. I'll shoot you a quick text when I send it. Can you keep an eye out for it and let me know if you have any questions once you look it over?"
              </div>
            </div>
            
            <div className="mt-12">
              <button 
                onClick={generateSummary} 
                className="w-full bg-[#00FF00] text-black border-4 border-black p-6 font-black uppercase text-2xl transform transition-all shadow-[8px_8px_0px_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0px_#000] active:shadow-none active:translate-y-2 flex justify-center items-center gap-4 group"
              >
                PUSH TO DISPO & SEND CONTRACT <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        )}
        
        `;

fs.writeFileSync(filePath, beforeContent + newContent + afterContent);
console.log("Pillars 3-6 fully replaced with Neo-Brutalist framework!");
