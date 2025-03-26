
import React, { useState, useEffect } from 'react';
import { RefreshCw, Loader2, Download } from 'lucide-react';
import StatusLogs from '../components/StatusLogs';
import { StatusLog } from '../types';
import { useToast } from '@/hooks/use-toast';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<StatusLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { toast } = useToast();

  // Mock log data - in a real application, this would come from the API
  const generateMockLogs = () => {
    const logTypes = ['info', 'success', 'warning', 'error'] as const;
    const logMessages = [
      'Fetching unread emails from the server',
      '✅ Successfully fetched 5 unread emails',
      'Processing email from customer@example.com',
      'Extracting text from email attachments',
      '✅ Successfully extracted text from 2 attachments',
      '🤖 AI analyzing email content',
      '✅ Email classified as "Mortgage" with 92% confidence',
      '✅ Email routed to "Mortgage Services"',
      '🚨 [SPAM DETECTED] Email contains spam-like content',
      '🔄 [DUPLICATE] Email was already processed',
      'Processing email from support@bank.com',
      '❌ Failed to extract text from PDF attachment',
      'Retrying attachment processing',
      '✅ Successfully extracted text on retry',
      '🤖 AI analyzing email content',
      '⚠️ Low confidence classification (65%)',
      '✅ Email routed to "General Inquiries"',
    ];
    
    const newLogs: StatusLog[] = [];
    
    for (let i = 0; i < 20; i++) {
      const type = logTypes[Math.floor(Math.random() * logTypes.length)];
      const message = logMessages[Math.floor(Math.random() * logMessages.length)];
      
      // Create timestamps in the past few minutes
      const timestamp = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 30));
      
      newLogs.push({
        id: `log-${i}-${Date.now()}`,
        message,
        type,
        timestamp: timestamp.toISOString(),
      });
    }
    
    // Sort by timestamp
    return newLogs.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // In a real application, fetch logs from the API
      // For now, generate mock logs
      const newLogs = generateMockLogs();
      setLogs(newLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  const handleDownloadLogs = () => {
    try {
      // Create a formatted string of logs
      const logText = logs.map(log => {
        const timestamp = new Date(log.timestamp).toLocaleString();
        return `[${timestamp}] [${log.type.toUpperCase()}] ${log.message}`;
      }).join('\n');
      
      // Create a blob and download it
      const blob = new Blob([logText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-classifier-logs-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Logs downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading logs:', error);
      toast({
        title: "Error",
        description: "Failed to download logs. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Auto-refresh logs every minute
    const interval = setInterval(() => {
      fetchLogs();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="heading-1">System Logs</h1>
          <p className="text-muted-foreground mt-1">
            View real-time logs from the AI email classification system
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={handleDownloadLogs}
            className="btn-pill btn-outline flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Logs</span>
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-pill btn-outline flex items-center space-x-2"
          >
            {refreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Logs</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {loading && !refreshing ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading logs...</p>
        </div>
      ) : (
        <StatusLogs logs={logs} />
      )}
    </div>
  );
};

export default Logs;
