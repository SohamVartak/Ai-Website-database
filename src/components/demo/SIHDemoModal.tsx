import React from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  ShieldCheck,
  TrendingUp,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Database,
  Eye,
  CheckSquare
} from 'lucide-react';

export const SIHDemoModal: React.FC = () => {
  const {
    isSIHDemoOpen,
    setIsSIHDemoOpen,
    demoStep,
    setDemoStep,
    setCurrentTab,
    openCandidateMatch,
    openMaterial360,
    approveMatch,
    addToast
  } = useApp();

  if (!isSIHDemoOpen) return null;

  const totalSteps = 10;

  const handleNext = () => {
    if (demoStep < totalSteps) {
      const next = demoStep + 1;
      setDemoStep(next);

      // Auto-navigate to matching view for immersive demo feel
      if (next === 2) setCurrentTab('upload');
      if (next === 3) setCurrentTab('quality');
      if (next === 4) setCurrentTab('upload');
      if (next === 5) {
        setCurrentTab('ai-match');
        openCandidateMatch('CAND-8492');
      }
      if (next === 6) {
        setCurrentTab('ai-match');
        openCandidateMatch('CAND-8499');
      }
      if (next === 7) setCurrentTab('review-queue');
      if (next === 8) {
        approveMatch('CAND-8492', 'Approved in SIH Demo Walkthrough');
        setCurrentTab('master');
      }
      if (next === 9) openMaterial360('BMG-FST-000001284');
      if (next === 10) {
        setCurrentTab('procurement');
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      setIsSIHDemoOpen(false);
      addToast({
        title: 'SIH Demo Walkthrough Completed',
        message: 'Successfully demonstrated end-to-end Bharat Material Grid intelligence loop.',
        type: 'success'
      });
    }
  };

  const handlePrev = () => {
    if (demoStep > 1) {
      setDemoStep(demoStep - 1);
    }
  };

  const stepsData = [
    {
      step: 1,
      title: 'The National Challenge: Fragmented CPSE Master Data',
      subtitle: 'Chaotic nomenclature across 10 Public Sector Enterprises creates hidden inventory duplication.',
      icon: <Database className="w-5 h-5 text-amber-400" />,
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            Every CPSE (IOCL, ONGC, BPCL, SAIL, NTPC) maintains separate ERP systems (SAP, Oracle) with disparate item codes, non-standard abbreviations, and missing technical attributes for the exact same physical items.
          </p>
          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-amber-400 uppercase font-mono">Example: Same Hex Bolt under 4 Disparate Identifiers</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-orange-400 font-bold">ONGC:</span> <code className="text-slate-200">MAT-10291 (SS BOLT M10 X 50 SS304)</code>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-blue-400 font-bold">IOCL:</span> <code className="text-slate-200">BOLT-7821 (HEX BOLT STAINLESS STEEL 10MM X 50MM 304)</code>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-indigo-400 font-bold">BPCL:</span> <code className="text-slate-200">009871-FST (SS304 HEXAGONAL HEAD BOLT M10X50)</code>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-cyan-400 font-bold">CPCL:</span> <code className="text-slate-200">CPCL-7821 (BOLT HEX SS 304 M10X50MM ISO4014)</code>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 2,
      title: 'Multi-CPSE Ingestion & Source Integration',
      subtitle: 'Ingesting heterogeneous catalog batches via API or multi-source file ingestion.',
      icon: <Database className="w-5 h-5 text-cyan-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            Bharat Material Grid supports live API polling and secure drag-and-drop batch ingestion for CSV, Excel, XML, and SAP IDoc master dumps.
          </p>
          <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <div className="font-bold text-white">Live Batch Synced</div>
              <div className="text-[11px] text-slate-400 font-mono">12,450 records processed from IOCL & ONGC SAP instances</div>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 3,
      title: 'Schema Mapping & Data Quality Audit',
      subtitle: 'Automated extraction of technical specifications and missing attribute detection.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            The ingestion pipeline uses domain regex and named-entity recognition (NER) to map raw columns into standardized engineering schema: Material, Grade, Diameter, Length, Rating, UOM, and Standard.
          </p>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Specification Completeness:</span>
              <span className="text-emerald-400 font-bold">92.4%</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Non-standard UOMs Flagged (PKT/LOT):</span>
              <span className="text-amber-400 font-bold">450 records</span>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 4,
      title: 'Bharat Domain Dictionary & Specification Normalization',
      subtitle: 'Expanding 2,400+ CPSE industry abbreviations into canonical technical nomenclature.',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            The Domain Dictionary normalizes abbreviations (e.g. <code>SS</code> → <em>Stainless Steel</em>, <code>FLGD</code> → <em>Flanged</em>, <code>WCB</code> → <em>ASTM A216 Cast Carbon Steel</em>).
          </p>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="text-amber-400 font-bold text-[11px]">Canonical Result:</div>
            <div className="text-white font-mono text-xs">
              Stainless Steel Hex Bolt M10 × 50 mm, Grade SS304 (ISO 4014)
            </div>
          </div>
        </div>
      )
    },
    {
      step: 5,
      title: 'AI Candidate Generation (Safe Match Showcase)',
      subtitle: 'Candidate Pair #8492: 96.2% AI Confidence with 100% Engineering Spec Equivalence.',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            Our dual-encoder model discovers candidate pairs across ONGC (MAT-00125) and IOCL (BLT-SS-458). All 6 vector parameters align perfectly:
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
            <div className="bg-slate-900 p-2 rounded border border-emerald-500/30 text-emerald-400 font-bold">
              Material: 100%
            </div>
            <div className="bg-slate-900 p-2 rounded border border-emerald-500/30 text-emerald-400 font-bold">
              Grade: 100%
            </div>
            <div className="bg-slate-900 p-2 rounded border border-emerald-500/30 text-emerald-400 font-bold">
              Dimension: 100%
            </div>
          </div>
        </div>
      )
    },
    {
      step: 6,
      title: 'CRITICAL SAFETY: Preventing False-Positive AI Merges',
      subtitle: 'Pair #8499: High Semantic Score (94.8%) Blocked by Dimension Mismatch Guard.',
      icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl space-y-2">
            <div className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Generic AI would dangerously merge these!</span>
            </div>
            <p className="text-[11px] text-rose-200">
              <code>SS BOLT M10 X 50 SS304</code> vs <code>SS BOLT M10 X 60 SS304</code> share 94.8% text similarity. However, a 50mm bolt CANNOT be used in place of a 60mm bolt in pressurized piping.
            </p>
            <div className="bg-slate-950 p-2 rounded text-[10px] font-mono text-amber-300">
              BMG Spec Guard Flag: Dimension Mismatch (Length: 50mm ≠ 60mm). Auto-merge blocked!
            </div>
          </div>
        </div>
      )
    },
    {
      step: 7,
      title: 'Human-in-the-Loop Governance & Officer Sign-off',
      subtitle: 'Material Master Officers review ambiguous candidates with full difference analysis.',
      icon: <CheckSquare className="w-5 h-5 text-amber-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            Officers have clear 1-click action paths: <strong>Approve & Mint ID</strong>, <strong>Reject (Preserve Separate Codes)</strong>, or <strong>Request CPSE Clarification / MTC</strong>.
          </p>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="font-bold text-slate-200">Review SLA Performance:</span>
            <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
              1.8 Days Avg Resolution
            </span>
          </div>
        </div>
      )
    },
    {
      step: 8,
      title: 'National Identity Minting (BMG Common Master)',
      subtitle: 'Approved records receive an authoritative national identifier with cryptographic audit trail.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-1.5">
            <div className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Standard Common Identity Minted:</div>
            <div className="text-sm font-bold text-white font-mono">BMG-FST-000001284</div>
            <div className="text-[10px] text-slate-400 font-mono">
              Immutable SHA-256 Hash: sha256:8f9a2b7c4d1e3f5a6b7c...
            </div>
          </div>
        </div>
      )
    },
    {
      step: 9,
      title: 'Material 360: Complete Cross-Enterprise View',
      subtitle: 'Full transparency into multi-CPSE demand, price variance, suppliers, and stock levels.',
      icon: <Eye className="w-5 h-5 text-cyan-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            The Material 360 view aggregates demand across 4 CPSEs (75,600 units/year), highlights price disparity (₹42.50 to ₹48.20), and tracks 7 active qualified manufacturers.
          </p>
          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <div className="text-[10px] text-slate-400">Total Annual Demand</div>
              <div className="text-white font-bold mt-0.5">75,600 Nos</div>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <div className="text-[10px] text-slate-400">Potential Savings</div>
              <div className="text-emerald-400 font-bold mt-0.5">16.4% Bulk Rebate</div>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 10,
      title: 'Procurement Intelligence & Realized Savings',
      subtitle: 'Consolidating national framework rate tenders across CPSEs unlocks massive fiscal value.',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-xl space-y-2">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>National Aggregated Impact Summary</span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs mt-2">
              <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">Gate Valves Deal (OPP-1042)</div>
                <div className="text-emerald-400 font-bold text-sm mt-0.5">₹7.02 Cr Saved</div>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">Procurement Cycle</div>
                <div className="text-cyan-400 font-bold text-sm mt-0.5">-40% Lead Time</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 mt-2">
              Bharat Material Grid transforms fragmented CPSE procurement into a unified, transparent, and sovereign industrial powerhouse.
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = stepsData[demoStep - 1] || stepsData[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      <div
        onClick={() => setIsSIHDemoOpen(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Interactive Platform Walkthrough</span>
                <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                  Step {demoStep} of {totalSteps}
                </span>
              </h3>
              <div className="text-[11px] text-slate-500">
                End-to-End Enterprise Material Intelligence Simulation
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsSIHDemoOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1 flex">
          {stepsData.map(s => (
            <div
              key={s.step}
              className={`flex-1 transition-all duration-300 ${
                s.step <= demoStep ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-4 text-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-slate-700">
              {currentStepData.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-slate-900 tracking-tight">{currentStepData.title}</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{currentStepData.subtitle}</p>
            </div>
          </div>

          <div className="pt-2">
            {currentStepData.content}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={demoStep === 1}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1.5">
            {stepsData.map(s => (
              <button
                key={s.step}
                onClick={() => setDemoStep(s.step)}
                className={`w-2 h-2 rounded-full transition-all ${
                  s.step === demoStep
                    ? 'w-5 bg-emerald-600'
                    : s.step < demoStep
                    ? 'bg-slate-700'
                    : 'bg-slate-300'
                }`}
                title={`Step ${s.step}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <span>{demoStep === totalSteps ? 'Finish Walkthrough' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
