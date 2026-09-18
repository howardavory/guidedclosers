const fs = require('fs');
const path = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/RehabCalculator.jsx';
let code = fs.readFileSync(path, 'utf8');

const badStyleRegex = /<style>([\s\S]*?)<\/style>/;
const fixedStyle = '<style dangerouslySetInnerHTML={{ __html: `$1` }} />';
code = code.replace(badStyleRegex, fixedStyle);

// Also need to fix any stray `{` inside the html template literal if it conflicts, but in this case the html is just CSS.
// Let's actually just use string concatenation to be perfectly safe.

const replacementHtml = `\`
    .neo-slider {
      -webkit-appearance: none;
      width: 100%;
      background: #333333;
      height: 6px;
      outline: none;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .neo-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: #000000;
      border: 2px solid #00FF00;
      cursor: pointer;
      border-radius: 0px;
    }
    .neo-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: #000000;
      border: 2px solid #00FF00;
      cursor: pointer;
      border-radius: 0px;
    }
\``;

const exactBadStyleRegex = /<style>[\s\S]*?<\/style>/;
code = code.replace(exactBadStyleRegex, `<style dangerouslySetInnerHTML={{ __html: ${replacementHtml} }} />`);

fs.writeFileSync(path, code);
console.log('Fixed JSX style parsing error!');
