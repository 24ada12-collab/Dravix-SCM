import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1B5E20] text-white border-t border-[#66BB6A]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#66BB6A] text-white flex items-center justify-center">
                <Sprout className="w-5 h-5 text-[#E8F5E9]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">DRAVIX SCM</span>
            </div>
            <p className="text-sm text-[#A5D6A7] max-w-md leading-relaxed">
              Empowering farmers, certified warehouses, freight operators, and enterprise agricultural buyers with intelligent discovery, real-world capacity allocation, and transparent e-NWR compliant storage.
            </p>
            <div className="inline-block px-3 py-1 rounded-md bg-[#66BB6A]/20 border border-[#66BB6A]/40 text-xs text-[#E8F5E9] font-medium">
              Buildathon Edition • Local Development Environment
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A5D6A7] mb-4">
              Platform Workflow
            </h4>
            <ul className="space-y-2.5 text-sm text-[#E8F5E9]">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">Warehouse Discovery</a>
              </li>
              <li>
                <a href="#ecosystem" className="hover:text-white transition-colors">Stakeholder Ecosystem</a>
              </li>
              <li>
                <span className="text-white/50 cursor-not-allowed">Agricultural Marketplace (Stage 7)</span>
              </li>
            </ul>
          </div>

          {/* Registration Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A5D6A7] mb-4">
              Onboarding
            </h4>
            <ul className="space-y-2.5 text-sm text-[#E8F5E9]">
              <li>
                <Link to="/register/farmer" className="hover:text-white transition-colors">Farmer Registration</Link>
              </li>
              <li>
                <Link to="/register/warehouse" className="hover:text-white transition-colors">Warehouse Registration</Link>
              </li>
              <li>
                <Link to="/register/logistics" className="hover:text-white transition-colors">Logistics Registration</Link>
              </li>
              <li>
                <Link to="/register/customer" className="hover:text-white transition-colors">Customer Registration</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#66BB6A]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A5D6A7] gap-4">
          <p>© {new Date().getFullYear()} DRAVIX SCM. Buildathon Implementation. All rights reserved.</p>
          <p className="text-[#A5D6A7]/80">
            Engineered fresh with React, Spring Boot & Local MySQL
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
