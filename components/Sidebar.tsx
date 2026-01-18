
import React from 'react';
import { Checklist, User } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  checklists: Checklist[];
  selectedId: string | null;
  isShowingPending: boolean;
  onSelect: (id: string | null) => void;
  currentUser: User;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, checklists, selectedId, isShowingPending, onSelect, currentUser }) => {
  const myChecklists = checklists.filter(c => c.ownerId === currentUser.id);
  const sharedWithMe = checklists.filter(c => c.ownerId !== currentUser.id);

  return (
    <aside 
      className={`fixed lg:relative z-40 h-full bg-[#0D2626] text-ash w-72 flex flex-col transition-all duration-300 transform border-r border-[#1A3D3D] ${isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'}`}
    >
      <div className="p-8 border-b border-[#1A3D3D] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-lime rounded-2xl flex items-center justify-center lime-glow">
            <i className="fas fa-check-double text-midnight text-lg"></i>
          </div>
          <span className="font-black text-xl text-cloud tracking-tighter">CheckSync</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-ash hover:text-lime">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-5 space-y-10">
        <div className="space-y-2">
          <button 
            onClick={() => onSelect(null)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold group ${!selectedId && !isShowingPending ? 'bg-lime text-midnight lime-glow' : 'hover:bg-[#1A3D3D] text-ash'}`}
          >
            <i className={`fas fa-th-large ${!selectedId && !isShowingPending ? 'text-midnight' : 'text-ash group-hover:text-lime'}`}></i>
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => { /* Handled via Dashboard or we could add direct nav here if needed */ }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold group ${isShowingPending ? 'bg-lime text-midnight lime-glow' : 'hover:bg-[#1A3D3D] text-ash opacity-60 pointer-events-none'}`}
          >
            <i className={`fas fa-exclamation-circle ${isShowingPending ? 'text-midnight' : 'text-ash group-hover:text-lime'}`}></i>
            <span>Pending Ops</span>
          </button>
        </div>

        <div>
          <h3 className="text-[10px] font-black text-[#2A5A5A] uppercase tracking-[0.2em] px-4 mb-4">My Projects</h3>
          <div className="space-y-2">
            {myChecklists.map(c => (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-sm font-semibold group ${selectedId === c.id ? 'bg-[#1A3D3D] text-lime border border-[#B4F000]/20' : 'hover:bg-[#1A3D3D] text-ash'}`}
              >
                <i className={`fas fa-folder-open ${selectedId === c.id ? 'text-lime' : 'text-ash/40 group-hover:text-lime'}`}></i>
                <span className="truncate">{c.title}</span>
              </button>
            ))}
            {myChecklists.length === 0 && <p className="text-[10px] text-[#2A5A5A] px-4 italic">Empty Workspace</p>}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black text-[#2A5A5A] uppercase tracking-[0.2em] px-4 mb-4">Shared Items</h3>
          <div className="space-y-2">
            {sharedWithMe.map(c => (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-sm font-semibold group ${selectedId === c.id ? 'bg-[#1A3D3D] text-lime border border-[#B4F000]/20' : 'hover:bg-[#1A3D3D] text-ash'}`}
              >
                <i className={`fas fa-users ${selectedId === c.id ? 'text-lime' : 'text-ash/40 group-hover:text-lime'}`}></i>
                <span className="truncate">{c.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-[#1A3D3D] rounded-2xl p-5 border border-[#2A5A5A]">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <img src={currentUser.avatar} className="w-11 h-11 rounded-2xl object-cover border-2 border-midnight" alt="" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-lime rounded-full border-2 border-midnight shadow-sm"></div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-cloud truncate">{currentUser.name}</p>
              <p className="text-[10px] text-ash truncate uppercase tracking-widest font-bold">Pro User</p>
            </div>
          </div>
          <button className="w-full py-2.5 text-xs font-black text-ash hover:text-lime hover:bg-[#0D2626] rounded-xl transition-all uppercase tracking-widest">
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
