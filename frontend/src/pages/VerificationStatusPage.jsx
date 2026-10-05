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
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        {/* Verification Status Header Banner */}
        <div className="bg-white rounded-2xl border border-[#A5D6A7] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Account Identity & Regulatory Verification
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                Role: {isFpo ? 'FPO MEMBER' : 'FARMER'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B5E20] tracking-tight">
              Farmer Verification Center
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Account: <strong>{user?.name || 'Producer'}</strong> ({user?.email})
            </p>
          </div>

          {/* Current Status Badge */}
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            {verificationStatus === 'VERIFIED' ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-[#1B5E20] font-bold text-sm border-2 border-[#66BB6A] shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#1B5E20]" /> 🟢 Verified
              </span>
            ) : verificationStatus === 'REJECTED' ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-800 font-bold text-sm border-2 border-red-300 shadow-xs">
                <XCircle className="w-5 h-5 text-red-600" /> 🔴 Verification Rejected
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 text-amber-900 font-bold text-sm border-2 border-amber-300 shadow-xs">
                <Clock className="w-5 h-5 text-amber-600" /> 🟡 Verification Pending
              </span>
            )}
            <button
              onClick={fetchStatus}
              className="text-xs text-[#1B5E20] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Status
            </button>
          </div>
        </div>

        {uploadSuccess && (
          <div className="p-4 bg-green-50 border border-green-300 rounded-xl text-xs text-green-900 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {/* Feature Access Comparison Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Available Features */}
          <div className="bg-white rounded-2xl p-5 border border-[#A5D6A7] shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1B5E20] mb-3">
              <CheckCircle2 className="w-4 h-4 text-[#66BB6A]" /> Unrestricted Available Modules
            </div>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="p-2.5 rounded-lg bg-[#E8F5E9]/50 border border-[#A5D6A7]/50 flex items-center justify-between">
                <span className="font-semibold text-[#1B5E20]">Market Forecast Insights</span>
                <Link to="/market-forecast" className="text-xs text-[#1B5E20] font-bold hover:underline">
                  View →
                </Link>
              </div>
              <div className="p-2.5 rounded-lg bg-[#E8F5E9]/50 border border-[#A5D6A7]/50 flex items-center justify-between">
                <span className="font-semibold text-[#1B5E20]">Demand Forecast Projections</span>
                <Link to="/demand-forecast" className="text-xs text-[#1B5E20] font-bold hover:underline">
                  View →
                </Link>
              </div>
              <div className="p-2.5 rounded-lg bg-[#E8F5E9]/50 border border-[#A5D6A7]/50 flex items-center justify-between">
                <span className="font-semibold text-[#1B5E20]">Basic Profile & Map Location</span>
                <span className="text-[11px] text-[#66BB6A] font-bold">Active ✓</span>
              </div>
            </div>
          </div>

          {/* Restricted Gated Actions */}
          <div className="bg-white rounded-2xl p-5 border border-amber-300 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Verification-Gated Modules
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Regulatory compliance requires verified identity before adding or storing agricultural commodities.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
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
        <div className="bg-white rounded-2xl border border-[#A5D6A7] p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#1B5E20] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#66BB6A]" /> Required Verification Documents
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Please upload clear copies (PDF, JPG, JPEG, PNG, max 10MB). Documents are reviewed by administrators before full platform access is enabled.
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
                  className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1B5E20]">{doc.label}</h4>
                      {status === 'VERIFIED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                          Approved ✓
                        </span>
                      )}
                      {status === 'PENDING' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Under Review
                        </span>
                      )}
                      {status === 'REJECTED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                          Rejected (Re-upload required)
                        </span>
                      )}
                      {status === 'NOT_UPLOADED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                          Not Submitted
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{doc.desc}</p>
                    {fileName && (
                      <p className="text-[11px] text-gray-500 font-mono">
                        Current file: {fileName}
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
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-[#A5D6A7] text-[#1B5E20] hover:bg-[#E8F5E9] shadow-xs transition-colors">
                        <UploadCloud className="w-4 h-4 text-[#66BB6A]" />
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
        <div className="p-5 rounded-2xl bg-[#E8F5E9]/80 border border-[#A5D6A7] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1B5E20]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
                Admin Review Simulation (Development Mode)
              </h3>
            </div>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded font-mono text-gray-600 border border-[#A5D6A7]">
              Buildathon Inspection Hook
            </span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            Test the strict verification gate live without waiting for a separate Admin dashboard session. Toggle this account's status to test both blocked and permitted flows:
          </p>
          <div className="flex items-center gap-3 pt-1">
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
      </main>

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
                variant="dark"
                size="sm"
                onClick={() => setGateCheckModal(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default VerificationStatusPage;
