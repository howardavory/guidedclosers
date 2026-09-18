const fs = require('fs');

// 1. ManagerDashboard.jsx
let md = fs.readFileSync('src/components/dashboard/ManagerDashboard.jsx', 'utf-8');
md = md.replace(/className="bg-white min-h-screen p-8"/g, 'className="bg-transparent min-h-screen p-8"');
fs.writeFileSync('src/components/dashboard/ManagerDashboard.jsx', md);

// 2. Pipeline.jsx
let pl = fs.readFileSync('src/components/dashboard/Pipeline.jsx', 'utf-8');
pl = pl.replace(/className="flex flex-col h-full bg-white border-4 border-black/g, 'className="flex flex-col h-full bg-transparent border-4 border-black');
pl = pl.replace(/className="p-4 border-b-4 border-black flex justify-between items-center bg-white"/g, 'className="p-4 border-b-4 border-black flex justify-between items-center bg-[#FFFCE8]"');
pl = pl.replace(/className="min-w-\[300px\] flex flex-col bg-white border-4 border-black shadow-\[4px_4px_0px_\#000\] p-4 mb-4 rounded-xl p-3"/g, 'className="min-w-[300px] flex flex-col comic-paper border-4 border-black shadow-[6px_6px_0px_#000] mb-4 p-3 transform transition-transform hover:-translate-y-1"');
pl = pl.replace(/<div className="flex justify-between items-center mb-4 px-2">/g, 
  `<div className={\`flex justify-between items-center mb-4 p-2 border-4 border-black shadow-[4px_4px_0px_#000] \${['bg-[#00E5FF]','bg-[#FFE600]','bg-[#FF0055]','bg-[#00FF66]','bg-[#B400FF]','bg-[#FF6A00]'][stage.id % 6]}\`}>`);
pl = pl.replace(/<span className="bg-white px-2 py-1 rounded-md text-xs text-black border border-4 border-black">/g, 
  '<span className="bg-white px-2 py-1 text-xs text-black border-4 border-black shadow-[2px_2px_0px_#000] font-black">');
pl = pl.replace(/className="bg-white p-4 rounded-lg border border-4 border-black cursor-pointer hover:border-accent-blue hover:shadow-lg transition-all"/g, 
  'className="bg-white p-4 border-4 border-black cursor-pointer shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all"');
fs.writeFileSync('src/components/dashboard/Pipeline.jsx', pl);

// 3. CallScript.jsx
let cs = fs.readFileSync('src/components/script/CallScript.jsx', 'utf-8');
cs = cs.replace(/<div\s+className=\{clsx\("mb-6 transition-all duration-300 ease-in-out comic-panel", isActive \? "transform -skew-x-1 border-4 border-black neon-glow-cyan bg-white" : isCompleted \? "bg-gray-100 border-4 border-\[\#00E676\] transform skew-x-1" : "bg-white border-4 border-black opacity-80 hover:opacity-100"\)\}>/g, 
`<div className={clsx("mb-6 transition-all duration-300 ease-in-out border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden comic-paper", isActive ? "transform -skew-x-1 neon-glow-cyan" : isCompleted ? "opacity-90 transform skew-x-1" : "opacity-80 hover:opacity-100")}>`);

cs = cs.replace(/<div\s+className="flex justify-between items-center p-5 cursor-pointer select-none"\s+onClick=\{/g, 
`
          <div 
            className={clsx("flex justify-between items-center p-5 cursor-pointer select-none border-b-4 border-black",
              number === 1 ? "bg-[#00E5FF]" : 
              number === 2 ? "bg-[#FFE600]" : 
              number === 3 ? "bg-[#FF0055]" : 
              number === 4 ? "bg-[#00FF66]" : 
              number === 5 ? "bg-[#B400FF]" : "bg-[#FF6A00]"
            )} 
            onClick={`
);

fs.writeFileSync('src/components/script/CallScript.jsx', cs);
