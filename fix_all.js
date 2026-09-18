const fs = require('fs');
const path = 'src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. PROCEED TO PILLAR 5
const pillar5Target = `              <button 
                onClick={() => {
                  if (formData.freeAndClear === undefined || formData.freeAndClear === null) return;
                  handleProceed(5);
                  setTimeout(() => {
                    document.getElementById('pillar-5')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 350);
                }}
                className={clsx(
                  "w-full max-w-lg py-4  font-black italic text-2xl tracking-widest border border-[#000000] rounded-none shadow-md transition-all flex items-center justify-center gap-3",
                  (formData.freeAndClear === undefined || formData.freeAndClear === null) 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-[#D4AF37] text-[#000000] hover:shadow-md hover:-translate-y-0.5"
                )}
              >`;

const pillar5Replacement = `              <button 
                onClick={() => {
                  if (formData.freeAndClear === undefined || formData.freeAndClear === null) return;
                  handleProceed(5);
                  setTimeout(() => {
                    document.getElementById('pillar-5')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 350);
                }}
                className={clsx(
                  "w-full py-3.5 my-4 font-extrabold text-center rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-3",
                  (formData.freeAndClear === undefined || formData.freeAndClear === null)
                    ? "bg-[#1A1A1A] text-[#555555] border border-[#333333] cursor-not-allowed"
                    : "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(229,193,88,0.5)] hover:opacity-95 cursor-pointer"
                )}
              >`;

// Note: It might have disabled attribute in backup
code = code.replace(/<button \s*onClick=\{\(\) => \{\s*handleProceed\(5\);\s*setTimeout\(\(\) => \{\s*document.getElementById\('pillar-5'\)\?\.scrollIntoView\(\{ behavior: 'smooth', block: 'start' \}\);\s*\}, 350\);\s*\}\}\s*disabled=\{formData.freeAndClear === undefined \|\| formData.freeAndClear === null\}\s*className=\{clsx\(\s*"w-full max-w-lg py-4  font-black italic text-2xl tracking-widest border border-\[#000000\] rounded-none shadow-md transition-all flex items-center justify-center gap-3",\s*\(formData.freeAndClear === undefined \|\| formData.freeAndClear === null\) \s*\? "bg-gray-300 text-gray-500 cursor-not-allowed" \s*: "bg-\[#D4AF37\] text-\[#000000\] hover:shadow-md hover:-translate-y-0.5"\s*\)\}\s*>/g, 
`<button 
                onClick={() => {
                  if (formData.freeAndClear === undefined || formData.freeAndClear === null) return;
                  handleProceed(5);
                  setTimeout(() => {
                    document.getElementById('pillar-5')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 350);
                }}
                className={clsx(
                  "w-full py-3.5 my-4 font-extrabold text-center rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-3",
                  (formData.freeAndClear === undefined || formData.freeAndClear === null)
                    ? "bg-[#1A1A1A] text-[#555555] border border-[#333333] cursor-not-allowed"
                    : "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(229,193,88,0.5)] hover:opacity-95 cursor-pointer"
                )}
              >`);


// 2. Final Negotiated Price
const oldFinalPrice = `className="w-full text-4xl font-black text-[#D4AF37] bg-[#1A1A1A]/80 p-4 pl-12 border border-[#D4AF37] text-center focus:outline-none focus:shadow-[0_0_15px_#D4AF37] transition-shadow disabled:opacity-90 placeholder-[#004400]"`;
const newFinalPrice = `className="w-full text-4xl font-black text-[#D4AF37] bg-[#121212] p-4 pl-12 border border-[#D4AF37]/50 rounded-xl focus:outline-none focus:border-[#E5C158] focus:shadow-[0_0_15px_rgba(229,193,88,0.3)] transition-all disabled:opacity-90 placeholder-[#333333]"`;
code = code.replace(oldFinalPrice, newFinalPrice);


