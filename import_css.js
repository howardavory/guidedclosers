const fs = require('fs');
let code = fs.readFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', 'utf8');

if (!code.includes("import './CallScript.css'")) {
  code = code.replace(/import clsx from 'clsx';/, "import clsx from 'clsx';\nimport './CallScript.css';");
  fs.writeFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', code);
  console.log('Imported CallScript.css');
} else {
  console.log('Already imported.');
}
