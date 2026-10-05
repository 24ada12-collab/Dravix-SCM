import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LayoutDashboard, ArrowLeft, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RolePlaceholderDashboard = () => {
  const { role } = useParams();
  const displayRole = role ? role.toUpperCase() : 'USER';

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-center">
        <div className="bg-white rounded-2xl border border-[#A5D6A7] p-8 sm:p-12 shadow-md space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto border border-[#A5D6A7]">
            <LayoutDashboard className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold uppercase tracking-wider">
            {displayRole} WORKSPACE
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-[#1B5E20]">
            {displayRole} Dashboard Initialized
          </h1>

          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Welcome to your dedicated role workspace. Full operational controls for {displayRole} will be developed in future stages.
          </p>

          <div className="pt-4 flex justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#1B5E20] text-white text-xs font-semibold hover:bg-[#144618] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RolePlaceholderDashboard;
