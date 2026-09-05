import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../ui/StatusBadge';
import { AnimatedButton } from '../ui/AnimatedButton';
import { EmptyState } from '../ui/EmptyState';
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileQuestion,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
  FileText
} from 'lucide-react';

export const ReviewQueueView: React.FC = () => {
  const {
    reviews,
    approveMatch,
    rejectMatch,
    requestMoreData,
    deferMatch,
    openCandidateMatch,
    openMaterial360
  } = useApp();

  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'High Priority' | 'Needs More Data' | 'Approved' | 'Rejected'>('Pending');
  const [search, setSearch] = useState('');

  const filteredReviews = reviews.filter(r => {
    const matchesTab =
      activeTab === 'All'
        ? true
        : activeTab === 'Pending'
        ? r.status === 'Pending' || r.status === 'High Priority'
        : r.status === activeTab;

    const q = search.toLowerCase();
    const matchesSearch =
      r.id.toLowerCase().includes(q) ||
      r.candidate.recordA.rawDescription.toLowerCase().includes(q) ||
      r.candidate.recordB.rawDescription.toLowerCase().includes(q) ||
      r.assignedRole.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Human-in-the-Loop Governance
            </span>
            <span className="text-xs text-slate-400 font-mono">Resolution SLA: 1.8 Days</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            Material Master Officer Review Queue
          </h1>
          <p className="text-xs text-slate-300">
            Ambiguous match pairs and safety-flagged candidates requiring engineering sign-off.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-1.5 text-xs text-slate-300 font-mono">
            <span>Pending Review: </span>
            <strong className="text-emerald-400 font-bold ml-1">
              {reviews.filter(r => r.status === 'Pending' || r.status === 'High Priority').length}
            </strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {(['Pending', 'High Priority', 'Needs More Data', 'Approved', 'Rejected', 'All'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab} ({reviews.filter(r => (tab === 'All' ? true : tab === 'Pending' ? r.status === 'Pending' || r.status === 'High Priority' : r.status === tab)).length})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search review tickets..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Review Items Grid / List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="Queue is completely clear"
            description="No review tickets matching active status filter."
          />
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredReviews.map(item => {
              const isApproved = item.status === 'Approved';
              const isRejected = item.status === 'Rejected';

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs transition-all space-y-4"
                >
                  {/* Item Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                        {item.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Candidate Pair #{item.candidate.pairNumber}
                      </span>
                      <StatusBadge
                        status={
                          item.priority === 'Critical'
                            ? 'danger'
                            : item.priority === 'High'
                            ? 'warning'
                            : 'neutral'
                        }
                        label={`${item.priority} Priority`}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                      <span>Assigned: <strong>{item.assignedRole}</strong></span>
                      <span>•</span>
                      <span>Submitted: {item.submittedAt}</span>
                    </div>
                  </div>

                  {/* Side-by-Side CPSE Comparison Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Record A */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">{item.candidate.recordA.cpseName} ({item.candidate.recordA.cpseCode})</span>
                        <span className="font-mono text-slate-500">{item.candidate.recordA.localCode}</span>
                      </div>
                      <div className="text-xs font-mono font-semibold text-slate-900 bg-white p-2 rounded border border-slate-200">
                        {item.candidate.recordA.rawDescription}
                      </div>
                      <div className="text-[11px] text-slate-500 pt-1">
                        <strong>Material Spec:</strong> {item.candidate.recordA.specifications.material} ({item.candidate.recordA.specifications.grade}) • {item.candidate.recordA.specifications.diameter || ''} {item.candidate.recordA.specifications.length || ''}
                      </div>
                    </div>

                    {/* Record B */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">{item.candidate.recordB.cpseName} ({item.candidate.recordB.cpseCode})</span>
                        <span className="font-mono text-slate-500">{item.candidate.recordB.localCode}</span>
                      </div>
                      <div className="text-xs font-mono font-semibold text-slate-900 bg-white p-2 rounded border border-slate-200">
                        {item.candidate.recordB.rawDescription}
                      </div>
                      <div className="text-[11px] text-slate-500 pt-1">
                        <strong>Material Spec:</strong> {item.candidate.recordB.specifications.material} ({item.candidate.recordB.specifications.grade}) • {item.candidate.recordB.specifications.diameter || ''} {item.candidate.recordB.specifications.length || ''}
                      </div>
                    </div>
                  </div>

                  {/* Difference Analysis & Recommendation */}
                  <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Engineering Difference Analysis</span>
                      <span className="font-mono text-[11px] text-emerald-700 font-bold">AI Confidence: {item.candidate.scores.overallConfidence}%</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                      {item.differenceAnalysis.map((diff, idx) => (
                        <li key={idx} className="leading-relaxed">{diff}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => openCandidateMatch(item.candidateId)}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <span>Inspect in AI Match Center</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {!isApproved && !isRejected && (
                        <>
                          <AnimatedButton
                            onClick={() => requestMoreData(item.candidateId)}
                            variant="secondary"
                            size="sm"
                            icon={<FileText className="w-3.5 h-3.5" />}
                          >
                            Request MTC
                          </AnimatedButton>
                          <AnimatedButton
                            onClick={() => rejectMatch(item.candidateId)}
                            variant="danger"
                            size="sm"
                            icon={<X className="w-3.5 h-3.5" />}
                          >
                            Reject Match
                          </AnimatedButton>
                          <AnimatedButton
                            onClick={() => approveMatch(item.candidateId)}
                            disabled={item.candidate.riskLevel === 'Critical Mismatch'}
                            variant="success"
                            size="sm"
                            icon={<Check className="w-3.5 h-3.5" />}
                          >
                            Approve & Mint ID
                          </AnimatedButton>
                        </>
                      )}

                      {isApproved && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approved by {item.actionTakenBy}</span>
                        </span>
                      )}

                      {isRejected && (
                        <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" />
                          <span>Rejected (Preserved Separate Items)</span>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
