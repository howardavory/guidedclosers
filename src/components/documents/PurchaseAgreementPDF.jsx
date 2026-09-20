import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', lineHeight: 1.5, color: '#000' },
  header: { fontSize: 14, textAlign: 'center', fontFamily: 'Helvetica-Bold', marginBottom: 15 },
  subHeader: { fontSize: 10, textAlign: 'center', marginBottom: 20 },
  section: { marginBottom: 12 },
  bold: { fontFamily: 'Helvetica-Bold' },
  title: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 4, textDecoration: 'underline' },
  row: { flexDirection: 'row', marginBottom: 4 },
  signatureBlock: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 },
  signatureLine: { borderTop: '1px solid black', width: 220, paddingTop: 5, fontSize: 10 }
});

export default function PurchaseAgreementPDF({ formData }) {
  const seller = formData.legalName || formData.manualName || '______________________';
  const address = formData.manualAddress || '______________________';
  const price = formData.lockedPrice || formData.askingPrice || 0;
  const emdAmount = formData.emdAmount || 1000; // Default EMD
  const balance = Number(price) - Number(emdAmount);
  const closeDate = formData.targetCloseDate ? new Date(formData.targetCloseDate + 'T00:00:00').toLocaleDateString('en-US') : '______________________';
  const beds = formData.beds || '-';
  const baths = formData.baths || '-';
  const sqft = formData.sqft || '-';
  const propType = formData.expectedPropertyType || formData.propertyType || 'Single Family';

  // DYNAMIC CONDITIONAL LOGIC FOR ADDITIONAL TERMS
  let dynamicTerms = "• Purchase is for investment purposes only. Family Legacy Investment Group LLC is free to purchase property to rent, lease, assign or sell for profit, it is further understood that the buyer does not intend to occupy the property.\n• Property to be purchased As-Is.\n";
  
  if (formData.cashToMoveNeeded === 'Yes') {
    dynamicTerms += `• POST-POSSESSION & ESCROW HOLDBACK: Seller shall remain in possession of the Property for up to ${formData.postCloseDays || 0} days following the close of escrow. An escrow holdback of ${formData.holdbackType === '%' ? formData.holdbackAmount + '%' : '$' + formData.holdbackAmount} shall be retained and released immediately upon vacating the Property in broom-clean condition.\n`;
  }
  if (formData.pitchType === 'subto') {
    dynamicTerms += `• SUBJECT-TO EXISTING FINANCING: Buyer is purchasing the Property "Subject-To" the existing mortgage. Buyer assumes no personal liability for the loan but agrees to make the monthly payments of approximately $${formData.mortgagePITI || 0} on behalf of the Seller. The underlying debt remains in the Seller's name, while the deed transfers to the Buyer at closing.\n`;
  }
  if (formData.pitchType === 'sellerfinance') {
    dynamicTerms += `• SELLER FINANCING: Seller agrees to carry a promissory note for the remaining equity. Specific financial terms shall be detailed in a separate Promissory Note and secured by a Deed of Trust at closing.\n`;
  }
  
  const additionalCustomTerms = formData.additionalTerms ? `\n• ${formData.additionalTerms}` : '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>FAMILY LEGACY INVESTMENT GROUP LLC</Text>
        <Text style={styles.header}>Real Estate Purchase and Sale Agreement</Text>
        
        <View style={styles.section}>
          <Text>SELLER: <Text style={styles.bold}>{seller}</Text></Text>
          <Text>ADDRESS: <Text style={styles.bold}>{address}</Text></Text>
          <Text>BUYER: <Text style={styles.bold}>Family Legacy Investment Group LLC and/or assignee</Text></Text>
          <Text>ADDRESS: <Text style={styles.bold}>4108 Erin Ct, Bakersfield, CA, 93309</Text></Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>1. REAL PROPERTY TO BE PURCHASED</Text>
          <Text>Address: <Text style={styles.bold}>{address}</Text></Text>
          <Text>Described as: <Text style={styles.bold}>{beds} Bed / {baths} Bath, {sqft} SqFt, {propType}</Text></Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>2. INCLUDED IN SALE PRICE</Text>
          <Text>The Real Property shall include all items permanently attached to the property on the date Buyer signed this Agreement. Purchase to be As-Is.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>3. PURCHASE PRICE: ${Number(price).toLocaleString()}</Text>
          <Text>Payable as follows:</Text>
          <Text>• By initial Deposit submitted herewith: <Text style={styles.bold}>${Number(emdAmount).toLocaleString()}</Text></Text>
          <Text>• Balance to be paid at Closing: <Text style={styles.bold}>${Number(balance).toLocaleString()}</Text></Text>
          <Text>TOTAL PRICE TO BE PAID: <Text style={styles.bold}>${Number(price).toLocaleString()}</Text></Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>7. INSPECTION CONTINGENCY</Text>
          <Text>Buyer does NOT choose to have any inspections performed and WAIVES any rights to object to any defects in the property that would have been disclosed by a full and complete inspection.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>9. CLOSING</Text>
          <Text>CLOSING DATE: <Text style={styles.bold}>{closeDate}</Text></Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>18. ADDITIONAL TERMS AND CONDITIONS</Text>
          <Text>{dynamicTerms}{additionalCustomTerms}</Text>
        </View>

        <View style={styles.signatureBlock}>
          <View><Text style={styles.signatureLine}>SELLER: {seller}</Text><Text>Date: _______________</Text></View>
          <View><Text style={styles.signatureLine}>BUYER: Avory Howard - Family Legacy</Text><Text>Date: _______________</Text></View>
        </View>
      </Page>
    </Document>
  );
}
