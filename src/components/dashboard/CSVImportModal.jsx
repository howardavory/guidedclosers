'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { X, Upload, Check, Loader2 } from 'lucide-react';

const PRISMA_FIELDS = [
  { id: 'sellerName', label: 'Seller Name (Required)' },
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
  { id: 'motivationScore', label: 'Motivation Score (1-10)' },
  { id: 'notes', label: 'Notes' },
  { id: 'address', label: 'Property Address (Required)' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'zip', label: 'Zip' },
  { id: 'arv', label: 'ARV' },
  { id: 'askingPrice', label: 'Asking Price' },
];

export default function CSVImportModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [mapping, setMapping] = useState({}); // { csvHeader: prismaField }
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded) {
      setFile(uploaded);
      Papa.parse(uploaded, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvHeaders(results.meta.fields);
          setCsvData(results.data);
          
          // Auto-map where possible
          const initialMapping = {};
          results.meta.fields.forEach(header => {
            const lower = header.toLowerCase();
            const matched = PRISMA_FIELDS.find(f => lower.includes(f.id.toLowerCase()));
            if (matched) initialMapping[header] = matched.id;
          });
          setMapping(initialMapping);
          setStep(2);
        }
      });
    }
  };

  const handleMapChange = (csvHeader, targetField) => {
    setMapping(prev => ({
      ...prev,
      [csvHeader]: targetField
    }));
  };

  const handleImport = async () => {
    setLoading(true);
    
    // Transform data according to mapping
    const payload = csvData.map(row => {
      const lead = { status: 'NEW' };
      Object.keys(mapping).forEach(csvHeader => {
        const targetField = mapping[csvHeader];
        if (targetField && row[csvHeader]) {
          lead[targetField] = row[csvHeader];
        }
      });
      return lead;
    }).filter(lead => lead.sellerName && lead.address); // Enforce required fields

    if (payload.length === 0) {
      alert("No valid rows found. Ensure 'Seller Name' and 'Property Address' are mapped.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/leads/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: payload })
      });
      
      if (res.ok) {
        setStep(3);
      } else {
        alert("Failed to import leads");
      }
    } catch (err) {
      console.error(err);
      alert("Error executing bulk import");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
        
        <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)] bg-black/30">
          <div>
            <h2 className="text-white font-black uppercase tracking-widest text-xl">Bulk CSV Import</h2>
            <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest mt-1">Mass Database Provisioning</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          {step === 1 && (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 rounded-2xl hover:border-[#D4AF37] transition-colors relative cursor-pointer">
              <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload size={48} className="text-[#D4AF37] mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
              <h3 className="text-white font-bold text-lg">Click or drag CSV to upload</h3>
              <p className="text-gray-400 text-sm mt-2">Only .csv files are supported</p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                <p className="text-blue-400 text-sm font-semibold">{csvData.length} rows detected. Map your CSV columns to the database fields below.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-[var(--card-border)] pb-2">
                <div>CSV Header</div>
                <div>Database Field</div>
              </div>

              <div className="space-y-3">
                {csvHeaders.map(header => (
                  <div key={header} className="grid grid-cols-2 gap-4 items-center">
                    <div className="bg-black border border-[var(--card-border)] p-3 rounded-lg text-white font-medium truncate">
                      {header}
                    </div>
                    <div>
                      <select 
                        value={mapping[header] || ''} 
                        onChange={(e) => handleMapChange(header, e.target.value)}
                        className="w-full bg-[var(--bg-base)] border border-[var(--card-border)] text-white p-3 rounded-lg outline-none focus:border-[#D4AF37] transition-colors"
                      >
                        <option value="">-- Ignore Column --</option>
                        {PRISMA_FIELDS.map(f => (
                          <option key={f.id} value={f.id}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6 border-t border-[var(--card-border)] gap-4">
                <button onClick={() => setStep(1)} className="px-6 py-3 font-bold text-gray-400 uppercase tracking-widest text-xs hover:text-white transition-colors">Back</button>
                <button onClick={handleImport} disabled={loading} className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#F3E5AB] transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Import Data
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <Check size={40} />
              </div>
              <h2 className="text-white text-2xl font-black uppercase tracking-wide mb-2">Import Complete</h2>
              <p className="text-gray-400 mb-8">Successfully provisioned leads and properties into the wholesale CRM.</p>
              <button onClick={onClose} className="bg-white/10 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-xl hover:bg-white/20 transition-colors">
                Return to Pipeline
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
