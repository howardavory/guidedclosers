const fs = require('fs');

let code = fs.readFileSync('src/components/calculators/CreativeCalculator.jsx', 'utf8');

const badBlock = `    </div>
    </div>

    <div className="flex flex-col gap-2 bg-[#0A0A0F]/90 border border-[#333333] rounded-xl p-3">`;

const goodBlock = `    </div>

    <div className="flex flex-col gap-2 bg-[#0A0A0F]/90 border border-[#333333] rounded-xl p-3">`;

code = code.replace(badBlock, goodBlock);
fs.writeFileSync('src/components/calculators/CreativeCalculator.jsx', code);
console.log("CreativeCalculator fixed.");
