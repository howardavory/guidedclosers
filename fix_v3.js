const fs = require('fs');
let code = fs.readFileSync('C:/Users/avory/.gemini/antigravity/brain/91dc1a01-e8f5-49ce-8347-2f8ca71c1cad/scratch/CallScript_v3_candidate.jsx', 'utf8');

// 1. Remove the duplicated renderPillar header
const r1 = code.indexOf('const renderPillar = (number');
const r2 = code.indexOf('const renderPillar = (number', r1 + 10);
if (r2 !== -1 && (r2 - r1) < 500) {
    code = code.substring(0, r1) + code.substring(r2);
}

// 2. Remove the duplicated interior inside main return
const mainReturn = code.indexOf('return (', code.indexOf('hasMotivation'));
const hScreen = code.indexOf('<div className="flex h-screen', mainReturn);
if (mainReturn !== -1 && hScreen !== -1) {
    code = code.substring(0, mainReturn + 8) + '\n    ' + code.substring(hScreen);
}

fs.writeFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', code);
console.log('Fixed!');
