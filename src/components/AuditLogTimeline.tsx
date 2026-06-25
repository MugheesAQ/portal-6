import React from 'react';
import { AuditLog } from '../types';
import { Shield, Eye, Calendar, Terminal, Info } from 'lucide-react';

interface AuditLogTimelineProps {
  logs: AuditLog[];
}

export const AuditLogTimeline: React.FC<AuditLogTimelineProps> = ({ logs }) => {
  return (
    <div id="audit-log-timeline" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#002147] tracking-tight flex items-center gap-2">
            <Shield className="text-[#002147]" size={20} />
            Secure Activity & Access Logs
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Audit history of logins, information modifications, and digital submissions.
          </p>
        </div>
        
        <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500">
          <Terminal size={14} /> IP TRACE: SECURE
        </div>
      </div>

      <div className="bg-amber-50/50 p-4 border border-amber-200 rounded-lg text-xs text-[#002147] flex gap-3 mb-6">
        <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Encryption Auditing Mandate</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            As per Ministry of IT standards, your audit log details are encrypted at-rest and tamper-proof. No administrative officer can clear this history. Report anomalous actions immediately to support.
          </p>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Eye size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="font-semibold text-slate-600">No Activity Logs Registered</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="relative group">
              {/* Timeline marker */}
              <span className="absolute -left-[31px] top-1 bg-white border-2 border-[#002147] w-4 h-4 rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-[#002147] rounded-full"></span>
              </span>

              <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 p-4 rounded-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-[#002147]">{log.action}</h4>
                  <p className="text-xs text-slate-600 mt-1">{log.details}</p>
                </div>

                <div className="flex flex-col sm:items-end font-mono text-[10px] text-slate-400 shrink-0">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                  <span className="mt-1 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold uppercase tracking-wider">
                    IP {log.ipAddress}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
