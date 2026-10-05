import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wheat,
  Warehouse,
  Truck,
  ShoppingCart,
  ArrowRight,
  Shield,
  CheckCircle,
  HelpCircle,
  Sprout
} from 'lucide-react';
import RoleCard from '../components/RoleCard';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState('farmer');
  const navigate = useNavigate();

  const roles = [
    {
      id: 'farmer',
      title: 'Farmer / Producer',
      subtitle: 'Agricultural Producer',
      description: 'Find cold storage & dry godowns nearby, store harvested crops securely, avoid distress selling, and list produce on the marketplace.',
      icon: Wheat,
      route: '/register/farmer',
    },
    {
      id: 'warehouse',
      title: 'Warehouse Manager',
      subtitle: 'Storage Facility',
      description: 'List multi-chamber storage capacities, manage inbound agricultural stocks, and declare WDRA registration & e-NWR eligibility.',
      icon: Warehouse,
      route: '/register/warehouse',
    },
    {
      id: 'logistics',
      title: 'Logistics Provider',
      subtitle: 'Fleet & Freight Operator',
      description: 'Register transport fleets, view aggregated route dispatches between farm gates, storage godowns, and wholesale buyers.',
      icon: Truck,
      route: '/register/logistics',
    },
    {
      id: 'customer',
      title: 'Buyer / Customer',
      subtitle: 'Wholesale & Enterprise Buyer',
      description: 'Procure origin-verified produce directly from storage facilities with verified weight records and tracked transit delivery.',
      icon: ShoppingCart,
      route: '/register/customer',
    },
  ];

  const handleContinue = () => {
    const roleObj = roles.find((r) => r.id === selectedRole);
    if (roleObj) {
      navigate(roleObj.route);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        {/* Header section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#A5D6A7] text-[#1B5E20] text-xs font-bold uppercase tracking-wider mb-3">
            <Sprout className="w-3.5 h-3.5 text-[#66BB6A]" /> Step 1: Account Type Selection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B5E20] tracking-tight">
            Create Your DRAVIX Account
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Select how you will participate in the DRAVIX supply chain network to access customized tools and workflows.
          </p>
        </div>

        {/* Roles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              roleId={role.id}
              title={role.title}
              subtitle={role.subtitle}
              description={role.description}
              icon={role.icon}
              selected={selectedRole === role.id}
              onSelect={(id) => setSelectedRole(id)}
            />
          ))}
        </div>

        {/* Role action bar */}
        <div className="bg-white rounded-2xl p-6 border border-[#A5D6A7] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Shield className="w-5 h-5 text-[#66BB6A] shrink-0" />
            <span>
              Role selected: <strong className="text-[#1B5E20] capitalize font-bold">{selectedRole}</strong>. Administrator accounts are managed centrally and cannot be publicly registered.
            </span>
          </div>

          <Button
            variant="dark"
            size="lg"
            icon={ArrowRight}
            onClick={handleContinue}
            className="w-full sm:w-auto px-8"
          >
            Continue to Registration
          </Button>
        </div>

        {/* Informational help card */}
        <div className="mt-8 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#66BB6A]" />
          <span>Already registered? <button onClick={() => alert('Sign-in workflow will be connected in Stage 3.')} className="text-[#1B5E20] font-semibold underline cursor-pointer">Sign in to your account</button></span>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
