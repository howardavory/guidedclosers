import React from 'react';
import { X, Printer, Copy } from 'lucide-react';

export default function TearSheet({ formData, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  // Automated Contingencies Logic
  const contingencies = [];
  if (formData.conditionOccupancy === 'Squatters') {
    contingencies.push("Subject to buyer verifying squatter eviction timelines and legal costs.");
  }
  if (formData.conditionRoof === 'Tarped / Failed' || formData.conditionWater === 'Active Flooding') {
    contingencies.push("Subject to structural inspection due to severe roof/water damage.");
  }
  if (formData.timeline === 'ASAP (0-14 Days)') {
    contingencies.push("Rush Closing Required: Buyer must perform quickly.");
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0' }}>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', width: '100%', justifyContent: 'flex-start' }}>
        <button onClick={handlePrint} style={{ padding: '10px 20px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>
      
      <div className="printable-tear-sheet" style={{ background: '#fff', color: '#111', padding: '50px', borderRadius: '8px', width: '100%', maxWidth: '850px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', fontFamily: 'sans-serif' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '3px solid #111', paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: '-1px' }}>Investment Property</h1>
            <h2 style={{ margin: '5px 0 0 0', color: '#444', fontSize: '1.2rem', fontWeight: 'normal' }}>{formData.propertyAddress || 'Address Not Provided'}</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase' }}>Estimated ARV</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981' }}>{formData.calculatedARV ? `$${parseInt(formData.calculatedARV).toLocaleString()}` : 'TBD'}</div>
          </div>
        </div>

        {/* Grid Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          {/* Left Col */}
          <div>
            <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: 0 }}>Deal Fundamentals</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <tbody>
                <tr><td style={{ padding: '8px 0', fontWeight: 'bold', width: '40%' }}>Seller Reason:</td><td style={{ padding: '8px 0' }}>{formData.coreReason || 'N/A'}</td></tr>
                <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Timeline:</td><td style={{ padding: '8px 0' }}>{formData.timeline || 'N/A'}</td></tr>
                <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Asking Price:</td><td style={{ padding: '8px 0' }}>{formData.askingPrice ? `$${formData.askingPrice.toLocaleString()}` : 'N/A'}</td></tr>
                <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Listed on MLS:</td><td style={{ padding: '8px 0' }}>{formData.isListedOnMLS || 'N/A'}</td></tr>
                <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Mortgage Balance:</td><td style={{ padding: '8px 0' }}>{formData.mortgageBalance ? `$${formData.mortgageBalance.toLocaleString()}` : 'Free & Clear'}</td></tr>
                <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Back Taxes Owed:</td><td style={{ padding: '8px 0' }}>{formData.backTaxesOwed ? `$${formData.backTaxesOwed.toLocaleString()}` : 'None'}</td></tr>
                <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>PACE / HERO:</td><td style={{ padding: '8px 0' }}>{formData.paceHeroLoanBalance ? `$${formData.paceHeroLoanBalance.toLocaleString()}` : 'None'}</td></tr>
                <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Access Method:</td><td style={{ padding: '8px 0' }}>{formData.accessMethod || 'N/A'}</td></tr>
                <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Access Notes:</td><td style={{ padding: '8px 0' }}>{formData.accessNotes || 'N/A'}</td></tr>
                <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Lot Size:</td><td style={{ padding: '8px 0' }}>{formData.lotSize ? `${formData.lotSize} sqft` : 'N/A'}</td></tr>
              </tbody>
            </table>
          </div>
          {/* Right Col */}
          <div>
            <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: 0 }}>Property Condition</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <tbody>
                {formData.propertyType === 'Multi-Family' ? (
                  <>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold', width: '40%' }}>Building Config:</td><td style={{ padding: '8px 0' }}>{formData.mfBuildingConfig || 'N/A'}</td></tr>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Year Built:</td><td style={{ padding: '8px 0' }}>
                      {formData.mfStructureConsistency === 'Different Ages/Styles' && formData.mfUnitsData?.length > 0
                        ? formData.mfUnitsData.map((u, i) => `${formData.mfBuildingConfig === 'Main House + ADU/Conversion' ? (i===0 ? 'Main' : 'ADU') : `Unit ${String.fromCharCode(65 + i)}`}: ${u.yearBuilt || 'Unk'}`).join(' | ')
                        : (formData.mfYearBuilt || 'N/A')
                      }
                    </td></tr>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Utilities Paid By:</td><td style={{ padding: '8px 0' }}>{formData.mfUtilityMetering || 'N/A'}</td></tr>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Interior Condition:</td><td style={{ padding: '8px 0' }}>{formData.mfInteriorCondition || 'N/A'}</td></tr>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Structure/Risk:</td><td style={{ padding: '8px 0' }}>{formData.highRisk?.length ? formData.highRisk.join(', ') : 'N/A'}</td></tr>
                  </>
                ) : (
                  <>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold', width: '40%' }}>Occupancy:</td><td style={{ padding: '8px 0' }}>{formData.occupancy || 'N/A'}</td></tr>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Windows:</td><td style={{ padding: '8px 0' }}>{formData.sfWindows || 'N/A'}</td></tr>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Exterior:</td><td style={{ padding: '8px 0' }}>{formData.sfExterior || 'N/A'}</td></tr>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Roof Condition:</td><td style={{ padding: '8px 0' }}>{formData.sfRoof || 'N/A'}</td></tr>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>HVAC Status:</td><td style={{ padding: '8px 0' }}>{formData.sfHVAC || 'N/A'}</td></tr>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Plumbing:</td><td style={{ padding: '8px 0' }}>{formData.sfPlumbing || 'N/A'}</td></tr>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Electrical:</td><td style={{ padding: '8px 0' }}>{formData.sfElectrical || 'N/A'}</td></tr>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Cosmetics:</td><td style={{ padding: '8px 0' }}>{formData.sfCosmetics || 'N/A'}</td></tr>
                    <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Structural Flags:</td><td style={{ padding: '8px 0', color: formData.sfStructuralFlags ? '#ef4444' : 'inherit' }}>{formData.sfStructuralFlags || 'None'}</td></tr>
                    {formData.secondaryLiabilities?.length > 0 && (
                      <tr>
                        <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Liabilities:</td>
                        <td style={{ padding: '8px 0', color: '#ef4444', fontWeight: 'bold' }}>
                          {formData.secondaryLiabilities.join(', ')}
                          {formData.secondaryLiabilities.includes('Active HOA') && formData.hoaMonthlyFee ? ` ($${formData.hoaMonthlyFee}/mo)` : ''}
                          {formData.secondaryLiabilities.includes('Solar (Leased)') && formData.solarMonthlyPayment ? ` (Solar: $${formData.solarMonthlyPayment}/mo)` : ''}
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Narrative / Context */}
        <div style={{ marginBottom: '30px', background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#334155' }}>Rep's General Assessment</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: '#475569' }}>
            {formData.notes || 'No additional notes provided by the representative during the intake call.'}
          </p>
        </div>

        {/* Contingencies Warning block */}
        {contingencies.length > 0 && (
          <div style={{ marginBottom: '30px', borderLeft: '4px solid #ef4444', paddingLeft: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#ef4444', textTransform: 'uppercase' }}>Automated Contingencies</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#b91c1c', fontSize: '0.95rem', fontWeight: 'bold' }}>
              {contingencies.map((c, i) => (
                <li key={i} style={{ marginBottom: '6px' }}>{c}</li>
              ))}
            </ul>
          </div>
        )}

      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-tear-sheet, .printable-tear-sheet * { visibility: visible; }
          .printable-tear-sheet {
            position: absolute;
            left: 0;
            top: 0;
            box-shadow: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

    </div>
  );
}
