import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LogisticsRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    district: '',
    state: '',
    pincode: '',
    fleetSize: '',
    operatingStates: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) newErrors.companyName = 'Logistics / Fleet Company Name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Primary contact person is required';

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

    if (!formData.address.trim()) newErrors.address = 'Office / Hub address is required';
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
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
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
                <Truck className="w-3.5 h-3.5" /> Fleet & Logistics
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Logistics Provider Registration
              </h1>
              <p className="text-xs sm:text-sm text-[#A5D6A7] mt-1">
                Register freight transport services, dispatch fleets, and connect agricultural haul routes.
              </p>
            </div>
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-[#66BB6A] text-white items-center justify-center shrink-0">
              <Truck className="w-8 h-8" />
            </div>
          </div>

          {submitted ? (
            <div className="p-8 sm:p-12 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto border-2 border-[#66BB6A]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-bold text-[#1B5E20]">
                Logistics Partner Registered!
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Welcome <strong>{formData.companyName}</strong>. Your transport provider profile has been initialized.
              </p>
              <div className="p-4 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7] text-xs text-[#1B5E20] font-medium max-w-md mx-auto">
                Fleet management and route assignments will become available upon authentication in Stage 3.
              </div>
              <div className="pt-4 flex justify-center gap-3">
                <Button variant="dark" onClick={() => navigate('/')}>
                  Return to Home
                </Button>
                <Button variant="outlineLight" onClick={() => { setSubmitted(false); }}>
                  Register Another Fleet
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Business Identity */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-gray-100 mb-4 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#66BB6A]" /> Enterprise & Contact Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    id="companyName"
                    label="Logistics / Carrier Company Name"
                    placeholder="e.g. Kisan Kisan Express Logistics"
                    value={formData.companyName}
                    onChange={handleChange}
                    error={errors.companyName}
                    required
                  />
                  <FormInput
                    id="contactPerson"
                    label="Primary Contact Person"
                    placeholder="e.g. Vikram Sharma"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    error={errors.contactPerson}
                    required
                  />
                  <FormInput
                    id="email"
                    type="email"
                    label="Corporate Email"
                    placeholder="dispatch@kisanexpress.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />
                  <FormInput
                    id="phone"
                    type="tel"
                    label="Dispatch Mobile / Phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    required
                  />
                  <FormInput
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="Create a password"
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

              {/* Fleet Operations Overview */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-gray-100 mb-4 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#66BB6A]" /> Freight & Operational Scope
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    id="fleetSize"
                    type="number"
                    label="Active Vehicle Fleet Count"
                    placeholder="e.g. 12"
                    value={formData.fleetSize}
                    onChange={handleChange}
                    helperText="Number of trucks / carriers"
                  />
                  <FormInput
                    id="operatingStates"
                    label="Primary Operating Regions / Corridors"
                    placeholder="e.g. Maharashtra, Gujarat, Madhya Pradesh"
                    value={formData.operatingStates}
                    onChange={handleChange}
                    helperText="States where routes run"
                  />
                </div>
              </div>

              {/* Headquarter / Hub Address */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-gray-100 mb-4">
                  Hub / Dispatch Headquarter Location
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-3">
                    <FormInput
                      id="address"
                      label="HQ Address"
                      placeholder="Hub Address / Transport Nagar"
                      value={formData.address}
                      onChange={handleChange}
                      error={errors.address}
                      required
                    />
                  </div>
                  <FormInput
                    id="district"
                    label="District / City"
                    placeholder="e.g. Pune"
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
                    placeholder="411001"
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
                  Fleet dispatching workflows will link to this corporate account.
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
                    Register Logistics
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

export default LogisticsRegistration;
