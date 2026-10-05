import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Plus,
  ArrowLeft,
  Warehouse,
  MapPin,
  Tag,
  Search,
  Filter,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { getFarmerProducts } from '../services/api';

const MyProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await getFarmerProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load farmer products', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.productName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.warehouseName?.toLowerCase().includes(searchFilter.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate('/farmer/dashboard')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B5E20] hover:underline mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Farmer Dashboard
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B5E20]">
              My Products Catalog
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Active agricultural commodities deposited and stored in verified warehouses.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => navigate('/farmer/add-product')}
          >
            Add New Product
          </Button>
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-[#A5D6A7] shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search product or warehouse..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#A5D6A7] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] bg-white text-gray-800"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-[#A5D6A7] bg-white text-gray-800"
            >
              <option value="ALL">All Categories</option>
              <option value="GRAINS">Grains & Cereals</option>
              <option value="PULSES">Pulses & Legumes</option>
              <option value="OILSEEDS">Oilseeds</option>
              <option value="VEGETABLES">Vegetables</option>
              <option value="FRUITS">Fruits</option>
              <option value="SPICES">Spices</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-[#1B5E20] font-semibold">
            Loading products catalog...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-dashed border-[#A5D6A7] p-8">
            <div className="w-14 h-14 rounded-full bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#1B5E20]">No Products Found</h3>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              {searchFilter
                ? 'No commodities matched your search criteria.'
                : 'You have not added any commodities to your catalog yet.'}
            </p>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => navigate('/farmer/add-product')}
            >
              Add Product
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-[#A5D6A7] shadow-sm hover:shadow-md transition-all p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#1B5E20]">
                      {p.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        p.status === 'APPROVED' || p.status === 'STORED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">{p.productName}</h3>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Batch ID: #{p.id} • Listed{' '}
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recently'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#E8F5E9]/50 border border-[#A5D6A7]/60 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Total Volume</span>
                      <strong className="text-gray-900">{p.quantityKg?.toLocaleString()} kg</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Selling Price</span>
                      <strong className="text-[#1B5E20]">₹{p.sellingPrice} / kg</strong>
                    </div>
                  </div>

                  {/* Warehouse Assignment */}
                  <div className="p-3 rounded-2xl border border-gray-100 bg-gray-50 text-xs space-y-1">
                    <div className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                      <Warehouse className="w-3 h-3" /> Designated Warehouse
                    </div>
                    <div className="font-semibold text-gray-800 truncate">
                      {p.warehouseName || 'Direct Farm Gate'}
                    </div>
                    {p.warehouseDistanceKm && (
                      <div className="text-[11px] text-gray-500">
                        {p.warehouseDistanceKm} km from registered farm pin
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-gray-100 text-xs text-gray-500">
                  <span>Valuation: ₹{((p.quantityKg || 0) * (p.sellingPrice || 0)).toLocaleString()}</span>
                  <Link
                    to="/market-forecast"
                    className="text-[#1B5E20] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    View Forecast →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyProductsPage;
