import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../ui/StatusBadge';
import { AnimatedButton } from '../ui/AnimatedButton';
import {
  TrendingUp,
  Sparkles,
  Layers,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  DollarSign,
  PieChart,
  BarChart3
} from 'lucide-react';

export const ProcurementView: React.FC = () => {
  const {
    procurementOpportunities,
    selectedOpportunityId,
    setSelectedOpportunityId,
    openMaterial360
  } = useApp();

  const activeOpportunity =
    procurementOpportunities.find(o => o.id === selectedOpportunityId) ||
    procurementOpportunities[0];

  // What-If Simulator state
  const [demandMultiplier, setDemandMultiplier] = useState<number>(1.2);
  const [baseRebate, setBaseRebate] = useState<number>(activeOpportunity.projectedSavingsPercent);
  const [vendorTenderType, setVendorTenderType] = useState<'National Reverse Auction' | 'GeM Rate Contract' | 'CPSE Joint Consortium'>('GeM Rate Contract');

  const simulatedSavingsPercent = Math.min(35, Math.round(baseRebate * (demandMultiplier >= 1.2 ? 1.15 : 1.0)));
  const simulatedVolumeTotal = Math.round(activeOpportunity.totalQuantity * demandMultiplier);
  const simulatedSavingsINR = Math.round(activeOpportunity.projectedSavingsINR * demandMultiplier * (simulatedSavingsPercent / activeOpportunity.projectedSavingsPercent));

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Procurement Intelligence
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Aggregated GeM & National Rate Contracts
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            National Material Aggregation & Savings Workspace
          </h1>
          <p className="text-xs text-slate-300">
            Harmonized master data enables cross-CPSE demand pooling and bulk manufacturer discounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-xs font-mono">
            <span className="text-slate-400 block text-[10px]">Total Potential Savings</span>
            <strong className="text-emerald-400 text-sm font-bold">
              ₹{(procurementOpportunities.reduce((acc, p) => acc + p.projectedSavingsINR, 0) / 10000000).toFixed(2)} Crore
            </strong>
          </div>
        </div>
      </div>

      {/* Grid: Left Opportunities List, Right What-If Simulator & Deep View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Opportunities List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              High-Impact Joint Opportunities
            </h2>
            <span className="text-xs font-mono text-slate-500 font-bold">
              {procurementOpportunities.length} Active Deals
            </span>
          </div>

          <div className="space-y-3">
            {procurementOpportunities.map(opp => {
              const isSelected = activeOpportunity.id === opp.id;
              return (
                <motion.div
                  key={opp.id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => {
                    setSelectedOpportunityId(opp.id);
                    setBaseRebate(opp.projectedSavingsPercent);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                          {opp.id}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {opp.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">
                        {opp.title}
                      </h3>
                    </div>

                    <StatusBadge
                      status="success"
                      label={`-${opp.projectedSavingsPercent}%`}
                      size="sm"
                    />
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {opp.rationale}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Participating CPSEs</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {opp.participatingCPSEs.map(c => (
                          <span key={c} className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Annual Savings</span>
                      <strong className="text-emerald-700 text-xs font-bold">
                        ₹{(opp.projectedSavingsINR / 10000000).toFixed(2)} Cr
                      </strong>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Opportunity Deep Workspace & What-If Simulator (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Deal Detail Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  {activeOpportunity.bmgCode}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  {activeOpportunity.title}
                </h2>
              </div>

              <AnimatedButton
                onClick={() => openMaterial360(activeOpportunity.bmgCode)}
                variant="outline"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Inspect Material 360
              </AnimatedButton>
            </div>

            {/* CPSE Breakdown Table */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono mb-2">
                CPSE Demand Contribution
              </h3>
              <div className="overflow-hidden border border-slate-200 rounded-xl text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-mono text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 font-semibold">CPSE Entity</th>
                      <th className="p-2.5 font-semibold text-right">Volume</th>
                      <th className="p-2.5 font-semibold text-right">Legacy Price</th>
                      <th className="p-2.5 font-semibold text-right">Harmonized Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {activeOpportunity.participatingCPSEs.map(c => (
                      <tr key={c} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{c}</td>
                        <td className="p-2.5 text-right font-medium text-slate-700">
                          {Math.round(activeOpportunity.totalQuantity / activeOpportunity.participatingCPSEs.length).toLocaleString()} {activeOpportunity.uom}
                        </td>
                        <td className="p-2.5 text-right text-rose-600 font-semibold">
                          ₹{(activeOpportunity.estimatedCostINR / activeOpportunity.totalQuantity).toFixed(0)}
                        </td>
                        <td className="p-2.5 text-right text-emerald-600 font-bold">
                          ₹{((activeOpportunity.estimatedCostINR / activeOpportunity.totalQuantity) * (1 - activeOpportunity.projectedSavingsPercent / 100)).toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* WHAT-IF SIMULATOR ENGINE */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-400">
                    Interactive What-If Savings Simulator
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  Live Dynamic Modeling
                </span>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Demand Aggregation Scale:</span>
                    <strong className="text-white">+{Math.round((demandMultiplier - 1) * 100)}% Volume</strong>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="2.0"
                    step="0.1"
                    value={demandMultiplier}
                    onChange={e => setDemandMultiplier(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Tender Vehicle:</span>
                    <strong className="text-cyan-400">{vendorTenderType}</strong>
                  </div>
                  <select
                    value={vendorTenderType}
                    onChange={e => setVendorTenderType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-mono focus:outline-hidden"
                  >
                    <option value="GeM Rate Contract">GeM Rate Contract</option>
                    <option value="National Reverse Auction">National Reverse Auction</option>
                    <option value="CPSE Joint Consortium">CPSE Joint Consortium</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Outcome Results Strip */}
              <div className="grid grid-cols-3 gap-2 font-mono text-center pt-2 border-t border-slate-800">
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <div className="text-[10px] text-slate-400">Simulated Quantity</div>
                  <motion.div
                    key={simulatedVolumeTotal}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-sm font-bold text-white mt-0.5"
                  >
                    {simulatedVolumeTotal.toLocaleString()} {activeOpportunity.uom}
                  </motion.div>
                </div>

                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <div className="text-[10px] text-slate-400">Projected Discount</div>
                  <motion.div
                    key={simulatedSavingsPercent}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-sm font-bold text-cyan-400 mt-0.5"
                  >
                    {simulatedSavingsPercent}%
                  </motion.div>
                </div>

                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <div className="text-[10px] text-slate-400">Fiscal Savings</div>
                  <motion.div
                    key={simulatedSavingsINR}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-sm font-bold text-emerald-400 mt-0.5"
                  >
                    ₹{(simulatedSavingsINR / 10000000).toFixed(2)} Cr
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
