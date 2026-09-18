const fs = require('fs');
const path = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

// Fix the CSS classes
code = code.replace(/\? 'active' : '' \? 'bg-\[#00E5FF\] text-black border-\[#00E5FF\] shadow-\[4px_4px_0px_#00E5FF\]' : 'bg-black border-white text-white'/g, "? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'");

// Make all button transitions smooth where this was an issue
code = code.replace(/transition-all \$\{/g, 'transition-all duration-200 ease-out transform-gpu ${');

// Fix the In a Trust / Probate button to use decisionMakers instead of trustProbate
code = code.replace(/onClick=\{.*?setFormData.*?trustProbate: !formData.trustProbate\}\}\}>In a Trust \/ Probate<\/button>/, "onClick={() => handleSingleSelect('decisionMakers', 'Probate')}>In a Trust / Probate</button>");
code = code.replace(/\$\{formData\.trustProbate === true \? 'bg-\[#00E5FF/g, "${formData.decisionMakers === 'Probate' ? 'bg-[#00E5FF");

// Fix the script logic that checks trustProbate
code = code.replace(/\{formData\.trustProbate/, "{formData.decisionMakers === 'Probate'");

fs.writeFileSync(path, code);
console.log('Fixed double ternaries and Probate toggle logic!');
