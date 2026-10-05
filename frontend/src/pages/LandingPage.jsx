import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Warehouse,
  Truck,
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Sparkles,
  Users,
  Building2,
  AlertTriangle,
  Scale
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  const workflowSteps = [
    {
      step: '01',
      title: 'Farmer Harvest & Discovery',
      description: 'Farmers calculate harvest volumes and discover nearby eligible warehouses within dynamic 10km to 50km radii.',
      icon: MapPin,
    },
    {
      step: '02',
      title: 'Storage & e-NWR Ingestion',
      description: 'Crops are securely stored. WDRA-registered facilities generate verifiable electronic warehouse receipts.',
      icon: Warehouse,
    },
    {
      step: '03',
      title: 'Marketplace Listing',
      description: 'Stored commodities are listed directly on the transparent agricultural exchange for verified institutional buyers.',
      icon: ShoppingCart,
    },
    {
      step: '04',
      title: 'Order & Freight Dispatch',
      description: 'Customer orders automatically coordinate logistics capacity and route optimization for seamless field pickup.',
      icon: Truck,
    },
    {
      step: '05',
      title: 'Delivery & Settlement',
      description: 'Verified delivery confirmation closes the chain with end-to-end auditability and transparent payments.',
      icon: CheckCircle2,
    },
  ];

  const features = [
    {
      title: 'Smart Warehouse Discovery',
      description: 'Progressive radius search (10km → 25km → 50km) evaluating distance, verified capacity, storage costs, and commodity compatibility.',
      icon: Warehouse,
      tag: 'Dynamic Discovery',
    },
    {
      title: 'Agricultural Marketplace',
      description: 'Direct trade channel connecting farmers holding verified stored stock with wholesale buyers, eliminating intermediary exploitation.',
      icon: ShoppingCart,
      tag: 'Direct Trade',
    },
    {
      title: 'Logistics Fleet Coordination',
      description: 'Intelligent freight dispatching matching agricultural load tonnages with qualified local transport fleets and planned routes.',
      icon: Truck,
      tag: 'Dispatch Routing',
    },
    {
      title: 'Explainable AI Scoring',
      description: 'Transparent recommendation engine evaluating warehouse suitability and market dispatch viability without opaque black-box claims.',
      icon: Sparkles,
      tag: 'Rule-Based AI',
    },
    {
      title: 'Real-Time Inventory Visibility',
      description: 'End-to-end commodity tracking across multi-chamber storage facilities, moisture monitors, and transit waypoints.',
      icon: TrendingUp,
      tag: 'Traceability',
    },
    {
      title: 'Role-Governed Ecosystem',
      description: 'Tailored workspaces and permissions for Farmers, Warehouse Managers, Logistics Operators, and Enterprise Customers.',
      icon: ShieldCheck,
      tag: 'Security & RBAC',
    },
  ];

  const stakeholders = [
    {
      role: 'Farmers',
      title: 'Value Preservation & Market Access',
      benefit: 'Prevent distress selling after harvest, discover affordable cold storage nearby, and access fair commodity prices.',
      icon: Users,
    },
    {
      role: 'Warehouse Operators',
      title: 'Optimized Occupancy & WDRA Compliance',
      benefit: 'Fill unutilized chamber capacity, automate inward/outward documentation, and manage e-NWR compliance efficiently.',
      icon: Building2,
    },
    {
      role: 'Logistics Providers',
      title: 'High-Density Route Dispatching',
      benefit: 'Eliminate empty return trips, aggregate agricultural freight, and receive automated warehouse dispatch notices.',
      icon: Truck,
    },
    {
      role: 'Commodity Buyers',
      title: 'Direct Sourcing & Verified Quality',
      benefit: 'Procure origin-verified agricultural produce stored in accredited warehouses with reliable delivery tracking.',
      icon: ShoppingCart,
    },
  ];

  const painPoints = [
    {
      issue: 'Distress Crop Selling',
      solution: 'Farmers often sell immediately post-harvest at rock-bottom rates because affordable storage is undiscoverable.',
    },
    {
      issue: 'Opaque Warehouse Availability',
      solution: 'No centralized system reveals real-time chamber capacities, commodity compatibility, or government WDRA status.',
    },
    {
      issue: 'Fragmented Transport Coordination',
      solution: 'Disjointed communication between farm gates, rural godowns, and interstate trucks leads to severe spoilage.',
    },
    {
      issue: 'Lack of Explainable Recommendations',
      solution: 'Users lack objective metrics on when to split storage across facilities or which route minimizes transit costs.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#E8F5E9] text-gray-800 flex flex-col font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#A5D6A7] text-[#1B5E20] text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#66BB6A] animate-pulse"></span>
              Next-Gen Agri-Tech Supply Chain
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1B5E20] tracking-tight leading-tight">
              Transforming Agricultural Supply Chains With{' '}
              <span className="text-[#66BB6A] underline decoration-[#A5D6A7] decoration-wavy decoration-2">
                Intelligence
              </span>
            </h1>

            {/* Supporting Message */}
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-normal">
              DRAVIX connects farmers, accredited warehouses, logistics providers, and wholesale buyers through an explainable, data-driven supply chain network.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                variant="dark"
                size="lg"
                icon={ArrowRight}
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto text-base"
              >
                Get Started Today
              </Button>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  variant="outlineLight"
                  size="lg"
                  className="w-full sm:w-auto text-base"
                >
                  Explore Platform Flow
                </Button>
              </a>
            </div>

            {/* Visual Value Chain Pathway */}
            <div className="mt-14 pt-8 border-t border-[#A5D6A7]/60">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] mb-4">
                Unified End-to-End Value Chain
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                {[
                  { name: '1. Farmer', sub: 'Harvest Log' },
                  { name: '2. Warehouse', sub: 'e-NWR Inward' },
                  { name: '3. Marketplace', sub: 'Trading' },
                  { name: '4. Logistics', sub: 'Fleet Dispatch' },
                  { name: '5. Buyer', sub: 'Fulfilled' },
                ].map((item, idx) => (
                  <div
                    key={item.name}
                    className="p-3 bg-white rounded-xl border border-[#A5D6A7] shadow-sm flex flex-col justify-center"
                  >
                    <span className="text-xs font-bold text-[#1B5E20]">{item.name}</span>
                    <span className="text-[10px] text-gray-500 font-medium">{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM & VALUE SECTION */}
      <section className="py-16 bg-white border-y border-[#A5D6A7]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#66BB6A]">
              The Supply Chain Challenge
            </h2>
            <h3 className="text-3xl font-extrabold text-[#1B5E20] mt-1">
              Why Agriculture Needs DRAVIX SCM
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Fragmented manual workflows result in over 20% agricultural post-harvest loss and unfair pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {painPoints.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[#E8F5E9]/50 border border-[#A5D6A7] flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1B5E20] text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#A5D6A7]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#1B5E20]">{item.issue}</h4>
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                    {item.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW DRAVIX WORKS */}
      <section id="how-it-works" className="py-20 bg-[#E8F5E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
              Operational Workflow
            </h2>
            <h3 className="text-3xl font-extrabold text-[#1B5E20] mt-1">
              How DRAVIX Moves Produce From Farm to Buyer
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              A transparent, 5-step synchronized cycle built on verified capacity and smart coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-[#A5D6A7] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black px-2.5 py-1 rounded bg-[#E8F5E9] text-[#1B5E20]">
                        {step.step}
                      </span>
                      <div className="p-2.5 rounded-xl bg-[#66BB6A]/10 text-[#1B5E20]">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-[#1B5E20] mb-2">{step.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PLATFORM FEATURES */}
      <section id="features" className="py-20 bg-white border-y border-[#A5D6A7]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#66BB6A]">
              Core Capabilities
            </h2>
            <h3 className="text-3xl font-extrabold text-[#1B5E20] mt-1">
              Engineered for Real-World Agricultural Scenarios
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Eliminating guesswork with explainable algorithms, distance radius searching, and e-NWR compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="p-7 rounded-2xl bg-white border border-[#A5D6A7] hover:border-[#66BB6A] hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-[#E8F5E9] text-[#1B5E20] group-hover:bg-[#1B5E20] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E8F5E9] text-[#1B5E20]">
                      {feat.tag}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#1B5E20] mb-2">{feat.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. STAKEHOLDER ECOSYSTEM */}
      <section id="ecosystem" className="py-20 bg-[#E8F5E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
              Who DRAVIX Serves
            </h2>
            <h3 className="text-3xl font-extrabold text-[#1B5E20] mt-1">
              Built for Every Player in the Agricultural Ecosystem
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Dedicated interfaces and specialized tools designed for each critical supply chain participant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stakeholders.map((sh, index) => {
              const Icon = sh.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-7 border border-[#A5D6A7] shadow-sm flex gap-5 items-start"
                >
                  <div className="p-3.5 rounded-xl bg-[#1B5E20] text-white shrink-0">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#66BB6A]">
                      {sh.role}
                    </span>
                    <h4 className="text-lg font-bold text-[#1B5E20] mt-0.5 mb-1.5">{sh.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{sh.benefit}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="py-20 bg-[#1B5E20] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 border border-white/20 mb-2">
            <Scale className="w-8 h-8 text-[#A5D6A7]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Build a Smarter Agricultural Supply Chain
          </h2>
          <p className="text-[#A5D6A7] max-w-2xl mx-auto text-base sm:text-lg">
            Join the DRAVIX network today. Choose your role as a farmer, warehouse owner, freight operator, or customer to get started.
          </p>
          <div className="pt-4 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={() => navigate('/register')}
              className="px-8 py-4 text-base shadow-lg"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <Footer />
    </div>
  );
};

export default LandingPage;
