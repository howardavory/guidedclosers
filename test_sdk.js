const { BatchDataClient } = require('@land-catalyst/batch-data-sdk');

const API_KEY = 'da0a9851-5811-4702-8172-dcc8247e61af';
const client = new BatchDataClient(API_KEY);

async function test() {
  try {
    const propertyData = await client.property.searchByAddress({
      address: '4504 Norseman St',
      city: 'Bakersfield',
      state: 'CA',
      zip: '93309'
    });
    console.log(JSON.stringify(propertyData, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
