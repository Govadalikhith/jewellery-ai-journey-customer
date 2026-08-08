import React, { useState, useEffect } from 'react';
import { FileText, Search, Shield, Filter, Eye, ChevronRight, Lock } from 'lucide-react';
import { auditService } from '../../services/aiService';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const toast = useToast();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await auditService.list({ action: actionFilter, search, limit: 50 });
      setLogs(res.data || []);
      setTotal(res.meta?.total || (res.data ? res.data.length : 0));
    } catch (err) {
      toast.error('Audit Fetch Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-serif text-charcoal-900 flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-aurum-500" />
          Immutable Security Audit Trail
        </h2>
        <p className="text-xs text-charcoal-500 mt-1">
          Append-only compliance log recording every authentication, data mutation, AI execution, and human override.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-sm p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-charcoal-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor name, override reason, or entity ID..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-charcoal-800 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-aurum-400 focus:bg-white transition"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-charcoal-700 font-semibold focus:outline-none focus:ring-2 focus:ring-aurum-400"
        >
          <option value="">All Material Actions</option>
          <option value="LOGIN">LOGIN</option>
          <option value="APPROVE_RECOMMENDATION">APPROVE RECOMMENDATION</option>
          <option value="OVERRIDE_RECOMMENDATION">OVERRIDE RECOMMENDATION</option>
          <option value="AI_EXECUTION">AI EXECUTION</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="SYSTEM_SETTING_CHANGE">SYSTEM SETTING CHANGE</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-aurum-50/80 text-charcoal-600 font-bold uppercase border-b border-aurum-200">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity Type</th>
                <th className="px-6 py-4">Reason / Notes</th>
                <th className="px-6 py-4 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-charcoal-400">Loading audit trail...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-charcoal-400">No audit events match your filter.</td>
                </tr>
              ) : (
                logs.map(l => (
                  <tr key={l.id} className="hover:bg-aurum-50/40 transition">
                    <td className="px-6 py-4 text-charcoal-500 font-mono text-[11px]">
                      {new Date(l.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-charcoal-900">{l.actor_name || 'System Engine'}</div>
                      <span className="text-[10px] uppercase font-bold text-aurum-700">{l.actor_role}</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-charcoal-800">
                      {l.action}
                    </td>
                    <td className="px-6 py-4 capitalize font-semibold text-charcoal-700">
                      {l.entity_type}
                    </td>
                    <td className="px-6 py-4 text-charcoal-600 max-w-xs truncate">
                      {l.reason || '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedLog(l)}
                        className="px-3 py-1 bg-aurum-50 hover:bg-aurum-100 text-aurum-800 font-semibold rounded-lg border border-aurum-300 transition text-[11px]"
                      >
                        Inspect JSON
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Payload Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-aurum-300 space-y-4">
            <h3 className="text-lg font-serif font-bold text-charcoal-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-aurum-500" />
              Audit Payload Snapshot ({selectedLog.id})
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-charcoal-700">Previous Value:</span>
                <pre className="p-3 bg-gray-50 rounded-xl border border-gray-200 mt-1 font-mono text-[11px] overflow-x-auto text-charcoal-700">
                  {JSON.stringify(selectedLog.previous_value, null, 2) || 'null'}
                </pre>
              </div>
              <div>
                <span className="font-semibold text-charcoal-700">New Value / Mutation:</span>
                <pre className="p-3 bg-aurum-50/60 rounded-xl border border-aurum-200 mt-1 font-mono text-[11px] overflow-x-auto text-charcoal-800">
                  {JSON.stringify(selectedLog.new_value, null, 2) || 'null'}
                </pre>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 font-bold text-white bg-aurum-400 hover:bg-aurum-500 rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
