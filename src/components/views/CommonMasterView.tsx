import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CommonMaterial } from '../../types';
import {
  Database,
  Search,
  Filter,
  Eye,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  X,
  Layers
} from 'lucide-react';

export const CommonMasterView: React.FC = () => {
  const { commonMaterials, openMaterial360, createCommonMaterial } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Material form state
  const [newStandardName, setNewStandardName] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Fasteners');
  const [newMaterial, setNewMaterial] = useState('Stainless Steel');
  const [newGrade, setNewGrade] = useState('SS316');
  const [newUOM, setNewUOM] = useState('Nos');
  const [newDesc, setNewDesc] = useState('');

  const categories = [
    'All',
    'Fasteners',
    'Industrial Valves',
    'Pumps',
    'Bearings',
    'Electrical Cables',
    'Gaskets',
    'Pipes'
  ];

  const filteredMaterials = commonMaterials.filter(m => {
    const matchesCat = categoryFilter === 'All' || m.category === categoryFilter;
    const s = search.toLowerCase();
    const matchesSearch =
      m.bmgCode.toLowerCase().includes(s) ||
      m.standardName.toLowerCase().includes(s) ||
      m.specifications.grade.toLowerCase().includes(s) ||
      m.mappings.some(map => map.cpseCode.toLowerCase().includes(s));
    return matchesCat && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStandardName.trim()) return;

    createCommonMaterial({
      standardName: newStandardName,
      category: newCategory,
      specifications: {
        material: newMaterial,
        grade: newGrade,
        uom: newUOM
      },
      description: newDesc
    });

    setIsCreateModalOpen(false);
    setNewStandardName('');
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-[#000a1e] border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Canonical Catalog
            </span>
            <span className="text-xs text-slate-400 font-mono">18,430 Standardized Identities</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            Bharat Common Material Master
          </h1>
          <p className="text-xs text-slate-300">
            Authoritative national master catalog bridging legacy item codes across 10 CPSEs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Mint Common Material</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
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
            placeholder="Search BMG code, grade..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
          />
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map(mat => (
          <div
            key={mat.id}
            onClick={() => openMaterial360(mat.id)}
            className="bg-white rounded-2xl border border-slate-200 hover:border-amber-500/80 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3.5 group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                  {mat.bmgCode}
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {mat.status}
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                {mat.standardName}
              </h2>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {mat.description}
              </p>
            </div>

            {/* Specifications Strip */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600 font-mono text-[11px]">
                <span>Grade / Material:</span>
                <strong className="text-slate-800">{mat.specifications.grade} ({mat.specifications.material})</strong>
              </div>
              <div className="flex justify-between text-slate-600 font-mono text-[11px]">
                <span>Standard:</span>
                <strong className="text-slate-800">{mat.specifications.standard || 'ISO / ASME'}</strong>
              </div>
            </div>

            {/* Mapped CPSEs List */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center justify-between">
                <span>Mapped CPSEs ({mat.mappings.length})</span>
                <span className="text-emerald-600 font-bold">-{mat.potentialSavingsPercent}% Rebate</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {mat.mappings.map(map => (
                  <span
                    key={map.cpseCode}
                    className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                  >
                    {map.cpseCode}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500">
                Demand: <strong>{mat.totalAnnualDemand.toLocaleString()}</strong> {mat.specifications.uom}
              </span>
              <span className="text-amber-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Material 360</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mint Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            onClick={() => setIsCreateModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-[#000a1e] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Mint New Canonical Common Material</span>
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Standard Canonical Name</label>
                <input
                  type="text"
                  required
                  value={newStandardName}
                  onChange={e => setNewStandardName(e.target.value)}
                  placeholder="e.g. Stainless Steel Hex Bolt M12 x 50"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-hidden"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Grade</label>
                  <input
                    type="text"
                    value={newGrade}
                    onChange={e => setNewGrade(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={2}
                  placeholder="Technical description according to standard specifications..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold"
                >
                  Mint BMG Identity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
