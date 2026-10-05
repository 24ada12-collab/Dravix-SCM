import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Menu, X, ArrowRight } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../services/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', href: '/#' },
    { label: 'Warehouses', href: '/warehouses' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Features', href: '/#features' },
    { label: 'Ecosystem', href: '/#ecosystem' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#E8F5E9]/90 backdrop-blur-md border-b border-[#A5D6A7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#1B5E20] text-white flex items-center justify-center shadow-md group-hover:bg-[#144618] transition-colors">
              <Sprout className="w-6 h-6 text-[#A5D6A7]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-[#1B5E20]">DRAVIX</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#66BB6A] text-white uppercase tracking-wider">
                  SCM
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium tracking-tight">
                AI Agricultural Supply Chain
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-gray-700 hover:text-[#1B5E20] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (user.role === 'ADMIN') {
                      navigate('/admin');
                    } else if (user.role === 'WAREHOUSE_MANAGER') {
                      navigate('/warehouse/dashboard');
                    } else {
                      navigate('/farmer/dashboard');
                    }
                  }}
                  className="text-xs"
                >
                  {user.role === 'ADMIN' ? 'Admin Panel' : 'Workspace Hub'}
                </Button>
                <div className="flex items-center gap-2 px-2 py-1 bg-white/70 rounded-lg border border-emerald-300">
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                    {user.name || user.role}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="text-xs text-red-700 hover:text-red-900 hover:bg-red-50"
                >
                  Sign Out / Switch
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => navigate('/register')}
                  icon={ArrowRight}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1B5E20] hover:bg-[#A5D6A7]/40 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#A5D6A7] px-4 pt-3 pb-6 space-y-4 shadow-lg animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-[#E8F5E9] hover:text-[#1B5E20]"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
            <Button
              variant="outlineLight"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
            >
              Sign In
            </Button>
            <Button
              variant="dark"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/register');
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
