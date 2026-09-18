const fs = require('fs');
const path = 'src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

// Step 2: Fix Blocky Inactive Toggles
// The user wants the exact inactive string:
const exactInactive = 'px-4 py-2 bg-[#1A1A1A] text-[#A0A0A0] border border-[#333333] rounded-xl hover:border-[#D4AF37]/50 hover:text-[#F5F5F5] transition-all';

// The regex will find anything that looks like an inactive toggle and replace it with exactInactive.
// e.g. "bg-[#1A1A1A] text-[#A0A0A0] border border-[#333333]" (with or without other stuff)
// But we must avoid replacing things that aren't toggles, like maybe some random div?
// It's mostly inside clsx( ... : "..." )
code = code.replace(/"px-4 py-2 bg-\[#1A1A1A\] text-\[#A0A0A0\] border border-\[#333333\] rounded-xl hover:border-\[#D4AF37\]\/50 hover:text-\[#F5F5F5\] transition-all"/g, '"' + exactInactive + '"');
code = code.replace(/"bg-\[#1A1A1A\] text-\[#A0A0A0\] border border-\[#333333\] rounded-xl hover:border-\[#D4AF37\]\/50 hover:text-\[#F5F5F5\]"/g, '"' + exactInactive + '"');
code = code.replace(/"bg-\[#1A1A1A\] text-\[#A0A0A0\] border border-\[#333333\] rounded-xl hover:border-\[#D4AF37\]\/50 hover:text-\[#F5F5F5\] transition-all"/g, '"' + exactInactive + '"');
code = code.replace(/"bg-\[#1A1A1A\] text-\[#A0A0A0\] border border-\[#333333\] hover:border-\[#D4AF37\]\/50 hover:text-white px-4 py-2 rounded-xl transition-all"/g, '"' + exactInactive + '"');
code = code.replace(/"px-4 py-2 bg-\[#1A1A1A\] text-\[#A0A0A0\] border border-\[#333333\] rounded-xl hover:border-\[#D4AF37\]\/50 hover:text-\[#F5F5F5\]"/g, '"' + exactInactive + '"');

// And remove any base classes containing rounded-sm, rounded-md, rounded-lg, rounded-none inside clsx
// We'll just do a global replace on the specific base classes that were causing conflicts:
code = code.replace(/"px-5 py-2 border-2 text-sm font-semibold tracking-normal normal-case transition-all hover:-translate-y-0\.5 duration-300 rounded-lg"/g, '""');
code = code.replace(/"px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2"/g, '""');
code = code.replace(/"text-\[10px\] font-bold  px-3 py-1 rounded-sm transition-colors cursor-pointer"/g, '""');

// Step 3: Eliminate "Sharp Line" Inputs (Global)
const targetInput = 'w-full bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all';
const sleekInput = 'w-full appearance-none bg-transparent border-b-2 border-[#333333] pb-2 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] transition-colors rounded-none';

// Replace all sleekInputs with targetInput
code = code.split(sleekInput).join(targetInput);

// Let's also check for any textareas that might use it
code = code.split(sleekInput).join(targetInput); // already did, but just in case it's verbatim

fs.writeFileSync(path, code);
console.log('Overrides fixed');
