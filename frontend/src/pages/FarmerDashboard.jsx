import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Plus,
  TrendingUp,
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  Warehouse,
  FileCheck,
  AlertTriangle,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../services/AuthContext';
import { getFarmerStats, getFarmerProducts, getVerificationStatus } from '../services/api';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStockKg: 0,
    pendingApprovals: 0,
    approvedProducts: 0,
    totalValuationInr: 0,
    totalClaims: 0,
  });

  const [recentProducts, setRecentProducts] = useState([]);
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, productsRes, verifRes] = await Promise.allSettled([
          getFarmerStats(),
          getFarmerProducts(),
          getVerificationStatus(),
        ]);

        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value);
        }
        if (productsRes.status === 'fulfilled') {
          setRecentProducts(productsRes.value.slice(0, 5));
        }
        if (verifRes.status === 'fulfilled') {
          setVerificationData(verifRes.value);
        }
      } catch (e) {
        console.error('Failed to load farmer dashboard overview', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isVerified =
    user?.verificationStatus === 'VERIFIED' ||
    verificationData?.verificationStatus === 'VERIFIED';

  const quickNav = [
    {
      title: 'Add New Product',
      desc: 'List commodities with instant warehouse matching',
      icon: Plus,
      path: '/farmer/add-product',
      color: 'bg-emerald-500',
    },
    {
      title: 'My Products Catalog',
      desc: 'Track warehouse inventory and listings',
      icon: Package,
      path: '/farmer/my-products',
      color: 'bg-emerald-700',
    },
    {
      title: 'Market Forecast Projections',
      desc: 'AI demand & price outlook across agricultural corridors',
      icon: TrendingUp,
      path: '/market-forecast',
      color: 'bg-blue-600',
    },
    {
      title: 'Crop Insurance Claims',
      desc: 'Submit and inspect loss reimbursement claims',
      icon: ShieldAlert,
      path: '/farmer/insurance',
      color: 'bg-amber-600',
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/20">
                Producer Workspace
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isVerified
                    ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                }`}
              >
                {isVerified ? 'Verified Producer ✓' : 'Verification In Review'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {user?.name || 'Producer'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Manage agricultural harvest, allocate electronic warehouse receipts (e-NWR), and inspect AI market demand.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => navigate('/farmer/add-product')}
            >
              Add Product
            </Button>
          </div>
        </div>
      </div>

        {/* Verification Alert Banner if pending */}
        {!isVerified && (
          <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Complete Identity Verification for Full Storage Access
                </h4>
                <p className="text-[11px] text-gray-600">
                  Government regulations require verified Patta/Chitta or Share Certificates before storing commodities in bonded warehouses.
                </p>
              </div>
            </div>
            <Link
              to="/verification"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B5E20] text-white text-xs font-semibold hover:bg-[#144618] transition-colors shrink-0"
            >
              Verify Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-[#A5D6A7] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Products</span>
              <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#1B5E20]">
              {loading ? '…' : stats.totalProducts}
            </div>
            <p className="text-[11px] text-gray-500">Listed across harvests</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#A5D6A7] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Volume</span>
              <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center">
                <Warehouse className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#1B5E20]">
              {loading ? '…' : `${stats.totalStockKg?.toLocaleString()} kg`}
            </div>
            <p className="text-[11px] text-gray-500">Allocated to storage</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#A5D6A7] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Estimated Value</span>
              <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#1B5E20]">
              {loading ? '…' : `₹${stats.totalValuationInr?.toLocaleString()}`}
            </div>
            <p className="text-[11px] text-gray-500">Total portfolio valuation</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#A5D6A7] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Insurance Claims</span>
              <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#1B5E20]">
              {loading ? '…' : stats.totalClaims}
            </div>
            <p className="text-[11px] text-gray-500">Submitted claims</p>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickNav.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className="bg-white rounded-2xl p-5 border border-[#A5D6A7] shadow-sm hover:shadow-md transition-all text-left group hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${item.color} text-white flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1B5E20] group-hover:text-[#2E7D32]">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center text-xs font-semibold text-[#1B5E20] gap-1 group-hover:gap-2 transition-all">
                  Open module <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Recent Products Catalog Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#A5D6A7] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1B5E20]">
                Recent Agricultural Products
              </h2>
              <p className="text-xs text-gray-500">
                Products registered with associated warehouse storage
              </p>
            </div>
            <Link
              to="/farmer/my-products"
              className="text-xs font-bold text-[#1B5E20] hover:underline inline-flex items-center gap-1"
            >
              View Full Catalog →
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-[#E8F5E9]/30 rounded-2xl border border-dashed border-[#A5D6A7]">
              <div className="w-12 h-12 rounded-full bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#1B5E20]">No Products Registered Yet</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Start listing your harvest now to find nearest suitable warehouses and market buyers.
              </p>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => navigate('/farmer/add-product')}
              >
                Add First Product
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentProducts.map((p) => (
                <div
                  key={p.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center font-bold text-sm">
                      {p.category ? p.category.slice(0, 2).toUpperCase() : 'AG'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{p.productName}</h4>
                      <p className="text-[11px] text-gray-500">
                        {p.category} • {p.quantityKg?.toLocaleString()} kg • ₹{p.sellingPrice}/kg
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {p.warehouseName || 'No Warehouse Allocated'}
                      </div>
                      <span className="text-[11px] text-gray-500">
                        {p.warehouseDistanceKm ? `${p.warehouseDistanceKm} km away` : 'Direct Delivery'}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.status === 'APPROVED' || p.status === 'STORED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default FarmerDashboard;
