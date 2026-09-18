const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/script/CallScript.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the boundaries
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

const colors = ['#00E5FF', '#FF0055', '#FFE600'];
let colorIndex = 0;

// 1. Panel Wrappers
pillar2Content = pillar2Content.replace(/className="relative bg-black\/60 backdrop-blur-md border-4 border-\[#00E5FF\] p-6 shadow-\[6px_6px_0px_#000\] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6"/g, () => {
    const color = colors[colorIndex % colors.length];
    colorIndex++;
    return `className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_${color}] text-xl font-black italic text-black leading-relaxed rounded-none mb-8"`;
});

// 2. Toggle Banks (Buttons)
pillar2Content = pillar2Content.replace(/className=\{clsx\("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-\[4px_4px_0px_#000\] transform -skew-x-12", ([^?]+)\? "([^"]+)" : "([^"]+)"\)\}/g, (match, condition, activeState, inactiveState) => {
    // Extract the active color if it's there
    let activeColor = '#00E5FF';
    const bgMatch = activeState.match(/bg-\[[^\]]+\]/);
    if (bgMatch) {
        activeColor = bgMatch[0].replace('bg-', '');
    }

    const newBase = "px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12";
    const newActive = `bg-${activeColor} text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic`;
    const newInactive = "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1";

    return `className={clsx("${newBase}", ${condition}? "${newActive}" : "${newInactive}")}`;
});

// 3. Text Inputs
pillar2Content = pillar2Content.replace(/className="w-full bg-white border border-black rounded-lg p-3 text-black focus:border-black outline-none font-bold"/g, 
    'className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all"');

// 4. Textareas
pillar2Content = pillar2Content.replace(/className="w-full bg-black\/60 border border-\[#00E5FF\] rounded-lg p-3 text-white focus:border-\[#FF0055\] outline-none h-24 mb-4"/g, 
    'className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all h-24 mb-4"');

fs.writeFileSync(filePath, beforePillar2 + pillar2Content + afterPillar2);
console.log("Applied Neo-Brutalist styling successfully!");
