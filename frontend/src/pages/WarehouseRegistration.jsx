import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Warehouse, ArrowLeft, CheckCircle2, ShieldCheck, Building2, Check } from 'lucide-react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WarehouseRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    warehouseName: '',
    organizationName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    district: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    storageCapacityMt: '',
    supportedCategories: ['Grains & Cereals'],
    isWdraRegistered: false,
    wdraRegNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const availableCategories = [
    'Grains & Cereals',
    'Pulses & Legumes',
    'Oilseeds',
    'Cold Storage / Perishables',
    'Spices',
    'Cotton & Fibers',
  ];

  const handleCategoryToggle = (category) => {
    setFormData((prev) => {
      const exists = prev.supportedCategories.includes(category);
      if (exists) {
        return { ...prev, supportedCategories: prev.supportedCategories.filter((c) => c !== category) };
      } else {
        return { ...prev, supportedCategories: [...prev.supportedCategories, category] };
      }
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.warehouseName.trim()) newErrors.warehouseName = 'Warehouse name is required';
    if (!formData.organizationName.trim()) newErrors.organizationName = 'Operating organization name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.address.trim()) newErrors.address = 'Warehouse physical address is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Enter a valid 6-digit postal code';
    }

    if (!formData.storageCapacityMt || Number(formData.storageCapacityMt) <= 0) {
      newErrors.storageCapacityMt = 'Valid storage capacity (in Metric Tonnes) is required';
    }

    if (formData.supportedCategories.length === 0) {
      newErrors.supportedCategories = 'Select at least one supported agricultural category';
    }

    if (formData.isWdraRegistered && !formData.wdraRegNumber.trim()) {
      newErrors.wdraRegNumber = 'WDRA Registration Number is required when WDRA flag is checked';
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
                <Warehouse className="w-3.5 h-3.5" /> Storage Facility
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Warehouse Manager Registration
              </h1>
              <p className="text-xs sm:text-sm text-[#A5D6A7] mt-1">
                Register storage capacity, chamber specifications, and WDRA compliance details.
              </p>
            </div>
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-[#66BB6A] text-white items-center justify-center shrink-0">
              <Warehouse className="w-8 h-8" />
            </div>
          </div>

          {submitted ? (
            <div className="p-8 sm:p-12 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto border-2 border-[#66BB6A]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-bold text-[#1B5E20]">
                Warehouse Registered Successfully!
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Facility <strong>{formData.warehouseName}</strong> has been configured with {formData.storageCapacityMt} MT capacity in the local staging registry.
              </p>
              <div className="p-4 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7] text-xs text-[#1B5E20] font-medium max-w-md mx-auto">
                Status: {formData.isWdraRegistered ? 'WDRA Verification Pending (e-NWR candidate)' : 'Standard Agro-Storage Facility'}. Full credentials hook up in Stage 3.
              </div>
              <div className="pt-4 flex justify-center gap-3">
                <Button variant="dark" onClick={() => navigate('/')}>
                  Return to Home
                </Button>
                <Button variant="outlineLight" onClick={() => { setSubmitted(false); }}>
                  Register Another Facility
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Facility Identity */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-gray-100 mb-4 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#66BB6A]" /> Facility Identity & Management
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    id="warehouseName"
                    label="Warehouse / Godown Name"
                    placeholder="e.g. Kisan Cold Storage & Dry Godown"
                    value={formData.warehouseName}
                    onChange={handleChange}
                    error={errors.warehouseName}
                    required
                  />
                  <FormInput
                    id="organizationName"
                    label="Operating Organization / Legal Entity"
                    placeholder="e.g. Agrilogix Warehousing Pvt Ltd"
                    value={formData.organizationName}
                    onChange={handleChange}
                    error={errors.organizationName}
                    required
                  />
                  <FormInput
                    id="email"
                    type="email"
                    label="Business Email"
                    placeholder="manager@warehouse.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />
                  <FormInput
                    id="phone"
                    type="tel"
                    label="Contact Phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    required
                  />
                  <FormInput
                    id="password"
                    type="password"
                    label="Access Password"
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

              {/* Physical Location */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-gray-100 mb-4">
                  Physical Location Coordinates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-3">
                    <FormInput
                      id="address"
                      label="Facility Address"
                      placeholder="Plot No., Industrial / Agro-Park, Village Road"
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
                  <FormInput
                    id="latitude"
                    type="number"
                    step="any"
                    label="Latitude (Optional)"
                    placeholder="e.g. 19.9975"
                    value={formData.latitude}
                    onChange={handleChange}
                    helperText="For radius distance calculation"
                  />
                  <FormInput
                    id="longitude"
                    type="number"
                    step="any"
                    label="Longitude (Optional)"
                    placeholder="e.g. 73.7898"
                    value={formData.longitude}
                    onChange={handleChange}
                    helperText="Geospatial coordinates"
                  />
                </div>
              </div>

              {/* Capacity & Compatibility */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20] pb-2 border-b border-gray-100 mb-4">
                  Storage Specifications & Commodity Scope
                </h3>
                <div className="space-y-4">
                  <div className="sm:w-1/2">
                    <FormInput
                      id="storageCapacityMt"
                      type="number"
                      label="Total Storage Capacity (Metric Tonnes)"
                      placeholder="e.g. 5000"
                      value={formData.storageCapacityMt}
                      onChange={handleChange}
                      error={errors.storageCapacityMt}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B5E20] mb-2 uppercase tracking-wider">
                      Supported Commodity Categories <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {availableCategories.map((cat) => {
                        const checked = formData.supportedCategories.includes(cat);
                        return (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => handleCategoryToggle(cat)}
                            className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between text-left transition-all ${
                              checked
                                ? 'bg-[#E8F5E9] border-[#1B5E20] text-[#1B5E20] font-bold shadow-xs'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-[#66BB6A]'
                            }`}
                          >
                            <span>{cat}</span>
                            {checked && <Check className="w-3.5 h-3.5 text-[#1B5E20]" />}
                          </button>
                        );
                      })}
                    </div>
                    {errors.supportedCategories && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{errors.supportedCategories}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Regulatory & WDRA / e-NWR Eligibility Section */}
              <div className="bg-[#E8F5E9]/50 rounded-2xl p-5 border border-[#A5D6A7] space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    id="isWdraRegistered"
                    name="isWdraRegistered"
                    type="checkbox"
                    checked={formData.isWdraRegistered}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded text-[#1B5E20] focus:ring-[#66BB6A] border-[#A5D6A7]"
                  />
                  <div>
                    <label htmlFor="isWdraRegistered" className="text-sm font-bold text-[#1B5E20] cursor-pointer">
                      WDRA Registered Facility (e-NWR Eligible)
                    </label>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Check if your facility is accredited under the Warehousing Development and Regulatory Authority (WDRA). Note: Non-registered facilities operate as standard collection points and do NOT automatically issue e-NWRs.
                    </p>
                  </div>
                </div>

                {formData.isWdraRegistered && (
                  <div className="pt-2">
                    <FormInput
                      id="wdraRegNumber"
                      label="WDRA Registration Certificate Number"
                      placeholder="e.g. WDRA/REG/2026/8941"
                      value={formData.wdraRegNumber}
                      onChange={handleChange}
                      error={errors.wdraRegNumber}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-gray-500">
                  Verification status will be confirmed after review.
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
                    Register Facility
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

export default WarehouseRegistration;
