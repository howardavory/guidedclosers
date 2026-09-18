const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

code = code.replace(
  '      </div>\n\n                  </div>\n                </div>\n              )}\n</ConditionSection>\n)}\n  \n              {currentStep === 2 && (',
  '      </div>\n</ConditionSection>\n)}\n  \n              {currentStep === 2 && ('
);

fs.writeFileSync('src/components/script/CallScript.jsx', code);
