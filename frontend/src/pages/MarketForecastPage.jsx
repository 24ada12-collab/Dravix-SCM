import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowLeft, BarChart3, Sparkles } from 'lucide-react';
import DashboardShell from '../components/DashboardShell';

const MarketForecastPage = () => {
  return (
    <DashboardShell
      title="Agricultural Market Price Forecast"
      subtitle="AI-projected market trends, APMC mandi rates, and crop storage advisories"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Live Mandi Intelligence
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Regional Price Movement & Projections
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            Real-time APMC mandi price indices and AI-driven forward price forecasts. Compare local mandi spot rates with futures before depositing into bonded storage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors">
              <span className="text-xs font-bold text-slate-900">Soybean (Nashik APMC)</span>
              <p className="text-2xl font-black text-slate-900 mt-1">₹4,850 / qtl</p>
              <span className="text-[11px] text-emerald-700 font-bold block mt-1">▲ +3.2% 14-day projection</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors">
              <span className="text-xs font-bold text-slate-900">Wheat Sharbati (Sehore)</span>
              <p className="text-2xl font-black text-slate-900 mt-1">₹2,920 / qtl</p>
              <span className="text-[11px] text-emerald-700 font-bold block mt-1">▲ +1.5% stable trend</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-colors">
              <span className="text-xs font-bold text-slate-900">Basmati Paddy 1121 (Karnal)</span>
              <p className="text-2xl font-black text-slate-900 mt-1">₹4,200 / qtl</p>
              <span className="text-[11px] text-amber-700 font-bold block mt-1">● Storage advised for 30d</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default MarketForecastPage;
