const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

code = code.replace(
  '          )}\n        </div>\n      </div>\n</ConditionSection>\n)}',
  '          )}\n        </div>\n</ConditionSection>\n)}'
);

fs.writeFileSync('src/components/script/CallScript.jsx', code);
