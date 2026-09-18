const fs = require("fs");
let code = fs.readFileSync("C:/Users/avory/.gemini/antigravity/brain/91dc1a01-e8f5-49ce-8347-2f8ca71c1cad/scratch/CallScript_v3_candidate.jsx", "utf8");
const lines = code.split("\n");

let hIdxs = [];
for (let i=0; i<lines.length; i++) if (lines[i].includes("const renderPillar = (number, title, icon, content) => {")) hIdxs.push(i);
console.log("Headers at:", hIdxs);

let rIdxs = [];
for (let i=0; i<lines.length; i++) {
    if (lines[i].includes("className={clsx(\"flex justify-between items-center p-5 cursor-pointer")) {
        rIdxs.push(i);
    }
}
console.log("Return blocks at:", rIdxs);

if (hIdxs.length === 2 && rIdxs.length === 2) {
    for(let i=hIdxs[0]; i<=hIdxs[1]+2; i++) console.log((i+1) + ": " + lines[i]);
    console.log("---");
    for(let i=rIdxs[0]-2; i<=rIdxs[1]+2; i++) console.log((i+1) + ": " + lines[i]);
}
