import React from 'react';

const StatCard = ({ label, value, icon, trend, trendIcon, trendColor, isProbability }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[105px]">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-gray-500 font-medium text-xs">{label}</span>
        {React.cloneElement(icon, { className: "text-gray-400 text-[13px]" })}
      </div>

      <div className="flex flex-col mt-auto">
        <span className="text-[26px] font-bold text-slate-900 leading-none tracking-tight">{value}</span>
        {trend && (
          <span className={`${trendColor || "text-emerald-600"} text-[10px] flex items-center gap-1 font-medium mt-1`}>{trend}</span>
        )}
      </div>

      {isProbability && (
        <div className="mt-4 flex items-center gap-2">
          <div className="h-1.5 flex-grow bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: value }}></div>
          </div>
          <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase shrink-0">Est. Success</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
