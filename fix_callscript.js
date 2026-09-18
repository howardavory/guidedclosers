const fs = require('fs');
let code = fs.readFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', 'utf8');

// 1. Aesthetics: Update agent bubbles
code = code.replace(/background: 'rgba\(56, 189, 248, 0\.1\)',\s*border: '1px solid rgba\(56, 189, 248, 0\.2\)'/g, "background: '#000', border: '2px solid #06b6d4', boxShadow: '6px 6px 0px #06b6d4', color: '#fff'");

// Update agent bubble text color if it exists as color: '#e0e0e0' or similar
code = code.replace(/color: '#e0e0e0'/g, "color: '#fff'");

// Update 'DISQUALIFY / STOP' Button
code = code.replace(
  /<button\s+onClick=\{\(\) => setShowDisqualifyMenu\(!showDisqualifyMenu\)\}\s+style=\{\{ background: 'var\(--bg-card-soft\)', color: 'var\(--text-soft\)', padding: '12px 25px', borderRadius: '100px', border: '1px solid var\(--border-subtle\)'/g,
  `<button 
            onClick={() => setShowDisqualifyMenu(!showDisqualifyMenu)}
            style={{ background: '#000', color: '#fff', padding: '12px 25px', borderRadius: '100px', border: '2px solid #d946ef', boxShadow: '6px 6px 0px #d946ef'`
);

// 2. Opener (Pillar 1)
const oldOpener = /\{\s*formData\.isRealtor \?[\s\S]*?Thank you and I look forward to speaking with you\."`\n\s*\}\n\s*<\/div>/;
const newOpener = `{\n                  formData.isRealtor \n                  ? \`"Hey \${formData.leadName || 'there'}, my name is \${formData.agentName || 'Avery'}. I'm a local investor calling about \${formData.targetAddress || 'the property'}. I noticed it's listed and wanted to see if you're open to a cash offer?"\`\n                  : \`"Hey \${formData.leadName || '[Name]'}, how are you doing today? [Pause for validation] My name is \${formData.agentName || 'Avery'}, local investor here. I was just reaching out about \${formData.targetAddress || '[Property Address]'} to see if you'd consider selling and would possibly be open to a cash offer."\`\n                }\n              </div>`;
code = code.replace(oldOpener, newOpener);

// 3. Add 'Proceed to Next' button to Pillar 1
const pillar1End = /(<div className="bubble-row agent" style=\{\{ marginTop: '1\.5rem' \}\}>\s*<div className="bubble-label">Agent \(If Yes\)<\/div>\s*<div className="bubble">[\s\S]*?<\/div>\s*<\/div>)\s*(?=\)\)\}\s*\{\/\* PILLAR 2)/;
code = code.replace(pillar1End, `$1\n\n            {currentStep === 1 && (\n              <button className="next-step-btn" onClick={() => handleProceed(2)} style={{ marginTop: '1.5rem', animation: 'fadeIn 0.4s ease' }}>\n                 Proceed to Property Details & Occupancy <ChevronRight size={18} />\n              </button>\n            )}`);

// 4. CRM Sync logic
const summaryBlock = /\{!showSummaryReview \? \([\s\S]*?\{showSummaryReview && \([\s\S]*?<\/div>\s*\)\}/;
const newSyncBlock = `<button \n                  onClick={() => setShowTearSheet(true)} \n                  style={{ \n                    display: 'flex', \n                    alignItems: 'center', \n                    justifyContent: 'center', \n                    gap: '8px', \n                    width: '100%', \n                    padding: '15px', \n                    background: '#000', \n                    color: 'white', \n                    fontWeight: 'bold', \n                    borderRadius: '0px', \n                    border: '2px solid #10b981',\n                    boxShadow: '6px 6px 0px #10b981',\n                    fontSize: '1.1rem', \n                    cursor: 'pointer', \n                    transition: 'transform 0.2s' \n                  }}\n                >\n                  <Database size={20} /> Sync & Generate Tear Sheet\n                </button>`;
code = code.replace(summaryBlock, newSyncBlock);

fs.writeFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', code);
console.log('CallScript.jsx updated successfully!');
