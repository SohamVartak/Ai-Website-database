import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, AlertTriangle, Info, X, ExternalLink, Check } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    setCurrentTab,
    openCandidateMatch,
    openMaterial360,
    setSelectedOpportunityId
  } = useApp();

  if (!isNotificationsOpen) return null;

  const handleAction = (item: any) => {
    markNotificationAsRead(item.id);
    if (item.actionTab) {
      setCurrentTab(item.actionTab);
    }
    if (item.actionTab === 'ai-match' && item.actionPayload) {
      openCandidateMatch(item.actionPayload);
    }
    if (item.actionTab === 'procurement' && item.actionPayload) {
      setSelectedOpportunityId(item.actionPayload);
    }
    setIsNotificationsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsNotificationsOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#000a1e] border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-sm">System Intelligence Feed</h3>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {notifications.filter(n => !n.read).length} Unread
              </span>
            </div>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleAction(n)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-300 opacity-75'
                    : 'bg-slate-900 border-slate-700 text-white shadow-lg hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    {n.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
                    {n.type === 'alert' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-100">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                        <span>View Investigation</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                      {!n.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationAsRead(n.id);
                          }}
                          className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Mark Read</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
            <span>Enterprise Mesh Alerts</span>
            <button
              onClick={() => {
                notifications.forEach(n => markNotificationAsRead(n.id));
              }}
              className="text-amber-400 hover:underline text-[11px]"
            >
              Mark all as read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
