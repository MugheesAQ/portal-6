import React from 'react';
import { PortalNotification } from '../types';
import { Bell, Check, Trash2, ShieldAlert, Award, FileText, CheckCircle } from 'lucide-react';

interface NotificationDrawerProps {
  notifications: PortalNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClose
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <ShieldAlert size={16} className="text-red-500" />;
      case 'warning':
        return <Award size={16} className="text-amber-500" />;
      case 'success':
        return <CheckCircle size={16} className="text-emerald-500" />;
      default:
        return <FileText size={16} className="text-blue-500" />;
    }
  };

  return (
    <div id="notification-drawer" className="absolute right-0 top-16 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden font-sans">
      <div className="bg-[#002147] text-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={18} />
          <h3 className="text-sm font-bold tracking-tight">System Alerts ({unreadCount})</h3>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:text-white flex items-center gap-1"
          >
            <Check size={12} /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Bell size={32} className="mx-auto text-slate-200 mb-2" />
            <p className="text-xs font-semibold">No notifications available</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 transition-colors flex gap-3 ${notif.read ? 'bg-white' : 'bg-slate-50/70'}`}
            >
              <div className="mt-0.5 shrink-0">
                {getNotificationIcon(notif.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className={`text-xs ${notif.read ? 'text-slate-600 font-medium' : 'text-slate-900 font-bold'}`}>
                    {notif.title}
                  </p>
                  <span className="text-[9px] font-mono text-slate-400 shrink-0">
                    {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">{notif.message}</p>
                
                <div className="flex items-center gap-4 mt-2">
                  {!notif.read && (
                    <button
                      onClick={() => onMarkAsRead(notif.id)}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase"
                    >
                      Read
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteNotification(notif.id)}
                    className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-slate-50 border-t border-slate-100 p-3 text-center">
        <button
          onClick={onClose}
          className="text-xs font-bold text-[#002147] hover:underline"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
