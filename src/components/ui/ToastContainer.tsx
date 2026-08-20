import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        let icon = <Info className="w-5 h-5 text-accent-blue" />;
        let borderClass = 'border-hairline';
        let bgClass = 'bg-surface-card';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-brand-forest" />;
          borderClass = 'border-brand-mint/40';
          bgClass = 'bg-surface-subtle';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-accent-amber" />;
          borderClass = 'border-accent-amber/40';
          bgClass = 'bg-accent-amber-soft/50';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-accent-red" />;
          borderClass = 'border-accent-red/40';
          bgClass = 'bg-accent-red-soft/50';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-md border ${borderClass} ${bgClass} shadow-lift transition-all animate-in fade-in slide-in-from-bottom-3 duration-200`}
          >
            <div className="flex-shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-ink">{toast.title}</h4>
              <p className="text-xs text-body mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-mute hover:text-ink transition-colors p-1 rounded-sm"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
