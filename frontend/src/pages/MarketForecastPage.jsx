import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowLeft, BarChart3 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MarketForecastPage = () => {
  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <Link
          to="/verification"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B5E20] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Verification Center
        </Link>

        <div className="bg-white rounded-2xl border border-[#A5D6A7] p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#E8F5E9] text-[#1B5E20]">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#66BB6A]">
                Accessible to All Registered Farmers & FPOs
              </span>
              <h1 className="text-2xl font-black text-[#1B5E20]">
                Agricultural Market Price Forecast
              </h1>
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">
            Market forecasting is <strong>unrestricted</strong>: Farmers and FPO members can freely view historical mandi price trends and regional commodity forecasts even while their documents are awaiting admin verification.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-[#E8F5E9]/50 border border-[#A5D6A7]">
              <span className="text-xs font-bold text-[#1B5E20]">Soybean (Nashik APMC)</span>
              <p className="text-xl font-black text-[#1B5E20] mt-1">₹4,850 / qtl</p>
              <span className="text-[10px] text-green-700 font-semibold">▲ +3.2% 14-day projection</span>
            </div>
            <div className="p-4 rounded-xl bg-[#E8F5E9]/50 border border-[#A5D6A7]">
              <span className="text-xs font-bold text-[#1B5E20]">Wheat Sharbati (MP)</span>
              <p className="text-xl font-black text-[#1B5E20] mt-1">₹2,920 / qtl</p>
              <span className="text-[10px] text-green-700 font-semibold">▲ +1.5% stable trend</span>
            </div>
            <div className="p-4 rounded-xl bg-[#E8F5E9]/50 border border-[#A5D6A7]">
              <span className="text-xs font-bold text-[#1B5E20]">Basmati Paddy 1121</span>
              <p className="text-xl font-black text-[#1B5E20] mt-1">₹4,200 / qtl</p>
              <span className="text-[10px] text-amber-700 font-semibold">● Storage advised for 30d</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MarketForecastPage;
