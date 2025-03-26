
import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './Nav';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="py-4 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AI Email Classifier
            </p>
            <p className="text-sm text-muted-foreground">
              Powered by Gemma 2B
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
