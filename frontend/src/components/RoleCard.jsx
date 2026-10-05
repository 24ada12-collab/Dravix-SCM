import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

const RoleCard = ({
  roleId,
  title,
  subtitle,
  description,
  icon: Icon,
  selected = false,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(roleId)}
      className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-200 border-2 text-left ${
        selected
          ? 'border-[#1B5E20] bg-white shadow-lg ring-2 ring-[#66BB6A]/40'
          : 'border-[#A5D6A7]/70 bg-white/90 hover:border-[#66BB6A] hover:bg-white hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${selected ? 'bg-[#1B5E20] text-white' : 'bg-[#E8F5E9] text-[#1B5E20]'}`}>
          <Icon className="w-7 h-7" />
        </div>
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
            selected
              ? 'bg-[#1B5E20] border-[#1B5E20] text-white'
              : 'border-gray-300 bg-white'
          }`}
        >
          {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-bold text-[#1B5E20]">{title}</h3>
        {subtitle && (
          <p className="text-xs font-semibold text-[#66BB6A] uppercase tracking-wider mt-0.5">
            {subtitle}
          </p>
        )}
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center text-xs font-semibold text-[#1B5E20] group">
        <span>Register as {title}</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1 text-[#66BB6A]" />
      </div>
    </div>
  );
};

export default RoleCard;
