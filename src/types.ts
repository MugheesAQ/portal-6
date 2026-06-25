export type Role = 'citizen' | 'officer';

export interface User {
  cnic: string;
  role: Role;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
  category: string;
  officerNotes?: string;
}

export interface GovService {
  id: string;
  title: string;
  description: string;
  category: 'Identity' | 'Licensing' | 'Utilities' | 'Taxation' | 'Education' | 'Welfare';
  processingTime: string;
  fee: string;
  requirements: string[];
}

export interface OnlineApplication {
  id: string;
  serviceId: string;
  serviceTitle: string;
  applicantName: string;
  cnic: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  currentStep: number;
  formData: {
    fullName: string;
    fatherName: string;
    dob: string;
    phone: string;
    email: string;
    address: string;
    additionalDetails?: string;
  };
  uploadedDocuments: {
    name: string;
    size: string;
    type: string;
    previewUrl?: string;
  }[];
  dateCreated: string;
  dateUpdated: string;
  officerNotes?: string;
}

export interface PortalNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  date: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface OutstandingDue {
  id: string;
  title: string;
  amount: string;
  dueDate: string;
  type: 'fine' | 'tax' | 'fee';
  status: 'Unpaid' | 'Pending Verification' | 'Paid';
  receiptNo?: string;
  receiptDate?: string;
  paidByCnic?: string;
  paidByName?: string;
  receiptNote?: string;
  officerNotes?: string;
  receiptFileName?: string;
  receiptFileSize?: string;
  receiptFileUrl?: string;
}

export interface ClusterMetric {
  time: string;
  cpu: number;
  memory: number;
  network: number;
}

