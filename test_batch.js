const fetch = require('node-fetch');

const API_KEY = 'da0a9851-5811-4702-8172-dcc8247e61af';
const ADDRESS = '4504 Norseman St, Bakersfield, CA 93309';

async function testBatchData() {
  const endpoints = [
    `https://api.batchdata.com/api/v1/property/search?search=${encodeURIComponent(ADDRESS)}`,
    `https://api.batchdata.com/api/v1/property/info?address=${encodeURIComponent(ADDRESS)}`,
    `https://api.batchleads.io/api/v1/property/search?address=${encodeURIComponent(ADDRESS)}`,
    `https://api.batchdata.com/api/v1/property?address=${encodeURIComponent(ADDRESS)}`,
  ];

  for (let url of endpoints) {
    console.log(`\nTesting ${url}`);
    try {
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });
      const text = await res.text();
      console.log(`Status: ${res.status}`);
      try {
        console.log(JSON.parse(text));
      } catch (e) {
        console.log(text.substring(0, 200));
      }
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

testBatchData();
