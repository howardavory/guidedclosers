const fs = require('fs');
const code = fs.readFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/RehabCalculator.jsx', 'utf8');

const calcContainerMatch = code.match(/className="calc-container"/g);
console.log('Rehab calc-container:', calcContainerMatch ? calcContainerMatch.length : 0);

const styleMatches = code.match(/style=\{\{.*?\}\}/g);
if(styleMatches) {
  console.log('Sample styles in RehabCalculator:');
  for(let i=0; i<Math.min(5, styleMatches.length); i++) {
    console.log(styleMatches[i]);
  }
}
