// Mock Google Places API
export const mockGooglePlaces = async (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        formatted_address: query || "123 Main St, Anytown, USA",
        components: {
          street: "123 Main St",
          city: "Anytown",
          state: "TX",
          zip: "75001"
        }
      });
    }, 500);
  });
};

// Smart Contract / Disposition Generator
export const generateContract = (masterLead) => {
  const { propertyDetails, financialEngine, triageCondition } = masterLead;

  return {
    contractId: `CTR-${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleDateString(),
    sellerName: "Test Seller", // In a real app, this comes from the lead record
    propertyAddress: propertyDetails.address || "No Address Provided",
    purchasePrice: financialEngine.mao || 0,
    earnestMoney: 1000,
    closingDays: 14,
    conditions: {
      roof: triageCondition.roof,
      hvac: triageCondition.hvac,
      plumbing: triageCondition.plumbing
    },
    status: "DRAFT_READY"
  };
};
