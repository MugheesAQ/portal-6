import React from 'react';

export const Logo: React.FC<{ className?: string; withText?: boolean }> = ({ className = '', withText = false }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="w-12 h-12 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M50 5 L15 25 V60 C15 80 50 95 50 95 C50 95 85 80 85 60 V25 L50 5Z" fill="#002147"/>
          <path d="M50 32 L54 44 H67 L57 51 L60 63 L50 55 L40 63 L43 51 L33 44 H46 L50 32Z" fill="#FFD700"/>
        </svg>
      </div>
      {withText && (
        <div>
          <h1 className="text-[#002147] font-bold text-xl tracking-tight leading-none uppercase">National Portal</h1>
          <p className="text-xs text-slate-500 font-medium tracking-widest uppercase mt-1">Citizen Services Division</p>
        </div>
      )}
    </div>
  );
};
