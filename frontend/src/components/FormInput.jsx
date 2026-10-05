import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const FormInput = ({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  helperText,
  disabled = false,
  className = '',
  rows,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-[#1B5E20] mb-1.5 uppercase tracking-wider">
          {label} {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            id={id}
            name={name || id}
            rows={rows || 3}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-white border ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                : 'border-[#A5D6A7] focus:border-[#1B5E20] focus:ring-[#E8F5E9]'
            } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 placeholder-gray-400`}
            {...props}
          />
        ) : (
          <input
            id={id}
            name={name || id}
            type={inputType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-white border ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                : 'border-[#A5D6A7] focus:border-[#1B5E20] focus:ring-[#E8F5E9]'
            } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 placeholder-gray-400 ${
              isPassword ? 'pr-10' : ''
            }`}
            {...props}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#1B5E20] focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error ? (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default FormInput;
