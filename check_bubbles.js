const fs = require('fs');
const code = fs.readFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', 'utf8');

const matches = code.match(/className="bubble"[\s\S]*?<\/div>/g);
if (matches) {
  console.log('Found ' + matches.length + ' bubbles.');
  console.log('Sample 1:\n' + matches[0]);
}

const styledBubbles = code.match(/<div className="bubble" style=\{.*?\}\s*>/g);
if (styledBubbles) {
  console.log('\nStyled bubbles:\n' + styledBubbles.join('\n'));
} else {
  console.log('\nNo styled bubbles found with inline styles!');
}
