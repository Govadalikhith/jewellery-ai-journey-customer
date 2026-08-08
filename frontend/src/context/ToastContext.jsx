import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'success', duration = 4000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toast = {
    success: (title, message) => addToast({ title, message, type: 'success' }),
    error: (title, message) => addToast({ title, message, type: 'error', duration: 6000 }),
    warning: (title, message) => addToast({ title, message, type: 'warning' }),
    info: (title, message) => addToast({ title, message, type: 'info' })
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Render Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-luxury-hover border transition-all duration-300 transform translate-y-0 ${
              t.type === 'success' ? 'bg-white border-emerald-500 text-charcoal-800' :
              t.type === 'error' ? 'bg-white border-rose-500 text-charcoal-800' :
              t.type === 'warning' ? 'bg-white border-amber-500 text-charcoal-800' :
              'bg-white border-aurum-400 text-charcoal-800'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />}
            {t.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-aurum-500 flex-shrink-0 mt-0.5" />}
            <div className="flex-1 text-sm">
              {t.title && <div className="font-semibold text-charcoal-900">{t.title}</div>}
              <div className="text-charcoal-600 mt-0.5">{t.message}</div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-charcoal-400 hover:text-charcoal-700 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
