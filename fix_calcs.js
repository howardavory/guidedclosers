const fs = require('fs');

function applyAesthetics(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // 1. overflow: hidden -> overflow: visible
  code = code.replace(/overflow:\s*'hidden'/g, "overflow: 'visible'");
  
  // 2. borderRadius changes to 0px
  code = code.replace(/borderRadius:\s*'12px'/g, "borderRadius: '0px'");
  code = code.replace(/borderRadius:\s*'24px'/g, "borderRadius: '0px'");
  code = code.replace(/borderRadius:\s*'16px'/g, "borderRadius: '0px'");
  
  // 3. Drop shadows to black solid shadows for container cards
  // E.g. boxShadow: '0 4px 12px rgba(0,0,0,0.1)' -> boxShadow: '8px 8px 0px #000'
  code = code.replace(/boxShadow:\s*'0 4px 12px rgba\(0,\s*0,\s*0,\s*0\.[0-9]+\)'/g, "boxShadow: '8px 8px 0px #000'");
  code = code.replace(/boxShadow:\s*'0 10px 30px rgba\(0,0,0,0\.[0-9]+\)'/g, "boxShadow: '8px 8px 0px #000'");
  
  fs.writeFileSync(filePath, code);
  console.log('Updated aesthetics in ' + filePath.split('/').pop());
}

applyAesthetics('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/RehabCalculator.jsx');
applyAesthetics('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CreativeCalculator.jsx');
applyAesthetics('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/TearSheet.jsx');
