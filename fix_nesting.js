const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

// 1. Property Basics
let pbStart = '{renderPillar(2, "Property Details & Occupancy", <Home size={20} />, (\n          <div className="flex flex-col gap-6">';
if (code.includes(pbStart)) {
  code = code.replace(pbStart, pbStart + '\n            <ConditionSection id="property" title="Property Basics" isComplete={Boolean(formData?.propertyType)}>');
  console.log('Wrapped Property Basics');
}

// 2. Roof
let roofRegex = /(<div className="flex flex-col mb-2 animate-slideIn"[^>]*>)\s*(<div className="bg-\[#000000\]\/40 border-l-2 border-\[#E5C158\][^>]*>)\s*(<div className="text-\[#F5F5F5\][^>]*>)\s*("Got it\. Now, to make sure my repair estimates are accurate, let's start with the roof—roughly how many years old is it, and is it holding up alright or needing some major patchwork\?")\s*(<\/div>)/;
let match = code.match(roofRegex);
if (match) {
  // We close the agent script div RIGHT AFTER the text!
  let replacement = `</ConditionSection>\n            <ConditionSection id="roof" title="Roof System" isComplete={Boolean(formData?.roofAge || formData?.roofCondition)}>\n            ${match[1]}\n${match[2]}\n${match[3]}\n${match[4]}\n${match[5]}\n  </div>`;
  code = code.replace(match[0], replacement);
  console.log('Fixed & Wrapped Roof');
}

// 3. HVAC
let hvacRegex = /<div className="mt-8 pt-6 border-t-2 border-gray-300 text-xl font-black italic text-\[#F5F5F5\] leading-relaxed mb-6">\s*"Okay, makes sense\. And what about the HVAC system\? Do you know about what year the AC was installed, and is it running perfectly as-is\?"\s*<\/div>/;
let hvacMatch = code.match(hvacRegex);
if (hvacMatch) {
  // We also make sure to wrap the HVAC script in the PROPER agent callout classes!
  let hvacReplacement = `</ConditionSection>\n            <ConditionSection id="hvac" title="HVAC System" isComplete={Boolean(formData?.hvacAge || formData?.hvacStatus)}>\n            <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">\n      "Okay, makes sense. And what about the HVAC system? Do you know about what year the AC was installed, and is it running perfectly as-is?"\n    </div>`;
  code = code.replace(hvacMatch[0], hvacReplacement);
  console.log('Fixed & Wrapped HVAC');
}

// 4. Remove the extra closing divs from the end of HVAC
// The original code had:
//   </div>
// </div>
//             {/* Toggles moved to sidebar */}
let hvacEndRegex = /(<\/div>\s*<\/div>\s*\{\/\* Toggles moved to sidebar \*\/})/;
if (code.match(hvacEndRegex)) {
  code = code.replace(hvacEndRegex, '{/* Toggles moved to sidebar */}');
  console.log('Removed extra closing divs after HVAC');
}

// 5. Plumbing
let plumbRegex = /(<div className="flex flex-col mb-2 animate-slideIn"[^>]*>)\s*(<div className="bg-\[#000000\]\/40 border-l-2 border-\[#E5C158\][^>]*>)\s*(<div className="text-\[#F5F5F5\][^>]*>)\s*("Okay, and for the plumbing, is that original or have you ever had to repipe the house\?")\s*(<\/div>)/;
let plumbMatch = code.match(plumbRegex);
if (plumbMatch) {
  let plumbReplacement = `</ConditionSection>\n            <ConditionSection id="plumbing" title="Plumbing & Water Heater" isComplete={Boolean(formData?.plumbingAge || formData?.plumbingCondition || formData?.waterHeater)}>\n            ${plumbMatch[1]}\n${plumbMatch[2]}\n${plumbMatch[3]}\n${plumbMatch[4]}\n${plumbMatch[5]}\n  </div>`;
  code = code.replace(plumbMatch[0], plumbReplacement);
  console.log('Fixed & Wrapped Plumbing');
}

// 6. Electrical
let elecRegex = /<div className="border-t-2 border-gray-300 pt-6 mt-6">\s*<div className="text-\[#F5F5F5\] font-black italic text-lg mb-8">\s*"Got it\. And what about the electrical system\? Is that still original or have you ever had to update the panel or the wiring throughout the house\?"\s*<\/div>\s*<\/div>/;
let elecMatch = code.match(elecRegex);
if (elecMatch) {
  let elecReplacement = `</ConditionSection>\n            <ConditionSection id="electrical" title="Electrical & Utilities" isComplete={Boolean(formData?.electricalAge || formData?.electricalCondition || formData?.sewer || formData?.solar)}>\n            <div className="flex flex-col mb-2 animate-slideIn">\n  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">\n      "Got it. And what about the electrical system? Is that still original or have you ever had to update the panel or the wiring throughout the house?"\n  </div>\n</div>`;
  code = code.replace(elecMatch[0], elecReplacement);
  console.log('Fixed & Wrapped Electrical');
}

// Remove extra closing divs after Electrical (which belonged to plumbing originally)
let elecEndRegex = /(<\/div>\s*<\/div>\s*<\/div>\s*<\/ConditionSection>)/; // wait, the original didn't have ConditionSection.
// Let's just find the end of the electrical section. It's right before Interior.
// Actually, let's just use string replace for Interior Start!

// 7. Interior
let intRegex = /(<div className="flex flex-col mb-2 animate-slideIn">)\s*(<div className="bg-\[#000000\]\/40 border-l-2 border-\[#E5C158\][^>]*>)\s*(<div className="text-\[#F5F5F5\][^>]*>)\s*(\{formData\.propertyType === 'Multi-Family' \?)/;
let intMatch = code.match(intRegex);
if (intMatch) {
  // We need to close the electrical section, but we must also CLOSE THE PLUMBING DIVS THAT WERE LEFT OPEN!
  // Wait, I closed the Plumbing callout div in step 5 (`\n  </div>`). The only thing open from Plumbing is the `div.flex-col`.
  // AND Electrical opens a new `div.flex-col` in step 6 and closes it! So Electrical is fully closed.
  // Wait, Plumbing `div.flex-col` is still open!
  // Let's close it before Interior.
  let intReplacement = `</div>\n</ConditionSection>\n            <ConditionSection id="interior" title="Interior Condition" isComplete={Boolean(formData?.kitchenCondition || formData?.bath1Condition)}>\n            ${intMatch[1]}\n${intMatch[2]}\n${intMatch[3]}\n${intMatch[4]}`;
  code = code.replace(intMatch[0], intReplacement);
  console.log('Wrapped Interior');
}

// Fix Interior's callout nesting! The original Interior had the callout wrapping the inputs too.
let intEndCalloutRegex = /(: "So it sounds like the bones of the house are pretty solid\.\.\. as far as the inside goes, if I walked through the front door today, are the kitchens and bathrooms fairly modern, or a bit more dated\?"\s*\})/;
let intEndCalloutMatch = code.match(intEndCalloutRegex);
if (intEndCalloutMatch) {
  let intEndCalloutReplacement = intEndCalloutMatch[1] + '\n      </div>\n  </div>';
  code = code.replace(intEndCalloutMatch[0], intEndCalloutReplacement);
  console.log('Closed Interior Callout');
}

// 8. Exterior
let extRegex = /<div className="mt-6 border-t border-\[#333333\] pt-6">\s*<div className="text-\[#F5F5F5\] font-black italic text-lg mb-4">\s*"And what about the outside of the house\? Does the stucco and paint look pretty good, and are the windows the original single-pane or have they been updated\?"\s*<\/div>/;
let extMatch = code.match(extRegex);
if (extMatch) {
  // Close the Interior flex-col div, then open Exterior
  let extReplacement = `</div>\n</ConditionSection>\n            <ConditionSection id="exterior" title="Exterior & Amenities" isComplete={Boolean(formData?.exteriorCondition || formData?.windows || formData?.pool || formData?.hoa)}>\n            <div className="flex flex-col mb-2 animate-slideIn">\n  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">\n      "And what about the outside of the house? Does the stucco and paint look pretty good, and are the windows the original single-pane or have they been updated?"\n  </div>`;
  code = code.replace(extMatch[0], extReplacement);
  console.log('Wrapped Exterior');
}

// 9. Red Flags
let rfRegex = /(<div className="flex flex-col mb-2 animate-slideIn"[^>]*>)\s*(<div className="bg-\[#000000\]\/40 border-l-2 border-\[#E5C158\][^>]*>)\s*(<div className="text-\[#F5F5F5\][^>]*>)\s*("Okay, that gives me a great picture of the inside\. Last thing before we talk numbers—just to check my standard boxes, have you guys noticed any settling with the foundation, or are there any unpermitted add-ons we'd need to factor in\?")\s*(<\/div>)/;
let rfMatch = code.match(rfRegex);
if (rfMatch) {
  // Close the Exterior flex-col div, then open Red Flags
  let rfReplacement = `</div>\n</ConditionSection>\n            <ConditionSection id="redflags" title="Red Flags & Structure" isComplete={Boolean(formData?.structuralRedFlags?.length > 0)}>\n            ${rfMatch[1]}\n${rfMatch[2]}\n${rfMatch[3]}\n${rfMatch[4]}\n${rfMatch[5]}\n  </div>`;
  code = code.replace(rfMatch[0], rfReplacement);
  console.log('Wrapped Red Flags');
}

// 10. End of Pillar 2
let p2EndRegex = /\{\/\* PILLAR 3: TIMELINE & RELOCATION \*\/\}/;
let p2EndMatch = code.match(p2EndRegex);
if (p2EndMatch) {
  // We need to close Red Flags and the flex-col of Red Flags.
  // Wait, let's just close ConditionSection before the end of the Pillar 2 mapping.
  // Let's replace the last `</div>` before Pillar 3 with `</div></ConditionSection>`
  let lastDivBeforePillar3Regex = /(<\/div>\s*\)\)\}\s*\{\/\* PILLAR 3: TIMELINE & RELOCATION \*\/})/;
  code = code.replace(lastDivBeforePillar3Regex, `</ConditionSection>\n          $1`);
  console.log('Wrapped End of Pillar 2');
}

fs.writeFileSync('src/components/script/CallScript.jsx', code);
