
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ApiStatus } from '../types';
import { Check, AlertCircle } from 'lucide-react';

const StatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkStatus = async () => {
    try {
      setLoading(true);
      const result = await apiService.checkApiHealth();
      setStatus(result);
    } catch (error) {
      setStatus({
        message: 'API connection error',
        isRunning: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    
    // Check API health every 30 seconds
    const interval = setInterval(() => {
      checkStatus();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
        loading 
          ? 'bg-muted text-muted-foreground' 
          : status?.isRunning 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
      }`}
    >
      {loading ? (
        <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse mr-2"></div>
      ) : status?.isRunning ? (
        <Check className="h-3 w-3 mr-1.5 text-green-600" />
      ) : (
        <AlertCircle className="h-3 w-3 mr-1.5 text-red-600" />
      )}
      <span className="whitespace-nowrap">
        {loading 
          ? 'Checking API status...' 
          : status?.isRunning 
            ? 'API Running' 
            : 'API Offline'}
      </span>
      <button 
        onClick={() => checkStatus()} 
        className="ml-2 opacity-60 hover:opacity-100 focus:outline-none"
        aria-label="Refresh API status"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
};

export default StatusIndicator;
