import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  PackagePlus,
  Warehouse,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../services/AuthContext';
import {
  getVerificationStatus,
  uploadVerificationDocument,
  checkProductAccessGate,
  adminReviewStatus
} from '../services/api';

const VerificationStatusPage = () => {
  const navigate = useNavigate();
  const { user, updateUserVerification } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Uploading state
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // Product Gate Testing Modal / State
  const [gateCheckModal, setGateCheckModal] = useState(null);
  const [gateLoading, setGateLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getVerificationStatus();
      setData(res);
      if (res.verificationStatus) {
        updateUserVerification(res.verificationStatus);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to retrieve verification records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileUpload = async (documentType, file) => {
    if (!file) return;

    // Check size max 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB limit.');
      return;
    }

    setUploadingDoc(documentType);
    setUploadSuccess(null);

    try {
      await uploadVerificationDocument(documentType, file);
      setUploadSuccess(`Successfully uploaded ${file.name}`);
      await fetchStatus();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Document upload failed.');
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleTestProductAccess = async () => {
    setGateLoading(true);
    try {
      const res = await checkProductAccessGate();
      setGateCheckModal({
        status: 'ALLOWED',
        title: 'Access Granted ✓',
        message: res.message,
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Access Denied: Verification Required';
      setGateCheckModal({
        status: 'BLOCKED',
        title: 'Verification Required',
        message: msg,
      });
    } finally {
      setGateLoading(false);
    }
  };

  // Admin Mock Approval Helper (allows testing verified state immediately)
  const handleSimulateAdminAction = async (newStatus) => {
    if (!user?.id) return;
    try {
      await adminReviewStatus(user.id, newStatus, newStatus === 'REJECTED' ? 'Documents are blurry or unclear. Please re-upload high-resolution scans.' : null);
      await fetchStatus();
    } catch (err) {
      alert(err.message || 'Admin update failed');
    }
  };

  const isFpo = user?.role === 'FPO_MEMBER' || data?.role === 'FPO_MEMBER';
  const verificationStatus = data?.verificationStatus || user?.verificationStatus || 'PENDING';
  const documents = data?.documents || [];

  // Required docs based on role
  const requiredDocs = isFpo
    ? [{ type: 'SHARE_CERTIFICATE', label: 'FPO Share Certificate', desc: 'Official share subscription certificate issued by your FPO body.' }]
    : [
        { type: 'PATTA_CHITTA', label: 'Patta / Chitta', desc: 'Official land ownership record issued by the Revenue Department.' },
        { type: 'ADANGAL', label: 'Adangal / Pahani', desc: 'Land and crop details register confirming cultivation status.' },
      ];

  const getDocStatus = (docType) => {
    const found = documents.find((d) => d.documentType === docType);
    return found ? found.status : 'NOT_UPLOADED';
  };

  const getDocFileName = (docType) => {
    const found = documents.find((d) => d.documentType === docType);
    return found ? found.fileName : null;
  };

  return (
    <DashboardShell
      title="Producer Verification Center"
      subtitle="Account identity records, statutory land certificates, and regulatory platform verification status"
    >
      <div className="space-y-6">
        {/* Verification Status Header Banner */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Identity & Regulatory Compliance
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                {isFpo ? 'FPO Member' : 'Agricultural Producer'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Producer Verification Center
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Account: <strong className="text-slate-800 font-semibold">{user?.name || 'Producer'}</strong> ({user?.email})
            </p>
          </div>

          {/* Current Status Badge */}
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            {verificationStatus === 'VERIFIED' ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 font-bold text-sm border border-emerald-300 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Account Verified
              </span>
            ) : verificationStatus === 'REJECTED' ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-50 text-rose-800 font-bold text-sm border border-rose-300 shadow-xs">
                <XCircle className="w-4 h-4 text-rose-600" /> Verification Rejected
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 text-amber-800 font-bold text-sm border border-amber-300 shadow-xs">
                <Clock className="w-4 h-4 text-amber-600" /> Verification Pending
              </span>
            )}
            <button
              onClick={fetchStatus}
              className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer font-semibold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Status
            </button>
          </div>
        </div>

        {uploadSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {/* Feature Access Comparison Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Available Features */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Unrestricted Access
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Available to all registered producers without identity document gating:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-emerald-50/40 transition-colors">
                  <span className="font-semibold text-slate-800">Market Price Forecast Insights</span>
                  <Link to="/market-forecast" className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-emerald-50/40 transition-colors">
                  <span className="font-semibold text-slate-800">Demand Forecast Projections</span>
                  <Link to="/demand-forecast" className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Basic Profile & GPS Coordinates</span>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Restricted Gated Actions */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Verification-Gated Modules
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                National agricultural trade regulations require verified land title or FPO membership before onboarding produce.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Button
                variant={verificationStatus === 'VERIFIED' ? 'primary' : 'outlineLight'}
                size="sm"
                icon={PackagePlus}
                loading={gateLoading}
                onClick={handleTestProductAccess}
                className="w-full justify-center text-xs"
              >
                Add Agricultural Product
              </Button>
              <Button
                variant="outlineLight"
                size="sm"
                icon={Warehouse}
                onClick={handleTestProductAccess}
                className="w-full justify-center text-xs"
              >
                Store in Warehouse
              </Button>
            </div>
          </div>
        </div>

        {/* Verification Document Upload Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" /> Regulatory Documentation
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload scanned copies (PDF, JPG, PNG, up to 10MB). Approved records unlock full marketplace selling privileges.
            </p>
          </div>

          <div className="space-y-4">
            {requiredDocs.map((doc) => {
              const status = getDocStatus(doc.type);
              const fileName = getDocFileName(doc.type);
              const isUploading = uploadingDoc === doc.type;

              return (
                <div
                  key={doc.type}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{doc.label}</h4>
                      {status === 'VERIFIED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Approved ✓
                        </span>
                      )}
                      {status === 'PENDING' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          Under Review
                        </span>
                      )}
                      {status === 'REJECTED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                          Re-upload Required
                        </span>
                      )}
                      {status === 'NOT_UPLOADED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                          Not Submitted
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{doc.desc}</p>
                    {fileName && (
                      <p className="text-[11px] text-slate-500 font-mono">
                        Attached: {fileName}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={isUploading}
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(doc.type, e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-colors">
                        <UploadCloud className="w-4 h-4 text-emerald-600" />
                        {isUploading ? 'Uploading...' : status === 'NOT_UPLOADED' ? 'Upload Document' : 'Replace Document'}
                      </span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Development Helper: Simulate Admin Approval / Rejection */}
        <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Admin Review Simulation (Development Mode)
              </h3>
            </div>
            <span className="text-[10px] bg-white px-2.5 py-0.5 rounded-full font-mono text-slate-600 border border-emerald-200">
              Buildathon Inspection Hook
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Test the strict verification gate live without waiting for a separate Admin dashboard session. Toggle this account's status to test both blocked and permitted flows:
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Button
              variant="dark"
              size="sm"
              onClick={() => handleSimulateAdminAction('VERIFIED')}
            >
              Simulate Admin Approval (🟢 VERIFIED)
            </Button>
            <Button
              variant="outlineLight"
              size="sm"
              onClick={() => handleSimulateAdminAction('REJECTED')}
            >
              Simulate Admin Rejection (🔴 REJECTED)
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSimulateAdminAction('PENDING')}
            >
              Reset to PENDING (🟡)
            </Button>
          </div>
        </div>

      {/* Product Access Gate Modal */}
      {gateCheckModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#A5D6A7] shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                gateCheckModal.status === 'ALLOWED' ? 'bg-green-100 text-[#1B5E20]' : 'bg-amber-100 text-amber-700'
              }`}>
                {gateCheckModal.status === 'ALLOWED' ? (
                  <CheckCircle2 className="w-6 h-6 text-[#1B5E20]" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1B5E20]">{gateCheckModal.title}</h3>
                <span className="text-[11px] font-semibold uppercase text-gray-500">
                  Backend Gate Status: {gateCheckModal.status}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed bg-[#E8F5E9]/50 p-4 rounded-xl border border-[#A5D6A7]">
              {gateCheckModal.message}
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outlineLight"
                size="sm"
                onClick={() => setGateCheckModal(null)}
              >
                Close
              </Button>
              {gateCheckModal.status === 'ALLOWED' && (
                <Link to="/farmer/add-product">
                  <Button variant="primary" size="sm" icon={PackagePlus}>
                    Proceed to Add Product
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardShell>
  );
};

export default VerificationStatusPage;
