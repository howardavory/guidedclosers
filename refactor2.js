const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

// 8. End of Exterior / Start of Red Flags
let i = code.indexOf('have you guys noticed any settling with the foundation, or are there any unpermitted add-ons');
if (i > -1) {
  let target = code.substring(i - 400, i + 100);
  let divIndex = target.lastIndexOf('<div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: \'2rem\' }}>');
  if (divIndex > -1) {
    let exactString = target.substring(divIndex, target.indexOf('</div>', divIndex + 300) + 6);
    let newString = '</ConditionSection>\n            <ConditionSection id="redflags" title="Red Flags & Structure" isComplete={Boolean(formData?.structuralRedFlags?.length > 0)}>\n' + exactString.replace(`style={{ marginTop: '2rem' }}`, '');
    code = code.replace(exactString, newString);
    console.log('Replaced Red Flags Start');
  }
}

// 9. End of Red Flags / End of Pillar 2
let j = code.indexOf('renderPillar(3');
if (j > -1) {
  let target = code.substring(j - 500, j);
  if (target.includes('))}')) {
     code = code.replace(target, target.replace('))}', '</ConditionSection>\n          </div>\n        ))}'));
     console.log('Replaced Pillar 2 End');
  } else {
     code = code.replace(/\n\s*<\/div>\n\s*\)\)\}\s*\{\/\* PILLAR 3/, '\n            </ConditionSection>\n          </div>\n        ))}\n\n        {/* PILLAR 3');
     console.log('Replaced Pillar 2 End via fallback');
  }
}

fs.writeFileSync('src/components/script/CallScript.jsx', code);
console.log('Done replacing.');
