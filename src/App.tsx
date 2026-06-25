import { useState, useEffect } from 'react';
import { User, Complaint, OnlineApplication, OutstandingDue, PortalNotification, AuditLog } from './types';
import { Login } from './components/Login';
import { CitizenPortal } from './components/CitizenPortal';
import { OfficerDashboard } from './components/OfficerDashboard';

// Helper to safely parse localStorage or return fallback
const getStorageItem = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
    return fallback;
  }
};

const setStorageItem = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error setting localStorage key "${key}":`, e);
  }
};

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    ticketNumber: 'TKT-2026-0810',
    title: 'Broken Streetlight',
    category: 'Infrastructure',
    description: 'The streetlight outside House #42 on Baker Street has been broken for 3 weeks.',
    status: 'In Progress',
    date: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'c2',
    ticketNumber: 'TKT-2026-0925',
    title: 'Missed Garbage Collection',
    category: 'Sanitation',
    description: 'Garbage truck did not visit Sector G yesterday as scheduled.',
    status: 'Pending',
    date: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

const INITIAL_APPLICATIONS: OnlineApplication[] = [
  {
    id: 'app-9810',
    serviceId: 'cnic-renew',
    serviceTitle: 'Smart CNIC Card Renewal',
    applicantName: 'Ahmed Khan',
    cnic: '37405-1234567-9',
    status: 'Under Review',
    currentStep: 3,
    formData: {
      fullName: 'Ahmed Khan',
      fatherName: 'Late S. Khan',
      dob: '1988-06-15',
      phone: '+92 300 1234567',
      email: 'ahmed.khan@gov.pk',
      address: 'House 24B, Sector F-7, Islamabad, Pakistan'
    },
    uploadedDocuments: [
      { name: 'expired_cnic_front.jpg', size: '1.4 MB', type: 'JPG' }
    ],
    dateCreated: new Date(Date.now() - 86400000 * 4).toISOString(),
    dateUpdated: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

const INITIAL_DUES: OutstandingDue[] = [
  {
    id: 'd1',
    title: 'Traffic Penalty fine (Sector G-9)',
    amount: '750 PKR',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    type: 'fine',
    status: 'Unpaid'
  },
  {
    id: 'd2',
    title: 'National Health Fund contribution',
    amount: '500 PKR',
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    type: 'fee',
    status: 'Unpaid'
  }
];

const INITIAL_NOTIFICATIONS: PortalNotification[] = [
  {
    id: 'n1',
    title: 'CNIC System Maintenance',
    message: 'Government identity database has successfully scheduled v4.2 upgrade rolling updates.',
    type: 'info',
    date: new Date(Date.now() - 3600000).toISOString(),
    read: false
  },
  {
    id: 'n2',
    title: 'Traffic Penalty Notice',
    message: 'Unpaid traffic signal violation registered in Sector G-9. Please settle immediately.',
    type: 'alert',
    date: new Date(Date.now() - 86400000).toISOString(),
    read: false
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'l1',
    action: 'Secure Login Session Verified',
    details: 'Logged in successfully via MFA Citizen Authenticator',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    ipAddress: '110.39.12.148'
  },
  {
    id: 'l2',
    action: 'Identity Check API audit',
    details: 'Automatic fingerprint biometric check passed',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    ipAddress: '110.39.12.148'
  }
];

export default function App() {
  const [user, setUser] = useState<User | null>(() => getStorageItem<User | null>('portal_user', null));
  const [complaints, setComplaints] = useState<Complaint[]>(() => getStorageItem<Complaint[]>('portal_complaints', INITIAL_COMPLAINTS));
  const [applications, setApplications] = useState<OnlineApplication[]>(() => getStorageItem<OnlineApplication[]>('portal_applications', INITIAL_APPLICATIONS));
  const [dues, setDues] = useState<OutstandingDue[]>(() => getStorageItem<OutstandingDue[]>('portal_dues', INITIAL_DUES));
  const [notifications, setNotifications] = useState<PortalNotification[]>(() => getStorageItem<PortalNotification[]>('portal_notifications', INITIAL_NOTIFICATIONS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStorageItem<AuditLog[]>('portal_audit_logs', INITIAL_AUDIT_LOGS));

  // Sync state to localStorage whenever they change
  useEffect(() => {
    setStorageItem('portal_user', user);
  }, [user]);

  useEffect(() => {
    setStorageItem('portal_complaints', complaints);
  }, [complaints]);

  useEffect(() => {
    setStorageItem('portal_applications', applications);
  }, [applications]);

  useEffect(() => {
    setStorageItem('portal_dues', dues);
  }, [dues]);

  useEffect(() => {
    setStorageItem('portal_notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    setStorageItem('portal_audit_logs', auditLogs);
  }, [auditLogs]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    
    // Log login activity
    const newLog: AuditLog = {
      id: `l-${Math.random().toString(36).substring(2, 9)}`,
      action: `${loggedInUser.role === 'officer' ? 'Officer' : 'Citizen'} Login Session`,
      details: `Successful login as ${loggedInUser.name} (${loggedInUser.role})`,
      timestamp: new Date().toISOString(),
      ipAddress: '110.39.12.148'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddComplaint = (newComplaint: Omit<Complaint, 'id' | 'ticketNumber' | 'date' | 'status'>) => {
    const id = `C-${Math.floor(1000 + Math.random() * 9000)}`;
    const complaint: Complaint = {
      ...newComplaint,
      id,
      ticketNumber: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      date: new Date().toISOString()
    };
    setComplaints(prev => [complaint, ...prev]);
  };

  const handleUpdateComplaintStatus = (id: string, status: 'Pending' | 'In Progress' | 'Resolved', officerNotes?: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status, officerNotes } : c));
  };

  const handleUpdateApplicationStatus = (
    id: string, 
    status: 'Approved' | 'Rejected' | 'Under Review',
    officerNotes?: string
  ) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status, officerNotes, dateUpdated: new Date().toISOString() } : app
    ));
  };

  const handleAddAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `l-${Math.random().toString(36).substring(2, 9)}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '110.39.12.148'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleAddNotification = (title: string, message: string, type: 'info' | 'warning' | 'success' | 'alert') => {
    const newNotif: PortalNotification = {
      id: `n-${Math.random().toString(36).substring(2, 9)}`,
      title,
      message,
      type,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (user.role === 'citizen') {
    return (
      <CitizenPortal 
        user={user} 
        complaints={complaints} 
        applications={applications}
        dues={dues}
        notifications={notifications}
        auditLogs={auditLogs}
        setApplications={setApplications}
        setDues={setDues}
        setNotifications={setNotifications}
        setAuditLogs={setAuditLogs}
        onAddComplaint={handleAddComplaint} 
        onLogout={handleLogout} 
        onAddAuditLog={handleAddAuditLog}
        onAddNotification={handleAddNotification}
      />
    );
  }

  if (user.role === 'officer') {
    return (
      <OfficerDashboard 
        user={user} 
        complaints={complaints} 
        applications={applications}
        dues={dues}
        auditLogs={auditLogs}
        onLogout={handleLogout} 
        onUpdateStatus={handleUpdateComplaintStatus}
        onUpdateApplicationStatus={handleUpdateApplicationStatus}
        setDues={setDues}
        setNotifications={setNotifications}
        setAuditLogs={setAuditLogs}
        onAddAuditLog={handleAddAuditLog}
        onAddNotification={handleAddNotification}
      />
    );
  }

  return null;
}
