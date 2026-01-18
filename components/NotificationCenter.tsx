
import React, { useState } from 'react';

interface NotificationCenterProps {
  notifications: {id: string, text: string, time: string}[];
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all border ${isOpen ? 'bg-lime text-midnight border-lime shadow-lg lime-glow' : 'bg-[#1A3D3D] text-ash border-[#2A5A5A] hover:border-lime/50'}`}
      >
        <i className="far fa-bell text-lg"></i>
        {notifications.length > 0 && (
          <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-midnight ${isOpen ? 'bg-midnight' : 'bg-lime shadow-[0_0_5px_rgba(180,240,0,0.8)]'}`}></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-4 w-96 bg-[#1A3D3D] rounded-3xl shadow-2xl border border-[#2A5A5A] z-50 overflow-hidden transform origin-top-right animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#2A5A5A] flex justify-between items-center bg-[#0D2626]/50">
              <h4 className="font-black text-cloud text-xs uppercase tracking-widest">Global Alerts</h4>
              <button className="text-[10px] font-black text-lime uppercase tracking-widest hover:underline">Clear Logs</button>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-16 text-center text-ash/30">
                  <i className="fas fa-ghost text-4xl mb-4"></i>
                  <p className="text-xs font-bold uppercase tracking-widest">Zero activity</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-5 border-b border-[#2A5A5A]/30 hover:bg-[#2A5A5A]/20 transition-all cursor-pointer group">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-lime/10 text-lime flex-shrink-0 flex items-center justify-center border border-lime/20 group-hover:lime-glow transition-all">
                        <i className="fas fa-satellite text-xs"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-cloud/90 font-medium leading-tight mb-2">{notif.text}</p>
                        <span className="text-[9px] text-ash font-black uppercase tracking-[0.1em]">{notif.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-[#0D2626]/30 border-t border-[#2A5A5A] text-center">
              <button className="text-[10px] font-black text-ash hover:text-lime transition-colors uppercase tracking-[0.2em]">View Diagnostic Feed</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
