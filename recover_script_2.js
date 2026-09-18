const fs = require('fs');

const oldFile = fs.readFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/src/components/CallScript.jsx', 'utf8');
const currentFile = fs.readFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', 'utf8');

// 1. Extract from old file
const startPillar2 = oldFile.indexOf('{/* PILLAR 2: PROPERTY CONDITION (DISCOVERY) */}');
const endPillar6 = oldFile.indexOf('{/* RIGHT COLUMN: THE CALCULATOR HUD */}');
let recoveredContent = oldFile.substring(startPillar2, endPillar6);

// 2. Perform transformations
recoveredContent = recoveredContent.replace(/className="bubble-row agent"[^>]*>/g, 'className="flex flex-col mb-2 animate-slideIn">');
recoveredContent = recoveredContent.replace(/<div className="bubble-label"[^>]*>(.*?)<\/div>/g, '<span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">$1</span>');
recoveredContent = recoveredContent.replace(/<div className="bubble"[^>]*>/g, '<div className="relative bg-black/60 backdrop-blur-md border-4 border-[#00E5FF] p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6">');
recoveredContent = recoveredContent.replace(/className="toggles-row"/g, 'className="flex flex-wrap gap-2"');
recoveredContent = recoveredContent.replace(/className={`toggle-pill/g, 'className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-[2px_2px_0px_#000] hover:-translate-y-0.5');

recoveredContent = recoveredContent.replace(/handleSingleSelect\('([^']+)', ([^\)]+)\)/g, "updateForm('$1', $2)");
recoveredContent = recoveredContent.replace(/handleToggle\('([^']+)', ([^\)]+)\)/g, "() => {\n  const current = formData['$1'] || [];\n  if (current.includes($2)) {\n    updateForm('$1', current.filter(i => i !== $2));\n  } else {\n    updateForm('$1', [...current, $2]);\n  }\n}");
recoveredContent = recoveredContent.replace(/setFormData\(\{\.\.\.formData,\s*([^:]+):\s*([^}]+)\}\)/g, "updateForm('$1', $2)");

// Fix the syntax error
recoveredContent = recoveredContent.replace(/<div className="flex flex-col mb-2 animate-slideIn"> 0\) \|\| \(isVacant && formData\.vacantIssues\.length > 0\)\) \? '1\.5rem' : '2\.5rem' }}>/g, 
'<div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: ((isTenant && formData.tenantStatus.length > 0) || (isVacant && formData.vacantIssues.length > 0)) ? "1.5rem" : "2.5rem" }}>');

// Clean up trailing divs
const lastPillarEnding = recoveredContent.lastIndexOf('</div>');
if(lastPillarEnding !== -1) {
    recoveredContent = recoveredContent.substring(0, lastPillarEnding) + recoveredContent.substring(lastPillarEnding + 6);
}

// 3. Find the target insertion point in the current file
const targetStart = currentFile.indexOf('{/* PILLAR 2: PROPERTY CONDITION (DISCOVERY) */}');
const targetEnd = currentFile.indexOf('</div> {/* close Left Column */}');

if(targetStart === -1 || targetEnd === -1) {
    console.log("Could not find replacement boundaries in current file.");
} else {
    const finalFile = currentFile.substring(0, targetStart) + 
                      "{/* PILLAR 2: PROPERTY CONDITION (DISCOVERY) */}\n" + 
                      recoveredContent + "\n" +
                      currentFile.substring(targetEnd);
    fs.writeFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', finalFile);
    console.log("Successfully replaced corrupted pillar content.");
}
