import React from 'react';
import { useApp } from '../../context/AppContext';
import { AshokaEmblem, DigitalIndiaLogo, MakeInIndiaLogo } from '../common/GovernmentLogos';
import { Phone, Mail, ShieldCheck, ExternalLink, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

export const GovFooter: React.FC = () => {
  const { setCurrentTab, addToast } = useApp();

  return (
    <footer className="w-full bg-[#001730] text-slate-300 border-t-4 border-amber-500 pt-10 pb-6 text-xs select-none">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Sovereign Portal Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <AshokaEmblem size={40} color="#ffffff" className="shrink-0" />
              <div>
                <h3 className="font-extrabold text-white text-sm tracking-tight">
                  भारत मटेरियल ग्रिड
                </h3>
                <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                  Bharat Material Grid (BMG)
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              National centralized engineering material standardization, AI-driven deduplication, and collective procurement intelligence network for Central Public Sector Enterprises.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sovereign HSM Encrypted • ISO 27001</span>
            </div>
          </div>

          {/* Column 2: Core Platform Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400 border-b border-slate-700 pb-1.5">
              Portal Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentTab('master')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>›</span>
                  <span>Harmonized Common Material Master</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('ai-match')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>›</span>
                  <span>AI Specification Matcher & Spec Guard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('procurement')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>›</span>
                  <span>Bulk Procurement Savings Simulator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('cpse')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>›</span>
                  <span>CPSE Onboarding & Data Quality Scorecard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('upload')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>›</span>
                  <span>Multi-CPSE Catalog Ingestion Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('audit')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>›</span>
                  <span>Cryptographic Governance & Audit Trail</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Government Guidelines & Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400 border-b border-slate-700 pb-1.5">
              Compliance & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() =>
                    addToast({
                      title: 'Public Procurement Policy',
                      message: 'Preference to Make in India (MII) Order 2017 actively enforced.',
                      type: 'info'
                    })
                  }
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>›</span>
                  <span>Public Procurement (Make In India) Order</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    addToast({
                      title: 'GeM Integration',
                      message: 'Harmonized BMG categories cross-mapped to GeM product taxonomy.',
                      type: 'info'
                    })
                  }
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>›</span>
                  <span>GeM (Government e-Marketplace) Guidelines</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    addToast({
                      title: 'DPDP Act Compliance',
                      message: 'Platform complies with Digital Personal Data Protection Act 2023.',
                      type: 'info'
                    })
                  }
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>›</span>
                  <span>Digital Personal Data Protection (DPDP) Act</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    addToast({
                      title: 'Right to Information',
                      message: 'RTI Nodal Officer details available under MoHI portal.',
                      type: 'info'
                    })
                  }
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>›</span>
                  <span>Right to Information (RTI Act 2005)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    addToast({
                      title: 'Bureau of Indian Standards',
                      message: 'Classifications verified against BIS / IS standards.',
                      type: 'info'
                    })
                  }
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>›</span>
                  <span>Bureau of Indian Standards (BIS) Mapping</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: National Helpdesk & Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400 border-b border-slate-700 pb-1.5">
              CPSE Nodal Helpdesk
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Toll-Free Helpline</div>
                  <div className="text-amber-400 font-mono font-bold">1800-11-2026 / 011-2436-0000</div>
                  <div className="text-[10px] text-slate-400">09:00 AM - 06:00 PM (Monday to Saturday)</div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Official Support Email</div>
                  <div className="text-slate-300 font-mono">support-bmg@nic.in</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentTab('login')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-[#001730] font-bold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Access Sovereign Officer Portal</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* National Initiatives Banner */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center flex-wrap gap-4 sm:gap-6">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-bold text-white">NIC Sovereign Cloud Host</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[11px] font-bold text-white">Digital India Certified</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-[11px] font-bold text-white">Make in India Compliant</span>
            </div>
          </div>

          <div className="text-slate-400 text-[11px]">
            Portal Version <strong className="text-slate-200">v3.4.2-RELEASE</strong> • Last Updated: 03 Sept 2026
          </div>
        </div>

        {/* Legal Disclaimer & NIC Attribution */}
        <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed text-center space-y-1">
          <p>
            Portal Designed, Developed and Hosted by <strong>National Informatics Centre (NIC)</strong>, Ministry of Electronics & Information Technology, Government of India.
          </p>
          <p>
            Content Owned, Maintained and Verified by Ministry of Heavy Industries & Public Enterprises, Government of India.
          </p>
          <p className="text-slate-500 text-[10px] pt-1">
            © {new Date().getFullYear()} Bharat Material Grid (BMG). All Rights Reserved. Best viewed in modern browsers (Chrome, Edge, Firefox, Safari) at 1366x768 resolution or higher.
          </p>
        </div>
      </div>
    </footer>
  );
};
