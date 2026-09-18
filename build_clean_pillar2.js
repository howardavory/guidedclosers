const fs = require('fs');
let p2 = fs.readFileSync('pillar2_original.jsx', 'utf8');

// The original Pillar 2 is one big block. We will inject <ConditionSection> correctly.

// 1. Wrap Property
p2 = p2.replace(
  '<div className="flex flex-col gap-6">\n            <div className="flex flex-col mb-2 animate-slideIn">',
  '<div className="flex flex-col gap-6">\n<ConditionSection id="property" title="Property Basics" isComplete={Boolean(formData?.propertyType)}>\n            <div className="flex flex-col mb-2 animate-slideIn">'
);

// 2. Wrap Roof
let iRoof = p2.indexOf('"Got it. Now, to make sure my repair estimates are accurate');
let targetRoof = p2.substring(0, iRoof);
let lastDivRoof = targetRoof.lastIndexOf('<div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: ((isTenant');
p2 = p2.substring(0, lastDivRoof) + '</ConditionSection>\n<ConditionSection id="roof" title="Roof System" isComplete={Boolean(formData?.roofAge || formData?.roofCondition)}>\n' + p2.substring(lastDivRoof);

// 3. Wrap HVAC
// In the original, before HVAC is Roof end.
// We know Roof ends and HVAC starts right around `"Okay, makes sense. And what about the HVAC system?`
let iHvac = p2.indexOf('"Okay, makes sense. And what about the HVAC system?');
let targetHvac = p2.substring(0, iHvac);
let lastDivHvac = targetHvac.lastIndexOf('<div className="mt-8 pt-6 border-t-2 border-gray-300 text-xl font-black italic text-[#F5F5F5] leading-relaxed mb-6">');
// Since HVAC is a callout in the original, we just wrap it.
p2 = p2.substring(0, lastDivHvac) + '</ConditionSection>\n<ConditionSection id="hvac" title="HVAC System" isComplete={Boolean(formData?.hvacAge || formData?.hvacStatus)}>\n' + p2.substring(lastDivHvac);
// Also convert the HVAC callout to standard classes
p2 = p2.replace(
  '<div className="mt-8 pt-6 border-t-2 border-gray-300 text-xl font-black italic text-[#F5F5F5] leading-relaxed mb-6">\n      "Okay, makes sense. And what about the HVAC system? Do you know about what year the AC was installed, and is it running perfectly as-is?"\n    </div>',
  '<div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">\n      "Okay, makes sense. And what about the HVAC system? Do you know about what year the AC was installed, and is it running perfectly as-is?"\n    </div>'
);

// 4. Wrap Plumbing
let iPlumb = p2.indexOf('"Okay, and for the plumbing, is that original or have you ever had to repipe the house?"');
let targetPlumb = p2.substring(0, iPlumb);
let lastDivPlumb = targetPlumb.lastIndexOf('<div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: \'2rem\' }}>');
p2 = p2.substring(0, lastDivPlumb) + '</ConditionSection>\n<ConditionSection id="plumbing" title="Plumbing & Water Heater" isComplete={Boolean(formData?.plumbingAge || formData?.plumbingCondition || formData?.waterHeater)}>\n' + p2.substring(lastDivPlumb);


// 5. Wrap Electrical
let iElec = p2.indexOf('"Got it. And what about the electrical system? Is that still original or have you ever had to update the panel or the wiring throughout the house?"');
let targetElec = p2.substring(0, iElec);
let lastDivElec = targetElec.lastIndexOf('<div className="border-t-2 border-gray-300 pt-6 mt-6">');
p2 = p2.substring(0, lastDivElec) + '</ConditionSection>\n<ConditionSection id="electrical" title="Electrical & Utilities" isComplete={Boolean(formData?.electricalAge || formData?.electricalCondition || formData?.sewer || formData?.solar)}>\n' + p2.substring(lastDivElec);
// Standardize Electrical callout
p2 = p2.replace(
  '<div className="border-t-2 border-gray-300 pt-6 mt-6">\n                    <div className="text-[#F5F5F5] font-black italic text-lg mb-8">\n                      "Got it. And what about the electrical system? Is that still original or have you ever had to update the panel or the wiring throughout the house?"\n                    </div>\n                  </div>',
  '<div className="flex flex-col mb-2 animate-slideIn">\n<div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">\n                      "Got it. And what about the electrical system? Is that still original or have you ever had to update the panel or the wiring throughout the house?"\n                    </div>\n</div>'
);

