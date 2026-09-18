const fs = require("fs");
let code = fs.readFileSync("C:/Users/avory/.gemini/antigravity/brain/91dc1a01-e8f5-49ce-8347-2f8ca71c1cad/scratch/CallScript_v3_candidate.jsx", "utf8");
const lines = code.split("\n");

const headerStr = "  const renderPillar = (number, title, icon, content) => {";
const returnStr = "  return (\n        <div \n          className={clsx(\"flex justify-between items-center p-5 cursor-pointer select-none border-b-4 border-black\",";

// find all headers
let hIdxs = [];
for (let i=0; i<lines.length; i++) if (lines[i] === headerStr) hIdxs.push(i);
console.log("Headers at:", hIdxs);

// find all return blocks
let rIdxs = [];
for (let i=0; i<lines.length; i++) {
    if (lines[i] === "  return (" && lines[i+1] && lines[i+1].includes("<div ") && lines[i+2] && lines[i+2].includes("className={clsx(\"flex justify-between items-center")) {
        rIdxs.push(i);
    }
}
console.log("Return blocks at:", rIdxs);

if (hIdxs.length === 2 && rIdxs.length === 2) {
    // We remove the first header block and first return block!
    // But wait, what if the first header block is literally just the first header, and then it is followed immediately by the second header?
    // Let us see the exact structure!
    for(let i=hIdxs[0]; i<=hIdxs[1]+2; i++) console.log((i+1) + ": " + lines[i]);
    console.log("---");
    for(let i=rIdxs[0]; i<=rIdxs[1]+2; i++) console.log((i+1) + ": " + lines[i]);
}
