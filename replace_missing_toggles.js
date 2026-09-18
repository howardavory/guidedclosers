const fs = require('fs');
const path = 'src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

const targetActive = 'px-4 py-2 bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] font-extrabold border-none rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_15px_rgba(229,193,88,0.5)] transition-all';
const targetInactive = 'px-4 py-2 bg-[#1A1A1A] text-[#A0A0A0] border border-[#333333] rounded-xl hover:border-[#D4AF37]/50 hover:text-[#F5F5F5] transition-all';

// For variables mentioned: timelineType, relocationType, cashToMoveNeeded, pitchType, activeObjection, primaryConcern, etc.
// In general, we can just replace the string literal if it looks like a toggle.
// "bg-[#FFFF00] text-[#F5F5F5] border border-[#333333] transition-all duration-300 - shadow-md font-black italic"
// "bg-[#1A1A1A] text-[#F5F5F5] border-2 border-[#333333] shadow-none hover:-translate-y-0.5"
code = code.replace(/"bg-\[#FFFF00\] text-\[#F5F5F5\] border border-\[#333333\] transition-all duration-300 - shadow-md font-black italic"/g, '"' + targetActive + '"');
code = code.replace(/"bg-\[#1A1A1A\] text-\[#F5F5F5\] border-2 border-\[#333333\] shadow-none hover:-translate-y-0\.5"/g, '"' + targetInactive + '"');

// "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] font-extrabold border border-[#333333] shadow-md"
code = code.replace(/"bg-gradient-to-r from-\[#CD7F32\] via-\[#E5C158\] to-\[#B8860B\] text-\[#000000\] font-extrabold border border-\[#333333\] shadow-md"/g, '"' + targetActive + '"');

// "bg-[#1A1A1A] text-[#F5F5F5] border-2 border-[#333333] shadow-none hover:-translate-y-0.5 -"
code = code.replace(/"bg-\[#1A1A1A\] text-\[#F5F5F5\] border-2 border-\[#333333\] shadow-none hover:-translate-y-0\.5 -"/g, '"' + targetInactive + '"');

// "bg-[#FF00FF] text-white border border-[#333333] shadow-md font-black italic -"
code = code.replace(/"bg-\[#FF00FF\] text-white border border-\[#333333\] shadow-md font-black italic -"/g, '"' + targetActive + '"');

// I also need to strip out the custom base classes of these buttons:
// "px-5 py-2 text-sm font-semibold tracking-wide tracking-widest  transition-all transition-all duration-300 -"
// "flex-1 px-5 py-4 text-sm font-semibold tracking-wide tracking-widest  transition-all transform"
// "flex-1 p-6 text-xl font-semibold tracking-wide tracking-widest  transition-all transform"

const baseClassesToRemove = [
    /"px-5 py-2 text-sm font-semibold tracking-wide tracking-widest  transition-all transition-all duration-300 -"/g,
    /"flex-1 px-5 py-4 text-sm font-semibold tracking-wide tracking-widest  transition-all transform"/g,
    /"flex-1 p-6 text-xl font-semibold tracking-wide tracking-widest  transition-all transform"/g
];

baseClassesToRemove.forEach(regex => {
    code = code.replace(regex, '""');
});


fs.writeFileSync(path, code);
console.log('Toggles replaced');
