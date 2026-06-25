import React, { useState, useRef } from 'react';
import { User, Complaint, GovService, OnlineApplication, PortalNotification, AuditLog, OutstandingDue } from '../types';
import { Logo } from './Logo';
import { ServiceDirectory, SERVICES_DATA } from './ServiceDirectory';
import { ApplicationForm } from './ApplicationForm';
import { ProfileManagement } from './ProfileManagement';
import { AuditLogTimeline } from './AuditLogTimeline';
import { DuesAlertBanner } from './DuesAlertBanner';
import { NotificationDrawer } from './NotificationDrawer';
import { 
  Home, 
  BookOpen, 
  PlusCircle, 
  User as UserIcon, 
  History, 
  LogOut, 
  Bell, 
  Search, 
  Globe, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  HelpCircle,
  FileText,
  Mail,
  Smartphone,
  CheckCircle2,
  CreditCard,
  Upload,
  ShieldCheck,
  Building,
  Check
} from 'lucide-react';

interface CitizenPortalProps {
  user: User;
  complaints: Complaint[];
  applications: OnlineApplication[];
  dues: OutstandingDue[];
  notifications: PortalNotification[];
  auditLogs: AuditLog[];
  setApplications: React.Dispatch<React.SetStateAction<OnlineApplication[]>>;
  setDues: React.Dispatch<React.SetStateAction<OutstandingDue[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<PortalNotification[]>>;
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
  onAddComplaint: (complaint: Omit<Complaint, 'id' | 'ticketNumber' | 'date' | 'status'>) => void;
  onLogout: () => void;
  onAddAuditLog: (action: string, details: string) => void;
  onAddNotification: (title: string, message: string, type: 'info' | 'warning' | 'success' | 'alert') => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({ 
  user: initialUser, 
  complaints, 
  applications,
  dues,
  notifications,
  auditLogs,
  setApplications,
  setDues,
  setNotifications,
  setAuditLogs,
  onAddComplaint, 
  onLogout,
  onAddAuditLog,
  onAddNotification
}) => {
  // Navigation & Screen tab states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'directory' | 'apply' | 'complaints' | 'profile' | 'audit'>('dashboard');
  const [selectedService, setSelectedService] = useState<GovService | null>(null);

  // Core User / Avatar profile state
  const [user, setUser] = useState<User>({
    ...initialUser,
    email: initialUser.email || 'ahmed.khan@gov.pk',
    phone: initialUser.phone || '+92 300 1234567',
    address: initialUser.address || 'House 24B, Sector F-7, Islamabad, Pakistan',
    avatarUrl: initialUser.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  });

  // Language state
  const [currentLang, setCurrentLang] = useState<'EN' | 'UR' | 'FR'>('EN');

  // Search input query
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Notifications Drawer visibility
  const [notifOpen, setNotifOpen] = useState(false);

  // Alert Popups (To simulate automated SMS and Email outputs!)
  const [simulationAlert, setSimulationAlert] = useState<{
    type: 'sms' | 'email';
    to: string;
    msg: string;
    show: boolean;
  } | null>(null);

  // New Grievance complaint inputs
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('Infrastructure');
  const [complaintDesc, setComplaintDesc] = useState('');

  // Payment receipt modal state
  const [payingDue, setPayingDue] = useState<OutstandingDue | null>(null);
  const [receiptNo, setReceiptNo] = useState('');
  const [bankName, setBankName] = useState('National Bank of Pakistan');
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptNote, setReceiptNote] = useState('');
  const [receiptFile, setReceiptFile] = useState<{ name: string; size: string; url?: string } | null>(null);
  const [receiptError, setReceiptError] = useState('');
  const receiptFileInputRef = useRef<HTMLInputElement>(null);

  const triggerSimulationAlert = (type: 'sms' | 'email', to: string, msg: string) => {
    setSimulationAlert({ type, to, msg, show: true });
    setTimeout(() => {
      setSimulationAlert(prev => prev ? { ...prev, show: false } : null);
    }, 6000);
  };

  const handleUpdateProfile = (updatedFields: Partial<User>) => {
    setUser(current => ({ ...current, ...updatedFields }));
  };

  const handleSelectService = (service: GovService) => {
    setSelectedService(service);
    setActiveTab('apply');
  };

  const handleApplicationSubmit = (
    rawApp: Omit<OnlineApplication, 'id' | 'dateCreated' | 'dateUpdated'>, 
    isSubmit: boolean
  ) => {
    const actionLabel = isSubmit ? 'Application Submitted' : 'Application Saved as Draft';
    const detailLabel = isSubmit 
      ? `Successfully submitted online request for ${rawApp.serviceTitle}`
      : `Saved progress draft for ${rawApp.serviceTitle}`;

    const newApp: OnlineApplication = {
      ...rawApp,
      id: `app-${Math.floor(1000 + Math.random() * 9000)}`,
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString()
    };

    setApplications(prev => [newApp, ...prev]);
    onAddAuditLog(actionLabel, detailLabel);
    
    onAddNotification(
      actionLabel, 
      `${rawApp.serviceTitle} is now logged as ${newApp.status}. Verification ID: ${newApp.id}`, 
      isSubmit ? 'success' : 'info'
    );

    // Simulated Email & SMS notifications send
    if (isSubmit) {
      if (user.email) {
        triggerSimulationAlert(
          'email', 
          user.email, 
          `Dear Citizen, your application for ${rawApp.serviceTitle} has been registered successfully. Ref ID: ${newApp.id}. View progress inside National Portal.`
        );
      }
      if (user.phone) {
        setTimeout(() => {
          triggerSimulationAlert(
            'sms', 
            user.phone || '', 
            `GovPortal: Service ${rawApp.serviceTitle} requested. Ticket ID: ${newApp.id}. Status: Under Review.`
          );
        }, 3000);
      }
    }

    setSelectedService(null);
    setActiveTab('dashboard');
  };

  // Triggered when clicking Pay button
  const handleOpenPaymentModal = (dueId: string) => {
    const targetDue = dues.find(d => d.id === dueId);
    if (targetDue) {
      setPayingDue(targetDue);
      // Auto generate a mock Challan Number
      setReceiptNo(`CHL-${Math.floor(100000 + Math.random() * 900000)}-PK`);
      setReceiptNote('');
      setReceiptFile(null);
      setReceiptError('');
    }
  };

  // Handle uploading simulated payment slip
  const handleReceiptFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      setReceiptError('Invalid file type. Only JPG, PNG, and PDF receipt copies are accepted.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        url: reader.result as string
      });
    };
    reader.readAsDataURL(file);
    setReceiptError('');
  };

  // Submitting the payment receipt
  const handleSubmitReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingDue) return;

    if (!receiptNo.trim()) {
      setReceiptError('Please enter a valid receipt / Challan reference number.');
      return;
    }

    if (!receiptFile) {
      setReceiptError('Uploading a copy of the stamped Bank Challan receipt is mandatory to submit.');
      return;
    }

    // Update the outstanding due status in parent state
    setDues(prev => prev.map(d => {
      if (d.id === payingDue.id) {
        return {
          ...d,
          status: 'Pending Verification',
          receiptNo: receiptNo,
          receiptDate: receiptDate,
          paidByCnic: user.cnic,
          paidByName: user.name,
          receiptNote: `${bankName} deposit. ${receiptNote}`,
          receiptFileName: receiptFile?.name || 'CHALLAN_RECEIPT_STAMPED.PDF',
          receiptFileSize: receiptFile?.size || '841.5 KB',
          receiptFileUrl: receiptFile?.url
        };
      }
      return d;
    }));

    onAddAuditLog('Receipt Submitted', `Submitted deposit receipt ${receiptNo} for ${payingDue.title} (${payingDue.amount})`);
    
    onAddNotification(
      'Receipt Logged for Audit', 
      `Payment receipt ${receiptNo} for ${payingDue.amount} is registered. Awaiting manual review by verifying officer.`, 
      'info'
    );

    if (user.phone) {
      triggerSimulationAlert(
        'sms', 
        user.phone, 
        `GovPortal Alert: Deposit receipt ${receiptNo} received. Status: Awaiting Verification. Outstanding penalties held.`
      );
    }

    setPayingDue(null);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintTitle.trim() || !complaintDesc.trim()) return;

    onAddComplaint({
      title: complaintTitle,
      category: complaintCategory,
      description: complaintDesc
    });

    const ticket = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    onAddAuditLog('Grievance Logged', `Logged official ticket ${ticket}: ${complaintTitle}`);
    
    onAddNotification(
      'Complaint Ticket Generated', 
      `Ticket ${ticket} successfully dispatched to relevant Ministry department.`, 
      'warning'
    );

    if (user.phone) {
      triggerSimulationAlert(
        'sms', 
        user.phone, 
        `GovPortal Alert: Grievance logged. Ticket No: ${ticket}. Track progress in dashboard.`
      );
    }

    setComplaintTitle('');
    setComplaintDesc('');
    setActiveTab('dashboard');
  };

  // Only list unpaid dues in the outstanding banner
  const unpaidDues = dues.filter(d => d.status === 'Unpaid');
  const pendingReceipts = dues.filter(d => d.status === 'Pending Verification');
  const paidDues = dues.filter(d => d.status === 'Paid');

  const filteredSearchServices = SERVICES_DATA.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render Breadcrumbs dynamically
  const renderBreadcrumbs = () => {
    return (
      <nav id="breadcrumb-trail" className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-6 bg-slate-50 py-2.5 px-4 rounded-lg border border-slate-200">
        <button onClick={() => { setActiveTab('dashboard'); setSelectedService(null); }} className="hover:text-[#002147] transition-all">Home</button>
        <ChevronRight size={10} />
        {activeTab === 'dashboard' && <span className="text-slate-600">Dashboard Portal</span>}
        {activeTab === 'directory' && <span className="text-slate-600">Government Services</span>}
        {activeTab === 'apply' && (
          <>
            <button onClick={() => setActiveTab('directory')} className="hover:text-[#002147] transition-all">Services</button>
            <ChevronRight size={10} />
            <span className="text-slate-600 font-semibold">{selectedService?.title} Application</span>
          </>
        )}
        {activeTab === 'complaints' && <span className="text-slate-600">Grievance Cell</span>}
        {activeTab === 'profile' && <span className="text-slate-600">Profile Settings</span>}
        {activeTab === 'audit' && <span className="text-slate-600">Security Timeline</span>}
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-x-hidden relative">
      
      {/* Simulation SMS/Email Popups */}
      {simulationAlert && simulationAlert.show && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-xl shadow-2xl border-2 border-[#ffd700] p-4 animate-bounce-subtle">
          <div className="flex items-start gap-3">
            {simulationAlert.type === 'sms' ? (
              <Smartphone className="text-amber-400 shrink-0 mt-0.5" size={20} />
            ) : (
              <Mail className="text-emerald-400 shrink-0 mt-0.5" size={20} />
            )}
            <div className="flex-1">
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
                {simulationAlert.type === 'sms' ? `SMS Alert to: ${simulationAlert.to}` : `Email Alert to: ${simulationAlert.to}`}
              </span>
              <p className="text-xs text-slate-200 mt-1 font-mono leading-relaxed">{simulationAlert.msg}</p>
            </div>
          </div>
        </div>
      )}

      {/* STICKY HEADER (Must-have top navigation bar) */}
      <header className="w-full h-20 px-4 md:px-12 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-40 shadow-sm shrink-0">
        <Logo withText={true} className="cursor-pointer" onClick={() => { setActiveTab('dashboard'); setSelectedService(null); }} />

        {/* Global Government Search with suggestions */}
        <div className="relative hidden md:block w-72 lg:w-96">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search services or departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full h-10 pl-10 pr-4 border border-slate-200 rounded-lg bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#002147] transition-all"
            />
          </div>

          {searchFocused && searchQuery.trim() !== '' && (
            <div className="absolute top-11 left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto p-2 z-50">
              <p className="text-[9px] font-bold uppercase text-slate-400 px-2 py-1 tracking-wider">Services Suggestions</p>
              {filteredSearchServices.length === 0 ? (
                <p className="text-xs text-slate-500 px-2 py-1.5">No matching services found</p>
              ) : (
                filteredSearchServices.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectService(s)}
                    className="w-full text-left px-2 py-1.5 rounded-md hover:bg-slate-50 text-xs text-slate-800 font-bold transition-all block truncate"
                  >
                    {s.title}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-4 relative">
          
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2 py-1 text-xs bg-slate-50 font-bold text-slate-600">
            <Globe size={14} />
            <select 
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="EN">EN</option>
              <option value="UR">UR</option>
              <option value="FR">FR</option>
            </select>
          </div>

          {/* Unread Alerts Bell Icon */}
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2.5 hover:bg-slate-50 border border-slate-200 rounded-lg relative transition-colors text-[#002147]"
            title="Notifications"
          >
            <Bell size={18} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          {/* Notification Drawer Component */}
          {notifOpen && (
            <NotificationDrawer
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onDeleteNotification={handleDeleteNotification}
              onClose={() => setNotifOpen(false)}
            />
          )}

          {/* Profile Menu Mini View */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <button 
              onClick={() => setActiveTab('profile')}
              className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 hover:border-[#002147] transition-all"
            >
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            </button>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-mono leading-none mt-1">{user.cnic}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid structure */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 gap-8">
        
        {/* Navigation Rail / Sidebar */}
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm sticky top-24">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 px-3 py-2">National Identity Portal</p>
            
            <nav className="space-y-1">
              <button
                onClick={() => { setActiveTab('dashboard'); setSelectedService(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                  activeTab === 'dashboard' ? 'bg-[#002147] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Home size={16} />
                Dashboard Home
              </button>
              
              <button
                onClick={() => setActiveTab('directory')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                  activeTab === 'directory' ? 'bg-[#002147] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BookOpen size={16} />
                Services Directory
              </button>

              <button
                onClick={() => setActiveTab('complaints')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                  activeTab === 'complaints' ? 'bg-[#002147] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <PlusCircle size={16} />
                Grievance Cell
              </button>

              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 px-3 py-3">Account Security</p>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                  activeTab === 'profile' ? 'bg-[#002147] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UserIcon size={16} />
                Profile & Contacts
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                  activeTab === 'audit' ? 'bg-[#002147] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <History size={16} />
                Activity Timeline
              </button>
            </nav>

            <div className="border-t border-slate-100 mt-6 pt-4 px-3">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider transition-colors"
              >
                <LogOut size={16} />
                Exit Portal
              </button>
            </div>
          </div>
        </aside>

        {/* CENTRAL VIEW AREA */}
        <main className="flex-1 min-w-0">
          
          {/* Breadcrumb Trail */}
          {renderBreadcrumbs()}

          {/* Dues Alert Banner - Only displays unpaid dues */}
          <DuesAlertBanner dues={unpaidDues} onPayDue={handleOpenPaymentModal} />

          {/* Dynamic Render according to selection */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Welcome banner */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#002147]">Good Morning, {user.name}</h2>
                  <p className="text-slate-500 text-xs mt-1.5">Welcome back to the Government Services Portal. Your biographical check status is fully cleared.</p>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveTab('directory')}
                    className="bg-[#002147] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-[#002147]/10 uppercase tracking-wider"
                  >
                    Browse Services
                  </button>
                  <button 
                    onClick={() => setActiveTab('complaints')}
                    className="border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
                  >
                    Log Grievance
                  </button>
                </div>
              </div>

              {/* Submitted Payment Receipts Audit Status */}
              {pendingReceipts.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
                  <h3 className="text-base font-bold text-[#002147] mb-1 flex items-center gap-2">
                    <Clock size={18} className="text-amber-500" />
                    Challan Receipts Awaiting Verification
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">These receipt logs have been submitted to Treasury Audits. Officers are validating stamps.</p>
                  
                  <div className="space-y-4">
                    {pendingReceipts.map(rec => (
                      <div key={rec.id} className="border border-amber-200 bg-amber-50/20 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
                        <div>
                          <p className="font-bold text-[#002147]">{rec.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">CHALLAN: {rec.receiptNo} | SUBMITTED BY CNIC: {rec.paidByCnic}</p>
                          <p className="text-slate-600 mt-1 leading-relaxed">{rec.receiptNote}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          <span className="bg-amber-100 text-amber-800 border border-amber-300 font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-wider animate-pulse">
                            Awaiting Officer Check
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolved / Paid Dues Log */}
              {paidDues.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
                  <h3 className="text-base font-bold text-[#002147] mb-1 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    Verified & Settle Dues
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">Tax and liability audit ledger items settled with official digital authorization signatures.</p>
                  
                  <div className="space-y-4">
                    {paidDues.map(rec => (
                      <div key={rec.id} className="border border-emerald-100 bg-emerald-50/10 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{rec.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">CHALLAN: {rec.receiptNo} | APPROVED BY TREASURY</p>
                          {rec.officerNotes && <p className="text-emerald-700 mt-1 leading-relaxed"><strong>Officer Audit Note:</strong> {rec.officerNotes}</p>}
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-wider flex items-center gap-1">
                            <Check size={12} /> PAID & AUDITED
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Section for Active Applications */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-[#002147]">Track Active Requests</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Real-time verification stages for submitted service petitions.</p>
                  </div>
                  <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[10px] font-mono font-bold text-slate-600 uppercase">
                    MFA Authorized
                  </span>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <FileText size={48} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-600">No active applications currently in progress.</p>
                    <button 
                      onClick={() => setActiveTab('directory')} 
                      className="text-xs text-blue-600 hover:underline mt-2 font-bold block mx-auto"
                    >
                      Start an Application
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {applications.map((app) => (
                      <div key={app.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                          <div>
                            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">Ref ID: {app.id}</span>
                            <h4 className="text-sm font-bold text-[#002147] mt-0.5">{app.serviceTitle}</h4>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-400">Created: {new Date(app.dateCreated).toLocaleDateString()}</span>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                              app.status === 'Draft' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                              'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                        </div>

                        {/* STATUS VISUALIZATION TIMELINE */}
                        <div className="mt-6 px-2">
                          <div className="relative flex justify-between items-center w-full">
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-emerald-500 -z-10 transition-all duration-500" style={{
                              width: app.status === 'Approved' ? '100%' : app.status === 'Under Review' ? '50%' : '0%'
                            }}></div>

                            {/* Node 1: Submitted */}
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                app.status !== 'Draft' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 border-slate-300'
                              }`}>
                                <CheckCircle size={14} />
                              </div>
                              <span className="text-[9px] font-bold text-slate-500 uppercase mt-2">Submitted</span>
                            </div>

                            {/* Node 2: Under Review */}
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                app.status === 'Under Review' || app.status === 'Approved'
                                  ? 'bg-emerald-500 text-white border-emerald-500'
                                  : 'bg-white text-slate-400 border-slate-300'
                              }`}>
                                <Clock size={14} />
                              </div>
                              <span className="text-[9px] font-bold text-slate-500 uppercase mt-2">Under Review</span>
                            </div>

                            {/* Node 3: Approved / Settle status */}
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                app.status === 'Approved'
                                  ? 'bg-emerald-500 text-white border-emerald-500'
                                  : 'bg-white text-slate-400 border-slate-300'
                              }`}>
                                <CheckCircle2 size={14} />
                              </div>
                              <span className="text-[9px] font-bold text-slate-500 uppercase mt-2">Approved</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Citizen Resource Quick links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-[#002147] mb-3 flex items-center gap-1.5">
                    <HelpCircle size={16} className="text-[#002147]" /> Government Support & FAQs
                  </h3>
                  <div className="space-y-3">
                    <div className="border-b border-slate-100 pb-2">
                      <p className="text-xs font-bold text-slate-700">What are the Smart CNIC requirements?</p>
                      <p className="text-[11px] text-slate-500 mt-1">Please refer to identity documents page or upload expired CNIC copy base.</p>
                    </div>
                    <div className="border-b border-slate-100 pb-2">
                      <p className="text-xs font-bold text-slate-700">How do I trace my driving permit test?</p>
                      <p className="text-[11px] text-slate-500 mt-1">Schedule requests are managed inside standard Licensing department tab logs.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#002147] mb-2">Electronic Public Grievance Desk</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                      File formal complaints, requests, and feedback directly to ministry public relations cell. Get automatic system tracking tickets.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('complaints')}
                    className="w-full bg-[#002147] hover:bg-opacity-95 text-white py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all"
                  >
                    Launch Complaint Cell
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'directory' && (
            <ServiceDirectory onSelectService={handleSelectService} />
          )}

          {activeTab === 'apply' && selectedService && (
            <ApplicationForm 
              service={selectedService}
              citizenCnic={user.cnic}
              citizenName={user.name}
              onCancel={() => { setSelectedService(null); setActiveTab('directory'); }}
              onSubmit={handleApplicationSubmit}
            />
          )}

          {activeTab === 'complaints' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 max-w-2xl mx-auto">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-[#002147] tracking-tight">Public Grievance Resolution Desk</h2>
                <p className="text-xs text-slate-500 mt-1">Log issues on urban infrastructure, sanitation, utilities, or safety. A tracking ticket is generated.</p>
              </div>

              <form onSubmit={handleGrievanceSubmit} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Grievance Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Broken water pipe near sector park"
                    value={complaintTitle}
                    onChange={(e) => setComplaintTitle(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002147] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Department Division</label>
                  <select
                    value={complaintCategory}
                    onChange={(e) => setComplaintCategory(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none text-sm cursor-pointer"
                  >
                    <option>Infrastructure</option>
                    <option>Sanitation</option>
                    <option>Security</option>
                    <option>Public Transport</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Detailed Narrative Statement</label>
                  <textarea
                    required
                    placeholder="Provide exact coordinates, times, and descriptive explanation..."
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    className="w-full h-28 p-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002147] text-sm resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#002147] hover:bg-opacity-95 text-white px-6 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all shadow-md shadow-[#002147]/10"
                  >
                    Log Ticket
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'profile' && (
            <ProfileManagement 
              user={user}
              onUpdateProfile={handleUpdateProfile}
              onAddAuditLog={onAddAuditLog}
            />
          )}

          {activeTab === 'audit' && (
            <AuditLogTimeline logs={auditLogs} />
          )}

        </main>
      </div>

      {/* CHALLAN / RECEIPT SUBMISSION DIALOG */}
      {payingDue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden font-sans animate-scale-up">
            <div className="bg-[#002147] text-white p-6 shrink-0">
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-300">National Secure Payment Gateway</span>
              <h3 className="text-lg font-bold mt-1">Submit Deposit Receipt (Challan)</h3>
              <p className="text-xs text-slate-300 mt-1">Declare your deposit to clear <strong>{payingDue.title}</strong></p>
            </div>

            <form onSubmit={handleSubmitReceipt} className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
              {receiptError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs font-bold flex items-center gap-1.5">
                  <AlertCircle size={16} />
                  {receiptError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Obligation Fee</label>
                  <input
                    type="text"
                    disabled
                    value={payingDue.amount}
                    className="w-full h-10 px-3 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-sm font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Challan / Ref No.</label>
                  <input
                    type="text"
                    required
                    value={receiptNo}
                    onChange={(e) => setReceiptNo(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm font-mono font-bold focus:ring-2 focus:ring-[#002147] focus:outline-none bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Receiving Bank/Channel</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:ring-2 focus:ring-[#002147] focus:outline-none cursor-pointer"
                >
                  <option value="National Bank of Pakistan (NBP)">National Bank of Pakistan (NBP)</option>
                  <option value="State Bank of Pakistan (SBP)">State Bank of Pakistan (SBP)</option>
                  <option value="Habib Bank Limited (HBL)">Habib Bank Limited (HBL)</option>
                  <option value="Allied Bank (ABL)">Allied Bank (ABL)</option>
                  <option value="Gov Online Gateway Portal">Gov Online Gateway Portal</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Payment</label>
                <input
                  type="date"
                  required
                  value={receiptDate}
                  onChange={(e) => setReceiptDate(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:ring-2 focus:ring-[#002147] focus:outline-none"
                />
              </div>

              {/* Receipt File Upload */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Upload Receipt Slip Copy</label>
                <div 
                  onClick={() => receiptFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100/50 p-4 rounded-lg text-center cursor-pointer transition-colors"
                >
                  <Upload size={20} className="mx-auto text-slate-400 mb-1" />
                  {receiptFile ? (
                    <p className="text-xs font-bold text-emerald-600">{receiptFile.name} ({receiptFile.size})</p>
                  ) : (
                    <p className="text-[10px] text-slate-500">Click to upload deposit slip JPG/PDF copy (Max 3MB)</p>
                  )}
                  <input
                    type="file"
                    ref={receiptFileInputRef}
                    onChange={(e) => handleReceiptFileChange(e.target.files)}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Additional Transaction Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="E.g., paid via mobile branch transfer"
                  value={receiptNote}
                  onChange={(e) => setReceiptNote(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:ring-2 focus:ring-[#002147] focus:outline-none"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[9px] text-slate-500 leading-relaxed">
                  The deposit reference will be matched with official bank logs within 24 hours. Under Pakistan Penal Code, fraudulent receipt uploads are prosecutable.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayingDue(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#002147] hover:bg-opacity-95 text-white px-5 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-md shadow-[#002147]/15"
                >
                  Verify & Submit <Check size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer component */}
      <footer className="w-full h-12 px-6 md:px-12 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-widest font-medium bg-white shrink-0 mt-12">
        <div className="hidden sm:block">Ministry of Information Technology & Telecommunication</div>
        <div className="sm:hidden">&copy; 2026 Gov Portal</div>
        <div className="flex gap-4 md:gap-8">
          <a href="#" className="hover:text-[#002147] transition-colors">Security</a>
          <a href="#" className="hover:text-[#002147] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#002147] transition-colors hidden sm:block">Support</a>
        </div>
      </footer>
    </div>
  );
};
