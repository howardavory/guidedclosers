const fs = require("fs");
const lines = fs.readFileSync("CallScript_clean.jsx", "utf8").split("\n");

let newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes("The following is an <EPHEMERAL_MESSAGE>")) {
        skip = true;
        continue;
    }
    
    if (skip && line.includes("</EPHEMERAL_MESSAGE>")) {
        skip = false;
        continue;
    }
    
    if (!skip) {
        newLines.push(line);
    }
}

let code = newLines.join("\n");

const headerStr = "  const renderPillar = (number, title, icon, content) => {";
let headerIdx1 = code.indexOf(headerStr);
if (headerIdx1 !== -1) {
    let headerIdx2 = code.indexOf(headerStr, headerIdx1 + 10);
    if (headerIdx2 !== -1) {
        code = code.substring(0, headerIdx1) + code.substring(headerIdx2);
    }
}

const dupReturnStr = "  return (\n        <div \n          className={clsx(\"flex justify-between items-center p-5 cursor-pointer select-none border-b-4 border-black\",";
let returnIdx = code.indexOf(dupReturnStr);
if (returnIdx !== -1) {
    let endIdx = code.indexOf("  };\n", returnIdx);
    if (endIdx !== -1) {
        code = code.substring(0, returnIdx) + code.substring(endIdx + 5);
    }
}

fs.writeFileSync("CallScript_clean2.jsx", code);
console.log("Cleaned again!");
