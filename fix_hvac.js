const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

code = code.replace(
  '    </ConditionSection>\n            <ConditionSection id="hvac"',
  '    </div>\n  </div>\n    </ConditionSection>\n            <ConditionSection id="hvac"'
);

fs.writeFileSync('src/components/script/CallScript.jsx', code);
