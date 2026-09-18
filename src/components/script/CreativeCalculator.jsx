import React, { useState } from 'react';
import { PiggyBank, Receipt, Key, DollarSign } from 'lucide-react';

export default function CreativeCalculator() {
  const [arv, setArv] = useState(300000);
  const [mortgageBalance, setMortgageBalance] = useState(200000);
  const [piti, setPiti] = useState(1500);
  const [estRent, setEstRent] = useState(2000);
  
  const [cashToSeller, setCashToSeller] = useState(10000);
  const [arrears, setArrears] = useState(0);
  const [repairs, setRepairs] = useState(15000);
  const [closingCosts, setClosingCosts] = useState(3000);
  const [assignmentFee, setAssignmentFee] = useState(10000);
  
  const totalEntryFee = cashToSeller + arrears + repairs + closingCosts + assignmentFee;
  const entryFeePercentage = arv > 0 ? ((totalEntryFee / arv) * 100).toFixed(1) : 0;
  const monthlyCashFlow = estRent - piti;

  const isGoodEntry = entryFeePercentage <= 20;
  const isGoodCashFlow = monthlyCashFlow >= 250;
  
  const isStrongDeal = isGoodEntry && isGoodCashFlow;
  const isDeadDeal = entryFeePercentage > 25 || monthlyCashFlow <= 100;

  return (
    <div className="calc-card" style={{ 
      backdropFilter: 'blur(30px)', 
      border: isStrongDeal ? '1px solid rgba(16, 185, 129, 0.4)' : (isDeadDeal ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-subtle)'), 
      borderRadius: '20px', 
      padding: '1.5rem', 
      boxShadow: isStrongDeal ? '0 0 40px rgba(16, 185, 129, 0.15)' : (isDeadDeal ? '0 0 40px rgba(239, 68, 68, 0.15)' : 'var(--spatial-shadow)'), 
      position: 'relative', 
      overflow: 'visible',
      transition: 'all 0.4s ease'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: isStrongDeal ? 'linear-gradient(90deg, #10b981, #059669)' : (isDeadDeal ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 'linear-gradient(90deg, #8b5cf6, #3b82f6)') }}></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '8px', borderRadius: '50%' }}>
          <PiggyBank size={20} color="var(--accent-primary)" />
        </div>
        <h4 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.1rem', fontWeight: '700' }}>Wholesale Creative Calc</h4>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Market Numbers */}
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>ARV (Est. Value):</span>
          <div className="smart-input-container">
            <DollarSign size={14} className="smart-input-icon" />
            <input type="number" value={arv} onChange={(e) => setArv(Number(e.target.value))} className="smart-input" />
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Existing Mtg Balance:</span>
          <div className="smart-input-container">
            <DollarSign size={14} className="smart-input-icon" />
            <input type="number" value={mortgageBalance} onChange={(e) => setMortgageBalance(Number(e.target.value))} className="smart-input" />
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Current PITI / Mo:</span>
          <div className="smart-input-container">
            <DollarSign size={14} className="smart-input-icon" />
            <input type="number" value={piti} onChange={(e) => setPiti(Number(e.target.value))} className="smart-input" />
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Est. Market Rent:</span>
          <div className="smart-input-container">
            <DollarSign size={14} className="smart-input-icon" />
            <input type="number" value={estRent} onChange={(e) => setEstRent(Number(e.target.value))} className="smart-input" />
          </div>
        </div>
      </div>

      <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-dark)', fontSize: '0.9rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', fontWeight: '600' }}>The Entry Fee (Cash from Buyer)</h5>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Cash to Seller:</span>
          <div className="smart-input-container">
            <DollarSign size={14} className="smart-input-icon" />
            <input type="number" value={cashToSeller} onChange={(e) => setCashToSeller(Number(e.target.value))} className="smart-input" />
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Arrears (Behind):</span>
          <div className="smart-input-container">
            <DollarSign size={14} className="smart-input-icon" />
            <input type="number" value={arrears} onChange={(e) => setArrears(Number(e.target.value))} className="smart-input" />
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Est. Repairs:</span>
          <div className="smart-input-container">
            <DollarSign size={14} className="smart-input-icon" />
            <input type="number" value={repairs} onChange={(e) => setRepairs(Number(e.target.value))} className="smart-input" />
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: '500', marginBottom: '6px', display: 'block' }}>Closing Costs:</span>
          <div className="smart-input-container">
            <DollarSign size={14} className="smart-input-icon" />
            <input type="number" value={closingCosts} onChange={(e) => setClosingCosts(Number(e.target.value))} className="smart-input" />
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '700', marginBottom: '6px', display: 'block' }}>Your Assignment Fee:</span>
          <div className="smart-input-container">
            <DollarSign size={14} className="smart-input-icon" />
            <input type="number" value={assignmentFee} onChange={(e) => setAssignmentFee(Number(e.target.value))} className="smart-input" style={{ borderColor: 'var(--accent-primary)', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.15)', fontSize: '1.2rem', color: 'var(--accent-primary)' }} />
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.4)', padding: '1.5rem', borderRadius: '0px', border: '1px solid var(--border-subtle)' }}>
        <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-dark)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
          <Receipt size={18} color="var(--text-dark)" /> The Buyer Pitch
        </h5>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>Total Entry Fee:</span>
          <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-dark)' }}>${totalEntryFee.toLocaleString()}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>Entry Fee vs ARV:</span>
          <span style={{ 
            fontWeight: '600', 
            padding: '4px 10px', 
            borderRadius: '8px', 
            background: isGoodEntry ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            color: isGoodEntry ? '#16a34a' : '#d97706' 
          }}>
            {entryFeePercentage}% {isGoodEntry ? '(Strong)' : '(High)'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-dark)', fontSize: '1rem', fontWeight: '700' }}>Est. Monthly Cash Flow:</span>
          <span style={{ 
            fontSize: '2.5rem', 
            fontWeight: '900', 
            background: isGoodCashFlow ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: isGoodCashFlow ? 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))' : 'drop-shadow(0 4px 8px rgba(245, 158, 11, 0.3))'
          }}>
            ${monthlyCashFlow.toLocaleString()}/mo
          </span>
        </div>
      </div>
    </div>
  );
}
