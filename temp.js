const fs = require('fs');
const code = fs.readFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', 'utf8');

let newCode = code.replace(
  /{[/]\* PILLAR 2: PROPERTY CONDITION \(DISCOVERY\) \*[/]}\s*{activeSource !== 'Agent Outreach' && \(\s*<div id=\"pillar-2\"[\s\S]*?<h3.*?>Pillar 2: Condition & Occupancy<\/h3>\s*<\/div>/,
  '{/* PILLAR 2: PROPERTY CONDITION (DISCOVERY) */}\n        {renderPillar(2, \"Property Details & Occupancy\", <Home size={20} />, (\n          <div>'
);

newCode = newCode.replace(
  /{[/]\* PILLAR 3: MOTIVATION & TIMELINE \*[/]}\s*{activeSource !== 'Agent Outreach' && \(\s*<div id=\"pillar-3\"[\s\S]*?<h3.*?>Pillar 3: Escrow Timeline & Logistics<\/h3>\s*<\/div>/,
  '{/* PILLAR 3: MOTIVATION & TIMELINE */}\n        {renderPillar(3, \"Escrow Timeline & Logistics\", <Clock size={20} />, (\n          <div>'
);

newCode = newCode.replace(
  /{[/]\* PILLAR 4: FINANCIALS & DEBT \*[/]}\s*{activeSource !== 'Agent Outreach' && \(\s*<div id=\"pillar-4\"[\s\S]*?<h3.*?>Pillar 4: Financials & Debt<\/h3>\s*<\/div>/,
  '{/* PILLAR 4: FINANCIALS & DEBT */}\n        {renderPillar(4, \"Financials & Debt\", <DollarSign size={20} />, (\n          <div>'
);

newCode = newCode.replace(
  /{[/]\* PILLAR 5: THE OFFER PIVOT \*[/]}\s*{activeSource !== 'Agent Outreach' && \(\s*<div id=\"pillar-5\"[\s\S]*?<h3.*?>Pillar 5: The Offer \(Pivot\)<\/h3>\s*<\/div>/,
  '{/* PILLAR 5: THE OFFER PIVOT */}\n        {renderPillar(5, \"The Offer (Pivot)\", <Calculator size={20} />, (\n          <div>'
);

newCode = newCode.replace(
  /{[/]\* PILLAR 6: THE CLOSE & CONTRACTING \*[/]}\s*{activeSource !== 'Agent Outreach' && \(\s*<div id=\"pillar-6\"[\s\S]*?<h3.*?>Pillar 6: The Close & Logistics<\/h3>\s*<\/div>/,
  '{/* PILLAR 6: THE CLOSE & CONTRACTING */}\n        {renderPillar(6, \"The Close & Logistics\", <PenTool size={20} />, (\n          <div>'
);

fs.writeFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', newCode);
console.log('Success!');
