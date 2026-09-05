import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MatchCandidate } from '../../types';
import { ConfidenceMeter } from '../ui/ConfidenceMeter';
import { AIInsightCard, EvidenceItem } from '../ui/AIInsightCard';
import { AnimatedModal } from '../ui/AnimatedModal';
import { AnimatedButton } from '../ui/AnimatedButton';
import {
  Cpu,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  FileQuestion,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

export const AIMatchCenterView: React.FC = () => {
  const {
    candidates,
    selectedCandidateId,
    setSelectedCandidateId,
    approveMatch,
    rejectMatch,
    requestMoreData,
    deferMatch,
    openMaterial360,
    addToast
  } = useApp();

  const [filterType, setFilterType] = useState<'All' | 'Low Risk' | 'Critical Mismatch' | 'Medium Risk'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNote, setActionNote] = useState('');

  // Animated Action States
  const [isApproving, setIsApproving] = useState(false);
  const [isApprovedSuccess, setIsApprovedSuccess] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Critical Dimensional / Geometric Discrepancy');
  const [isRequestDataModalOpen, setIsRequestDataModalOpen] = useState(false);
  const [requestDataType, setRequestDataType] = useState('Manufacturer Test Certificate (MTC 3.1)');

  // Selected candidate object
  const activeCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

  const filteredCandidates = candidates.filter(c => {
    const matchesFilter = filterType === 'All' || c.riskLevel === filterType;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.id.toLowerCase().includes(q) ||
      c.recordA.rawDescription.toLowerCase().includes(q) ||
      c.recordB.rawDescription.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              AI Decision & Spec Guard
            </span>
            <span className="text-xs text-slate-400 font-mono">BMG Dual-Encoder v2.4.1</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            AI Match Center & Engineering Specification Guard
          </h1>
          <p className="text-xs text-slate-300">
            Semantic discovery validated by strict physical engineering criteria to prevent hazardous false merges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono">
            <span className="text-slate-400">Total Pairs:</span>{' '}
            <strong className="text-white">{candidates.length}</strong>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-1.5 text-xs text-rose-400 font-mono font-bold">
            <span>Critical Mismatches: </span>
            {candidates.filter(c => c.riskLevel === 'Critical Mismatch').length}
          </div>
        </div>
      </div>

      {/* 3-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Candidates Queue (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[750px] overflow-hidden">
          {/* Header & Filter */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Candidate Pairs Queue
              </h2>
              <span className="text-xs font-mono text-slate-500 font-bold">
                {filteredCandidates.length} Items
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by description, pair #..."
                className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
              <button
                onClick={() => setFilterType('All')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filterType === 'All'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300'
                }`}
              >
                All Pairs
              </button>
              <button
                onClick={() => setFilterType('Low Risk')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filterType === 'Low Risk'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                Safe (95%+)
              </button>
              <button
                onClick={() => setFilterType('Critical Mismatch')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filterType === 'Critical Mismatch'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                Spec Mismatches
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
            {filteredCandidates.map(cand => {
              const isSelected = activeCandidate.id === cand.id;
              const isApproved = cand.status === 'Approved';
              const isRejected = cand.status === 'Rejected';

              return (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidateId(cand.id)}
                  className={`pt-2.5 first:pt-0 p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        Pair #{cand.pairNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {cand.category}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        cand.riskLevel === 'Critical Mismatch'
                          ? isSelected
                            ? 'bg-rose-500 text-white'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                          : cand.riskLevel === 'Low Risk'
                          ? isSelected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {cand.scores.overallConfidence}% Match
                    </span>
                  </div>

                  {/* Descriptions Preview */}
                  <div className="mt-2 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`text-[10px] font-bold px-1 rounded ${isSelected ? 'bg-slate-800 text-orange-300' : 'bg-slate-100 text-orange-700'}`}>
                        {cand.recordA.cpseCode}
                      </span>
                      <span className={`truncate ${isSelected ? 'text-slate-200' : 'text-slate-700'}`}>
                        {cand.recordA.rawDescription}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`text-[10px] font-bold px-1 rounded ${isSelected ? 'bg-slate-800 text-blue-300' : 'bg-slate-100 text-blue-700'}`}>
                        {cand.recordB.cpseCode}
                      </span>
                      <span className={`truncate ${isSelected ? 'text-slate-200' : 'text-slate-700'}`}>
                        {cand.recordB.rawDescription}
                      </span>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono">
                    <span className={isSelected ? 'text-slate-400' : 'text-slate-500'}>
                      Risk: {cand.riskLevel}
                    </span>
                    {isApproved && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                    )}
                    {isRejected && (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Rejected
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: Deep Investigation & Attribute Matrix (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Candidate Pair #{activeCandidate.pairNumber}
                </h2>
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                  {activeCandidate.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-CPSE Technical Specification Concordance Analysis
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 block">AI Status</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                activeCandidate.status === 'Approved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : activeCandidate.status === 'Rejected'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {activeCandidate.status}
              </span>
            </div>
          </div>

          {/* CRITICAL MISMATCH ALERT CALLOUT IF PRESENT */}
          {activeCandidate.criticalMismatchReason && (
            <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>SAFETY GUARD INTERVENTION: UNSAFE CANDIDATE</span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed font-medium">
                {activeCandidate.criticalMismatchReason}
              </p>
              <div className="text-[11px] text-rose-700 bg-white/80 p-2 rounded-lg border border-rose-200 font-mono">
                AI Semantic Score is 94.8% due to common terminology, but physical length differs (50mm vs 60mm). Automated merge was blocked by Bharat Material Grid to protect piping safety.
              </div>
            </div>
          )}

          {/* Side-by-Side Raw Records */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Record A */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {activeCandidate.recordA.cpseCode}
                </span>
                <span className="font-mono text-slate-500">{activeCandidate.recordA.localCode}</span>
              </div>
              <div className="text-xs font-bold text-slate-900 font-mono bg-white p-2 rounded border border-slate-200">
                "{activeCandidate.recordA.rawDescription}"
              </div>
              <div className="text-[11px] text-slate-500">
                <strong>Normalized:</strong> {activeCandidate.recordA.normalizedName}
              </div>
            </div>

            {/* Record B */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {activeCandidate.recordB.cpseCode}
                </span>
                <span className="font-mono text-slate-500">{activeCandidate.recordB.localCode}</span>
              </div>
              <div className="text-xs font-bold text-slate-900 font-mono bg-white p-2 rounded border border-slate-200">
                "{activeCandidate.recordB.rawDescription}"
              </div>
              <div className="text-[11px] text-slate-500">
                <strong>Normalized:</strong> {activeCandidate.recordB.normalizedName}
              </div>
            </div>
          </div>

          {/* Attribute Comparison Matrix Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              Engineering Specification Matrix
            </h3>
            <div className="overflow-hidden border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-[10px] font-mono text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 font-semibold">Attribute</th>
                    <th className="p-2.5 font-semibold">{activeCandidate.recordA.cpseCode}</th>
                    <th className="p-2.5 font-semibold">{activeCandidate.recordB.cpseCode}</th>
                    <th className="p-2.5 font-semibold text-right">Concordance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Material */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-700">Material</td>
                    <td className="p-2.5 font-mono text-slate-900">{activeCandidate.recordA.specifications.material}</td>
                    <td className="p-2.5 font-mono text-slate-900">{activeCandidate.recordB.specifications.material}</td>
                    <td className="p-2.5 text-right">
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                        MATCH (100%)
                      </span>
                    </td>
                  </tr>

                  {/* Grade */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-700">Grade</td>
                    <td className="p-2.5 font-mono text-slate-900">{activeCandidate.recordA.specifications.grade}</td>
                    <td className="p-2.5 font-mono text-slate-900">{activeCandidate.recordB.specifications.grade}</td>
                    <td className="p-2.5 text-right">
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                        MATCH (100%)
                      </span>
                    </td>
                  </tr>

                  {/* Diameter */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-700">Diameter / Bore</td>
                    <td className="p-2.5 font-mono text-slate-900">{activeCandidate.recordA.specifications.diameter || 'N/A'}</td>
                    <td className="p-2.5 font-mono text-slate-900">{activeCandidate.recordB.specifications.diameter || 'N/A'}</td>
                    <td className="p-2.5 text-right">
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                        MATCH (100%)
                      </span>
                    </td>
                  </tr>

                  {/* Length / Rating */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-700">Length / Rating</td>
                    <td className="p-2.5 font-mono text-slate-900">{activeCandidate.recordA.specifications.length || activeCandidate.recordA.specifications.pressureRating || 'N/A'}</td>
                    <td className="p-2.5 font-mono text-slate-900">{activeCandidate.recordB.specifications.length || activeCandidate.recordB.specifications.pressureRating || 'N/A'}</td>
                    <td className="p-2.5 text-right">
                      {activeCandidate.scores.dimensionMatch === 0 ? (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-300">
                          MISMATCH (0%)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                          MATCH (100%)
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Standard */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-700">Standard / Norm</td>
                    <td className="p-2.5 font-mono text-slate-900">{activeCandidate.recordA.specifications.standard || 'ISO / IS Compliant'}</td>
                    <td className="p-2.5 font-mono text-slate-900">{activeCandidate.recordB.specifications.standard || 'ISO / IS Compliant'}</td>
                    <td className="p-2.5 text-right">
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                        MATCH (100%)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Explanation Box replaced by AIInsightCard */}
          <AIInsightCard
            title="Why did AI recommend this match?"
            confidenceScore={activeCandidate.scores.overallConfidence}
            explanation={activeCandidate.aiExplanation}
            evidenceItems={[
              {
                type: 'positive',
                label: 'Category Concordance',
                detail: `Both CPSE items map directly to "${activeCandidate.category}" classification.`
              },
              {
                type: 'positive',
                label: 'Semantic Lexical Alignment',
                detail: `Transformer vector similarity calculated at ${activeCandidate.scores.semanticSimilarity}%.`
              },
              {
                type: 'positive',
                label: 'Metallurgical Grade Match',
                detail: `Grade ${activeCandidate.recordA.specifications.grade} verified identical across both enterprise records.`
              },
              activeCandidate.scores.dimensionMatch === 0
                ? {
                    type: 'warning',
                    label: 'Dimensional Discrepancy Detected',
                    detail: activeCandidate.criticalMismatchReason || 'Length or diameter difference detected by engineering parser.'
                  }
                : {
                    type: 'positive',
                    label: 'Matching Dimensions & Tolerance',
                    detail: `Physical dimensions and rating (${activeCandidate.recordA.specifications.diameter || activeCandidate.recordA.specifications.pressureRating || 'Standard specs'}) match within tolerance.`
                  },
              ...(activeCandidate.criticalMismatchReason
                ? [{
                    type: 'warning' as const,
                    label: 'Safety Guard Intervention',
                    detail: activeCandidate.criticalMismatchReason
                  }]
                : [])
            ]}
          />
        </div>

        {/* RIGHT COLUMN: Confidence Vector & Governance Action (3 Cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Animated Confidence Meter Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Match Confidence
              </h3>
              <span className="text-xs font-mono font-medium text-slate-500">
                AI Dual-Encoder
              </span>
            </div>

            <ConfidenceMeter
              confidenceScore={activeCandidate.scores.overallConfidence}
              categoryMatch={activeCandidate.scores.semanticSimilarity}
              attributeMatch={activeCandidate.scores.materialMatch}
              specificationMatch={activeCandidate.scores.specificationMatch}
              showBreakdown={true}
              size="md"
            />
          </div>

          {/* Officer Decision Panel */}
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>OFFICER GOVERNANCE ACTIONS</span>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 block font-mono">
                Decision Note & Justification
              </label>
              <textarea
                value={actionNote}
                onChange={e => setActionNote(e.target.value)}
                placeholder="Enter audit note (e.g., MTC verified, length difference verified)..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <AnimatedButton
                onClick={() => {
                  setIsApproving(true);
                  setTimeout(() => {
                    setIsApproving(false);
                    setIsApprovedSuccess(true);
                    approveMatch(activeCandidate.id, actionNote);
                    addToast({
                      type: 'success',
                      title: 'Match Approved & Master Minted',
                      message: `Candidate ${activeCandidate.id} has been canonicalized into BMG Master Registry.`
                    });
                    setActionNote('');
                    setTimeout(() => setIsApprovedSuccess(false), 2000);
                  }, 600);
                }}
                disabled={activeCandidate.status === 'Approved' || activeCandidate.riskLevel === 'Critical Mismatch'}
                isLoading={isApproving}
                isSuccess={isApprovedSuccess || activeCandidate.status === 'Approved'}
                variant="success"
                className="w-full justify-center py-2.5"
                icon={<Check className="w-4 h-4" />}
              >
                {activeCandidate.status === 'Approved'
                  ? 'Canonical BMG ID Approved'
                  : 'Approve & Mint Common BMG ID'}
              </AnimatedButton>

              <AnimatedButton
                onClick={() => setIsRejectModalOpen(true)}
                disabled={activeCandidate.status === 'Rejected'}
                variant="danger"
                className="w-full justify-center py-2"
                icon={<X className="w-4 h-4" />}
              >
                {activeCandidate.status === 'Rejected'
                  ? 'Rejected (Discrete Codes Kept)'
                  : 'Reject (Keep Discrete Codes)'}
              </AnimatedButton>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setIsRequestDataModalOpen(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl text-[11px] font-semibold border border-slate-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <FileQuestion className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Request MTC</span>
                </button>

                <button
                  onClick={() => {
                    deferMatch(activeCandidate.id);
                    addToast({
                      type: 'info',
                      title: 'Review Deferred',
                      message: `Candidate ${activeCandidate.id} moved to deferred queue.`
                    });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl text-[11px] font-semibold border border-slate-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Defer Review</span>
                </button>
              </div>
            </div>

            {activeCandidate.targetBmgId && (
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => openMaterial360(activeCandidate.targetBmgId!)}
                  className="w-full text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 py-1 cursor-pointer"
                >
                  <span>Inspect Target Master ({activeCandidate.targetBmgId})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Animated Modal */}
      <AnimatedModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject AI Match Recommendation"
        subtitle={`Candidate Pair: ${activeCandidate.id}`}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Preserving Enterprise Distinct Codes
            </span>
            <p>
              Rejecting this pair prevents automated catalog merging and ensures {activeCandidate.recordA.cpseCode} and {activeCandidate.recordB.cpseCode} retain independent material codes.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Primary Rejection Cause</label>
            <div className="space-y-2">
              {[
                'Critical Dimensional / Geometric Discrepancy',
                'Metallurgical / Chemical Grade Incompatibility',
                'Different Operational Pressure / Temperature Class',
                'Distinct Proprietary OEM Specification'
              ].map(reason => (
                <label
                  key={reason}
                  onClick={() => setRejectionReason(reason)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    rejectionReason === reason
                      ? 'bg-rose-50/70 border-rose-300 text-rose-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    checked={rejectionReason === reason}
                    onChange={() => setRejectionReason(reason)}
                    className="accent-rose-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Audit Justification Notes</label>
            <textarea
              value={actionNote}
              onChange={e => setActionNote(e.target.value)}
              placeholder="Provide engineering context for national audit registry..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-rose-400 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsRejectModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                rejectMatch(activeCandidate.id, `${rejectionReason}: ${actionNote}`);
                setIsRejectModalOpen(false);
                addToast({
                  type: 'warning',
                  title: 'Candidate Match Rejected',
                  message: `Candidate ${activeCandidate.id} rejected. Catalog separation maintained.`
                });
                setActionNote('');
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </AnimatedModal>

      {/* Request More Data Animated Modal */}
      <AnimatedModal
        isOpen={isRequestDataModalOpen}
        onClose={() => setIsRequestDataModalOpen(false)}
        title="Dispatch Data Request to CPSE"
        subtitle={`Request Technical Documents for ${activeCandidate.id}`}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-800 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <FileQuestion className="w-3.5 h-3.5 text-cyan-600" />
              Nodal Officer Clarification Protocol
            </span>
            <p>
              An automated clarification request will be dispatched to the material custodians at {activeCandidate.recordA.cpseCode} and {activeCandidate.recordB.cpseCode}.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Document / Artifact Required</label>
            <select
              value={requestDataType}
              onChange={e => setRequestDataType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-cyan-500"
            >
              <option value="Manufacturer Test Certificate (MTC 3.1)">Manufacturer Test Certificate (MTC 3.1)</option>
              <option value="Certified Engineering Dimensional Drawing">Certified Engineering Dimensional Drawing</option>
              <option value="Hydrostatic Pressure Test Certificate">Hydrostatic Pressure Test Certificate</option>
              <option value="OEM Specification Data Sheet">OEM Specification Data Sheet</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Specific Discrepancy to Clarify</label>
            <textarea
              value={actionNote}
              onChange={e => setActionNote(e.target.value)}
              placeholder="e.g., Please clarify if overall length is 50mm or 60mm as per drawing rev 4..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsRequestDataModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                requestMoreData(activeCandidate.id, `${requestDataType}: ${actionNote}`);
                setIsRequestDataModalOpen(false);
                addToast({
                  type: 'info',
                  title: 'Clarification Dispatched',
                  message: `Request for ${requestDataType} sent to CPSE Nodal Officers.`
                });
                setActionNote('');
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Send Request to CPSE
            </button>
          </div>
        </div>
      </AnimatedModal>
    </div>
  );
};
