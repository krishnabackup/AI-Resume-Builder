import React from 'react';

const HorizontalStatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  subtext, 
  iconColor, 
  iconBg,
  className = ""
}) => (
  <div className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center group ${className}`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${iconBg} ${iconColor} group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 line-clamp-1">{label}</span>
    <h4 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">{value}</h4>
    <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate w-full px-1 flex-shrink-0" title={String(subtext)}>{subtext}</span>
  </div>
);

export default React.memo(HorizontalStatCard);
