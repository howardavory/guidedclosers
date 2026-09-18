const fs = require('fs');

const filePath = "src/app/api/ghl/route.js";
let c = fs.readFileSync(filePath, "utf-8");

const oldText = `    if (!pipeRes.ok) {
      console.error("[GHL API] Pipeline Fetch Error:", await pipeRes.text());
      return NextResponse.json({ success: false, error: "Failed to fetch pipelines" }, { status: 500 });
    }`;

const newText = `    if (!pipeRes.ok) {
      const errText = await pipeRes.text();
      console.error("[GHL API] Pipeline Fetch Error:", errText, "Status:", pipeRes.status, "LocationID:", GHL_LOCATION_ID ? "Loaded" : "Missing", "API Key:", GHL_API_KEY ? "Loaded" : "Missing");
      return NextResponse.json({ success: false, error: \`Failed to fetch pipelines: \${errText} (Status \${pipeRes.status})\` }, { status: 500 });
    }`;

c = c.replace(oldText, newText);

fs.writeFileSync(filePath, c);
console.log("Updated API route error handling");
