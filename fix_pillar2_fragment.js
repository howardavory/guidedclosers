const fs = require('fs');

let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

const targetStr = `{currentStep === 2 && (
              {/* INLINE REPAIRS ENGINE - EXECUTED DURING CONDITION DISCOVERY */}`;

if (code.includes(targetStr)) {
  const replacementStr = `{currentStep === 2 && (
              <>
              {/* INLINE REPAIRS ENGINE - EXECUTED DURING CONDITION DISCOVERY */}`;
  code = code.replace(targetStr, replacementStr);
  
  // Also need to find the end of that block and add </>
  // The block ends with:
  //               <div className="mt-12 mb-8 flex justify-center">
  //                   <button ... > Proceed to Pillar 3 ... </button>
  //                 </div>
  //             )}
  
  const blockEndStr = `</button>
                </div>
            )}`;
            
  if (code.includes(blockEndStr)) {
    const replacementEndStr = `</button>
                </div>
              </>
            )}`;
    code = code.replace(blockEndStr, replacementEndStr);
    fs.writeFileSync('src/components/script/CallScript.jsx', code);
    console.log("Wrapped Pillar 2 inline elements in fragment.");
  } else {
    console.log("Could not find block end.");
  }
} else {
  console.log("Could not find target string.");
}
