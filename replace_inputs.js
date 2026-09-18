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

const targetClass = 'w-full bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all';

files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Pattern to match any className="..." containing both 'border-b-2 border-[#333333]' OR 'bg-transparent' and 'rounded-none'
    // Specifically looking for the ones we just injected (or similar ones)
    // We'll replace the exact string from before:
    const exactSleek = 'w-full appearance-none bg-transparent border-b-2 border-[#333333] pb-2 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] transition-colors rounded-none';
    if (code.includes(exactSleek)) {
        code = code.split(exactSleek).join(targetClass);
        changed = true;
    }

    // Also look for variations (like in CallScript line 570 which had bg-[#121212] instead of bg-transparent)
    const exactSleek2 = 'w-full appearance-none bg-[#121212] border-b-2 border-[#333333] pb-2 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] transition-colors rounded-none';
    if (code.includes(exactSleek2)) {
        code = code.split(exactSleek2).join(targetClass);
        changed = true;
    }

    // We can also use a regex to catch any other className="..." that has border-b-2 border-[#333333] and rounded-none
    const regex = /className="(w-full [^"]*border-b-2 border-\[#333333\][^"]*rounded-none[^"]*)"/g;
    code = code.replace(regex, (match, p1) => {
        changed = true;
        return `className="${targetClass}"`;
    });

    // Also check for className={'...'} 
    const regex2 = /className=\{'([^']*border-b-2 border-\[#333333\][^']*rounded-none[^']*)'\}/g;
    code = code.replace(regex2, (match, p1) => {
        changed = true;
        return `className={'${targetClass}'}`;
    });

    if (changed) {
        fs.writeFileSync(file, code);
        console.log(`Updated inputs in ${file}`);
    }
});
console.log('Finished updating inputs globally.');
