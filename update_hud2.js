const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

const oldLogic = `// STRICT PROGRESS HUD LOGIC (BULLETPROOFED)
  const hasValidData = (val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === 'string' && val.trim() === '') return false;
    if (typeof val === 'string' && (val.toLowerCase() === 'null' || val.toLowerCase() === 'undefined')) return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  };

  const hasCondition = Boolean(
    hasValidData(formData.sfRoof) || 
    hasValidData(formData.sfHVAC) || 
    hasValidData(formData.sfPlumbing) || 
    hasValidData(formData.sfElectrical) || 
    hasValidData(formData.exteriorCondition) ||
    hasValidData(formData.unpermittedTypes) ||
    hasValidData(formData.majorRedFlags)
  );

  const hasTimeline = Boolean(
    hasValidData(formData.timeline) || 
    hasValidData(formData.targetCloseDate) || 
    hasValidData(formData.timelineType)
  );

  const hasMotivation = Boolean(
    hasValidData(formData.motivationLevel) || 
    hasValidData(formData.painPoints)
  );

  const hasPrice = Boolean(
    (hasValidData(formData.askingPrice) && Number(String(formData.askingPrice).replace(/[^0-9.]/g, '')) > 0) || 
    hasValidData(formData.lockedPrice)
  );`;

const newLogic = `// STRICT PROGRESS HUD LOGIC (BULLETPROOFED)
  const hasValidData = (val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === 'string' && val.trim() === '') return false;
    if (typeof val === 'string' && (val.toLowerCase() === 'null' || val.toLowerCase() === 'undefined')) return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  };

  // CONDITION must ONLY track Pillar 2 distress variables, NOT beds, baths, sqft, or yearBuilt
  const hasCondition = Boolean(
    hasValidData(formData.sfRoof) || 
    hasValidData(formData.sfHVAC) || 
    hasValidData(formData.sfPlumbing) || 
    hasValidData(formData.sfElectrical) || 
    hasValidData(formData.exteriorCondition) ||
    hasValidData(formData.interiorCondition) ||
    hasValidData(formData.kitchenCondition) ||
    hasValidData(formData.poolCondition) ||
    hasValidData(formData.unpermittedTypes) ||
    hasValidData(formData.majorRedFlags)
  );

  const hasTimeline = Boolean(
    hasValidData(formData.timeline) || 
    hasValidData(formData.targetCloseDate) || 
    hasValidData(formData.timelineType)
  );

  const hasMotivation = Boolean(
    hasValidData(formData.motivationLevel) || 
    hasValidData(formData.painPoints)
  );

  const hasPrice = Boolean(
    (hasValidData(formData.askingPrice) && Number(String(formData.askingPrice).replace(/[^0-9.]/g, '')) > 0) || 
    hasValidData(formData.lockedPrice)
  );`;

if (code.includes(oldLogic)) {
  code = code.replace(oldLogic, newLogic);
  fs.writeFileSync('src/components/script/CallScript.jsx', code);
  console.log('HUD logic updated again successfully.');
} else {
  console.log('Failed to find exact block. Let us check again.');
}
