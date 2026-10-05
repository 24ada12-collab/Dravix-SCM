import React, { useState, useEffect } from 'react';
import { 
  Warehouse, 
  MapPin, 
  Layers, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Filter, 
  RefreshCw, 
  AlertCircle, 
  Search, 
  FileCheck2, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../services/AuthContext';
import { getWarehouses } from '../services/api';

const WarehouseListingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isFarmerUser = user && (user.role === 'FARMER' || user.role === 'FPO_MEMBER');

  // Filters state
  const [district, setDistrict] = useState('All');
  const [warehouseType, setWarehouseType] = useState('All');
  const [ownershipType, setOwnershipType] = useState('All');

  // Warehouses data & UI state
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Available districts (standard options from official government data)
  const districtOptions = [
    'All',
    'Cuddalore',
    'Dindigul',
    'Erode',
    'Kallakurichi',
    'Madurai',
    'Tiruvannamalai'
  ];

  const warehouseTypeOptions = [
    { value: 'All', label: 'All Types' },
    { value: 'GENERAL', label: 'General Warehouse' },
    { value: 'COLD_STORAGE', label: 'Cold Storage' },
    { value: 'GODOWN', label: 'Godown' }
  ];

  const ownershipTypeOptions = [
    { value: 'All', label: 'All Ownership' },
    { value: 'GOVERNMENT', label: 'Government' },
    { value: 'PRIVATE', label: 'Private' },
    { value: 'COOPERATIVE', label: 'Cooperative' }
  ];

  // Fetch warehouses from backend API
  const fetchWarehouses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWarehouses({
        district,
        warehouseType,
        ownershipType
      });
      setWarehouses(data || []);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Unable to load warehouses';
      setError(message);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  // Single effect based on filter changes
  useEffect(() => {
    fetchWarehouses();
  }, [district, warehouseType, ownershipType]);

  const handleResetFilters = () => {
    setDistrict('All');
    setWarehouseType('All');
    setOwnershipType('All');
  };

  const hasActiveFilters = district !== 'All' || warehouseType !== 'All' || ownershipType !== 'All';

  const formatCapacity = (kg) => {
    if (kg === null || kg === undefined) return 'Not available';
    return `${Number(kg).toLocaleString('en-IN')} kg`;
  };

  const content = (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold tracking-wide uppercase mb-2">
              <Warehouse className="w-3.5 h-3.5" />
              Agricultural Storage Infrastructure
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Warehouse Discovery & Allocation
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
              Official WDRA-registered facilities and government godowns available for agricultural deposit and e-NWR receipt generation.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Button
              variant="outlineLight"
              size="sm"
              onClick={fetchWarehouses}
              disabled={loading}
              className="text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-[#A5D6A7] shadow-sm p-4 sm:p-6 mb-8 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#1B5E20]" />
              <h2 className="text-sm font-bold text-[#1B5E20] uppercase tracking-wider">
                Filter Facilities
              </h2>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-[#2E7D32] hover:text-[#1B5E20] underline transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* District Filter */}
            <div>
              <label htmlFor="district-select" className="block text-xs font-semibold text-gray-700 mb-1.5">
                District
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  id="district-select"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-gray-50/50 hover:bg-white text-sm font-medium rounded-xl border border-gray-200 focus:border-[#1B5E20] focus:ring-2 focus:ring-[#E8F5E9] focus:outline-none transition-all cursor-pointer"
                >
                  {districtOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === 'All' ? 'All Districts' : opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Warehouse Type Filter */}
            <div>
              <label htmlFor="type-select" className="block text-xs font-semibold text-gray-700 mb-1.5">
                Warehouse Type
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  id="type-select"
                  value={warehouseType}
                  onChange={(e) => setWarehouseType(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-gray-50/50 hover:bg-white text-sm font-medium rounded-xl border border-gray-200 focus:border-[#1B5E20] focus:ring-2 focus:ring-[#E8F5E9] focus:outline-none transition-all cursor-pointer"
                >
                  {warehouseTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ownership Type Filter */}
            <div>
              <label htmlFor="ownership-select" className="block text-xs font-semibold text-gray-700 mb-1.5">
                Ownership Type
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  id="ownership-select"
                  value={ownershipType}
                  onChange={(e) => setOwnershipType(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-gray-50/50 hover:bg-white text-sm font-medium rounded-xl border border-gray-200 focus:border-[#1B5E20] focus:ring-2 focus:ring-[#E8F5E9] focus:outline-none transition-all cursor-pointer"
                >
                  {ownershipTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          /* Loading State */
          <div className="bg-white rounded-2xl border border-[#A5D6A7] p-12 text-center shadow-sm">
            <RefreshCw className="w-8 h-8 text-[#1B5E20] animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-[#1B5E20]">Loading warehouses...</p>
            <p className="text-xs text-gray-500 mt-1">Retrieving official storage records from DRAVIX SCM</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-white rounded-2xl border border-red-200 p-10 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Unable to load warehouses</h3>
            <p className="text-xs text-red-600 max-w-md mx-auto mb-5">{error}</p>
            <Button variant="primary" size="sm" onClick={fetchWarehouses}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Try Again
            </Button>
          </div>
        ) : warehouses.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-dashed border-[#A5D6A7] p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-[#2E7D32]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No warehouses found</h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-5">
              The selected filters returned no matching warehouses. Try resetting or adjusting your criteria.
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          /* Warehouse Cards Grid */
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-xs font-semibold text-gray-600">
                Showing <strong className="text-[#1B5E20]">{warehouses.length}</strong> {warehouses.length === 1 ? 'warehouse' : 'warehouses'}
              </p>
              <span className="text-[11px] font-medium text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                Sorted by District &amp; Name
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {warehouses.map((wh) => (
                <div
                  key={wh.id}
                  className="bg-white rounded-2xl border border-[#A5D6A7] hover:border-[#66BB6A] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Decorative top accent */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#1B5E20] via-[#43A047] to-[#66BB6A]" />

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {/* Ownership Badge */}
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] uppercase">
                          {wh.ownershipType || 'Government'}
                        </span>

                        {/* Facility Type Badge */}
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 uppercase">
                          {wh.warehouseType ? wh.warehouseType.replace('_', ' ') : 'Godown'}
                        </span>

                        {/* Verification Checkmark */}
                        {wh.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        )}

                        {/* e-NWR eligibility - only if explicitly true */}
                        {wh.eNwrEligible === true && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                            <FileCheck2 className="w-3 h-3 text-blue-600" />
                            e-NWR
                          </span>
                        )}
                      </div>

                      {/* Warehouse Name */}
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-[#1B5E20] transition-colors leading-snug mb-1">
                        {wh.name}
                      </h3>

                      {/* District & Location */}
                      <div className="flex items-start gap-1.5 text-xs text-gray-600 mb-4">
                        <MapPin className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
                        <span>
                          <strong>{wh.district}</strong>
                          {wh.location ? ` — ${wh.location}` : ''}
                        </span>
                      </div>

                      {/* Metrics Box */}
                      <div className="bg-[#F4FBF5] rounded-xl border border-[#C8E6C9] p-3 space-y-2 mb-3">
                        {/* Total Capacity */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Total Capacity:</span>
                          <span className="font-bold text-[#1B5E20] font-mono">
                            {formatCapacity(wh.totalCapacityKg)}
                          </span>
                        </div>

                        {/* Storage Type */}
                        {wh.storageType && (
                          <div className="flex items-center justify-between text-xs border-t border-[#E0F2E9] pt-1.5">
                            <span className="text-gray-600">Storage Type:</span>
                            <span className="font-medium text-gray-800 text-right">
                              {wh.storageType}
                            </span>
                          </div>
                        )}

                        {/* Available capacity - only if not null */}
                        {wh.availableCapacityKg !== null && wh.availableCapacityKg !== undefined && (
                          <div className="flex items-center justify-between text-xs border-t border-[#E0F2E9] pt-1.5">
                            <span className="text-gray-600">Available:</span>
                            <span className="font-bold text-emerald-700 font-mono">
                              {formatCapacity(wh.availableCapacityKg)}
                            </span>
                          </div>
                        )}

                        {/* Storage cost - only if not null */}
                        {wh.storageCostPerKg !== null && wh.storageCostPerKg !== undefined && (
                          <div className="flex items-center justify-between text-xs border-t border-[#E0F2E9] pt-1.5">
                            <span className="text-gray-600">Cost:</span>
                            <span className="font-semibold text-gray-800">
                              ₹{wh.storageCostPerKg}/kg
                            </span>
                          </div>
                        )}
                      </div>

                      {/* View Details Action */}
                      <div className="mb-3">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full text-xs font-bold py-2 shadow-sm"
                          onClick={() => navigate(`/warehouses/${wh.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>

                    {/* Source reference footer */}
                    {wh.sourceReference && (
                      <div className="border-t border-gray-100 pt-2.5 text-[10px] text-gray-500 leading-tight">
                        <span className="font-medium text-gray-600">Source:</span> {wh.sourceReference}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
  );

  if (isFarmerUser) {
    return <DashboardShell>{content}</DashboardShell>;
  }

  return (
    <div className="min-h-screen bg-[#E8F5E9]/40 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {content}
      </main>
      <Footer />
    </div>
  );
};

export default WarehouseListingPage;
