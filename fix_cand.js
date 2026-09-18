const fs = require("fs");
let code = fs.readFileSync("C:/Users/avory/.gemini/antigravity/brain/91dc1a01-e8f5-49ce-8347-2f8ca71c1cad/scratch/CallScript_v3_candidate.jsx", "utf8");

const headerStr = "  const renderPillar = (number, title, icon, content) => {";
let idx1 = code.indexOf(headerStr);
if (idx1 !== -1) {
    let idx2 = code.indexOf(headerStr, idx1 + 10);
    if (idx2 !== -1) {
        code = code.substring(0, idx1) + code.substring(idx2);
    }
}

const lines = code.split("\n");
let startIdx = -1;
for (let i=0; i<lines.length; i++) {
    if (lines[i] === "  return (" && lines[i+1].includes("<div ") && lines[i+2].includes("className={clsx(\"flex justify-between items-center p-5")) {
        startIdx = i;
        break;
    }
}
if (startIdx !== -1) {
    let endIdx = -1;
    for (let i = startIdx; i < lines.length; i++) {
        if (lines[i] === "    );") {
            endIdx = i;
            break;
        }
    }
    if (endIdx !== -1) {
        lines.splice(startIdx, endIdx - startIdx + 1);
        code = lines.join("\n");
    }
}

try {
    require("@babel/parser").parse(code, { sourceType: "module", plugins: ["jsx"] });
    console.log("SUCCESS! It parses perfectly!");
    fs.writeFileSync("C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/CallScript_fixed_v3.jsx", code);
} catch (e) {
    console.log("Error at line", e.loc.line, "col", e.loc.column);
    console.log(e.message);
}
