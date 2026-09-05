import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../ui/KPICard';
import {
  Layers,
  Database,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Building,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  FileCheck,
  RefreshCw,
  Clock,
  ChevronRight,
  Filter
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    cpses,
    commonMaterials,
    candidates,
    reviews,
    procurementOpportunities,
    setCurrentTab,
    openCandidateMatch,
    openMaterial360,
    setSelectedCPSEId,
    setSelectedOpportunityId,
    startSIHDemo
  } = useApp();

  const [sectorFilter, setSectorFilter] = useState<string>('All');

  // Aggregated calculations
  const totalUploaded = cpses.reduce((acc, c) => acc + c.recordsUploaded, 0);
  const totalNormalized = cpses.reduce((acc, c) => acc + c.recordsNormalized, 0);
  const totalMatched = cpses.reduce((acc, c) => acc + c.recordsMatched, 0);
  const totalReviewBacklog = cpses.reduce((acc, c) => acc + c.reviewBacklog, 0);
  const avgQualityScore = +(cpses.reduce((acc, c) => acc + c.qualityScore, 0) / cpses.length).toFixed(1);
  const totalSavingsINR = procurementOpportunities.reduce((acc, p) => acc + p.projectedSavingsINR, 0);

  const filteredCPSEs = sectorFilter === 'All'
    ? cpses
    : cpses.filter(c => c.sector === sectorFilter);

  const sectors = ['All', 'Oil & Gas', 'Power', 'Steel', 'Mining', 'Heavy Engineering', 'Petrochemicals'];

  return (
    <div className="p-4 lg:p-7 space-y-6 w-full">
      {/* Top Welcome & National Mesh Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-md uppercase tracking-wider font-mono">
                Govt. of India • Sovereign Data Platform
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium px-2.5 py-0.5 rounded-md font-mono">
                10 CPSE Inter-Enterprise Mesh
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              National Material Intelligence Platform
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl">
              Cross-enterprise AI candidate discovery with engineering specification validation, preventing false-merges across 10 CPSE catalogs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={startSIHDemo}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Interactive Walkthrough</span>
            </button>
            <button
              onClick={() => setCurrentTab('upload')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>Ingest CPSE Batch</span>
            </button>
          </div>
        </div>

        {/* Live Grid Status Metrics Strip */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
            <div>
              <span className="text-slate-500 block text-[10px] font-mono uppercase tracking-wider">Active Nodes</span>
              <span className="text-slate-900 font-bold text-xs">10 / 10 CPSEs Synced</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <Cpu className="w-4 h-4 text-slate-700 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[10px] font-mono uppercase tracking-wider">Spec Guard Engine</span>
              <span className="text-slate-900 font-bold text-xs">v2.4.1 (99.2% Acc)</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[10px] font-mono uppercase tracking-wider">False Merge Rate</span>
              <span className="text-emerald-700 font-bold font-mono text-xs">0.04% (Cleared)</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <TrendingUp className="w-4 h-4 text-slate-700 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[10px] font-mono uppercase tracking-wider">Projected Savings</span>
              <span className="text-slate-900 font-bold font-mono text-xs">₹{(totalSavingsINR / 10000000).toFixed(2)} Crore</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <KPICard
          label="Raw Records Ingested"
          value={totalUploaded}
          trend={{ value: '+12.4% MoM', direction: 'up' }}
          subtitle="Across 10 CPSE ERP instances"
          icon={<Database className="w-4 h-4" />}
          delay={0}
        />

        {/* Card 2 */}
        <KPICard
          label="Normalized & Validated"
          value={totalNormalized}
          trend={{ value: `${((totalNormalized / totalUploaded) * 100).toFixed(1)}% Yield`, direction: 'up' }}
          subtitle="IS / ISO / ASME compliant specs"
          icon={<FileCheck className="w-4 h-4" />}
          progressPercent={+((totalNormalized / totalUploaded) * 100).toFixed(1)}
          progressLabel="Standardization Rate"
          delay={1}
        />

        {/* Card 3 */}
        <KPICard
          label="Approved Master IDs"
          value={18430}
          trend={{ value: 'BMG Mapped', direction: 'neutral' }}
          subtitle="Authoritative national canonical items"
          icon={<CheckCircle2 className="w-4 h-4" />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
          delay={2}
        />

        {/* Card 4 */}
        <KPICard
          label="Human Review Queue"
          value={totalReviewBacklog}
          trend={{ value: 'SLA 1.8 Days', direction: 'neutral' }}
          subtitle="Ambiguous & safety edge cases"
          icon={<AlertTriangle className="w-4 h-4" />}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
          delay={3}
        />
      </div>

      {/* Two Column Section: Harmonization Funnel + AI Decision Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Harmonization Funnel Visualizer */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">National Harmonization Funnel</h2>
              <p className="text-xs text-slate-500 mt-0.5">From chaotic legacy catalog rows to verified national identities</p>
            </div>
            <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md">
              Pipeline Throughput
            </span>
          </div>

          {/* Funnel Steps */}
          <div className="space-y-2.5 pt-1">
            {/* Step 1 */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                  1
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Raw Catalog Ingestion</div>
                  <div className="text-[11px] text-slate-500">Disparate SAP/Oracle CSV dumps from 10 CPSEs</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right font-mono">
                <div>
                  <div className="text-xs font-bold text-slate-900">{totalUploaded.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">100% Ingested</div>
                </div>
                <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-700 h-full w-full rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-700 text-white font-bold text-xs flex items-center justify-center font-mono">
                  2
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Technical Spec Normalization</div>
                  <div className="text-[11px] text-slate-500">Dictionary expansion, UOM metric standard, Regex NER</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right font-mono">
                <div>
                  <div className="text-xs font-bold text-slate-900">{totalNormalized.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-600">89.2% Structured</div>
                </div>
                <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-600 h-full w-[89%] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-700 text-white font-bold text-xs flex items-center justify-center font-mono">
                  3
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">AI Candidate Match Generation</div>
                  <div className="text-[11px] text-slate-500">Dual-encoder transformer semantic clustering</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right font-mono">
                <div>
                  <div className="text-xs font-bold text-slate-900">{totalMatched.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-600">78.5% Cross-Matched</div>
                </div>
                <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-600 h-full w-[78%] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center font-mono">
                  4
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-900">Approved Canonical Identities</div>
                  <div className="text-[11px] text-emerald-700">Spec-verified & Officer governed BMG-XXX codes</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right font-mono">
                <div>
                  <div className="text-xs font-bold text-emerald-900">18,430 BMG IDs</div>
                  <div className="text-[10px] text-emerald-700 font-medium">42% Duplication Eliminated</div>
                </div>
                <div className="w-24 bg-emerald-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-700 h-full w-[58%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Decision Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">AI Decision Governance</h2>
            <p className="text-xs text-slate-500 mt-0.5">Safety breakdown of automated vs governed matches</p>
          </div>

          <div className="space-y-3.5 py-1">
            {/* Auto Standardized */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-800 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Auto-Standardized (Safe)</span>
                </span>
                <span className="font-mono font-bold text-emerald-800">72.4%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[72.4%] rounded-full"></div>
              </div>
              <p className="text-[10px] text-slate-500">100% attribute & specification concordance</p>
            </div>

            {/* Guard Blocked Unsafe */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-800 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  <span>Spec-Guard Blocked (Unsafe)</span>
                </span>
                <span className="font-mono font-bold text-rose-700">17.8%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-600 h-full w-[17.8%] rounded-full"></div>
              </div>
              <p className="text-[10px] text-slate-500">High semantic score but dimension / grade mismatch</p>
            </div>

            {/* Human Review */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-800 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>Governed Human Review</span>
                </span>
                <span className="font-mono font-bold text-slate-800">9.8%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-700 h-full w-[9.8%] rounded-full"></div>
              </div>
              <p className="text-[10px] text-slate-500">Ambiguous technical attributes or non-standard specs</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('ai-match')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Open AI Match & Spec Guard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CPSE Performance Table & High-Value Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CPSE Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">CPSE Master Data Performance</h2>
              <p className="text-xs text-slate-500 mt-0.5">Completeness rates and review status by enterprise</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {sectors.slice(0, 4).map(sec => (
                <button
                  key={sec}
                  onClick={() => setSectorFilter(sec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    sectorFilter === sec
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-mono">
                  <th className="pb-3 font-semibold">CPSE Entity</th>
                  <th className="pb-3 font-semibold">Sector</th>
                  <th className="pb-3 font-semibold text-right">Uploaded</th>
                  <th className="pb-3 font-semibold text-right">Quality Score</th>
                  <th className="pb-3 font-semibold text-right">Completeness</th>
                  <th className="pb-3 font-semibold text-right">Backlog</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCPSEs.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => {
                      setSelectedCPSEId(c.id);
                      setCurrentTab('cpse');
                    }}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 font-bold text-slate-900 flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: c.logoColor }}
                      />
                      <span className="group-hover:text-slate-700 transition-colors">{c.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({c.code})</span>
                    </td>
                    <td className="py-3 text-slate-600 font-normal">{c.sector}</td>
                    <td className="py-3 text-right font-mono font-semibold text-slate-800">
                      {c.recordsUploaded.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono">
                      <span
                        className={`px-2 py-0.5 rounded-md font-semibold border ${
                          c.qualityScore >= 90
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : c.qualityScore >= 80
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {c.qualityScore}%
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-slate-700">
                      {c.completenessRate}%
                    </td>
                    <td className="py-3 text-right font-mono">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-md ${
                          c.reviewBacklog > 500 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-slate-600'
                        }`}
                      >
                        {c.reviewBacklog}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-slate-400 group-hover:text-slate-900 font-semibold flex items-center justify-end gap-1 ml-auto transition-colors">
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Priority Procurement Opportunities Preview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">National Rate Opportunities</h2>
                <p className="text-xs text-slate-500 mt-0.5">Aggregated CPSE volume discounts</p>
              </div>
              <button
                onClick={() => setCurrentTab('procurement')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                <span>All Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 mt-3">
              {procurementOpportunities.slice(0, 3).map(opp => (
                <div
                  key={opp.id}
                  onClick={() => {
                    setSelectedOpportunityId(opp.id);
                    setCurrentTab('procurement');
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-50 transition-all cursor-pointer space-y-2 group shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {opp.id} • {opp.category}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 mt-1 group-hover:text-slate-700 transition-colors">
                        {opp.title}
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                      -{opp.projectedSavingsPercent}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                    <span>{opp.participatingCPSEs.length} CPSEs Pooled</span>
                    <span className="font-semibold text-slate-800">
                      ₹{(opp.projectedSavingsINR / 10000000).toFixed(2)} Cr Savings
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-4.5 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>What-If Savings Simulator</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Simulate bulk rate tenders across 10 CPSEs with custom demand volume rebates.
            </p>
            <button
              onClick={() => setCurrentTab('what-if')}
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer active:scale-95"
            >
              Launch Simulator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
