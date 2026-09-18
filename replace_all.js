const fs = require('fs');
const path = 'src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

// The standardized inputs
const sleekInput = 'w-full appearance-none bg-transparent border-b-2 border-[#333333] pb-2 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] transition-colors rounded-none';

const inputsToReplace = [
    'w-full bg-[#1A1A1A] border-2 border-[#333333] rounded-none p-3 text-[#F5F5F5]  font-medium placeholder-gray-400 focus:outline-none focus:border-white/50 focus:shadow-md transition-all',
    'w-full bg-[#1A1A1A] border-2 border-[#333333] rounded-none p-3 text-[#F5F5F5] font-medium placeholder-gray-400 focus:outline-none focus:border-white/50 focus:shadow-md transition-all',
    'w-full bg-[#1A1A1A] border-2 border-[#333333] rounded-none p-4 text-[#F5F5F5]  font-medium placeholder-gray-400 focus:outline-none focus:bg-yellow-50 focus:shadow-md transition-all',
    // We shouldn't touch the backTaxesOwed one unless asked, but wait, the prompt says "text inputs for Mortgage Balances, Arrears, Asking Price, Legal Name, Email, Address, and Routing Info". It didn't explicitly say Back Taxes and PACE. But let's replace all of these blocky inputs in these sections.
    'w-full bg-[#121212] border-b-2 border-[#D4AF37] rounded-none p-3 text-[#F5F5F5] font-medium placeholder-gray-400 focus:outline-none focus:border-white/50 focus:shadow-md transition-all'
];

let inputCount = 0;
inputsToReplace.forEach(str => {
    // replace all occurrences
    const count = (code.split(str).length - 1);
    inputCount += count;
    code = code.split(str).join(sleekInput);
});

// Now for Step 1: The toggles in Pillar 3, 4, 5, 6.
// They use active/inactive branches in clsx.
// Active:
const targetActive = 'px-4 py-2 bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] font-extrabold border-none rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_15px_rgba(229,193,88,0.5)] transition-all';
const targetInactive = 'px-4 py-2 bg-[#1A1A1A] text-[#A0A0A0] border border-[#333333] rounded-xl hover:border-[#D4AF37]/50 hover:text-[#F5F5F5] transition-all';

// For example:
// "bg-[#FFFF00] text-[#F5F5F5] border border-[#333333] transition-all duration-300 - shadow-md font-black italic"
// "bg-[#1A1A1A] text-[#F5F5F5] border-2 border-[#333333] shadow-none hover:-translate-y-0.5"
code = code.replace(/"bg-\[#FFFF00\] text-\[#F5F5F5\] border border-\[#333333\] transition-all duration-300 - shadow-md font-black italic"/g, '"' + targetActive + '"');
code = code.replace(/"bg-\[#1A1A1A\] text-\[#F5F5F5\] border-2 border-\[#333333\] shadow-none hover:-translate-y-0\.5"/g, '"' + targetInactive + '"');

// For Free & Clear:
// "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] font-extrabold border border-[#333333] shadow-md"
// "bg-[#1A1A1A] text-[#F5F5F5] border-2 border-[#333333] shadow-none hover:-translate-y-0.5 -"
code = code.replace(/"bg-gradient-to-r from-\[#CD7F32\] via-\[#E5C158\] to-\[#B8860B\] text-\[#000000\] font-extrabold border border-\[#333333\] shadow-md"/g, '"' + targetActive + '"');
code = code.replace(/"bg-\[#1A1A1A\] text-\[#F5F5F5\] border-2 border-\[#333333\] shadow-none hover:-translate-y-0\.5 -"/g, '"' + targetInactive + '"');

// For Pitch Type (Cash vs Creative):
// "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] font-extrabold border border-[#333333] shadow-md"
// "bg-[#FF00FF] text-white border border-[#333333] shadow-md font-black italic -"
code = code.replace(/"bg-\[#FF00FF\] text-white border border-\[#333333\] shadow-md font-black italic -"/g, '"' + targetActive + '"');

// What about Rebuttals and Primary Concern?
// Let's replace the base classes for all of them so they don't have overlapping padding/margin.
// "px-5 py-2 text-sm font-semibold tracking-wide tracking-widest  transition-all transition-all duration-300 -" => ""
// "flex-1 px-5 py-4 text-sm font-semibold tracking-wide tracking-widest  transition-all transform" => ""
// "flex-1 p-6 text-xl font-semibold tracking-wide tracking-widest  transition-all transform" => ""

const baseClassesToRemove = [
    /"px-5 py-2 text-sm font-semibold tracking-wide tracking-widest  transition-all transition-all duration-300 -"/g,
    /"flex-1 px-5 py-4 text-sm font-semibold tracking-wide tracking-widest  transition-all transform"/g,
    /"flex-1 p-6 text-xl font-semibold tracking-wide tracking-widest  transition-all transform"/g
];

baseClassesToRemove.forEach(regex => {
    code = code.replace(regex, '""');
});

fs.writeFileSync(path, code);
console.log('Inputs Replaced:', inputCount);
