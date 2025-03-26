
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 animate-fade-in">
      <div className="mb-6 rounded-full bg-red-100 p-3">
        <AlertCircle className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="text-4xl font-light mb-4">404 | Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link 
        to="/" 
        className="btn-pill btn-primary inline-flex items-center"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
