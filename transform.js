const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

const sPillar2Start = '<ConditionSection id="property" title="Property Basics" isComplete={Boolean(formData?.propertyType)}>';
const sDMStart = '{/* 1. DECISION MAKERS */}';
const sSpecsStart = '{/* 2. PROPERTY SPECS */}';
const sOccStart = '{/* 3. OCCUPANCY */}';
const sLandStart = "{formData.propertyType === 'Land' && (";
const sRoofStart = '<ConditionSection id="roof"';

// Extract the raw text blocks
let pTypeBlock = code.substring(code.indexOf('<div className="flex flex-col mb-2 animate-slideIn">', code.indexOf(sPillar2Start)), code.indexOf(sDMStart));

let dmBlock = code.substring(code.indexOf(sDMStart), code.indexOf(sSpecsStart));
let specsBlock = code.substring(code.indexOf(sSpecsStart), code.indexOf(sOccStart));
let occBlock = code.substring(code.indexOf(sOccStart), code.indexOf('</>', code.indexOf(sOccStart))); // occ ends at `</>` before `)}`
occBlock += '\n                  </>\n';

// wait, the `</>` for the single family block is AT THE VERY END of Occupancy.
// let's verify exact text
let textBeforeRoof = code.substring(code.indexOf(sOccStart), code.indexOf(sRoofStart));

// We need to carefully split single family occupancy from Land and Multi-Family.
// The single family block ends with:
//               </>
//             )}
//             {formData.propertyType === 'Land' && (
let sfEndIndex = code.indexOf(sLandStart) - 30; // some padding
let sfBlockContent = code.substring(code.indexOf(sDMStart), code.indexOf(sLandStart));

// Wait, doing this via indexOf is fragile.
// Let's dump the parts first to be absolutely sure!

console.log("Found chunks:");
console.log("DM starts at: " + code.indexOf(sDMStart));
console.log("Specs starts at: " + code.indexOf(sSpecsStart));
console.log("Occ starts at: " + code.indexOf(sOccStart));
console.log("Land starts at: " + code.indexOf(sLandStart));

