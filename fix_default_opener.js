const fs = require('fs');

const filePath = "src/components/script/CallScript.jsx";
let c = fs.readFileSync(filePath, "utf-8");

const replacement = `                    : (
                      <span>
                        "Hey {sellerFirstName}..." <span className="text-[#FF0055] italic text-base block mt-1 mb-2">(pause, wait for validation)</span>
                        "My name is Avory, a local investor. I was just giving you a call about {targetAddress} to see if you've considered selling and are open to a cash offer?"
                      </span>
                    )
                  }`;

c = c.replace(/:\s*\`"Hey \$\{sellerFirstName\}\. This is Avory, local investor here in Bakersfield just trying to reach the owner of \$\{targetAddress\}\. Is this the right number for them\?"\`\s*\}/, replacement);

fs.writeFileSync(filePath, c);
console.log("Updated default script");
