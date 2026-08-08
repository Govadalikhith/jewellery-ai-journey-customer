import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, CheckCircle2, XCircle, AlertTriangle, Users, Sparkles, RefreshCw } from 'lucide-react';
import { consentService, customerService, recommendationService } from '../../services/aiService';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const ConsentGovernancePage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('cust_rahul_sharma');
  const [customerConsents, setCustomerConsents] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const custList = await customerService.list({ limit: 20 });
      setCustomers(custList.data || []);
      if (custList.data?.length > 0) {
        const id = selectedCustomerId || custList.data[0].id;
        const consents = await consentService.getByCustomerId(id);
        setCustomerConsents(consents || []);
      }
    } catch (err) {
      toast.error('Failed to load consents', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCustomerId]);

  const handleToggleConsent = async (channel, currentVal, cap) => {
    try {
      await consentService.update(selectedCustomerId, {
        channel,
        is_consented: !currentVal,
        weekly_frequency_cap: cap || 3
      });
      toast.success('Consent Updated', `${channel.toUpperCase()} consent state adjusted.`);
      const updated = await consentService.getByCustomerId(selectedCustomerId);
      setCustomerConsents(updated || []);
    } catch (err) {
      toast.error('Update Failed', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-charcoal-900 flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            Consent Governance & Frequency Limits
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Deterministic compliance filters preventing unsolicited messaging and enforcing weekly frequency limits.
          </p>
        </div>
      </div>

      {/* Governance Architecture Flowchart Box */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury p-6 space-y-4">
        <h3 className="font-serif font-bold text-base text-charcoal-900">
          Deterministic 7-Layer Governance Pipeline
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {[
            { step: '1. Consent Check', desc: 'Opt-in status' },
            { step: '2. Preferred Channel', desc: 'Match preference' },
            { step: '3. Opt-Out Filter', desc: 'Verify no opt-out' },
            { step: '4. Frequency Cap', desc: 'Rolling 7-day max' },
            { step: '5. Journey Stage', desc: 'No urgent conflicts' },
            { step: '6. Staff RBAC', desc: 'Role permissions' },
            { step: '7. Human Review', desc: 'Approve / Override' }
          ].map((s, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-aurum-50/70 border border-aurum-200/80">
              <div className="font-bold text-charcoal-900">{s.step}</div>
              <div className="text-[10px] text-charcoal-500 mt-0.5">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Selector & Consents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Selector */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-aurum-200 shadow-luxury p-6 space-y-3">
          <h4 className="font-serif font-bold text-sm text-charcoal-900">
            Select Patron for Governance Inspection
          </h4>
          <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
            {customers.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCustomerId(c.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                  selectedCustomerId === c.id
                    ? 'bg-aurum-50 border-aurum-400 font-bold text-charcoal-900 shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 text-charcoal-700'
                }`}
              >
                <div>
                  <div>{c.first_name} {c.last_name}</div>
                  <div className="text-[10px] text-charcoal-400 font-normal">{c.email}</div>
                </div>
                <span className="text-[10px] uppercase font-bold text-aurum-700">{c.tier}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Consents & Limits Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-aurum-200 shadow-luxury overflow-hidden">
          <div className="p-6 border-b border-aurum-100 flex items-center justify-between">
            <h4 className="font-serif font-bold text-base text-charcoal-900">
              Channel Consent Matrix & Frequency Caps
            </h4>
            <span className="text-xs text-charcoal-500">
              Customer: <strong className="text-charcoal-900">{selectedCustomerId}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-aurum-50/80 text-charcoal-600 font-bold uppercase border-b border-aurum-200">
                <tr>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Weekly Limit</th>
                  <th className="px-6 py-4">Sent This Week</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customerConsents.map(con => (
                  <tr key={con.id} className="hover:bg-aurum-50/40 transition">
                    <td className="px-6 py-4 uppercase font-bold text-charcoal-900">{con.channel}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        con.is_consented ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}>
                        {con.is_consented ? 'Consented' : 'Opted-Out'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-charcoal-800">
                      {con.weekly_frequency_cap || 3} msgs / week
                    </td>
                    <td className="px-6 py-4 font-semibold text-charcoal-600">
                      {con.messages_sent_this_week || 0} messages
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleConsent(con.channel, con.is_consented, con.weekly_frequency_cap)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition border ${
                          con.is_consented
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {con.is_consented ? 'Opt Out' : 'Grant Consent'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
