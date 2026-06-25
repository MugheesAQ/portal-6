import React from 'react';
import { OutstandingDue } from '../types';
import { AlertTriangle, CreditCard, Calendar, CheckCircle } from 'lucide-react';

interface DuesAlertBannerProps {
  dues: OutstandingDue[];
  onPayDue: (id: string) => void;
}

export const DuesAlertBanner: React.FC<DuesAlertBannerProps> = ({ dues, onPayDue }) => {
  if (dues.length === 0) return null;

  return (
    <div id="dues-alert-banner" className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-pulse-subtle">
      <div className="flex items-start gap-3">
        <div className="bg-amber-100 p-2.5 rounded-lg border border-amber-300 text-amber-700 mt-0.5">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#002147] tracking-tight">Outstanding Dues & Overdue Fees Detected</h3>
          <p className="text-xs text-slate-600 mt-1">
            You have <strong className="text-amber-800 font-bold">{dues.length} pending obligations</strong> on your national registry. Unpaid items may trigger administrative blocks.
          </p>

          <div className="flex flex-wrap gap-3 mt-3">
            {dues.map((due) => (
              <div key={due.id} className="bg-white border border-amber-200 rounded-lg px-3 py-1.5 flex items-center gap-3 shadow-xs">
                <div>
                  <p className="text-xs font-bold text-slate-800">{due.title}</p>
                  <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Calendar size={10} />
                    Due: {new Date(due.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-100 pl-3">
                  <span className="text-xs font-mono font-bold text-amber-700">{due.amount}</span>
                  <button
                    onClick={() => onPayDue(due.id)}
                    className="bg-[#002147] hover:bg-opacity-90 text-white p-1 rounded transition-colors"
                    title="Pay Online"
                  >
                    <CreditCard size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <span className="text-xs font-mono font-bold text-amber-600 bg-white border border-amber-200 px-2 py-1 rounded">
          STATUS: AUDITED
        </span>
      </div>
    </div>
  );
};
