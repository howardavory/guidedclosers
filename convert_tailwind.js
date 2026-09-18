const fs = require('fs');
let code = fs.readFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', 'utf8');

// 1. Replace <div className="bubble-label"> with Tailwind
code = code.replace(/<div className="bubble-label">/g, '<div className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">');

// 2. Replace <div className="bubble"> with Tailwind
code = code.replace(/<div className="bubble">/g, '<div className="relative bg-black/60 backdrop-blur-md border-4 border-[#00E5FF] p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6">');

// 3. Replace <button className={`toggle-pill ...`} with Tailwind
// toggle-pill usually looks like: <button className={`toggle-pill ${condition ? 'active' : ''}`}
code = code.replace(/className=\{`toggle-pill \$\{([^}]+)\}`\}/g, "className={`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all ${$1 ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}`}");

// 4. Replace <div className="bubble-row agent"... with just flex-col layout
// Actually bubble-row agent doesn't need to be replaced if we just give it some margin, but let's replace it with the Pillar 1 row container:
code = code.replace(/<div className="bubble-row agent"(.*?)>/g, '<div className="flex flex-col mb-2 animate-slideIn"$1>');

// 5. Let's fix the toggles-row which was just flex wrap
code = code.replace(/<div className="toggles-row"(.*?)>/g, '<div className="flex flex-wrap gap-3 mt-4"$1>');

fs.writeFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', code);
console.log('Converted classes to Tailwind!');
