import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Helvetica', fontSize: 11, lineHeight: 1.5 },
  title: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  paragraph: { marginBottom: 15, textAlign: 'justify' },
  bold: { fontWeight: 'bold' },
  signatureBlock: { marginTop: 40, flexDirection: 'row', justifyContent: 'space-between' },
  signatureLine: { borderTop: '1pt solid black', width: 200, paddingTop: 5, textAlign: 'center' }
});

export const ContractTemplate = ({ data }) => {
  const address = data?.property?.address || '[PROPERTY ADDRESS]';
  const price = data?.property?.askingPrice ? `$${Number(data.property.askingPrice).toLocaleString()}` : '[ASSIGNMENT FEE]';
  const date = new Date().toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>ASSIGNMENT OF REAL ESTATE PURCHASE AND SALE AGREEMENT</Text>
        
        <Text style={styles.paragraph}>
          This Assignment is made on <Text style={styles.bold}>{date}</Text>, by and between Family Legacy Investment Group LLC ("Assignor") and _________________________ ("Assignee").
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>1. AGREEMENT:</Text> Assignor hereby assigns, transfers, and sets over to Assignee all of Assignor's right, title, and interest in and to that certain Real Estate Purchase and Sale Agreement concerning the property located at: <Text style={styles.bold}>{address}</Text>.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>2. CONSIDERATION:</Text> Assignee shall pay Assignor an Assignment Fee of <Text style={styles.bold}>{price}</Text>, payable at closing.
        </Text>

        <View style={styles.signatureBlock}>
          <View>
            <Text style={styles.signatureLine}>Assignor: Family Legacy Investment Group</Text>
          </View>
          <View>
            <Text style={styles.signatureLine}>Assignee</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
