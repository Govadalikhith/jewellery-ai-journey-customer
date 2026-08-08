import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Filter, Sparkles, Gem, Hammer, Award, Truck, Glasses, Receipt, FileCheck, Wrench, Repeat, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { journeyService } from '../../services/customerService';
import { JOURNEY_STAGES } from '../../constants';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const JourneyTimelinePage = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [stageFilter, setStageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateStage, setUpdateStage] = useState('design');
  const [updateNotes, setUpdateNotes] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  const fetchJourneys = async () => {
    try {
      setLoading(true);
      const res = await journeyService.list({ stage: stageFilter, status: statusFilter });
      setJourneys(res || []);
      if (res && res.length > 0 && !selectedJourney) {
        loadJourneyDetails(res[0].id);
      }
    } catch (err) {
      toast.error('Failed to load journeys', err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadJourneyDetails = async (id) => {
    try {
      const details = await journeyService.getById(id);
      setSelectedJourney(details);
    } catch (err) {
      toast.error('Error fetching details', err.message);
    }
  };

  useEffect(() => {
    fetchJourneys();
  }, [stageFilter, statusFilter]);

  const handleStageUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJourney) return;
    try {
      await journeyService.updateStage(selectedJourney.journey.id, {
        stage: updateStage,
        status: 'completed',
        notes: updateNotes
      });
      toast.success('Stage Progressed', `Journey advanced to ${updateStage.replace(/_/g, ' ').toUpperCase()}`);
      setShowUpdateModal(false);
      setUpdateNotes('');
      loadJourneyDetails(selectedJourney.journey.id);
      fetchJourneys();
    } catch (err) {
      toast.error('Update Failed', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-charcoal-900">
            10-Stage Unified Lifecycle Pipelines
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Tracking bespoke jewellery through Design, Sourcing, Workshop Crafting, Assay Hallmarking, and Lifetime Care.
          </p>
        </div>

        {selectedJourney && (
          <button
            onClick={() => {
              setUpdateStage(selectedJourney.journey.current_stage);
              setShowUpdateModal(true);
            }}
            className="px-4 py-2.5 bg-aurum-400 hover:bg-aurum-500 text-white font-bold rounded-xl shadow-luxury hover:shadow-luxury-hover transition text-xs flex items-center gap-2 self-start md:self-auto"
          >
            <Compass className="w-4 h-4" /> Advance Journey Stage
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-sm p-4 flex items-center gap-3">
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-charcoal-700 font-semibold focus:outline-none focus:ring-2 focus:ring-aurum-400"
        >
          <option value="">All 10 Stages</option>
          {JOURNEY_STAGES.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-charcoal-700 font-semibold focus:outline-none focus:ring-2 focus:ring-aurum-400"
        >
          <option value="">All Statuses</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
        </select>
      </div>

      {/* Main Grid: Left Journey List, Right Selected Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Journey List */}
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-xs text-charcoal-400">
              Loading active customer journeys...
            </div>
          ) : journeys.length === 0 ? (
            <div className="p-8 text-center text-xs text-charcoal-400 bg-white rounded-2xl border border-aurum-200">
              No active customer journeys match your filters.
            </div>
          ) : (
            journeys.map(j => (
              <div
                key={j.id}
                onClick={() => loadJourneyDetails(j.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  selectedJourney?.journey?.id === j.id
                    ? 'bg-aurum-50/80 border-aurum-400 shadow-md ring-1 ring-aurum-300'
                    : 'bg-white border-aurum-200 hover:border-aurum-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase text-aurum-700 bg-aurum-100 px-2 py-0.5 rounded-md">
                    {j.current_stage?.replace(/_/g, ' ')}
                  </span>
                  <StatusBadge status={j.status} />
                </div>
                <h4 className="font-bold text-sm text-charcoal-900">{j.title}</h4>
                <div className="text-xs text-charcoal-500 mt-1">
                  Client: <strong className="text-charcoal-800">{j.first_name} {j.last_name}</strong>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-charcoal-500">
                  <span>Target: {j.target_completion_date || 'Ongoing'}</span>
                  <span className="font-bold text-charcoal-900">₹{Number(j.total_estimated_value || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Detailed Stage Progression & Linked Records */}
        <div className="lg:col-span-2 space-y-6">
          {selectedJourney ? (
            <>
              {/* Top Overview Card */}
              <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-serif text-charcoal-900">
                      {selectedJourney.journey.title}
                    </h3>
                    <div className="text-xs text-charcoal-500 mt-1">
                      Customer: <span className="font-bold text-charcoal-800">{selectedJourney.journey.first_name} {selectedJourney.journey.last_name}</span> ({selectedJourney.journey.email})
                    </div>
                  </div>
                  <StatusBadge status={selectedJourney.journey.status} />
                </div>
                <p className="text-xs text-charcoal-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {selectedJourney.journey.notes || 'Bespoke high-jewellery custom commission.'}
                </p>
              </div>

              {/* 10-Stage Milestone Stepper List */}
              <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury p-6 space-y-4">
                <h4 className="font-serif font-bold text-sm text-charcoal-900">
                  Milestone Stage Records
                </h4>
                <div className="space-y-3">
                  {selectedJourney.stages.map((stg) => (
                    <div
                      key={stg.id}
                      className="p-3.5 rounded-xl bg-aurum-50/40 border border-aurum-200/70 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-xl bg-aurum-400 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {stg.stage_order}
                        </div>
                        <div>
                          <div className="font-bold text-charcoal-900 text-sm capitalize">
                            {stg.stage_name.replace(/_/g, ' ')}
                          </div>
                          <p className="text-charcoal-600 mt-0.5">{stg.notes || 'Stage logged.'}</p>
                          <div className="text-[10px] text-charcoal-400 mt-1">
                            Completed: {stg.completed_at ? new Date(stg.completed_at).toLocaleDateString() : 'In Progress'}
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={stg.status} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Records (CAD Designs, Hallmarks, Transfers) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Linked Designs */}
                <div className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm space-y-2">
                  <h5 className="font-serif font-bold text-charcoal-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-aurum-500" />
                    CAD Design Specifications
                  </h5>
                  {selectedJourney.linkedRecords?.designs?.length > 0 ? (
                    selectedJourney.linkedRecords.designs.map(d => (
                      <div key={d.id} className="p-2.5 bg-gray-50 rounded-xl space-y-1">
                        <div className="font-bold text-charcoal-800">{d.title}</div>
                        <div className="text-charcoal-500">{d.metal_type} • {d.metal_purity} • {d.gemstone_details}</div>
                      </div>
                    ))
                  ) : <div className="text-charcoal-400">No bespoke CAD designs attached.</div>}
                </div>

                {/* Linked Hallmarks */}
                <div className="bg-white p-5 rounded-2xl border border-aurum-200 shadow-sm space-y-2">
                  <h5 className="font-serif font-bold text-charcoal-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-aurum-500" />
                    BIS Hallmark & Laser Assay
                  </h5>
                  {selectedJourney.linkedRecords?.hallmarks?.length > 0 ? (
                    selectedJourney.linkedRecords.hallmarks.map(h => (
                      <div key={h.id} className="p-2.5 bg-gray-50 rounded-xl space-y-1">
                        <div className="font-bold text-charcoal-800">{h.certificate_number}</div>
                        <div className="text-charcoal-500">{h.assay_office} • Verified: {h.purity_verified}</div>
                      </div>
                    ))
                  ) : <div className="text-charcoal-400">Pending assay hallmarking.</div>}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-charcoal-400 bg-white rounded-2xl border border-aurum-200">
              Select a journey on the left to inspect full stage milestones and linked assets.
            </div>
          )}
        </div>
      </div>

      {/* Advance Stage Modal */}
      {showUpdateModal && selectedJourney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-aurum-300">
            <h3 className="text-xl font-serif font-bold text-charcoal-900 mb-4">
              Advance Journey Milestone
            </h3>
            <form onSubmit={handleStageUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">
                  Select Target Stage
                </label>
                <select
                  value={updateStage}
                  onChange={(e) => setUpdateStage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-semibold focus:ring-2 focus:ring-aurum-400"
                >
                  {JOURNEY_STAGES.map(s => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">
                  Stage Completion Notes & Observations
                </label>
                <textarea
                  rows={3}
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="E.g., Master Goldsmith completed prong micro-buffing. Ready for laser assay..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 font-semibold text-charcoal-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-aurum-400 hover:bg-aurum-500 rounded-xl shadow-luxury"
                >
                  Confirm & Audit Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