// 3. Sharp Inputs in 4, 5, 6
const sleekInput = 'w-full appearance-none bg-transparent border-b-2 border-[#333333] pb-2 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] transition-colors rounded-none';
const inputsToReplace = [
    'w-full bg-[#1A1A1A] border-2 border-[#333333] rounded-none p-3 text-[#F5F5F5]  font-medium placeholder-gray-400 focus:outline-none focus:border-white/50 focus:shadow-md transition-all',
    'w-full bg-[#1A1A1A] border-2 border-[#333333] rounded-none p-3 text-[#F5F5F5] font-medium placeholder-gray-400 focus:outline-none focus:border-white/50 focus:shadow-md transition-all',
    'w-full bg-[#1A1A1A] border-2 border-[#333333] rounded-none p-4 text-[#F5F5F5]  font-medium placeholder-gray-400 focus:outline-none focus:bg-yellow-50 focus:shadow-md transition-all',
    'w-full bg-[#121212] border-b-2 border-[#D4AF37] rounded-none p-3 text-[#F5F5F5] font-medium placeholder-gray-400 focus:outline-none focus:border-white/50 focus:shadow-md transition-all',
    'w-full bg-[#1A1A1A] border-2 border-[#333333] p-2 text-[#F5F5F5]  font-medium outline-none focus:border-white/50', // otherConcern
    'w-full max-w-md bg-[#1A1A1A] border border-[#333333] p-3 text-[#F5F5F5] font-medium  outline-none focus:border-white/50 shadow-md', // relocationDest
    'bg-[#121212]/90 border border-[#333333] rounded-xl p-5 my-4' // rentMethod
];

inputsToReplace.forEach(str => {
    code = code.split(str).join(sleekInput);
});


// 4. Missing Toggles in Pillar 3, 4, 5, 6
const targetActive = 'px-4 py-2 bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] font-extrabold border-none rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_15px_rgba(229,193,88,0.5)] transition-all';
const targetInactive = 'px-4 py-2 bg-[#1A1A1A] text-[#A0A0A0] border border-[#333333] rounded-xl hover:border-[#D4AF37]/50 hover:text-[#F5F5F5] transition-all';

// Timeline
code = code.replace(/"bg-\[#FFFF00\] text-\[#F5F5F5\] border border-\[#333333\] transition-all duration-300 - shadow-md font-black italic"/g, '"' + targetActive + '"');
code = code.replace(/"bg-\[#1A1A1A\] text-\[#F5F5F5\] border-2 border-\[#333333\] shadow-none hover:-translate-y-0\.5"/g, '"' + targetInactive + '"');

// Free & Clear
code = code.replace(/"bg-gradient-to-r from-\[#CD7F32\] via-\[#E5C158\] to-\[#B8860B\] text-\[#000000\] font-extrabold border border-\[#333333\] shadow-md"/g, '"' + targetActive + '"');
code = code.replace(/"bg-\[#1A1A1A\] text-\[#F5F5F5\] border-2 border-\[#333333\] shadow-none hover:-translate-y-0\.5 -"/g, '"' + targetInactive + '"');

// Pitch Type
code = code.replace(/"bg-\[#FF00FF\] text-white border border-\[#333333\] shadow-md font-black italic -"/g, '"' + targetActive + '"');

// Motivation (painPoints)
code = code.replace(/"bg-\[#E74C3C\] text-white border border-\[#333333\] shadow-md"/g, '"' + targetActive + '"');
code = code.replace(/"bg-\[#1A1A1A\] text-\[#F5F5F5\] border-2 border-\[#333333\] shadow-md hover:-translate-y-0\.5"/g, '"' + targetInactive + '"');

// Rebuttals
code = code.replace(/"bg-gradient-to-r from-\[#CD7F32\] via-\[#E5C158\] to-\[#B8860B\] text-\[#000000\] font-extrabold border-none rounded-xl shadow-\[0_0_15px_rgba\(229,193,88,0\.4\)\]"/g, '"' + targetActive + '"');
code = code.replace(/"bg-\[#1A1A1A\] text-\[#A0A0A0\] border border-\[#333333\] rounded-xl hover:border-\[#D4AF37\]\/50 hover:text-\[#F5F5F5\]"/g, '"' + targetInactive + '"');

// Now we wipe out the base classes that override these styles.
const baseClassesToRemove = [
    /"px-5 py-2 text-sm font-semibold tracking-wide tracking-widest  transition-all transition-all duration-300 -"/g,
    /"flex-1 px-5 py-4 text-sm font-semibold tracking-wide tracking-widest  transition-all transform"/g,
    /"flex-1 p-6 text-xl font-semibold tracking-wide tracking-widest  transition-all transform"/g,
    /"px-4 py-2 text-xs font-bold  transition-all"/g,
    /"px-4 py-2 text-sm font-black  transition-all border-2 border-\[#333333\]"/g
];

baseClassesToRemove.forEach(regex => {
    // replace with "" so clsx("", ...) works.
    code = code.replace(regex, '""');
});


fs.writeFileSync(path, code);
console.log('Restoration and Fix Complete');
