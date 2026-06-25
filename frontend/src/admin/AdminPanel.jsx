import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { LogOut, Package, TrendingUp, Inbox, Star, Settings, Menu, X } from 'lucide-react';
import ProductsTab from './tabs/ProductsTab';
import RatesTab from './tabs/RatesTab';
import InquiriesTab from './tabs/InquiriesTab';
import ReviewsTab from './tabs/ReviewsTab';
import SettingsTab from './tabs/SettingsTab';

const TABS = [
  { id: 'products',   label: 'Products',   icon: Package },
  { id: 'rates',      label: 'Rates',      icon: TrendingUp },
  { id: 'inquiries',  label: 'Inquiries',  icon: Inbox },
  { id: 'reviews',    label: 'Reviews',    icon: Star },
  { id: 'settings',   label: 'Settings',   icon: Settings },
];

const AdminPanel = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Listen for changes to localStorage (like when we remove the token on 401 errors)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('adminToken') || '');
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically (just in case)
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('adminToken');
      if (currentToken !== token) {
        setToken(currentToken || '');
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const response = await api.login(username, password);
      if (response.token) {
        localStorage.setItem('adminToken', response.token);
        setToken(response.token);
        setUsername('');
        setPassword('');
      } else {
        setLoginError(response.error || 'Login failed');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // ── Login Screen ──────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            {/* Logo Container */}
            <div className="inline-block bg-white rounded-xl p-3 shadow-lg mb-3">
              <img
                src="/godawari_logo.png"
                alt="Godawari Fish & Company"
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-1">Godawari Fish & Company</p>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition disabled:opacity-50 text-sm"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────
  const ActiveIcon = TABS.find((t) => t.id === activeTab)?.icon || Package;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="sm:hidden p-1.5 rounded-lg hover:bg-white/10 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-lg p-1.5 shadow-md">
                <img src="/godawari_logo.png" alt="" className="h-6 w-auto" />
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight">Godawari Fish & Company</h1>
                <p className="text-blue-200 text-xs hidden sm:block">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Desktop tab nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === id ? 'bg-white text-blue-700' : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition text-sm font-semibold"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Mobile dropdown nav */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-blue-600 bg-blue-800">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold transition ${
                  activeTab === id ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
        <div className="sm:hidden flex items-center gap-2 text-gray-500 text-sm mb-4">
          <ActiveIcon size={16} />
          <span className="font-semibold text-gray-700 capitalize">{activeTab}</span>
        </div>

        {activeTab === 'products'  && <ProductsTab  token={token} />}
        {activeTab === 'rates'     && <RatesTab     token={token} />}
        {activeTab === 'inquiries' && <InquiriesTab token={token} />}
        {activeTab === 'reviews'   && <ReviewsTab   token={token} />}
        {activeTab === 'settings'  && <SettingsTab  token={token} />}
      </main>
    </div>
  );
};

export default AdminPanel;
