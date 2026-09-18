const fs = require('fs');

const filePath = "src/components/script/CallScript.jsx";
let c = fs.readFileSync(filePath, "utf-8");

const replacement = `            {!formData.isVoicemail && !formData.isHostile && (
              <div className="flex flex-col mb-2 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Direct Opener)</span>
                <div className="relative bg-black/60 backdrop-blur-md border-4 border-[#00E5FF] p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6">
                  {formData.activeSource === 'Agent Outreach' 
                    ? \`"Hey \${sellerFirstName}, this is Avory. I'm with a local investment company here in Bakersfield and we're looking for our next project. We buy cash and close quick. Do you have any properties or clients that you're working with right now that need a cash offer?"\`
                    : \`"Hey \${formData.manualEntityType === 'TRUST' || formData.manualEntityType === 'LLC' ? 'there' : sellerFirstName}, my name is Avory. I'm a local investor and I was calling about the property over on \${targetAddress}. We are actually looking to buy another property in the neighborhood right now and I just wanted to see if you were thinking about selling it?"\`
                  }
                </div>
              </div>
            )}
            
            {!formData.isVoicemail && !formData.isHostile && formData.activeSource !== 'Agent Outreach' && (`;

c = c.replace(/\{!formData\.isVoicemail && !formData\.isHostile && formData\.activeSource !== 'Agent Outreach' && \(/, replacement);

fs.writeFileSync(filePath, c);
console.log("Restored the Direct Opener script.");
