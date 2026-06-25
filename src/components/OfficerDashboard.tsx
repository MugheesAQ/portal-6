import React, { useState, useEffect } from 'react';
import { User, Complaint, OnlineApplication, OutstandingDue, AuditLog, ClusterMetric } from '../types';
import { Logo } from './Logo';
import { 
  LogOut, 
  LayoutDashboard, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Server, 
  Database, 
  ShieldAlert, 
  FileText, 
  Check, 
  X, 
  CreditCard, 
  Search, 
  Terminal, 
  Smartphone, 
  Mail, 
  Briefcase, 
  Shield, 
  Eye, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface OfficerDashboardProps {
  user: User;
  complaints: Complaint[];
  applications: OnlineApplication[];
  dues: OutstandingDue[];
  auditLogs: AuditLog[];
  onLogout: () => void;
  onUpdateStatus: (id: string, newStatus: 'Pending' | 'In Progress' | 'Resolved', officerNotes?: string) => void;
  onUpdateApplicationStatus: (id: string, newStatus: 'Approved' | 'Rejected' | 'Under Review', officerNotes?: string) => void;
  setDues: React.Dispatch<React.SetStateAction<OutstandingDue[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
  onAddAuditLog: (action: string, details: string) => void;
  onAddNotification: (title: string, message: string, type: 'info' | 'warning' | 'success' | 'alert') => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({ 
  user, 
  complaints, 
  applications,
  dues,
  auditLogs,
  onLogout, 
  onUpdateStatus,
  onUpdateApplicationStatus,
  setDues,
  setNotifications,
  setAuditLogs,
  onAddAuditLog,
  onAddNotification
}) => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'applications' | 'payments' | 'complaints' | 'registry'>('monitoring');
  const [metrics, setMetrics] = useState<ClusterMetric[]>([]);
  
  // Simulated logs in DevOps terminal
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Initializing GovOps telemetry agent...',
    'Connecting Prometheus cluster at: http://prometheus-prod.internal:9090',
    'ArgoCD sync completed: 4 services synchronized successfully.',
    'Kubernetes API controller: listing pods in [prod-citizen-portal]',
    'Active Ingress traffic routed through Cloud Run proxy port 3000.',
  ]);

  // Selected details modal/panel states
  const [selectedApp, setSelectedApp] = useState<OnlineApplication | null>(null);
  const [selectedDue, setSelectedDue] = useState<OutstandingDue | null>(null);
  const [officerNotesText, setOfficerNotesText] = useState('');
  const [duesNotesError, setDuesNotesError] = useState('');

  // Document Viewer Preview State
  const [previewDoc, setPreviewDoc] = useState<{ name: string; type: string; size: string; url?: string } | null>(null);

  // Status Change Dialog States (Applications)
  const [appPendingStatus, setAppPendingStatus] = useState<{
    app: OnlineApplication;
    nextStatus: 'Approved' | 'Rejected' | 'Under Review';
  } | null>(null);
  const [appStatusReason, setAppStatusReason] = useState('');
  const [appStatusReasonError, setAppStatusReasonError] = useState('');

  // Status Change Dialog States (Grievances/Complaints)
  const [complaintPendingStatus, setComplaintPendingStatus] = useState<{
    id: string;
    title: string;
    nextStatus: 'Pending' | 'In Progress' | 'Resolved';
  } | null>(null);
  const [complaintStatusReason, setComplaintStatusReason] = useState('');
  const [complaintStatusReasonError, setComplaintStatusReasonError] = useState('');
  
  // Citizen Lookup CNIC Search
  const [searchCnic, setSearchCnic] = useState('37405-1234567-9');
  const [searchedCitizen, setSearchedCitizen] = useState<User | null>(null);
  const [citizenDues, setCitizenDues] = useState<OutstandingDue[]>([]);
  const [citizenApps, setCitizenApps] = useState<OnlineApplication[]>([]);
  const [registryError, setRegistryError] = useState('');

  // Scaling replica simulator
  const [gatewayReplicas, setGatewayReplicas] = useState(4);
  const [scalingActive, setScalingActive] = useState(false);

  // Email/SMS popup simulation state
  const [simulationAlert, setSimulationAlert] = useState<{
    type: 'sms' | 'email';
    to: string;
    msg: string;
    show: boolean;
  } | null>(null);

  const triggerSimulationAlert = (type: 'sms' | 'email', to: string, msg: string) => {
    setSimulationAlert({ type, to, msg, show: true });
    setTimeout(() => {
      setSimulationAlert(prev => prev ? { ...prev, show: false } : null);
    }, 6000);
  };

  // Simulate real-time cluster metrics gathering
  useEffect(() => {
    // Generate initial metrics
    const initialData: ClusterMetric[] = Array.from({ length: 20 }, (_, i) => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - (20 - i));
      return {
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cpu: 40 + Math.random() * 30,
        memory: 60 + Math.random() * 20,
        network: 20 + Math.random() * 50
      };
    });
    setMetrics(initialData);

    const interval = setInterval(() => {
      setMetrics(current => {
        const d = new Date();
        const newMetric = {
          time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cpu: 45 + Math.random() * 25,
          memory: 65 + Math.random() * 15,
          network: 30 + Math.random() * 40
        };

        // Add random log to terminal mockup
        const randomLogs = [
          `Ingress HTTP 200 GET /api/health from 110.39.12.148`,
          `Redis cache hits: 98.4% - eviction list empty`,
          `Prometheus scrape successfully accomplished in 42ms`,
          `WAF inspection verified payload integrity on /api/submit-challan`,
          `Biometric matching latency report: 110ms avg`,
          `Autoscaling engine: checked gateway replicas against CPU threshold (62%)`
        ];
        const randomLog = randomLogs[Math.floor(Math.random() * randomLogs.length)];
        setTerminalLogs(logs => [...logs.slice(-15), `[${new Date().toLocaleTimeString()}] ${randomLog}`]);

        return [...current.slice(1), newMetric];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Handle citizen search in database lookup
  const handleRegistrySearch = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistryError('');
    setSearchedCitizen(null);

    // Format query search (strip extra spaces)
    const formattedSearch = searchCnic.trim();
    if (!formattedSearch) return;

    // Simulate search: let's resolve Ahmed Khan or generate a standard citizen based on search query!
    if (formattedSearch.includes('37405-1234567-9') || formattedSearch === 'Ahmed Khan' || formattedSearch.toLowerCase().includes('ahmed')) {
      setSearchedCitizen({
        cnic: '37405-1234567-9',
        name: 'Ahmed Khan',
        role: 'citizen',
        email: 'ahmed.khan@gov.pk',
        phone: '+92 300 1234567',
        address: 'House 24B, Sector F-7, Islamabad, Pakistan',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
      });
      setCitizenDues(dues.filter(d => d.paidByCnic === '37405-1234567-9' || !d.paidByCnic));
      setCitizenApps(applications.filter(a => a.cnic === '37405-1234567-9'));
    } else {
      // Create a fallback dynamically to make the registry feel fully alive & functional!
      setSearchedCitizen({
        cnic: formattedSearch,
        name: 'Zainab Bibi',
        role: 'citizen',
        email: 'zainab.bibi@gov.pk',
        phone: '+92 345 9876543',
        address: 'Appt 301, Askari Apartments, Rawalpindi',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
      });
      setCitizenDues([]);
      setCitizenApps([]);
    }
  };

  // Kubernetes Replica Scaling Simulator
  const handleScaleGateway = () => {
    setScalingActive(true);
    setTerminalLogs(logs => [...logs, `[${new Date().toLocaleTimeString()}] Scaling deployment 'citizen-gateway' replicas to ${gatewayReplicas + 1}...`]);
    setTimeout(() => {
      setGatewayReplicas(prev => prev + 1);
      setScalingActive(false);
      setTerminalLogs(logs => [...logs, `[${new Date().toLocaleTimeString()}] Scaled gateway successfully. New replica count: ${gatewayReplicas + 1}. Pods ready.`]);
    }, 2000);
  };

  // Online Applications Actions
  const handleReviewApp = (app: OnlineApplication, nextStatus: 'Approved' | 'Rejected' | 'Under Review', reason: string) => {
    onUpdateApplicationStatus(app.id, nextStatus, reason);
    onAddAuditLog('Application Status Update', `Updated application ${app.id} (${app.serviceTitle}) status to ${nextStatus}. Reason: ${reason}`);
    
    const messageDetails = nextStatus === 'Approved' 
      ? `Congratulations! Your request for ${app.serviceTitle} is APPROVED. Verification ID: ${app.id}. Official documentation is ready. Reason: ${reason}`
      : nextStatus === 'Rejected'
      ? `Urgent Notice: Your request for ${app.serviceTitle} is REJECTED. Reason: ${reason}`
      : `Your application for ${app.serviceTitle} has been moved to ACTIVE Review. Reason: ${reason}`;

    onAddNotification(
      `Application ${nextStatus}`, 
      messageDetails, 
      nextStatus === 'Approved' ? 'success' : nextStatus === 'Rejected' ? 'alert' : 'warning'
    );

    // Trigger Simulation alerts
    if (app.formData.email) {
      triggerSimulationAlert(
        'email', 
        app.formData.email, 
        `GovPortal Notification: Reference ${app.id} for ${app.serviceTitle} status changed to [${nextStatus}]. Action logged securely. Reason: ${reason}`
      );
    }
    if (app.formData.phone) {
      setTimeout(() => {
        triggerSimulationAlert(
          'sms', 
          app.formData.phone, 
          `GovPortal Alert: App ID ${app.id} is ${nextStatus}. Reason: ${reason}`
        );
      }, 3000);
    }

    // Refresh selectedApp in details view
    setSelectedApp(current => current ? { ...current, status: nextStatus, officerNotes: reason } : null);
  };

  // Payment Verification Actions (Verify Challan Receipts)
  const handleVerifyPayment = (dueId: string, isApprove: boolean) => {
    if (!officerNotesText.trim()) {
      setDuesNotesError('Auditor notes / reason description is mandatory before changing payment status.');
      return;
    }
    setDuesNotesError('');
    const targetDue = dues.find(d => d.id === dueId);
    if (!targetDue) return;

    if (isApprove) {
      // Set status to PAID
      setDues(prev => prev.map(d => {
        if (d.id === dueId) {
          return {
            ...d,
            status: 'Paid',
            officerNotes: officerNotesText || 'Sufficient payment stamp and Bank clearance confirmed by Treasury.'
          };
        }
        return d;
      }));

      onAddAuditLog('Payment Verified', `Approved Challan receipt ${targetDue.receiptNo} for ${targetDue.title} (${targetDue.amount})`);
      onAddNotification(
        'Challan Payment Settle', 
        `Payment of ${targetDue.amount} for ${targetDue.title} was approved. Penalty obligation cleared. Ref: ${targetDue.receiptNo}`, 
        'success'
      );

      // Simulated Alert
      if (targetDue.paidByCnic) {
        triggerSimulationAlert(
          'sms', 
          '+92 300 1234567', // Fallback or citizen phone
          `GovPortal Settle: Your deposit Challan ${targetDue.receiptNo} has been APPROVED by Officer Audit. Obligation cleared.`
        );
      }
    } else {
      // Reject and send back to UNPAID with Officer notes
      setDues(prev => prev.map(d => {
        if (d.id === dueId) {
          return {
            ...d,
            status: 'Unpaid',
            receiptNo: undefined,
            receiptDate: undefined,
            receiptNote: undefined,
            officerNotes: officerNotesText || 'Deposit slip unreadable or transaction match failed. Please re-upload.'
          };
        }
        return d;
      }));

      onAddAuditLog('Payment Rejected', `Rejected Challan receipt ${targetDue.receiptNo} for ${targetDue.title} (${targetDue.amount})`);
      onAddNotification(
        'Challan Payment REJECTED', 
        `Challan receipt ${targetDue.receiptNo} was REJECTED. Outstanding liability remains active. Note: ${officerNotesText || 'Unreadable stamp'}`, 
        'alert'
      );

      // Simulated Alert
      triggerSimulationAlert(
        'sms', 
        '+92 300 1234567', 
        `GovPortal Alert: Challan ${targetDue.receiptNo} REJECTED by Auditing Officer. Please re-check bank deposit stamp and re-upload.`
      );
    }

    setOfficerNotesText('');
    setDuesNotesError('');
    setSelectedDue(null);
  };

  // Pending verification receipts queue length
  const pendingReceiptsCount = dues.filter(d => d.status === 'Pending Verification').length;
  const activeApplicationsCount = applications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      
      {/* Simulation SMS/Email Popups */}
      {simulationAlert && simulationAlert.show && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-white text-slate-900 rounded-xl shadow-2xl border-2 border-amber-500 p-4 animate-bounce-subtle">
          <div className="flex items-start gap-3">
            {simulationAlert.type === 'sms' ? (
              <Smartphone className="text-[#002147] shrink-0 mt-0.5" size={20} />
            ) : (
              <Mail className="text-emerald-600 shrink-0 mt-0.5" size={20} />
            )}
            <div className="flex-1">
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
                {simulationAlert.type === 'sms' ? `Simulating SMS dispatcher...` : `Simulating Electronic Mail...`}
              </span>
              <p className="text-xs text-slate-800 mt-1 font-mono leading-relaxed">{simulationAlert.msg}</p>
            </div>
          </div>
        </div>
      )}

      {/* Officer Header (Matching Citizen Navy Theme) */}
      <header className="w-full bg-[#002147] px-6 py-4 border-b border-[#002147] flex justify-between items-center shadow-md shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-white p-1 rounded-md">
            <Logo className="scale-75 origin-left" withText={false} />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">National Secure Command Center</h1>
            <p className="text-slate-300 text-xs">Biometric Sync v4.2 & Treasury Auditing Engine Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-green-400 font-mono font-bold">SYSTEM ACTIVE</span>
          </div>
          <div className="text-right border-l border-white/20 pl-6">
            <p className="text-sm font-bold text-white">{user.name}</p>
            <p className="text-[10px] text-amber-300 font-mono font-bold tracking-widest uppercase">Rank: {user.role}</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors border border-white/20"
            title="Exit Admin Console"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Officer Sidebar (Matching Citizen Theme) */}
        <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-1 shrink-0 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-3">Infrastructure Monitoring</p>
          
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
              activeTab === 'monitoring' ? 'bg-[#002147] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Activity size={16} />
              Kubernetes Metrics
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${activeTab === 'monitoring' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'}`}>
              LIVE
            </span>
          </button>

          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-5 mb-2 px-3">Verification Desks</p>

          <button
            onClick={() => { setActiveTab('applications'); setSelectedApp(null); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
              activeTab === 'applications' ? 'bg-[#002147] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FileText size={16} />
              Verify Applications
            </span>
            {activeApplicationsCount > 0 && (
              <span className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'applications' ? 'bg-white text-[#002147]' : 'bg-amber-500 text-white'}`}>
                {activeApplicationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('payments'); setSelectedDue(null); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
              activeTab === 'payments' ? 'bg-[#002147] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <CreditCard size={16} />
              Verify Dues & Challans
            </span>
            {pendingReceiptsCount > 0 && (
              <span className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'payments' ? 'bg-white text-[#002147]' : 'bg-red-500 text-white animate-pulse'}`}>
                {pendingReceiptsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
              activeTab === 'complaints' ? 'bg-[#002147] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <LayoutDashboard size={16} />
              Citizen Grievances
            </span>
          </button>

          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-5 mb-2 px-3">Lookup Tools</p>

          <button
            onClick={() => { setActiveTab('registry'); setSearchedCitizen(null); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
              activeTab === 'registry' ? 'bg-[#002147] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Search size={16} />
            National Registry Lookup
          </button>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          
          {/* TAB 1: KUBERNETES MONITORING */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#002147] flex items-center gap-2">
                    <Server className="text-[#002147]" />
                    Kubernetes Infrastructure Analytics
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Telemetry scrapers actively parsing Prometheus metric matrices.</p>
                </div>
                <div className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold shadow-sm">
                  Namespace: prod-citizen-portal
                </div>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-bold mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500" /> API Gateway
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-bold text-slate-800">{gatewayReplicas}/{gatewayReplicas}</div>
                    <button 
                      onClick={handleScaleGateway}
                      disabled={scalingActive}
                      className="bg-[#002147]/5 hover:bg-[#002147]/10 text-[#002147] text-[10px] font-bold uppercase px-2 py-1 rounded-md transition-colors disabled:opacity-50 border border-[#002147]/10 cursor-pointer"
                    >
                      {scalingActive ? 'Scaling...' : '+ Scale'}
                    </button>
                  </div>
                  <div className="text-[11px] text-emerald-600 mt-1 font-semibold">Healthy Pod Replicas</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-bold mb-1.5 flex items-center gap-1.5">
                    <Database size={12} className="text-[#002147]" /> PostgreSQL Node
                  </div>
                  <div className="text-2xl font-bold text-slate-800">1/1</div>
                  <div className="text-[11px] text-emerald-600 mt-1 font-semibold">Primary Active Master</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-bold mb-1.5 flex items-center gap-1.5">
                    <Database size={12} className="text-indigo-500" /> Redis Cluster Cache
                  </div>
                  <div className="text-2xl font-bold text-slate-800">3/3 Nodes</div>
                  <div className="text-[11px] text-emerald-600 mt-1 font-semibold">Mirror Shards Sync OK</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-bold mb-1.5 flex items-center gap-1.5">
                    <ShieldAlert size={12} className="text-amber-500" /> Secure WAF Blocks
                  </div>
                  <div className="text-2xl font-bold text-slate-800">2,492</div>
                  <div className="text-[11px] text-amber-600 mt-1 font-semibold">Dynamic IP filters active</div>
                </div>
              </div>

              {/* Telemetry Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-80">
                  <h3 className="text-xs font-bold text-slate-700 mb-4 uppercase tracking-wider">Cluster CPU Load Utilization (%)</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={metrics} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#002147" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#002147" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickMargin={10} />
                      <YAxis stroke="#64748b" fontSize={9} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', fontSize: '11px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#002147' }}
                      />
                      <Area type="monotone" dataKey="cpu" stroke="#002147" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-80">
                  <h3 className="text-xs font-bold text-slate-700 mb-4 uppercase tracking-wider">RAM Memory Allocation (Mbytes)</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={metrics} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickMargin={10} />
                      <YAxis stroke="#64748b" fontSize={9} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', fontSize: '11px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#4f46e5' }}
                      />
                      <Line type="monotone" dataKey="memory" stroke="#4f46e5" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* DevOps Live Pod Logs Terminal Mockup */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Terminal size={12} className="text-[#38bdf8]" />
                    Container Live Console Stack (kubectl logs -f)
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-4 font-mono text-[10px] text-green-400 space-y-1 h-44 overflow-y-auto leading-normal">
                  {terminalLogs.map((log, idx) => (
                    <p key={idx}>{log}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERIFY SUBMITTED APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#002147] flex items-center gap-2">
                  <Briefcase className="text-[#002147]" /> Verify Multi-Step Digital Applications
                </h2>
                <p className="text-xs text-slate-500 mt-1">Audit citizen bio-profiles, uploaded legal certificates, and trigger automated MFA approvals.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Apps list */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl overflow-hidden p-4 space-y-3 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1 border-b border-slate-100 pb-2">Submitted List ({applications.length})</h3>
                  {applications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">No applications registered on the system yet.</p>
                  ) : (
                    applications.map(app => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className={`w-full text-left p-3 rounded-lg border transition-all block cursor-pointer ${
                          selectedApp?.id === app.id 
                            ? 'bg-[#002147]/5 border-[#002147] ring-1 ring-[#002147]/30' 
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-slate-400">Ref ID: {app.id}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                            app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/10' :
                            app.status === 'Rejected' ? 'bg-red-500/10 text-red-700 border border-red-500/10' :
                            'bg-amber-500/10 text-amber-700 border border-amber-500/10 animate-pulse'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 mt-1 truncate">{app.serviceTitle}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">Applicant: {app.applicantName}</p>
                      </button>
                    ))
                  )}
                </div>

                {/* Selected Application Details */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedApp ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Service Verification Form Desk</span>
                          <h3 className="text-lg font-bold text-[#002147] mt-0.5">{selectedApp.serviceTitle}</h3>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setAppPendingStatus({ app: selectedApp, nextStatus: 'Approved' });
                              setAppStatusReason('');
                              setAppStatusReasonError('');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            onClick={() => {
                              setAppPendingStatus({ app: selectedApp, nextStatus: 'Rejected' });
                              setAppStatusReason('');
                              setAppStatusReasonError('');
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                          >
                            <X size={14} /> Reject
                          </button>
                          <button
                            onClick={() => {
                              setAppPendingStatus({ app: selectedApp, nextStatus: 'Under Review' });
                              setAppStatusReason('');
                              setAppStatusReasonError('');
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-sm transition-colors"
                          >
                            Set Under Review
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs bg-slate-50/50 p-5 rounded-xl border border-slate-200">
                        <div>
                          <p className="text-[9px] font-bold uppercase text-slate-400">Legal Full Name</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedApp.formData.fullName}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase text-slate-400">Guardian / Father Name</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedApp.formData.fatherName}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase text-slate-400">Date of Birth</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedApp.formData.dob}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase text-slate-400">CNIC Number</p>
                          <p className="text-sm font-bold text-[#002147] mt-0.5 font-mono">{selectedApp.cnic}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase text-slate-400">Contact Phone</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedApp.formData.phone}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase text-slate-400">Contact Email</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedApp.formData.email}</p>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <p className="text-[9px] font-bold uppercase text-slate-400">Current Residential Address</p>
                          <p className="text-slate-700 mt-1 leading-relaxed font-semibold">{selectedApp.formData.address}</p>
                        </div>
                        {selectedApp.formData.additionalDetails && (
                          <div className="col-span-1 md:col-span-2 border-t border-slate-200 pt-3">
                            <p className="text-[9px] font-bold uppercase text-slate-400">Applicant Case Remarks</p>
                            <p className="text-slate-600 mt-1 leading-relaxed font-semibold italic">"{selectedApp.formData.additionalDetails}"</p>
                          </div>
                        )}
                      </div>

                      {/* Document list */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Uploaded Verification Documents ({selectedApp.uploadedDocuments.length})</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {selectedApp.uploadedDocuments.map((doc, idx) => (
                             <div 
                               key={idx} 
                               onClick={() => setPreviewDoc({
                                 name: doc.name,
                                 type: doc.type,
                                 size: doc.size,
                                 url: doc.previewUrl
                                })}
                               className="border border-slate-200 bg-slate-50/50 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 hover:border-[#002147]/40 transition-all"
                             >
                               <div className="flex items-center gap-3">
                                 <div className="p-2 bg-[#002147]/5 rounded text-[#002147] border border-slate-200">
                                   <FileText size={16} />
                                 </div>
                                 <div className="min-w-0">
                                   <p className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{doc.name}</p>
                                   <p className="text-[9px] text-slate-500 font-mono uppercase">{doc.type} • {doc.size}</p>
                                 </div>
                               </div>
                               <span className="text-[9px] bg-[#002147]/10 text-[#002147] hover:bg-[#002147]/20 border border-[#002147]/10 px-2.5 py-1 rounded font-bold uppercase font-mono">
                                 View & Verify
                               </span>
                             </div>
                           ))}
                        </div>
                      </div>

                      {/* Affidavit stamp */}
                      <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg flex items-start gap-3 text-xs">
                        <Shield className="text-[#002147] shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="font-bold text-[#002147]">Biometric Encryption Seal Verified</p>
                          <p className="text-slate-500 text-[10px] mt-0.5 leading-relaxed">
                            Form matching hashes verified by NADRA biometric lookup servers. Legal accountability and audit logs actively bind this submission.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-sm">
                      <Eye size={48} className="mx-auto text-slate-400 mb-3" />
                      <h4 className="font-bold text-slate-700">Select an application from the list to begin audit verification</h4>
                      <p className="text-xs text-slate-500 mt-1">Full profile forms and encrypted documents will render in this secure preview panel.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VERIFY PAYMENT RECEIPTS / CHALLANS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#002147] flex items-center gap-2">
                  <CreditCard className="text-[#002147]" /> Treasury Challan Verification Queue
                </h2>
                <p className="text-xs text-slate-500 mt-1">Audit public deposit Challan receipts, match against outstanding penalties/taxes, and settle obligations.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Receipts list */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl overflow-hidden p-4 space-y-3 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1 border-b border-slate-100 pb-2">Pending Receipts ({dues.filter(d => d.status === 'Pending Verification').length})</h3>
                  {dues.filter(d => d.status === 'Pending Verification').length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">No pending challan verification receipts registered.</p>
                  ) : (
                    dues.filter(d => d.status === 'Pending Verification').map(due => (
                      <button
                        key={due.id}
                        onClick={() => setSelectedDue(due)}
                        className={`w-full text-left p-3 rounded-lg border transition-all block cursor-pointer ${
                          selectedDue?.id === due.id 
                            ? 'bg-[#002147]/5 border-[#002147] ring-1 ring-[#002147]/30' 
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-slate-400">CHALLAN: {due.receiptNo}</span>
                          <span className="bg-amber-500/10 text-amber-700 border border-amber-500/20 font-bold text-[8px] px-1.5 py-0.5 rounded uppercase">
                            PENDING AUDIT
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 mt-1 truncate">{due.title}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-slate-500 font-semibold">Cnic: {due.paidByCnic}</span>
                          <span className="text-xs font-mono font-bold text-[#002147]">{due.amount}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* Selected Receipt Audit Sheet */}
                <div className="lg:col-span-2">
                  {selectedDue ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
                      <div className="border-b border-slate-100 pb-4">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">National Treasury Audit Ledger Form</span>
                        <h3 className="text-lg font-bold text-[#002147] mt-0.5">{selectedDue.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">Matches liability obligation ID #{selectedDue.id}</p>
                      </div>

                      {/* Citizen and Challan details */}
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs bg-slate-50/50 p-5 border border-slate-200 rounded-xl">
                        <div>
                          <p className="text-slate-500 uppercase text-[9px] font-bold tracking-wider">Depositor Full Name</p>
                          <p className="font-bold text-slate-800 mt-0.5">{selectedDue.paidByName || 'Ahmed Khan'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 uppercase text-[9px] font-bold tracking-wider">Depositor CNIC</p>
                          <p className="font-mono font-bold text-[#002147] mt-0.5">{selectedDue.paidByCnic}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 uppercase text-[9px] font-bold tracking-wider">Challan Reference ID</p>
                          <p className="font-mono font-bold text-amber-600 mt-0.5">{selectedDue.receiptNo}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 uppercase text-[9px] font-bold tracking-wider">Payment Channel / Bank</p>
                          <p className="font-semibold text-slate-800 mt-0.5">{selectedDue.receiptNote?.split('. ')[0] || 'National Bank of Pakistan'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 uppercase text-[9px] font-bold tracking-wider">Liability Amount</p>
                          <p className="font-mono font-bold text-emerald-600 mt-0.5 text-sm">{selectedDue.amount}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 uppercase text-[9px] font-bold tracking-wider">Deposit Date</p>
                          <p className="font-semibold text-slate-800 mt-0.5">{new Date(selectedDue.receiptDate || '').toLocaleDateString()}</p>
                        </div>
                        <div className="col-span-2 border-t border-slate-200 pt-3">
                          <p className="text-slate-500 uppercase text-[9px] font-bold tracking-wider">Depositor Remarks / Notes</p>
                          <p className="text-slate-600 mt-0.5 italic">"{selectedDue.receiptNote?.split('. ').slice(1).join('. ') || 'Paid via online application.'}"</p>
                        </div>
                      </div>

                      {/* Uploaded Slip preview */}
                      <div className="border border-slate-200 rounded-xl bg-slate-50/50 p-4">
                        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                          <FileText size={12} className="text-[#002147]" />
                          Attached Bank Challan Scan Copy
                        </p>
                        <div 
                          onClick={() => setPreviewDoc({
                            name: selectedDue.receiptFileName || 'CHALLAN_RECEIPT_STAMPED.PDF',
                            type: (selectedDue.receiptFileName?.split('.').pop() || 'PDF').toUpperCase(),
                            size: selectedDue.receiptFileSize || '841.5 KB',
                            url: selectedDue.receiptFileUrl
                          })}
                          className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 hover:border-[#002147]/40 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#002147]/5 rounded flex items-center justify-center border border-slate-200 text-[#002147]">
                              <CreditCard size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{selectedDue.receiptFileName || 'CHALLAN_RECEIPT_STAMPED.PDF'}</p>
                              <p className="text-[9px] text-slate-500 font-mono">
                                {(selectedDue.receiptFileName?.split('.').pop() || 'PDF').toUpperCase()} • {selectedDue.receiptFileSize || '841.5 KB'} • SECURELY VIRUS CHECKED
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-[#002147]/10 text-[#002147] border border-[#002147]/10 px-2.5 py-1 rounded font-bold uppercase font-mono">
                            View Receipt
                          </span>
                        </div>
                      </div>

                      {/* Audit Note Input */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Auditor Notes / Dispatches <span className="text-red-500 font-serif">*</span></label>
                          <span className="text-[10px] text-slate-400 font-mono">Mandatory Field</span>
                        </div>
                        <textarea
                          placeholder="Provide the mandatory reason description here before approving or rejecting..."
                          value={officerNotesText}
                          onChange={(e) => {
                            setOfficerNotesText(e.target.value);
                            if (e.target.value.trim()) setDuesNotesError('');
                          }}
                          className="w-full h-16 p-3 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002147]/30 text-xs rounded-lg text-slate-800"
                        />
                        {duesNotesError && (
                          <p className="text-xs font-semibold text-red-600 font-mono mt-1">{duesNotesError}</p>
                        )}
                      </div>

                      {/* Settle / Reject Actions */}
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => handleVerifyPayment(selectedDue.id, false)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                        >
                          <X size={14} /> Reject Challan
                        </button>
                        <button
                          onClick={() => handleVerifyPayment(selectedDue.id, true)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                        >
                          <Check size={14} /> Settle & Clear Liability
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-sm">
                      <CreditCard size={48} className="mx-auto text-slate-400 mb-3" />
                      <h4 className="font-bold text-slate-700">Select a deposit receipt to audit</h4>
                      <p className="text-xs text-slate-500 mt-1">Review transaction bank references, scan bank seals, and settle obligations cleanly.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CITIZEN GRIEVANCE MANAGEMENT */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#002147] flex items-center gap-2">
                    <LayoutDashboard className="text-[#002147]" /> Public Grievance Tracking Board
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Review citizens' complaints, file municipal grievance logs, and audit resolution statuses.</p>
                </div>
                <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                  Total Pending: {complaints.filter(c => c.status === 'Pending').length}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-slate-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <th className="px-6 py-3.5">ID / Date</th>
                        <th className="px-6 py-3.5">Category</th>
                        <th className="px-6 py-3.5">Subject</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5">Action Dispatch</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {complaints.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                            No complaints found in the system logs.
                          </td>
                        </tr>
                      ) : (
                        complaints.map(comp => (
                          <tr key={comp.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-slate-700">
                              #{comp.id}
                              <div className="text-[10px] text-slate-400 font-normal mt-0.5">{new Date(comp.date).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-full border border-slate-200 text-[10px] uppercase">
                                {comp.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800">{comp.title}</div>
                              <p className="text-slate-500 mt-0.5 leading-normal max-w-sm truncate" title={comp.description}>
                                {comp.description}
                              </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                comp.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                comp.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' :
                                'bg-slate-100 text-slate-700 border-slate-300'
                              }`}>
                                {comp.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#002147] font-bold text-slate-700 cursor-pointer"
                                value={comp.status}
                                onChange={(e) => {
                                  const nextVal = e.target.value as any;
                                  if (nextVal !== comp.status) {
                                    setComplaintPendingStatus({
                                      id: comp.id,
                                      title: comp.title,
                                      nextStatus: nextVal
                                    });
                                    setComplaintStatusReason('');
                                    setComplaintStatusReasonError('');
                                  }
                                }}
                              >
                                <option value="Pending">Pending Check</option>
                                <option value="In Progress">Move to In Progress</option>
                                <option value="Resolved">Mark Resolved</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NATIONAL REGISTRY LOOKUP TOOL */}
          {activeTab === 'registry' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">Biometric National Registry Citizen Lookup</h3>
                
                <form onSubmit={handleRegistrySearch} className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Enter Citizen CNIC (e.g. 37405-1234567-9)"
                      value={searchCnic}
                      onChange={(e) => setSearchCnic(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-lg bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#002147]/30 text-slate-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#002147] text-white hover:bg-opacity-95 px-6 h-11 rounded-lg text-xs font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                  >
                    Query Records
                  </button>
                </form>
                {registryError && (
                  <p className="text-xs font-semibold text-red-600 font-mono mt-2">{registryError}</p>
                )}
              </div>

              {searchedCitizen ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Bio Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 text-center flex flex-col items-center shadow-sm">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 shadow-md">
                      <img src={searchedCitizen.avatarUrl} alt={searchedCitizen.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mt-4">{searchedCitizen.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">CNIC: {searchedCitizen.cnic}</p>
                    
                    <span className="bg-green-500/10 text-green-700 border border-green-500/20 text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mt-3 flex items-center gap-1">
                      <CheckCircle2 size={12} /> BIOMETRICS VERIFIED
                    </span>

                    <div className="w-full text-left border-t border-slate-100 mt-6 pt-4 space-y-3.5 text-xs">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">Registered Email</span>
                        <p className="text-slate-700 mt-0.5 font-medium">{searchedCitizen.email}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">Secure Phone Link</span>
                        <p className="text-slate-700 mt-0.5 font-medium">{searchedCitizen.phone}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">Official Residence</span>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{searchedCitizen.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Citizen Records tracking */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Active Applications */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100">Associated Service Petitions</h4>
                      {citizenApps.length === 0 ? (
                        <p className="text-xs text-slate-400 py-4">No active petitions on file for this citizen.</p>
                      ) : (
                        <div className="space-y-3">
                          {citizenApps.map(ap => (
                            <div key={ap.id} className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex justify-between items-center text-xs">
                              <div>
                                <p className="font-bold text-slate-800">{ap.serviceTitle}</p>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Ref: {ap.id} | Opened: {new Date(ap.dateCreated).toLocaleDateString()}</p>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                                ap.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                ap.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {ap.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Dues Audit log */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100">Treasury Liability Ledger</h4>
                      {citizenDues.length === 0 ? (
                        <p className="text-xs text-slate-400 py-4">This citizen has clean ledger accounts (no outstanding or paid penalties).</p>
                      ) : (
                        <div className="space-y-3">
                          {citizenDues.map(d => (
                            <div key={d.id} className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex justify-between items-center text-xs">
                              <div>
                                <p className="font-bold text-slate-800">{d.title}</p>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Ref ID: {d.id} | Due Date: {new Date(d.dueDate).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-bold text-[#002147]">{d.amount}</span>
                                <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                                  d.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  d.status === 'Pending Verification' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' :
                                  'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                  {d.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-sm">
                  <Search size={48} className="mx-auto text-slate-400 mb-3" />
                  <h4 className="font-bold text-slate-700">Query a valid CNIC to pull secure administrative dossier sheets</h4>
                  <p className="text-xs text-slate-500 mt-1">Biometric matching sync will search treasury ledger and active public petitions.</p>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden font-sans animate-scale-up text-white">
            {/* Header */}
            <div className="bg-[#002147] border-b border-slate-700 p-4 shrink-0 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono tracking-widest uppercase text-slate-300">Administrative Verification Office</span>
                <h3 className="text-sm font-bold mt-0.5 truncate max-w-[400px]">{previewDoc.name}</h3>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0a1120] min-h-0">
              {/* If we have a real base64 image data URL */}
              {previewDoc.url && (previewDoc.type === 'JPEG' || previewDoc.type === 'JPG' || previewDoc.type === 'PNG') ? (
                <div className="flex justify-center border border-slate-800 rounded-lg p-2 bg-[#111c33] overflow-auto max-h-[70vh] w-full">
                  <img 
                    src={previewDoc.url} 
                    alt={previewDoc.name} 
                    className="max-w-full h-auto object-contain rounded" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                /* Otherwise, let's render an extremely authentic-looking simulated document layout matching the file details! */
                <div className="border border-amber-500/30 rounded-lg bg-amber-500/5 p-6 space-y-6 relative overflow-hidden select-none">
                  {/* Watermark Crest background */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <Shield size={300} />
                  </div>

                  {/* Top Bar with Crest text */}
                  <div className="text-center border-b border-amber-500/20 pb-4">
                    <div className="inline-block p-2 bg-slate-800 rounded-full border border-amber-500/30 text-amber-400 mb-2">
                      <Shield size={32} />
                    </div>
                    <h2 className="text-xs uppercase font-extrabold tracking-widest text-amber-500">Government of Pakistan</h2>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">Municipal Administration & Verified Registry Hub</p>
                    <p className="text-[9px] text-slate-505 font-serif italic mt-0.5">Islamic Republic of Pakistan • Secure Document Custody</p>
                  </div>

                  {/* Main Details block */}
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center text-[10px] border-b border-slate-800 pb-2">
                      <span className="font-mono text-slate-500">SERIAL ID: SEC-PRV-{Math.floor(100000 + Math.random() * 900000)}</span>
                      <span className="text-emerald-500 font-bold bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded">AUTHENTIC RECORD</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-500 uppercase text-[9px] font-bold">Document Title</p>
                        <p className="font-bold text-white mt-0.5">{previewDoc.name}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 uppercase text-[9px] font-bold">Encrypted File Type</p>
                        <p className="font-mono font-bold text-amber-400 mt-0.5">{previewDoc.type}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 uppercase text-[9px] font-bold">Assigned Record Size</p>
                        <p className="font-semibold text-white mt-0.5">{previewDoc.size}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 uppercase text-[9px] font-bold">Auditable Sync Date</p>
                        <p className="font-semibold text-white mt-0.5">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Specific layout for CNIC */}
                    {(previewDoc.name.toLowerCase().includes('cnic') || previewDoc.name.toLowerCase().includes('identity')) && (
                      <div className="mt-4 p-4 border border-blue-500/20 bg-blue-500/5 rounded-lg space-y-3">
                        <p className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider">NADRA Biometric Smart Identity Card Simulation</p>
                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                          <div>
                            <span className="text-slate-500 block text-[9px]">REGISTRY CNIC</span>
                            <span className="font-mono font-bold text-[#38bdf8]">{selectedApp?.cnic || '37405-1234567-9'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px]">FULL LEGAL NAME</span>
                            <span className="font-bold text-white">{selectedApp?.formData.fullName || 'Ahmed Khan'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px]">FATHER / SPOUSE NAME</span>
                            <span className="font-medium text-slate-200">{selectedApp?.formData.fatherName || 'Subh-e-Sadiq'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px]">DATE OF BIRTH</span>
                            <span className="font-medium text-slate-200">{selectedApp?.formData.dob || '1990-04-12'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Specific layout for Challans or Payments */}
                    {(previewDoc.name.toLowerCase().includes('challan') || previewDoc.name.toLowerCase().includes('receipt') || previewDoc.name.toLowerCase().includes('slip')) && (
                      <div className="mt-4 p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-lg space-y-3">
                        <p className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">National Bank of Pakistan Ledger Transaction</p>
                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                          <div>
                            <span className="text-slate-500 block text-[9px]">CHALLAN REFERENCE</span>
                            <span className="font-mono font-bold text-amber-400">{selectedDue?.receiptNo || 'CHL-724103-PK'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px]">DEPOSITED AMOUNT</span>
                            <span className="font-mono font-bold text-emerald-400">{selectedDue?.amount || 'PKR 12,500'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px]">TAX ACCOUNT HOLDER</span>
                            <span className="font-bold text-white">{selectedDue?.paidByName || 'Ahmed Khan'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px]">STAMP IDENTIFIER</span>
                            <span className="font-mono text-slate-300">NBP-PK-STAMP-34509B</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer legalities */}
                    <div className="border-t border-slate-800 pt-3 text-[10px] text-slate-400 leading-relaxed space-y-2">
                      <p>
                        This digital file preview serves as the official replica for administrative verification. Hash digests were safely checked against federal secure cloud databases.
                      </p>
                      <div className="flex justify-between items-center text-[9px] text-slate-505 font-mono">
                        <span>SHA-256 DIGITAL DIGEST VERIFIED</span>
                        <span>BY: PAK-GOV-OPS</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-950 border-t border-slate-800 p-4 shrink-0 flex justify-end gap-3">
              <button 
                onClick={() => setPreviewDoc(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded text-xs cursor-pointer"
              >
                Close Viewport
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ONLINE APPLICATION STATUS TRANSITION REASON MODAL */}
      {appPendingStatus && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full overflow-hidden font-sans animate-scale-up text-white">
            <div className="bg-[#002147] text-white p-5 border-b border-slate-700">
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-300">Action Dispatch Verification Desk</span>
              <h3 className="text-base font-bold mt-0.5">Application Status Decision Reason</h3>
              <p className="text-xs text-slate-300 mt-1">Provide the mandatory reason for shifting status to <strong>{appPendingStatus.nextStatus}</strong></p>
            </div>

            <div className="p-5 space-y-4 bg-[#0a1120]">
              {/* Transition Info */}
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <div>
                  <p className="text-slate-500 uppercase text-[9px] font-bold">Current State</p>
                  <p className="font-bold text-slate-300 mt-0.5">{appPendingStatus.app.status}</p>
                </div>
                <div className="text-slate-500 font-bold px-3">➔</div>
                <div>
                  <p className="text-slate-500 uppercase text-[9px] font-bold">Proposed State</p>
                  <p className={`font-bold mt-0.5 ${
                    appPendingStatus.nextStatus === 'Approved' ? 'text-emerald-400' :
                    appPendingStatus.nextStatus === 'Rejected' ? 'text-red-400' : 'text-amber-400'
                  }`}>{appPendingStatus.nextStatus}</p>
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Decision Explanation & Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="State clear, legitimate legal reasons or audit checklist results (minimum 10 characters)..."
                  value={appStatusReason}
                  onChange={(e) => {
                    setAppStatusReason(e.target.value);
                    if (e.target.value.trim().length >= 10) {
                      setAppStatusReasonError('');
                    }
                  }}
                  className="w-full h-24 p-3 bg-[#111c33] border border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#38bdf8] text-xs rounded-lg text-white"
                />
                <div className="flex justify-between items-center text-[10px]">
                  <span className={appStatusReason.trim().length < 10 ? 'text-rose-400' : 'text-slate-500'}>
                    {appStatusReason.trim().length < 10 
                      ? `Requires at least ${10 - appStatusReason.trim().length} more characters` 
                      : '✓ Criteria met'
                    }
                  </span>
                  <span className="text-slate-500 font-mono">{appStatusReason.trim().length} chars</span>
                </div>
                {appStatusReasonError && (
                  <p className="text-xs text-rose-400 font-semibold">{appStatusReasonError}</p>
                )}
              </div>
            </div>

            <div className="bg-slate-950 border-t border-slate-800 p-4 flex justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => {
                  setAppPendingStatus(null);
                  setAppStatusReason('');
                  setAppStatusReasonError('');
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (appStatusReason.trim().length < 10) {
                    setAppStatusReasonError('Please write a detailed reason (at least 10 characters).');
                    return;
                  }
                  // Commit the status change!
                  handleReviewApp(appPendingStatus.app, appPendingStatus.nextStatus, appStatusReason.trim());
                  // Reset states
                  setAppPendingStatus(null);
                  setAppStatusReason('');
                  setAppStatusReasonError('');
                }}
                disabled={appStatusReason.trim().length < 10}
                className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2 rounded text-xs cursor-pointer"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLAINT / GRIEVANCE STATUS TRANSITION REASON MODAL */}
      {complaintPendingStatus && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full overflow-hidden font-sans animate-scale-up text-white">
            <div className="bg-[#002147] text-white p-5 border-b border-slate-700">
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-300">Municipal Grievance Redressal</span>
              <h3 className="text-base font-bold mt-0.5">Grievance Action Plan Reason</h3>
              <p className="text-xs text-slate-300 mt-1">Provide the mandatory resolution/progress reason for ticket <strong>#{complaintPendingStatus.id}</strong></p>
            </div>

            <div className="p-5 space-y-4 bg-[#0a1120]">
              {/* Proposed Status Info */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
                <span className="text-slate-500 uppercase block text-[9px] font-bold">Subject / Title</span>
                <span className="font-bold mt-0.5 block truncate">{complaintPendingStatus.title}</span>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800">
                  <span className="text-slate-505 text-slate-500 uppercase font-bold">Target Transition</span>
                  <span className={`font-extrabold px-2 py-0.5 rounded text-[9px] uppercase border ${
                    complaintPendingStatus.nextStatus === 'Resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    complaintPendingStatus.nextStatus === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>{complaintPendingStatus.nextStatus}</span>
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Detailed Justification & Directives <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="State clear municipal directives, allocated resources, or resolution summary (minimum 10 characters)..."
                  value={complaintStatusReason}
                  onChange={(e) => {
                    setComplaintStatusReason(e.target.value);
                    if (e.target.value.trim().length >= 10) {
                      setComplaintStatusReasonError('');
                    }
                  }}
                  className="w-full h-24 p-3 bg-[#111c33] border border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#38bdf8] text-xs rounded-lg text-white"
                />
                <div className="flex justify-between items-center text-[10px]">
                  <span className={complaintStatusReason.trim().length < 10 ? 'text-rose-400' : 'text-slate-500'}>
                    {complaintStatusReason.trim().length < 10 
                      ? `Requires at least ${10 - complaintStatusReason.trim().length} more characters` 
                      : '✓ Criteria met'
                    }
                  </span>
                  <span className="text-slate-500 font-mono">{complaintStatusReason.trim().length} chars</span>
                </div>
                {complaintStatusReasonError && (
                  <p className="text-xs text-rose-400 font-semibold">{complaintStatusReasonError}</p>
                )}
              </div>
            </div>

            <div className="bg-slate-950 border-t border-slate-800 p-4 flex justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => {
                  setComplaintPendingStatus(null);
                  setComplaintStatusReason('');
                  setComplaintStatusReasonError('');
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (complaintStatusReason.trim().length < 10) {
                    setComplaintStatusReasonError('Please write a detailed description/reason (at least 10 characters).');
                    return;
                  }
                  // Commit the status change!
                  onUpdateStatus(complaintPendingStatus.id, complaintPendingStatus.nextStatus, complaintStatusReason.trim());
                  
                  onAddNotification(
                    `Ticket ${complaintPendingStatus.id} Status Update`, 
                    `Officer ${user.name} changed your complaint [${complaintPendingStatus.title}] status to ${complaintPendingStatus.nextStatus}. Reason: ${complaintStatusReason.trim()}`, 
                    complaintPendingStatus.nextStatus === 'Resolved' ? 'success' : 'warning'
                  );
                  
                  // Reset states
                  setComplaintPendingStatus(null);
                  setComplaintStatusReason('');
                  setComplaintStatusReasonError('');
                }}
                disabled={complaintStatusReason.trim().length < 10}
                className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2 rounded text-xs cursor-pointer"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
