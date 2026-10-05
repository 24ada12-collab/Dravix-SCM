import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FarmerSidebar from './FarmerSidebar';

const DashboardShell = ({ children, title, subtitle, action }) => {
  return (
    <div className="min-h-screen subtle-mesh flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <FarmerSidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto overflow-y-auto space-y-6">
          {(title || action) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/70">
              <div>
                {title && (
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              {action && <div className="shrink-0">{action}</div>}
            </div>
          )}

          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardShell;
