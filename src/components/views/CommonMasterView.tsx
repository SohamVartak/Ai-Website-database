import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  Search,
  Building,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const CommonMasterView: React.FC = () => {
  const { materials } = useApp();

  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('All');

  // Companies that should always appear.
  // If a company has no records, its count will automatically be 0.
  const companies = ['BPCL', 'BHEL', 'HPCL', 'IOCL'];

  const companyCounts = useMemo(() => {
    return companies.map(company => ({
      company,
      count: materials.filter(
        material =>
          material.company?.trim().toUpperCase() === company
      ).length,
    }));
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return materials.filter(material => {
      const company =
        material.company?.trim().toUpperCase() || '';

      const matchesCompany =
        companyFilter === 'All' || company === companyFilter;

      const matchesSearch =
        !searchText ||
        (material.company || '').toLowerCase().includes(searchText) ||
        (material.material_number || '')
          .toLowerCase()
          .includes(searchText) ||
        (material.description || '')
          .toLowerCase()
          .includes(searchText) ||
        (material.specifications || '')
          .toLowerCase()
          .includes(searchText) ||
        (material.category || '')
          .toLowerCase()
          .includes(searchText);

      return matchesCompany && matchesSearch;
    });
  }, [materials, search, companyFilter]);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">

      {/* HEADER */}
      <div className="bg-[#000a1e] border border-slate-800 rounded-2xl p-5 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

          <div>
            <div className="flex items-center gap-2 flex-wrap">

              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                LIVE DATABASE
              </span>

              <span className="text-xs text-slate-400 font-mono">
                {materials.length.toLocaleString()} Material Records
              </span>

            </div>

            <h1 className="text-xl font-bold text-white tracking-tight mt-2">
              Bharat Common Material Master
            </h1>

            <p className="text-xs text-slate-300 mt-1">
              Live material records currently available in the Supabase database.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <Database className="w-4 h-4" />
            Supabase Connected
          </div>

        </div>

        {/* COMPANY COUNTS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">

          {companyCounts.map(({ company, count }) => (
            <button
              key={company}
              onClick={() =>
                setCompanyFilter(
                  companyFilter === company ? 'All' : company
                )
              }
              className={`text-left p-4 rounded-xl border transition-all ${
                companyFilter === company
                  ? 'bg-emerald-500/10 border-emerald-500/50'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-600'
              }`}
            >

              <div className="flex items-center justify-between">

                <span className="text-[10px] text-slate-400 font-mono">
                  {company}
                </span>

                <Building className="w-4 h-4 text-slate-500" />

              </div>

              <div
                className={`text-2xl font-bold font-mono mt-2 ${
                  count > 0
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                {count.toLocaleString()}
              </div>

              <div className="text-[10px] text-slate-500 mt-1">
                materials available
              </div>

            </button>
          ))}

        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">

        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">

            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />

            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search company, material number, description, category..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />

          </div>

          <select
            value={companyFilter}
            onChange={e => setCompanyFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Companies</option>

            {companies.map(company => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}

          </select>

        </div>

        <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-slate-400">
          <span>
            Showing {filteredMaterials.length.toLocaleString()} records
          </span>

          {companyFilter !== 'All' && (
            <button
              onClick={() => setCompanyFilter('All')}
              className="text-amber-600 font-bold hover:underline"
            >
              Show All Companies
            </button>
          )}
        </div>

      </div>

      {/* EMPTY STATE */}
      {filteredMaterials.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

          <Database className="w-10 h-10 mx-auto text-slate-300 mb-3" />

          <h2 className="text-sm font-bold text-slate-800">
            No Material Records Found
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            No database records match your current search or company filter.
          </p>

        </div>
      )}

      {/* MATERIAL GRID */}
      {filteredMaterials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {filteredMaterials.map(material => (

            <div
              key={material.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-amber-500/80 p-5 shadow-sm hover:shadow-md transition-all space-y-4"
            >

              {/* TOP */}
              <div className="flex items-center justify-between gap-2">

                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">
                  {material.company}
                </span>

                <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Live
                </span>

              </div>

              {/* MATERIAL NUMBER */}
              <div>

                <div className="text-[10px] text-slate-400 uppercase font-mono">
                  Material Number
                </div>

                <div className="font-mono text-sm font-bold text-slate-900 mt-1 break-all">
                  {material.material_number || 'Not available'}
                </div>

              </div>

              {/* DESCRIPTION */}
              <div>

                <div className="text-[10px] text-slate-400 uppercase font-mono">
                  Description
                </div>

                <div className="text-sm font-semibold text-slate-900 mt-1">
                  {material.description || 'Not available'}
                </div>

              </div>

              {/* CATEGORY */}
              <div>

                <div className="text-[10px] text-slate-400 uppercase font-mono">
                  Category
                </div>

                <div className="text-xs text-slate-700 mt-1">
                  {material.category || 'Not available'}
                </div>

              </div>

              {/* SPECIFICATIONS */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">

                <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">
                  Specifications
                </div>

                <div className="text-xs text-slate-700 leading-relaxed line-clamp-4">
                  {material.specifications || 'Not available'}
                </div>

              </div>

              {/* FOOTER */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">

                <span className="text-[10px] font-mono text-slate-400">
                  Database ID: {material.id}
                </span>

                <span className="text-amber-600 text-xs font-bold flex items-center gap-1">
                  Live Record
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};