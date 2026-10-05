import React, { useState, useRef } from 'react';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, KeyRound, ShieldCheck, Send, Clock, Sparkles } from 'lucide-react';
import Button from './Button';
import { sendOtp, verifyOtp } from '../services/api';

const EmailOtpVerification = ({ email, onVerified }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRef = useRef(null);

  const handleSendOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email address first.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await sendOtp(email);
      setOtpSent(true);
      setEnteredOtp('');
      setResendCooldown(30);
      setTimeout(() => inputRef.current?.focus(), 150);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      if (err.response?.status === 500 || (err.message && err.message.toLowerCase().includes('network error'))) {
        setError('Unable to send verification email. Please check the email address and try again.');
      } else {
        setError(errMsg || 'Unable to send verification email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!enteredOtp || enteredOtp.trim().length !== 6) {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await verifyOtp(email, enteredOtp);
      setIsVerified(true);
      if (onVerified) onVerified(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#A5D6A7] bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Decorative top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1B5E20] via-[#43A047] to-[#66BB6A]" />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#1B5E20] shadow-inner">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold tracking-tight text-[#1B5E20]">
                  Email Security Verification
                </h4>
                <span className="inline-flex items-center rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-semibold text-[#2E7D32]">
                  Single-Use OTP
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Official verification required for profile authentication
              </p>
            </div>
          </div>

          {isVerified && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#1B5E20] border border-[#81C784] shadow-sm animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-[#2E7D32]" />
              Verified ✓
            </span>
          )}
        </div>

        {!isVerified ? (
          <div className="space-y-4">
            {/* Status bar */}
            <div className="rounded-xl bg-[#F4FBF5] border border-[#C8E6C9] p-3 text-xs text-gray-600 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="flex h-2 w-2 rounded-full bg-[#43A047] shrink-0 animate-pulse" />
                <span className="truncate">
                  Recipient: <strong className="text-gray-900 font-medium">{email || 'Enter email above'}</strong>
                </span>
              </div>
              {otpSent && (
                <span className="shrink-0 text-[11px] font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md">
                  5 min expiry
                </span>
              )}
            </div>

            {!otpSent ? (
              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Click the button to receive an instant 6-digit verification code to your inbox.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  loading={loading}
                  onClick={handleSendOtp}
                  disabled={!email || loading}
                  className="shadow-sm font-semibold shrink-0"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Send OTP Code
                </Button>
              </div>
            ) : (
              <div className="space-y-3.5 pt-1">
                {/* Visual OTP Input with character boxes display */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Enter the 6-digit code sent to your inbox:
                  </label>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[0.55em] text-xl font-bold font-mono py-2.5 px-4 rounded-xl border-2 border-[#A5D6A7] bg-white text-[#1B5E20] focus:border-[#2E7D32] focus:ring-4 focus:ring-[#E8F5E9] focus:outline-none transition-all placeholder:tracking-[0.4em] placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-2 pt-0.5">
                  <Button
                    variant="primary"
                    size="md"
                    loading={loading}
                    onClick={handleVerifyOtp}
                    disabled={enteredOtp.length !== 6 || loading}
                    className="flex-1 font-bold shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    Verify Code
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    disabled={resendCooldown > 0 || loading}
                    onClick={handleSendOtp}
                    className="text-xs font-semibold text-[#1B5E20] border-[#A5D6A7] hover:bg-[#E8F5E9] whitespace-nowrap"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Code'}
                  </Button>
                </div>

                {/* Notice text */}
                <div className="flex items-center gap-2 text-[11px] text-[#2E7D32] bg-[#E8F5E9]/60 border border-[#C8E6C9] px-3 py-2 rounded-lg">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Code dispatched via Gmail SMTP. Check your spam folder if not received in 30 seconds.</span>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-gradient-to-r from-[#E8F5E9] to-[#F1F8E9] border border-[#81C784] p-3.5 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2E7D32] text-white shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1B5E20]">Authentication Successful</p>
              <p className="text-[11px] text-[#2E7D32]">
                Your email <strong className="text-gray-900">{email}</strong> has been confirmed and verified.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailOtpVerification;
