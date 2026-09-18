const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

code = code.replace(
  '                    </div>\n            </ConditionSection>\n)}\n{formData.propertyType !== \'Multi-Family\' && (\n            <ConditionSection id="redflags"',
  '                    </div>\n                  </div>\n                </div>\n            </ConditionSection>\n)}\n{formData.propertyType !== \'Multi-Family\' && (\n            <ConditionSection id="redflags"'
);

fs.writeFileSync('src/components/script/CallScript.jsx', code);
