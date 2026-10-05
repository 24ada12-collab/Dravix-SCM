import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, Shield, Lock } from 'lucide-react';

const PasswordCreationInput = ({ password, setPassword, confirmPassword, setConfirmPassword, onValidChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const checks = [
    { label: 'Minimum 8 characters', valid: password.length >= 8 },
    { label: 'Uppercase letter (A-Z)', valid: /[A-Z]/.test(password) },
    { label: 'Lowercase letter (a-z)', valid: /[a-z]/.test(password) },
    { label: 'Number (0-9)', valid: /[0-9]/.test(password) },
    { label: 'Special character (@$!%*?&)', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const satisfiedCount = checks.filter((c) => c.valid).length;
  const isMatch = password.length > 0 && password === confirmPassword;
  const allSatisfied = satisfiedCount === checks.length;
  const isComplete = allSatisfied && isMatch;

  // Notify parent component of overall validity
  React.useEffect(() => {
    if (onValidChange) {
      onValidChange(isComplete);
    }
  }, [isComplete, onValidChange]);

  // Determine strength label & color
  let strengthLabel = 'Weak';
  let strengthColor = 'bg-red-500';
  let widthPercent = '20%';

  if (satisfiedCount <= 2) {
    strengthLabel = 'Weak';
    strengthColor = 'bg-red-500';
    widthPercent = '25%';
  } else if (satisfiedCount <= 4) {
    strengthLabel = 'Medium';
    strengthColor = 'bg-amber-500';
    widthPercent = '65%';
  } else if (satisfiedCount === 5) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-[#66BB6A]';
    widthPercent = '100%';
  }

  return (
    <div className="space-y-4">
      {/* Password Field */}
      <div>
        <label className="block text-xs font-semibold text-[#1B5E20] mb-1.5 uppercase tracking-wider">
          Create Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white border border-[#A5D6A7] focus:border-[#1B5E20] focus:ring-2 focus:ring-[#E8F5E9] focus:outline-none transition-all pr-10 text-gray-800"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#1B5E20]"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Subtle Animated Strength Bar */}
      {password.length > 0 && (
        <div className="space-y-1.5 transition-all duration-300">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-600 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#1B5E20]" /> Strength:
            </span>
            <span className={`font-bold transition-colors duration-300 ${
              strengthLabel === 'Strong' ? 'text-[#1B5E20]' : strengthLabel === 'Medium' ? 'text-amber-600' : 'text-red-600'
            }`}>
              {strengthLabel}
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${strengthColor}`}
              style={{ width: widthPercent }}
            />
          </div>
        </div>
      )}

      {/* Requirement checklist */}
      <div className="bg-[#E8F5E9]/50 p-3.5 rounded-xl border border-[#A5D6A7] space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#1B5E20]">
          Password Requirements:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
          {checks.map((chk, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 transition-colors duration-200 ${
                chk.valid ? 'text-[#1B5E20] font-medium' : 'text-gray-500'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  chk.valid ? 'bg-[#66BB6A] text-white scale-110' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {chk.valid ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <X className="w-2.5 h-2.5" />}
              </div>
              <span>{chk.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-xs font-semibold text-[#1B5E20] mb-1.5 uppercase tracking-wider">
          Re-enter Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-white border ${
              confirmPassword && !isMatch
                ? 'border-red-400 focus:border-red-500'
                : 'border-[#A5D6A7] focus:border-[#1B5E20]'
            } focus:ring-2 focus:ring-[#E8F5E9] focus:outline-none transition-all pr-10 text-gray-800`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#1B5E20]"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {confirmPassword && !isMatch && (
          <p className="mt-1 text-xs text-red-600 font-medium">Passwords do not match</p>
        )}
        {isMatch && allSatisfied && (
          <p className="mt-1.5 text-xs text-[#1B5E20] font-semibold flex items-center gap-1 animate-fadeIn">
            <Check className="w-3.5 h-3.5 stroke-[3]" /> Password requirements satisfied ✓
          </p>
        )}
      </div>
    </div>
  );
};

export default PasswordCreationInput;
