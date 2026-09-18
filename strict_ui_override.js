const fs = require('fs');

// 1. UPDATE CALLSCRIPT.JSX
const path1 = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx';
let code1 = fs.readFileSync(path1, 'utf8');

const btnRegex = /<button[\s\S]*?onClick=\{\(\) => setShowDisqualifyMenu\(!showDisqualifyMenu\)\}[\s\S]*?>[\s\S]*?<Ban size=\{20\} color="#FFFFFF" strokeWidth=\{3\} \/>[\s\S]*?DISQUALIFY \/ STOP[\s\S]*?<\/button>/;

const newBtn = `<button 
            onClick={() => setShowDisqualifyMenu(!showDisqualifyMenu)}
            className="w-full bg-[#FF1111] border-4 border-black rounded-none py-4 px-6 text-white font-black italic uppercase flex justify-center items-center gap-2"
            style={{ 
              boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)', 
              cursor: 'pointer', 
              outline: 'none',
              transform: 'translate(0px, 0px)',
              transition: 'all 0.1s ease'
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(6px, 6px)'; e.currentTarget.style.boxShadow = '0px 0px 0px 0px rgba(0,0,0,1)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translate(0px, 0px)'; e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(0,0,0,1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0px, 0px)'; e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(0,0,0,1)'; }}
          >
            <Ban size={24} color="#FFFFFF" strokeWidth={3} />
            DISQUALIFY / STOP
          </button>`;

code1 = code1.replace(btnRegex, newBtn);
fs.writeFileSync(path1, code1);

// 2. UPDATE REHABCALCULATOR.JSX
const path2 = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/RehabCalculator.jsx';
let code2 = fs.readFileSync(path2, 'utf8');

// Engine A Container
code2 = code2.replace(
  /<div style=\{\{ background: "#000000", border: "2px solid #00FFFF", borderRadius: "0px" \}\} className="p-8 relative mb-6 text-white">/g,
  '<div className="bg-black border-4 border-[#00FFFF] rounded-none p-8 relative mb-10 text-white" style={{ boxShadow: "8px 8px 0px 0px #00FFFF" }}>'
);

// Engine C Container
code2 = code2.replace(
  /<div style=\{\{ background: "#000000", border: "2px solid #00FFFF", borderRadius: "0px", padding: "1\.5rem", position: "relative" \}\}>/g,
  '<div className="bg-black border-4 border-[#FF00FF] rounded-none p-8 relative mb-10 text-white" style={{ boxShadow: "8px 8px 0px 0px #FF00FF" }}>'
);

// Inputs
code2 = code2.replace(
  /style=\{\{ background: "#111111", border: "1px solid #FFFFFF", borderRadius: "0px", width: "100%", padding: "8px", color: "#FFF" \}\}/g,
  'className="border-2 border-white rounded-none bg-[#111111] p-2 text-white w-full" style={{ outline: "none" }}'
);
code2 = code2.replace(
  /style=\{\{ background: "transparent", color: "#FFFFFF", border: "none", outline: "none", width: "100%", padding: "4px" \}\} className="no-spinner"/g,
  'className="border-2 border-white rounded-none bg-[#111111] p-2 text-white w-full no-spinner" style={{ outline: "none" }}'
);

// Select inputs
code2 = code2.replace(
  /style=\{\{ width: '100%', padding: '10px', background: '#111111', border: '1px solid #FFFFFF', color: '#FFFFFF', borderRadius: '0px', outline: 'none' \}\}/g,
  'className="border-2 border-white rounded-none bg-[#111111] p-2 text-white w-full" style={{ outline: "none" }}'
);

// Financial Outputs
code2 = code2.replace(
  /<span style=\{\{ fontSize: "2\.7rem", fontWeight: "800", color: "#00FF00" \}\}>\$\{severityEstimate\.toLocaleString\(\)\}<\/span>/g,
  '<span className="text-4xl font-black text-[#00FF00]">${severityEstimate.toLocaleString()}</span>'
);
code2 = code2.replace(
  /<span style=\{\{ fontSize: '3\.5rem', fontWeight: '900', color: '#00FF00' \}\}>\$\{mao\.toLocaleString\(\)\}<\/span>/g,
  '<span className="text-5xl font-black text-[#00FF00]">${mao.toLocaleString()}</span>'
);
code2 = code2.replace(
  /<span style=\{\{ fontSize: '2\.5rem', fontWeight: '900', color: '#00FF00' \}\}>\$\{\(mao - totalDebt\) < 0 \? '-' : ''\}\$\{Math\.abs\(mao - totalDebt\)\.toLocaleString\(\)\}<\/span>/g,
  '<span className="text-4xl font-black text-[#00FF00]">${(mao - totalDebt) < 0 ? "-" : ""}${Math.abs(mao - totalDebt).toLocaleString()}</span>'
);

fs.writeFileSync(path2, code2);
console.log('UI overrides complete!');
