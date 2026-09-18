const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src');

const wrongDivClass = 'w-full flex items-center gap-2 bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all';
const rightDivClass = 'w-full flex items-center gap-2 bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] font-semibold text-base focus-within:border-[#E5C158] focus-within:ring-1 focus-within:ring-[#E5C158]/30 transition-all';

files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    if (code.includes(wrongDivClass)) {
        code = code.split(wrongDivClass).join(rightDivClass);
        fs.writeFileSync(file, code);
        console.log(`Fixed div focus in ${file}`);
    }
});
console.log('Done');
