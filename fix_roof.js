const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

let i = code.indexOf('estimates are accurate');
if (i > -1) {
  let target = code.substring(i - 800, i + 300);
  let divIndex = target.lastIndexOf('<div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: ((isTenant');
  if (divIndex > -1) {
    let exactString = target.substring(divIndex, target.indexOf('</div>', target.indexOf('"Got it.')) + 6);
    let replacement = `</ConditionSection>\n            <ConditionSection id="roof" title="Roof System" isComplete={Boolean(formData?.roofAge || formData?.roofCondition)}>\n            ` + exactString + `\n  </div>`;
    code = code.replace(exactString, replacement);
    console.log('Fixed Roof');
  } else {
    console.log('Could not find divIndex for Roof');
  }
}

fs.writeFileSync('src/components/script/CallScript.jsx', code);
