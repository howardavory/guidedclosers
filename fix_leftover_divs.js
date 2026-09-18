const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

// The previous script already replaced it with `</div>\n</ConditionSection>...`
// I need to undo that `</ConditionSection>` and just leave `</div>`
code = code.replace(
  '\n            </div>\n</ConditionSection>\n              {/* Toggles moved to sidebar */}',
  '\n            </div>\n              {/* Toggles moved to sidebar */}'
);

fs.writeFileSync('src/components/script/CallScript.jsx', code);
