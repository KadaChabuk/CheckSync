
import React, { useState } from 'react';
import { Checklist, Task, User } from '../types';

interface DashboardProps {
  checklists: Checklist[];
  tasks: Task[];
  currentUser: User;
  onSelect: (id: string) => void;
  onAddChecklist: (c: Checklist) => void;
  onShowPending: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ checklists, tasks, currentUser, onSelect, onAddChecklist, onShowPending }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const stats = {
    total: checklists.length,
    tasksTotal: tasks.length,
    completed: tasks.filter(t => t.isCompleted).length,
    percent: tasks.length > 0 ? Math.round((tasks.filter(t => t.isCompleted).length / tasks.length) * 100) : 0
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newChecklist: Checklist = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      description: newDesc,
      ownerId: currentUser.id,
      sharedWith: [],
      category: 'General',
      restrictViewToAssignedTasks: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddChecklist(newChecklist);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-cloud tracking-tighter">System Overview</h2>
          <p className="text-ash mt-2 font-medium">Monitoring {stats.total} collaborative projects across the workspace.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-lime text-midnight px-10 py-4 rounded-2xl font-black shadow-lg shadow-lime/20 hover:scale-105 transition-all flex items-center gap-3 self-start lime-glow"
        >
          <i className="fas fa-plus"></i> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: 'fa-layer-group', label: 'Active Checklists', val: stats.total, color: 'text-lime', bg: 'bg-lime/10' },
          { icon: 'fa-chart-pie', label: 'System Progress', val: `${stats.completed}/${stats.tasksTotal}`, color: 'text-cloud', bg: 'bg-[#1A3D3D]', subVal: `${stats.percent}%`, progress: true, clickable: true },
          { icon: 'fa-bolt', label: 'Open Tasks', val: stats.tasksTotal - stats.completed, color: 'text-rose-500', bg: 'bg-rose-500/10' }
        ].map((s, i) => (
          <div 
            key={i} 
            onClick={() => s.clickable && onShowPending()}
            className={`bg-[#153434] p-8 rounded-3xl border border-[#2A5A5A] shadow-xl transition-all ${s.clickable ? 'cursor-pointer hover:border-lime hover:lime-glow-hover' : ''}`}
          >
            <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-6`}>
              <i className={`fas ${s.icon} text-2xl`}></i>
            </div>
            <p className="text-ash text-xs font-black uppercase tracking-[0.2em]">{s.label}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex flex-col">
                <p className="text-4xl font-black text-cloud tracking-tighter">{s.val}</p>
                {s.subVal && <p className="text-xs font-bold text-lime mt-1">{s.subVal} Efficiency</p>}
              </div>
              {s.progress && (
                <div className="flex-1 h-2.5 bg-[#0D2626] rounded-full overflow-hidden">
                  <div className="h-full bg-lime shadow-[0_0_10px_rgba(180,240,0,0.5)] transition-all duration-1000" style={{ width: `${stats.percent}%` }}></div>
                </div>
              )}
            </div>
            {s.clickable && (
              <p className="mt-4 text-[10px] font-black text-ash uppercase tracking-widest flex items-center gap-2 group-hover:text-lime">
                View Unfinished Tasks <i className="fas fa-arrow-right"></i>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black text-cloud tracking-tight px-1">Project Feed</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {checklists.map(c => {
            const checklistTasks = tasks.filter(t => t.checklistId === c.id);
            const comp = checklistTasks.filter(t => t.isCompleted).length;
            const progress = checklistTasks.length > 0 ? (comp / checklistTasks.length) * 100 : 0;
            
            return (
              <div 
                key={c.id} 
                onClick={() => onSelect(c.id)}
                className="group bg-[#1A3D3D] p-8 rounded-3xl border border-[#2A5A5A] hover:border-lime transition-all cursor-pointer relative overflow-hidden lime-glow-hover"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                  <i className="fas fa-chevron-right text-lime text-xl"></i>
                </div>
                <div className="mb-6">
                  <span className="bg-[#0D2626] text-lime px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-lime/20">
                    {c.category}
                  </span>
                </div>
                <h4 className="text-2xl font-black text-cloud mb-3 truncate group-hover:text-lime transition-colors tracking-tight">{c.title}</h4>
                <p className="text-ash text-sm leading-relaxed mb-8 h-10 line-clamp-2">{c.description}</p>
                
                <div className="space-y-4 pt-4 border-t border-[#2A5A5A]">
                  <div className="flex justify-between text-[11px] font-black text-ash uppercase tracking-widest">
                    <span>{comp}/{checklistTasks.length} Ops Complete</span>
                    <span className="text-lime">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#0D2626] rounded-full overflow-hidden">
                    <div className="h-full bg-lime transition-all duration-500 shadow-[0_0_8px_rgba(180,240,0,0.5)]" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/90 backdrop-blur-md p-4">
          <div className="bg-[#1A3D3D] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#2A5A5A]">
            <div className="p-8 border-b border-[#2A5A5A] flex items-center justify-between">
              <h3 className="text-2xl font-black text-cloud tracking-tight">New Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-ash hover:text-lime"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-ash uppercase tracking-[0.2em] mb-3">Project Identifier</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0D2626] border border-[#2A5A5A] rounded-2xl px-6 py-4 text-cloud focus:ring-2 focus:ring-lime transition-all outline-none placeholder:text-ash/30"
                  placeholder="Deployment Beta-7..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-ash uppercase tracking-[0.2em] mb-3">Objective Summary</label>
                <textarea 
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#0D2626] border border-[#2A5A5A] rounded-2xl px-6 py-4 text-cloud focus:ring-2 focus:ring-lime transition-all outline-none placeholder:text-ash/30"
                  placeholder="Define project goals..."
                />
              </div>
              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-black text-ash hover:text-cloud transition-all uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 rounded-2xl font-black bg-lime text-midnight hover:scale-105 transition-all lime-glow uppercase tracking-widest text-xs"
                >
                  Initialize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
