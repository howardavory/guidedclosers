const fs = require('fs');
const path = require('path');
const file = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx';
let code = fs.readFileSync(file, 'utf8');

const regexContainers = /className="([^"]*bg-\[#1A1A1A\][^"]*max-w-full[^"]*mr-4[^"]*)"/g;
code = code.replace(regexContainers, (match, p1) => {
    let newClass = p1.replace(/mr-4/g, '').replace(/max-w-full/g, 'w-full').replace(/p-6/g, 'p-8 md:p-10').replace(/\s+/g, ' ');
    return `className="${newClass.trim()}"`;
});

fs.writeFileSync(file, code);
console.log('Fixed inverted max-w-full mr-4');
