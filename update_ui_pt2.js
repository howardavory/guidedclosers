const fs = require('fs');
const path = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/RehabCalculator.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Inject Style Tag for Slider
if (!code.includes('.neo-slider')) {
  const styleBlock = `
  <style>
    .neo-slider {
      -webkit-appearance: none;
      width: 100%;
      background: #333333;
      height: 6px;
      outline: none;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .neo-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: #000000;
      border: 2px solid #00FF00;
      cursor: pointer;
      border-radius: 0px;
    }
    .neo-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: #000000;
      border: 2px solid #00FF00;
      cursor: pointer;
      border-radius: 0px;
    }
  </style>
  `;
  code = code.replace(/<div style=\{\{ display: 'flex', flexDirection: 'column', gap: '1\.5rem' \}\}>/, `<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>\n${styleBlock}`);
}

// 2. Engine A Header & Container
code = code.replace(
  /<div className="calc-card" className="bg-black\/90 border-4 border-\[#d946ef\] p-8 shadow-\[8px_8px_0px_#00E5FF\] relative mb-6 skew-x-\[-1deg\] text-white">/g,
  '<div style={{ background: "#000000", border: "2px solid #00FFFF", borderRadius: "0px" }} className="p-8 relative mb-6 text-white">'
);

code = code.replace(
  /<div className="pb-4 border-b-4 border-dashed border-\[#00E5FF\] mb-6 flex justify-between items-center">[\s\S]*?<h3 className="text-2xl font-black text-\[#00E5FF\] uppercase font-comic tracking-wider">Repair Calculator & MAO<\/h3>[\s\S]*?<p className="text-sm font-bold text-gray-400 uppercase">Evaluate condition and determine max allowable offer<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>/,
  `<div style={{ borderBottom: "2px dashed #00FFFF" }} className="pb-4 mb-6 flex justify-between items-center">
        <div>
          <h3 style={{ color: "#FFFFFF", fontWeight: "800", fontStyle: "italic" }} className="text-2xl uppercase tracking-wider">[DAMAGE ASSESSMENT ENGINE]</h3>
        </div>
      </div>`
);

// 3. Engine A Inputs
code = code.replace(
  /className="smart-input-container"/g,
  'style={{ background: "#111111", border: "1px solid #FFFFFF", borderRadius: "0px", display: "flex", alignItems: "center", padding: "4px 8px" }}'
);
code = code.replace(
  /className="smart-input"/g,
  'style={{ background: "transparent", color: "#FFFFFF", border: "none", outline: "none", width: "100%", padding: "4px" }} className="no-spinner"'
);

// 4. Slider track dynamic color
// We need to use standard inline styling for the background gradient to simulate the active track
code = code.replace(
  /<input\s+type="range"\s+min="10"\s+max="150"\s+step="5"\s+value=\{costPerSqft\}\s+onChange=\{\(e\) => setCostPerSqft\(Number\(e\.target\.value\)\)\}\s+style=\{\{\s+width: '100%',\s+accentColor: getSliderColor\(costPerSqft\),\s+cursor: 'pointer',\s+height: '6px',\s+borderRadius: '5px'\s+\}\}\s*\/>/g,
  `<input 
              type="range" 
              min="10" 
              max="150" 
              step="5" 
              value={costPerSqft} 
              onChange={(e) => setCostPerSqft(Number(e.target.value))} 
              className="neo-slider"
              style={{
                background: \`linear-gradient(to right, #00FF00 \${((costPerSqft - 10) / 140) * 100}%, #333333 \${((costPerSqft - 10) / 140) * 100}%)\`
              }}
            />`
);

// 5. Severity Total Output (Neon Green, 1.5x larger font)
code = code.replace(
  /<span style=\{\{ fontSize: '1\.8rem', fontWeight: '700', color: 'var\(--text-dark\)' \}\}>\s*\$\{severityEstimate\.toLocaleString\(\)\}\s*<\/span>/g,
  '<span style={{ fontSize: "2.7rem", fontWeight: "800", color: "#00FF00" }}>${severityEstimate.toLocaleString()}</span>'
);

// 6. Engine C Container
code = code.replace(
  /<div className="calc-card" style=\{\{\s*backdropFilter: 'blur\(30px\)',\s*border: `1px solid \$\{isUnderwater \? 'rgba\(239, 68, 68, 0\.4\)' : 'rgba\(16, 185, 129, 0\.4\)'\}`,\s*borderRadius: '20px',\s*padding: '1\.5rem',\s*boxShadow: isUnderwater \? '0 0 40px rgba\(239, 68, 68, 0\.15\)' : '0 0 40px rgba\(16, 185, 129, 0\.15\)',\s*position: 'relative',\s*overflow: 'visible',\s*transition: 'all 0\.4s ease'\s*\}\}>/g,
  '<div style={{ background: "#000000", border: "2px solid #00FFFF", borderRadius: "0px", padding: "1.5rem", position: "relative" }}>'
);
code = code.replace(/<div style=\{\{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: isUnderwater \? 'linear-gradient\(90deg, #ef4444, #dc2626\)' : 'linear-gradient\(90deg, #10b981, #059669\)' \}\}><\/div>/, '');

