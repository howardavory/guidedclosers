const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/script/CallScript.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = '<span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Property Type)</span>';
const endMarker = '<span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Timeline / Relocation)</span>';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find start or end markers.");
    process.exit(1);
}

let beforePillar2 = content.substring(0, startIndex);
let pillar2Content = content.substring(startIndex, endIndex);
let afterPillar2 = content.substring(endIndex);

// Regex to catch ALL clsx button strings that end with the old inactive state:
// e.g. "bg-black/60 text-white border-[#00E5FF] hover:bg-white/20"
// We'll replace the inactive string and also modify the active string.

pillar2Content = pillar2Content.replace(/className=\{clsx\("([^"]+)", ([^?]+)\? "([^"]+)" : "bg-black\/60 text-white border-\[#[0-9A-F]+\] hover:bg-white\/20"\)\}/g, (match, baseClasses, condition, activeClasses) => {
    
    // Extract color
    let activeColor = '#00E5FF';
    const bgMatch = activeClasses.match(/bg-\[[^\]]+\]/);
    if (bgMatch) {
        activeColor = bgMatch[0].replace('bg-', '');
    }

    // Clean base classes (remove old shadow and hover)
    let newBase = baseClasses
        .replace(/shadow-\[[^\]]+\]/g, '')
        .replace(/hover:-translate-y-1/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    
    const newActive = `bg-${activeColor} text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic`;
    const newInactive = "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1";

    return `className={clsx("${newBase}", ${condition}? "${newActive}" : "${newInactive}")}`;
});

fs.writeFileSync(filePath, beforePillar2 + pillar2Content + afterPillar2);
console.log("Fixed Condition toggles!");
