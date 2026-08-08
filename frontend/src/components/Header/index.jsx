import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, LogOut, ChevronDown, Sparkles, Shield, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationPanel } from '../NotificationPanel';
import { DEMO_ACCOUNTS } from '../../constants';
import { customerService } from '../../services/customerService';

export const Header = () => {
  const { user, logout, loginAsDemo } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      customerService.list({ search: searchQuery, limit: 5 })
        .then(res => {
          setSearchResults(res.data || []);
          setShowSearchResults(true);
        })
        .catch(() => {});
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const handleSelectCustomer = (id) => {
    setShowSearchResults(false);
    setSearchQuery('');
    navigate(`/customers/${id}`);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-aurum-200 shadow-sm px-6 py-3 flex items-center justify-between gap-4">
      {/* Global Search Bar (Section 40) */}
      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-charcoal-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
            placeholder="Search VIP customers, ring SKUs, certificates..."
            className="w-full pl-10 pr-4 py-2 bg-aurum-50/70 border border-aurum-200 rounded-xl text-sm text-charcoal-800 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-aurum-400 focus:bg-white transition"
          />
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute top-11 left-0 right-0 bg-white rounded-xl shadow-2xl border border-aurum-300 overflow-hidden z-50 divide-y divide-gray-100">
            {searchResults.map(c => (
              <div
                key={c.id}
                onClick={() => handleSelectCustomer(c.id)}
                className="p-3 hover:bg-aurum-50 cursor-pointer flex items-center justify-between text-xs transition"
              >
                <div>
                  <div className="font-bold text-charcoal-900 text-sm">
                    {c.first_name} {c.last_name}
                  </div>
                  <div className="text-charcoal-500">{c.email} • {c.phone}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-aurum-100 text-aurum-800 font-semibold border border-aurum-300">
                  {c.tier}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Role Switcher for Assessment Demoing */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-aurum-50 hover:bg-aurum-100 border border-aurum-300 text-xs font-semibold text-aurum-800 transition"
          >
            <Shield className="w-3.5 h-3.5 text-aurum-600" />
            <span className="hidden sm:inline">Role:</span>
            <span className="uppercase text-charcoal-900">{user?.role?.replace(/_/g, ' ') || 'Demo Role'}</span>
            <ChevronDown className="w-3 h-3 text-aurum-600" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 top-10 w-64 bg-white rounded-xl shadow-2xl border border-aurum-300 p-2 z-50">
              <div className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 px-2 py-1">
                Switch Operational Role
              </div>
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  onClick={async () => {
                    await loginAsDemo(acc.role);
                    setShowRoleSwitcher(false);
                    navigate('/');
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition flex items-center justify-between ${
                    user?.role === acc.role ? 'bg-aurum-100 text-aurum-900 font-bold' : 'hover:bg-gray-50 text-charcoal-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs">{acc.roleLabel}</div>
                    <div className="text-[10px] text-charcoal-400 font-normal">{acc.desc.substring(0, 38)}...</div>
                  </div>
                  {user?.role === acc.role && <UserCheck className="w-3.5 h-3.5 text-aurum-600 flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-aurum-50 hover:bg-aurum-100 border border-aurum-200 text-charcoal-700 transition"
            title="Live Notifications"
          >
            <Bell className="w-4 h-4 text-charcoal-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* User Profile / Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-aurum-50 border border-transparent hover:border-aurum-200 transition"
          >
            <div className="w-7 h-7 rounded-full bg-aurum-400 text-white font-bold font-serif text-xs flex items-center justify-center shadow-sm">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-bold text-charcoal-900 leading-tight">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-[10px] text-charcoal-500 capitalize">
                {user?.title || user?.role?.replace(/_/g, ' ')}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-charcoal-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-11 w-48 bg-white rounded-xl shadow-2xl border border-aurum-200 py-1 z-50">
              <div className="px-3 py-2 border-b border-gray-100 text-xs">
                <div className="font-semibold text-charcoal-900">{user?.email}</div>
                <div className="text-[10px] text-charcoal-500">{user?.storeName || 'Mumbai Flagship'}</div>
              </div>
              <button
                onClick={logout}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
