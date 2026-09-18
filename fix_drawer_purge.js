const fs = require('fs');

let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

const trailingJunk = ` solarAssumable={formData.solarAssumable} solarMonthlyPayment={formData.solarMonthlyPayment} />}
        </div>
      </div>
    )}`;

if (code.includes(trailingJunk)) {
  code = code.replace(trailingJunk, '');
  fs.writeFileSync('src/components/script/CallScript.jsx', code);
  console.log("Fixed trailing junk from Global Drawer purge.");
} else {
  console.log("Trailing junk not found.");
}
