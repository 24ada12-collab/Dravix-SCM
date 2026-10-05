import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Warehouse,
  MapPin,
  Layers,
  Building2,
  Scale,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileCheck2,
  RefreshCw,
  AlertCircle,
  Clock,
  Compass,
  FileText
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { getWarehouseById } from '../services/api';

const WarehouseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null); // 400, 404, or 500
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchDetails = async () => {
    setLoading(true);
    setErrorStatus(null);
    setErrorMessage(null);
    try {
      const data = await getWarehouseById(id);
      setWarehouse(data);
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      if (status === 400) {
        setErrorStatus(400);
        setErrorMessage(message || 'Invalid warehouse ID');
      } else if (status === 404) {
        setErrorStatus(404);
        setErrorMessage('The requested warehouse does not exist or is no longer active.');
      } else {
        setErrorStatus(500);
        setErrorMessage('Unable to load warehouse details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // Enum display helpers
  const formatOwnership = (type) => {
    if (!type) return 'Government';
    switch (type) {
      case 'GOVERNMENT':
        return 'Government';
      case 'PRIVATE':
        return 'Private';
      case 'COOPERATIVE':
        return 'Cooperative';
      default:
        return type;
    }
  };

  const formatWarehouseType = (type) => {
    if (!type) return 'Godown';
    switch (type) {
      case 'GENERAL':
        return 'General Warehouse';
      case 'COLD_STORAGE':
        return 'Cold Storage';
      case 'GODOWN':
        return 'Godown';
      default:
        return type.replace('_', ' ');
    }
  };

  const formatCapacity = (kg) => {
    if (kg === null || kg === undefined) return 'Not available';
    return `${Number(kg).toLocaleString('en-IN')} kg`;
  };

  return (
    <div className="min-h-screen bg-[#E8F5E9]/40 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back navigation */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate('/warehouses')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1B5E20] hover:text-[#2E7D32] bg-white border border-[#A5D6A7] px-3.5 py-2 rounded-xl shadow-sm hover:bg-[#E8F5E9] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Warehouses
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl border border-[#A5D6A7] p-16 text-center shadow-sm">
            <RefreshCw className="w-10 h-10 text-[#1B5E20] animate-spin mx-auto mb-4" />
            <h3 className="text-base font-bold text-[#1B5E20]">Loading warehouse details...</h3>
            <p className="text-xs text-gray-500 mt-1">Retrieving official infrastructure records for ID: {id}</p>
          </div>
        )}

        {/* 400 Bad Request State */}
        {!loading && errorStatus === 400 && (
          <div className="bg-white rounded-2xl border border-amber-200 p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Warehouse ID</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
              {errorMessage || `The ID '${id}' is not a valid numeric warehouse identifier.`}
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/warehouses')}>
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to Warehouses
            </Button>
          </div>
        )}

        {/* 404 Not Found State */}
        {!loading && errorStatus === 404 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center mx-auto mb-4 border border-gray-200">
              <Warehouse className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Warehouse Not Found</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
              The requested warehouse does not exist or is no longer active.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/warehouses')}>
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to Warehouses
            </Button>
          </div>
        )}

        {/* Generic Network / 500 Error State */}
        {!loading && errorStatus === 500 && (
          <div className="bg-white rounded-2xl border border-red-200 p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Warehouse Details</h2>
            <p className="text-sm text-red-600 max-w-md mx-auto mb-6">{errorMessage}</p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="primary" size="sm" onClick={fetchDetails}>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Try Again
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/warehouses')}>
                Back to Warehouses
              </Button>
            </div>
          </div>
        )}

        {/* Successful Warehouse Details Content */}
        {!loading && warehouse && !errorStatus && (
          <div className="space-y-6">
            {/* Header Hero Card */}
            <div className="bg-white rounded-2xl border border-[#A5D6A7] shadow-sm overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-[#1B5E20] via-[#43A047] to-[#66BB6A]" />

              <div className="p-6 sm:p-8">
                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] uppercase tracking-wide">
                    {formatOwnership(warehouse.ownershipType)}
                  </span>

                  <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 uppercase tracking-wide">
                    {formatWarehouseType(warehouse.warehouseType)}
                  </span>

                  {warehouse.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Facility
                    </span>
                  )}

                  {warehouse.eNwrEligible === true && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                      <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                      e-NWR Eligible
                    </span>
                  )}
                </div>

                {/* Facility Name & Location */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B5E20] tracking-tight">
                  {warehouse.name}
                </h1>

                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <MapPin className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>
                    <strong>{warehouse.district}</strong>
                    {warehouse.location ? ` — ${warehouse.location}` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-[#A5D6A7] p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  <Scale className="w-4 h-4 text-[#1B5E20]" />
                  Total Capacity
                </div>
                <div className="text-2xl font-black text-[#1B5E20] font-mono">
                  {formatCapacity(warehouse.totalCapacityKg)}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#A5D6A7] p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  <Warehouse className="w-4 h-4 text-[#2E7D32]" />
                  Available Capacity
                </div>
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  {warehouse.availableCapacityKg !== null && warehouse.availableCapacityKg !== undefined
                    ? formatCapacity(warehouse.availableCapacityKg)
                    : 'Not available'}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#A5D6A7] p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  <Layers className="w-4 h-4 text-[#43A047]" />
                  Storage Type
                </div>
                <div className="text-base font-bold text-gray-800 truncate">
                  {warehouse.storageType || 'Standard Godown'}
                </div>
              </div>
            </div>

            {/* 2-Column Detail Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Warehouse Information */}
              <div className="bg-white rounded-2xl border border-[#A5D6A7] p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Building2 className="w-4 h-4 text-[#1B5E20]" />
                  <h2 className="text-sm font-bold text-[#1B5E20] uppercase tracking-wider">
                    Warehouse Information
                  </h2>
                </div>

                <dl className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <dt className="text-gray-500">Warehouse Type:</dt>
                    <dd className="font-semibold text-gray-900">{formatWarehouseType(warehouse.warehouseType)}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <dt className="text-gray-500">Ownership:</dt>
                    <dd className="font-semibold text-gray-900">{formatOwnership(warehouse.ownershipType)}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <dt className="text-gray-500">Source Type:</dt>
                    <dd className="font-semibold text-gray-900">{warehouse.sourceType || 'Government Official'}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <dt className="text-gray-500">District:</dt>
                    <dd className="font-semibold text-gray-900">{warehouse.district}</dd>
                  </div>
                  {warehouse.location && (
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <dt className="text-gray-500">Location:</dt>
                      <dd className="font-semibold text-gray-900">{warehouse.location}</dd>
                    </div>
                  )}
                  {warehouse.address && (
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <dt className="text-gray-500">Address:</dt>
                      <dd className="font-semibold text-gray-900 text-right max-w-xs">{warehouse.address}</dd>
                    </div>
                  )}
                  {/* Coordinates - informational only */}
                  {warehouse.latitude !== null && warehouse.latitude !== undefined && warehouse.longitude !== null && warehouse.longitude !== undefined && (
                    <div className="flex justify-between py-1">
                      <dt className="text-gray-500">Coordinates:</dt>
                      <dd className="font-mono text-gray-700">
                        {warehouse.latitude.toFixed(4)}, {warehouse.longitude.toFixed(4)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Storage & Commercial Details */}
              <div className="bg-white rounded-2xl border border-[#A5D6A7] p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Scale className="w-4 h-4 text-[#1B5E20]" />
                  <h2 className="text-sm font-bold text-[#1B5E20] uppercase tracking-wider">
                    Storage &amp; Capacity
                  </h2>
                </div>

                <dl className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <dt className="text-gray-500">Total Capacity:</dt>
                    <dd className="font-bold text-[#1B5E20] font-mono">{formatCapacity(warehouse.totalCapacityKg)}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <dt className="text-gray-500">Available Capacity:</dt>
                    <dd className="font-semibold text-gray-900">
                      {warehouse.availableCapacityKg !== null && warehouse.availableCapacityKg !== undefined
                        ? formatCapacity(warehouse.availableCapacityKg)
                        : 'Not available'}
                    </dd>
                  </div>
                  {warehouse.storageType && (
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <dt className="text-gray-500">Storage Condition:</dt>
                      <dd className="font-semibold text-gray-900">{warehouse.storageType}</dd>
                    </div>
                  )}
                  {warehouse.storageCostPerKg !== null && warehouse.storageCostPerKg !== undefined && (
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <dt className="text-gray-500">Storage Cost per KG:</dt>
                      <dd className="font-bold text-gray-900">₹{warehouse.storageCostPerKg}/kg</dd>
                    </div>
                  )}
                  {warehouse.supportedCategories && (
                    <div className="flex justify-between py-1">
                      <dt className="text-gray-500">Supported Categories:</dt>
                      <dd className="font-semibold text-gray-900">{warehouse.supportedCategories}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Verification & Compliance Card */}
            <div className="bg-white rounded-2xl border border-[#A5D6A7] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <ShieldCheck className="w-4 h-4 text-[#1B5E20]" />
                <h2 className="text-sm font-bold text-[#1B5E20] uppercase tracking-wider">
                  Verification &amp; Compliance Standards
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Verified */}
                <div className="p-4 rounded-xl border border-gray-100 bg-[#F4FBF5] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Verification</p>
                    <p className="text-sm font-bold text-gray-900">
                      {warehouse.verified ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>
                  {warehouse.verified ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </div>

                {/* WDRA Registration */}
                <div className="p-4 rounded-xl border border-gray-100 bg-[#F4FBF5] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-600">WDRA Status</p>
                    <p className="text-sm font-bold text-gray-900">
                      {warehouse.wdraRegistered ? 'WDRA Registered' : 'Not WDRA Registered'}
                    </p>
                  </div>
                  {warehouse.wdraRegistered ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </div>

                {/* e-NWR Eligibility */}
                <div className="p-4 rounded-xl border border-gray-100 bg-[#F4FBF5] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-600">e-NWR Eligibility</p>
                    <p className="text-sm font-bold text-gray-900">
                      {warehouse.eNwrEligible ? 'e-NWR Eligible' : 'Not e-NWR Eligible'}
                    </p>
                  </div>
                  {warehouse.eNwrEligible ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </div>
              </div>
            </div>

            {/* Official Source Provenance Card */}
            {warehouse.sourceReference && (
              <div className="bg-[#F4FBF5] rounded-2xl border border-[#C8E6C9] p-5 shadow-sm flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#1B5E20] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-[#1B5E20] mb-0.5">Authoritative Source Provenance</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {warehouse.sourceReference}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WarehouseDetailsPage;
