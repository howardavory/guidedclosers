import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
  header: { borderBottom: '2pt solid #D4AF37', paddingBottom: 10, marginBottom: 20 },
  brand: { fontSize: 24, fontWeight: 'bold', color: '#000000', textTransform: 'uppercase' },
  subBrand: { fontSize: 10, color: '#666666', letterSpacing: 1 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', backgroundColor: '#F3F4F6', padding: 5, marginBottom: 8, textTransform: 'uppercase' },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { fontSize: 10, fontWeight: 'bold', width: 120, color: '#333333' },
  value: { fontSize: 10, color: '#000000', flex: 1 },
  alertBox: { padding: 10, backgroundColor: '#FFFBEB', border: '1pt solid #D4AF37', marginTop: 20 },
  alertText: { fontSize: 10, fontWeight: 'bold', color: '#B45309' }
});

export const TearsheetTemplate = ({ data }) => {
  const address = data?.property?.address || data?.manualAddress || 'Address TBD';
  const name = data?.contact?.firstName ? `${data.contact.firstName} ${data.contact.lastName || ''}` : 'Seller';
  const askingPrice = data?.property?.askingPrice ? `$${Number(data.property.askingPrice).toLocaleString()}` : 'TBD';
  const arv = data?.property?.arv ? `$${Number(data.property.arv).toLocaleString()}` : 'TBD';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>Family Legacy Investment Group</Text>
          <Text style={styles.subBrand}>CONFIDENTIAL CASH BUYER TEARSHEET</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Overview</Text>
          <View style={styles.row}><Text style={styles.label}>Address:</Text><Text style={styles.value}>{address}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Seller Name:</Text><Text style={styles.value}>{name}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Beds / Baths:</Text><Text style={styles.value}>{data?.beds || '-'} / {data?.baths || '-'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Square Feet:</Text><Text style={styles.value}>{data?.sqft || '-'}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deal Fundamentals</Text>
          <View style={styles.row}><Text style={styles.label}>Asking Price:</Text><Text style={styles.value}>{askingPrice}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Estimated ARV:</Text><Text style={styles.value}>{arv}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Timeline:</Text><Text style={styles.value}>{data?.timelineType || 'ASAP'}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condition & Amenities</Text>
          <View style={styles.row}><Text style={styles.label}>Roof / HVAC:</Text><Text style={styles.value}>{data?.sfRoof || 'Unknown'} / {data?.sfHVAC || 'Unknown'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Red Flags:</Text><Text style={styles.value}>{data?.majorRedFlags?.length > 0 ? data.majorRedFlags.join(', ') : 'None Reported'}</Text></View>
        </View>

        {data?.viabilityScore && (
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>System Viability Score: {data.viabilityScore}/100</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
