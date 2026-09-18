const fs = require('fs');
const code = fs.readFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', 'utf8');

const matches = code.match(/<div className="bubble-row agent"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g);
if (matches) {
  console.log('Found ' + matches.length + ' bubble-row agents.');
  console.log('Sample 1 (Pillar 1):\n' + matches[0]);
  console.log('Sample 2 (Pillar 2):\n' + matches[1]);
}
