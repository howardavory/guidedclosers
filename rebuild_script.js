const fs = require('fs');
const oldV2 = fs.readFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/src/components/CallScript.jsx', 'utf8');
const currentV3 = fs.readFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', 'utf8');

const oldLines = oldV2.split('\n');
const startIndex = oldLines.findIndex(l => l.includes('{/* Toggles moved to sidebar */}'));
if (startIndex === -1) throw new Error("Could not find start index in old file");

let missingCode = oldLines.slice(startIndex).join('\n');

// Replace V2 CSS classes with V3 Tailwind styles
missingCode = missingCode.replace(/className="bubble-row agent"[^>]*>/g, 'className="flex flex-col mb-2 animate-slideIn">');
missingCode = missingCode.replace(/className="bubble-label"[^>]*>/g, 'className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">');
missingCode = missingCode.replace(/className="bubble"[^>]*>/g, 'className="relative bg-black/60 backdrop-blur-md border-4 border-[#00E5FF] p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6">');

const endIndex = missingCode.indexOf('{/* CASH CALCULATOR */}');
if (endIndex === -1) throw new Error("Could not find end index in missing code");
missingCode = missingCode.substring(0, endIndex);

const currentLines = currentV3.split('\n');
const insertIndex = currentLines.findIndex(l => l.includes('{/* Toggles moved to sidebar */}'));
if (insertIndex === -1) throw new Error("Could not find insert index in current file");

// Remove everything from {/* Toggles moved to sidebar */} down to {/* CASH CALCULATOR */}
const currentEndIndex = currentLines.findIndex(l => l.includes('{/* CASH CALCULATOR */}'));
if (currentEndIndex !== -1) {
  currentLines.splice(insertIndex, currentEndIndex - insertIndex, missingCode);
} else {
  currentLines.splice(insertIndex, 1, missingCode);
}

fs.writeFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', currentLines.join('\n'));
console.log('Successfully injected ported V2 logic into V3');
