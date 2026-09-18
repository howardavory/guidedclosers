const fs = require('fs');

// 1. CallScript.jsx Theme Purge & Drawer Frame
let callScript = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

// Hunt down legacy "comic" sharp corners: border-2 -> rounded-xl border
// We only want to replace border-2 with rounded-xl border in the Red Flags & Structure section (lines ~2840 to 3080).
// Since the instruction says "In the Red Flags & Structure section, find all instances of rounded-sm, rounded-none, or border-2 on the red flag and condition toggles. Replace them with the Anodized standard: rounded-xl."
// Actually, earlier we checked and they only had "border-2". I'll replace border-2 with "rounded-xl border".
// Let's replace across the whole Red Flags section by splitting and looping.
let lines = callScript.split('\n');
let insideRedFlags = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('title="Red Flags & Structure"')) {
    insideRedFlags = true;
  }
  if (insideRedFlags && lines[i].includes('</ConditionSection>')) {
    insideRedFlags = false;
  }

  if (insideRedFlags) {
    if (lines[i].includes('border-2')) {
      lines[i] = lines[i].replace(/border-2/g, 'rounded-xl border');
    }
    if (lines[i].includes('rounded-sm')) {
      lines[i] = lines[i].replace(/rounded-sm/g, 'rounded-xl');
    }
    if (lines[i].includes('rounded-none')) {
      lines[i] = lines[i].replace(/rounded-none/g, 'rounded-xl');
    }
  }

  // Also Action 3: Tear Sheet drawer wrapper in CallScript.jsx
  if (lines[i].includes("activeGlobalDrawer === 'tearsheet'") && lines[i+1].includes("className=\"max-w-6xl")) {
    lines[i+1] = '      <div className="max-w-6xl mx-auto w-full h-full overflow-y-auto p-6 custom-scrollbar pb-12">';
  }
}

fs.writeFileSync('src/components/script/CallScript.jsx', lines.join('\n'));
console.log('CallScript.jsx updated.');

// 2. TearSheet.jsx Horizontal Refactor
let tearSheet = fs.readFileSync('src/components/documents/TearSheet.jsx', 'utf8');

// Action 2: Refactor the Tear Sheet wrapper to use a horizontal grid
// grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start
// The current wrapper is: <div className="bg-[#050505]/60 border border-[#222222] shadow-sm rounded-xl p-5 mb-6 shrink-0 relative transition-all duration-300">
// containing <div className="flex flex-col gap-4">

// I will just use regex to replace that wrapper and restructure the inner divs into columns.
tearSheet = tearSheet.replace(
  '<div className="bg-[#050505]/60 border border-[#222222] shadow-sm rounded-xl p-5 mb-6 shrink-0 relative transition-all duration-300">\n          <div className="flex flex-col gap-4">',
  '<div className="bg-[#050505]/60 border border-[#222222] shadow-sm rounded-xl p-5 mb-6 shrink-0 relative transition-all duration-300">\n          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">'
);

// We need to group them.
// Currently it's:
// <div className="mb-6"> <h3>FAST FACTS</h3> ... </div>
// <div className="mt-2"> <h2>DEAL FUNDAMENTALS</h2> ... </div>
// <div className="mb-6"> <h3>INFRASTRUCTURE & UTILITIES</h3> ... </div>
// <div className="mt-2 ..."> <p>Risk & Value Indicators</p> ... </div>
// <div className="mt-6"> <h2>KNOWN CONDITIONS</h2> ... </div>
// <div> <p>Deal Viability Score</p> ... </div>

// We need:
// Col 1: Fast Facts (and maybe Viability Score?)
// Col 2: Deal Fundamentals & Utilities
// Col 3/4: Known Conditions & Red Flags

// Let's rewrite the TearSheet rendering part manually for precision.
