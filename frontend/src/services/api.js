import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor to inject JWT Bearer token into outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dravix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Warehouse API calls
export const getWarehouses = async (filters = {}) => {
  const params = {};
  if (filters.district && filters.district !== 'All') {
    params.district = filters.district.trim();
  }
  if (filters.warehouseType && filters.warehouseType !== 'All') {
    params.warehouseType = filters.warehouseType.trim();
  }
  if (filters.ownershipType && filters.ownershipType !== 'All') {
    params.ownershipType = filters.ownershipType.trim();
  }
  const response = await api.get('/warehouses', { params });
  return response.data;
};

export const getWarehouseById = async (id) => {
  const response = await api.get(`/warehouses/${id}`);
  return response.data;
};

// Auth API calls
export const sendOtp = async (email) => {
  const response = await api.post('/auth/send-otp', { email });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await api.post('/auth/verify-otp', { email, otp });
  return response.data;
};

export const registerFarmerOrFpo = async (farmerData) => {
  const response = await api.post('/auth/register/farmer', farmerData);
  return response.data;
};

export const registerWarehouse = async (warehouseData) => {
  const response = await api.post('/auth/register/warehouse', warehouseData);
  return response.data;
};

export const getWarehouseRecommendations = async (data) => {
  const response = await api.post('/warehouses/recommendations', data);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Verification & Document API calls
export const getVerificationStatus = async () => {
  const response = await api.get('/verification/status');
  return response.data;
};

export const uploadVerificationDocument = async (documentType, file) => {
  const formData = new FormData();
  formData.append('documentType', documentType);
  formData.append('file', file);
  const response = await api.post('/verification/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Product Access Gate Check (verifies HTTP 403 on unverified accounts)
export const checkProductAccessGate = async () => {
  const response = await api.post('/products/gate-check');
  return response.data;
};

// Admin Mock Approval helper
export const adminReviewStatus = async (userId, status, rejectionReason) => {
  const params = new URLSearchParams({ userId, status });
  if (rejectionReason) params.append('rejectionReason', rejectionReason);
  const response = await api.post(`/verification/admin/review?${params.toString()}`);
  return response.data;
};

// Farmer Module API calls
export const addFarmerProduct = async (productData) => {
  const response = await api.post('/farmer/products', productData);
  return response.data;
};

export const getFarmerProducts = async () => {
  const response = await api.get('/farmer/products');
  return response.data;
};

export const getFarmerStats = async () => {
  const response = await api.get('/farmer/stats');
  return response.data;
};

export const submitInsuranceClaim = async (claimData) => {
  const response = await api.post('/farmer/insurance-claims', claimData);
  return response.data;
};

export const getFarmerClaims = async () => {
  const response = await api.get('/farmer/insurance-claims');
  return response.data;
};

export default api;
