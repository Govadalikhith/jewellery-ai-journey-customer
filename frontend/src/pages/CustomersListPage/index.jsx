import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, ArrowUpDown, ChevronRight, UserPlus, Eye, Mail, Phone } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { StatusBadge } from '../../components/StatusBadge';
import { TIER_COLORS, CHURN_COLORS } from '../../constants';
import { useToast } from '../../context/ToastContext';

export const CustomersListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('');
  const [status, setStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCust, setNewCust] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    tier: 'Gold',
    notes: ''
  });

  const navigate = useNavigate();
  const toast = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerService.list({ search, tier, status, limit: 50 });
      setCustomers(res.data || []);
      setTotal(res.meta?.total || (res.data ? res.data.length : 0));
    } catch (err) {
      toast.error('Failed to load customers', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, tier, status]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await customerService.create(newCust);
      toast.success('Customer Registered', `Created profile for ${newCust.first_name} ${newCust.last_name}`);
      setShowCreateModal(false);
      setNewCust({ first_name: '', last_name: '', email: '', phone: '', tier: 'Gold', notes: '' });
      fetchCustomers();
    } catch (err) {
      toast.error('Creation Failed', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-charcoal-900">
            Unified Customer 360 Directory
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Aggregated client intelligence, bespoke journey stages, and AI churn predictors.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-aurum-400 hover:bg-aurum-500 text-white font-bold rounded-xl shadow-luxury hover:shadow-luxury-hover transition flex items-center gap-2 text-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Register VIP Client
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-charcoal-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, phone number..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-charcoal-800 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-aurum-400 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-charcoal-700 font-semibold focus:outline-none focus:ring-2 focus:ring-aurum-400"
          >
            <option value="">All VIP Tiers</option>
            <option value="Elite Bespoke">Elite Bespoke</option>
            <option value="VIP">VIP</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-charcoal-700 font-semibold focus:outline-none focus:ring-2 focus:ring-aurum-400"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="vip_high_touch">VIP High-Touch</option>
            <option value="at_risk">At Risk (High Churn)</option>
            <option value="dormant">Dormant</option>
          </select>
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-aurum-50/80 text-charcoal-600 font-bold uppercase tracking-wider border-b border-aurum-200">
              <tr>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">VIP Tier</th>
                <th className="px-6 py-4">Lifetime Spend</th>
                <th className="px-6 py-4">Churn Risk</th>
                <th className="px-6 py-4">Propensity</th>
                <th className="px-6 py-4">Active Journeys</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-charcoal-400">
                    Loading customer intelligence records...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-charcoal-400">
                    No customer profiles match your filter criteria.
                  </td>
                </tr>
              ) : (
                customers.map(c => {
                  const churnScore = Math.round((c.churn_risk_score || 0.15) * 100);
                  const propScore = Math.round((c.propensity_score || 0.85) * 100);
                  return (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/customers/${c.id}`)}
                      className="hover:bg-aurum-50/50 cursor-pointer transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-aurum-50 border border-aurum-300 flex items-center justify-center font-serif font-bold text-aurum-700">
                            {c.first_name[0]}{c.last_name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-charcoal-900 text-sm">
                              {c.first_name} {c.last_name}
                            </div>
                            <div className="text-charcoal-500 text-[11px]">{c.email} • {c.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TIER_COLORS[c.tier] || 'bg-gray-100'}`}>
                          {c.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-charcoal-900">
                        ₹{Number(c.total_spend || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          churnScore > 60 ? CHURN_COLORS.high : churnScore > 30 ? CHURN_COLORS.medium : CHURN_COLORS.low
                        }`}>
                          {churnScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {propScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-charcoal-700">
                        {c.journey_count || 1} Active
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/customers/${c.id}`); }}
                          className="px-3 py-1 bg-aurum-50 hover:bg-aurum-100 text-aurum-800 font-semibold rounded-lg border border-aurum-300 transition text-[11px] inline-flex items-center gap-1"
                        >
                          View 360 <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-aurum-300">
            <h3 className="text-xl font-serif font-bold text-charcoal-900 mb-4">
              Register New Jewellery Client
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal-700 mb-1 block">First Name</label>
                  <input
                    type="text"
                    required
                    value={newCust.first_name}
                    onChange={(e) => setNewCust({ ...newCust, first_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal-700 mb-1 block">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newCust.last_name}
                    onChange={(e) => setNewCust({ ...newCust, last_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">Email</label>
                <input
                  type="email"
                  required
                  value={newCust.email}
                  onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newCust.phone}
                  onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">VIP Tier</label>
                <select
                  value={newCust.tier}
                  onChange={(e) => setNewCust({ ...newCust, tier: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400 font-semibold"
                >
                  <option value="Elite Bespoke">Elite Bespoke</option>
                  <option value="VIP">VIP</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">Client Notes</label>
                <textarea
                  rows={2}
                  value={newCust.notes}
                  onChange={(e) => setNewCust({ ...newCust, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-charcoal-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-aurum-400 hover:bg-aurum-500 rounded-xl shadow-luxury"
                >
                  Register Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
