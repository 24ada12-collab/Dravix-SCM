import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Sparkles,
  Package,
  Plus,
  Warehouse,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sprout,
  FileText,
  UserCheck,
  Search
} from 'lucide-react';
import { useAuth } from '../services/AuthContext';

const FarmerSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isFpo = user?.role === 'FPO_MEMBER';
  const isVerified = user?.verificationStatus === 'VERIFIED';

  const navItems = [
    {
      section: 'Core Workspace',
      items: [
        {
          to: '/farmer/dashboard',
          label: 'Farmer Dashboard',
          icon: LayoutDashboard,
          badge: null
        },
        {
          to: '/farmer/my-products',
          label: 'My Produce Catalog',
          icon: Package,
          badge: null
        },
        {
          to: '/farmer/add-product',
          label: 'Add New Product',
          icon: Plus,
          highlight: true
        },
      ]
    },
    {
      section: 'Intelligence & Logistics',
      items: [
        {
          to: '/market-forecast',
          label: 'Market Price Forecast',
          icon: Sparkles,
          chip: 'AI'
        },
        {
          to: '/market-price-explorer',
          label: 'Market Price Explorer',
          icon: Search,
          chip: 'MANDI'
        },
        {
          to: '/demand-forecast',
          label: 'Demand Projections',
          icon: TrendingUp,
          chip: 'LIVE'
        },
        {
          to: '/warehouses',
          label: 'Warehouse & Storage',
          icon: Warehouse,
        },
      ]
    },
    {
      section: 'Protection & Compliance',
      items: [
        {
          to: '/verification',
          label: 'Identity Verification',
          icon: ShieldCheck,
          badge: isVerified ? 'Verified' : 'Pending',
          badgeColor: isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        },
        {
          to: '/farmer/insurance',
          label: 'Insurance & Claims',
          icon: ShieldAlert,
        },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`h-[calc(100vh-5rem)] sticky top-20 bg-slate-900 text-white flex flex-col justify-between transition-all duration-300 border-r border-slate-800 shadow-2xl z-40 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 shrink-0">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                  {isFpo ? 'FPO Producer' : 'Farmer Workspace'}
                </span>
                <span className="text-sm font-extrabold text-white truncate block">
                  DRAVIX Hub
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-14rem)] scrollbar-thin">
          {navItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {group.section}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                        : item.highlight
                        ? 'bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                    {!collapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}

                    {!collapsed && item.chip && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {item.chip}
                      </span>
                    )}

                    {!collapsed && item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 mb-2 flex items-center justify-between">
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">
                {user?.name || 'Farmer Account'}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {user?.email}
              </div>
            </div>
            <span className={`w-2 h-2 rounded-full ${isVerified ? 'bg-emerald-400 shadow-xs shadow-emerald-400' : 'bg-amber-400'}`} />
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default FarmerSidebar;
