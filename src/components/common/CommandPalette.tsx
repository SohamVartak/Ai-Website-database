import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Database,
  Building,
  Cpu,
  TrendingUp,
  Layers,
  Sparkles,
  ArrowRight,
  X,
  Play
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    commonMaterials,
    cpses,
    candidates,
    procurementOpportunities,
    setCurrentTab,
    openMaterial360,
    openCandidateMatch,
    setSelectedCPSEId,
    setSelectedOpportunityId,
    startSIHDemo
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter materials
  const matchedMaterials = commonMaterials.filter(
    m =>
      m.bmgCode.toLowerCase().includes(q) ||
      m.standardName.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.specifications.grade.toLowerCase().includes(q)
  );

  // Filter CPSEs
  const matchedCPSEs = cpses.filter(
    c =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q)
  );

  // Filter Candidates
  const matchedCandidates = candidates.filter(
    c =>
      c.id.toLowerCase().includes(q) ||
      c.recordA.rawDescription.toLowerCase().includes(q) ||
      c.recordB.rawDescription.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );

  // Filter Opportunities
  const matchedOpps = procurementOpportunities.filter(
    o =>
      o.id.toLowerCase().includes(q) ||
      o.title.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center">
      {/* Backdrop */}
      <div
        onClick={() => setIsCommandPaletteOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-[#000a1e] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input Box */}
        <div className="flex items-center px-4 border-b border-slate-800 bg-slate-900/90">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search canonical materials, CPSEs, AI match pairs, opportunities... (ESC to exit)"
            className="w-full bg-transparent px-3 py-4 text-sm text-white placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Quick Actions if query empty */}
          {!query && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 font-mono">
                Suggested System Actions
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    startSIHDemo();
                  }}
                  className="flex items-center gap-3 p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-amber-300">Start SIH End-to-End Demo</div>
                    <div className="text-[11px] text-slate-400">10-step full harmonization walkthrough</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    openCandidateMatch('CAND-8492');
                  }}
                  className="flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Inspect AI Match Pair #8492</div>
                    <div className="text-[11px] text-slate-400">96.2% confidence ISO 4014 match</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    openMaterial360('BMG-FST-000001284');
                  }}
                  className="flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">View Material 360 (SS Bolt)</div>
                    <div className="text-[11px] text-slate-400">Multi-CPSE cross mappings & specs</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    setCurrentTab('upload');
                  }}
                  className="flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <Database className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Upload CPSE Catalog</div>
                    <div className="text-[11px] text-slate-400">Schema mapping & automated pipeline</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Matched Common Materials */}
          {matchedMaterials.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 font-mono flex items-center gap-1.5">
                <Database className="w-3 h-3 text-amber-400" />
                <span>Common Canonical Materials ({matchedMaterials.length})</span>
              </div>
              {matchedMaterials.slice(0, 4).map(m => (
                <div
                  key={m.id}
                  onClick={() => {
                    openMaterial360(m.id);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs font-bold">
                      {m.category.substring(0, 3)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                        {m.standardName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {m.bmgCode} • {m.specifications.grade} • {m.mappings.length} CPSEs Mapped
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          )}

          {/* Matched Candidates */}
          {matchedCandidates.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 font-mono flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>AI Candidate Match Pairs ({matchedCandidates.length})</span>
              </div>
              {matchedCandidates.slice(0, 3).map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    openCandidateMatch(c.id);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Pair #{c.pairNumber}: {c.recordA.cpseCode} ↔ {c.recordB.cpseCode}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        c.riskLevel === 'Critical Mismatch'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {c.scores.overallConfidence}% Match
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-md mt-0.5">
                      {c.recordA.rawDescription} vs {c.recordB.rawDescription}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          )}

          {/* Matched CPSEs */}
          {matchedCPSEs.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 font-mono flex items-center gap-1.5">
                <Building className="w-3 h-3 text-indigo-400" />
                <span>CPSE Enterprises ({matchedCPSEs.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedCPSEs.slice(0, 4).map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCPSEId(c.id);
                      setCurrentTab('cpse');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center gap-3 transition-colors cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                      {c.code.substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate group-hover:text-indigo-300">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.recordsUploaded.toLocaleString()} records • {c.qualityScore}% quality</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Opportunities */}
          {matchedOpps.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 font-mono flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>Procurement Opportunities ({matchedOpps.length})</span>
              </div>
              {matchedOpps.slice(0, 2).map(o => (
                <div
                  key={o.id}
                  onClick={() => {
                    setSelectedOpportunityId(o.id);
                    setCurrentTab('procurement');
                    setIsCommandPaletteOpen(false);
                  }}
                  className="p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300">{o.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {o.participatingCPSEs.join(', ')} • Projected Savings: ₹{(o.projectedSavingsINR / 10000000).toFixed(2)} Cr ({o.projectedSavingsPercent}%)
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-all" />
                </div>
              ))}
            </div>
          )}

          {query && matchedMaterials.length === 0 && matchedCandidates.length === 0 && matchedCPSEs.length === 0 && matchedOpps.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-slate-600" />
              <div className="text-xs font-medium">No direct matches found for "{query}"</div>
              <div className="text-[11px] text-slate-500 mt-1">Try searching by material grade (SS304), standard (ISO 4014), or CPSE code (IOCL).</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Navigate <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">↑</kbd> <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">↓</kbd></span>
            <span>Select <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">↵</kbd></span>
          </div>
          <span className="font-mono">Bharat Material Grid Intelligence Search</span>
        </div>
      </div>
    </div>
  );
};
