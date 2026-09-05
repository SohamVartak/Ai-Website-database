import React from 'react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';
import {
  LayoutDashboard,
  Cpu,
  CheckSquare,
  UploadCloud,
  ShieldAlert,
  Database,
  Eye,
  TrendingUp,
  Sliders,
  Building,
  FileText,
  Settings,
  Sparkles,
  ChevronRight,
  Activity
} from 'lucide-react';

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = true, onClose }) => {
  const {
    currentTab,
    setCurrentTab,
    candidates,
    reviews,
    qualityIssues,
    procurementOpportunities,
    setIsAIAssistantOpen
  } = useApp();

  const pendingCandidatesCount = candidates.filter(c => c.status === 'Pending').length;
  const pendingReviewsCount = reviews.filter(r => r.status === 'Pending' || r.status === 'High Priority').length;
  const openQualityIssuesCount = qualityIssues.filter(q => q.status === 'Open').length;
  const activeOpportunitiesCount = procurementOpportunities.filter(p => p.status === 'Active').length;

  interface NavItem {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeType?: 'danger' | 'warning' | 'info' | 'success';
    category?: string;
  }

  const navItems: NavItem[] = [
    // Command Center
    {
      id: 'dashboard',
      label: 'National Command Center',
      icon: <LayoutDashboard className="w-4 h-4" />,
      category: 'CORE INTELLIGENCE'
    },
    {
      id: 'ai-match',
      label: 'AI Match & Spec Guard',
      icon: <Cpu className="w-4 h-4" />,
      badge: pendingCandidatesCount,
      badgeType: 'warning',
      category: 'CORE INTELLIGENCE'
    },
    {
      id: 'review-queue',
      label: 'Human Review Queue',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingReviewsCount,
      badgeType: 'danger',
      category: 'CORE INTELLIGENCE'
    },
    // Pipeline & Quality
    {
      id: 'upload',
      label: 'Multi-CPSE Ingestion',
      icon: <UploadCloud className="w-4 h-4" />,
      category: 'DATA PIPELINE'
    },
    {
      id: 'quality',
      label: 'Data Quality & Spec Audit',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: openQualityIssuesCount,
      badgeType: 'danger',
      category: 'DATA PIPELINE'
    },
    // Master Records
    {
      id: 'master',
      label: 'Common Material Master',
      icon: <Database className="w-4 h-4" />,
      category: 'MASTER HARMONIZATION'
    },
    {
      id: 'material-360',
      label: 'Material 360 View',
      icon: <Eye className="w-4 h-4" />,
      category: 'MASTER HARMONIZATION'
    },
    // Procurement & Analytics
    {
      id: 'procurement',
      label: 'Procurement Intelligence',
      icon: <TrendingUp className="w-4 h-4" />,
      badge: `${activeOpportunitiesCount} Deals`,
      badgeType: 'success',
      category: 'PROCUREMENT & VALUE'
    },
    {
      id: 'what-if',
      label: 'What-If Savings Simulator',
      icon: <Sliders className="w-4 h-4" />,
      category: 'PROCUREMENT & VALUE'
    },
    // Governance
    {
      id: 'cpse',
      label: 'CPSE Organizations',
      icon: <Building className="w-4 h-4" />,
      badge: '10 CPSEs',
      badgeType: 'info',
      category: 'GOVERNANCE & AUDIT'
    },
    {
      id: 'audit',
      label: 'Audit & Governance Trail',
      icon: <FileText className="w-4 h-4" />,
      category: 'GOVERNANCE & AUDIT'
    },
    {
      id: 'admin',
      label: 'Platform Administration',
      icon: <Settings className="w-4 h-4" />,
      category: 'GOVERNANCE & AUDIT'
    }
  ];

  // Group items by category
  const categories = Array.from(new Set(navItems.map(item => item.category)));

  const handleSelect = (tab: TabType) => {
    setCurrentTab(tab);
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col h-[calc(100vh-3.75rem)] sticky top-15 select-none shrink-0 z-20">
      {/* Platform Emblem Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-extrabold text-base shadow-2xs">
          🏛️
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-white tracking-tight truncate flex items-center gap-1.5">
            Bharat Material Grid
          </div>
          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Govt. CPSE Mesh Active
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
        {categories.map(category => (
          <div key={category} className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              {category}
            </div>
            <div className="space-y-0.5">
              {navItems
                .filter(item => item.category === category)
                .map(item => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-slate-800 text-white font-semibold shadow-xs'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`transition-colors ${
                            isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-slate-700 text-white border border-slate-600'
                              : item.badgeType === 'danger'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : item.badgeType === 'warning'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : item.badgeType === 'success'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistant Quick Card in Sidebar Bottom */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
        <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-white">Bharat AI Copilot</span>
            </div>
            <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              v2.4
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-snug">
            Autonomous material normalization with specification safety guards.
          </p>
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg py-1.5 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Launch Copilot</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* System Health Status */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Mesh Synced</span>
          </div>
          <span className="text-slate-400">10 / 10 CPSEs</span>
        </div>
      </div>
    </aside>
  );
};