// 7. Engine C Header
code = code.replace(
  /<div style=\{\{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var\(--border-subtle\)', paddingBottom: '0\.75rem' \}\}>\s*<div style=\{\{ display: 'flex', alignItems: 'center', gap: '0\.75rem' \}\}>\s*<div style=\{\{ background: isUnderwater \? 'rgba\(239, 68, 68, 0\.15\)' : 'rgba\(16, 185, 129, 0\.15\)', padding: '8px', borderRadius: '50%' \}\}>\s*<Calculator size=\{20\} color=\{isUnderwater \? "#ef4444" : "var\(--accent-emerald\)"\} \/>\s*<\/div>\s*<h4 style=\{\{ margin: 0, color: 'var\(--text-dark\)', fontSize: '1\.1rem', fontWeight: '700' \}\}>Cash Offer MAO<\/h4>\s*<\/div>\s*<\/div>/g,
  `<div style={{ borderBottom: "2px dashed #00FFFF", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
          <h4 style={{ margin: 0, color: "#FFFFFF", fontSize: "1.5rem", fontWeight: "800", fontStyle: "italic", textTransform: "uppercase" }}>[MAX ALLOWABLE OFFER (MAO) GENERATOR]</h4>
        </div>`
);

// 8. Tab Buttons (Wholesale / Fix & Flip / Novation)
const tabsRegex = /<div style=\{\{ display: 'flex', gap: '0\.5rem', marginBottom: '1\.5rem', background: 'rgba\(0,0,0,0\.05\)', padding: '4px', borderRadius: '8px' \}\}>\s*<button[\s\S]*?onClick=\{\(\) => setExitStrategy\('wholesale'\)\}[\s\S]*?>Wholesale<\/button>\s*<button[\s\S]*?onClick=\{\(\) => setExitStrategy\('flip'\)\}[\s\S]*?>Fix & Flip<\/button>\s*<button[\s\S]*?onClick=\{\(\) => setExitStrategy\('novation'\)\}[\s\S]*?>Novation<\/button>\s*<\/div>/;

const newTabs = `<div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'transparent' }}>
          {['wholesale', 'flip', 'novation'].map(strategy => {
            const isActive = exitStrategy === strategy;
            const labels = { wholesale: 'Wholesale', flip: 'Fix & Flip', novation: 'Novation' };
            return (
              <button 
                key={strategy}
                onClick={() => setExitStrategy(strategy)}
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  borderRadius: '0px', 
                  border: isActive ? '2px solid #000000' : '1px solid #555555', 
                  background: isActive ? '#FFFFFF' : '#000000', 
                  fontWeight: '800', 
                  textTransform: 'uppercase',
                  color: isActive ? '#000000' : '#555555', 
                  cursor: 'pointer', 
                  transition: 'background 0ms, color 0ms'
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = '#00FFFF'; e.currentTarget.style.color = '#000000'; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = '#000000'; e.currentTarget.style.color = '#555555'; } }}
              >
                {labels[strategy]}
              </button>
            )
          })}
        </div>`;

code = code.replace(tabsRegex, newTabs);

// 9. Select Inputs background
code = code.replace(
  /<select value=\{holdingDurationDays\}[\s\S]*?<\/select>/,
  `<select value={holdingDurationDays} onChange={(e) => setHoldingDurationDays(Number(e.target.value))} style={{ width: '100%', padding: '10px', background: '#111111', border: '1px solid #FFFFFF', color: '#FFFFFF', borderRadius: '0px', outline: 'none' }}>
              <option value={30}>30 Days</option>
              <option value={90}>90 Days</option>
              <option value={180}>180 Days</option>
              <option value={270}>270 Days</option>
            </select>`
);
code = code.replace(
  /<select value=\{capitalSource\}[\s\S]*?<\/select>/,
  `<select value={capitalSource} onChange={(e) => setCapitalSource(e.target.value)} style={{ width: '100%', padding: '10px', background: '#111111', border: '1px solid #FFFFFF', color: '#FFFFFF', borderRadius: '0px', outline: 'none' }}>
              <option value="Hard Money">Hard Money @ 12%</option>
              <option value="Institutional">Institutional @ 8%</option>
              <option value="Cash">Cash @ 0%</option>
            </select>`
);

// 10. MAO Output (Neon Green, larger font)
code = code.replace(
  /<span style=\{\{\s*fontSize: '2\.5rem',\s*fontWeight: '900',\s*color: isUnderwater \? '#ef4444' : '#10b981',\s*textShadow: isUnderwater \? '0 4px 12px rgba\(239, 68, 68, 0\.4\)' : '0 4px 12px rgba\(16, 185, 129, 0\.4\)'\s*\}\}>\s*\$\{mao\.toLocaleString\(\)\}\s*<\/span>/,
  `<span style={{ fontSize: '3.5rem', fontWeight: '900', color: '#00FF00' }}>\${mao.toLocaleString()}</span>`
);

// 11. Net to Seller Output (Neon Green, larger font)
code = code.replace(
  /<span style=\{\{\s*fontSize: '1\.5rem',\s*fontWeight: '800',\s*color: \(mao - totalDebt\) < 0 \? '#ef4444' : '#10b981'\s*\}\}>\s*\{\(mao - totalDebt\) < 0 \? '-' : ''\}\$\{Math\.abs\(mao - totalDebt\)\.toLocaleString\(\)\}\s*<\/span>/,
  `<span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#00FF00' }}>\${(mao - totalDebt) < 0 ? '-' : ''}\${Math.abs(mao - totalDebt).toLocaleString()}</span>`
);

// 12. Dividers inside MAO Engine
code = code.replace(
  /borderTop: '1px solid var\(--border-subtle\)'/g,
  `borderTop: '2px dashed #00FFFF'`
);

fs.writeFileSync(path, code);
console.log('RehabCalculator.jsx styling updated!');
