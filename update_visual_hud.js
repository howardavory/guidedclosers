const fs = require('fs');

let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

const oldBlock = `{/* Data-driven completion checks for each HUD pillar */}
        {(() => {
          const conditionComplete = Boolean(
            formData?.propertyType || formData?.occupancy || formData?.roofCondition || 
            formData?.hvacStatus || formData?.plumbingCondition || formData?.kitchenCondition ||
            formData?.structuralRedFlags?.length > 0 || formData?.beds || formData?.baths
          );

          const timelineComplete = Boolean(
            formData?.targetTimeline || formData?.relocationDestination || formData?.postPossession
          );

          const motivationComplete = Boolean(
            formData?.distressTags?.length > 0 || formData?.sellerMotivation || formData?.notes ||
            formData?.leadSource || formData?.ownershipProfile
          );

          const priceComplete = Boolean(
            formData?.askingPrice || formData?.agreedPrice || formData?.arv || 
            formData?.firstMortgageBalance || formData?.cashOffer
          );

          const hudProgressPills = [
            { name: 'CONDITION', completed: conditionComplete },
            { name: 'TIMELINE', completed: timelineComplete },
            { name: 'MOTIVATION', completed: motivationComplete },
            { name: 'PRICE', completed: priceComplete },
          ];

          return hudElement && createPortal(
            <div className="flex items-center justify-between gap-4 w-full h-full px-2 lg:px-4 min-w-0">
              
              {/* Non-Interactive Progress Indicators */}
              <div className="hidden md:flex items-center gap-1.5 lg:gap-2 overflow-x-auto hide-scrollbar min-w-0 mr-auto py-1">
                <span className="text-[#777777] font-black text-[9px] lg:text-[10px] tracking-widest uppercase mr-1 shrink-0">PROGRESS:</span>
                {hudProgressPills.map((pillar) => (
                  <div 
                    key={pillar.name}
                    className={clsx(
                      "shrink-0 px-3 py-1.5 rounded-full font-bold text-[9px] lg:text-xs tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 border",
                      pillar.completed 
                        ? "bg-[#1A1A1A] text-[#E5C158] border-[#E5C158] shadow-[0_0_10px_rgba(229,193,88,0.3)]" 
                        : "bg-[#121212] text-[#666666] border-[#333333]"
                    )}
                  >
                    <span className={clsx(
                      "w-1.5 h-1.5 rounded-full", 
                      pillar.completed ? "bg-[#E5C158]" : "bg-[#444444]"
                    )} />
                    {pillar.name}
                  </div>
                ))}
              </div>
            </div>,
            hudElement
          );
        })()}`;

// Wait, I need to check exactly what the end of the block looks like. Let's use string manipulation based on `indexOf` to be robust.

const startIndex = code.indexOf('{/* Data-driven completion checks for each HUD pillar */}');
if (startIndex === -1) {
  console.log("Could not find start index");
  process.exit(1);
}

// Find the end of the IIFE.
const endIndex = code.indexOf('})()}', startIndex);
if (endIndex === -1) {
  console.log("Could not find end index");
  process.exit(1);
}

const blockToReplace = code.substring(startIndex, endIndex + 5);

const newBlock = `{/* Data-driven completion checks for each HUD pillar */}
        {(() => {
          // HUD mapped strictly to our nuclear-validated booleans, bypassing public records
          const hudProgressPills = [
            { name: 'CONDITION', completed: hasCondition },
            { name: 'TIMELINE', completed: hasTimeline },
            { name: 'MOTIVATION', completed: hasMotivation },
            { name: 'PRICE', completed: hasPrice },
          ];

          return hudElement && createPortal(
            <div className="flex items-center justify-between gap-4 w-full h-full px-2 lg:px-4 min-w-0">
              
              {/* Non-Interactive Progress Indicators */}
              <div className="hidden md:flex items-center gap-1.5 lg:gap-2 overflow-x-auto hide-scrollbar min-w-0 mr-auto py-1">
                <span className="text-[#777777] font-black text-[9px] lg:text-[10px] tracking-widest uppercase mr-1 shrink-0">PROGRESS:</span>
                {hudProgressPills.map((pillar) => (
                  <div 
                    key={pillar.name}
                    className={clsx(
                      "shrink-0 px-3 py-1.5 rounded-full font-bold text-[9px] lg:text-xs tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 border",
                      pillar.completed 
                        ? "bg-[#1A1A1A] text-[#E5C158] border-[#E5C158] shadow-[0_0_10px_rgba(229,193,88,0.3)]" 
                        : "bg-[#121212] text-[#666666] border-[#333333]"
                    )}
                  >
                    <span className={clsx(
                      "w-1.5 h-1.5 rounded-full", 
                      pillar.completed ? "bg-[#E5C158]" : "bg-[#444444]"
                    )} />
                    {pillar.name}
                  </div>
                ))}
              </div>
            </div>,
            hudElement
          );
        })()}`;

code = code.replace(blockToReplace, newBlock);
fs.writeFileSync('src/components/script/CallScript.jsx', code);
console.log('Successfully replaced HUD inline logic.');
