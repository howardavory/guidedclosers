const fs = require('fs');

// 1. Fix CallScript.jsx inputs and grey backgrounds
function fixCallScript() {
  let code = fs.readFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', 'utf8');

  // Remove ugly grey backgrounds inside the bubbles
  code = code.replace(/background:\s*'rgba\(255,\s*255,\s*255,\s*0\.4\)'/g, "background: 'transparent'");
  code = code.replace(/background:\s*'rgba\(0,\s*0,\s*0,\s*0\.02\)'/g, "background: 'transparent'");

  // Convert modern-input to Tailwind
  code = code.replace(/className="modern-input"/g, 'className="w-full p-3 bg-[#111] text-white border-2 border-white/20 font-bold text-lg focus:outline-none focus:bg-black focus:border-[#00E5FF] focus:shadow-[4px_4px_0px_#00E5FF] transition-all skew-x-[-2deg]"');

  // Ensure M2M and Lease toggles use the correct active condition logic which was slightly messed up in last regex
  code = code.replace(/formData\.leaseType === 'M2M' \? 'active' : '' \? 'bg-\[#00E5FF\] text-black border-\[#00E5FF\] shadow-\[4px_4px_0px_#00E5FF\]' : 'bg-black border-white text-white'/g, "formData.leaseType === 'M2M' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'");
  code = code.replace(/formData\.leaseType === 'Lease' \? 'active' : '' \? 'bg-\[#00E5FF\] text-black border-\[#00E5FF\] shadow-\[4px_4px_0px_#00E5FF\]' : 'bg-black border-white text-white'/g, "formData.leaseType === 'Lease' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'");
  
  // Fix the other toggle-pill bugs from previous regex
  code = code.replace(/\$\{([^}]+)\} \? 'active' : '' \? 'bg-\[#00E5FF\]/g, "${$1 ? 'bg-[#00E5FF]");
  
  fs.writeFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', code);
  console.log('Fixed CallScript.jsx inputs and toggles!');
}

// 2. Fix Calculators
function fixCalculator(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Convert calc-container to Tailwind Miles Morales theme (jagged, dual color)
  code = code.replace(/<div className="calc-container"[^>]*>/g, '<div className="bg-black/90 border-4 border-[#d946ef] p-8 shadow-[8px_8px_0px_#00E5FF] relative mb-6 skew-x-[-1deg]">');
  
  // Also catch generic outer divs if they don't have calc-container
  // (We'll just look for standard React outer div pattern for calculators if calc-container is missing)
  if (!code.includes('calc-container')) {
     code = code.replace(/<div style=\{\{\s*marginTop:\s*'20px',\s*background:\s*'#111',\s*padding:\s*'20px',\s*borderRadius:\s*'8px',\s*border:\s*'1px solid #333'\s*\}\}>/, '<div className="bg-black/90 border-4 border-[#d946ef] p-8 shadow-[8px_8px_0px_#00E5FF] relative mb-6 skew-x-[-1deg] mt-5">');
     code = code.replace(/<div style=\{\{\s*background:\s*'#111',\s*padding:\s*'2rem',\s*color:\s*'white',\s*overflow:\s*'visible'\s*\}\}>/, '<div className="bg-black/90 border-4 border-[#d946ef] p-8 shadow-[8px_8px_0px_#00E5FF] relative mb-6 skew-x-[-1deg]">');
  }

  // Convert inputs
  code = code.replace(/style=\{\{\s*width:\s*'100%',\s*padding:\s*'10px',\s*background:\s*'#222',\s*border:\s*'1px solid #444',\s*color:\s*'white',\s*borderRadius:\s*'0px'\s*\}\}/g, 'className="w-full p-4 bg-[#111] text-white border-2 border-white/20 font-bold text-xl focus:outline-none focus:bg-black focus:border-[#d946ef] focus:shadow-[4px_4px_0px_#d946ef] transition-all skew-x-[-2deg]"');
  code = code.replace(/style=\{\{\s*width:\s*'100%',\s*padding:\s*'10px',\s*background:\s*'#222',\s*border:\s*'1px solid #444',\s*color:\s*'white',\s*borderRadius:\s*'4px'\s*\}\}/g, 'className="w-full p-4 bg-[#111] text-white border-2 border-white/20 font-bold text-xl focus:outline-none focus:bg-black focus:border-[#d946ef] focus:shadow-[4px_4px_0px_#d946ef] transition-all skew-x-[-2deg]"');

  // Convert "Result Area" to dual color theme
  code = code.replace(/style=\{\{\s*marginTop:\s*'20px',\s*paddingTop:\s*'20px',\s*borderTop:\s*'1px solid #333',\s*display:\s*'flex',\s*justifyContent:\s*'space-between',\s*alignItems:\s*'center'\s*\}\}/g, 'className="border-t-4 border-dashed border-[#00E5FF] pt-6 mt-6 flex justify-between items-center"');
  code = code.replace(/style=\{\{\s*marginTop:\s*'2rem',\s*paddingTop:\s*'1rem',\s*borderTop:\s*'1px solid #333',\s*display:\s*'flex',\s*justifyContent:\s*'space-between',\s*alignItems:\s*'center'\s*\}\}/g, 'className="border-t-4 border-dashed border-[#00E5FF] pt-6 mt-6 flex justify-between items-center"');

  // Total text
  code = code.replace(/style=\{\{\s*fontSize:\s*'1\.5rem',\s*fontWeight:\s*'bold',\s*color:\s*'#10b981'\s*\}\}/g, 'className="text-4xl font-black text-white [text-shadow:3px_3px_0px_#d946ef,_-3px_-3px_0px_#00E5FF]"');
  code = code.replace(/style=\{\{\s*fontSize:\s*'2rem',\s*fontWeight:\s*'bold',\s*color:\s*'#10b981'\s*\}\}/g, 'className="text-5xl font-black text-white [text-shadow:3px_3px_0px_#d946ef,_-3px_-3px_0px_#00E5FF]"');

  fs.writeFileSync(filePath, code);
  console.log('Fixed ' + filePath.split('/').pop());
}

fixCallScript();
fixCalculator('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/RehabCalculator.jsx');
fixCalculator('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CreativeCalculator.jsx');
