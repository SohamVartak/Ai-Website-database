import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Cpu,
  Users,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Plus,
  Save
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'standards' | 'dictionary' | 'rules' | 'ai' | 'rbac'>('rules');

  // AI Model Weights State
  const [semanticWeight, setSemanticWeight] = useState(30);
  const [materialWeight, setMaterialWeight] = useState(25);
  const [gradeWeight, setGradeWeight] = useState(20);
  const [dimensionWeight, setDimensionWeight] = useState(25);

  const [dictionarySearch, setDictionarySearch] = useState('');

  const abbreviations = [
    { abbr: 'SS', expansion: 'Stainless Steel', category: 'Metallurgy', standard: 'IS/ISO' },
    { abbr: 'CS / WCB', expansion: 'ASTM A216 Cast Carbon Steel', category: 'Castings', standard: 'ASME B16.34' },
    { abbr: 'FLGD', expansion: 'Flanged End Connection', category: 'Piping', standard: 'ASME B16.5' },
    { abbr: 'CL / #', expansion: 'Pressure Class (e.g., Class 150/300/600)', category: 'Pressure', standard: 'ASME' },
    { abbr: 'PTFE', expansion: 'Polytetrafluoroethylene (Teflon)', category: 'Polymers', standard: 'ASTM' },
    { abbr: 'OS&Y', expansion: 'Outside Screw and Yoke', category: 'Valves', standard: 'API 600' },
    { abbr: 'NBR', expansion: 'Nitrile Butadiene Rubber', category: 'Elastomers', standard: 'ASTM D2000' },
    { abbr: 'MS', expansion: 'Mild Steel (IS 2062 Grade E250)', category: 'Structural', standard: 'IS 2062' }
  ];

  const filteredAbbr = abbreviations.filter(a =>
    a.abbr.toLowerCase().includes(dictionarySearch.toLowerCase()) ||
    a.expansion.toLowerCase().includes(dictionarySearch.toLowerCase())
  );

  const handleSaveWeights = () => {
    addToast({
      title: 'AI Weights Updated',
      message: 'Dual-encoder spec validation weights updated in runtime configuration.',
      type: 'success'
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-[#000a1e] border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              System Administration
            </span>
            <span className="text-xs text-slate-400 font-mono">Configuration & Rules Governance</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            Platform Engine & Knowledge Base Control
          </h1>
          <p className="text-xs text-slate-300">
            Manage engineering standards, technical dictionary synonyms, and AI model matching thresholds.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex items-center gap-1 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'rules' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Spec Guard Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('dictionary')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'dictionary' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Domain Dictionary</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'ai' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>AI Embedding & Weights</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'rbac' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-400" />
          <span>RBAC & Access Control</span>
        </button>
      </div>

      {/* TAB CONTENT: SPEC GUARD RULES */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Engineering Safety Guard Rules</h2>
              <p className="text-xs text-slate-500">Enforces physical zero-tolerance rules that override high semantic similarity.</p>
            </div>
            <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Safety Rule</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-rose-800">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Rule #SG-101: Zero Tolerance on Fastener & Bolt Lengths</span>
                </span>
                <span className="font-mono text-[10px] bg-rose-200 px-2 py-0.5 rounded text-rose-900">Active • Blocking</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                If candidate items differ in nominal length by &gt; 0mm (e.g. 50mm vs 60mm), automated merge is strictly forbidden regardless of semantic text score. Candidate must be flagged as Critical Mismatch.
              </p>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-amber-800">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Rule #SG-104: Valve Pressure Class Incompatibility</span>
                </span>
                <span className="font-mono text-[10px] bg-amber-200 px-2 py-0.5 rounded text-amber-900">Active • Blocking</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Class 150 and Class 300 ratings cannot be merged into a single common item due to hydrostatic test pressure differential (ASME B16.34).
              </p>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-emerald-800">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Rule #SG-108: Equivalent Metallurgy Dual-Naming</span>
                </span>
                <span className="font-mono text-[10px] bg-emerald-200 px-2 py-0.5 rounded text-emerald-900">Active • Auto-Map</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Allow equivalence between AISI 304 and IS 04Cr18Ni10 when certified in Mill Test Certificates (MTC).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DOMAIN DICTIONARY */}
      {activeTab === 'dictionary' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Bharat Domain Dictionary (2,400+ Terms)</h2>
              <p className="text-xs text-slate-500">Standardizing Indian industrial CPSE abbreviations into formal specifications.</p>
            </div>

            <input
              type="text"
              value={dictionarySearch}
              onChange={e => setDictionarySearch(e.target.value)}
              placeholder="Search abbreviation or standard..."
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-amber-500 w-full sm:w-64"
            />
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-mono text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold">Raw CPSE Abbreviation</th>
                  <th className="p-3 font-semibold">Canonical Expansion</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold text-right">Governing Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredAbbr.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-amber-700">{item.abbr}</td>
                    <td className="p-3 font-sans font-semibold text-slate-900">{item.expansion}</td>
                    <td className="p-3 text-slate-600 font-sans">{item.category}</td>
                    <td className="p-3 text-right font-bold text-slate-800">{item.standard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: AI WEIGHTS & EMBEDDING CONFIG */}
      {activeTab === 'ai' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">AI Dual-Encoder Scoring Weights</h2>
            <p className="text-xs text-slate-500">Configure contribution of vector similarity vs physical parameters in overall confidence score.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-slate-700">Semantic Text Similarity</span>
                <strong className="text-indigo-600">{semanticWeight}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={semanticWeight}
                onChange={e => setSemanticWeight(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-slate-700">Material & Metallurgy Match</span>
                <strong className="text-emerald-600">{materialWeight}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={materialWeight}
                onChange={e => setMaterialWeight(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-slate-700">Grade & Composition Match</span>
                <strong className="text-cyan-600">{gradeWeight}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={gradeWeight}
                onChange={e => setGradeWeight(parseInt(e.target.value))}
                className="w-full accent-cyan-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-slate-700">Physical Dimension & Geometry</span>
                <strong className="text-amber-600">{dimensionWeight}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={dimensionWeight}
                onChange={e => setDimensionWeight(parseInt(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveWeights}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Apply Dynamic Weights</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: RBAC */}
      {activeTab === 'rbac' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Role-Based Access Control (RBAC)</h2>
            <p className="text-xs text-slate-500">Permission boundaries between National Authority, CPSE Officers, and Auditors.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900">National Authority Admin</div>
              <p className="text-slate-500 text-[11px]">Full access: approve canonical IDs, modify AI weights, manage all 10 CPSE feeds.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900">CPSE Nodal Officer</div>
              <p className="text-slate-500 text-[11px]">Upload datasets, review candidates involving their CPSE, respond to MTC requests.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900">CAG / Government Auditor</div>
              <p className="text-slate-500 text-[11px]">Read-only access to full immutable ledger, cryptographic hashes, and rate contract reports.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
