const fs = require('fs');
const lines = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8').split('\n');

const startIndex = lines.findIndex(l => l.includes('ConditionSection id="property"'));
const endIndex = lines.findIndex(l => l.includes('ConditionSection id="roof"'));

const block = lines.slice(startIndex, endIndex).join('\n');
fs.writeFileSync('property_basics_dump.txt', block);
