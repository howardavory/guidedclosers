'use client';

import React, { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { User, Building, Users, Link2, Shield, Bell, Camera, Save, ArrowLeft, Smartphone, Monitor, Globe, Mail, X, Activity, MessageSquare, Database, Server, Map, Phone, PhoneCall, DollarSign } from 'lucide-react';
import clsx from 'clsx';

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, currentCompany, setCurrentUser, setCurrentCompany, theme, setTheme } = useStore();

  const role = currentUser?.role || 'Setter';
  const isExecutive = ['ADMIN', 'MANAGER'].includes(role?.toUpperCase());
  const [activeTab, setActiveTab] = useState('profile');

  // Local state for forms
  const [profileData, setProfileData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    avatarUrl: currentUser?.avatarUrl || '',
    role: currentUser?.role || 'Setter',
  });

  const [securityData, setSecurityData] = useState({
    twoFactor: false
  });

  // HYDRATION SYNC
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        avatarUrl: currentUser.avatarUrl || '',
        role: currentUser.role || 'Setter',
      });
    }
  }, [currentUser]);

  const [workspaceData, setWorkspaceData] = useState({
    name: currentCompany?.name || '',
    legalName: currentCompany?.legalName || '',
    brandColor: currentCompany?.brandColor || '#D4AF37',
    secondaryBrandColor: currentCompany?.secondaryBrandColor || '#1A1A1A',
    customDomain: '',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: ''
  });
  
  useEffect(() => {
    if (currentCompany) {
      setWorkspaceData({
        name: currentCompany.name || '',
        legalName: currentCompany.legalName || '',
        brandColor: currentCompany.brandColor || '#D4AF37',
        secondaryBrandColor: currentCompany.secondaryBrandColor || '#1A1A1A',
        customDomain: currentCompany.customDomain || '',
        smtpHost: currentCompany.smtpHost || '',
        smtpPort: currentCompany.smtpPort || '',
        smtpUser: currentCompany.smtpUser || '',
        smtpPass: currentCompany.smtpPass || ''
      });
    }
  }, [currentCompany]);

  const [integrationsForm, setIntegrationsForm] = useState({});

  // 1. Fetch integrations on mount
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const res = await fetch('/api/settings/integrations');
        if (res.ok) {
          const data = await res.json();
          setIntegrationsForm(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Failed to load integrations', err);
      }
    };
    if (activeTab === 'integrations' && isExecutive) fetchIntegrations();
  }, [activeTab, isExecutive]);

  const [notificationsData, setNotificationsData] = useState({
    smsAlerts: true,
    contractEmail: true,
    dailyKpi: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    webhookFailures: true,
  });

  // Team permissions modal state
  const [editingMember, setEditingMember] = useState(null);
  const [permissions, setPermissions] = useState({
    exportLeads: false,
    editFinancials: false,
    deleteContacts: false,
    viewBilling: false
  });

  const handleSaveProfile = () => {
    setCurrentUser(profileData);
    alert("Profile Saved to Local Storage!");
  };

  const handleSaveWorkspace = () => {
    setCurrentCompany(workspaceData);
    alert("Workspace White-Label Settings Saved!");
  };

  // 2. The Save Handler
  const handleSaveIntegrations = async () => {
    try {
      const res = await fetch('/api/settings/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(integrationsForm)
      });
      if (res.ok) {
        alert('✅ API Keys successfully encrypted and saved.');
      } else {
        alert('🚨 Failed to save API keys.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving.');
    }
  };
  
  const allTabs = [
    { id: 'profile', label: 'My Profile', icon: User, roles: ['Setter', 'Closer', 'Manager', 'Admin'], group: 'Personal' },
    { id: 'notifications', label: 'Notifications', icon: Bell, roles: ['Setter', 'Closer', 'Manager', 'Admin'], group: 'Personal' },
    { id: 'workspace', label: 'Workspace (White-Label)', icon: Building, roles: ['Manager', 'Admin'], group: 'Enterprise' },
    { id: 'team', label: 'Team & Roles', icon: Users, roles: ['Manager', 'Admin'], group: 'Enterprise' },
    { id: 'integrations', label: 'API Integrations', icon: Link2, roles: ['Manager', 'Admin'], group: 'Enterprise' },
    { id: 'billing', label: 'Billing & Security', icon: Shield, roles: ['Manager', 'Admin'], group: 'Enterprise' }
  ];

  const visibleTabs = allTabs.filter(tab => tab.roles.map(r => r.toUpperCase()).includes(role?.toUpperCase()));

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-base)] p-6 lg:p-10 overflow-hidden relative">
      
      {/* Settings Header with Escape Hatch */}
      <div className="mb-8 shrink-0 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <button 
              onClick={() => router.push('/dashboard')}
              className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] text-[var(--text-muted)] rounded-lg transition-all group"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <h1 className="text-3xl font-black text-[#FFFFFF] tracking-widest uppercase">System Settings</h1>
          </div>
          <p className="text-[var(--text-muted)] text-sm font-bold tracking-wider ml-[52px]">
            {isExecutive ? `Managing Workspace: ${currentCompany?.name || 'Loading...'}` : `Managing Profile: ${currentUser?.firstName || 'User'}`}
          </p>
        </div>
      </div>

      {/* Main Settings Grid: Left Nav + Right Content */}
      <div className="flex flex-1 min-h-0 bg-[var(--card-bg)] border border-[var(--brand-secondary)] rounded-2xl overflow-hidden shadow-2xl relative">
        
        {/* Left Vertical Navigation */}
        <div className="w-64 border-r border-[var(--brand-secondary)] bg-[var(--card-bg)]/50 flex flex-col p-4 overflow-y-auto hide-scrollbar shrink-0">
          
          <div className="mb-6">
            <h3 className="text-[#555555] font-black text-[10px] uppercase tracking-[0.2em] mb-3 px-3">Personal Settings</h3>
            <div className="flex flex-col gap-1">
              {visibleTabs.filter(t => t.group === 'Personal').map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all w-full text-left",
                    activeTab === tab.id 
                      ? "bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/30 shadow-[0_0_15px_rgba(229,193,88,0.15)]" 
                      : "text-[var(--text-muted)] hover:bg-[var(--card-bg)] shadow-sm hover:text-[#CCCCCC]"
                  )}
                >
                  <tab.icon size={16} className={activeTab === tab.id ? "text-[var(--brand-primary)]" : "text-[#666666]"} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {visibleTabs.filter(t => t.group === 'Enterprise').length > 0 && (
            <div>
              <h3 className="text-[#555555] font-black text-[10px] uppercase tracking-[0.2em] mb-3 px-3">Admin Workspace</h3>
              <div className="flex flex-col gap-1">
                {visibleTabs.filter(t => t.group === 'Enterprise').map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all w-full text-left",
                      activeTab === tab.id 
                        ? "bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/30 shadow-[0_0_15px_rgba(229,193,88,0.15)]" 
                        : "text-[var(--text-muted)] hover:bg-[var(--card-bg)] shadow-sm hover:text-[#CCCCCC]"
                    )}
                  >
                    <tab.icon size={16} className={activeTab === tab.id ? "text-[var(--brand-primary)]" : "text-[#666666]"} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content Pane */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          
          {/* ===================== MY PROFILE ===================== */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in text-[var(--text-base)] max-w-3xl">
              
              <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4 mb-8">
                <h2 className="text-xl font-black tracking-widest text-[var(--brand-primary)] uppercase">My Profile</h2>
                <button onClick={handleSaveProfile} className="bg-[var(--card-bg)] hover:bg-[var(--brand-primary)] hover:text-black text-[var(--brand-primary)] border border-[var(--brand-primary)]/50 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2">
                  <Save size={14} /> Save Profile
                </button>
              </div>

              {/* Personal Details */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-8">
                <h3 className="text-[#FFFFFF] font-black text-[11px] tracking-widest uppercase mb-5 flex items-center gap-2">
                  <User size={14} className="text-[var(--brand-primary)]" /> Personal Details
                </h3>

                <div className="flex flex-wrap items-center gap-8 mb-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full flex items-center justify-center overflow-hidden">
                        {profileData.avatarUrl ? (
                          <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User size={24} className="text-[#555555]" />
                        )}
                      </div>
                      <button className="bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--brand-primary)] text-[var(--text-base)] px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                        <Camera size={12} /> Upload Image
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Authorization Role</label>
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-2 inline-flex items-center text-sm font-bold text-[var(--text-muted)]">
                      {profileData.role || 'Setter'}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">First Name</label>
                    <input type="text" value={profileData.firstName || ''} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} placeholder="First Name" className="bg-[var(--card-bg)]/80 border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Last Name</label>
                    <input type="text" value={profileData.lastName || ''} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} placeholder="Last Name" className="bg-[var(--card-bg)]/80 border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Email Address</label>
                    <input type="email" value={profileData.email || ''} onChange={(e) => setProfileData({...profileData, email: e.target.value})} placeholder="Email" className="bg-[var(--card-bg)]/80 border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Phone Number</label>
                    <input type="tel" value={profileData.phone || ''} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} placeholder="(555) 000-0000" className="bg-[var(--card-bg)]/80 border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors" />
                  </div>
                </div>
              </div>

              {/* Security & Authentication */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-8">
                <h3 className="text-[#FFFFFF] font-black text-[11px] tracking-widest uppercase mb-5 flex items-center gap-2">
                  <Shield size={14} className="text-[var(--brand-primary)]" /> Security & Authentication
                </h3>

                <div className="flex items-center justify-between p-4 bg-[var(--bg-base)] border border-[var(--card-border)] rounded-lg mb-6">
                  <div>
                    <h4 className="text-[var(--text-base)] font-bold text-sm">Two-Factor Authentication (2FA)</h4>
                    <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest mt-1">Require an extra security step when logging in</p>
                  </div>
                  <div onClick={() => setSecurityData(prev => ({...prev, twoFactor: !prev.twoFactor}))} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${securityData.twoFactor ? 'bg-[var(--brand-primary)]' : 'bg-[var(--card-border)]'}`}>
                    <div className={`w-4 h-4 rounded-full transition-transform ${securityData.twoFactor ? 'bg-black translate-x-6' : 'bg-[var(--bg-base)] translate-x-0'}`}></div>
                  </div>
                </div>

                <div className="border border-[var(--card-border)] rounded-lg overflow-hidden bg-[var(--bg-base)]">
                  <div className="p-4 border-b border-[var(--card-border)] flex items-center justify-between">
                    <h4 className="text-[var(--text-base)] font-bold text-xs uppercase tracking-widest">Active Sessions</h4>
                    <button className="text-[#FF4444] text-[10px] font-bold uppercase tracking-widest hover:underline">Revoke All Other Sessions</button>
                  </div>
                  
                  <div className="p-4 flex items-center justify-between border-b border-[var(--card-border)]">
                    <div className="flex items-center gap-3">
                      <Monitor size={16} className="text-[var(--brand-primary)]" />
                      <div>
                        <p className="text-[var(--text-base)] text-sm font-bold">Mac OS • Chrome</p>
                        <p className="text-[var(--text-muted)] text-xs">Bakersfield, CA (192.168.1.42)</p>
                      </div>
                    </div>
                    <span className="text-[#00E676] text-[10px] font-bold uppercase tracking-wider bg-[#00E676]/10 px-2 py-1 rounded border border-[#00E676]/20">Current</span>
                  </div>

                  <div className="p-4 flex items-center justify-between opacity-70">
                    <div className="flex items-center gap-3">
                      <Smartphone size={16} className="text-[var(--text-muted)]" />
                      <div>
                        <p className="text-[var(--text-base)] text-sm font-bold">iOS • Safari</p>
                        <p className="text-[var(--text-muted)] text-xs">Los Angeles, CA (10.0.0.12)</p>
                      </div>
                    </div>
                    <button className="text-[var(--text-muted)] hover:text-[#FF4444] text-[10px] font-bold uppercase tracking-wider transition-colors">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== NOTIFICATIONS ===================== */}
          {activeTab === 'notifications' && (
            <div className="animate-fade-in text-[var(--text-base)] max-w-3xl">
              <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4 mb-8">
                <h2 className="text-xl font-black tracking-widest text-[var(--brand-primary)] uppercase">Notifications</h2>
                <button className="bg-[var(--card-bg)] hover:bg-[var(--brand-primary)] hover:text-black text-[var(--brand-primary)] border border-[var(--brand-primary)]/50 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2">
                  <Save size={14} /> Save Preferences
                </button>
              </div>

              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-8">
                 <h3 className="text-[var(--text-base)] font-black text-[11px] tracking-widest uppercase mb-5 flex items-center gap-2">
                  <Bell size={14} className="text-[var(--brand-primary)]" /> Alert Settings
                </h3>
                
                <div className="flex flex-col gap-4">
                  {/* SMS Alert */}
                  <div className="flex items-center justify-between p-4 bg-[var(--card-bg)]/50 border border-[var(--card-border)] rounded-lg hover:border-[var(--brand-primary)]/30 transition-colors">
                    <div>
                      <h4 className="text-[var(--text-base)] font-bold text-sm">New Lead SMS Alerts</h4>
                      <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest mt-1">Instant text when a high-intent lead drops</p>
                    </div>
                    <div onClick={() => setNotificationsData(prev => ({...prev, smsAlerts: !prev.smsAlerts}))} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notificationsData.smsAlerts ? 'bg-[var(--brand-primary)]' : 'bg-[var(--card-border)]'}`}>
                      <div className={`w-4 h-4 rounded-full transition-transform ${notificationsData.smsAlerts ? 'bg-black translate-x-6' : 'bg-[var(--bg-base)] translate-x-0'}`}></div>
                    </div>
                  </div>

                  {/* Quiet Hours */}
                  {notificationsData.smsAlerts && (
                    <div className="p-4 bg-[var(--bg-base)] border border-[var(--card-border)] rounded-lg flex flex-col gap-3">
                       <h4 className="text-[var(--text-base)] font-bold text-sm">Quiet Hours (SMS)</h4>
                       <div className="flex items-center gap-4">
                         <div className="flex flex-col gap-1">
                           <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Start Time</label>
                           <input type="time" value={notificationsData.quietHoursStart} onChange={(e) => setNotificationsData({...notificationsData, quietHoursStart: e.target.value})} className="bg-[var(--card-bg)] border border-[var(--brand-secondary)] rounded-lg p-2 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors" />
                         </div>
                         <div className="flex flex-col gap-1">
                           <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">End Time</label>
                           <input type="time" value={notificationsData.quietHoursEnd} onChange={(e) => setNotificationsData({...notificationsData, quietHoursEnd: e.target.value})} className="bg-[var(--card-bg)] border border-[var(--brand-secondary)] rounded-lg p-2 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors" />
                         </div>
                       </div>
                    </div>
                  )}

                  {/* Contract Signed Email */}
                  <div className="flex items-center justify-between p-4 bg-[var(--card-bg)]/50 border border-[var(--card-border)] rounded-lg hover:border-[var(--brand-primary)]/30 transition-colors">
                    <div>
                      <h4 className="text-[var(--text-base)] font-bold text-sm">Contract Signed Email</h4>
                      <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest mt-1">Receive PDF copies when DocuSign completes</p>
                    </div>
                    <div onClick={() => setNotificationsData(prev => ({...prev, contractEmail: !prev.contractEmail}))} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notificationsData.contractEmail ? 'bg-[var(--brand-primary)]' : 'bg-[var(--card-border)]'}`}>
                      <div className={`w-4 h-4 rounded-full transition-transform ${notificationsData.contractEmail ? 'bg-black translate-x-6' : 'bg-[var(--bg-base)] translate-x-0'}`}></div>
                    </div>
                  </div>

                  {/* Webhook Failure Alerts */}
                  <div className="flex items-center justify-between p-4 bg-[var(--card-bg)]/50 border border-[var(--card-border)] rounded-lg hover:border-[var(--brand-primary)]/30 transition-colors">
                    <div>
                      <h4 className="text-[var(--text-base)] font-bold text-sm">Webhook Failure Alerts</h4>
                      <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest mt-1">Get notified immediately if an API sync fails</p>
                    </div>
                    <div onClick={() => setNotificationsData(prev => ({...prev, webhookFailures: !prev.webhookFailures}))} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notificationsData.webhookFailures ? 'bg-[#FF4444]' : 'bg-[var(--card-border)]'}`}>
                      <div className={`w-4 h-4 rounded-full transition-transform ${notificationsData.webhookFailures ? 'bg-black translate-x-6' : 'bg-[var(--bg-base)] translate-x-0'}`}></div>
                    </div>
                  </div>

                  {/* Daily KPI Summary */}
                  <div className="flex items-center justify-between p-4 bg-[var(--card-bg)]/50 border border-[var(--card-border)] rounded-lg hover:border-[var(--brand-primary)]/30 transition-colors">
                    <div>
                      <h4 className="text-[var(--text-base)] font-bold text-sm">Daily KPI Summary</h4>
                      <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest mt-1">End of day performance digest</p>
                    </div>
                    <div onClick={() => setNotificationsData(prev => ({...prev, dailyKpi: !prev.dailyKpi}))} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notificationsData.dailyKpi ? 'bg-[var(--brand-primary)]' : 'bg-[var(--card-border)]'}`}>
                      <div className={`w-4 h-4 rounded-full transition-transform ${notificationsData.dailyKpi ? 'bg-black translate-x-6' : 'bg-[var(--bg-base)] translate-x-0'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== WORKSPACE ===================== */}
          {activeTab === 'workspace' && isExecutive && (
            <div className="animate-fade-in text-[var(--text-base)] max-w-3xl">
              
              <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4 mb-8">
                <h2 className="text-xl font-black tracking-widest text-[var(--brand-primary)] uppercase">Workspace White-Labeling</h2>
                <button onClick={handleSaveWorkspace} className="bg-[var(--card-bg)] hover:bg-[var(--brand-primary)] hover:text-black text-[var(--brand-primary)] border border-[var(--brand-primary)]/50 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2">
                  <Save size={14} /> Save Workspace
                </button>
              </div>

              {/* Brand Identity */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-8">
                <h3 className="text-[#FFFFFF] font-black text-[11px] tracking-widest uppercase mb-5 flex items-center gap-2">
                  <Building size={14} className="text-[var(--brand-primary)]" /> Company Identity
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Display Name</label>
                    <input type="text" value={workspaceData.name || ''} onChange={(e) => setWorkspaceData({...workspaceData, name: e.target.value})} placeholder="Acme REI" className="bg-[var(--card-bg)]/80 border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Legal Entity Name</label>
                    <input type="text" value={workspaceData.legalName || ''} onChange={(e) => setWorkspaceData({...workspaceData, legalName: e.target.value})} placeholder="Acme Real Estate Investments LLC" className="bg-[var(--card-bg)]/80 border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Workspace Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg flex items-center justify-center overflow-hidden">
                        {workspaceData.logoUrl ? (
                          <img src={workspaceData.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                          <Building size={24} className="text-[#555555]" />
                        )}
                      </div>
                      <button className="bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--brand-primary)] text-[var(--text-base)] px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all">
                        Upload PNG
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Primary Brand Color</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg border border-[var(--card-border)]" style={{ backgroundColor: workspaceData.brandColor }}></div>
                      <input 
                        type="text" 
                        value={workspaceData.brandColor} 
                        onChange={(e) => setWorkspaceData({ ...workspaceData, brandColor: e.target.value })}
                        className="bg-[var(--card-bg)]/80 border border-[var(--brand-secondary)] rounded-lg p-2 text-[var(--text-base)] text-xs font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors w-28 text-center uppercase tracking-widest font-mono" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Secondary Accent Color</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg border border-[var(--card-border)]" style={{ backgroundColor: workspaceData.secondaryBrandColor || '#1A1A1A' }}></div>
                      <input 
                        type="text" 
                        value={workspaceData.secondaryBrandColor || '#1A1A1A'} 
                        onChange={(e) => setWorkspaceData({ ...workspaceData, secondaryBrandColor: e.target.value })}
                        className="bg-[var(--card-bg)]/80 border border-[var(--brand-secondary)] rounded-lg p-2 text-[var(--text-base)] text-xs font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors w-28 text-center uppercase tracking-widest font-mono" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Mode Selector */}
              <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)] mb-8">
                <h3 className="text-[var(--text-base)] font-black text-[11px] tracking-widest uppercase mb-4">Interface Theme Mode</h3>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${theme === 'dark' ? 'bg-[var(--brand-primary)] text-black border-[var(--brand-primary)]' : 'bg-transparent text-[var(--text-muted)] border-[var(--card-border)]'}`}
                  >
                    Dark Aesthetic (Default)
                  </button>
                  <button 
                    onClick={() => setTheme('light')}
                    className={`px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${theme === 'light' ? 'bg-[var(--brand-primary)] text-black border-[var(--brand-primary)]' : 'bg-transparent text-[var(--text-muted)] border-[var(--card-border)]'}`}
                  >
                    Light Mode
                  </button>
                </div>
              </div>

              {/* Domain & Email Branding */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-8">
                <h3 className="text-[#FFFFFF] font-black text-[11px] tracking-widest uppercase mb-5 flex items-center gap-2">
                  <Globe size={14} className="text-[var(--brand-primary)]" /> Domain & Email Branding
                </h3>

                <div className="mb-6 flex flex-col gap-2">
                  <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Custom Domain (CNAME)</label>
                  <div className="flex gap-4 items-center">
                    <input type="text" value={workspaceData.customDomain || ''} onChange={(e) => setWorkspaceData({...workspaceData, customDomain: e.target.value})} placeholder="app.yourdomain.com" className="bg-[var(--card-bg)]/80 border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors w-full max-w-md font-mono" />
                    <button className="bg-[var(--bg-base)] border border-[var(--card-border)] hover:border-[var(--brand-primary)] text-[var(--text-base)] px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">Verify</button>
                  </div>
                </div>

                <div className="border-t border-[var(--card-border)] pt-6">
                  <h4 className="text-[var(--text-base)] font-black text-[11px] tracking-widest uppercase mb-4 flex items-center gap-2">
                    <Mail size={14} className="text-[#555555]" /> Custom SMTP Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">SMTP Host</label>
                      <input type="text" value={workspaceData.smtpHost || ''} onChange={(e) => setWorkspaceData({...workspaceData, smtpHost: e.target.value})} placeholder="smtp.sendgrid.net" className="bg-[var(--card-bg)]/80 border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">SMTP Port</label>
                      <input type="text" value={workspaceData.smtpPort || ''} onChange={(e) => setWorkspaceData({...workspaceData, smtpPort: e.target.value})} placeholder="587" className="bg-[var(--card-bg)]/80 border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">SMTP Username</label>
                      <input type="text" value={workspaceData.smtpUser || ''} onChange={(e) => setWorkspaceData({...workspaceData, smtpUser: e.target.value})} placeholder="apikey" className="bg-[var(--card-bg)]/80 border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">SMTP Password</label>
                      <input type="password" value={workspaceData.smtpPass || ''} onChange={(e) => setWorkspaceData({...workspaceData, smtpPass: e.target.value})} placeholder="••••••••••••••••" className="bg-[var(--card-bg)]/80 border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ===================== TEAM & ROLES ===================== */}
          {activeTab === 'team' && isExecutive && (
            <div className="animate-fade-in text-[var(--text-base)] max-w-4xl relative">
              
              <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4 mb-8">
                <div>
                  <h2 className="text-xl font-black tracking-widest text-[var(--brand-primary)] uppercase">Team & Roles</h2>
                  <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest mt-1">Manage workspace access and authorization levels</p>
                </div>
                <button className="bg-[var(--card-bg)] hover:bg-[var(--brand-primary)] hover:text-black text-[var(--brand-primary)] border border-[var(--brand-primary)]/50 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2">
                  <Users size={14} /> Invite Member
                </button>
              </div>

              {/* Active Roster Table */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 rounded-xl border border-[var(--brand-secondary)] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-base)] border-b border-[var(--card-border)]">
                      <th className="p-4 text-[#555555] font-black text-[10px] uppercase tracking-widest">Team Member</th>
                      <th className="p-4 text-[#555555] font-black text-[10px] uppercase tracking-widest">Role</th>
                      <th className="p-4 text-[#555555] font-black text-[10px] uppercase tracking-widest">Status</th>
                      <th className="p-4 text-[#555555] font-black text-[10px] uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--brand-secondary)] hover:bg-[var(--bg-base)]/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/20 border border-[var(--brand-primary)] flex items-center justify-center text-[var(--brand-primary)] font-bold text-xs uppercase">
                            {currentUser?.firstName?.charAt(0) || 'M'}{currentUser?.lastName?.charAt(0) || 'G'}
                          </div>
                          <div>
                            <p className="text-[var(--text-base)] font-bold text-sm">{currentUser?.firstName || 'Workspace'} {currentUser?.lastName || 'Admin'}</p>
                            <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider">{currentUser?.email || 'admin@company.com'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-[var(--card-bg)] border border-[var(--brand-primary)]/50 text-[var(--brand-primary)] text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded">Manager</span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-[#00FF66] text-[10px] font-bold uppercase tracking-wider">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00FF66]"></div> Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-[#555555] text-xs font-bold uppercase tracking-wider cursor-not-allowed">Owner</button>
                      </td>
                    </tr>

                    <tr className="border-b border-[var(--brand-secondary)] hover:bg-[var(--bg-base)]/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#333333] border border-[#444444] flex items-center justify-center text-[var(--text-muted)] font-bold text-xs">
                            CL
                          </div>
                          <div>
                            <p className="text-[var(--text-base)] font-bold text-sm">Caleb Landeros</p>
                            <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider">caleb@centralvalleyrei.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-muted)] text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded">Setter</span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-[#00FF66] text-[10px] font-bold uppercase tracking-wider">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00FF66]"></div> Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => setEditingMember('Caleb Landeros')} className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors text-xs font-bold uppercase tracking-wider">Edit Access</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Edit Permissions Modal overlay */}
              {editingMember && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-[var(--bg-base)] border border-[var(--brand-primary)]/50 rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                    <button onClick={() => setEditingMember(null)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                    <h3 className="text-lg font-black text-[var(--brand-primary)] tracking-widest uppercase mb-1">Edit Permissions</h3>
                    <p className="text-[var(--text-muted)] text-xs font-bold tracking-widest mb-6 uppercase">Target: {editingMember}</p>

                    <div className="flex flex-col gap-4 mb-8">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[var(--text-base)]">Can Export Leads</span>
                        <div onClick={() => setPermissions({...permissions, exportLeads: !permissions.exportLeads})} className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${permissions.exportLeads ? 'bg-[var(--brand-primary)]' : 'bg-[var(--card-border)]'}`}>
                          <div className={`w-3 h-3 rounded-full transition-transform ${permissions.exportLeads ? 'bg-black translate-x-5' : 'bg-[var(--bg-base)] translate-x-0'}`}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[var(--text-base)]">Can Edit Financial Engine</span>
                        <div onClick={() => setPermissions({...permissions, editFinancials: !permissions.editFinancials})} className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${permissions.editFinancials ? 'bg-[var(--brand-primary)]' : 'bg-[var(--card-border)]'}`}>
                          <div className={`w-3 h-3 rounded-full transition-transform ${permissions.editFinancials ? 'bg-black translate-x-5' : 'bg-[var(--bg-base)] translate-x-0'}`}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#FF4444]">Can Delete Contacts</span>
                        <div onClick={() => setPermissions({...permissions, deleteContacts: !permissions.deleteContacts})} className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${permissions.deleteContacts ? 'bg-[#FF4444]' : 'bg-[var(--card-border)]'}`}>
                          <div className={`w-3 h-3 rounded-full transition-transform ${permissions.deleteContacts ? 'bg-black translate-x-5' : 'bg-[var(--bg-base)] translate-x-0'}`}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[var(--text-base)]">Can View Billing</span>
                        <div onClick={() => setPermissions({...permissions, viewBilling: !permissions.viewBilling})} className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${permissions.viewBilling ? 'bg-[var(--brand-primary)]' : 'bg-[var(--card-border)]'}`}>
                          <div className={`w-3 h-3 rounded-full transition-transform ${permissions.viewBilling ? 'bg-black translate-x-5' : 'bg-[var(--bg-base)] translate-x-0'}`}></div>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => setEditingMember(null)} className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/80 text-black font-black text-xs uppercase tracking-widest py-3 rounded-lg transition-colors">
                      Save Access Rules
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== API INTEGRATIONS ===================== */}
          {activeTab === 'integrations' && isExecutive && (
            <div className="animate-fade-in text-[var(--text-base)] max-w-4xl">
              
              <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4 mb-8">
                <div>
                  <h2 className="text-xl font-black tracking-widest text-[var(--brand-primary)] uppercase">API Integrations</h2>
                  <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest mt-1">Manage global webhooks and third-party API keys</p>
                </div>
                <button onClick={handleSaveIntegrations} className="bg-[var(--card-bg)] hover:bg-[var(--brand-primary)] hover:text-black text-[var(--brand-primary)] border border-[var(--brand-primary)]/50 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2">
                  <Save size={14} /> Save Keys
                </button>
              </div>

              {/* GoHighLevel Integration */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00E676]"></div>
                <div className="flex items-center justify-between border-b border-[var(--brand-secondary)] pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center">
                      <Link2 size={16} className="text-[var(--brand-primary)]" />
                    </div>
                    <div>
                      <h3 className="text-[#FFFFFF] font-black text-sm tracking-widest uppercase">GoHighLevel (GHL)</h3>
                      <p className="text-[var(--text-muted)] text-[9px] uppercase tracking-widest">Bi-directional CRM Sync</p>
                    </div>
                  </div>
                  <span className="text-[#00E676] text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-[#00E676]/10 rounded border border-[#00E676]/20">Connected</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Location API Key</label>
                    <input type="password" value={integrationsForm.ghlLocationKey || ''} onChange={(e) => setIntegrationsForm({...integrationsForm, ghlLocationKey: e.target.value})} placeholder="ghl_loc_xxxxxxxxxxxxxxxx" className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Agency API Key (Optional)</label>
                    <input type="password" value={integrationsForm.ghlAgencyKey || ''} onChange={(e) => setIntegrationsForm({...integrationsForm, ghlAgencyKey: e.target.value})} placeholder="ghl_agc_xxxxxxxxxxxxxxxx" className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                  </div>
                </div>
              </div>

              {/* Twilio Integration */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#F22F46]"></div>
                <div className="flex items-center justify-between border-b border-[var(--brand-secondary)] pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center">
                      <MessageSquare size={16} className="text-[#F22F46]" />
                    </div>
                    <div>
                      <h3 className="text-[#FFFFFF] font-black text-sm tracking-widest uppercase">Twilio API</h3>
                      <p className="text-[var(--text-muted)] text-[9px] uppercase tracking-widest">SMS & Voice Routing</p>
                    </div>
                  </div>
                  <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-[#333333]/50 rounded border border-[var(--card-border)]">Disconnected</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Account SID</label>
                    <input type="text" value={integrationsForm.twilioSid || ''} onChange={(e) => setIntegrationsForm({...integrationsForm, twilioSid: e.target.value})} placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Auth Token</label>
                    <input type="password" value={integrationsForm.twilioToken || ''} onChange={(e) => setIntegrationsForm({...integrationsForm, twilioToken: e.target.value})} placeholder="••••••••••••••••••••••••••••••••" className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                  </div>
                </div>
              </div>

              {/* BatchLeads Integration */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#1E88E5]"></div>
                <div className="flex items-center justify-between border-b border-[var(--brand-secondary)] pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center">
                      <Database size={16} className="text-[#1E88E5]" />
                    </div>
                    <div>
                      <h3 className="text-[#FFFFFF] font-black text-sm tracking-widest uppercase">BatchLeads</h3>
                      <p className="text-[var(--text-muted)] text-[9px] uppercase tracking-widest">Skip Tracing & Data Enrichment</p>
                    </div>
                  </div>
                  <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-[#333333]/50 rounded border border-[var(--card-border)]">Disconnected</span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">BatchLeads API Key</label>
                  <input type="password" value={integrationsForm.batchLeadsKey || ''} onChange={(e) => setIntegrationsForm({...integrationsForm, batchLeadsKey: e.target.value})} placeholder="bl_live_xxxxxxxxxxxxxxxxxxxxxxxx" className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                </div>
              </div>

              {/* DocuSign Integration */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#333333]"></div>
                <div className="flex items-center justify-between border-b border-[var(--brand-secondary)] pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center">
                      <Shield size={16} className="text-[#555555]" />
                    </div>
                    <div>
                      <h3 className="text-[#FFFFFF] font-black text-sm tracking-widest uppercase">DocuSign API</h3>
                      <p className="text-[var(--text-muted)] text-[9px] uppercase tracking-widest">Automated Contract Generation</p>
                    </div>
                  </div>
                  <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-[#333333]/50 rounded border border-[var(--card-border)]">Disconnected</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Integration Key (Client ID)</label>
                    <input type="password" value={integrationsForm.docusignClientId || ''} onChange={(e) => setIntegrationsForm({...integrationsForm, docusignClientId: e.target.value})} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">RSA Private Key</label>
                    <button className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] hover:border-[var(--brand-primary)] text-[var(--text-muted)] hover:text-[var(--text-base)] rounded-lg p-3 text-xs font-bold uppercase tracking-widest transition-all text-left">
                      Click to Upload .PEM File
                    </button>
                  </div>
                </div>
              </div>

              {/* PropStream Integration */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#E84E1B]"></div>
                <div className="flex items-center justify-between border-b border-[var(--brand-secondary)] pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center">
                      <Map size={16} className="text-[#E84E1B]" />
                    </div>
                    <div>
                      <h3 className="text-[#FFFFFF] font-black text-sm tracking-widest uppercase">PropStream</h3>
                      <p className="text-[var(--text-muted)] text-[9px] uppercase tracking-widest">Comp & Property Data</p>
                    </div>
                  </div>
                  <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-[#333333]/50 rounded border border-[var(--card-border)]">Disconnected</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">API Key</label>
                  <input type="password" value={integrationsForm.propStreamKey || ''} onChange={(e) => setIntegrationsForm({...integrationsForm, propStreamKey: e.target.value})} placeholder="ps_live_xxxxxxxxxxxxxxxx" className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                </div>
              </div>

              {/* InvestorLift Integration */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#0052FF]"></div>
                <div className="flex items-center justify-between border-b border-[var(--brand-secondary)] pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center">
                      <Building size={16} className="text-[#0052FF]" />
                    </div>
                    <div>
                      <h3 className="text-[#FFFFFF] font-black text-sm tracking-widest uppercase">InvestorLift</h3>
                      <p className="text-[var(--text-muted)] text-[9px] uppercase tracking-widest">Dispo & Cash Buyer Sync</p>
                    </div>
                  </div>
                  <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-[#333333]/50 rounded border border-[var(--card-border)]">Disconnected</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">API Key</label>
                  <input type="password" value={integrationsForm.investorLiftKey || ''} onChange={(e) => setIntegrationsForm({...integrationsForm, investorLiftKey: e.target.value})} placeholder="il_live_xxxxxxxxxxxxxxxx" className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                </div>
              </div>

              {/* Follow Up Boss Integration */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#3B82F6]"></div>
                <div className="flex items-center justify-between border-b border-[var(--brand-secondary)] pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center">
                      <Users size={16} className="text-[#3B82F6]" />
                    </div>
                    <div>
                      <h3 className="text-[#FFFFFF] font-black text-sm tracking-widest uppercase">Follow Up Boss</h3>
                      <p className="text-[var(--text-muted)] text-[9px] uppercase tracking-widest">Retail Agent Routing</p>
                    </div>
                  </div>
                  <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-[#333333]/50 rounded border border-[var(--card-border)]">Disconnected</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">API Key</label>
                  <input type="password" value={integrationsForm.fubKey || ''} onChange={(e) => setIntegrationsForm({...integrationsForm, fubKey: e.target.value})} placeholder="fka_xxxxxxxxxxxxxxxxxxxx" className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                </div>
              </div>

              {/* SmrtPhone Integration */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#10B981]"></div>
                <div className="flex items-center justify-between border-b border-[var(--brand-secondary)] pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center">
                      <Phone size={16} className="text-[#10B981]" />
                    </div>
                    <div>
                      <h3 className="text-[#FFFFFF] font-black text-sm tracking-widest uppercase">SmrtPhone</h3>
                      <p className="text-[var(--text-muted)] text-[9px] uppercase tracking-widest">Call Metrics & Dialer</p>
                    </div>
                  </div>
                  <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-[#333333]/50 rounded border border-[var(--card-border)]">Disconnected</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">API Key</label>
                  <input type="password" value={integrationsForm.smrtPhoneKey || ''} onChange={(e) => setIntegrationsForm({...integrationsForm, smrtPhoneKey: e.target.value})} placeholder="smrt_xxxxxxxxxxxxxxxx" className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                </div>
              </div>

              {/* CallTools Integration */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#8B5CF6]"></div>
                <div className="flex items-center justify-between border-b border-[var(--brand-secondary)] pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center">
                      <PhoneCall size={16} className="text-[#8B5CF6]" />
                    </div>
                    <div>
                      <h3 className="text-[#FFFFFF] font-black text-sm tracking-widest uppercase">CallTools</h3>
                      <p className="text-[var(--text-muted)] text-[9px] uppercase tracking-widest">Predictive Dialer Sync</p>
                    </div>
                  </div>
                  <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-[#333333]/50 rounded border border-[var(--card-border)]">Disconnected</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">API Key</label>
                  <input type="password" value={integrationsForm.callToolsKey || ''} onChange={(e) => setIntegrationsForm({...integrationsForm, callToolsKey: e.target.value})} placeholder="ct_xxxxxxxxxxxxxxxx" className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                </div>
              </div>

              {/* QuickBooks Integration */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#2CA01C]"></div>
                <div className="flex items-center justify-between border-b border-[var(--brand-secondary)] pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center">
                      <DollarSign size={16} className="text-[#2CA01C]" />
                    </div>
                    <div>
                      <h3 className="text-[#FFFFFF] font-black text-sm tracking-widest uppercase">QuickBooks Online</h3>
                      <p className="text-[var(--text-muted)] text-[9px] uppercase tracking-widest">Financial Ledger & Invoicing</p>
                    </div>
                  </div>
                  <span className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-[#333333]/50 rounded border border-[var(--card-border)]">Disconnected</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Client ID</label>
                    <input type="password" value={integrationsForm.quickBooksClientId || ''} onChange={(e) => setIntegrationsForm({...integrationsForm, quickBooksClientId: e.target.value})} placeholder="ABxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Client Secret</label>
                    <input type="password" value={integrationsForm.quickBooksClientSecret || ''} onChange={(e) => setIntegrationsForm({...integrationsForm, quickBooksClientSecret: e.target.value})} placeholder="••••••••••••••••••••••••••••••••" className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                  </div>
                </div>
              </div>

              {/* Custom Webhook Out */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--brand-primary)]"></div>
                <div className="flex items-center justify-between border-b border-[var(--brand-secondary)] pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center">
                      <Server size={16} className="text-[var(--brand-primary)]" />
                    </div>
                    <div>
                      <h3 className="text-[#FFFFFF] font-black text-sm tracking-widest uppercase">Global Webhook (Outbound)</h3>
                      <p className="text-[var(--text-muted)] text-[9px] uppercase tracking-widest">Fire JSON payload on Lead Status Change</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="bg-[var(--bg-base)] border border-[var(--card-border)] hover:border-[var(--brand-primary)] text-[var(--text-muted)] hover:text-[var(--text-base)] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5">
                      <Activity size={12} /> Webhook Logs
                    </button>
                    <div className="w-10 h-5 rounded-full bg-[var(--brand-primary)] p-1 cursor-pointer">
                      <div className="w-3 h-3 bg-black rounded-full translate-x-5"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[var(--brand-primary)] font-extrabold text-[9px] uppercase tracking-widest">Webhook URL (Zapier / Make.com)</label>
                  <input type="url" value={integrationsForm.webhookUrl || ''} onChange={(e) => setIntegrationsForm({...integrationsForm, webhookUrl: e.target.value})} placeholder="https://hooks.zapier.com/..." className="bg-[var(--bg-base)] border border-[var(--brand-secondary)] rounded-lg p-3 text-[var(--text-base)] text-sm font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors font-mono" />
                </div>
              </div>

            </div>
          )}

          {/* ===================== BILLING & SECURITY ===================== */}
          {activeTab === 'billing' && isExecutive && (
            <div className="animate-fade-in text-[var(--text-base)] max-w-4xl">
              <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4 mb-8">
                <div>
                  <h2 className="text-xl font-black tracking-widest text-[var(--brand-primary)] uppercase">Billing & Security</h2>
                  <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest mt-1">Manage your enterprise subscription and security logs</p>
                </div>
              </div>

              {/* Subscription Card */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 p-6 rounded-xl border border-[var(--brand-secondary)] mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--brand-primary)]"></div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-[var(--text-base)] font-black text-lg tracking-widest uppercase">Enterprise Acquisitions Tier</h3>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mt-1">Next billing date: Oct 1, 2026</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[var(--brand-primary)]">$1,500</span>
                    <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest"> / mo</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="bg-[var(--bg-base)] border border-[var(--card-border)] hover:border-[var(--brand-primary)] text-[var(--text-base)] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                    Update Payment Method
                  </button>
                  <button className="bg-[var(--bg-base)] border border-[var(--card-border)] hover:border-[var(--brand-primary)] text-[var(--text-base)] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                    View Invoice History
                  </button>
                </div>
              </div>

              {/* Security Logs */}
              <div className="bg-[var(--card-bg)] shadow-sm/50 rounded-xl border border-[var(--brand-secondary)] overflow-hidden">
                <div className="p-4 border-b border-[var(--card-border)] flex items-center gap-2">
                  <Shield size={16} className="text-[var(--brand-primary)]" />
                  <h3 className="text-[var(--text-base)] font-black text-[11px] tracking-widest uppercase">Recent Login Activity</h3>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-base)] border-b border-[var(--card-border)]">
                      <th className="p-4 text-[var(--text-muted)] font-black text-[10px] uppercase tracking-widest">Date / Time</th>
                      <th className="p-4 text-[var(--text-muted)] font-black text-[10px] uppercase tracking-widest">IP Address</th>
                      <th className="p-4 text-[var(--text-muted)] font-black text-[10px] uppercase tracking-widest">Location</th>
                      <th className="p-4 text-[var(--text-muted)] font-black text-[10px] uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--card-border)] hover:bg-[var(--bg-base)]/50 transition-colors">
                      <td className="p-4 text-[var(--text-base)] text-sm">Sep 18, 2026 - 11:15 AM</td>
                      <td className="p-4 text-[var(--text-muted)] text-xs font-mono">192.168.1.42</td>
                      <td className="p-4 text-[var(--text-muted)] text-xs">Bakersfield, CA</td>
                      <td className="p-4 text-right">
                        <span className="text-[#00E676] text-[10px] font-bold uppercase tracking-wider bg-[#00E676]/10 px-2 py-1 rounded border border-[#00E676]/20">Success</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--bg-base)]/50 transition-colors">
                      <td className="p-4 text-[var(--text-base)] text-sm">Sep 17, 2026 - 09:30 AM</td>
                      <td className="p-4 text-[var(--text-muted)] text-xs font-mono">192.168.1.42</td>
                      <td className="p-4 text-[var(--text-muted)] text-xs">Bakersfield, CA</td>
                      <td className="p-4 text-right">
                        <span className="text-[#00E676] text-[10px] font-bold uppercase tracking-wider bg-[#00E676]/10 px-2 py-1 rounded border border-[#00E676]/20">Success</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fallback for any other undefined tabs */}
          {activeTab !== 'profile' && activeTab !== 'workspace' && activeTab !== 'team' && activeTab !== 'integrations' && activeTab !== 'notifications' && activeTab !== 'billing' && (
            <div className="animate-fade-in text-[var(--text-base)]">
              <h2 className="text-xl font-black tracking-widest text-[var(--brand-primary)] mb-6 border-b border-[var(--card-border)] pb-4 uppercase">
                {visibleTabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-[var(--text-muted)]">Module architecture standing by for {activeTab} injection.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
