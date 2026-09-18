const fs = require('fs');

const filePath = "src/components/script/CallScript.jsx";
let c = fs.readFileSync(filePath, "utf-8");

const oldText = `"Hey {sellerFirstName}..."`;
const newText = `"Hey {sellerFirstName}, how are you doing today?..."`;

c = c.replace(oldText, newText);

fs.writeFileSync(filePath, c);
console.log("Updated default script with 'how are you doing today'");
