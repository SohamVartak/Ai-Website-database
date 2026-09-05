import React from 'react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';
import { ChevronRight, Home } from 'lucide-react';

export const GovBreadcrumb: React.FC = () => {
  const { currentTab, setCurrentTab } = useApp();

  const getBreadcrumbs = (): { label: string; tab?: TabType }[] => {
    switch (currentTab) {
      case 'home':
        return [{ label: 'Portal Home' }];
      case 'dashboard':
        return [{ label: 'Home', tab: 'home' }, { label: 'National Command Center' }];
      case 'master':
        return [{ label: 'Home', tab: 'home' }, { label: 'Common Material Master Catalog' }];
      case 'material-360':
        return [
          { label: 'Home', tab: 'home' },
          { label: 'Material Catalog', tab: 'master' },
          { label: 'Material 360 Deep Specification' }
        ];
      case 'ai-match':
        return [{ label: 'Home', tab: 'home' }, { label: 'AI Specification Matcher & Deduplication' }];
      case 'review-queue':
        return [
          { label: 'Home', tab: 'home' },
          { label: 'AI Match Center', tab: 'ai-match' },
          { label: 'Human-in-the-Loop Review Queue' }
        ];
      case 'procurement':
        return [{ label: 'Home', tab: 'home' }, { label: 'Bulk Procurement & Demand Pooling' }];
      case 'what-if':
        return [
          { label: 'Home', tab: 'home' },
          { label: 'Procurement', tab: 'procurement' },
          { label: 'What-If Savings Simulator' }
        ];
      case 'cpse':
        return [{ label: 'Home', tab: 'home' }, { label: 'Participating CPSE Enterprises Directory' }];
      case 'quality':
        return [
          { label: 'Home', tab: 'home' },
          { label: 'CPSE Directory', tab: 'cpse' },
          { label: 'Data Quality & Spec Audit' }
        ];
      case 'upload':
        return [{ label: 'Home', tab: 'home' }, { label: 'Multi-CPSE ERP Catalog Ingestion' }];
      case 'audit':
        return [{ label: 'Home', tab: 'home' }, { label: 'Cryptographic Sovereign Audit Ledger' }];
      case 'admin':
        return [{ label: 'Home', tab: 'home' }, { label: 'Platform Administration & Settings' }];
      case 'login':
        return [{ label: 'Home', tab: 'home' }, { label: 'Sovereign Parichay Officer Login' }];
      default:
        return [{ label: 'Portal Home' }];
    }
  };

  const crumbs = getBreadcrumbs();

  return (
    <div className="bg-slate-100/90 border-b border-slate-200/80 px-4 sm:px-8 py-2 text-xs text-slate-600 select-none">
      <div className="max-w-[1600px] mx-auto flex items-center gap-1.5 flex-wrap font-medium">
        <button
          onClick={() => setCurrentTab('home')}
          className="text-[#002244] hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer font-bold"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        {crumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.label + idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {crumb.tab ? (
              <button
                onClick={() => setCurrentTab(crumb.tab!)}
                className="text-[#002244] hover:text-amber-600 transition-colors cursor-pointer"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="text-slate-800 font-bold font-sans">
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
