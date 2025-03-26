
import axios from 'axios';
import { ApiStatus, EmailsResponse, Email } from '../types';

// Configure base API URL
const API_URL = 'http://127.0.0.1:8000'; // Replace with your actual API URL

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Check API health
export const checkApiHealth = async (): Promise<ApiStatus> => {
  try {
    const response = await api.get('/');
    return {
      message: response.data.message,
      isRunning: true,
    };
  } catch (error) {
    return {
      message: 'API is not running',
      isRunning: false,
    };
  }
};

// Fetch and classify emails
export const classifyEmails = async (): Promise<EmailsResponse> => {
  try {
    const response = await api.get('/classify-emails');
    return response.data;
  } catch (error) {
    console.error('Error classifying emails:', error);
    throw error;
  }
};

// Recheck emails
export const recheckEmails = async (): Promise<Email> => {
  try {
    const response = await api.get('/recheck-emails');
    return response.data;
  } catch (error) {
    console.error('Error rechecking emails:', error);
    throw error;
  }
};

// Mock API for development
const mockEmails: Email[] = [
  {
    id: '1',
    from: 'customer@example.com',
    subject: 'Credit Limit Increase Request',
    body: 'I would like to request a credit limit increase for my account #12345.',
    extracted_text: 'Request for credit limit increase. Account #12345.',
    routed_to: 'Credit Card Services',
    category: 'Credit Card',
    date: new Date().toISOString(),
    confidence: 0.92,
  },
  {
    id: '2',
    from: 'support@bank.com',
    subject: 'Your Account Statement',
    body: 'Please find attached your monthly account statement.',
    extracted_text: 'Monthly account statement for checking account.',
    routed_to: 'Customer Service',
    category: 'Statement',
    date: new Date(Date.now() - 86400000).toISOString(),
    confidence: 0.85,
  },
  {
    id: '3',
    from: 'phishing@scam.com',
    subject: 'Urgent: Account Verification',
    body: 'Click here to verify your account details immediately.',
    extracted_text: 'Click link to verify account details.',
    routed_to: 'Spam',
    category: 'Security',
    date: new Date(Date.now() - 172800000).toISOString(),
    is_spam: true,
    confidence: 0.97,
  },
  {
    id: '4',
    from: 'mortgage@bank.com',
    subject: 'Mortgage Application Status',
    body: 'Your mortgage application has been processed.',
    extracted_text: 'Mortgage application processed. Status: Approved.',
    routed_to: 'Mortgage Services',
    category: 'Mortgage',
    date: new Date(Date.now() - 259200000).toISOString(),
    confidence: 0.89,
  },
  {
    id: '5',
    from: 'customer@example.com',
    subject: 'Re: Mortgage Application Status',
    body: 'Thank you for processing my mortgage application.',
    extracted_text: 'Thanks for processing mortgage application.',
    routed_to: 'Mortgage Services',
    category: 'Mortgage',
    date: new Date(Date.now() - 345600000).toISOString(),
    is_duplicate: true,
    confidence: 0.77,
  },
  {
    id: '6',
    from: 'support@bank.com',
    subject: 'Login Attempt from New Device',
    body: 'We detected a login attempt from a new device.',
    extracted_text: 'Login attempt from new device detected.',
    routed_to: 'Security',
    category: 'Security',
    date: new Date(Date.now() - 432000000).toISOString(),
    confidence: 0.95,
  },
  {
    id: '7',
    from: 'investments@bank.com',
    subject: 'Investment Portfolio Update',
    body: 'Your investment portfolio has been updated.',
    extracted_text: 'Investment portfolio updated. New balance: $50,000.',
    routed_to: 'Wealth Management',
    category: 'Investments',
    date: new Date(Date.now() - 518400000).toISOString(),
    confidence: 0.91,
  },
  {
    id: '8',
    from: 'loans@bank.com',
    subject: 'Loan Payment Confirmation',
    body: 'Your recent loan payment has been received.',
    extracted_text: 'Loan payment received. Remaining balance: $15,000.',
    routed_to: 'Loans',
    category: 'Loans',
    date: new Date(Date.now() - 604800000).toISOString(),
    confidence: 0.88,
  },
];

// Mock implementation for development
export const mockClassifyEmails = async (): Promise<EmailsResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ emails: mockEmails });
    }, 800);
  });
};

export const mockApiHealth = async (): Promise<ApiStatus> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: '✅ Email Classifier API is running!',
        isRunning: true,
      });
    }, 500);
  });
};

export const mockRecheckEmails = async (): Promise<Email> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEmails[Math.floor(Math.random() * mockEmails.length)]);
    }, 800);
  });
};

// Use mock or real API based on environment
export const apiService = {
  checkApiHealth: process.env.NODE_ENV === 'development' ? mockApiHealth : checkApiHealth,
  classifyEmails: process.env.NODE_ENV === 'development' ? mockClassifyEmails : classifyEmails,
  recheckEmails: process.env.NODE_ENV === 'development' ? mockRecheckEmails : recheckEmails,
};

export default apiService;
