const fs = require('fs');

function forceMilesMoralesTheme(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Container 
  code = code.replace(/style=\{\{\s*background:\s*'#fff'[^}]+\}\}/g, 'className="bg-black/90 border-4 border-[#d946ef] p-8 shadow-[8px_8px_0px_#00E5FF] relative mb-6 skew-x-[-1deg] text-white"');

  // Headers inside the calculator (e.g., Rehab Calculator Title)
  code = code.replace(/style=\{\{\s*margin:\s*0,\s*fontSize:\s*'1\.2rem',\s*color:\s*'var\(--text-dark\)'\s*\}\}/g, 'className="text-2xl font-black text-[#00E5FF] uppercase font-comic tracking-wider"');
  code = code.replace(/style=\{\{\s*margin:\s*'4px 0 0 0',\s*fontSize:\s*'0\.85rem',\s*color:\s*'var\(--text-soft\)'\s*\}\}/g, 'className="text-sm font-bold text-gray-400 uppercase"');
  
  // Header container
  code = code.replace(/style=\{\{\s*padding:\s*'1\.25rem 1\.5rem',\s*background:\s*'linear-gradient[^}]+\}\}/g, 'className="pb-4 border-b-4 border-dashed border-[#00E5FF] mb-6 flex justify-between items-center"');

  // Inner inputs container
  code = code.replace(/style=\{\{\s*padding:\s*'1\.5rem'\s*\}\}/g, 'className="flex flex-col gap-6"');
  
  // Input labels
  code = code.replace(/style=\{\{\s*fontWeight:\s*'600',\s*color:\s*'var\(--text-dark\)',\s*fontSize:\s*'0\.9rem'\s*\}\}/g, 'className="font-bold text-[#d946ef] text-sm uppercase tracking-widest font-comic"');

  // Input wrapper style={{ position: 'relative' }} -> className="relative"
  code = code.replace(/style=\{\{\s*position:\s*'relative'\s*\}\}/g, 'className="relative"');

  // Actual Inputs
  code = code.replace(/style=\{\{\s*width:\s*'100%',\s*padding:\s*'12px',\s*paddingLeft:\s*'35px',\s*borderRadius:\s*'8px',\s*border:\s*'1px solid var\(--border-subtle\)',\s*fontSize:\s*'1\.05rem',\s*transition:\s*'all 0\.2s ease'\s*\}\}/g, 'className="w-full p-4 pl-10 bg-[#111] text-white border-4 border-[#333] font-bold text-xl focus:outline-none focus:bg-black focus:border-[#d946ef] focus:shadow-[4px_4px_0px_#d946ef] transition-all skew-x-[-2deg]"');
  code = code.replace(/style=\{\{\s*width:\s*'100%',\s*padding:\s*'10px',\s*borderRadius:\s*'0px',\s*border:\s*'1px solid var\(--border-subtle\)',\s*fontSize:\s*'1\.05rem',\s*background:\s*'var\(--bg-card\)'\s*\}\}/g, 'className="w-full p-4 bg-[#111] text-white border-4 border-[#333] font-bold text-xl focus:outline-none focus:bg-black focus:border-[#d946ef] focus:shadow-[4px_4px_0px_#d946ef] transition-all skew-x-[-2deg]"');

  // Result Area
  code = code.replace(/style=\{\{\s*marginTop:\s*'1rem',\s*padding:\s*'1\.5rem',\s*background:\s*'var\(--bg-card-soft\)',\s*borderRadius:\s*'12px',\s*display:\s*'flex',\s*justifyContent:\s*'space-between',\s*alignItems:\s*'center',\s*border:\s*'1px solid var\(--border-subtle\)'\s*\}\}/g, 'className="mt-6 pt-6 border-t-4 border-dashed border-[#00E5FF] flex justify-between items-center"');
  code = code.replace(/style=\{\{\s*margin:\s*0,\s*color:\s*'var\(--text-soft\)',\s*fontSize:\s*'1rem'\s*\}\}/g, 'className="text-xl font-bold text-[#00E5FF] uppercase font-comic tracking-wider"');
  code = code.replace(/style=\{\{\s*margin:\s*0,\s*fontSize:\s*'2rem',\s*color:\s*'var\(--text-dark\)'\s*\}\}/g, 'className="text-5xl font-black text-white [text-shadow:3px_3px_0px_#d946ef,_-3px_-3px_0px_#00E5FF]"');
  code = code.replace(/style=\{\{\s*margin:\s*0,\s*fontSize:\s*'2rem',\s*color:\s*'var\(--accent-cyan\)'\s*\}\}/g, 'className="text-5xl font-black text-white [text-shadow:3px_3px_0px_#d946ef,_-3px_-3px_0px_#00E5FF]"');

  // Fix any remaining light styles
  code = code.replace(/style=\{\{\s*padding:\s*'1rem',\s*borderBottom:\s*'1px solid var\(--border-subtle\)',\s*display:\s*'flex',\s*justifyContent:\s*'space-between',\s*alignItems:\s*'center',\s*background:\s*'var\(--bg-card-soft\)'\s*\}\}/g, 'className="pb-4 border-b-4 border-dashed border-[#00E5FF] mb-6 flex justify-between items-center"');

  fs.writeFileSync(filePath, code);
  console.log('Forced Miles Morales theme on ' + filePath.split('/').pop());
}

forceMilesMoralesTheme('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/RehabCalculator.jsx');
forceMilesMoralesTheme('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CreativeCalculator.jsx');
