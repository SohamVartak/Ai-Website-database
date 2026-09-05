import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  AshokaEmblem,
  TricolorAshokaEmblem,
  CPSEBrandBadge,
  DigitalIndiaLogo,
  MakeInIndiaLogo
} from '../common/GovernmentLogos';
import {
  Layers,
  Cpu,
  TrendingUp,
  Building,
  UploadCloud,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Search,
  Sliders,
  DollarSign,
  AlertTriangle,
  MapPin,
  Play
} from 'lucide-react';
import { AnimatedButton } from '../ui/AnimatedButton';

export const HomeView: React.FC = () => {
  const {
    setCurrentTab,
    startSIHDemo,
    setIsAIAssistantOpen,
    cpses,
    commonMaterials,
    procurementOpportunities,
    candidates
  } = useApp();

  const totalHarmonizedValue = 12480; // Crores

  const totalProjectedSavings =
    procurementOpportunities.reduce(
      (acc, p) => acc + p.projectedSavingsINR,
      0
    ) / 10000000; // in Crores

  const pendingCandidates = candidates.filter(
    c => c.status === 'Pending'
  ).length;

  const keyServices = [
    {
      title: 'Common Material Master',
      hindiTitle: 'मानकीकृत सामान्य सामग्री निर्देशिका',
      desc: 'Browse unified BMG material codes, standardized engineering specs, and cross-CPSE price comparisons.',
      tab: 'master',
      icon: Layers,
      color: 'from-blue-600 to-indigo-700',
      badge: `${commonMaterials.length} Standard Materials`,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'AI Specification Matcher',
      hindiTitle: 'एआई सामग्री मिलान एवं सुरक्षा',
      desc: 'Deep semantic and technical parameter matching preventing cross-enterprise duplicate item creation.',
      tab: 'ai-match',
      icon: Cpu,
      color: 'from-emerald-600 to-teal-700',
      badge: `${pendingCandidates} Candidates to Review`,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      title: 'Bulk Demand & Savings Simulator',
      hindiTitle: 'थोक खरीद एवं बचत सिमुलेटर',
      desc: 'Aggregate joint procurement orders across enterprises to unlock high-volume bulk discount contracts.',
      tab: 'procurement',
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-600',
      badge: `₹${totalProjectedSavings.toFixed(1)} Cr Savings`,
      badgeColor: 'bg-amber-100 text-amber-900'
    },
    {
      title: 'CPSE Compliance & Data Quality',
      hindiTitle: 'सीपीएसई डेटा गुणवत्ता सूचकांक',
      desc: 'Track ERP data health, metadata completeness, and nodal officer assignments across participating units.',
      tab: 'cpse',
      icon: Building,
      color: 'from-cyan-600 to-blue-700',
      badge: `${cpses.length} CPSEs Integrated`,
      badgeColor: 'bg-cyan-100 text-cyan-800'
    }
  ];

  return (
    <div className="space-y-8 pb-12">

      {/* 1. HERO SOVEREIGN BANNER WITH TRICOLOR ACCENT */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#002244] via-[#001730] to-[#0f172a] text-white py-12 px-4 sm:px-8 lg:px-12 border-b-4 border-amber-500 shadow-md">

        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        <div className="max-w-[1500px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column: Mission & CTAs */}
          <div className="lg:col-span-8 space-y-6">

            <div className="flex items-center gap-3.5 flex-wrap">

              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ type: 'spring', stiffness: 350 }}
                className="p-1.5 rounded-xl bg-white shadow-lg border border-slate-100 flex items-center justify-center shrink-0 ring-2 ring-amber-400/40"
                title="State Emblem of India • भारत का राजचिह्न • Lion Capital of Ashoka"
              >
                <TricolorAshokaEmblem size={46} className="shrink-0" />
              </motion.div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold tracking-wide">
                <span>🏛️ SOVEREIGN DIGITAL INFRASTRUCTURE</span>
                <span>•</span>
                <span>GOVERNMENT OF INDIA</span>
              </div>

            </div>

            <div className="space-y-2">

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-display leading-tight">
                National CPSE Material Standardization & Harmonization Grid
              </h1>

              <p className="text-base sm:text-lg text-amber-400 font-semibold font-display">
                राष्ट्रीय सीपीएसई सामग्री मानकीकरण एवं समन्वय ग्रिड
              </p>

            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
              Connecting India's premier Central Public Sector Enterprises — including IndianOil, ONGC, SAIL, NTPC, BHEL, and GAIL — into a unified, AI-driven engineering catalog to eliminate redundant procurement and unlock thousands of crores in public savings.
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentTab('master')}
                className="bg-amber-500 hover:bg-amber-400 text-[#001730] font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Harmonized Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsAIAssistantOpen(true)}
                className="bg-gradient-to-r from-amber-400/20 to-amber-500/30 hover:from-amber-400/30 hover:to-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl border border-amber-400/50 shadow-md backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer group"
                title="Ask Bharat AI Copilot"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Ask Bharat AI</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={startSIHDemo}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md border border-emerald-400/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 text-white fill-white" />
                <span>Launch Interactive Demo</span>
              </motion.button>

            </div>
          </div>

          {/* Right Column: Sovereign Stat Showcase Card */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white space-y-4 shadow-xl">

            <div className="flex items-center justify-between border-b border-white/20 pb-3">

              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                NATIONAL IMPACT STATS
              </div>

              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                LIVE MESH
              </span>

            </div>

            <div className="space-y-3.5">

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  Catalog Inventory Mapped
                </span>

                <span className="text-base font-black font-mono text-white">
                  ₹{totalHarmonizedValue.toLocaleString()} Cr
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  Joint Savings Unlocked
                </span>

                <span className="text-base font-black font-mono text-emerald-400">
                  ₹{totalProjectedSavings.toFixed(1)} Cr
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  Integrated CPSEs
                </span>

                <span className="text-base font-black font-mono text-amber-300">
                  8 Enterprises
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  AI Match Precision Rate
                </span>

                <span className="text-base font-black font-mono text-cyan-300">
                  94.7%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  BIS / API Standards Aligned
                </span>

                <span className="text-base font-black font-mono text-purple-300">
                  100% Verified
                </span>
              </div>

            </div>

            <div className="pt-2 border-t border-white/20 text-[11px] text-slate-300 flex items-center justify-between">
              <span>National Nodal Node: NIC-DELHI</span>
              <span className="text-emerald-400 font-mono font-bold">
                ● Active 24x7
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VIBRANT COLORFUL METRICS STRIP */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-white rounded-2xl border-l-4 border-l-blue-600 border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">

            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Harmonized Materials
            </div>

            <div className="text-2xl font-black text-blue-900 font-mono mt-1">
              1,420 Items
            </div>

            <div className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <span>↑ +18% this quarter</span>
            </div>

          </div>

          <div className="bg-white rounded-2xl border-l-4 border-l-emerald-600 border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">

            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Projected Public Savings
            </div>

            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
              ₹{totalProjectedSavings.toFixed(1)} Cr
            </div>

            <div className="text-xs text-slate-600 font-medium mt-1">
              Across 4 Joint Contracts
            </div>

          </div>

          <div className="bg-white rounded-2xl border-l-4 border-l-amber-500 border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">

            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Duplicate Pairs Resolved
            </div>

            <div className="text-2xl font-black text-amber-700 font-mono mt-1">
              2,840 Pairs
            </div>

            <div className="text-xs text-slate-600 font-medium mt-1">
              Zero Specification Drift
            </div>

          </div>

          <div className="bg-white rounded-2xl border-l-4 border-l-purple-600 border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">

            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active CPSE Enterprises
            </div>

            <div className="text-2xl font-black text-purple-900 font-mono mt-1">
              8 CPSEs
            </div>

            <div className="text-xs text-purple-700 font-medium mt-1">
              Oil, Steel, Power, Mining
            </div>

          </div>

        </div>
      </section>

      {/* 3. CORE PUBLIC SERVICES TILES */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">

          <div>

            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Portal Services & Directories
            </h2>

            <p className="text-xs text-slate-600">
              Select a service below to access specialized engineering catalogs,
              deduplication queues, or tender pooling.
            </p>

          </div>

          <span className="text-xs font-bold text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded-full">
            4 Core Functional Areas
          </span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {keyServices.map(svc => (

            <div
              key={svc.tab}
              onClick={() => setCurrentTab(svc.tab as any)}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group space-y-4"
            >

              <div className="space-y-3">

                <div className="flex items-center justify-between">

                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} text-white flex items-center justify-center shadow-md`}
                  >
                    <svc.icon className="w-6 h-6" />
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${svc.badgeColor}`}
                  >
                    {svc.badge}
                  </span>

                </div>

                <div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-900 transition-colors">
                    {svc.title}
                  </h3>

                  <div className="text-[11px] font-medium text-slate-500">
                    {svc.hindiTitle}
                  </div>

                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {svc.desc}
                </p>

              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-900 group-hover:text-amber-600 transition-colors">
                <span>Access Service</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>

            </div>

          ))}

        </div>
      </section>

      {/* 4. PARTICIPATING CPSE ENTERPRISES */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">

            <div>

              <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <span>🏛️</span>
                <span>
                  Participating Central Public Sector Enterprises (CPSEs)
                </span>
              </h2>

              <p className="text-xs text-slate-600">
                Connected Maharatna and Navratna enterprises actively
                synchronizing material ERP catalogs with the National Mesh.
              </p>

            </div>

            <button
              onClick={() => setCurrentTab('cpse')}
              className="text-xs font-bold text-blue-900 hover:text-amber-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View CPSE Directory & Scorecards</span>
              <span>→</span>
            </button>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

            {cpses.map(cpse => (

              <motion.div
                key={cpse.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentTab('cpse')}
                className="bg-white rounded-xl border border-slate-200 hover:border-amber-400 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
              >

                {/* CPSE Industrial Facility Image */}
                <div className="relative h-28 w-full bg-slate-900 overflow-hidden">

                  <img
                    src={
                      cpse.imageUrl ||
                      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={`${cpse.name} facility`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

                  {/* Floating Badges */}
                  <div className="absolute top-2 left-2">
                    <CPSEBrandBadge code={cpse.code} size="sm" />
                  </div>

                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] font-bold text-emerald-950 bg-emerald-300/90 px-1.5 py-0.5 rounded font-mono shadow-xs">
                      {cpse.qualityScore}% Health
                    </span>
                  </div>

                  {/* Location strip */}
                  {cpse.facilityLocation && (
                    <div className="absolute bottom-1.5 left-2 right-2 flex items-center gap-1 text-[10px] text-slate-200 truncate font-sans">

                      <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0" />

                      <span className="truncate">
                        {cpse.facilityLocation.split(',')[0]}
                      </span>

                    </div>
                  )}

                </div>

                {/* Content Section */}
                <div className="p-3 flex flex-col justify-between flex-1 space-y-2">

                  <div>

                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1">
                      {cpse.name}
                    </h3>

                    <span className="text-[10px] text-slate-500 font-mono">
                      {cpse.sector} • {cpse.code}
                    </span>

                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600">

                    <span className="font-semibold text-slate-900">
                      {cpse.recordsNormalized.toLocaleString()}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      items synced
                    </span>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>
        </div>
      </section>

      {/* 5. CPSE INFORMATION CTA */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-gradient-to-r from-[#002244] to-[#0f3460] text-white rounded-2xl p-6 sm:p-8 shadow-md border-t-2 border-amber-400">

          <div className="space-y-2 max-w-3xl">

            <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">
              GOVERNMENT OFFICIAL PORTAL
            </span>

            <h3 className="text-xl font-bold text-white">
              Bharat Material Grid — Unified CPSE Material Intelligence
            </h3>

            <p className="text-xs sm:text-sm text-slate-300">
              Access centralized material catalogs, AI-powered specification
              matching, procurement intelligence, CPSE directories, and
              transparency tools from one unified platform.
            </p>

          </div>

        </div>
      </section>

    </div>
  );
};