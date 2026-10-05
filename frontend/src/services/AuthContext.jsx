import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dravix_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('dravix_user');
    const storedToken = localStorage.getItem('dravix_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        localStorage.removeItem('dravix_user');
        localStorage.removeItem('dravix_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (authData) => {
    const userData = {
      id: authData.id,
      name: authData.name,
      email: authData.email,
      phone: authData.phone,
      role: authData.role,
      verificationStatus: authData.verificationStatus,
      emailVerified: authData.emailVerified,
    };
    setUser(userData);
    setToken(authData.token);
    localStorage.setItem('dravix_user', JSON.stringify(userData));
    localStorage.setItem('dravix_token', authData.token);
  };

  const updateUserVerification = (newStatus) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, verificationStatus: newStatus };
      localStorage.setItem('dravix_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dravix_user');
    localStorage.removeItem('dravix_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUserVerification, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
