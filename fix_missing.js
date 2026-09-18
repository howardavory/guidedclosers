const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

// Fix Roof
let i = code.indexOf('"Got it. Now, to make sure my repair estimates are accurate, let\'s start with the roof');
if (i > -1) {
  let target = code.substring(i - 400, i + 300);
  let divIndex = target.lastIndexOf('<div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: ((isTenant');
  if (divIndex > -1) {
    let exactString = target.substring(divIndex, target.indexOf('</div>', target.indexOf('"Got it.')) + 6);
    let replacement = `</ConditionSection>\n            <ConditionSection id="roof" title="Roof System" isComplete={Boolean(formData?.roofAge || formData?.roofCondition)}>\n            ` + exactString + `\n  </div>`;
    code = code.replace(exactString, replacement);
    console.log('Fixed Roof');
  }
}

// Fix Red Flags
let j = code.indexOf('"Okay, that gives me a great picture of the inside. Last thing before we talk numbers');
if (j > -1) {
  let target = code.substring(j - 400, j + 300);
  let divIndex = target.lastIndexOf('<div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: \'2rem\' }}>');
  if (divIndex > -1) {
    let exactString = target.substring(divIndex, target.indexOf('</div>', target.indexOf('"Okay, that')) + 6);
    let replacement = `</div>\n</ConditionSection>\n            <ConditionSection id="redflags" title="Red Flags & Structure" isComplete={Boolean(formData?.structuralRedFlags?.length > 0)}>\n            ` + exactString + `\n  </div>`;
    code = code.replace(exactString, replacement);
    console.log('Fixed Red Flags');
  }
}

// Fix End of Pillar 2
let endRegex = /(<\/div>\s*\)\)\}\s*\{\/\* PILLAR 3: TIMELINE & RELOCATION \*\/})/;
if (code.match(endRegex)) {
  code = code.replace(endRegex, `</div></ConditionSection>\n          $1`);
  console.log('Fixed End of Pillar 2');
}

fs.writeFileSync('src/components/script/CallScript.jsx', code);