// 6. Wrap Interior
let iInt = p2.indexOf('{formData.propertyType === \'Multi-Family\' ?');
let targetInt = p2.substring(0, iInt);
let lastDivInt = targetInt.lastIndexOf('<div className="flex flex-col mb-2 animate-slideIn">');
p2 = p2.substring(0, lastDivInt) + '</ConditionSection>\n<ConditionSection id="interior" title="Interior Condition" isComplete={Boolean(formData?.kitchenCondition || formData?.bath1Condition)}>\n' + p2.substring(lastDivInt);
// Standardize Interior callout
p2 = p2.replace(
  ': "So it sounds like the bones of the house are pretty solid... as far as the inside goes, if I walked through the front door today, are the kitchens and bathrooms fairly modern, or a bit more dated?"\n                  }\n      </div>\n  \n  {formData.propertyType !== \'Multi-Family\' && (',
  ': "So it sounds like the bones of the house are pretty solid... as far as the inside goes, if I walked through the front door today, are the kitchens and bathrooms fairly modern, or a bit more dated?"\n                  }\n      </div></div>\n  \n  {formData.propertyType !== \'Multi-Family\' && ('
);


// 7. Wrap Exterior
// Exterior is currently inside {formData.propertyType !== 'Multi-Family' && (
// It starts at `<div className="mt-6 border-t border-[#333333] pt-6">`
// Let's replace the start of Exterior with </ConditionSection> and open a new one.
// We must also close the propertyType conditional block BEFORE </ConditionSection>!
let extStartStr = `          <div className="mt-6 border-t border-[#333333] pt-6">\n            <div className="text-[#F5F5F5] font-black italic text-lg mb-4">\n              "And what about the outside of the house? Does the stucco and paint look pretty good, and are the windows the original single-pane or have they been updated?"\n            </div>`;
let extNewStr = `      </div>\n    )}\n</ConditionSection>\n{formData.propertyType !== 'Multi-Family' && (\n<ConditionSection id="exterior" title="Exterior & Amenities" isComplete={Boolean(formData?.exteriorCondition || formData?.windows || formData?.pool || formData?.hoa)}>\n<div className="flex flex-col mb-2 animate-slideIn">\n<div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">\n              "And what about the outside of the house? Does the stucco and paint look pretty good, and are the windows the original single-pane or have they been updated?"\n            </div></div>`;
p2 = p2.replace(extStartStr, extNewStr);

// 8. Wrap Red Flags
// Wait, we need to CLOSE the propertyType block for Exterior before we open the one for Red Flags!
// Where does Exterior end? Right before Dynamic Reaction 3!
// We know that in the original code, `)}` at line 2376 closed something...
// Wait, no. We just added `</div>\n)}` before Exterior! This means the original `)}` and `</div>` at the end of Pillar 2 are now EXTRA!
// We will just strip them out at the end.
// Let's find Red Flags.
let rfStartStr = `<div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>\n  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">\n    <div className="text-[#F5F5F5] text-[#E2E8F0] font-medium text-lg leading-relaxed font-medium mb-4">\n    "Okay, that gives me a great picture of the inside. Last thing before we talk numbers—just to check my standard boxes, have you guys noticed any settling with the foundation, or are there any unpermitted add-ons we'd need to factor in?"\n    </div>`;
let rfNewStr = `</ConditionSection>\n)}\n{formData.propertyType !== 'Multi-Family' && (\n<ConditionSection id="redflags" title="Red Flags & Structure" isComplete={Boolean(formData?.structuralRedFlags?.length > 0)}>\n<div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>\n  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">\n    <div className="text-[#F5F5F5] text-[#E2E8F0] font-medium text-lg leading-relaxed font-medium mb-4">\n    "Okay, that gives me a great picture of the inside. Last thing before we talk numbers—just to check my standard boxes, have you guys noticed any settling with the foundation, or are there any unpermitted add-ons we'd need to factor in?"\n    </div></div>`;
p2 = p2.replace(rfStartStr, rfNewStr);

// 9. Fix End of Pillar 2
// In the original, we had a bunch of divs and `)}` closing the `propertyType` block that we ALREADY CLOSED manually!
let endPillar2Original = `            </div>\n          )}\n        </div>\n      </div>\n\n                  </div>\n                </div>\n              )}\n  \n              {currentStep === 2 && (`;
let endPillar2Clean = `            </div>\n          )}\n        </div>\n      </div>\n\n                  </div>\n                </div>\n</ConditionSection>\n)}\n  \n              {currentStep === 2 && (`;
p2 = p2.replace(endPillar2Original, endPillar2Clean);

// Remove extra `)}` and `</div>` that we orphaned before Dynamic Reaction 3
// In the original, there was:
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//   </div>
// </div>
//   
//               {/* Toggles moved to sidebar */}
//   
//               {/* Dynamic Reaction 3 */}
// We want to remove `      )}\n  </div>\n</div>` because we already closed them manually above!
let extraDivsBeforeReact3 = `                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      )}\n  </div>\n</div>\n  \n              {/* Toggles moved to sidebar */}\n  \n              {/* Dynamic Reaction 3 */}`;
let cleanDivsBeforeReact3 = `                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n  \n              {/* Toggles moved to sidebar */}\n  \n              {/* Dynamic Reaction 3 */}`;
p2 = p2.replace(extraDivsBeforeReact3, cleanDivsBeforeReact3);


fs.writeFileSync('pillar2_new.jsx', p2);
console.log('Built pillar2_new.jsx');
