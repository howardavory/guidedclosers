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

files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    let changed = false;

    // STEP 4: Fix Purple Border globally
    if (code.includes('focus-within:border-[#9B5DE5]')) {
        code = code.split('focus-within:border-[#9B5DE5]').join('focus-within:border-[#D4AF37]');
        changed = true;
    }

    // STEP 1 & 2: Dialogue / Toggle Wrappers
    // Fix existing ones that I changed to w-full p-5
    const oldWrapper1 = 'className="relative border-l-4 border-transparent focus-within:border-[#D4AF37] focus-within:bg-[#121212]/80 bg-[#1A1A1A] w-full p-5 shadow-sm rounded-xl mb-5 transition-all"';
    const newWrapper1 = 'className="relative border-l-4 border-transparent focus-within:border-[#D4AF37] focus-within:bg-[#121212]/80 bg-[#1A1A1A] w-full p-8 md:p-10 shadow-sm rounded-xl mb-5 transition-all"';
    if (code.includes(oldWrapper1)) {
        code = code.split(oldWrapper1).join(newWrapper1);
        changed = true;
    }

    // Fix other ones that might have mr-4 max-w-full and bg-[#1A1A1A]
    // Regex for: className="..." containing bg-[#1A1A1A] AND mr-4 AND max-w-full
    const regexContainers = /className="([^"]*bg-\[#1A1A1A\][^"]*mr-4[^"]*max-w-full[^"]*)"/g;
    code = code.replace(regexContainers, (match, p1) => {
        let newClass = p1.replace(/mr-4/g, '').replace(/max-w-full/g, 'w-full').replace(/p-6/g, 'p-8 md:p-10').replace(/\s+/g, ' ');
        changed = true;
        return `className="${newClass.trim()}"`;
    });

    // Just to be exhaustive for Step 1/2: any class containing bg-[#1A1A1A] and border-l-4 that might still have mr-4
    const regexL4 = /className="([^"]*bg-\[#1A1A1A\][^"]*border-l-4[^"]*)"/g;
    code = code.replace(regexL4, (match, p1) => {
        let newClass = p1;
        if (newClass.includes('mr-4') || newClass.includes('max-w-full')) {
            newClass = newClass.replace(/mr-4/g, '').replace(/max-w-full/g, 'w-full').replace(/\s+/g, ' ');
            changed = true;
        }
        if (newClass.includes('p-5 ') || newClass.includes('p-6 ')) {
            // Only replace if it's the main wrapper, but safe to replace p-5/p-6 if it's border-l-4 wrapper
            newClass = newClass.replace(/p-5 /g, 'p-8 md:p-10 ').replace(/p-6 /g, 'p-8 md:p-10 ');
            changed = true;
        }
        return `className="${newClass.trim()}"`;
    });


    // STEP 3: Separate the Script Text from Toggles
    // Looking for text-[#F5F5F5] font-black italic (sometimes has text-lg, sometimes mb-4, mb-3, mb-6)
    // We want to force mb-8
    const regexText1 = /className="([^"]*text-\[#F5F5F5\][^"]*font-black[^"]*italic[^"]*mb-[0-9]+[^"]*)"/g;
    code = code.replace(regexText1, (match, p1) => {
        // Only if it doesn't already have mb-8
        if (!p1.includes('mb-8') && !p1.includes('rounded-none')) { // exclude buttons which have rounded-none
            let newClass = p1.replace(/mb-[0-9]+/g, 'mb-8');
            changed = true;
            return `className="${newClass}"`;
        }
        return match;
    });
    
    // Also catch those that don't have mb-X at all
    const regexText2 = /className="([^"]*text-\[#F5F5F5\][^"]*font-black[^"]*italic[^"]*)"/g;
    code = code.replace(regexText2, (match, p1) => {
        if (!p1.includes('mb-') && !p1.includes('rounded-none') && !p1.includes('absolute')) {
            let newClass = p1 + ' mb-8';
            changed = true;
            return `className="${newClass}"`;
        }
        return match;
    });
    
    // We also see: <div className="text-[#F5F5F5] font-black italic mb-3">"You mentioned the foundation..."</div>
    // The first regex should catch it. Let's verify `mb-3` is caught. Yes.

    if (changed) {
        fs.writeFileSync(file, code);
        console.log(`Uncramped UI in ${file}`);
    }
});
console.log('Uncramp UI pass complete.');
