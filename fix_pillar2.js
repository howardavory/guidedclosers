const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

// 1. Fix Property Basics
code = code.replace(
  '{renderPillar(2, "Property Details & Occupancy", <Home size={20} />, (\n          <div className="flex flex-col gap-6">',
  '{renderPillar(2, "Property Details & Occupancy", <Home size={20} />, (\n          <div className="flex flex-col gap-6">\n            <ConditionSection id="property" title="Property Basics" isComplete={Boolean(formData?.propertyType)}>'
);

// 2. Fix Roof
let iRoof = code.indexOf('"Got it. Now, to make sure my repair estimates are accurate');
if (iRoof > -1) {
  let target = code.substring(iRoof - 800, iRoof + 300);
  let divIndex = target.lastIndexOf('<div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: ((isTenant');
  let exactString = target.substring(divIndex, target.indexOf('</div>', target.indexOf('"Got it.')) + 6);
  code = code.replace(
    exactString, 
    '</ConditionSection>\n            <ConditionSection id="roof" title="Roof System" isComplete={Boolean(formData?.roofAge || formData?.roofCondition)}>\n            ' + exactString + '\n  </div>'
  );
}

// 3. Fix HVAC
// Original: </div>\n    )}\n\n    <div className="mt-8 pt-6 border-t-2 border-gray-300 text-xl font-black italic text-[#F5F5F5] leading-relaxed mb-6">\n      "Okay, makes sense. And what about the HVAC system?
let hvacRegex = /<\/div>\s*\)\}\s*<div className="mt-8 pt-6 border-t-2 border-gray-300 text-xl font-black italic text-\[#F5F5F5\] leading-relaxed mb-6">\s*"Okay, makes sense\. And what about the HVAC system\? Do you know about what year the AC was installed, and is it running perfectly as-is\?"\s*<\/div>/;
let hvacMatch = code.match(hvacRegex);
if (hvacMatch) {
  let hvacReplacement = `</div>\n    )}\n  </div>\n</div>\n</ConditionSection>\n            <ConditionSection id="hvac" title="HVAC System" isComplete={Boolean(formData?.hvacAge || formData?.hvacStatus)}>\n            <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">\n      "Okay, makes sense. And what about the HVAC system? Do you know about what year the AC was installed, and is it running perfectly as-is?"\n    </div>`;
  code = code.replace(hvacMatch[0], hvacReplacement);
}

// Remove extra closing divs after HVAC
let hvacEndRegex = /(<\/div>\s*<\/div>\s*\{\/\* Toggles moved to sidebar \*\/})/;
if (code.match(hvacEndRegex)) {
  code = code.replace(hvacEndRegex, '{/* Toggles moved to sidebar */}');
}

// 4. Fix Plumbing
let plumbRegex = /(<div className="flex flex-col mb-2 animate-slideIn"[^>]*>)\s*(<div className="bg-\[#000000\]\/40 border-l-2 border-\[#E5C158\][^>]*>)\s*(<div className="text-\[#F5F5F5\][^>]*>)\s*("Okay, and for the plumbing, is that original or have you ever had to repipe the house\?")\s*(<\/div>)/;
let plumbMatch = code.match(plumbRegex);
if (plumbMatch) {
  let plumbReplacement = `</ConditionSection>\n            <ConditionSection id="plumbing" title="Plumbing & Water Heater" isComplete={Boolean(formData?.plumbingAge || formData?.plumbingCondition || formData?.waterHeater)}>\n            ${plumbMatch[1]}\n${plumbMatch[2]}\n${plumbMatch[3]}\n${plumbMatch[4]}\n${plumbMatch[5]}\n  </div>`;
  code = code.replace(plumbMatch[0], plumbReplacement);
}

// 5. Fix Electrical
let elecRegex = /<div className="border-t-2 border-gray-300 pt-6 mt-6">\s*<div className="text-\[#F5F5F5\] font-black italic text-lg mb-8">\s*"Got it\. And what about the electrical system\? Is that still original or have you ever had to update the panel or the wiring throughout the house\?"\s*<\/div>\s*<\/div>/;
let elecMatch = code.match(elecRegex);
if (elecMatch) {
  // We need to close Plumbing's flex-col div BEFORE opening Electrical ConditionSection
  let elecReplacement = `</div>\n</ConditionSection>\n            <ConditionSection id="electrical" title="Electrical & Utilities" isComplete={Boolean(formData?.electricalAge || formData?.electricalCondition || formData?.sewer || formData?.solar)}>\n            <div className="flex flex-col mb-2 animate-slideIn">\n  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">\n      "Got it. And what about the electrical system? Is that still original or have you ever had to update the panel or the wiring throughout the house?"\n  </div>\n</div>`;
  code = code.replace(elecMatch[0], elecReplacement);
}

// Remove extra closing divs after Electrical (which belonged to plumbing originally)
let elecEndRegex = /      <\/div>\s*\}\)\}\s*<\/div>\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>/;
let elecEndMatch = code.match(elecEndRegex);
if (elecEndMatch) {
  let elecEndReplacement = `      </div>\n    )}\n  </div>\n</div>`;
  // wait, the original was:
  //       </div>
  //     )}
  //   </div>
  // </div>
  // Let's just do string replacement for the exact end.
}
let exactElecEnd = `        <div className="flex flex-wrap gap-3 mb-4">
          {[{label: 'Updated System ($0/sqft)', mult: 0}, {label: 'Panel Upgrade Needed ($3k)', mult: 0}, {label: 'Needs Full Rewire ($5/SQFT + Panel)', mult: 0}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfElectrical === opt.label) { updateForm('sfElectrical', ''); updateForm('electricalMult', 0); } else { updateForm('sfElectrical', opt.label); updateForm('electricalMult', opt.mult); } }} className={clsx("", formData.sfElectrical === opt.label ? "flex-1 min-w-[120px] bg-[#1A1A1A] text-[#E5C158] border border-[#E5C158]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[#0F0F0F] text-[#777777] border border-[#222222] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[#444444] hover:text-[#A0A0A0] hover:bg-[#151515] transition-all cursor-pointer text-center")}>{opt.label}</button>
          ))}
        </div>
      </div>
    )}
  </div>
</div>`;
let newElecEnd = exactElecEnd.replace('  </div>\n</div>', '');
code = code.replace(exactElecEnd, newElecEnd);


