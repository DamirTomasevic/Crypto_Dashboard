import React from 'react';
import { RefreshCw } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: { value: number; isPositive: boolean };
  updated: number;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  change, 
  updated,
  isLoading = false,
  icon
}) => {
  const timeAgo = Math.floor((Date.now() - updated) / 1000);
  let refreshStatus = 'text-green-400';
  
  if (timeAgo > 300) {
    refreshStatus = 'text-yellow-400';
  }
  if (timeAgo > 600) {
    refreshStatus = 'text-red-400';
  }

  return (
    <div className="bg-black/70 backdrop-blur-lg rounded-xl border border-green-500/20 p-4 h-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:border-green-500/40">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className="text-gray-400 text-sm font-medium mb-2 flex items-center">
            {icon && <span className="text-green-400 mr-1.5">{icon}</span>}
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-white text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-20 animate-pulse bg-gray-800/50 rounded"></div>
              ) : (
                value
              )}
            </span>
          </div>
          
          {change && (
            <div className={`flex items-center mt-2 ${change.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`text-xs font-semibold px-2 py-1 rounded-md ${change.isPositive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {change.isPositive ? '▲' : '▼'} {Math.abs(change.value).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
          <RefreshCw size={12} className={`${refreshStatus}`} />
          <span className="text-xs text-gray-400">
            {timeAgo < 60 ? `${timeAgo}s` : timeAgo < 3600 ? `${Math.floor(timeAgo / 60)}m` : `${Math.floor(timeAgo / 3600)}h`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;