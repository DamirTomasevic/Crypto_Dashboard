import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  fullHeight?: boolean;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  title, 
  className = '',
  fullHeight = false
}) => {
  return (
    <div 
      className={`
        bg-black/70 backdrop-blur-lg
        rounded-xl border border-custom-green/20
        p-4 transition-all duration-300
        hover:shadow-[0_0_15px_rgba(13,255,0,0.15)]
        hover:border-custom-green/30
        ${fullHeight ? 'h-full' : ''}
        ${className}
      `}
    >
      {title && (
        <div className="border-b border-gray-800/50 pb-3 mb-4">
          <h2 className="text-lg font-bold text-white flex items-center">
            <span className="inline-block w-2 h-6 bg-custom-green rounded mr-3"></span>
            {title}
          </h2>
        </div>
      )}
      <div className={fullHeight ? 'h-[calc(100%-3rem)]' : ''}>
        {children}
      </div>
    </div>
  );
};

export default GlassPanel;