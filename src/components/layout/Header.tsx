import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Search,
  Bell,
  Upload,
  Play,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Building2,
  Cpu,
  Layers,
  LogOut
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    currentUserRole,
    setCurrentUserRole,
    notifications,
    setIsNotificationsOpen,
    setIsCommandPaletteOpen,
    setIsAIAssistantOpen,
    startSIHDemo
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roles: UserRole[] = [
    'National Administrator',
    'CPSE Administrator (IOCL)',
    'CPSE Administrator (ONGC)',
    'Material Master Officer',
    'Procurement Officer',
    'Auditor',
    'Executive Management'
  ];

  return (
    <header className="sticky top-0 right-0 w-full h-15 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4 lg:px-6 shadow-xs">
      {/* Left section: Breadcrumb & Top Tabs */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-extrabold text-xs tracking-wider shadow-xs">
            BMG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm tracking-tight hidden sm:inline">Bharat Material Grid</span>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">
                Govt. Enterprise Mesh
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('ai-match')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'ai-match' || currentTab === 'review-queue'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-slate-700" />
            AI Match & Spec Guard
          </button>
          <button
            onClick={() => setCurrentTab('master')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'master' || currentTab === 'material-360'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-700" />
            Common Master
          </button>
          <button
            onClick={() => setCurrentTab('procurement')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'procurement' || currentTab === 'what-if'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Procurement
          </button>
        </div>
      </div>

      {/* Right section: Search, Demo CTA, Notifications, Upload & Profile */}
      <div className="flex items-center gap-2.5 lg:gap-3">
        {/* Global Search Bar */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 text-xs transition-colors cursor-pointer group"
          title="Search Materials, CPSEs, Opportunities, Audits (Ctrl + K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          <span className="hidden lg:inline text-slate-600 text-xs">Search platform...</span>
          <kbd className="hidden lg:inline-block bg-white text-slate-500 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* START SIH DEMO HIGHLIGHT BUTTON */}
        <button
          onClick={startSIHDemo}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-lg font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white text-white" />
          <span>Interactive Demo</span>
        </button>

        {/* Ask Bharat AI button */}
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Ask Bharat AI contextual reasoning"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-700" />
          <span className="hidden md:inline">AI Copilot</span>
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full"></span>
          )}
        </button>

        {/* Upload Button */}
        <button
          onClick={() => setCurrentTab('upload')}
          className="hidden sm:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Dataset</span>
        </button>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
              <ShieldCheck className="w-3 h-3 text-slate-700" />
            </div>
            <div className="text-left hidden xl:block">
              <div className="font-semibold text-slate-800 leading-tight text-xs">{currentUserRole}</div>
              <div className="text-[10px] text-slate-500 font-medium">Verified Active</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch Active Role (RBAC)</div>
                <div className="text-xs text-slate-500 mt-0.5">Simulate role-based views & permissions</div>
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {roles.map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentUserRole(role);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      currentUserRole === role
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{role}</span>
                    {currentUserRole === role && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    )}
                  </button>
                ))}
              </div>
              <div className="pt-1 mt-1 border-t border-slate-100 px-1">
                <button
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    window.history.pushState({}, '', '/login');
                    setCurrentTab('login');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Switch Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
