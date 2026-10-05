import React, { useState, useEffect } from 'react';
import { Sprout, Server, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { checkHealth } from '../services/api';

const SetupScreen = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBackendHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkHealth();
      setHealthStatus(data);
    } catch (err) {
      setError(err.message || 'Unable to connect to backend server at http://localhost:8080');
      setHealthStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendHealth();
  }, []);

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col items-center justify-center p-6 text-gray-800">
      <main className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-[#A5D6A7] overflow-hidden">
        {/* Header Banner */}
        <div className="bg-[#1B5E20] text-white p-8 text-center relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#66BB6A] text-white mb-4 shadow-md">
            <Sprout className="w-9 h-9" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">DRAVIX SCM</h1>
          <p className="text-[#A5D6A7] text-lg font-medium mt-1">
            AI-Powered Agricultural Supply Chain Management
          </p>
          <span className="inline-block mt-4 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider text-[#E8F5E9] border border-[#A5D6A7]/40">
            Buildathon Development Environment
          </span>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6">
          <div className="bg-[#E8F5E9]/60 rounded-xl p-5 border border-[#A5D6A7]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1B5E20] mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#66BB6A]" /> Stage 1: Scaffolding Status
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Frontend application structure and theme tokens initialized. Spring Boot backend and local MySQL configuration prepared.
            </p>
          </div>

          {/* Palette Preview */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1B5E20] mb-3">
              Official Theme Palette
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#E8F5E9] border border-[#A5D6A7] text-[#1B5E20] font-medium">
                #E8F5E9<br /><span className="text-[10px] text-gray-500 font-sans">Background</span>
              </div>
              <div className="p-3 rounded-lg bg-[#A5D6A7] text-[#1B5E20] font-medium">
                #A5D6A7<br /><span className="text-[10px] text-gray-700 font-sans">Light Accent</span>
              </div>
              <div className="p-3 rounded-lg bg-[#66BB6A] text-white font-medium">
                #66BB6A<br /><span className="text-[10px] text-white/80 font-sans">Primary</span>
              </div>
              <div className="p-3 rounded-lg bg-[#1B5E20] text-white font-medium">
                #1B5E20<br /><span className="text-[10px] text-white/80 font-sans">Dark Green</span>
              </div>
            </div>
          </div>

          {/* Backend Connectivity Card */}
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#1B5E20] font-semibold">
                <Server className="w-5 h-5 text-[#66BB6A]" />
                <span>Backend Connection Check</span>
              </div>
              <button
                id="btn-test-backend"
                onClick={fetchBackendHealth}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#66BB6A] hover:bg-[#529e56] rounded-md transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Checking...' : 'Check Status'}
              </button>
            </div>

            <div className="text-sm">
              <p className="text-xs text-gray-500 mb-2">Target Endpoint: <code>GET http://localhost:8080/api/health</code></p>
              {healthStatus ? (
                <div className="flex items-center gap-2 text-sm text-[#1B5E20] bg-green-100/80 border border-green-300 p-3 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#1B5E20] shrink-0" />
                  <div>
                    <span className="font-semibold">Backend Status: {healthStatus.status}</span>
                    <p className="text-xs text-green-800">Application: {healthStatus.application} | Server responding</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Backend Offline / Awaiting Startup</span>
                    <p className="text-xs text-amber-700 mt-0.5">{error}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">Checking health...</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 text-center text-xs text-gray-500">
          DRAVIX SCM • Buildathon Stage 1 Foundation • Clean Local Stack
        </div>
      </main>
    </div>
  );
};

export default SetupScreen;
