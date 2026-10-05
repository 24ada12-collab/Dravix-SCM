import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wheat, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FarmerRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    district: '',
    state: '',
    pincode: '',
    farmSizeAcres: '',
    primaryCrop: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.address.trim()) newErrors.address = 'Village / Street address is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Enter a valid 6-digit postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate frontend registration submission (Authentication backend will hook up in Stage 3)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Back Link */}
        <button
          onClick={() => navigate('/register')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B5E20] hover:underline mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Change Role
        </button>

        <div className="bg-white rounded-2xl border border-[#A5D6A7] shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#1B5E20] text-white p-6 sm:p-8 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-[#A5D6A7] text-xs font-semibold uppercase tracking-wider mb-2">
                <Wheat className="w-3.5 h-3.5" /> Farmer Onboarding
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Farmer & Producer Registration
              </h1>
              <p className="text-xs sm:text-sm text-[#A5D6A7] mt-1">
                Register to find nearby verified storage, protect crops, and trade fairly.
              </p>
            </div>
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-[#66BB6A] text-white items-center justify-center shrink-0">
              <Wheat className="w-8 h-8" />
            </div>
          </div>

          {submitted ? (
            /* Success State */
            <div className="p-8 sm:p-12 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto border-2 border-[#66BB6A]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-bold text-[#1B5E20]">
                Registration Received!
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Welcome to DRAVIX SCM, <strong>{formData.fullName}</strong>. Your profile has been captured in the local staging database.
              </p>
              <div className="p-4 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7] text-xs text-[#1B5E20] font-medium max-w-md mx-auto">
                Authentication credentials will be activated when the Authentication Module is deployed in Stage 3.
              </div>
              <div className="pt-4 flex justify-center gap-3">
                <Button variant="dark" onClick={() => navigate('/')}>
                  Return to Home
                </Button>
                <Button variant="outlineLight" onClick={() => { setSubmitted(false); setFormData({ fullName: '', email: '', phone: '', password: '', confirmPassword: '', address: '', district: '', state: '', pincode: '', farmSizeAcres: '', primaryCrop: '' }); }}>
                  Register Another
                </Button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Section 1: Basic Identity */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-gray-100 mb-4 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#66BB6A]" /> Personal & Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <FormInput
                      id="fullName"
                      label="Full Name"
                      placeholder="e.g. Ramesh Patel"
                      value={formData.fullName}
                      onChange={handleChange}
                      error={errors.fullName}
                      required
                    />
                  </div>
                  <FormInput
                    id="email"
                    type="email"
                    label="Email Address"
                    placeholder="ramesh@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />
                  <FormInput
                    id="phone"
                    type="tel"
                    label="Mobile Phone Number"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    required
                    helperText="10-digit mobile number"
                  />
                  <FormInput
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                    helperText="Minimum 8 characters"
                  />
                  <FormInput
                    id="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    required
                  />
                </div>
              </div>

              {/* Section 2: Farm & Agricultural Details */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-gray-100 mb-4 flex items-center gap-1.5">
                  <Wheat className="w-4 h-4 text-[#66BB6A]" /> Farm & Crop Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    id="primaryCrop"
                    label="Primary Agricultural Produce"
                    placeholder="e.g. Wheat, Basmati Rice, Maize, Soybeans"
                    value={formData.primaryCrop}
                    onChange={handleChange}
                    helperText="Primary crop you plan to store"
                  />
                  <FormInput
                    id="farmSizeAcres"
                    type="number"
                    label="Landholding Size (Acres)"
                    placeholder="e.g. 15"
                    value={formData.farmSizeAcres}
                    onChange={handleChange}
                    helperText="Approximate acreage"
                  />
                </div>
              </div>

              {/* Section 3: Farm Location */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-gray-100 mb-4">
                  Farm / Residence Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-3">
                    <FormInput
                      id="address"
                      label="Street Address / Village / Tehsil"
                      placeholder="Village Name, Post Office, Tehsil"
                      value={formData.address}
                      onChange={handleChange}
                      error={errors.address}
                      required
                    />
                  </div>
                  <FormInput
                    id="district"
                    label="District"
                    placeholder="e.g. Nashik"
                    value={formData.district}
                    onChange={handleChange}
                    error={errors.district}
                    required
                  />
                  <FormInput
                    id="state"
                    label="State"
                    placeholder="e.g. Maharashtra"
                    value={formData.state}
                    onChange={handleChange}
                    error={errors.state}
                    required
                  />
                  <FormInput
                    id="pincode"
                    label="Postal Pincode"
                    placeholder="422001"
                    value={formData.pincode}
                    onChange={handleChange}
                    error={errors.pincode}
                    required
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-gray-500">
                  By registering, you agree to DRAVIX SCM platform guidelines.
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/register')}
                    className="w-1/2 sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="dark"
                    loading={loading}
                    className="w-1/2 sm:w-auto px-7"
                  >
                    Complete Registration
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FarmerRegistration;
