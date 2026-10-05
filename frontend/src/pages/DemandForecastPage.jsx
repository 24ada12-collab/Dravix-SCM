import React from 'react';
import { BarChart3, TrendingUp, Factory } from 'lucide-react';
import DashboardShell from '../components/DashboardShell';

const DemandForecastPage = () => {
  return (
    <DashboardShell
      title="Regional Agricultural Demand Projections"
      subtitle="Institutional buyer procurement demand, industrial mill capacity, and cold chain capacity analysis"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Buyer Demand Signals
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Regional Processing Mill Demand
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            Real-time procurement insights from verified commercial agro-buyers, FMCG processors, and government storage depots.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">Cold Chain Intake (Onion & Potato)</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">High demand forecasted across western Maharashtra over the next 45 days. Local cold store fill-rates at 62%.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Factory className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">Oilseed Processing Mills (Madhya Pradesh)</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Crushing facilities operating at 85% capacity with consistent high procurement demand for soybean and mustard.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default DemandForecastPage;
