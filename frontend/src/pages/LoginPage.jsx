import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sprout, AlertCircle, ShieldCheck } from 'lucide-react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { loginUser } from '../services/api';
import { useAuth } from '../services/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      login(response);

      // Route the user according to their role
      const role = response.role;
      if (role === 'FARMER' || role === 'FPO_MEMBER') {
        navigate('/farmer/dashboard');
      } else if (role === 'WAREHOUSE' || role === 'WAREHOUSE_MANAGER') {
        localStorage.setItem('username', response.email);
        localStorage.setItem('role', role);
        localStorage.setItem('warehouseId', '1');
        navigate('/warehouse');
      } else if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard/' + role.toLowerCase());
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#A5D6A7] shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#1B5E20] text-white p-7 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#66BB6A] text-white flex items-center justify-center mx-auto mb-3 shadow">
              <Sprout className="w-7 h-7 text-[#E8F5E9]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Sign In to DRAVIX</h1>
            <p className="text-xs text-[#A5D6A7] mt-1">
              Agricultural Supply Chain Management Platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-7 space-y-5">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <FormInput
              id="loginEmail"
              type="email"
              label="Email Address"
              placeholder="e.g. farmer@dravix.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FormInput
              id="loginPassword"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Secure Token Authentication</span>
              <button
                type="button"
                onClick={() => alert('Forgot password self-service will be configured in future security enhancements.')}
                className="text-[#1B5E20] font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="dark"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              className="w-full justify-center text-sm"
            >
              Sign In to DRAVIX
            </Button>

            {/* Quick Demo Credentials helper */}
            <div className="p-3.5 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7] text-xs text-gray-700 space-y-2">
              <span className="font-bold text-[#1B5E20] block">
                Quick Demo Accounts (Click to Fill):
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@dravix.com');
                    setPassword('admin123');
                  }}
                  className="px-2.5 py-1.5 rounded-md bg-[#1B5E20] text-white text-[11px] font-bold hover:bg-[#144618] transition-colors shadow-xs"
                >
                  Admin (admin@dravix.com / admin123)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('24ada12@karpagamtech.ac.in');
                    setPassword('password123');
                  }}
                  className="px-2.5 py-1.5 rounded-md bg-[#2e7d32] text-white text-[11px] font-bold hover:bg-[#1b5e20] transition-colors shadow-xs"
                >
                  Warehouse (24ada12@karpagamtech.ac.in / password123)
                </button>
              </div>
              <p className="text-[11px] text-gray-500">
                Admin has verified this warehouse. Click either account above to immediately test and access the portals.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 text-center text-xs text-gray-600">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-[#1B5E20] hover:underline">
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
