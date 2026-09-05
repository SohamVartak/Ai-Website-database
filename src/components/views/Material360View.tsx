import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../ui/StatusBadge';
import { ProgressBar } from '../ui/ProgressBar';
import {
  Eye,
  Database,
  Building,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  FileText,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Share2
} from 'lucide-react';

export const Material360View: React.FC = () => {
  const {
    commonMaterials,
    selectedMaterialId,
    setSelectedMaterialId,
    setCurrentTab,
    startSIHDemo
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'mappings' | 'audit'>('overview');

  const activeMaterial = commonMaterials.find(m => m.id === selectedMaterialId) || commonMaterials[0];

  const totalDemand = activeMaterial.mappings.reduce((acc, m) => acc + m.annualDemand, 0);
  const minPrice = Math.min(...activeMaterial.mappings.map(m => m.unitPrice));
  const maxPrice = Math.max(...activeMaterial.mappings.map(m => m.unitPrice));
  const priceDisparityPercent = (((maxPrice - minPrice) / minPrice) * 100).toFixed(1);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                Flagship Material 360 View
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeMaterial.version} • {activeMaterial.category}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {activeMaterial.standardName}
              </h1>
              <span className="font-mono text-sm font-bold bg-slate-800 border border-slate-700 text-emerald-300 px-2.5 py-0.5 rounded-lg">
                {activeMaterial.bmgCode}
              </span>
            </div>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {activeMaterial.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Material Switcher */}
            <select
              value={activeMaterial.id}
              onChange={e => setSelectedMaterialId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs font-mono rounded-xl px-3 py-2 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
            >
              {commonMaterials.map(m => (
                <option key={m.id} value={m.id}>
                  {m.bmgCode} - {m.standardName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Summary Stat Strip */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] block">Aggregated Annual Demand</span>
            <span className="text-white font-bold text-base">
              {totalDemand.toLocaleString()} {activeMaterial.specifications.uom}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] block">Price Disparity Spread</span>
            <span className="text-amber-400 font-bold text-base">
              ₹{minPrice} - ₹{maxPrice} ({priceDisparityPercent}%)
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] block">Potential Savings</span>
            <span className="text-emerald-400 font-bold text-base">
              {activeMaterial.potentialSavingsPercent}% Bulk Rebate
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] block">Mapped CPSEs</span>
            <span className="text-cyan-400 font-bold text-base">
              {activeMaterial.mappings.length} Enterprises
            </span>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Specifications & Price Spread
        </button>
        <button
          onClick={() => setActiveSubTab('mappings')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'mappings'
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          CPSE Mappings ({activeMaterial.mappings.length})
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'audit'
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Integrity Audit & HSM Signatures
        </button>
      </div>

      {/* Main 2-Column Analytics Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeMaterial.id}-${activeSubTab}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeSubTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Engineering Specifications Card */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                    Technical Specifications
                  </h2>
                  <StatusBadge status="success" label="Verified ISO/IS Standard" size="sm" />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Material Composition</span>
                    <span className="font-bold text-slate-900">{activeMaterial.specifications.material}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Metallurgical Grade</span>
                    <span className="font-mono font-bold text-slate-900">{activeMaterial.specifications.grade}</span>
                  </div>
                  {activeMaterial.specifications.diameter && (
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Nominal Size / Diameter</span>
                      <span className="font-mono font-bold text-slate-900">{activeMaterial.specifications.diameter}</span>
                    </div>
                  )}
                  {activeMaterial.specifications.length && (
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Length</span>
                      <span className="font-mono font-bold text-slate-900">{activeMaterial.specifications.length}</span>
                    </div>
                  )}
                  {activeMaterial.specifications.pressureRating && (
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Pressure Class</span>
                      <span className="font-mono font-bold text-slate-900">{activeMaterial.specifications.pressureRating}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Standard Norm</span>
                    <span className="font-bold text-slate-900">{activeMaterial.specifications.standard || 'ISO 4014 / DIN 931'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Operating Temperature</span>
                    <span className="font-mono text-slate-700">{activeMaterial.specifications.temperatureRange || '-20°C to +300°C'}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Spread Analysis */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                    Multi-CPSE Price Spread
                  </h2>
                  <StatusBadge status="warning" label={`₹${maxPrice - minPrice} Disparity`} size="sm" />
                </div>

                <div className="space-y-3">
                  {activeMaterial.mappings.map(map => {
                    const percentOfMax = (map.unitPrice / maxPrice) * 100;
                    return (
                      <div key={map.cpseCode} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="font-bold text-slate-800">{map.cpseName} ({map.cpseCode})</span>
                          <span className="font-bold text-slate-900">₹{map.unitPrice.toFixed(2)}</span>
                        </div>
                        <ProgressBar
                          value={percentOfMax}
                          max={100}
                          variant={map.unitPrice === minPrice ? 'emerald' : map.unitPrice === maxPrice ? 'danger' : 'amber'}
                          size="sm"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                  <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Aggregated Rate Contract Target: ₹{(minPrice * 0.88).toFixed(2)}</span>
                  </div>
                  <p className="text-emerald-700 text-[11px]">
                    Pooling annual volume guarantees Tier-3 manufacturer bulk rate across all 4 enterprises.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'mappings' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">CPSE Cross-Reference Directory</h2>
                  <p className="text-xs text-slate-500">Live mapped legacy codes harmonized into {activeMaterial.bmgCode}</p>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                  {activeMaterial.mappings.length} Active Feeds
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-mono">
                      <th className="pb-3 font-semibold">CPSE</th>
                      <th className="pb-3 font-semibold">Local Code</th>
                      <th className="pb-3 font-semibold">Legacy Description</th>
                      <th className="pb-3 font-semibold text-right">Annual Demand</th>
                      <th className="pb-3 font-semibold text-right">Lead Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeMaterial.mappings.map(map => (
                      <tr key={map.cpseCode} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 font-bold text-slate-900">
                          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono">
                            {map.cpseCode}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-slate-700 font-semibold">{map.localMaterialCode}</td>
                        <td className="py-3.5 text-slate-800 font-mono text-[11px] max-w-xs truncate">
                          {map.localDescription}
                        </td>
                        <td className="py-3.5 text-right font-mono font-bold text-slate-900">
                          {map.annualDemand.toLocaleString()} {map.localUOM}
                        </td>
                        <td className="py-3.5 text-right font-mono text-slate-600">
                          {map.leadTimeDays} Days
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'audit' && (
            <div className="bg-slate-950 text-slate-300 rounded-2xl p-6 border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm">GOVERNMENT SOVEREIGN INTEGRITY AUDIT</span>
                </div>
                <span className="text-xs text-slate-400">Approved: {activeMaterial.approvedAt}</span>
              </div>
              <div className="text-xs text-slate-400 break-all p-3 bg-slate-900 rounded-xl border border-slate-800">
                Verification Hash: <span className="text-emerald-300">sha256:8f9a2b7c4d1e3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block">Authoritative Board</span>
                  <span className="text-white font-bold">{activeMaterial.approvedBy}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block">Security Standard</span>
                  <span className="text-emerald-400 font-bold">Signed with Enterprise HSM Tier-4</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
