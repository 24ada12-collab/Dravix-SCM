import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowLeft,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Package,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { getFarmerClaims, submitInsuranceClaim, getFarmerProducts } from '../services/api';

const FarmerInsurancePage = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [claimReason, setClaimReason] = useState('PEST_INFESTATION');
  const [estimatedLossAmount, setEstimatedLossAmount] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const REASONS = [
    { value: 'PEST_INFESTATION', label: 'Pest Infestation / Biological Crop Attack' },
    { value: 'FLOOD', label: 'Excessive Rainfall / Flash Flooding' },
    { value: 'DROUGHT', label: 'Severe Drought / Moisture Deficit' },
    { value: 'WAREHOUSE_DAMAGE', label: 'In-Transit / Godown Storage Damage' },
    { value: 'SPOILAGE', label: 'Post-Harvest Perishable Spoilage' },
    { value: 'OTHER', label: 'Other Insured Peril' },
  ];

  const fetchClaims = async () => {
    try {
      const [claimsData, prodData] = await Promise.allSettled([
        getFarmerClaims(),
        getFarmerProducts(),
      ]);
      if (claimsData.status === 'fulfilled') {
        setClaims(Array.isArray(claimsData.value) ? claimsData.value : []);
      }
      if (prodData.status === 'fulfilled') {
        setMyProducts(Array.isArray(prodData.value) ? prodData.value : []);
      }
    } catch (e) {
      console.error('Error fetching claims', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleCreateClaim = async (e) => {
    e.preventDefault();
    if (!estimatedLossAmount || Number(estimatedLossAmount) <= 0) {
      setError('Please provide a valid estimated loss amount greater than 0.');
      return;
    }

    const matchedProd = myProducts.find((p) => String(p.id) === String(selectedProductId));

    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        productId: matchedProd ? matchedProd.id : null,
        productName: matchedProd ? matchedProd.productName : 'General Harvest Batch',
        claimReason,
        estimatedLossAmount: parseFloat(estimatedLossAmount),
        description: description.trim(),
      };

      await submitInsuranceClaim(payload);
      setSuccess('Insurance claim registered successfully.');
      setShowClaimModal(false);
      setEstimatedLossAmount('');
      setDescription('');
      await fetchClaims();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit insurance claim.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate('/farmer/dashboard')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B5E20] hover:underline mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B5E20]">
              Agricultural Crop Insurance & Claims
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Submit loss reimbursement claims for weather anomalies, pest outbreaks, or warehouse damages.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => {
              setError(null);
              setSuccess(null);
              setShowClaimModal(true);
            }}
          >
            File New Claim
          </Button>
        </div>

        {success && (
          <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-xs text-green-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Insurance Coverage Overview Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-[#A5D6A7] shadow-sm space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Active Protection Coverage
            </span>
            <div className="text-2xl font-black text-[#1B5E20]">PMFBY & WDRA Bond</div>
            <p className="text-[11px] text-gray-500">Standard agricultural policy coverage</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#A5D6A7] shadow-sm space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Filed Claims
            </span>
            <div className="text-2xl font-black text-[#1B5E20]">{claims.length}</div>
            <p className="text-[11px] text-gray-500">Loss events registered</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#A5D6A7] shadow-sm space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Settlement Status
            </span>
            <div className="text-2xl font-black text-[#1B5E20]">
              {claims.filter((c) => c.status === 'APPROVED' || c.status === 'DISBURSED').length} Approved
            </div>
            <p className="text-[11px] text-gray-500">Claims settled or approved</p>
          </div>
        </div>

        {/* Claims Table / List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#A5D6A7] shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#1B5E20]">Submitted Claims History</h2>

          {loading ? (
            <div className="py-12 text-center text-xs text-[#1B5E20] font-semibold">
              Loading claims history...
            </div>
          ) : claims.length === 0 ? (
            <div className="py-12 text-center space-y-2 bg-[#E8F5E9]/30 rounded-2xl border border-dashed border-[#A5D6A7] p-6">
              <ShieldCheck className="w-8 h-8 text-[#1B5E20] mx-auto opacity-70" />
              <h4 className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider">
                No Insurance Claims Filed
              </h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                No active or historical insurance claims registered on your agricultural profile.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1B5E20]">
                        {claim.claimReferenceNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E8F5E9] text-[#1B5E20]">
                        {claim.claimReason.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900">
                      Product: {claim.productName || 'Harvest Batch'}
                    </h4>
                    {claim.description && (
                      <p className="text-xs text-gray-600 max-w-xl">{claim.description}</p>
                    )}
                    <span className="text-[11px] text-gray-400 block">
                      Filed on: {new Date(claim.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">
                        Estimated Loss
                      </span>
                      <strong className="text-sm text-red-700">
                        ₹{claim.estimatedLossAmount?.toLocaleString()}
                      </strong>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        claim.status === 'APPROVED' || claim.status === 'DISBURSED'
                          ? 'bg-green-100 text-green-800'
                          : claim.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: File New Claim */}
        {showClaimModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#A5D6A7] shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      File Crop / Storage Loss Claim
                    </h3>
                    <p className="text-[11px] text-gray-500">Official PMFBY & Storage Damage Form</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateClaim} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B5E20] mb-1.5 uppercase tracking-wider">
                    Associated Product / Harvest Batch
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#A5D6A7] bg-white focus:outline-none"
                  >
                    <option value="">-- General Harvest Batch --</option>
                    {myProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.productName} ({p.quantityKg} kg)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B5E20] mb-1.5 uppercase tracking-wider">
                    Loss Incident Reason <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={claimReason}
                    onChange={(e) => setClaimReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#A5D6A7] bg-white focus:outline-none"
                  >
                    {REASONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <FormInput
                  id="lossAmount"
                  label="Estimated Loss Amount (in ₹)"
                  type="number"
                  placeholder="e.g. 45000"
                  value={estimatedLossAmount}
                  onChange={(e) => setEstimatedLossAmount(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-xs font-semibold text-[#1B5E20] mb-1.5 uppercase tracking-wider">
                    Detailed Event Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the incident, damage extent, and field or warehouse conditions..."
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#A5D6A7] bg-white focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => setShowClaimModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    loading={submitting}
                  >
                    Submit Claim
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FarmerInsurancePage;
