
import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import EmailTable from '../components/EmailTable';
import { Email } from '../types';
import { apiService } from '../services/api';
import { useToast } from '@/hooks/use-toast';

const EmailList: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const result = await apiService.classifyEmails();
      setEmails(result.emails);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast({
        title: "Error",
        description: "Failed to fetch emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      
      // Try to recheck emails
      await apiService.recheckEmails();
      
      // Refresh the email list
      await fetchEmails();
      
      toast({
        title: "Success",
        description: "Emails checked and updated successfully.",
      });
    } catch (error) {
      console.error('Error rechecking emails:', error);
      toast({
        title: "Error",
        description: "Failed to recheck emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="heading-1">Email Classification</h1>
          <p className="text-muted-foreground mt-1">
            View and manage classified emails
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="mt-4 md:mt-0 btn-pill btn-primary flex items-center space-x-2"
        >
          {refreshing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Checking Emails...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              <span>Recheck Emails</span>
            </>
          )}
        </button>
      </div>
      
      {loading && !refreshing ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading emails...</p>
        </div>
      ) : (
        <EmailTable emails={emails} />
      )}
    </div>
  );
};

export default EmailList;
