const fs = require('fs');

const filePath = "src/components/script/CallScript.jsx";
let c = fs.readFileSync(filePath, "utf-8");

const replacement = `            {!formData.isVoicemail && !formData.isHostile && (
              <div className="flex flex-col mb-2 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Direct Opener)</span>
                <div className="relative bg-black/60 backdrop-blur-md border-4 border-[#00E5FF] p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6">
                  {formData.activeSource === 'Agent Outreach' 
                    ? \`"Hey \${sellerFirstName}, my name is Avory with Central Valley REI. I'm an investor buying properties cash in your area. I know you're busy, so I'll keep it brief. Do you happen to have any off-market inventory or pocket listings?"\`
                    : formData.manualEntityType === 'TRUST'
                    ? \`"Hey, am I speaking with the trustee for the \${leadName}? My name is Avory, a local investor. I was calling about the property over on \${targetAddress}... have the trustees ever considered selling it?"\`
                    : formData.manualEntityType === 'LLC'
                    ? \`"Hey, am I speaking with the owner of \${leadName}? My name is Avory, a local investor. I was calling about the property over on \${targetAddress}... have you or your partners ever considered selling it?"\`
                    : \`"Hey \${sellerFirstName}. This is Avory, local investor here in Bakersfield just trying to reach the owner of \${targetAddress}. Is this the right number for them?"\`
                  }
                </div>
              </div>
            )}
            
            {!formData.isVoicemail && !formData.isHostile && formData.activeSource !== 'Agent Outreach' && (`;

c = c.replace(/\{!formData\.isVoicemail && !formData\.isHostile && \([\s\S]*?\{!formData\.isVoicemail && !formData\.isHostile && formData\.activeSource !== 'Agent Outreach' && \(/, replacement);

fs.writeFileSync(filePath, c);
console.log("Restored the exact correct script texts from the original source.");
