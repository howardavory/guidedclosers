const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

const sPillar2Start = '<ConditionSection id="property" title="Property Basics" isComplete={Boolean(formData?.propertyType)}>';
const sSFStart = "{formData.propertyType && formData.propertyType !== 'Multi-Family' && formData.propertyType !== 'Land' && (";
const sDMStart = '{/* 1. DECISION MAKERS */}';
const sSpecsStart = '{/* 2. PROPERTY SPECS */}';
const sOccStart = '{/* 3. OCCUPANCY */}';
const sLandStart = "{formData.propertyType === 'Land' && (";
const sRoofStart = '<ConditionSection id="roof"';

// Extract the raw text blocks
// 1. Property Type Block
let pTypeBlock = code.substring(
  code.indexOf('<div className="flex flex-col mb-2 animate-slideIn">', code.indexOf(sPillar2Start)),
  code.indexOf(sSFStart)
);

// 2. Decision Makers Block (from sDMStart up to sSpecsStart)
let dmBlock = code.substring(
  code.indexOf(sDMStart),
  code.indexOf(sSpecsStart)
);

// 3. SF Specs Block (from sSpecsStart up to sOccStart)
let sfSpecsBlock = code.substring(
  code.indexOf(sSpecsStart),
  code.indexOf(sOccStart)
);

// 4. Occupancy Block (from sOccStart up to the second `</>\n            )}` that closes the SF block)
// The end of the SF block is immediately before sLandStart.
let afterOcc = code.substring(code.indexOf(sOccStart), code.indexOf(sLandStart));
// The last 20 characters or so of afterOcc are `              </>\n            )}\n            `
// We want just the Occupancy part.
// The occupancy part ends at the FIRST `</>\n            )}`
let endOfOcc = afterOcc.indexOf('</>\n            )}');
let occBlock = afterOcc.substring(0, endOfOcc + 20); // up to the end of the first `)}`

// 5. Land and MF Blocks (from sLandStart up to sRoofStart)
let landMfBlock = code.substring(
  code.indexOf(sLandStart),
  code.indexOf('</ConditionSection>', code.indexOf(sLandStart)) // The property section closes right before sRoofStart
);

// Now construct the new code block
const newBlock = `
{/* 1. PROPERTY SPECS */}
<ConditionSection 
  id="specs" 
  title="Property Specs" 
  isComplete={Boolean(formData?.propertyType || formData?.beds || formData?.baths || formData?.sqft || formData?.lotSize)}
>
${pTypeBlock}
  {formData.propertyType && formData.propertyType !== 'Multi-Family' && formData.propertyType !== 'Land' && (
    <>
${sfSpecsBlock}    </>
  )}
${landMfBlock}</ConditionSection>

{/* 2. OWNERSHIP PROFILE */}
<ConditionSection 
  id="ownership" 
  title="Ownership Profile" 
  isComplete={Boolean(formData?.decisionMakers || formData?.dmCount)}
>
  {formData.propertyType && formData.propertyType !== 'Multi-Family' && formData.propertyType !== 'Land' && (
    <>
${dmBlock}    </>
  )}
</ConditionSection>

{/* 3. OCCUPANCY STATUS */}
<ConditionSection 
  id="occupancy" 
  title="Occupancy Status" 
  isComplete={Boolean(formData?.occupancyStatus || formData?.occupancy)}
>
  {formData.propertyType && formData.propertyType !== 'Multi-Family' && formData.propertyType !== 'Land' && (
    <>
${occBlock}    </>
  )}
</ConditionSection>
`;

// Replace in the original code
const oldBlockStart = code.indexOf(sPillar2Start);
const oldBlockEnd = code.indexOf(sRoofStart);
const oldBlock = code.substring(oldBlockStart, oldBlockEnd);

code = code.replace(oldBlock, newBlock);

fs.writeFileSync('src/components/script/CallScript.jsx', code);
console.log("Transformation complete.");
