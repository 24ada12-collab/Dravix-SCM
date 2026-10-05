import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Warehouse,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Building2,
  User,
  Phone,
  Scale,
  Snowflake,
  Shield,
  MapPin,
  Lock,
} from 'lucide-react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LocationPicker from '../components/LocationPicker';
import EmailOtpVerification from '../components/EmailOtpVerification';
import PasswordCreationInput from '../components/PasswordCreationInput';
import { registerWarehouse } from '../services/api';
import { useAuth } from '../services/AuthContext';

const WarehouseRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Multi-step registration state:
  // Step 1: Warehouse Details, Owner, Capacity, Cold Storage, WDRA, Map Location
  // Step 2: Email & OTP Verification
  // Step 3: Password Creation & Final Registration
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields - Step 1: Warehouse & Facility Details
  const [warehouseName, setWarehouseName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [totalCapacityKg, setTotalCapacityKg] = useState('');
  const [coldStorageAvailable, setColdStorageAvailable] = useState(false);
  const [wdraRegistered, setWdraRegistered] = useState(false);
  const [wdraRegNumber, setWdraRegNumber] = useState('');

  // Map Location details
  const [locationData, setLocationData] = useState({
    latitude: 11.341,
    longitude: 77.7172,
    address: 'Near Agro-Hub, Perundurai Road',
    district: 'Erode',
    state: 'Tamil Nadu',
    pincode: '638052',
  });

  // Step 2: Email & OTP Verification
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

  // Step 3: Password Creation
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // Processing state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Step 1 Validation & Proceed
  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!warehouseName.trim()) {
      setError('Please provide the Warehouse / Godown Name.');
      return;
    }
    if (!ownerName.trim()) {
      setError('Please provide the Owner / Facility Manager Name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length !== 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }
    if (!totalCapacityKg || Number(totalCapacityKg) <= 0) {
      setError('Please enter a valid total storage capacity greater than 0.');
      return;
    }
    if (wdraRegistered && !wdraRegNumber.trim()) {
      setError('Please provide your WDRA Registration Number.');
      return;
    }
    if (!locationData.latitude || !locationData.longitude) {
      setError('Please confirm the facility location on the interactive map.');
      return;
    }

    setError(null);
    setCurrentStep(2);
  };

  // Step 2 Validation & Proceed
  const handleStep2Submit = () => {
    if (!emailVerified) {
      setError('Please verify your email address via the OTP before proceeding.');
      return;
    }
    setError(null);
    setCurrentStep(3);
  };

  // Step 3 Final Registration
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('Please satisfy all password security requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const payload = {
        warehouseName: warehouseName.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        totalCapacityKg: parseFloat(totalCapacityKg),
        coldStorageAvailable,
        wdraRegistered,
        wdraRegNumber: wdraRegistered ? wdraRegNumber.trim() : null,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.address,
        district: locationData.district,
        state: locationData.state,
        pincode: locationData.pincode,
        email: email.trim().toLowerCase(),
        password,
      };

      const response = await registerWarehouse(payload);
      login(response);
      setRegistrationSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Warehouse registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Navigation / Step indicator */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
                setError(null);
              } else {
                navigate('/register');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B5E20] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />{' '}
            {currentStep === 1 ? 'Back to Role Select' : 'Previous Step'}
          </button>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                  currentStep === step
                    ? 'bg-[#1B5E20] text-white shadow-sm ring-2 ring-[#66BB6A]'
                    : currentStep > step
                    ? 'bg-[#66BB6A] text-white'
                    : 'bg-white text-gray-400 border border-[#A5D6A7]'
                }`}
              >
                {currentStep > step ? '✓' : step}
              </div>
            ))}
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl border border-[#A5D6A7] shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#1B5E20] text-white p-6 sm:p-8 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-[#A5D6A7] text-xs font-semibold uppercase tracking-wider mb-2">
                <Warehouse className="w-3.5 h-3.5" /> Storage Facility Registration
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Register Warehouse
              </h1>
              <p className="text-xs sm:text-sm text-[#A5D6A7] mt-1">
                Step {currentStep} of 3:{' '}
                {currentStep === 1 && 'Facility Profile, Capacity & Geo-Location'}
                {currentStep === 2 && 'Email OTP Verification'}
                {currentStep === 3 && 'Secure Password & Account Creation'}
              </p>
            </div>
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-[#66BB6A] text-white items-center justify-center shrink-0">
              <Warehouse className="w-8 h-8" />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="m-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Success View */}
          {registrationSuccess ? (
            <div className="p-8 sm:p-12 text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto border-2 border-[#66BB6A]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-bold text-[#1B5E20]">
                Warehouse Registered Successfully!
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Facility <strong>{warehouseName}</strong> has been enrolled under{' '}
                <strong>{ownerName}</strong> with {Number(totalCapacityKg).toLocaleString()} kg total capacity.
              </p>
              <div className="p-4 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7] text-xs text-[#1B5E20] font-medium max-w-md mx-auto space-y-1">
                <div>Account Role: <strong>Warehouse Manager</strong></div>
                <div>Status: <strong>Pending Administrative Review & Verification</strong></div>
                {wdraRegistered && (
                  <div className="text-[11px] text-[#2E7D32]">WDRA Accreditation tagged for e-NWR eligibility</div>
                )}
              </div>
              <div className="pt-4 flex justify-center gap-3">
                <Button variant="dark" onClick={() => navigate('/warehouses')}>
                  Browse All Warehouses
                </Button>
                <Button variant="outlineLight" onClick={() => navigate('/')}>
                  Go to Home
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8">
              {/* ================= STEP 1: Facility Details, Capacity & Map ================= */}
              {currentStep === 1 && (
                <form onSubmit={handleStep1Submit} className="space-y-6">
                  {/* Facility Identity */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-[#E8F5E9] mb-4 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#66BB6A]" /> Facility Identity & Ownership
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        id="warehouseName"
                        label="Warehouse / Godown Name"
                        placeholder="e.g. Kisan Agro Cold Storage & Godown"
                        value={warehouseName}
                        onChange={(e) => setWarehouseName(e.target.value)}
                        required
                      />
                      <FormInput
                        id="ownerName"
                        label="Owner / Manager Full Name"
                        placeholder="e.g. Ramesh Kumar"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone & Capacity */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-[#E8F5E9] mb-4 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-[#66BB6A]" /> Contact & Storage Capacity
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        id="phone"
                        label="Contact Phone Number"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                      <FormInput
                        id="totalCapacityKg"
                        label="Total Storage Capacity (in KG)"
                        type="number"
                        placeholder="e.g. 50000"
                        value={totalCapacityKg}
                        onChange={(e) => setTotalCapacityKg(e.target.value)}
                        helper="Enter capacity in kilograms (e.g., 50 MT = 50,000 kg)"
                        required
                      />
                    </div>
                  </div>

                  {/* Cold Storage & WDRA Specs */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-[#E8F5E9] mb-3 flex items-center gap-1.5">
                      <Snowflake className="w-4 h-4 text-[#66BB6A]" /> Facility Capabilities & Compliance
                    </h3>

                    {/* Cold Storage Toggle */}
                    <div className="p-4 rounded-xl border border-[#A5D6A7] bg-[#E8F5E9]/40 flex items-center justify-between">
                      <div className="space-y-0.5 pr-4">
                        <label className="text-xs font-bold text-[#1B5E20] flex items-center gap-2 cursor-pointer">
                          <Snowflake className="w-4 h-4 text-[#2E7D32]" /> Cold Storage Facility Available
                        </label>
                        <p className="text-[11px] text-gray-600">
                          Equipped with climate control chambers suitable for perishables, fruits, and vegetables.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={coldStorageAvailable}
                          onChange={(e) => setColdStorageAvailable(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B5E20]"></div>
                      </label>
                    </div>

                    {/* WDRA Accreditation */}
                    <div className="p-4 rounded-xl border border-[#A5D6A7] bg-[#E8F5E9]/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5 pr-4">
                          <label className="text-xs font-bold text-[#1B5E20] flex items-center gap-2 cursor-pointer">
                            <Shield className="w-4 h-4 text-[#2E7D32]" /> WDRA Registered Warehouse
                          </label>
                          <p className="text-[11px] text-gray-600">
                            Warehousing Development and Regulatory Authority accredited (e-NWR pledge eligible).
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={wdraRegistered}
                            onChange={(e) => setWdraRegistered(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B5E20]"></div>
                        </label>
                      </div>

                      {wdraRegistered && (
                        <div className="pt-2 animate-fadeIn">
                          <FormInput
                            id="wdraRegNumber"
                            label="WDRA Registration Certificate Number"
                            placeholder="e.g. WDRA/REG/2024/09812"
                            value={wdraRegNumber}
                            onChange={(e) => setWdraRegNumber(e.target.value)}
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location via Search / Interactive Map */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-[#E8F5E9] mb-4 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#66BB6A]" /> Warehouse Location & Map Coordinates
                    </h3>
                    <LocationPicker
                      title="Pinpoint Warehouse on Map"
                      subtitle="Search by town/landmark, use your GPS location, or click anywhere on the map to position the facility"
                      initialLat={locationData.latitude}
                      initialLng={locationData.longitude}
                      onLocationConfirm={(loc) => {
                        setLocationData(loc);
                      }}
                    />
                  </div>

                  {/* Proceed Button */}
                  <div className="pt-4 flex justify-end">
                    <Button variant="primary" size="md" icon={ArrowRight} type="submit">
                      Proceed to Email Verification
                    </Button>
                  </div>
                </form>
              )}

              {/* ================= STEP 2: Email & OTP Verification ================= */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-[#E8F5E9] mb-4">
                      Official Email & Identity Verification
                    </h3>
                    <p className="text-xs text-gray-600 mb-4">
                      Enter the official email for warehouse communications. We will deliver a secure 6-digit one-time code to authenticate the facility record.
                    </p>

                    <div className="mb-4">
                      <FormInput
                        id="email"
                        label="Official Email Address"
                        type="email"
                        placeholder="manager@warehouse.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailVerified(false);
                        }}
                        disabled={emailVerified}
                        required
                      />
                    </div>

                    <EmailOtpVerification
                      email={email}
                      onVerified={(verified) => {
                        setEmailVerified(verified);
                        setError(null);
                      }}
                    />
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                    <Button
                      variant="outlineLight"
                      size="sm"
                      onClick={() => setCurrentStep(1)}
                    >
                      ← Back to Facility Profile
                    </Button>

                    <Button
                      variant="primary"
                      size="md"
                      icon={ArrowRight}
                      disabled={!emailVerified}
                      onClick={handleStep2Submit}
                    >
                      Proceed to Password Setup
                    </Button>
                  </div>
                </div>
              )}

              {/* ================= STEP 3: Password Creation & Final Registration ================= */}
              {currentStep === 3 && (
                <form onSubmit={handleFinalSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-[#E8F5E9] mb-4 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-[#66BB6A]" /> Create Account Password
                    </h3>
                    <p className="text-xs text-gray-600 mb-4">
                      Create and re-enter a strong password to secure your warehouse manager portal.
                    </p>

                    <PasswordCreationInput
                      password={password}
                      setPassword={setPassword}
                      confirmPassword={confirmPassword}
                      setConfirmPassword={setConfirmPassword}
                      onValidChange={(valid) => setIsPasswordValid(valid)}
                    />
                  </div>

                  {/* Summary of what will be created */}
                  <div className="p-4 rounded-xl bg-[#E8F5E9]/50 border border-[#A5D6A7] text-xs text-gray-700 space-y-1.5">
                    <div className="font-bold text-[#1B5E20]">Facility Registration Summary:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                      <div>• Warehouse: <strong>{warehouseName}</strong></div>
                      <div>• Owner: <strong>{ownerName}</strong></div>
                      <div>• Capacity: <strong>{Number(totalCapacityKg).toLocaleString()} kg</strong></div>
                      <div>• Cold Storage: <strong>{coldStorageAvailable ? 'Yes' : 'No'}</strong></div>
                      <div>• WDRA Status: <strong>{wdraRegistered ? `Registered (${wdraRegNumber})` : 'Standard'}</strong></div>
                      <div>• Coordinates: <strong>{locationData.latitude.toFixed(4)}, {locationData.longitude.toFixed(4)}</strong></div>
                      <div className="sm:col-span-2">• Email: <strong>{email}</strong></div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                    <Button
                      variant="outlineLight"
                      size="sm"
                      onClick={() => setCurrentStep(2)}
                      disabled={loading}
                    >
                      ← Back to OTP
                    </Button>

                    <Button
                      variant="primary"
                      size="md"
                      icon={CheckCircle2}
                      type="submit"
                      loading={loading}
                      disabled={!isPasswordValid || loading}
                    >
                      Create Warehouse Account
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WarehouseRegistration;
