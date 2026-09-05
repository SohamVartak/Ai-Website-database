import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../ui/ProgressBar';
import { StatusBadge } from '../ui/StatusBadge';
import { AnimatedButton } from '../ui/AnimatedButton';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Play,
  Filter,
  Search,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Building,
  Layers,
  Wand2
} from 'lucide-react';

export const DataQualityView: React.FC = () => {
  const { qualityIssues, executeCleanupRule, cpses, addToast } = useApp();

  const [severityFilter, setSeverityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [search, setSearch] = useState('');
  const [runningRuleId, setRunningRuleId] = useState<string | null>(null);

  const filteredIssues = qualityIssues.filter(q => {
    const matchesSev = severityFilter === 'All' || q.severity === severityFilter;
    const s = search.toLowerCase();
    const matchesSearch =
      q.issueType.toLowerCase().includes(s) ||
      q.cpseName.toLowerCase().includes(s) ||
      q.sampleRecord.toLowerCase().includes(s);
    return matchesSev && matchesSearch;
  });

  const totalFlaggedRecords = qualityIssues.reduce((acc, q) => acc + (q.status === 'Open' ? q.affectedRecordsCount : 0), 0);

  const handleRunRule = (id: string) => {
    setRunningRuleId(id);
    setTimeout(() => {
      executeCleanupRule(id);
      setRunningRuleId(null);
      addToast({
        type: 'success',
        title: 'Rule Executed',
        message: `Remediation normalizer committed for issue ${id}`
      });
    }, 800);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Data Quality & Spec Audit
            </span>
            <span className="text-xs text-slate-400 font-mono">National Average: 91.8 / 100</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            Catalog Completeness & Anomaly Remediation Center
          </h1>
          <p className="text-xs text-slate-300">
            Identify missing technical attributes, non-standard units, and trigger automated cleanup normalizers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-1.5 text-xs text-slate-300 font-mono">
            <span>Flagged Records: </span>
            <strong className="text-rose-400 font-bold ml-1">{totalFlaggedRecords.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* CPSE Quality Scores Cards with Animated Progress Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {cpses.slice(0, 5).map(c => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">{c.code}</span>
              <StatusBadge
                status={c.qualityScore >= 90 ? 'success' : 'warning'}
                label={`${c.qualityScore}%`}
                size="sm"
              />
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Completeness: {c.completenessRate}%
            </div>
            <ProgressBar
              value={c.completenessRate}
              max={100}
              variant={c.completenessRate >= 90 ? 'emerald' : 'amber'}
              size="sm"
            />
          </motion.div>
        ))}
      </div>

      {/* Issues Table & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Quality Non-Conformances</h2>
            <p className="text-xs text-slate-500">Click "Run Auto-Cleanup Rule" to execute automated normalizers</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs">
              {(['All', 'High', 'Medium', 'Low'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    severityFilter === sev
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredIssues.map(issue => {
              const isResolved = issue.status === 'Resolved';
              const isRunning = runningRuleId === issue.id;

              return (
                <motion.div
                  layout
                  key={issue.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                        {issue.id}
                      </span>
                      <span className="font-bold text-slate-900 text-xs">{issue.issueType}</span>
                      <StatusBadge
                        status={
                          issue.severity === 'High'
                            ? 'danger'
                            : issue.severity === 'Medium'
                            ? 'warning'
                            : 'neutral'
                        }
                        label={`${issue.severity} Severity`}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                      <span className="font-bold text-slate-700">{issue.cpseName} ({issue.cpseCode})</span>
                      <span>•</span>
                      <span className="text-rose-600 font-bold">{issue.affectedRecordsCount.toLocaleString()} Records</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-mono block">Sample Non-Conformant Record</span>
                      <code className="text-slate-800 font-mono font-semibold">{issue.sampleRecord}</code>
                    </div>
                    <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 font-mono block">Suggested Automated Fix</span>
                      <span className="text-slate-900 font-medium">{issue.suggestedFix}</span>
                    </div>
                  </div>

                  {/* Footer Strip */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">Last audit: {issue.lastDetected}</span>
                    {isResolved ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved & Remediated
                      </span>
                    ) : (
                      <AnimatedButton
                        onClick={() => handleRunRule(issue.id)}
                        isLoading={isRunning}
                        variant="primary"
                        size="sm"
                        icon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                      >
                        {isRunning ? 'Remediating...' : 'Run Auto-Cleanup Rule'}
                      </AnimatedButton>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
