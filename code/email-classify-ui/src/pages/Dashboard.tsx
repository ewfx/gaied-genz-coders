
import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import DashboardCharts from '../components/DashboardCharts';
import { DashboardStats } from '../types';
import { apiService } from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmails: 0,
    spamCount: 0,
    duplicateCount: 0,
    categories: [],
    departments: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await apiService.classifyEmails();
      
      // Process the data for the dashboard
      const emails = result.emails;
      const categories: { [key: string]: number } = {};
      const departments: { [key: string]: number } = {};
      let spamCount = 0;
      let duplicateCount = 0;
      
      emails.forEach(email => {
        // Count categories
        if (email.category) {
          categories[email.category] = (categories[email.category] || 0) + 1;
        }
        
        // Count departments
        if (email.routed_to) {
          departments[email.routed_to] = (departments[email.routed_to] || 0) + 1;
        }
        
        // Count spam and duplicates
        if (email.is_spam) spamCount++;
        if (email.is_duplicate) duplicateCount++;
      });
      
      // Transform data for charts
      const categoriesArray = Object.keys(categories).map(name => ({
        name,
        count: categories[name],
      }));
      
      const departmentsArray = Object.keys(departments).map(name => ({
        name,
        count: departments[name],
      }));
      
      setStats({
        totalEmails: emails.length,
        spamCount,
        duplicateCount,
        categories: categoriesArray,
        departments: departmentsArray,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
    
    // Refresh every 2 minutes
    const interval = setInterval(() => {
      fetchData();
    }, 120000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="heading-1">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of the AI email classification system
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="mt-4 md:mt-0 btn-pill btn-outline flex items-center space-x-2"
        >
          {refreshing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Data</span>
            </>
          )}
        </button>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Emails Processed"
          value={stats.totalEmails}
          description="Total emails processed by the AI system"
          type="email"
        />
        <MetricCard
          title="Spam Emails Detected"
          value={stats.spamCount}
          description="Emails identified as potential spam"
          type="spam"
          trend={stats.totalEmails > 0 ? {
            value: Math.round((stats.spamCount / stats.totalEmails) * 100),
            isPositive: false,
          } : undefined}
        />
        <MetricCard
          title="Duplicate Emails"
          value={stats.duplicateCount}
          description="Emails identified as duplicates"
          type="duplicate"
          trend={stats.totalEmails > 0 ? {
            value: Math.round((stats.duplicateCount / stats.totalEmails) * 100),
            isPositive: false,
          } : undefined}
        />
      </div>
      
      {/* Charts */}
      <DashboardCharts
        categories={stats.categories}
        departments={stats.departments}
      />
    </div>
  );
};

export default Dashboard;
