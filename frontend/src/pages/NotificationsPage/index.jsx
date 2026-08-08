import React, { useState } from 'react';
import { Bell, Check, Clock, ExternalLink, Filter, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { StatusBadge } from '../../components/StatusBadge';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  const filtered = notifications.filter(n => {
    if (filterType === 'unread') return !n.is_read;
    if (filterType === 'urgent') return n.urgency === 'urgent';
    return true;
  });

  const handleOpenLink = (n) => {
    markAsRead(n.id);
    if (n.link_url) navigate(n.link_url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-charcoal-900 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-aurum-500" />
            Live Notifications & Event Center
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time notifications for ticket assignments, AI approval requests, overdue repairs, and journey alerts.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="px-4 py-2 bg-white hover:bg-aurum-50 text-aurum-800 border border-aurum-300 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition self-start md:self-auto"
        >
          <Check className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-sm p-4 flex items-center gap-3">
        {[
          { key: 'all', label: `All Alerts (${notifications.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'urgent', label: 'Urgent Escalations' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setFilterType(t.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === t.key
                ? 'bg-aurum-400 text-white shadow-sm'
                : 'text-charcoal-600 hover:bg-aurum-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury overflow-hidden divide-y divide-gray-100">
        {loading ? (
          <div className="p-8 text-center text-xs text-charcoal-400">Loading alerts...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-charcoal-400">
            No notifications matching the selected filter.
          </div>
        ) : (
          filtered.map(n => (
            <div
              key={n.id}
              onClick={() => handleOpenLink(n)}
              className={`p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-aurum-50/50 transition ${
                !n.is_read ? 'bg-amber-50/20' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl mt-0.5 ${
                  n.urgency === 'urgent' ? 'bg-rose-100 text-rose-700' : 'bg-aurum-50 text-aurum-600'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold ${!n.is_read ? 'text-charcoal-900' : 'text-charcoal-700'}`}>
                      {n.title}
                    </h4>
                    {n.urgency === 'urgent' && (
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md">
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 text-right flex-shrink-0 text-xs">
                <span className="text-[11px] text-charcoal-400">
                  {new Date(n.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </span>
                {n.link_url && (
                  <span className="text-[11px] font-semibold text-aurum-700 hover:text-aurum-900 flex items-center gap-1">
                    Open Record <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
