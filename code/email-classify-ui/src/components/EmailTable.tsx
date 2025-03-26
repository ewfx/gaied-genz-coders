
import React, { useState } from 'react';
import { 
  Mail, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Copy, 
  X 
} from 'lucide-react';
import { Email } from '../types';
import EmailDetail from './EmailDetail';

interface EmailTableProps {
  emails: Email[];
}

const EmailTable: React.FC<EmailTableProps> = ({ emails }) => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [sortField, setSortField] = useState<keyof Email>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    category: '',
    department: '',
    isSpam: false,
    isDuplicate: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories and departments for filters
  const categories = [...new Set(emails.map(email => email.category))].filter(Boolean) as string[];
  const departments = [...new Set(emails.map(email => email.routed_to))].filter(Boolean) as string[];

  // Handle sort
  const handleSort = (field: keyof Email) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Apply filters and sorting
  const filteredEmails = emails
    .filter(email => {
      let passes = true;
      
      if (filters.category && email.category !== filters.category) {
        passes = false;
      }
      
      if (filters.department && email.routed_to !== filters.department) {
        passes = false;
      }
      
      if (filters.isSpam && !email.is_spam) {
        passes = false;
      }
      
      if (filters.isDuplicate && !email.is_duplicate) {
        passes = false;
      }
      
      return passes;
    })
    .sort((a, b) => {
      if (!a[sortField] || !b[sortField]) return 0;
      
      const valA = a[sortField];
      const valB = b[sortField];
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      
      return 0;
    });

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      department: '',
      isSpam: false,
      isDuplicate: false,
    });
  };

  // Handle email selection
  const toggleEmailSelection = (email: Email) => {
    setSelectedEmail(selectedEmail?.id === email.id ? null : email);
  };

  return (
    <div className="animate-scale-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-medium">Emails ({filteredEmails.length})</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-pill btn-outline flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {(filters.category || filters.department || filters.isSpam || filters.isDuplicate) && (
              <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full">
                {Object.values(filters).filter(v => v).length}
              </span>
            )}
          </button>
          
          {(filters.category || filters.department || filters.isSpam || filters.isDuplicate) && (
            <button
              onClick={resetFilters}
              className="btn-pill btn-outline flex items-center space-x-2 text-destructive"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Filters Panel */}
      {showFilters && (
        <div className="glass mb-4 p-4 rounded-lg animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
              >
                <option value="">All Departments</option>
                {departments.map(department => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="spam-filter"
                  type="checkbox"
                  checked={filters.isSpam}
                  onChange={(e) => setFilters({ ...filters, isSpam: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="spam-filter" className="ml-2 text-sm text-muted-foreground">
                  Spam Only
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="duplicate-filter"
                  type="checkbox"
                  checked={filters.isDuplicate}
                  onChange={(e) => setFilters({ ...filters, isDuplicate: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="duplicate-filter" className="ml-2 text-sm text-muted-foreground">
                  Duplicates Only
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Table */}
      <div className="table-container rounded-lg overflow-hidden animate-fade-in bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="table-header" onClick={() => handleSort('from')}>
                  <div className="flex items-center cursor-pointer">
                    From
                    {sortField === 'from' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="table-header" onClick={() => handleSort('subject')}>
                  <div className="flex items-center cursor-pointer">
                    Subject
                    {sortField === 'subject' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="table-header" onClick={() => handleSort('routed_to')}>
                  <div className="flex items-center cursor-pointer">
                    Routed To
                    {sortField === 'routed_to' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="table-header" onClick={() => handleSort('date')}>
                  <div className="flex items-center cursor-pointer">
                    Date
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="table-header">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmails.length > 0 ? (
                filteredEmails.map((email) => (
                  <React.Fragment key={email.id}>
                    <tr 
                      className={`table-row cursor-pointer hover:bg-muted/50 ${selectedEmail?.id === email.id ? 'bg-muted' : ''}`}
                      onClick={() => toggleEmailSelection(email)}
                    >
                      <td className="table-cell">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{email.from}</span>
                        </div>
                      </td>
                      <td className="table-cell font-medium">
                        {email.subject}
                      </td>
                      <td className="table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {email.routed_to}
                        </span>
                      </td>
                      <td className="table-cell text-muted-foreground">
                        {new Date(email.date).toLocaleString()}
                      </td>
                      <td className="table-cell">
                        <div className="flex space-x-1">
                          {email.is_spam && (
                            <span className="status-badge status-badge-warning flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Spam
                            </span>
                          )}
                          {email.is_duplicate && (
                            <span className="status-badge status-badge-info flex items-center">
                              <Copy className="h-3 w-3 mr-1" />
                              Duplicate
                            </span>
                          )}
                          {!email.is_spam && !email.is_duplicate && (
                            <span className="status-badge status-badge-success">
                              Normal
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                    {selectedEmail?.id === email.id && (
                      <tr>
                        <td colSpan={5} className="p-0">
                          <div className="bg-muted/30 animate-fade-in">
                            <EmailDetail email={email} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="table-cell text-center py-8 text-muted-foreground">
                    No emails found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmailTable;
