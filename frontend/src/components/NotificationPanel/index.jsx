import React from 'react';
import { Bell, Check, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

export const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleItemClick = (n) => {
    markAsRead(n.id);
    if (n.link_url) {
      navigate(n.link_url);
    }
    onClose();
  };

  return (
    <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-aurum-300 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Panel Header */}
      <div className="px-4 py-3 bg-aurum-50 border-b border-aurum-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-aurum-600" />
          <span className="font-semibold text-charcoal-900 text-sm font-serif">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-aurum-600 hover:text-aurum-800 font-semibold flex items-center gap-1 transition"
          >
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-charcoal-400">
            No notifications at this time.
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleItemClick(n)}
              className={`p-3.5 hover:bg-aurum-50/50 cursor-pointer transition-colors ${
                !n.is_read ? 'bg-amber-50/30' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {n.urgency === 'urgent' ? (
                    <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 animate-ping" />
                  ) : (
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${!n.is_read ? 'bg-aurum-400' : 'bg-transparent'}`} />
                  )}
                  <span className={`text-xs font-semibold ${!n.is_read ? 'text-charcoal-900' : 'text-charcoal-600'}`}>
                    {n.title}
                  </span>
                </div>
                <span className="text-[10px] text-charcoal-400 flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-charcoal-500 mt-1 line-clamp-2 pl-3.5">
                {n.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Footer Link */}
      <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
        <button
          onClick={() => { onClose(); navigate('/notifications'); }}
          className="text-xs font-semibold text-charcoal-700 hover:text-aurum-600 transition"
        >
          View all notifications center →
        </button>
      </div>
    </div>
  );
};
