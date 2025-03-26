
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Mail, AlertCircle, Settings, Menu, X } from 'lucide-react';
import StatusIndicator from './StatusIndicator';
import { useState } from 'react';

const Nav: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Emails', to: '/emails', icon: Mail },
    { name: 'Logs', to: '/logs', icon: AlertCircle },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    
    return false;
  };

  return (
    <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
                <Mail size={18} />
              </div>
              <span className="font-medium">Email Classifier</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`nav-link flex items-center space-x-1 ${isActive(item.to) ? 'active' : ''}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            <StatusIndicator />
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:bg-muted transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={`nav-link flex items-center space-x-2 ${isActive(item.to) ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-2">
              <StatusIndicator />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
