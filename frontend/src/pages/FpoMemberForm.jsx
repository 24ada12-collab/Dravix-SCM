import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LocationPicker from '../components/LocationPicker';
import EmailOtpVerification from '../components/EmailOtpVerification';
import PasswordCreationInput from '../components/PasswordCreationInput';
import { registerFarmerOrFpo } from '../services/api';
import { useAuth } from '../services/AuthContext';

const FpoMemberForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Map location data
  const [locationData, setLocationData] = useState({
    latitude: 19.9975,
    longitude: 73.7898,
    address: 'Near Agromarket, Trimbak Road',
    district: 'Nashik',
    state: 'Maharashtra',
    pincode: '422002',
  });

  // Email & OTP
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

  // Password & Live Animation validation
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // Processing state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please provide your Full Name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length !== 10) {
      setError('Please provide a valid 10-digit contact number.');
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  const handleStep2Submit = () => {
    if (!emailVerified) {
      setError('Please complete email OTP verification before proceeding.');
      return;
    }
    setError(null);
    setCurrentStep(3);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('Please satisfy all password requirements.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const payload = {
        fullName,
        phone,
        email,
        password,
        role: 'FPO_MEMBER',
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.address,
        district: locationData.district,
        state: locationData.state,
        pincode: locationData.pincode,
      };

      const response = await registerFarmerOrFpo(payload);
      login(response);

      navigate('/verification');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
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
              if (currentStep > 1) setCurrentStep(currentStep - 1);
              else navigate('/register/farmer');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B5E20] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {currentStep === 1 ? 'Back to Identity Select' : 'Previous Step'}
          </button>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                  currentStep === step
                    ? 'bg-[#1B5E20] text-white'
                    : currentStep > step
                    ? 'bg-[#66BB6A] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#A5D6A7] shadow-xl overflow-hidden">
          <div className="bg-[#1B5E20] text-white p-6 sm:p-7 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-[#A5D6A7]">
                FPO Member Registration • Step {currentStep} of 3
              </span>
              <h1 className="text-2xl font-black tracking-tight mt-1">
                {currentStep === 1 && 'Personal Info & Location Map'}
                {currentStep === 2 && 'Email & OTP Verification'}
                {currentStep === 3 && 'Create Secure Password'}
              </h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#66BB6A] text-white flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {error && (
            <div className="m-6 mb-0 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {error}
            </div>
          )}

          {/* STEP 1: Personal Info + Leaflet Map */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-gray-100 mb-4 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#66BB6A]" /> 1. Member Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    id="fullName"
                    label="Full Name"
                    placeholder="e.g. Radhika Deshmukh"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <FormInput
                    id="phone"
                    type="tel"
                    label="Contact Number"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    helperText="10-digit mobile number"
                    required
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-gray-100 mb-4 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#66BB6A]" /> 2. Drop Location Pin on Map
                </h3>
                <LocationPicker
                  onLocationConfirm={(data) => setLocationData(data)}
                  initialLat={locationData.latitude}
                  initialLng={locationData.longitude}
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button
                  type="submit"
                  variant="dark"
                  size="md"
                  icon={ArrowRight}
                  className="px-8"
                >
                  Continue to Email Verification
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: Email & OTP */}
          {currentStep === 2 && (
            <div className="p-6 sm:p-8 space-y-6">
              <FormInput
                id="email"
                type="email"
                label="Email Address for Verification"
                placeholder="fpo.member@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailVerified(false);
                }}
                disabled={emailVerified}
                required
              />

              <EmailOtpVerification
                email={email}
                onVerified={() => setEmailVerified(true)}
              />

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="dark"
                  size="md"
                  icon={ArrowRight}
                  disabled={!emailVerified}
                  onClick={handleStep2Submit}
                  className="px-8"
                >
                  Proceed to Password Setup
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Password Creation */}
          {currentStep === 3 && (
            <form onSubmit={handleFinalSubmit} className="p-6 sm:p-8 space-y-6">
              <PasswordCreationInput
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                onValidChange={(valid) => setIsPasswordValid(valid)}
              />

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(2)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="dark"
                  size="lg"
                  loading={loading}
                  disabled={!isPasswordValid || loading}
                  className="px-8 shadow-md"
                >
                  Complete Account Creation
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FpoMemberForm;
