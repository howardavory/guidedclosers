'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Download, Plus, MoreHorizontal, Database, Map } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

// A simple editable cell component that saves on blur
function EditableCell({ value, onSave, placeholder = "-", type = "text" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(value || '');
  const inputRef = useRef(null);

  useEffect(() => {
    setVal(value || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (val !== value) {
      onSave(val);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type={type}
        className="w-full bg-black/50 border border-[var(--brand-primary)] text-white px-2 py-1 rounded text-sm outline-none"
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <div 
      className="cursor-pointer hover:bg-white/10 px-2 py-1 -mx-2 rounded transition-colors text-sm truncate max-w-[200px]"
      onClick={() => setIsEditing(true)}
    >
      {value || <span className="text-gray-600">{placeholder}</span>}
    </div>
  );
}

export default function ContactsLedger() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Batch Select State
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(c => 
    `${c.firstName} ${c.lastName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search)) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredContacts.map(c => c.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Batch Action Handler
  const handleBatchAction = async (actionType) => {
    if (selectedIds.length === 0) return;
    setIsBatchProcessing(true);
    try {
      const res = await fetch('/api/contacts/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionType, contactIds: selectedIds })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Successfully processed ${selectedIds.length} contacts for ${actionType}!`);
        setSelectedIds([]);
        fetchContacts(); // Refresh data
      } else {
        alert(data.error || 'Batch action failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error during batch execution.');
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const updateContactInline = async (id, field, value) => {
    // Optimistic UI update
    setContacts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    try {
      const res = await fetch('/api/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value })
      });
      if (!res.ok) {
        // Revert on failure by refetching
        fetchContacts();
      }
    } catch (err) {
      console.error('Failed to update inline', err);
      fetchContacts();
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto px-6 py-8 hide-scrollbar relative">
      
      {/* Floating Batch Toolbar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-md border border-[var(--brand-primary)] shadow-[0_10px_40px_rgba(212,175,55,0.3)] rounded-full px-6 py-3 flex items-center gap-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="text-[var(--brand-primary)] font-black uppercase tracking-widest text-sm flex items-center gap-2">
            <span className="bg-[var(--brand-primary)]/20 px-2 py-0.5 rounded-full">{selectedIds.length}</span> Selected
          </div>
          <div className="h-6 w-px bg-white/20"></div>
          <div className="flex gap-3">
            <button 
              onClick={() => handleBatchAction('SKIP_TRACE')}
              disabled={isBatchProcessing}
              className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-full font-bold uppercase tracking-widest text-xs transition-colors"
            >
              {isBatchProcessing ? 'Processing...' : <><Map size={14} className="text-[#00E5FF]"/> Batch Skip Trace</>}
            </button>
            <button 
              onClick={() => handleBatchAction('PROPERTY_SYNC')}
              disabled={isBatchProcessing}
              className="flex items-center gap-2 text-black bg-gradient-to-r from-[var(--brand-primary)] to-[#F3E5AB] hover:scale-105 px-4 py-2 rounded-full font-black uppercase tracking-widest text-xs transition-all"
            >
              {isBatchProcessing ? 'Syncing...' : <><Database size={14} /> Batch Property Sync</>}
            </button>
          </div>
        </div>
      )}

      {/* Back Navigation */}
      <div className="mb-4">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--brand-primary)] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          &larr; Back to Command Center
        </Link>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
            Master Ledger <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-xs px-3 py-1 rounded-full">{contacts.length} Total</span>
          </h1>
          <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-widest mt-1">Stewardship & Relationship Management</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs transition-colors">
            <Download size={14} /> Export CSV
          </button>
          <button className="flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs transition-colors shadow-lg">
            <Plus size={14} /> Add Contact
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-t-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center z-10 relative">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="SEARCH BY NAME, PHONE, OR EMAIL..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/50 border border-white/10 text-white pl-10 pr-4 py-2 rounded-lg focus:border-[#D4AF37] outline-none text-xs font-bold uppercase tracking-widest placeholder:text-gray-600"
          />
        </div>
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
          <Filter size={14} /> Advanced Filters
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-black/20 backdrop-blur-sm border-x border-b border-white/10 rounded-b-2xl overflow-x-auto shadow-2xl relative z-0 pb-24">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  checked={selectedIds.length > 0 && selectedIds.length === filteredContacts.length}
                  ref={input => {
                    if (input) input.indeterminate = selectedIds.length > 0 && selectedIds.length < filteredContacts.length;
                  }}
                  onChange={toggleSelectAll}
                  className="accent-[#D4AF37] bg-black border-white/20 rounded cursor-pointer w-4 h-4" 
                />
              </th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Name</th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Address</th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Beds/Baths</th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ARV</th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr><td colSpan="8" className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">Loading Ledger...</td></tr>
            ) : filteredContacts.length === 0 ? (
              <tr><td colSpan="8" className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">No Contacts Found</td></tr>
            ) : (
              filteredContacts.map(contact => {
                const primaryProperty = contact.leads?.[0]?.property;
                
                return (
                  <tr key={contact.id} className={clsx(
                    "border-b border-white/5 hover:bg-white/5 transition-colors group",
                    selectedIds.includes(contact.id) && "bg-[var(--brand-primary)]/5"
                  )}>
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(contact.id)}
                        onChange={() => toggleSelectOne(contact.id)}
                        className="accent-[#D4AF37] bg-black border-white/20 rounded cursor-pointer w-4 h-4" 
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <EditableCell 
                          value={contact.firstName} 
                          onSave={(val) => updateContactInline(contact.id, 'firstName', val)} 
                          placeholder="First Name" 
                        />
                        <EditableCell 
                          value={contact.lastName} 
                          onSave={(val) => updateContactInline(contact.id, 'lastName', val)} 
                          placeholder="Last Name" 
                        />
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      <EditableCell 
                        value={contact.phone} 
                        onSave={(val) => updateContactInline(contact.id, 'phone', val)} 
                        placeholder="Phone" 
                      />
                    </td>
                    <td className="p-4 text-gray-300">
                      <EditableCell 
                        value={contact.email} 
                        onSave={(val) => updateContactInline(contact.id, 'email', val)} 
                        placeholder="Email" 
                      />
                    </td>
                    <td className="p-4 text-gray-400 text-xs">
                      {primaryProperty?.address || 'No Address Logged'}
                    </td>
                    <td className="p-4 text-gray-400 text-xs">
                      {primaryProperty ? `${primaryProperty.beds || '-'} / ${primaryProperty.baths || '-'}` : '-'}
                    </td>
                    <td className="p-4 text-gray-400 text-xs font-bold text-[#D4AF37]">
                      {primaryProperty?.arv ? `$${primaryProperty.arv.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/dashboard/contacts/${contact.id}`} className="text-gray-500 hover:text-[#D4AF37] transition-colors p-1 inline-block">
                        <MoreHorizontal size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
