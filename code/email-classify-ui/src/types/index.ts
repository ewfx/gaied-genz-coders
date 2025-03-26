
export interface Email {
  id: string;
  from: string;
  subject: string;
  body?: string;
  extracted_text?: string;
  routed_to: string;
  category?: string;
  date: string;
  is_spam?: boolean;
  is_duplicate?: boolean;
  confidence?: number;
}

export interface ApiStatus {
  message: string;
  isRunning: boolean;
}

export interface EmailsResponse {
  emails: Email[];
}

export interface DashboardStats {
  totalEmails: number;
  spamCount: number;
  duplicateCount: number;
  categories: {
    name: string;
    count: number;
  }[];
  departments: {
    name: string;
    count: number;
  }[];
}

export interface StatusLog {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}
