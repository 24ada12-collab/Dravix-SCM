import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DemandForecastPage = () => {
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
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#66BB6A]">
                Accessible to All Registered Farmers & FPOs
              </span>
              <h1 className="text-2xl font-black text-[#1B5E20]">
                Regional Agricultural Demand Projections
              </h1>
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">
            Demand intelligence projections are <strong>unrestricted</strong>: Producers can plan sowing and harvesting schedules according to expected processing mill requirements.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-[#E8F5E9]/50 border border-[#A5D6A7]">
              <span className="text-xs font-bold text-[#1B5E20]">Cold Storage Demand (Onion / Potato)</span>
              <p className="text-sm text-gray-700 mt-1">High demand forecasted across western Maharashtra over the next 45 days.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#E8F5E9]/50 border border-[#A5D6A7]">
              <span className="text-xs font-bold text-[#1B5E20]">Oilseed Processing Mills (Madhya Pradesh)</span>
              <p className="text-sm text-gray-700 mt-1">Crushing capacity operating at 85% with steady procurement demand.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DemandForecastPage;
