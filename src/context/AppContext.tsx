import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TabType,
  UserRole,
  CPSE,
  CommonMaterial,
  MatchCandidate,
  ReviewItem,
  QualityIssue,
  ProcurementOpportunity,
  AuditEvent,
  StandardizationRule,
  DomainDictionaryItem,
  AIModelVersion,
  NotificationItem
} from '../types';
import {
  INITIAL_CPSES,
  INITIAL_COMMON_MATERIALS,
  INITIAL_CANDIDATES,
  INITIAL_REVIEWS,
  INITIAL_QUALITY_ISSUES,
  INITIAL_PROCUREMENT_OPPORTUNITIES,
  INITIAL_AUDIT_EVENTS,
  INITIAL_RULES,
  INITIAL_DICTIONARY,
  INITIAL_AI_MODELS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface AppContextType {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  language: 'EN' | 'HI';
  setLanguage: (lang: 'EN' | 'HI') => void;
  
  // Data entities
  cpses: CPSE[];
  commonMaterials: CommonMaterial[];
  candidates: MatchCandidate[];
  reviews: ReviewItem[];
  qualityIssues: QualityIssue[];
  procurementOpportunities: ProcurementOpportunity[];
  auditEvents: AuditEvent[];
  rules: StandardizationRule[];
  dictionary: DomainDictionaryItem[];
  models: AIModelVersion[];
  notifications: NotificationItem[];
  toasts: ToastMessage[];

  // Navigation & selection states
  selectedMaterialId: string | null;
  setSelectedMaterialId: (id: string | null) => void;
  selectedCandidateId: string | null;
  setSelectedCandidateId: (id: string | null) => void;
  selectedCPSEId: string | null;
  setSelectedCPSEId: (id: string | null) => void;
  selectedOpportunityId: string | null;
  setSelectedOpportunityId: (id: string | null) => void;
  selectedIssueId: string | null;
  setSelectedIssueId: (id: string | null) => void;

  // Drawers & Modals
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  isSIHDemoOpen: boolean;
  setIsSIHDemoOpen: (open: boolean) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;

  // Actions
  approveMatch: (candidateId: string, note?: string) => void;
  rejectMatch: (candidateId: string, reason?: string) => void;
  requestMoreData: (candidateId: string, note?: string) => void;
  deferMatch: (candidateId: string) => void;
  createCommonMaterial: (material: Partial<CommonMaterial>) => void;
  executeCleanupRule: (issueId: string) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  startSIHDemo: () => void;
  openMaterial360: (bmgId: string) => void;
  openCandidateMatch: (candidateId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('National Administrator');
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');

  // Core Data Collections
  const [cpses, setCpses] = useState<CPSE[]>(INITIAL_CPSES);
  const [commonMaterials, setCommonMaterials] = useState<CommonMaterial[]>(INITIAL_COMMON_MATERIALS);
  const [candidates, setCandidates] = useState<MatchCandidate[]>(INITIAL_CANDIDATES);
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [qualityIssues, setQualityIssues] = useState<QualityIssue[]>(INITIAL_QUALITY_ISSUES);
  const [procurementOpportunities, setProcurementOpportunities] = useState<ProcurementOpportunity[]>(INITIAL_PROCUREMENT_OPPORTUNITIES);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);
  const [rules, setRules] = useState<StandardizationRule[]>(INITIAL_RULES);
  const [dictionary, setDictionary] = useState<DomainDictionaryItem[]>(INITIAL_DICTIONARY);
  const [models, setModels] = useState<AIModelVersion[]>(INITIAL_AI_MODELS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Selection states
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>('BMG-FST-000001284');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>('CAND-8492');
  const [selectedCPSEId, setSelectedCPSEId] = useState<string | null>(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>('OPP-1042');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Modals & Overlays
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [isSIHDemoOpen, setIsSIHDemoOpen] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);

  // Keyboard shortcut Ctrl+K for Global Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const openMaterial360 = (bmgId: string) => {
    setSelectedMaterialId(bmgId);
    setCurrentTab('material-360');
  };

  const openCandidateMatch = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setCurrentTab('ai-match');
  };

  // Action: Approve Match
  const approveMatch = (candidateId: string, note?: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    // Update candidate status
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: 'Approved' } : c));

    // Update review queue item
    setReviews(prev => prev.map(r => r.candidateId === candidateId ? {
      ...r,
      status: 'Approved',
      actionNote: note || 'Approved by Officer. Common Material Identity mapped.',
      actionTakenBy: currentUserRole,
      actionTakenAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
    } : r));

    // Target or minted BMG ID
    const targetBmgId = candidate.targetBmgId || `BMG-FST-000001284`;

    // Add audit event
    const newAudit: AuditEvent = {
      id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      user: currentUserRole,
      userRole: currentUserRole,
      cpse: `${candidate.recordA.cpseCode} / ${candidate.recordB.cpseCode}`,
      action: 'Material mapping approved',
      materialId: targetBmgId,
      previousValue: `Candidate Pair #${candidate.pairNumber} (Pending Review)`,
      newValue: `Approved Standard Mapping to ${targetBmgId}`,
      reason: note || `Verified engineering equivalence with ${candidate.scores.overallConfidence}% confidence score.`,
      modelVersion: candidate.modelVersion,
      verificationHash: 'sha256:' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    setAuditEvents(prev => [newAudit, ...prev]);

    // Update CPSE stats
    setCpses(prev => prev.map(cpse => {
      if (cpse.code === candidate.recordA.cpseCode || cpse.code === candidate.recordB.cpseCode) {
        return {
          ...cpse,
          recordsMatched: cpse.recordsMatched + 1,
          reviewBacklog: Math.max(0, cpse.reviewBacklog - 1)
        };
      }
      return cpse;
    }));

    addToast({
      title: 'Candidate Match Approved',
      message: `Standardized ${candidate.recordA.localCode} & ${candidate.recordB.localCode} into ${targetBmgId}.`,
      type: 'success'
    });
  };

  // Action: Reject Match
  const rejectMatch = (candidateId: string, reason?: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: 'Rejected' } : c));
    setReviews(prev => prev.map(r => r.candidateId === candidateId ? {
      ...r,
      status: 'Rejected',
      actionNote: reason || 'Rejected due to engineering specification divergence.',
      actionTakenBy: currentUserRole,
      actionTakenAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
    } : r));

    const newAudit: AuditEvent = {
      id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      user: currentUserRole,
      userRole: currentUserRole,
      cpse: `${candidate.recordA.cpseCode} / ${candidate.recordB.cpseCode}`,
      action: 'Match rejected',
      materialId: candidate.id,
      previousValue: `Candidate Pair #${candidate.pairNumber}`,
      newValue: 'Rejected - Preserved Discrete Inventory Identities',
      reason: reason || candidate.criticalMismatchReason || 'Specification mismatch detected by human officer.',
      modelVersion: candidate.modelVersion,
      verificationHash: 'sha256:' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    setAuditEvents(prev => [newAudit, ...prev]);

    addToast({
      title: 'Match Candidate Rejected',
      message: `Preserved separate identities for ${candidate.recordA.localCode} & ${candidate.recordB.localCode}.`,
      type: 'warning'
    });
  };

  // Action: Request More Data
  const requestMoreData = (candidateId: string, note?: string) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: 'Needs More Data' } : c));
    setReviews(prev => prev.map(r => r.candidateId === candidateId ? {
      ...r,
      status: 'Needs More Data',
      actionNote: note || 'Dispatched clarification ticket to CPSE Nodal Master Data Officer.',
      actionTakenBy: currentUserRole,
      actionTakenAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
    } : r));

    addToast({
      title: 'Clarification Requested',
      message: `Notification sent to CPSE Nodal Officers for additional engineering drawings / MTC.`,
      type: 'info'
    });
  };

  // Action: Defer Match
  const deferMatch = (candidateId: string) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: 'Deferred' } : c));
    setReviews(prev => prev.map(r => r.candidateId === candidateId ? { ...r, status: 'Deferred' } : r));
    addToast({
      title: 'Review Deferred',
      message: 'Item moved to deferred queue for subsequent batch committee review.',
      type: 'info'
    });
  };

  // Action: Create Common Material
  const createCommonMaterial = (material: Partial<CommonMaterial>) => {
    const newId = `BMG-${material.category?.substring(0, 3).toUpperCase() || 'GEN'}-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const newMaterial: CommonMaterial = {
      id: newId,
      bmgCode: newId,
      standardName: material.standardName || 'Standardized Engineering Material',
      category: material.category || 'Fasteners',
      specifications: material.specifications || {
        material: 'Stainless Steel',
        grade: 'Standard',
        uom: 'Nos'
      },
      mappings: material.mappings || [],
      status: 'Approved',
      version: 'v1.0',
      lastUpdated: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      approvedBy: currentUserRole,
      approvedAt: new Date().toISOString().split('T')[0],
      totalAnnualDemand: material.totalAnnualDemand || 15000,
      avgUnitPrice: material.avgUnitPrice || 500,
      potentialSavingsPercent: material.potentialSavingsPercent || 15.0,
      activeSuppliersCount: material.activeSuppliersCount || 4,
      authorizedInventory: material.authorizedInventory || 3000,
      description: material.description || 'Newly minted Bharat Material Grid canonical master record.'
    };

    setCommonMaterials(prev => [newMaterial, ...prev]);

    const newAudit: AuditEvent = {
      id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      user: currentUserRole,
      userRole: currentUserRole,
      cpse: 'National Master Data Authority',
      action: 'Common Material Created',
      materialId: newId,
      previousValue: 'None (New Master Entity)',
      newValue: `${newMaterial.standardName} (${newId})`,
      reason: 'Authoritative national canonical material catalog addition.',
      modelVersion: 'BMG-FastText-Transformer-v2.4.1',
      verificationHash: 'sha256:' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    setAuditEvents(prev => [newAudit, ...prev]);

    addToast({
      title: 'Canonical Material Created',
      message: `Minted new national identity: ${newId}`,
      type: 'success'
    });

    openMaterial360(newId);
  };

  // Action: Cleanup rule
  const executeCleanupRule = (issueId: string) => {
    const issue = qualityIssues.find(q => q.id === issueId);
    if (!issue) return;

    setQualityIssues(prev => prev.map(q => q.id === issueId ? { ...q, status: 'Resolved' } : q));

    setCpses(prev => prev.map(c => c.code === issue.cpseCode ? {
      ...c,
      qualityScore: Math.min(99.4, +(c.qualityScore + 2.4).toFixed(1)),
      completenessRate: Math.min(99.0, +(c.completenessRate + 3.1).toFixed(1))
    } : c));

    const newAudit: AuditEvent = {
      id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      user: currentUserRole,
      userRole: currentUserRole,
      cpse: issue.cpseCode,
      action: 'Clean-up rule executed',
      materialId: issue.id,
      previousValue: `${issue.affectedRecordsCount} records flagged with ${issue.issueType}`,
      newValue: 'Rule applied: Automated normalizer resolved non-conformances',
      reason: issue.suggestedFix,
      modelVersion: 'BMG-RuleEngine-v2.4',
      verificationHash: 'sha256:' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    setAuditEvents(prev => [newAudit, ...prev]);

    addToast({
      title: 'Automated Cleanup Executed',
      message: `Successfully remediated ${issue.affectedRecordsCount} records for ${issue.cpseCode}.`,
      type: 'success'
    });
  };

  const startSIHDemo = () => {
    setDemoStep(1);
    setIsSIHDemoOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        currentUserRole,
        setCurrentUserRole,
        language,
        setLanguage,
        cpses,
        commonMaterials,
        candidates,
        reviews,
        qualityIssues,
        procurementOpportunities,
        auditEvents,
        rules,
        dictionary,
        models,
        notifications,
        toasts,
        selectedMaterialId,
        setSelectedMaterialId,
        selectedCandidateId,
        setSelectedCandidateId,
        selectedCPSEId,
        setSelectedCPSEId,
        selectedOpportunityId,
        setSelectedOpportunityId,
        selectedIssueId,
        setSelectedIssueId,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        isSIHDemoOpen,
        setIsSIHDemoOpen,
        demoStep,
        setDemoStep,
        approveMatch,
        rejectMatch,
        requestMoreData,
        deferMatch,
        createCommonMaterial,
        executeCleanupRule,
        addToast,
        removeToast,
        markNotificationAsRead,
        startSIHDemo,
        openMaterial360,
        openCandidateMatch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
