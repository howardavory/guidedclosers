const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

const reps = [];

// 1. Start of Property Basics
const p2Start = '{renderPillar(2, "Property Details & Occupancy", <Home size={20} />, (\n          <div className="flex flex-col gap-6">';
if (code.includes(p2Start)) {
  code = code.replace(p2Start, p2Start + '\n            <ConditionSection id="property" title="Property Basics" isComplete={Boolean(formData?.propertyType)}>');
  console.log("Replaced Property Basics Start");
} else {
  console.log("Failed to find Property Basics Start");
}

// 2. End of Property / Start of Roof
const roofStart = `<div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: ((isTenant && formData.tenantStatus.length > 0) || (isVacant && formData.vacantIssues.length > 0)) ? '1.5rem' : '2.5rem' }}>`;
if (code.includes(roofStart)) {
  code = code.replace(roofStart, `</ConditionSection>\n            <ConditionSection id="roof" title="Roof System" isComplete={Boolean(formData?.roofAge || formData?.roofCondition)}>\n            <div className="flex flex-col mb-2 animate-slideIn">`);
  console.log("Replaced Roof Start");
} else {
  console.log("Failed to find Roof Start");
}

// 3. End of Roof / Start of HVAC
const hvacStart = `<div className="mt-8 pt-6 border-t-2 border-gray-300 text-xl font-black italic text-[#F5F5F5] leading-relaxed mb-6">
      "Okay, makes sense. And what about the HVAC system?`;
if (code.includes(hvacStart)) {
  code = code.replace(hvacStart, `</ConditionSection>\n            <ConditionSection id="hvac" title="HVAC System" isComplete={Boolean(formData?.hvacAge || formData?.hvacStatus)}>\n            <div className="text-xl font-black italic text-[#F5F5F5] leading-relaxed mb-6">\n      "Okay, makes sense. And what about the HVAC system?`);
  console.log("Replaced HVAC Start");
} else {
  console.log("Failed to find HVAC Start");
}

// 4. End of HVAC / Start of Plumbing
const plumbStart = `            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
    <div className="text-[#F5F5F5] font-black italic text-lg mb-8">
      "Okay, and for the plumbing, is that original or have you ever had to repipe the house?"`;
if (code.includes(plumbStart)) {
  code = code.replace(plumbStart, `</ConditionSection>\n            <ConditionSection id="plumbing" title="Plumbing & Water Heater" isComplete={Boolean(formData?.plumbingAge || formData?.plumbingCondition || formData?.waterHeater)}>\n            <div className="flex flex-col mb-2 animate-slideIn">\n  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">\n    <div className="text-[#F5F5F5] font-black italic text-lg mb-8">\n      "Okay, and for the plumbing, is that original or have you ever had to repipe the house?"`);
  console.log("Replaced Plumbing Start");
} else {
  console.log("Failed to find Plumbing Start");
}

// 5. End of Plumbing / Start of Electrical
const elecStart = `    <div className="border-t-2 border-gray-300 pt-6 mt-6">
      <div className="text-[#F5F5F5] font-black italic text-lg mb-8">
        "Got it. And what about the electrical system?`;
if (code.includes(elecStart)) {
  code = code.replace(elecStart, `</ConditionSection>\n            <ConditionSection id="electrical" title="Electrical & Utilities" isComplete={Boolean(formData?.electricalAge || formData?.electricalCondition || formData?.sewer || formData?.solar)}>\n            <div className="pt-2 mt-2">\n      <div className="text-[#F5F5F5] font-black italic text-lg mb-8">\n        "Got it. And what about the electrical system?`);
  console.log("Replaced Electrical Start");
} else {
  console.log("Failed to find Electrical Start");
}

// 6. End of Electrical / Start of Interior
const intStart = `            <div className="flex flex-col mb-2 animate-slideIn">
                <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
      <div className="text-[#F5F5F5] text-[#E2E8F0] font-medium text-lg leading-relaxed font-medium mb-4">
      {formData.propertyType === 'Multi-Family' ? `;
if (code.includes(intStart)) {
  code = code.replace(intStart, `</ConditionSection>\n            <ConditionSection id="interior" title="Interior Condition" isComplete={Boolean(formData?.kitchenCondition || formData?.bath1Condition)}>\n            <div className="flex flex-col mb-2 animate-slideIn">\n                <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">\n      <div className="text-[#F5F5F5] text-[#E2E8F0] font-medium text-lg leading-relaxed font-medium mb-4">\n      {formData.propertyType === 'Multi-Family' ? `);
  console.log("Replaced Interior Start");
} else {
  console.log("Failed to find Interior Start");
}

// 7. End of Interior / Start of Exterior
const extStart = `          <div className="mt-6 border-t border-[#333333] pt-6">
            <div className="text-[#F5F5F5] font-black italic text-lg mb-4">
              "And what about the outside of the house? Does the stucco and paint look pretty good`;
if (code.includes(extStart)) {
  code = code.replace(extStart, `</ConditionSection>\n            <ConditionSection id="exterior" title="Exterior & Amenities" isComplete={Boolean(formData?.exteriorCondition || formData?.windows || formData?.pool || formData?.hoa)}>\n            <div className="pt-2 mt-2">\n            <div className="text-[#F5F5F5] font-black italic text-lg mb-4">\n              "And what about the outside of the house? Does the stucco and paint look pretty good`);
  console.log("Replaced Exterior Start");
} else {
  console.log("Failed to find Exterior Start");
}

// 8. End of Exterior / Start of Red Flags
const rfStart = `            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
    <div className="text-[#F5F5F5] text-[#E2E8F0] font-medium text-lg leading-relaxed font-medium mb-4">
    "Okay, that gives me a great picture of the inside. Last thing before we talk numbers—just to check my standard boxes, have you guys noticed any settling with the foundation, or are there any unpermitted add-ons we'd need to factor in?"
    </div>`;
if (code.includes(rfStart)) {
  code = code.replace(rfStart, `</ConditionSection>\n            <ConditionSection id="redflags" title="Red Flags & Structure" isComplete={Boolean(formData?.structuralRedFlags?.length > 0)}>\n            <div className="flex flex-col mb-2 animate-slideIn">\n  <div className="bg-[#000000]/40 border-l-2 border-[#E5C158] p-4 rounded-r-xl mb-5 text-[#F5F5F5] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">\n    <div className="text-[#F5F5F5] text-[#E2E8F0] font-medium text-lg leading-relaxed font-medium mb-4">\n    "Okay, that gives me a great picture of the inside. Last thing before we talk numbers—just to check my standard boxes, have you guys noticed any settling with the foundation, or are there any unpermitted add-ons we'd need to factor in?"\n    </div>`);
  console.log("Replaced Red Flags Start");
} else {
  console.log("Failed to find Red Flags Start");
}

// 9. End of Red Flags / End of Pillar 2
// Let's use string matching for the end of Pillar 2.
// The end of Pillar 2 is the closing parenthesis of renderPillar(2, ...).
const p2End = `            {/* Toggles moved to sidebar */}
          </div>
        ))}`;
if (code.includes(p2End)) {
  code = code.replace(p2End, `            {/* Toggles moved to sidebar */}\n            </ConditionSection>\n          </div>\n        ))}`);
  console.log("Replaced Pillar 2 End");
} else {
  console.log("Failed to find Pillar 2 End");
}

fs.writeFileSync('src/components/script/CallScript.jsx', code);
console.log('Done replacing.');
