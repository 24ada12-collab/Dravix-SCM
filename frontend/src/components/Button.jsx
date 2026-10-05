import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-[#66BB6A] hover:bg-[#529e56] text-white focus:ring-[#66BB6A] shadow-sm hover:shadow active:scale-[0.99]',
    dark: 'bg-[#1B5E20] hover:bg-[#144618] text-white focus:ring-[#1B5E20] shadow-sm hover:shadow active:scale-[0.99]',
    outline: 'border-2 border-[#1B5E20] text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white focus:ring-[#1B5E20] bg-transparent',
    outlineLight: 'border-2 border-[#A5D6A7] text-[#1B5E20] hover:bg-[#E8F5E9] focus:ring-[#66BB6A] bg-white',
    ghost: 'text-[#1B5E20] hover:bg-[#E8F5E9] focus:ring-[#66BB6A]',
    secondary: 'bg-[#A5D6A7] hover:bg-[#94c996] text-[#1B5E20] focus:ring-[#A5D6A7]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
