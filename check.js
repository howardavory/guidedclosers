const fs = require('fs');
const code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');
const sMFStart = '{/* Property Dynamics Inputs */}';
const sRoofStart = '<ConditionSection id="roof"';
console.log('MF ends before roof? ' + (code.indexOf(sRoofStart) > code.indexOf(sMFStart)));
