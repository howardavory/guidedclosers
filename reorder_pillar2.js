const fs = require('fs');
const path = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

const lines = code.split('\n');

// Get all chunks by line numbers (0-indexed)
const chunkA = lines.slice(620, 634).join('\n'); // Occupancy Intro (lines 621-634)
const chunkB = lines.slice(634, 649).join('\n'); // Decision Makers (lines 635-649)
let chunkC = lines.slice(649, 673).join('\n'); // Property Type (lines 650-673)
const chunkD = lines.slice(673, 773).join('\n'); // Property Dynamics (lines 674-773)
const chunkE = lines.slice(773, 803).join('\n'); // Follow-up Tenant (lines 774-803)
const chunkF = lines.slice(803, 823).join('\n'); // Follow-up Vacant (lines 804-823)
let chunkG = lines.slice(823, 846).join('\n'); // Follow-up Trust/Probate (lines 824-846)

// Modify Chunk A (Occupancy Intro)
let modifiedChunkA = chunkA.replace(
  /"So to get a better idea of what we're working with\.\.\. are you living in the property right now, or is it a rental\?"/,
  `{formData.propertyType === 'Multi-Family' \n                  ? "So to get a better idea of what we're working with... are you living in one of the units, or are they all completely tenanted out?"\n                  : "So to get a better idea of what we're working with... are you living in the property right now, or is it a rental?"\n                }`
);
modifiedChunkA = `            {formData.propertyType && (\n              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>\n${modifiedChunkA.replace(/<div className="flex flex-col mb-2 animate-slideIn">/g, '')}\n              </div>\n            )}`;

// Modify Chunk C (Property Type)
// Remove the dynamic response text block for decision makers from property type
chunkC = chunkC.replace(/\{formData\.decisionMakers === 'Probate'[\s\S]*?null\s*\}/, '');
// Change the " Now," prefix to ""Now,"
chunkC = chunkC.replace(/<span> Now, just to make sure/, '<span>"Now, just to make sure');
// Add ending quote
chunkC = chunkC.replace(/mobile home\?<\/span>/, 'mobile home?"</span>');

// Modify Chunk B (Decision Makers) to inject the response text at the bottom
const dmResponseText = `
                {formData.decisionMakers === 'Probate' && <div className="mt-4 text-[#00E5FF] animate-slideIn">"Got it. Probates can be a headache, but we navigate them all the time so we can definitely help with that."</div>}
                {formData.decisionMakers === 'Multiple' && <div className="mt-4 text-[#00E5FF] animate-slideIn">"Okay, makes sense. We can definitely keep them in the loop when the time comes."</div>}
                {formData.decisionMakers === 'Sole' && <div className="mt-4 text-[#00E5FF] animate-slideIn">"Okay, nice and simple."</div>}`;

let modifiedChunkB = chunkB.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\)\}/, `</div>\n${dmResponseText}\n                </div>\n              </div>\n            )}`);

// Reassemble in the new order:
// C -> D -> A -> E -> F -> B -> G
const newSection = [
  chunkC,
  chunkD,
  modifiedChunkA,
  chunkE,
  chunkF,
  modifiedChunkB,
  chunkG
].join('\n');

// Replace the old section with the new section
const before = lines.slice(0, 620).join('\n');
const after = lines.slice(846).join('\n');

fs.writeFileSync(path, before + '\n' + newSection + '\n' + after);
console.log('Successfully reordered Pillar 2!');
