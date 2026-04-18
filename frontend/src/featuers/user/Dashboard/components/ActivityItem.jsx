import React from 'react';
import {
  FileText,
  PenLine,
  Download,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

const ActivityItem = React.memo(({ activity }) => {
  const getIconConfig = (type) => {
    switch (type) {
      case 'created': return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'edited': return { icon: PenLine, color: 'text-orange-500', bg: 'bg-orange-50' };
      case 'download': return { icon: Download, color: 'text-emerald-500', bg: 'bg-emerald-50' };
      case 'scan': return { icon: CheckCircle, color: 'text-indigo-500', bg: 'bg-indigo-50' };
      case 'improved': return { icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50' };
      default: return { icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50' };
    }
  };

  const { icon: Icon, color, bg } = getIconConfig(activity.type);

  return (
    <div className="relative pl-6">
      <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${bg} shadow-sm z-10`}>
        <Icon className={`w-3.5 h-3.5 ${color}`} />
      </div>
      <div className="pr-2 pb-1 relative top-0.5">
        <p className="text-sm font-semibold text-slate-700">{activity.label}</p>
        {activity.docTitle && (
          <p className="text-[13px] text-slate-500 mt-0.5 max-w-full truncate">
            {activity.docTitle}
          </p>
        )}
        <p className="text-[11px] text-slate-400 mt-1 font-medium">{activity.timeAgo}</p>
      </div>
    </div>
  );
});

ActivityItem.displayName = 'ActivityItem';

export default ActivityItem;
