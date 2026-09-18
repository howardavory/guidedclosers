const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');
code = code.replace(
  '          </div>\n</ConditionSection>\n            <ConditionSection id="exterior"',
  '</ConditionSection>\n            <ConditionSection id="exterior"'
);
fs.writeFileSync('src/components/script/CallScript.jsx', code);
