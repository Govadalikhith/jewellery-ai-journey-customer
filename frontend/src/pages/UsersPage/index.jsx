import React, { useState, useEffect } from 'react';
import { UserCog, Plus, Shield, UserCheck, UserX, Check, Lock } from 'lucide-react';
import { userService } from '../../services/aiService';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: 'password123',
    role: 'service_agent',
    phone: '',
    title: 'Client Advisor'
  });

  const toast = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [uList, rList] = await Promise.all([
        userService.list(),
        userService.listRoles()
      ]);
      setUsers(uList || []);
      setRoles(rList || []);
    } catch (err) {
      toast.error('Failed to load users', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (user) => {
    try {
      await userService.toggleStatus(user.id, !user.is_active);
      toast.success('Status Updated', `User account is now ${!user.is_active ? 'Active' : 'Deactivated'}.`);
      loadData();
    } catch (err) {
      toast.error('Update Failed', err.message);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.create(newUser);
      toast.success('User Created', `Employee profile for ${newUser.first_name} ${newUser.last_name} created.`);
      setShowCreateModal(false);
      setNewUser({
        first_name: '',
        last_name: '',
        email: '',
        password: 'password123',
        role: 'service_agent',
        phone: '',
        title: 'Client Advisor'
      });
      loadData();
    } catch (err) {
      toast.error('Creation Failed', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-charcoal-900 flex items-center gap-2.5">
            <UserCog className="w-6 h-6 text-aurum-500" />
            User & Role-Based Access Control (RBAC)
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Enterprise administration console for employee provisioning, role assignments, and permission audits.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-aurum-400 hover:bg-aurum-500 text-white font-bold rounded-xl shadow-luxury hover:shadow-luxury-hover transition text-xs flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Provision Employee
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-aurum-50/80 text-charcoal-600 font-bold uppercase border-b border-aurum-200">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Title & Role</th>
                <th className="px-6 py-4">Assigned Salon</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-charcoal-400">Loading user accounts...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-charcoal-400">No users found.</td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-aurum-50/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-aurum-50 border border-aurum-300 font-bold font-serif text-aurum-700 flex items-center justify-center">
                          {u.first_name[0]}{u.last_name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-charcoal-900 text-sm">
                            {u.first_name} {u.last_name}
                          </div>
                          <div className="text-charcoal-500 text-[11px]">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-charcoal-800">{u.title || 'Advisor'}</div>
                      <span className="text-[10px] font-bold uppercase text-aurum-700">{u.role?.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-charcoal-700">
                      {u.store_name || 'Mumbai Flagship'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        u.is_active ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}>
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-charcoal-500">
                      {u.last_login_at ? new Date(u.last_login_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition ${
                          u.is_active
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role & Permissions Inspector */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury p-6 space-y-4">
        <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-aurum-500" />
          Fine-Grained Role Permissions Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {roles.map(r => (
            <div key={r.id} className="p-4 rounded-xl bg-aurum-50/50 border border-aurum-200 space-y-2">
              <div className="font-serif font-bold text-charcoal-900 text-sm capitalize">
                {r.display_name || r.name?.replace(/_/g, ' ')}
              </div>
              <p className="text-[11px] text-charcoal-600 leading-relaxed">{r.description}</p>
              <div className="text-[10px] font-semibold text-aurum-800">
                {r.permissions?.length || 8} Active Grants
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-aurum-300">
            <h3 className="text-xl font-serif font-bold text-charcoal-900 mb-3">Provision Employee</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal-700 mb-1 block">First Name</label>
                  <input
                    type="text"
                    required
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal-700 mb-1 block">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400 font-semibold"
                >
                  <option value="admin">System Administrator</option>
                  <option value="sales_manager">Sales Manager</option>
                  <option value="marketing_manager">Marketing Manager</option>
                  <option value="service_agent">Service Agent</option>
                </select>
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
