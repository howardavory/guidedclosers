const https = require('https');

const API_KEY = 'da0a9851-5811-4702-8172-dcc8247e61af';
const ADDRESS_STR = '4504 Norseman St, Bakersfield, CA 93309';

// Naive parse for testing
const parts = ADDRESS_STR.split(', ');
const street = parts[0] || '';
const city = parts[1] || '';
const stateZip = parts[2] || '';
const state = stateZip.split(' ')[0] || '';
const zip = stateZip.split(' ')[1] || '';

const payload = JSON.stringify({
  requests: [
    {
      address: { street, city, state, zip }
    }
  ]
});

console.log("Sending payload:", payload);

const options = {
  hostname: 'api.batchdata.com',
  port: 443,
  path: '/api/v1/property/lookup',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': payload.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log("Status:", res.statusCode);
    if (res.statusCode === 200) {
      console.log("Response:", JSON.stringify(JSON.parse(body), null, 2));
    } else {
      console.log("Body:", body);
    }
  });
});

req.on('error', console.error);
req.write(payload);
req.end();
