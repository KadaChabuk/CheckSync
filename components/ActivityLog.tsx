
import React from 'react';
import { Activity } from '../types';

interface ActivityLogProps {
  activities: Activity[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'COMPLETED': return <i className="fas fa-check-circle text-lime"></i>;
      case 'UNCOMPLETED': return <i className="fas fa-undo text-ash"></i>;
      case 'COMMENTED': return <i className="fas fa-comment-dots text-lime"></i>;
      case 'ADDED': return <i className="fas fa-plus-circle text-cloud"></i>;
      case 'UPDATED': return <i className="fas fa-sync text-ash"></i>;
      default: return <i className="fas fa-info-circle text-ash"></i>;
    }
  };

  const getRelativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return new Date(iso).toLocaleDateString();
  };

  return (
    <div className="bg-[#153434] rounded-3xl border border-[#2A5A5A] shadow-xl overflow-hidden flex flex-col max-h-[800px]">
      <div className="p-6 border-b border-[#2A5A5A] bg-[#0D2626]/50 flex justify-between items-center">
        <h3 className="font-black text-cloud uppercase tracking-widest text-sm">Live Stream</h3>
        <span className="text-[10px] text-lime font-black bg-lime/10 px-2 py-1 rounded">ACTIVE</span>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-ash/20">
            <i className="fas fa-bolt text-5xl mb-4"></i>
            <p className="text-xs font-black uppercase tracking-widest">Waiting for updates</p>
          </div>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="flex gap-4 group">
              <div className="mt-1 flex-shrink-0 w-9 h-9 rounded-xl bg-[#0D2626] border border-[#2A5A5A] flex items-center justify-center text-sm shadow-sm transition-all group-hover:border-lime/50">
                {getIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0 pb-4 border-b border-[#2A5A5A]/30 group-last:border-none">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-black text-cloud tracking-tight">{act.userName}</p>
                  <span className="text-[9px] font-bold text-ash/60">{getRelativeTime(act.timestamp)}</span>
                </div>
                <p className="text-[13px] text-ash leading-relaxed">
                  {act.type === 'COMPLETED' && <>Finished "<strong>{act.targetName}</strong>"</>}
                  {act.type === 'UNCOMPLETED' && <>Reopened "<strong>{act.targetName}</strong>"</>}
                  {act.type === 'COMMENTED' && <>Commented on "<strong>{act.targetName}</strong>"</>}
                  {act.type === 'ADDED' && <>New task: "<strong>{act.targetName}</strong>"</>}
                  {act.type === 'UPDATED' && <>Refined "<strong>{act.targetName}</strong>"</>}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
