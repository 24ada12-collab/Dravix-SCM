import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wheat, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';

const AgriculturalIdentitySelect = () => {
  const navigate = useNavigate();
  const [selectedIdentity, setSelectedIdentity] = useState('farmer');

  const options = [
    {
      id: 'farmer',
      title: 'FARMER',
      subtitle: 'Individual Landowner or Leaseholder',
      description: 'I own or lease agricultural land and manage agricultural production.',
      icon: Wheat,
      route: '/register/farmer-form',
    },
    {
      id: 'fpo_member',
      title: 'FPO MEMBER',
      subtitle: 'Farmer Producer Organisation Member',
      description: 'I am a member of a Farmer Producer Organisation holding a valid Share Certificate.',
      icon: Users,
      route: '/register/fpo-member-form',
    },
  ];

  const handleContinue = () => {
    const chosen = options.find((o) => o.id === selectedIdentity);
    if (chosen) {
      navigate(chosen.route);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <button
          onClick={() => navigate('/register')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B5E20] hover:underline mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Role Selection
        </button>

        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#A5D6A7] text-[#1B5E20] text-xs font-bold uppercase tracking-wider mb-3">
            Agricultural Verification Step
          </span>
          <h1 className="text-3xl font-black text-[#1B5E20] tracking-tight">
            Choose Your Agricultural Identity
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Select the category that corresponds to your farming operations for proper regulatory documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedIdentity === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedIdentity(opt.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-[#1B5E20] shadow-lg ring-2 ring-[#66BB6A]/40'
                    : 'bg-white/80 border-[#A5D6A7] hover:border-[#66BB6A]'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-[#1B5E20] text-white' : 'bg-[#E8F5E9] text-[#1B5E20]'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-[#1B5E20] bg-[#1B5E20]' : 'border-gray-300'
                  }`}>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                <h3 className="text-lg font-black text-[#1B5E20]">{opt.title}</h3>
                <p className="text-xs font-semibold text-[#66BB6A] uppercase tracking-wider mt-0.5">
                  {opt.subtitle}
                </p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  "{opt.description}"
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#A5D6A7] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            Selected: <strong className="text-[#1B5E20] uppercase font-bold">{selectedIdentity.replace('_', ' ')}</strong>. You will proceed to map location and identity setup.
          </p>
          <Button
            variant="dark"
            size="lg"
            icon={ArrowRight}
            onClick={handleContinue}
            className="w-full sm:w-auto px-8"
          >
            Continue
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AgriculturalIdentitySelect;
