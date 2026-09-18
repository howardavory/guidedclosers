const fs = require('fs');
const path = 'src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

// The standardized active/inactive classes
const targetActive = 'px-4 py-2 bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] font-extrabold border-none rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_15px_rgba(229,193,88,0.5)] transition-all';
const targetInactive = 'px-4 py-2 bg-[#1A1A1A] text-[#A0A0A0] border border-[#333333] rounded-xl hover:border-[#D4AF37]/50 hover:text-[#F5F5F5] transition-all';

// First, for activeObjection in Rebuttals (Pillar 5):
code = code.replace(/"bg-gradient-to-r from-\[#CD7F32\] via-\[#E5C158\] to-\[#B8860B\] text-\[#000000\] font-extrabold border-none rounded-xl shadow-\[0_0_15px_rgba\(229,193,88,0\.4\)\]"/g, '"' + targetActive + '"');
code = code.replace(/"bg-\[#1A1A1A\] text-\[#A0A0A0\] border border-\[#333333\] rounded-xl hover:border-\[#D4AF37\]\/50 hover:text-\[#F5F5F5\]"/g, '"' + targetInactive + '"');

// For painPoints in Motivation (Pillar 3):
code = code.replace(/"bg-\[#E74C3C\] text-white border border-\[#333333\] shadow-md"/g, '"' + targetActive + '"');
code = code.replace(/"bg-\[#1A1A1A\] text-\[#F5F5F5\] border-2 border-\[#333333\] shadow-md hover:-translate-y-0\.5"/g, '"' + targetInactive + '"');

// Now, remove any custom base classes from clsx() if the active branch is targetActive
// Regex to match: className={clsx("BASE_CLASS", CONDITION ? targetActive : targetInactive)}
// We'll just replace the entire className block to ensure it's clean.
// Pattern: className=\{clsx\([^,]+,\s*(.*?)\)\}
code = code.replace(/className=\{clsx\("([^"]*)",\s*([^?]+)\s*\?\s*"px-4 py-2 bg-gradient-to-r from-\[#CD7F32\].*?"\s*:\s*"px-4 py-2 bg-\[#1A1A1A\].*?"\)\}/g, 'className={clsx("",  ? "' + targetActive + '" : "' + targetInactive + '")}');

// Let's also fix the otherConcern sharp input box
code = code.replace(/"w-full bg-\[#1A1A1A\] border-2 border-\[#333333\] p-2 text-\[#F5F5F5\]  font-medium outline-none focus:border-white\/50"/g, '"w-full appearance-none bg-transparent border-b-2 border-[#333333] pb-2 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] transition-colors rounded-none"');
// and relocationDestination sharp input box
code = code.replace(/"w-full max-w-md bg-\[#1A1A1A\] border border-\[#333333\] p-3 text-\[#F5F5F5\] font-medium  outline-none focus:border-white\/50 shadow-md"/g, '"w-full appearance-none bg-transparent border-b-2 border-[#333333] pb-2 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] transition-colors rounded-none"');
// and rentMethod
code = code.replace(/"bg-\[#121212\]\/90 border border-\[#333333\] rounded-xl p-5 my-4"/g, '"w-full appearance-none bg-transparent border-b-2 border-[#333333] pb-2 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] transition-colors rounded-none"');

fs.writeFileSync(path, code);
console.log('Cleaned up toggles and remaining inputs');
