const fs = require('fs');

const filePath = "src/components/script/CallScript.jsx";
let c = fs.readFileSync(filePath, "utf-8");

const replacement = `        {/* PILLAR 1: OPENER */}
        {renderPillar(1, "The Opener", <Mic size={20} />, (
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <button className={clsx("px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2", formData.isVoicemail ? "bg-purple-600 text-black border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]" : "bg-white text-purple-400 border-purple-500/30")} onClick={() => updateForm('isVoicemail', !formData.isVoicemail)}>Voicemail Drop</button>
              <button className={clsx("px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2", formData.isHostile ? "bg-red-600 text-black border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" : "bg-white text-red-400 border-red-500/30")} onClick={() => updateForm('isHostile', !formData.isHostile)}>Hostile Response</button>
            </div>

            {formData.isVoicemail && (
              <div className="flex flex-col mb-2 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-purple-400">Agent (Voicemail Script)</span>
                <div className="relative bg-black/60 backdrop-blur-md border-4 border-[#00E5FF] p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6">
                  {formData.activeSource === 'Agent Outreach' 
                    ? \`"Hey \${sellerFirstName}, this is Avory. I'm with a local investment company here in Bakersfield and we're looking for our next project. We buy cash and close quick. If you've got any hard-to-move inventory, pocket listings, or distress deals that could use an offer, give me a call back. Talk soon."\`
                    : \`"Hey \${formData.manualEntityType === 'TRUST' || formData.manualEntityType === 'LLC' ? 'there' : sellerFirstName}, my name is Avory. I'm a local investor and I was calling about the property over on \${targetAddress}. We are actually looking to buy another property in the neighborhood right now and I just wanted to see if you were thinking about selling it. Give me a call back when you get a second. My number is [Your Number]. Talk to you soon."\`
                  }
                </div>
                
                <button 
                  onClick={() => onReturn && onReturn({ type: 'voicemail' })} 
                  className="w-full max-w-md relative h-20 group overflow-hidden border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000] transition-all hover:-translate-y-1 bg-black transform rotate-1 cursor-pointer flex justify-center items-center mt-4"
                >
                  <div className="absolute inset-0 bg-[#B400FF] transform skew-x-[-30deg] translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-500 border-l-4 border-black pointer-events-none"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <Mic size={24} className="text-white drop-shadow-[2px_2px_0px_#000]" />
                    <span className="font-bangers text-3xl text-white tracking-widest drop-shadow-[3px_3px_0px_#000] group-hover:scale-110 transition-transform">
                      LOG VOICEMAIL & RETURN
                    </span>
                  </div>
                </button>
              </div>
            )}
            
            {!formData.isVoicemail && !formData.isHostile && formData.activeSource !== 'Agent Outreach' && (`;

c = c.replace(/\{\/\*\s*PILLAR 1: OPENER\s*\*\/\}[\s\S]*?\{!formData\.isVoicemail && !formData\.isHostile && formData\.activeSource !== 'Agent Outreach' && \(/, replacement);

fs.writeFileSync(filePath, c);
console.log("Restored Pillar 1 with the Log Voicemail button.");
