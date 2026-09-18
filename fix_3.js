const fs = require('fs');

const file = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the "Confirm Property Details" section
const startIdx = content.indexOf('{/* Confirm Property Details */}');
const endIdx = content.indexOf('{/* PILLAR 3: MOTIVATION & PAIN */}');

if(startIdx !== -1 && endIdx !== -1) {
    // Cut out the section
    content = content.substring(0, startIdx) + '\n            ' + content.substring(endIdx);
}

// 2. Add TearSheet Import
if (!content.includes('import TearSheet')) {
    content = content.replace('import clsx', 'import TearSheet from \\'../documents/TearSheet\\';\nimport clsx');
}

// 3. Add TearSheet Component
if (!content.includes('<TearSheet')) {
    content = content.replace('  );\n}\n', `
      {showTearSheet && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', overflowY: 'auto' }}>
          <div style={{ position: 'relative', maxWidth: '1200px', width: '100%', backgroundColor: 'transparent' }}>
            <button onClick={() => setShowTearSheet(false)} style={{ position: 'absolute', top: '-40px', right: 0, background: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '8px' }}>Close</button>
            <TearSheet activeLead={activeLead} formData={formData} />
          </div>
        </div>
      )}
  );
}
`);
}

fs.writeFileSync(file, content);
console.log("Done.");
