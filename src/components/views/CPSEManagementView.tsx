import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { CPSE } from '../../types';
import {
  Building,
  Database,
  CheckCircle2,
  AlertTriangle,
  Layers,
  TrendingUp,
  Search,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Mail,
  User,
  MapPin
} from 'lucide-react';

export const CPSEManagementView: React.FC = () => {
  const {
    cpses,
    selectedCPSEId,
    setSelectedCPSEId,
    setCurrentTab
  } = useApp();

  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');

  const sectors = ['All', 'Oil & Gas', 'Power', 'Steel', 'Mining', 'Heavy Engineering', 'Petrochemicals'];

  const filteredCPSEs = cpses.filter(c => {
    const matchesSector = sectorFilter === 'All' || c.sector === sectorFilter;
    const s = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(s) ||
      c.code.toLowerCase().includes(s) ||
      c.erpSystem.toLowerCase().includes(s);
    return matchesSector && matchesSearch;
  });

  const activeCPSE = cpses.find(c => c.id === selectedCPSEId) || cpses[0];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-[#000a1e] border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Enterprise Governance
            </span>
            <span className="text-xs text-slate-400 font-mono">10 Active Inter-Enterprise Nodes</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            CPSE Organization Directory & Integration Mesh
          </h1>
          <p className="text-xs text-slate-300">
            Connected Central Public Sector Enterprises, ERP pipelines, and data quality ratings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono">
            <span>Mesh Health: </span>
            <strong className="text-emerald-400">100% Operational</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {sectors.map(sec => (
            <button
              key={sec}
              onClick={() => setSectorFilter(sec)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                sectorFilter === sec
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search CPSE, SAP system..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
          />
        </div>
      </div>

      {/* Main Grid: Left CPSE Cards (8 Cols), Right Active CPSE Detail (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CPSE Cards List (8 Cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCPSEs.map(cpse => {
            const isSelected = activeCPSE.id === cpse.id;
            return (
              <motion.div
                key={cpse.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedCPSEId(cpse.id)}
                className={`rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/20 shadow-md ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Facility Image Header with Overlay */}
                <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={cpse.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'}
                    alt={cpse.name}
                    className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
                  
                  {/* Badge & Code */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs shadow-md border border-white/20"
                      style={{ backgroundColor: cpse.logoColor }}
                    >
                      {cpse.code.slice(0, 3)}
                    </div>
                    <span className="text-xs font-bold text-white drop-shadow-xs">{cpse.code}</span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs ${
                        cpse.qualityScore >= 90
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {cpse.qualityScore}% Quality
                    </span>
                  </div>

                  {cpse.facilityLocation && (
                    <div className="absolute bottom-1.5 left-2.5 right-2.5 flex items-center gap-1 text-[11px] text-slate-200">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{cpse.facilityLocation}</span>
                    </div>
                  )}
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{cpse.name}</h3>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {cpse.sector} Division
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Uploaded</span>
                      <strong className="text-slate-800">{cpse.recordsUploaded.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Mapped</span>
                      <strong className="text-emerald-700">{cpse.recordsMatched.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Backlog</span>
                      <strong className={cpse.reviewBacklog > 500 ? 'text-rose-600' : 'text-slate-800'}>
                        {cpse.reviewBacklog}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-1 border-t border-slate-100">
                    <span>ERP: <strong className="text-slate-700">{cpse.erpSystem}</strong></span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Synced
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected CPSE Detail Sidebar (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          {/* Facility Photo Header */}
          <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
            <img
              src={activeCPSE.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'}
              alt={`${activeCPSE.name} primary hub`}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />
            <div className="absolute bottom-2.5 left-3 right-3 text-white">
              <span className="text-[9px] uppercase font-mono tracking-wider text-amber-300 font-bold block">
                Primary Operational Facility
              </span>
              <div className="text-xs font-semibold flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{activeCPSE.facilityLocation || 'New Delhi, India'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0"
              style={{ backgroundColor: activeCPSE.logoColor }}
            >
              {activeCPSE.code}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{activeCPSE.name}</h2>
              <span className="text-xs text-slate-500 font-mono">{activeCPSE.sector} Division</span>
            </div>
          </div>

          {/* Integration Specs */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider font-mono text-[11px]">
              Integration Profile
            </h3>
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">ERP Platform:</span>
                <span className="font-mono font-bold text-slate-900">{activeCPSE.erpSystem}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">API Gateway:</span>
                <span className="font-mono text-emerald-600 font-bold">Secure REST (TLS 1.3)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sync Frequency:</span>
                <span className="font-mono text-slate-800">Nightly Automated Batch</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Synced:</span>
                <span className="font-mono text-slate-800">{activeCPSE.lastIngestionDate}</span>
              </div>
            </div>
          </div>

          {/* Nodal Officer Contact */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider font-mono text-[11px]">
              Nodal Materials Officer
            </h3>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>{activeCPSE.nodalOfficer.name}</span>
              </div>
              <div className="text-slate-500 text-[11px]">
                {activeCPSE.nodalOfficer.designation}
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-mono text-[11px] pt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeCPSE.nodalOfficer.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setCurrentTab('upload')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Ingest Batch for {activeCPSE.code}</span>
            </button>
            <button
              onClick={() => setCurrentTab('quality')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Inspect Quality Scorecard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
