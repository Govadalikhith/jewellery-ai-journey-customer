import React, { useState, useEffect } from 'react';
import {
  Ticket, Search, MessageSquare, Send, Sparkles, AlertTriangle, CheckCircle2,
  XCircle, Clock, ShieldAlert, ArrowUpRight, Plus, User, Bot, RefreshCw
} from 'lucide-react';
import { ticketService } from '../../services/customerService';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const ServiceTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Agent Chat / Message input
  const [newMessage, setNewMessage] = useState('');
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [aiDraft, setAiDraft] = useState('');

  // Create Ticket Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    customer_id: 'cust_rahul_sharma',
    subject: '',
    category: 'Repair Status Inquiry',
    priority: 'high',
    message_text: ''
  });

  const { user } = useAuth();
  const toast = useToast();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await ticketService.list({ search, priority: priorityFilter, status: statusFilter });
      setTickets(res || []);
      if (res && res.length > 0 && !selectedTicket) {
        loadTicketDetails(res[0].id);
      }
    } catch (err) {
      toast.error('Failed to load tickets', err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTicketDetails = async (id) => {
    try {
      const details = await ticketService.getById(id);
      setSelectedTicket(details);
      setAiDraft('');
    } catch (err) {
      toast.error('Failed to load ticket details', err.message);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [search, priorityFilter, statusFilter]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;
    try {
      await ticketService.addMessage(selectedTicket.ticket.id, {
        message_text: newMessage,
        channel: 'whatsapp'
      });
      setNewMessage('');
      loadTicketDetails(selectedTicket.ticket.id);
      toast.success('Message Dispatched', 'Concierge response sent to customer.');
    } catch (err) {
      toast.error('Message Error', err.message);
    }
  };

  const handleGenerateAiDraft = async () => {
    if (!selectedTicket) return;
    try {
      setGeneratingDraft(true);
      const res = await ticketService.generateAiDraft(selectedTicket.ticket.id);
      setAiDraft(res.draftResponse);
      setNewMessage(res.draftResponse);
      toast.success('AI Draft Generated', 'Tailored luxury response drafted by Gemini.');
    } catch (err) {
      toast.error('AI Draft Error', err.message);
    } finally {
      setGeneratingDraft(false);
    }
  };

  const handleStatusChange = async (status) => {
    if (!selectedTicket) return;
    try {
      await ticketService.updateStatus(selectedTicket.ticket.id, status);
      toast.success('Status Updated', `Ticket is now marked as ${status.toUpperCase()}`);
      loadTicketDetails(selectedTicket.ticket.id);
      fetchTickets();
    } catch (err) {
      toast.error('Status Error', err.message);
    }
  };

  const handleCreateTicketSubmit = async (e) => {
    e.preventDefault();
    try {
      await ticketService.create(newTicketData);
      toast.success('Ticket Logged', 'Service ticket opened with AI monitoring.');
      setShowCreateModal(false);
      setNewTicketData({
        customer_id: 'cust_rahul_sharma',
        subject: '',
        category: 'Repair Status Inquiry',
        priority: 'high',
        message_text: ''
      });
      fetchTickets();
    } catch (err) {
      toast.error('Creation Failed', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-charcoal-900">
            Service Tickets & Concierge Assist
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time multi-channel conversation threads, AI response drafting, and churn mitigation workflows.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-aurum-400 hover:bg-aurum-500 text-white font-bold rounded-xl shadow-luxury hover:shadow-luxury-hover transition text-xs flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Open Service Ticket
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-sm p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-charcoal-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket number, issue, or patron name..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-charcoal-800 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-aurum-400 focus:bg-white transition"
          />
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-charcoal-700 font-semibold focus:outline-none focus:ring-2 focus:ring-aurum-400"
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-charcoal-700 font-semibold focus:outline-none focus:ring-2 focus:ring-aurum-400"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Main Split Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Ticket List */}
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-xs text-charcoal-400">Loading service tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-xs text-charcoal-400 bg-white rounded-2xl border border-aurum-200">
              No service tickets found matching criteria.
            </div>
          ) : (
            tickets.map(t => (
              <div
                key={t.id}
                onClick={() => loadTicketDetails(t.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  selectedTicket?.ticket?.id === t.id
                    ? 'bg-aurum-50/80 border-aurum-400 shadow-md ring-1 ring-aurum-300'
                    : 'bg-white border-aurum-200 hover:border-aurum-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[11px] font-bold text-aurum-800">
                    {t.ticket_number}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                </div>
                <h4 className="font-bold text-sm text-charcoal-900 line-clamp-1">{t.subject}</h4>
                <div className="text-xs text-charcoal-500 mt-1 flex items-center justify-between">
                  <span>Client: <strong className="text-charcoal-800">{t.first_name} {t.last_name}</strong></span>
                  <span>{t.message_count || 1} msgs</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Ticket Conversation & Agent Assist Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTicket ? (
            <>
              {/* Ticket Header & Patron Overview */}
              <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-aurum-700 bg-aurum-50 px-2 py-0.5 rounded-md border border-aurum-200">
                        {selectedTicket.ticket.ticket_number}
                      </span>
                      <StatusBadge status={selectedTicket.ticket.priority} />
                      <StatusBadge status={selectedTicket.ticket.status} />
                    </div>
                    <h3 className="text-xl font-bold font-serif text-charcoal-900 mt-1">
                      {selectedTicket.ticket.subject}
                    </h3>
                  </div>

                  {/* Lifecycle Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedTicket.ticket.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusChange('resolved')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs transition"
                      >
                        Resolve Ticket
                      </button>
                    )}
                    {selectedTicket.ticket.status !== 'closed' && (
                      <button
                        onClick={() => handleStatusChange('closed')}
                        className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-charcoal-800 rounded-xl font-semibold text-xs transition"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Conversation Summary & Intent Insights */}
                {selectedTicket.aiSummary && (
                  <div className="bg-aurum-50/70 p-4 rounded-xl border border-aurum-200/80 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-aurum-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-aurum-500" />
                        Executive AI Conversation Summary
                      </span>
                      <span className="text-[10px] text-aurum-700 font-semibold uppercase">
                        Urgency: {selectedTicket.aiSummary.urgency}
                      </span>
                    </div>
                    <p className="text-charcoal-700 leading-relaxed">
                      {selectedTicket.aiSummary.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Multi-turn Conversation Feed */}
              <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury p-6 space-y-4">
                <h4 className="font-serif font-bold text-sm text-charcoal-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-aurum-500" />
                  VIP Conversation History
                </h4>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {selectedTicket.messages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-2xl text-xs max-w-xl ${
                        msg.sender_type === 'customer'
                          ? 'bg-gray-100 text-charcoal-800 mr-auto border border-gray-200'
                          : 'bg-aurum-50 text-charcoal-900 ml-auto border border-aurum-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-charcoal-500 mb-1">
                        <span className="capitalize">{msg.sender_type === 'customer' ? 'Patron' : 'VIP Concierge'}</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.message_text}</p>
                    </div>
                  ))}
                </div>

                {/* Agent Reply & AI Draft Generator */}
                <form onSubmit={handleSendMessage} className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-charcoal-700">Compose Concierge Reply</span>
                    <button
                      type="button"
                      onClick={handleGenerateAiDraft}
                      disabled={generatingDraft}
                      className="px-3 py-1 bg-aurum-50 hover:bg-aurum-100 text-aurum-800 border border-aurum-300 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-aurum-500" />
                      {generatingDraft ? 'Drafting...' : 'AI Concierge Response Draft'}
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your response to the patron or use AI Draft above..."
                    className="w-full p-3 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400 leading-relaxed"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-aurum-400 hover:bg-aurum-500 rounded-xl shadow-luxury transition flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" /> Dispatch Message
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-charcoal-400 bg-white rounded-2xl border border-aurum-200">
              Select a service ticket on the left to review customer context and conversation turns.
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-aurum-300">
            <h3 className="text-xl font-serif font-bold text-charcoal-900 mb-3">Open Service Ticket</h3>
            <form onSubmit={handleCreateTicketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">Subject Line</label>
                <input
                  type="text"
                  required
                  value={newTicketData.subject}
                  onChange={(e) => setNewTicketData({ ...newTicketData, subject: e.target.value })}
                  placeholder="E.g., Overdue Atelier Repair on 2.01ct Solitaire Ring"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">Category</label>
                <select
                  value={newTicketData.category}
                  onChange={(e) => setNewTicketData({ ...newTicketData, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400 font-semibold"
                >
                  <option value="Repair Status Inquiry">Repair Status Inquiry</option>
                  <option value="Bespoke Customization">Bespoke Customization</option>
                  <option value="Valuation & Appraisal">Valuation & Appraisal</option>
                  <option value="Delivery Escalation">Delivery Escalation</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">Priority Level</label>
                <select
                  value={newTicketData.priority}
                  onChange={(e) => setNewTicketData({ ...newTicketData, priority: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400 font-semibold"
                >
                  <option value="urgent">Urgent (Immediate VIP Attention)</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 mb-1 block">Initial Customer Inbound Message</label>
                <textarea
                  rows={3}
                  value={newTicketData.message_text}
                  onChange={(e) => setNewTicketData({ ...newTicketData, message_text: e.target.value })}
                  placeholder="Paste incoming client WhatsApp message or call transcript..."
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
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
