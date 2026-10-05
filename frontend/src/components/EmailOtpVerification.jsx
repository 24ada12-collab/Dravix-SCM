import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, KeyRound, ShieldAlert } from 'lucide-react';
import Button from './Button';
import { sendOtp, verifyOtp } from '../services/api';

const EmailOtpVerification = ({ email, onVerified }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

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
      setResendCooldown(30);
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
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await verifyOtp(email, enteredOtp);
      setIsVerified(true);
      if (onVerified) onVerified(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#A5D6A7] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-[#1B5E20]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
            Email Verification (OTP)
          </h4>
        </div>
        {isVerified && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-[#1B5E20] text-xs font-bold border border-green-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Email Verified ✓
          </span>
        )}
      </div>

      {!isVerified ? (
        <div className="space-y-3">
          <p className="text-xs text-gray-600">
            A single-use 6-digit verification code will be dispatched to <strong>{email || 'your email'}</strong>.
          </p>

          {!otpSent ? (
            <Button
              variant="dark"
              size="sm"
              loading={loading}
              onClick={handleSendOtp}
              disabled={!email || loading}
            >
              Send 6-Digit OTP
            </Button>
          ) : (
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm tracking-widest font-mono rounded-lg border border-[#A5D6A7] focus:border-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-[#E8F5E9]"
                  />
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  loading={loading}
                  onClick={handleVerifyOtp}
                  disabled={enteredOtp.length !== 6 || loading}
                >
                  Verify OTP
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleSendOtp}
                >
                  {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend'}
                </Button>
              </div>

              <div className="text-xs text-[#1B5E20] font-medium bg-[#E8F5E9] px-3 py-2 rounded-lg border border-[#A5D6A7]">
                Verification code sent to your email.
              </div>
            </div>
          )}

          {error && (
            <div className="text-xs text-red-600 flex items-center gap-1.5 font-medium pt-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-[#1B5E20] font-medium bg-[#E8F5E9] p-3 rounded-lg border border-[#A5D6A7]">
          ✓ Email <strong>{email}</strong> has been authenticated with single-use OTP.
        </p>
      )}
    </div>
  );
};

export default EmailOtpVerification;
