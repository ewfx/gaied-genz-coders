
import React from 'react';
import { Email } from '../types';
import { Award, AlertTriangle, Copy, BarChart4 } from 'lucide-react';

interface EmailDetailProps {
  email: Email;
}

const EmailDetail: React.FC<EmailDetailProps> = ({ email }) => {
  return (
    <div className="p-6 space-y-6 transition-all duration-300 animate-fade-in">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{email.subject}</h3>
          <div className="flex items-center">
            {email.confidence && (
              <div className="flex items-center text-sm text-muted-foreground mr-4">
                <BarChart4 className="h-4 w-4 mr-1 text-blue-500" />
                <span>Confidence: {(email.confidence * 100).toFixed(0)}%</span>
              </div>
            )}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {email.category || 'Uncategorized'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Email Details</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium">From:</dt>
                <dd className="text-sm">{email.from}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium">Date:</dt>
                <dd className="text-sm">{new Date(email.date).toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium">Routed To:</dt>
                <dd className="text-sm">{email.routed_to}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium">Status:</dt>
                <dd className="text-sm flex items-center">
                  {email.is_spam ? (
                    <span className="inline-flex items-center text-amber-600">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Spam
                    </span>
                  ) : email.is_duplicate ? (
                    <span className="inline-flex items-center text-blue-600">
                      <Copy className="h-3 w-3 mr-1" />
                      Duplicate
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-green-600">
                      <Award className="h-3 w-3 mr-1" />
                      Normal
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
          
          <div>
            {email.body && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Email Body</h4>
                <div className="rounded-md bg-muted p-3 text-sm overflow-y-auto max-h-32">
                  {email.body}
                </div>
              </div>
            )}
            
            {email.extracted_text && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Extracted Text</h4>
                <div className="rounded-md bg-muted p-3 text-sm overflow-y-auto max-h-32">
                  {email.extracted_text}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="glass-dark p-4 rounded-lg">
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Award className="h-4 w-4 mr-1.5 text-primary" />
          AI Classification Details
        </h4>
        <div className="text-sm space-y-2">
          <p>
            <span className="font-medium">Category:</span> {email.category || 'Uncategorized'}
          </p>
          <p>
            <span className="font-medium">Department:</span> {email.routed_to}
          </p>
          {email.confidence && (
            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-xs">Confidence</span>
                <span className="text-xs">{(email.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${email.confidence * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
