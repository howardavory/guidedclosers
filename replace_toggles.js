const fs = require('fs');
const path = 'src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

const inactiveStr = 'px-4 py-2 bg-[#1A1A1A] text-[#A0A0A0] border border-[#333333] rounded-xl hover:border-[#D4AF37]/50 hover:text-[#F5F5F5] transition-all';
const activeStr = 'px-4 py-2 bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] font-extrabold border-none rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_15px_rgba(229,193,88,0.5)] transition-all';

const pattern6 = /"bg-gradient-to-r from-\[#CD7F32\] via-\[#E5C158\] to-\[#B8860B\] border border-\[#333333\] rounded-none text-\[#F5F5F5\] font-black italic shadow-md"/g;
let count6 = (code.match(pattern6) || []).length;
code = code.replace(pattern6, '"' + activeStr + '"');

// And we should remove "px-4 py-3 transition-all " + from those buttons so they just use the activeStr and inactiveStr directly, or at least they aren't overriding the px-4 py-2 of the activeStr.
const pattern7 = /"px-4 py-3 transition-all "\s*\+\s*\(/g;
let count7 = 0;
// Wait, replacing this blindly might break parenthesis.
// It's: className={"px-4 py-3 transition-all " + (cond ? activeStr : inactiveStr)}
code = code.replace(/className=\{"px-4 py-3 transition-all "\s*\+\s*\(([^?]+)\s*\?\s*"px-4 py-2 bg-gradient-[^"]+"\s*:\s*"px-4 py-2 bg-\[#1A1A1A\][^"]+"\)\}/g, 'className={clsx("",  ? "' + activeStr + '" : "' + inactiveStr + '")}');

fs.writeFileSync(path, code);
console.log('Replacements:', {count6});
