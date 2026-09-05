import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Database,
  Building,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

export const Material360View: React.FC = () => {
  const {
    materials,
  } = useApp();

  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(
    materials.length > 0 ? materials[0].id : null
  );

  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'mappings' | 'audit'
  >('overview');

  const activeMaterial =
    materials.find(m => m.id === selectedMaterialId) || materials[0];

  // Companies that your system supports
  const companies = ['BPCL', 'BHEL', 'HPCL', 'IOCL'];

  // Count actual records available for each company
  const companyCounts = companies.map(company => ({
    company,
    count: materials.filter(
      m => m.company?.trim().toUpperCase() === company
    ).length,
  }));

  // No database records
  if (!activeMaterial) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <Database className="w-10 h-10 mx-auto text-slate-400 mb-3" />
          <h1 className="text-lg font-bold text-slate-900">
            No Material Data Available
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            No records were found in the Supabase materials table.
          </p>
        </div>
      </div>
    );
  }

  const specifications =
    activeMaterial.specifications?.trim() || 'Not available';

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">

      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

          <div className="space-y-2">

            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                LIVE SUPABASE DATA
              </span>

              <span className="text-xs text-slate-400 font-mono">
                Material 360
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {activeMaterial.description || 'Unnamed Material'}
            </h1>

            <div className="font-mono text-sm font-bold bg-slate-800 border border-slate-700 text-emerald-300 px-3 py-1 rounded-lg inline-block">
              {activeMaterial.material_number || 'No Material Number'}
            </div>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {specifications}
            </p>

          </div>

          {/* MATERIAL SELECTOR */}
          <select
            value={activeMaterial.id}
            onChange={e => setSelectedMaterialId(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {materials.map(material => (
              <option key={material.id} value={material.id}>
                {material.company} -{' '}
                {material.material_number || 'No Code'} -{' '}
                {material.description || 'No Description'}
              </option>
            ))}
          </select>

        </div>

        {/* COMPANY AVAILABILITY */}
        <div className="mt-6 pt-5 border-t border-slate-800">

          <div className="flex items-center gap-2 mb-4">
            <Building className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Company Data Availability
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            {companyCounts.map(item => (
              <div
                key={item.company}
                className="bg-slate-800/70 border border-slate-700 rounded-xl p-4"
              >
                <div className="text-[10px] text-slate-400 font-mono">
                  {item.company}
                </div>

                <div
                  className={`text-2xl font-bold font-mono mt-1 ${
                    item.count > 0
                      ? 'text-emerald-400'
                      : 'text-slate-500'
                  }`}
                >
                  {item.count.toLocaleString()}
                </div>

                <div className="text-[10px] text-slate-400 mt-1">
                  materials available
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-medium">

        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeSubTab === 'overview'
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Material Details
        </button>

        <button
          onClick={() => setActiveSubTab('mappings')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeSubTab === 'mappings'
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Company Records
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeSubTab === 'audit'
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Data Integrity
        </button>

      </div>

      {/* CONTENT */}
      <AnimatePresence mode="wait">

        <motion.div
          key={`${activeMaterial.id}-${activeSubTab}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >

          {/* OVERVIEW */}
          {activeSubTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">

                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                    Material Information
                  </h2>

                  <StatusBadge
                    status="success"
                    label="Live Data"
                    size="sm"
                  />
                </div>

                <div className="space-y-3 text-xs">

                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">
                      Company
                    </span>

                    <span className="font-bold text-slate-900">
                      {activeMaterial.company}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">
                      Material Number
                    </span>

                    <span className="font-mono font-bold text-slate-900">
                      {activeMaterial.material_number || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">
                      Description
                    </span>

                    <span className="font-semibold text-slate-900 text-right max-w-sm">
                      {activeMaterial.description || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">
                      Category
                    </span>

                    <span className="font-semibold text-slate-900">
                      {activeMaterial.category || 'N/A'}
                    </span>
                  </div>

                  <div className="py-2">
                    <div className="text-slate-500 mb-2">
                      Specifications
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 leading-relaxed">
                      {specifications}
                    </div>
                  </div>

                </div>

              </div>

              {/* AVAILABILITY */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">

                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />

                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                    Database Coverage
                  </h2>
                </div>

                <div className="space-y-3">

                  {companyCounts.map(item => (
                    <div
                      key={item.company}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                    >

                      <div className="flex items-center gap-3">
                        <Building className="w-4 h-4 text-slate-500" />

                        <span className="font-bold text-slate-800 text-sm">
                          {item.company}
                        </span>
                      </div>

                      <span
                        className={`font-mono font-bold ${
                          item.count > 0
                            ? 'text-emerald-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {item.count.toLocaleString()}
                      </span>

                    </div>
                  ))}

                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <div className="font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Data source: Supabase
                  </div>

                  <p className="text-emerald-700 text-[11px] mt-1">
                    These figures represent the material records currently
                    stored in the database.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* COMPANY RECORDS */}
          {activeSubTab === 'mappings' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

              <div className="mb-5">
                <h2 className="text-base font-bold text-slate-900">
                  Live Material Records
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Records currently available in Supabase
                </p>
              </div>

              <div className="overflow-x-auto">

                <table className="w-full text-left text-xs">

                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-mono">
                      <th className="pb-3">Company</th>
                      <th className="pb-3">Material Number</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Specifications</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {materials.map(material => (
                      <tr
                        key={material.id}
                        className="hover:bg-slate-50 transition-colors"
                      >

                        <td className="py-3 font-bold text-slate-900">
                          <span className="bg-slate-100 px-2 py-1 rounded font-mono">
                            {material.company}
                          </span>
                        </td>

                        <td className="py-3 font-mono text-slate-700">
                          {material.material_number || '-'}
                        </td>

                        <td className="py-3 text-slate-800 max-w-xs">
                          {material.description || '-'}
                        </td>

                        <td className="py-3 text-slate-700">
                          {material.category || '-'}
                        </td>

                        <td className="py-3 text-slate-600 max-w-md">
                          {material.specifications || '-'}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>
          )}

          {/* AUDIT */}
          {activeSubTab === 'audit' && (
            <div className="bg-slate-950 text-slate-300 rounded-2xl p-6 border border-slate-800 space-y-5 font-mono text-xs">

              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-5 h-5" />

                <span className="text-sm">
                  MATERIAL DATABASE INTEGRITY
                </span>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">

                <div className="text-slate-500 text-[10px]">
                  DATA SOURCE
                </div>

                <div className="text-emerald-300 mt-1">
                  Supabase / materials
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-slate-500 text-[10px]">
                    TOTAL MATERIAL RECORDS
                  </div>

                  <div className="text-white text-xl font-bold mt-1">
                    {materials.length.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-slate-500 text-[10px]">
                    COMPANIES WITH DATA
                  </div>

                  <div className="text-emerald-400 text-xl font-bold mt-1">
                    {companyCounts.filter(c => c.count > 0).length}
                  </div>
                </div>

              </div>

            </div>
          )}

        </motion.div>

      </AnimatePresence>

    </div>
  );
};