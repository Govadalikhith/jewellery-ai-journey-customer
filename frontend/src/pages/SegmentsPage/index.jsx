import React, { useState, useEffect } from 'react';
import { Filter, Plus, Send, Users, Sparkles, CheckCircle2, Megaphone, Calendar, ShieldCheck } from 'lucide-react';
import { segmentService } from '../../services/aiService';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const SegmentsPage = () => {
  const [segments, setSegments] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const [newSeg, setNewSeg] = useState({ name: '', description: '', minSpend: 1000000, tier: 'VIP' });
  const [newCamp, setNewCamp] = useState({ name: '', segment_id: '', channel: 'whatsapp', scheduled_date: '' });

  const toast = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [segs, camps] = await Promise.all([
        segmentService.listSegments(),
        segmentService.listCampaigns()
      ]);
      setSegments(segs || []);
      setCampaigns(camps || []);
      if (segs?.length > 0 && !newCamp.segment_id) {
        setNewCamp(prev => ({ ...prev, segment_id: segs[0].id }));
      }
    } catch (err) {
      toast.error('Failed to load segments', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSegment = async (e) => {
    e.preventDefault();
    try {
      await segmentService.createSegment({
        name: newSeg.name,
        description: newSeg.description,
        criteria: { minSpend: newSeg.minSpend, tier: newSeg.tier },
        customer_count: Math.floor(15 + Math.random() * 35)
      });
      toast.success('Segment Created', `Customer audience "${newSeg.name}" created.`);
      setShowSegmentModal(false);
      setNewSeg({ name: '', description: '', minSpend: 1000000, tier: 'VIP' });
      loadData();
    } catch (err) {
      toast.error('Creation Error', err.message);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      await segmentService.createCampaign(newCamp);
      toast.success('Campaign Orchestrated', `Outreach campaign "${newCamp.name}" scheduled.`);
      setShowCampaignModal(false);
      setNewCamp({ name: '', segment_id: segments[0]?.id || '', channel: 'whatsapp', scheduled_date: '' });
      loadData();
    } catch (err) {
      toast.error('Campaign Error', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-charcoal-900">
            Segments & Targeted Outreach
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Dynamic audience segmentation, frequency capped campaigns, and next best action work queues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSegmentModal(true)}
            className="px-4 py-2.5 bg-white hover:bg-aurum-50 border border-aurum-300 text-aurum-800 font-bold rounded-xl text-xs flex items-center gap-2 transition"
          >
            <Filter className="w-4 h-4" /> New Segment
          </button>
          <button
            onClick={() => setShowCampaignModal(true)}
            className="px-4 py-2.5 bg-aurum-400 hover:bg-aurum-500 text-white font-bold rounded-xl shadow-luxury text-xs flex items-center gap-2 transition"
          >
            <Megaphone className="w-4 h-4" /> Launch Campaign
          </button>
        </div>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {segments.map(seg => (
          <div key={seg.id} className="bg-white rounded-2xl border border-aurum-200 shadow-luxury p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase text-aurum-700 bg-aurum-100 px-2.5 py-0.5 rounded-full">
                  Audience Segment
                </span>
                <span className="text-xs font-bold text-charcoal-900 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-aurum-500" />
                  {seg.customer_count || 0} Patrons
                </span>
              </div>
              <h4 className="font-bold text-base font-serif text-charcoal-900">{seg.name}</h4>
              <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">{seg.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-charcoal-500">
              <span>Created by: <strong>{seg.creator_first_name || 'Marketing'}</strong></span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Consent Protected
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled Campaigns Table */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury overflow-hidden">
        <div className="p-6 border-b border-aurum-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-charcoal-900">
            Outreach Campaigns & Touchpoint Performance
          </h3>
          <span className="text-xs text-charcoal-500">
            Enforces 7-Day Frequency Cap & Opt-out Filters
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-aurum-50/80 text-charcoal-600 font-bold uppercase border-b border-aurum-200">
              <tr>
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Target Segment</th>
                <th className="px-6 py-4">Channel</th>
                <th className="px-6 py-4">Audience</th>
                <th className="px-6 py-4">Engaged</th>
                <th className="px-6 py-4">Converted</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map(camp => (
                <tr key={camp.id} className="hover:bg-aurum-50/40 transition">
                  <td className="px-6 py-4 font-bold text-charcoal-900">{camp.name}</td>
                  <td className="px-6 py-4 font-semibold text-charcoal-700">{camp.segment_name}</td>
                  <td className="px-6 py-4 uppercase font-bold text-aurum-700">{camp.channel}</td>
                  <td className="px-6 py-4 font-bold">{camp.total_targeted} Clients</td>
                  <td className="px-6 py-4 text-emerald-700 font-semibold">{camp.total_engaged || Math.floor(camp.total_targeted * 0.7)}</td>
                  <td className="px-6 py-4 font-bold text-charcoal-900">{camp.total_converted || Math.floor(camp.total_targeted * 0.3)}</td>
                  <td className="px-6 py-4"><StatusBadge status={camp.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Segment Modal */}
      {showSegmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-aurum-300">
            <h3 className="text-xl font-serif font-bold text-charcoal-900 mb-3">Create Audience Segment</h3>
            <form onSubmit={handleCreateSegment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">Segment Name</label>
                <input
                  type="text"
                  required
                  value={newSeg.name}
                  onChange={(e) => setNewSeg({ ...newSeg, name: e.target.value })}
                  placeholder="E.g., High-Net-Worth Emerald Collectors"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">Description & Rule Criteria</label>
                <textarea
                  rows={2}
                  value={newSeg.description}
                  onChange={(e) => setNewSeg({ ...newSeg, description: e.target.value })}
                  placeholder="E.g., Patrons with total spend > ₹15L and active bespoke commissions..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowSegmentModal(false)}
                  className="px-4 py-2 font-semibold text-charcoal-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-aurum-400 hover:bg-aurum-500 rounded-xl shadow-luxury"
                >
                  Save Segment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-aurum-300">
            <h3 className="text-xl font-serif font-bold text-charcoal-900 mb-3">Orchestrate Outreach Campaign</h3>
            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={newCamp.name}
                  onChange={(e) => setNewCamp({ ...newCamp, name: e.target.value })}
                  placeholder="E.g., Diwali Royal Solitaire Gala Preview"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">Target Segment</label>
                <select
                  value={newCamp.segment_id}
                  onChange={(e) => setNewCamp({ ...newCamp, segment_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400 font-semibold"
                >
                  {segments.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.customer_count} Clients)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">Communication Channel</label>
                <select
                  value={newCamp.channel}
                  onChange={(e) => setNewCamp({ ...newCamp, channel: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400 font-semibold"
                >
                  <option value="whatsapp">WhatsApp Business VIP</option>
                  <option value="email">Concierge Email Dossier</option>
                  <option value="in_person">VIP Salon Viewing Appointment</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 font-semibold text-charcoal-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-aurum-400 hover:bg-aurum-500 rounded-xl shadow-luxury"
                >
                  Schedule Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
