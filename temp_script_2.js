const fs = require('fs'); 
let c = fs.readFileSync('src/components/script/CallScript.jsx', 'utf-8'); 
c = c.replace(/className=\{clsx\(\"mb-4 border rounded-2xl transition-all duration-300 ease-in-out\", isActive \? \"bg-white border-black shadow-lg\" : isCompleted \? \"bg-white border-accent-success\\/50\" : \"bg-white border-black opacity-80 hover:opacity-100\"\)\}/g, 'className={clsx("mb-6 transition-all duration-300 ease-in-out comic-panel", isActive ? "transform -skew-x-1 border-4 border-black neon-glow-cyan bg-white" : isCompleted ? "bg-gray-100 border-4 border-[#00E676] transform skew-x-1" : "bg-white border-4 border-black opacity-80 hover:opacity-100")}'); 
fs.writeFileSync('src/components/script/CallScript.jsx', c);
