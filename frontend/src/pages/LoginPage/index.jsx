import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Mail, Eye, EyeOff, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DEMO_ACCOUNTS } from '../../constants';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@aurumjewellery.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const { login, loginAsDemo } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      toast.success('Welcome to Aurum & Co.', 'Authenticated successfully.');
      navigate('/');
    } catch (err) {
      toast.error('Authentication Error', err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (roleName) => {
    setLoading(true);
    try {
      await loginAsDemo(roleName);
      toast.success('Demo Persona Switched', `Logged in as ${roleName.replace(/_/g, ' ').toUpperCase()}`);
      navigate('/');
    } catch (err) {
      toast.error('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSubmitted(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSubmitted(false);
      toast.info('Password Reset', 'Security reset instructions dispatched if account exists.');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-aurum-100 via-white to-aurum-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl border border-aurum-200/80 shadow-2xl overflow-hidden">
        {/* Left: Luxury Brand Welcome */}
        <div className="bg-charcoal-900 text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle gold decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-aurum-400/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-aurum-400 to-aurum-600 flex items-center justify-center text-white mb-6 shadow-luxury">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight leading-tight">
              Aurum & Co.
            </h1>
            <span className="text-xs font-semibold tracking-widest uppercase text-aurum-400 mt-1 block">
              High Jewellery Intelligence
            </span>
            <p className="text-xs text-charcoal-300 mt-4 leading-relaxed">
              Unified 360° customer journey orchestration from Bespoke Design, Assay Hallmarking, and GIA Certification to Atelier Repairs and Lifetime Upgrades.
            </p>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="mt-8 pt-6 border-t border-charcoal-700/80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-aurum-400 mb-2.5">
              1-Click Assessment Roles:
            </div>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  onClick={() => handleDemoSelect(acc.role)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-charcoal-800/80 hover:bg-aurum-900 border border-charcoal-700 hover:border-aurum-400 text-xs text-charcoal-200 hover:text-white transition flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-white text-xs">{acc.roleLabel}</div>
                    <div className="text-[10px] text-charcoal-400 mt-0.5">{acc.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-aurum-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-charcoal-900">
              Sign In to Atelier Console
            </h2>
            <p className="text-xs text-charcoal-500 mt-1">
              Enter your corporate credentials to access customer journeys.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@aurumjewellery.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-aurum-400 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-aurum-400 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-charcoal-400 hover:text-charcoal-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-charcoal-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-aurum-500 focus:ring-aurum-400"
                />
                <span>Remember this workstation</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-aurum-600 hover:text-aurum-800 font-semibold"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-aurum-400 via-aurum-500 to-aurum-600 hover:from-aurum-500 hover:to-aurum-700 text-white font-bold rounded-xl shadow-luxury hover:shadow-luxury-hover transition duration-200 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In to Console <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-aurum-300">
            <h3 className="text-lg font-serif font-bold text-charcoal-900 mb-2">
              Reset Corporate Password
            </h3>
            <p className="text-xs text-charcoal-600 mb-4">
              Enter your verified Aurum concierge email address to request a temporary reset token.
            </p>
            {forgotSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald" />
                Reset link dispatched to your inbox.
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@aurumjewellery.com"
                  required
                  className="w-full p-2.5 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-charcoal-600 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-aurum-500 hover:bg-aurum-600 rounded-xl"
                  >
                    Send Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