// 6. Fix Interior
let intRegex = /(<div className="flex flex-col mb-2 animate-slideIn">)\s*(<div className="bg-\[#000000\]\/40 border-l-2 border-\[#E5C158\][^>]*>)\s*(<div className="text-\[#F5F5F5\][^>]*>)\s*(\{formData\.propertyType === 'Multi-Family' \?)/;
let intMatch = code.match(intRegex);
if (intMatch) {
  let intReplacement = `</ConditionSection>\n            <ConditionSection id="interior" title="Interior Condition" isComplete={Boolean(formData?.kitchenCondition || formData?.bath1Condition)}>\n            ${intMatch[1]}\n${intMatch[2]}\n${intMatch[3]}\n${intMatch[4]}`;
  code = code.replace(intMatch[0], intReplacement);
}

// Close Interior Callout properly
let intEndCalloutRegex = /(: "So it sounds like the bones of the house are pretty solid\.\.\. as far as the inside goes, if I walked through the front door today, are the kitchens and bathrooms fairly modern, or a bit more dated\?"\s*\})/;
let intEndCalloutMatch = code.match(intEndCalloutRegex);
if (intEndCalloutMatch) {
  let intEndCalloutReplacement = intEndCalloutMatch[1] + '\n      </div>\n  </div>';
  code = code.replace(intEndCalloutMatch[0], intEndCalloutReplacement);
}

// Fix the unclosed Interior conditional block BEFORE Exterior!
let intBathsEnd = `            ));
          })()}

          <div className="mt-6 border-t border-[#333333] pt-6">`;
let newIntBathsEnd = `            ));
          })()}
      </div>
    )}
</ConditionSection>
{formData.propertyType !== 'Multi-Family' && (
            <ConditionSection id="exterior" title="Exterior & Amenities" isComplete={Boolean(formData?.exteriorCondition || formData?.windows || formData?.pool || formData?.hoa)}>
          <div className="mt-6 border-t border-[#333333] pt-6">`;
code = code.replace(intBathsEnd, newIntBathsEnd);


// 7. Fix Exterior Callout (wrap the text in the callout classes instead of border-t)
let extText = `"And what about the outside of the house? Does the stucco and paint look pretty good, and are the windows the original single-pane or have they been updated?"`;
let extDivStart = `<div className="mt-6 border-t border-[#333333] pt-6">\n            <div className="text-[#F5F5F5] font-black italic text-lg mb-4">\n              "And what about the outside of the house? Does the stucco and paint look pretty good, and are the windows the original single-pane or have they been updated?"\n            </div>`;
let extDivNew = `<div className="flex flex-col mb-2 animate-slideIn">\n  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">\n      "And what about the outside of the house? Does the stucco and paint look pretty good, and are the windows the original single-pane or have they been updated?"\n  </div>\n</div>`;
code = code.replace(extDivStart, extDivNew);

// 8. Fix Red Flags
let iRF = code.indexOf('"Okay, that gives me a great picture of the inside. Last thing before we talk numbers');
if (iRF > -1) {
  let target = code.substring(iRF - 400, iRF + 300);
  let divIndex = target.lastIndexOf('<div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: \'2rem\' }}>');
  let exactString = target.substring(divIndex, target.indexOf('</div>', target.indexOf('"Okay, that')) + 6);
  let replacement = `</ConditionSection>\n)}
{formData.propertyType !== 'Multi-Family' && (
            <ConditionSection id="redflags" title="Red Flags & Structure" isComplete={Boolean(formData?.structuralRedFlags?.length > 0)}>\n            ` + exactString + `\n  </div>`;
  code = code.replace(exactString, replacement);
}

// 9. Fix End of Pillar 2 (Close Red Flags)
// At the end of the original file, we have:
//             </div>
//           )}
//         </div>
//       </div>
//
//                   </div>
//                 </div>
//               )}
//  
//               {currentStep === 2 && (
let endPillar2 = `            </div>
          )}
        </div>
      </div>

                  </div>
                </div>
              )}
  
              {currentStep === 2 && (`;
let newEndPillar2 = `            </div>
          )}
        </div>
      </div>

                  </div>
                </div>
              )}
</ConditionSection>
)}
  
              {currentStep === 2 && (`;
// Wait, is this correct? The original had 3 `</div>` closing Interior, Exterior, RedFlags wrappers!
// Since we isolated them, we actually REDUCED the nesting by 2 divs (Interior's propertyType condition and its flex-col).
// But let's just let the JSX compiler tell us what's wrong.
code = code.replace(endPillar2, newEndPillar2);


fs.writeFileSync('src/components/script/CallScript.jsx', code);
console.log('Done');
