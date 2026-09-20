import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', lineHeight: 1.5, color: '#000' },
  header: { fontSize: 14, textAlign: 'center', fontFamily: 'Helvetica-Bold', marginBottom: 20 },
  section: { marginBottom: 12 },
  bold: { fontFamily: 'Helvetica-Bold' },
  title: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 4, textDecoration: 'underline' },
  signatureBlock: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 },
  signatureLine: { borderTop: '1px solid black', width: 220, paddingTop: 5, fontSize: 10 }
});

export default function AssignmentAgreementPDF({ formData, assignmentFee = 30000 }) {
  const assignor = 'Family Legacy Investment Group LLC';
  const assignee = formData.endBuyerName || '______________________';
  const address = formData.manualAddress || '______________________';
  const psaDate = formData.psaSignedDate || '______________________';
  const seller = formData.legalName || formData.manualName || '______________________';
  
  const psaPrice = Number(formData.lockedPrice || formData.askingPrice || 0);
  const assignedPrice = psaPrice + Number(assignmentFee);
  const emdAmount = formData.endBuyerEmd || 5000;
  const coeDate = formData.targetCloseDate ? new Date(formData.targetCloseDate + 'T00:00:00').toLocaleDateString('en-US') : '______________________';
  const titleCompany = formData.titleCompany || '______________________';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>FAMILY LEGACY INVESTMENT GROUP LLC</Text>
        <Text style={styles.header}>Assignment Agreement</Text>

        <View style={styles.section}>
          <Text>Assignor: <Text style={styles.bold}>{assignor}</Text></Text>
          <Text>Assignee: <Text style={styles.bold}>{assignee}</Text></Text>
          <Text>Property Address: <Text style={styles.bold}>{address}</Text>    Date: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text>Escrow/Title agent is hereby instructed that the Assignee in the above-referenced escrow is <Text style={styles.bold}>{assignee}</Text> and you are instructed to treat Assignee as though they were the original purchaser to said escrow for contract dated <Text style={styles.bold}>{psaDate}</Text> by and between {assignor} and <Text style={styles.bold}>{seller}</Text>.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>1. PURCHASE PRICE AND ASSIGNMENT FEE</Text>
          <Text>Assignee understands they will pay <Text style={styles.bold}>${assignedPrice.toLocaleString()}</Text> excluding escrow and title fees for the properties located at {address}. This price does include an assignment fee total of <Text style={styles.bold}>${Number(assignmentFee).toLocaleString()}</Text> to {assignor}.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>2. ESCROW AND EARNEST MONEY DEPOSIT (EMD)</Text>
          <Text>Assignee must deposit <Text style={styles.bold}>${Number(emdAmount).toLocaleString()}</Text> earnest money to <Text style={styles.bold}>{titleCompany}</Text> by 5 pm [72 hours from fully executed agreement]. Assignee to cover all closing costs associated with this transaction.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>3. CLOSE OF ESCROW</Text>
          <Text>The Assignee agrees to close Escrow on or before <Text style={styles.bold}>{coeDate}</Text>. Assignee has stated they are the end buyer. Assignor has not given permission to the assignee to market the property.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>7. LIQUIDATED DAMAGES</Text>
          <Text>In the event the assignee fails to complete the purchase, the assignee will be liable for $10,000.00 in liquidated damages (in addition to EMD forfeiture) to be paid to Family Legacy Investment Group LLC.</Text>
        </View>

        <View style={styles.signatureBlock}>
          <View><Text style={styles.signatureLine}>ASSIGNOR: Avory Howard</Text><Text>Date: _______________</Text></View>
          <View><Text style={styles.signatureLine}>ASSIGNEE: {assignee}</Text><Text>Date: _______________</Text></View>
        </View>
      </Page>
    </Document>
  );
}
