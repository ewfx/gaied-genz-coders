
import React from 'react';
import { Mail, AlertTriangle, Copy } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  type: 'email' | 'spam' | 'duplicate';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  type,
  trend,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'email':
        return <Mail className="h-5 w-5 text-blue-500" />;
      case 'spam':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'duplicate':
        return <Copy className="h-5 w-5 text-purple-500" />;
      default:
        return <Mail className="h-5 w-5" />;
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'email':
        return 'from-blue-50 to-blue-100 border-blue-200';
      case 'spam':
        return 'from-amber-50 to-amber-100 border-amber-200';
      case 'duplicate':
        return 'from-purple-50 to-purple-100 border-purple-200';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  return (
    <div className={`rounded-xl border bg-gradient-to-br ${getColorClass()} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="rounded-full p-2 bg-white/60 backdrop-blur-sm">
          {getIcon()}
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-baseline">
          <p className="text-3xl font-light">{value.toLocaleString()}</p>
          {trend && (
            <p className={`ml-2 text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default MetricCard;
