
import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    apiEndpoint: 'http://localhost:5000',
    refreshInterval: 5,
    spamThreshold: 0.8,
    duplicateDetection: true,
    aiModel: 'gemma-2b',
    notifyOnSpam: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings({
        ...settings,
        [name]: checked,
      });
    } else {
      setSettings({
        ...settings,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been successfully updated.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="heading-1">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure the AI email classification system
        </p>
      </div>
      
      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="apiEndpoint" className="block text-sm font-medium mb-1">
                API Endpoint
              </label>
              <input
                type="text"
                id="apiEndpoint"
                name="apiEndpoint"
                value={settings.apiEndpoint}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                placeholder="http://api.example.com"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                The base URL for the email classifier API
              </p>
            </div>
            
            <div>
              <label htmlFor="refreshInterval" className="block text-sm font-medium mb-1">
                Refresh Interval (minutes)
              </label>
              <input
                type="number"
                id="refreshInterval"
                name="refreshInterval"
                value={settings.refreshInterval}
                onChange={handleChange}
                min="1"
                max="60"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                How often to automatically check for new emails
              </p>
            </div>
            
            <div>
              <label htmlFor="spamThreshold" className="block text-sm font-medium mb-1">
                Spam Detection Threshold
              </label>
              <input
                type="range"
                id="spamThreshold"
                name="spamThreshold"
                value={settings.spamThreshold}
                onChange={handleChange}
                min="0"
                max="1"
                step="0.05"
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Lenient ({settings.spamThreshold})</span>
                <span className="text-xs text-muted-foreground">Strict</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="aiModel" className="block text-sm font-medium mb-1">
                AI Model
              </label>
              <select
                id="aiModel"
                name="aiModel"
                value={settings.aiModel}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="gemma-2b">Gemma 2B (Default)</option>
                <option value="gemma-7b">Gemma 7B (Higher Accuracy)</option>
                <option value="custom">Custom Model</option>
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                The AI model used for email classification
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="duplicateDetection"
                name="duplicateDetection"
                checked={settings.duplicateDetection}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="duplicateDetection" className="ml-2 block text-sm">
                Enable Duplicate Email Detection
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifyOnSpam"
                name="notifyOnSpam"
                checked={settings.notifyOnSpam}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="notifyOnSpam" className="ml-2 block text-sm">
                Notify When Spam Is Detected
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-pill btn-primary flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="glass-dark p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">About AI Email Classifier</h3>
        <div className="space-y-4 text-sm">
          <p>
            This application uses AI to classify emails into categories and route them to the appropriate department. It can detect spam and duplicate emails, extract text from email bodies and attachments, and provide insights into email trends.
          </p>
          <p>
            Powered by Gemma 2B, the classification system leverages state-of-the-art natural language processing to understand email content and make intelligent routing decisions.
          </p>
          <p>
            Version 1.0.0 | API Version 0.1.2
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
