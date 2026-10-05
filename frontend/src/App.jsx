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
import MarketPriceExplorerPage from './pages/MarketPriceExplorerPage';
import DemandForecastPage from './pages/DemandForecastPage';
import RolePlaceholderDashboard from './pages/RolePlaceholderDashboard';
import WarehouseListingPage from './pages/WarehouseListingPage';
import WarehouseDetailsPage from './pages/WarehouseDetailsPage';
import WarehouseDashboard from './pages/warehouse/WarehouseDashboard';
import Inventory from './pages/warehouse/Inventory';
import StockManagement from './pages/warehouse/StockManagement';
import WarehouseClaims from './pages/warehouse/WarehouseClaims';
import PendingProducts from './pages/warehouse/PendingProducts';
import WarehouseDispatch from './pages/warehouse/WarehouseDispatch';
import WarehouseRevenue from './pages/warehouse/WarehouseRevenue';
import WarehousePartnerships from './pages/warehouse/WarehousePartnerships';
import ManagerDashboard from './pages/warehouse/ManagerDashboard';
import ManagerLogin from './pages/warehouse/ManagerLogin';
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

          {/* Warehouse Manager Portal & Modules */}
          <Route path="/warehouse" element={<WarehouseDashboard />} />
          <Route path="/warehouse/manager-login" element={<ManagerLogin />} />
          <Route path="/warehouse/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/warehouse/inventory" element={<Inventory />} />
          <Route path="/warehouse/stock" element={<StockManagement />} />
          <Route path="/warehouse/claims" element={<WarehouseClaims />} />
          <Route path="/warehouse/pending-products" element={<PendingProducts />} />
          <Route path="/warehouse/dispatch" element={<WarehouseDispatch />} />
          <Route path="/warehouse/revenue" element={<WarehouseRevenue />} />
          <Route path="/warehouse/partnerships" element={<WarehousePartnerships />} />

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
          <Route path="/market-price-explorer" element={<MarketPriceExplorerPage />} />
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
