import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({

  // ---------------------------------------------------
  // ENTERPRISE AUTHENTICATION & WORKSPACE STATE
  // ---------------------------------------------------
  
  theme: 'dark', // default
  setTheme: (theme) => set({ theme }),
  
  // The Individual User Profile
  currentUser: {
    id: 'usr_dev_001',
    firstName: 'Avory',
    lastName: 'Howard',
    email: 'avory@centralvalleyrei.com',
    phone: '(555) 123-4567',
    role: 'Manager', // 'Setter', 'Closer', 'Manager', 'Admin'
    avatarUrl: null,
    preferences: {
      theme: 'dark',
      notifications: 'email', // 'email', 'sms', 'none'
    }
  },
  
  // The White-Labeled Company Workspace
  currentCompany: {
    id: 'comp_cv_001',
    name: 'Family Legacy Investment Group',
    legalName: 'Family Legacy Investment Group LLC',
    logoUrl: '/images/company-logo.png',
    brandColor: '#D4AF37', // Default Gold
    secondaryBrandColor: '#1A1A1A', // Secondary Accent Color
    integrations: {
      ghlActive: true,
      docusignActive: false
    }
  },

  // Setters for live updating
  setCurrentUser: (userData) => set((state) => ({ currentUser: { ...state.currentUser, ...userData } })),
  setCurrentCompany: (companyData) => set((state) => ({ currentCompany: { ...state.currentCompany, ...companyData } })),
  updateUserRole: (newRole) => set((state) => ({ currentUser: { ...state.currentUser, role: newRole } })),

  // The Master Lead Object
  masterLead: {
    propertyDetails: {
      address: '',
      zestimate: '',
      beds: '',
      baths: '',
      sqft: ''
    },
    triageCondition: {
      roof: '',
      hvac: '',
      plumbing: '',
      electrical: '',
      kitchen: '',
      bathrooms: '',
      exterior: ''
    },
    financialEngine: {
      arv: '',
      repairs: 0,
      mao: 0,
      subToTerms: {},
      novationMargins: {}
    },
    disposition: {
      isLocked: false,
      lockedPrice: '',
      notes: ''
    }
  },

  // Actions
  updatePropertyDetails: (details) => set((state) => ({
    masterLead: {
      ...state.masterLead,
      propertyDetails: { ...state.masterLead.propertyDetails, ...details }
    }
  })),

  updateTriageCondition: (condition) => set((state) => ({
    masterLead: {
      ...state.masterLead,
      triageCondition: { ...state.masterLead.triageCondition, ...condition }
    }
  })),

  updateFinancialEngine: (finances) => set((state) => ({
    masterLead: {
      ...state.masterLead,
      financialEngine: { ...state.masterLead.financialEngine, ...finances }
    }
  })),

  updateDisposition: (dispo) => set((state) => ({
    masterLead: {
      ...state.masterLead,
      disposition: { ...state.masterLead.disposition, ...dispo }
    }
  })),

  callScriptUpdateForm: null,
  setCallScriptUpdateForm: (fn) => set({ callScriptUpdateForm: fn }),
  
  activeGlobalDrawer: null,
  setActiveGlobalDrawer: (drawer) => set({ activeGlobalDrawer: drawer }),
  liveFormData: {},
  setLiveFormData: (data) => set({ liveFormData: data }),
  
  // App Session Data (for Heatmap / Analytics)
  sessionLogs: [],
  addSessionLog: (log) => set((state) => ({
    sessionLogs: [...state.sessionLogs, { ...log, timestamp: Date.now() }]
  }))
    }),
    {
      name: 'enterprise-saas-storage', // Name of the local storage item
    }
  )
);

export default useStore;
