const fs = require('fs');
const path = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx';
let code = fs.readFileSync(path, 'utf8');

// Update Roof & AC
const roofAcRegex = /{formData\.roof\.length > 0 && formData\.hvac\.length > 0 \? "You mentioned earlier the condition of the roof and AC, which helps a lot\." :[\s\S]*?"Typically the biggest expenses for us are the roof and the AC\. Have those been replaced anytime recently\?"}/;
const newRoofAc = `{formData.roof.length > 0 && formData.hvac.length > 0 ? "You mentioned earlier the condition of the roof and AC, which helps a lot." : 
                 formData.roof.length > 0 ? "You mentioned the roof earlier, but what about the AC? Has that been replaced anytime recently?" :
                 formData.hvac.length > 0 ? "You mentioned the AC earlier, but what about the roof? Has that been replaced anytime recently?" :
                 formData.propertyType === 'Multi-Family' ? "Alright, I've got the rental data locked in. Now, shifting over to the physical condition of the property... Typically my biggest expenses are the roof and the AC. Have those been replaced anytime recently?" :
                 ((isTenant && formData.tenantStatus.includes('Eviction Needed')) || (isTenant && formData.tenantStatus.includes('Paying on Time') && formData.leaseType === 'M2M') || (isVacant && formData.vacantIssues.length > 0)) ? 
                  "Typically our biggest expenses are the roof and the AC. Have those been replaced anytime recently?" : 
                  "Typically the biggest expenses for us are the roof and the AC. Have those been replaced anytime recently?"}`;
code = code.replace(roofAcRegex, newRoofAc);

// Update Plumbing & Electrical
const plumbingElecRegex = /{formData\.plumbing\.length > 0 && formData\.electrical\.length > 0 \? "You also mentioned the plumbing and electrical situation earlier\.\.\." :[\s\S]*?"Got it\. What about the plumbing and electrical\.\.\. any recent updates there\?"[\s\S]*?}/;
const newPlumbingElec = `{formData.plumbing.length > 0 && formData.electrical.length > 0 ? "You also mentioned the plumbing and electrical situation earlier..." :
                 formData.plumbing.length > 0 ? "You mentioned the plumbing earlier... what about the electrical, is the panel updated?" :
                 formData.electrical.length > 0 ? "You mentioned the electrical earlier... what about the plumbing, any recent updates there?" :
                 formData.propertyType === 'Multi-Family' ? "What about the plumbing and electrical, any recent updates there?" :
                 showedRoofHVACReaction 
                  ? "Okay, what about the plumbing and electrical... any recent updates there?"
                  : "Got it. What about the plumbing and electrical... any recent updates there?"
                }`;
code = code.replace(plumbingElecRegex, newPlumbingElec);

// Update Cosmetics
const cosmeticsRegex = /{formData\.cosmeticsKitchen\.length > 0 && formData\.cosmeticsBaths\.length > 0 \? "You already gave me a good idea of the kitchen and bath conditions\.\.\." :[\s\S]*?"So it sounds like the major systems are pretty clear\.\.\. as far as the inside goes, are the kitchens and bathrooms fairly modern, or a bit more dated\?"[\s\S]*?}/;
const newCosmetics = `{formData.propertyType === 'Multi-Family' ? 
                  "Got it. And as far as the inside of the units go... are the kitchens and bathrooms fairly modern across the board, or are they a bit more dated and in need of some work?" :
                 formData.cosmeticsKitchen.length > 0 && formData.cosmeticsBaths.length > 0 ? "You already gave me a good idea of the kitchen and bath conditions..." :
                 showedPlumbingReaction
                  ? "Okay. As far as the inside goes, are the kitchens and bathrooms fairly modern, or a bit more dated?"
                  : "So it sounds like the major systems are pretty clear... as far as the inside goes, are the kitchens and bathrooms fairly modern, or a bit more dated?"
                }`;
code = code.replace(cosmeticsRegex, newCosmetics);

// Inject MF Cosmetics Toggle Bank (Sidebar UI handled separately, but we need to ensure the state exists. The user wants the toggle bank rendered. I'll add the UI rendering for it in the sidebar if needed, but the plan says "Implement Overall Interior Condition toggle bank")

// Update Structure & Risk
const structureRegex = /{formData\.highRisk\.length > 0 \? "And you mentioned earlier the structural situation, which I have noted\.\.\." :[\s\S]*?"Makes sense\. Before we move on from the property itself, any red flags we'd need to know about\? Like foundation settling or unpermitted additions\?"}/;
const newStructure = `{formData.highRisk.length > 0 ? "And you mentioned earlier the structural situation, which I have noted..." :
                 formData.propertyType === 'Multi-Family' ? "Makes sense. Before we move on from the property itself, are there any red flags I'd need to know about? Like foundation settling or unpermitted additions?" :
                 "Makes sense. Before we move on from the property itself, any red flags we'd need to know about? Like foundation settling or unpermitted additions?"}`;
code = code.replace(structureRegex, newStructure);

fs.writeFileSync(path, code);
console.log('Phases 4-6 text logic updated!');
