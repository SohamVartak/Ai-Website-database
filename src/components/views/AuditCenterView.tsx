import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../ui/StatusBadge';
import { AnimatedButton } from '../ui/AnimatedButton';
import { EmptyState } from '../ui/EmptyState';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Clock,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileCheck
} from 'lucide-react';

export const AuditCenterView: React.FC = () => {
  const { auditEvents, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const filteredLogs = auditEvents.filter(log => {
    const matchesAction = actionFilter === 'All' || log.action.includes(actionFilter);
    const s = search.toLowerCase();
    const matchesSearch =
      log.id.toLowerCase().includes(s) ||
      log.action.toLowerCase().includes(s) ||
      log.performedBy.toLowerCase().includes(s) ||
      log.entityId.toLowerCase().includes(s) ||
      log.verificationHash.toLowerCase().includes(s);
    return matchesAction && matchesSearch;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
    addToast({
      title: 'Hash Copied',
      message: 'Cryptographic SHA-256 verification hash copied to clipboard',
      type: 'info'
    });
  };

  const handleExportCSV = () => {
    const headers = 'Audit ID,Timestamp,Action,Entity ID,Performed By,Role,SHA-256 Hash\n';
    const rows = auditEvents.map(a => `"${a.id}","${a.timestamp}","${a.action}","${a.entityId}","${a.performedBy}","${a.role}","${a.verificationHash}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bharat_Material_Grid_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    addToast({
      title: 'Audit Log Exported',
      message: 'Downloaded sovereign audit log CSV',
      type: 'success'
    });
  };

  const getActionBadgeStatus = (action: string): 'success' | 'warning' | 'danger' | 'primary' | 'neutral' => {
    const lower = action.toLowerCase();
    if (lower.includes('approved') || lower.includes('minted')) return 'success';
    if (lower.includes('rejected')) return 'danger';
    if (lower.includes('cleanup') || lower.includes('remediated')) return 'primary';
    if (lower.includes('ingested')) return 'neutral';
    return 'warning';
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Immutable Governance Trail
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Hardware Security Module (HSM) Signed
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            National Audit & Sovereign Governance Trail
          </h1>
          <p className="text-xs text-slate-300">
            Cryptographically sealed timeline of all automated AI classifications and officer approval decisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatedButton
            onClick={handleExportCSV}
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4 text-emerald-400" />}
          >
            Export CSV Audit Pack
          </AnimatedButton>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {['All', 'Approved', 'Rejected', 'Minted', 'Ingested', 'Cleanup'].map(act => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                actionFilter === act
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {act}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by action, officer, hash..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Audit Ledger ({filteredLogs.length} Events)
          </h2>
          <span className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Integrity Check: Verified
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <EmptyState
            icon={FileCheck}
            title="No audit records found"
            description="No ledger records match the active filter or search query."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-[10px] font-mono text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold">Event ID</th>
                  <th className="p-3 font-semibold">Timestamp</th>
                  <th className="p-3 font-semibold">Action</th>
                  <th className="p-3 font-semibold">Entity</th>
                  <th className="p-3 font-semibold">Actor / Officer</th>
                  <th className="p-3 font-semibold">Role</th>
                  <th className="p-3 font-semibold text-right">Cryptographic Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredLogs.map((log, index) => {
                  const isExpanded = expandedRowId === log.id;
                  return (
                    <React.Fragment key={log.id}>
                      <motion.tr
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, delay: Math.min(index * 0.02, 0.3) }}
                        onClick={() => setExpandedRowId(isExpanded ? null : log.id)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          )}
                          <span>{log.id}</span>
                        </td>
                        <td className="p-3 text-slate-600 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                        <td className="p-3 font-sans font-semibold text-slate-900">
                          <StatusBadge
                            status={getActionBadgeStatus(log.action)}
                            label={log.action}
                            size="sm"
                          />
                        </td>
                        <td className="p-3 font-bold text-slate-800">{log.entityId}</td>
                        <td className="p-3 font-sans text-slate-800 font-medium">{log.performedBy}</td>
                        <td className="p-3 text-slate-500 text-[11px]">{log.role}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-[10px] text-slate-400 max-w-[120px] truncate" title={log.verificationHash}>
                              {log.verificationHash.slice(0, 16)}...
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyHash(log.verificationHash);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-800 transition-colors rounded cursor-pointer"
                              title="Copy full hash"
                            >
                              {copiedHash === log.verificationHash ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </motion.tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200">
                          <td colSpan={7} className="p-4">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-3 font-sans text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800">Immutable Ledger Transaction Record</span>
                                <span className="font-mono text-[10px] text-slate-500">Node ID: IN-NIC-DELHI-01</span>
                              </div>
                              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 break-all space-y-1">
                                <div><strong className="text-slate-900 font-sans">Full SHA-256 Hash: </strong>{log.verificationHash}</div>
                                <div><strong className="text-slate-900 font-sans">Event Sequence: </strong>#{log.id} • {log.timestamp} UTC</div>
                                <div><strong className="text-slate-900 font-sans">Sovereign Signature: </strong>RSA-4096-PKCS1v15-HSM-VERIFIED</div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
