const fs = require('fs');
const path = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add 'Ban' to lucide-react imports
code = code.replace(/import {([^}]+)} from 'lucide-react';/, (match, group1) => {
  if (!group1.includes('Ban')) {
    return `import { Ban, ${group1.trim()} } from 'lucide-react';`;
  }
  return match;
});

// 2. Replace the DISQUALIFY / STOP button
const btnOldRegex = /<button[\s\n]*onClick=\{\(\) => setShowDisqualifyMenu\(!showDisqualifyMenu\)\}[\s\n]*style=\{\{\s*background:\s*'#000',\s*color:\s*'#fff',\s*padding:\s*'12px 25px',\s*borderRadius:\s*'100px',\s*border:\s*'2px solid #d946ef',\s*boxShadow:\s*'6px 6px 0px #d946ef',\s*cursor:\s*'pointer',\s*outline:\s*'none',\s*fontSize:\s*'0\.9rem',\s*width:\s*'100%',\s*display:\s*'flex',\s*justifyContent:\s*'center',\s*alignItems:\s*'center',\s*gap:\s*'8px'\s*\}\}[\s\n]*>[\s\n]*<ShieldAlert size=\{16\} \/>[\s\n]*DISQUALIFY \/ STOP[\s\n]*<\/button>/;

const newBtn = `<button 
            onClick={() => setShowDisqualifyMenu(!showDisqualifyMenu)}
            style={{ 
              background: '#FF1111', 
              color: '#FFFFFF', 
              padding: '12px 24px', 
              borderRadius: '0px', 
              border: '3px solid #000000', 
              boxShadow: '4px 4px 0px #000000', 
              cursor: 'pointer', 
              outline: 'none', 
              fontSize: '1rem', 
              fontWeight: '900',
              fontStyle: 'italic',
              textTransform: 'uppercase',
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '8px' 
            }}
          >
            <Ban size={20} color="#FFFFFF" strokeWidth={3} />
            DISQUALIFY / STOP
          </button>`;

code = code.replace(btnOldRegex, newBtn);

fs.writeFileSync(path, code);
console.log('CallScript.jsx button styling updated!');
