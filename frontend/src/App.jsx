import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AgriculturalIdentitySelect from './pages/AgriculturalIdentitySelect';
import FarmerForm from './pages/FarmerForm';
import FpoMemberForm from './pages/FpoMemberForm';
import WarehouseRegistration from './pages/WarehouseRegistration';
import LogisticsRegistration from './pages/LogisticsRegistration';
import CustomerRegistration from './pages/CustomerRegistration';
import VerificationStatusPage from './pages/VerificationStatusPage';
import MarketForecastPage from './pages/MarketForecastPage';
import DemandForecastPage from './pages/DemandForecastPage';
import RolePlaceholderDashboard from './pages/RolePlaceholderDashboard';
import WarehouseListingPage from './pages/WarehouseListingPage';
import WarehouseDetailsPage from './pages/WarehouseDetailsPage';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerAddProductPage from './pages/FarmerAddProductPage';
import MyProductsPage from './pages/MyProductsPage';
import FarmerInsurancePage from './pages/FarmerInsurancePage';
import SetupScreen from './pages/SetupScreen';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Warehouses Discovery */}
          <Route path="/warehouses" element={<WarehouseListingPage />} />
          <Route path="/warehouses/:id" element={<WarehouseDetailsPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />

          {/* Role Selection */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Farmer & FPO Member Flow */}
          <Route path="/register/farmer" element={<AgriculturalIdentitySelect />} />
          <Route path="/register/farmer-form" element={<FarmerForm />} />
          <Route path="/register/fpo-member-form" element={<FpoMemberForm />} />

          {/* Other Roles */}
          <Route path="/register/warehouse" element={<WarehouseRegistration />} />
          <Route path="/register/logistics" element={<LogisticsRegistration />} />
          <Route path="/register/customer" element={<CustomerRegistration />} />

          {/* Verification & Access Gating */}
          <Route path="/verification" element={<VerificationStatusPage />} />
          <Route path="/market-forecast" element={<MarketForecastPage />} />
          <Route path="/demand-forecast" element={<DemandForecastPage />} />

          {/* Farmer Workspace Routes */}
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/add-product" element={<FarmerAddProductPage />} />
          <Route path="/farmer/my-products" element={<MyProductsPage />} />
          <Route path="/farmer/insurance" element={<FarmerInsurancePage />} />

          {/* Role Dashboards */}
          <Route path="/dashboard/farmer" element={<FarmerDashboard />} />
          <Route path="/dashboard/fpo_member" element={<FarmerDashboard />} />
          <Route path="/dashboard/:role" element={<RolePlaceholderDashboard />} />

          {/* Diagnostics / Setup */}
          <Route path="/setup" element={<SetupScreen />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
