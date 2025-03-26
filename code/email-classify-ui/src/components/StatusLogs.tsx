
import React, { useState, useEffect, useRef } from 'react';
import { StatusLog } from '../types';
import { Terminal, Check, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';

interface StatusLogsProps {
  logs: StatusLog[];
}

const StatusLogs: React.FC<StatusLogsProps> = ({ logs }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCollapsed && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isCollapsed]);

  const getIconForLogType = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="glass-dark rounded-lg overflow-hidden transition-all duration-300">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center">
          <Terminal className="h-5 w-5 mr-2 text-muted-foreground" />
          <h3 className="font-medium">Real-time Status Logs</h3>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
            {logs.length} entries
          </span>
          <button className="text-muted-foreground hover:text-foreground">
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="border-t border-border">
          <div className="bg-black/80 text-white font-mono text-sm p-4 max-h-96 overflow-y-auto">
            {logs.length > 0 ? (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div 
                    key={log.id} 
                    className="flex items-start animate-fade-in opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-center mr-2 mt-0.5">
                      {getIconForLogType(log.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400 mr-2">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span 
                          className={`
                            text-xs px-1.5 py-0.5 rounded-full 
                            ${log.type === 'success' ? 'bg-green-900/30 text-green-400' : ''} 
                            ${log.type === 'warning' ? 'bg-amber-900/30 text-amber-400' : ''} 
                            ${log.type === 'error' ? 'bg-red-900/30 text-red-400' : ''} 
                            ${log.type === 'info' ? 'bg-blue-900/30 text-blue-400' : ''} 
                          `}
                        >
                          {log.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="mt-1">{log.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                No logs available yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusLogs;
