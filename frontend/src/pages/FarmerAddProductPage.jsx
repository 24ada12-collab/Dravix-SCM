import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ArrowLeft,
  ArrowRight,
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  DollarSign,
  Scale,
  Sparkles,
  Info,
  MapPin,
  Building2,
  ShieldCheck,
  Check,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { useAuth } from '../services/AuthContext';
import {
  getWarehouseRecommendations,
  addFarmerProduct,
  getVerificationStatus,
} from '../services/api';

const CATEGORIES = [
  { value: 'GRAINS', label: 'Grains & Cereals (Wheat, Rice, Maize)' },
  { value: 'PULSES', label: 'Pulses & Legumes (Chana, Toor, Moong)' },
  { value: 'OILSEEDS', label: 'Oilseeds (Mustard, Groundnut, Soybean)' },
  { value: 'VEGETABLES', label: 'Vegetables (Onion, Potato, Tomato)' },
  { value: 'FRUITS', label: 'Fruits & Perishables (Mango, Banana, Citrus)' },
  { value: 'SPICES', label: 'Spices & Plantation (Turmeric, Chilli, Pepper)' },
];

const FarmerAddProductPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form Fields
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('PULSES');
  const [quantityKg, setQuantityKg] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [pricingStrategy, setPricingStrategy] = useState('PROFIT_PER_KG');
  const [marginValue, setMarginValue] = useState('5');
  const [remarks, setRemarks] = useState('');

  // Farmer Location Source
  const [farmerLocation, setFarmerLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Recommendation State
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsSearched, setRecommendationsSearched] = useState(false);
  const [findingWarehouses, setFindingWarehouses] = useState(false);
  const [recommendationError, setRecommendationError] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load registered coordinates
  useEffect(() => {
    const fetchLocation = async () => {
      setLoadingLocation(true);
      try {
        // Fallback default coordinates if not saved in local user profile (Erode/Nashik agromarket)
        let lat = 11.341;
        let lng = 77.7172;
        const storedLoc = localStorage.getItem('dravix_farmer_location');
        if (storedLoc) {
          const parsed = JSON.parse(storedLoc);
          lat = parsed.latitude || lat;
          lng = parsed.longitude || lng;
        }
        setFarmerLocation({ latitude: lat, longitude: lng });
      } catch (e) {
        setFarmerLocation({ latitude: 11.341, longitude: 77.7172 });
      } finally {
        setLoadingLocation(false);
      }
    };
    fetchLocation();
  }, []);

  // Compute calculated selling price
  const basePrice = parseFloat(purchasePrice) || 0;
  const margin = parseFloat(marginValue) || 0;
  let computedSellingPrice = basePrice;
  if (pricingStrategy === 'PROFIT_PERCENTAGE') {
    computedSellingPrice = basePrice + basePrice * (margin / 100);
  } else {
    computedSellingPrice = basePrice + margin;
  }
  computedSellingPrice = Math.round(computedSellingPrice * 100) / 100;

  // Request Recommendations
  const handleFindWarehouses = async () => {
    if (!farmerLocation?.latitude || !farmerLocation?.longitude) {
      setRecommendationError(
        'Your location is not available. Please complete your location details before adding a product.'
      );
      return;
    }
    const qty = parseFloat(quantityKg);
    if (!qty || qty <= 0) {
      setRecommendationError('Quantity must be greater than 0 kg.');
      return;
    }
    if (!category) {
      setRecommendationError('Please select a product category.');
      return;
    }

    setRecommendationError(null);
    setFindingWarehouses(true);
    setRecommendationsSearched(true);
    setSelectedWarehouse(null);

    try {
      const payload = {
        latitude: farmerLocation.latitude,
        longitude: farmerLocation.longitude,
        productCategory: category,
        quantityKg: qty,
      };
      const res = await getWarehouseRecommendations(payload);
      setRecommendations(Array.isArray(res) ? res : []);
    } catch (err) {
      setRecommendationError(
        err.response?.data?.message || 'Unable to find suitable warehouses. Please try again.'
      );
      setRecommendations([]);
    } finally {
      setFindingWarehouses(false);
    }
  };

  // Submit Product Form
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!productName.trim()) {
      setSubmitError('Please enter a product name.');
      return;
    }
    const qty = parseFloat(quantityKg);
    if (!qty || qty <= 0) {
      setSubmitError('Please enter a valid quantity greater than 0 kg.');
      return;
    }
    const price = parseFloat(purchasePrice);
    if (!price || price <= 0) {
      setSubmitError('Please enter a valid purchase price per kg.');
      return;
    }

    setSubmitError(null);
    setSubmitting(true);

    try {
      const payload = {
        productName: productName.trim(),
        category,
        quantityKg: qty,
        purchasePrice: price,
        pricingStrategy,
        marginValue: margin,
        warehouseId: selectedWarehouse ? selectedWarehouse.warehouseId : null,
        warehouseName: selectedWarehouse ? selectedWarehouse.warehouseName : null,
        warehouseDistanceKm: selectedWarehouse ? selectedWarehouse.distanceKm : null,
        remarks: remarks.trim(),
      };

      await addFarmerProduct(payload);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || 'Failed to submit product. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/farmer/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B5E20] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>

        {submitSuccess ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#A5D6A7] shadow-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto border-2 border-[#66BB6A]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-bold text-[#1B5E20]">
              Product Listed Successfully!
            </h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Your agricultural harvest <strong>{productName}</strong> ({quantityKg} kg) has been
              registered
              {selectedWarehouse ? (
                <> and assigned to warehouse <strong>{selectedWarehouse.warehouseName}</strong>.</>
              ) : (
                ' for storage allocation.'
              )}
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Button
                variant="dark"
                onClick={() => navigate('/farmer/my-products')}
              >
                View My Products Catalog
              </Button>
              <Button
                variant="outlineLight"
                onClick={() => {
                  setSubmitSuccess(false);
                  setProductName('');
                  setQuantityKg('');
                  setPurchasePrice('');
                  setSelectedWarehouse(null);
                  setRecommendations([]);
                  setRecommendationsSearched(false);
                }}
              >
                Add Another Product
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitProduct} className="space-y-6">
            {/* Card 1: Product Specifications */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#A5D6A7] shadow-md space-y-6">
              <div className="border-b border-[#E8F5E9] pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold uppercase tracking-wider mb-2">
                  <Package className="w-3.5 h-3.5" /> Product Intake Flow
                </div>
                <h1 className="text-2xl font-black text-[#1B5E20]">
                  Add Agricultural Product
                </h1>
                <p className="text-xs text-gray-600">
                  Enter commodity harvest details and find nearest certified warehouses.
                </p>
              </div>

              {submitError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  id="productName"
                  label="Product / Crop Name"
                  placeholder="e.g. Organic Red Toor Dal / Sona Masoori Rice"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-xs font-semibold text-[#1B5E20] mb-1.5 uppercase tracking-wider">
                    Commodity Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setRecommendations([]);
                      setRecommendationsSearched(false);
                      setSelectedWarehouse(null);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white border border-[#A5D6A7] focus:border-[#1B5E20] focus:ring-2 focus:ring-[#E8F5E9] focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <FormInput
                  id="quantityKg"
                  label="Harvest Quantity (in KG)"
                  type="number"
                  placeholder="e.g. 5000"
                  value={quantityKg}
                  onChange={(e) => {
                    setQuantityKg(e.target.value);
                    setRecommendations([]);
                    setRecommendationsSearched(false);
                    setSelectedWarehouse(null);
                  }}
                  helper="Enter the actual storage volume in kilograms"
                  required
                />

                <FormInput
                  id="purchasePrice"
                  label="Farmer Base Cost (₹ per KG)"
                  type="number"
                  placeholder="e.g. 60"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  helper="Base production cost or target procurement price"
                  required
                />
              </div>

              {/* Pricing & Profit Strategy */}
              <div className="p-4 rounded-2xl bg-[#E8F5E9]/50 border border-[#A5D6A7] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" /> Pricing & Market Margin
                  </span>
                  <span className="text-xs font-black text-[#1B5E20]">
                    Calculated Selling Price: ₹{computedSellingPrice} / kg
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Strategy
                    </label>
                    <select
                      value={pricingStrategy}
                      onChange={(e) => setPricingStrategy(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#A5D6A7] bg-white"
                    >
                      <option value="PROFIT_PER_KG">Fixed Margin (₹ per kg)</option>
                      <option value="PROFIT_PERCENTAGE">Percentage Margin (% profit)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Margin Value ({pricingStrategy === 'PROFIT_PERCENTAGE' ? '%' : '₹'})
                    </label>
                    <input
                      type="number"
                      value={marginValue}
                      onChange={(e) => setMarginValue(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#A5D6A7] bg-white"
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Warehouse Recommendation Engine */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#A5D6A7] shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8F5E9] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1B5E20]">
                    Nearby Suitable Warehouses
                  </h3>
                  <p className="text-xs text-gray-600">
                    Based on your location, product category and required storage capacity.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Warehouse}
                  loading={findingWarehouses}
                  disabled={findingWarehouses || !quantityKg || Number(quantityKg) <= 0}
                  onClick={handleFindWarehouses}
                  type="button"
                >
                  {findingWarehouses ? 'Finding...' : 'Find Nearby Warehouses'}
                </Button>
              </div>

              {/* Recommendation Feedback states */}
              {findingWarehouses && (
                <div className="py-8 text-center space-y-2">
                  <Loader2 className="w-7 h-7 text-[#1B5E20] animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-[#1B5E20]">
                    Finding nearby suitable warehouses...
                  </p>
                </div>
              )}

              {recommendationError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span>{recommendationError}</span>
                  <Button
                    variant="outlineLight"
                    size="sm"
                    onClick={handleFindWarehouses}
                    type="button"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Selected Warehouse Summary Card */}
              {selectedWarehouse && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-[#66BB6A] space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#1B5E20] text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B5E20]">
                          Selected Warehouse
                        </span>
                        <h4 className="text-sm font-bold text-gray-900">
                          {selectedWarehouse.warehouseName}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedWarehouse(null)}
                      className="text-xs font-semibold text-[#1B5E20] hover:underline cursor-pointer"
                    >
                      Change Warehouse
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 text-gray-700">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Ownership</span>
                      <strong>{selectedWarehouse.ownershipType}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Distance</span>
                      <strong>{selectedWarehouse.distanceKm} km away</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Available Capacity</span>
                      <strong>
                        {selectedWarehouse.availableCapacityKg
                          ? `${selectedWarehouse.availableCapacityKg.toLocaleString()} kg`
                          : 'Live Checking'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Location</span>
                      <strong>{selectedWarehouse.district}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations List */}
              {recommendationsSearched && !findingWarehouses && !selectedWarehouse && (
                <div>
                  {recommendations.length === 0 ? (
                    <div className="py-8 text-center space-y-2 bg-[#E8F5E9]/30 rounded-2xl border border-dashed border-[#A5D6A7] p-6">
                      <Warehouse className="w-8 h-8 text-[#1B5E20] mx-auto opacity-60" />
                      <h4 className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider">
                        No suitable warehouse found
                      </h4>
                      <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                        No active warehouse with verified location, suitable storage capacity and
                        matching product category is currently available.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.map((rec) => (
                        <div
                          key={rec.warehouseId}
                          className="p-4 rounded-2xl border border-[#A5D6A7] bg-white hover:border-[#1B5E20] transition-all space-y-3 flex flex-col justify-between shadow-xs"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#1B5E20]">
                                {rec.ownershipType} • {rec.warehouseType}
                              </span>
                              <span className="text-xs font-bold text-[#1B5E20]">
                                {rec.distanceKm} km away
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-gray-900">
                              {rec.warehouseName}
                            </h4>

                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <MapPin className="w-3.5 h-3.5 text-[#66BB6A]" />
                              <span>{rec.location || rec.district}</span>
                            </div>

                            <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-gray-700 border-t border-gray-100">
                              <div>
                                <span className="text-gray-400 block">Total Capacity</span>
                                <strong>{rec.totalCapacityKg?.toLocaleString()} kg</strong>
                              </div>
                              <div>
                                <span className="text-gray-400 block">Available</span>
                                <strong className="text-[#1B5E20]">
                                  {rec.availableCapacityKg?.toLocaleString()} kg
                                </strong>
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="primary"
                            size="sm"
                            type="button"
                            className="w-full justify-center text-xs mt-2"
                            onClick={() => setSelectedWarehouse(rec)}
                          >
                            Select Warehouse
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Action Bar */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outlineLight"
                size="md"
                type="button"
                onClick={() => navigate('/farmer/dashboard')}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="md"
                icon={CheckCircle2}
                type="submit"
                loading={submitting}
                disabled={submitting}
              >
                Publish Product
              </Button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FarmerAddProductPage;
