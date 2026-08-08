import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { DEMO_ACCOUNTS } from '../constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aurum_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('aurum_token');
    if (token && !user) {
      authService.getMe()
        .then(res => {
          if (res?.user) setUser(res.user);
        })
        .catch(() => {
          localStorage.removeItem('aurum_token');
          localStorage.removeItem('aurum_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const res = await authService.login(email, password, rememberMe);
    if (res?.user) {
      setUser(res.user);
    }
    return res;
  };

  const loginAsDemo = async (roleName) => {
    const demo = DEMO_ACCOUNTS.find(d => d.role === roleName);
    if (demo) {
      return login(demo.email, demo.password);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const role = user?.role || 'guest';

  const value = {
    user,
    role,
    loading,
    login,
    loginAsDemo,
    logout,
    isAdmin: role === 'admin',
    isSalesManager: role === 'sales_manager',
    isMarketingManager: role === 'marketing_manager',
    isServiceAgent: role === 'service_agent',
    isCustomer: role === 'customer'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
