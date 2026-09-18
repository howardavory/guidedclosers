const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');
code = code.replace(
  '              </div>\n\n</ConditionSection>\n            <ConditionSection id="interior"',
  '</ConditionSection>\n            <ConditionSection id="interior"'
);
fs.writeFileSync('src/components/script/CallScript.jsx', code);
