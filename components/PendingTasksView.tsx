
import React from 'react';
import { Checklist, Task, User } from '../types';

interface PendingTasksViewProps {
  checklists: Checklist[];
  tasks: Task[];
  users: User[];
  currentUser: User;
  onToggleTask: (id: string) => void;
  onBack: () => void;
}

const PendingTasksView: React.FC<PendingTasksViewProps> = ({ checklists, tasks, users, currentUser, onToggleTask, onBack }) => {
  const checklistsWithPending = checklists.map(c => ({
    ...c,
    pendingTasks: tasks.filter(t => t.checklistId === c.id && !t.isCompleted)
  })).filter(c => c.pendingTasks.length > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-6 mb-10">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-[#1A3D3D] rounded-2xl flex items-center justify-center text-ash hover:text-lime border border-[#2A5A5A] transition-all"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-3xl font-black text-cloud tracking-tighter">Diagnostic: Pending Ops</h2>
          <p className="text-ash text-sm font-medium mt-1">Reviewing all incomplete objectives across {checklistsWithPending.length} active lists.</p>
        </div>
      </div>

      {checklistsWithPending.length === 0 ? (
        <div className="bg-[#153434] p-20 rounded-3xl border border-dashed border-[#2A5A5A] text-center">
          <div className="w-20 h-20 bg-lime/10 text-lime rounded-3xl flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-star text-3xl"></i>
          </div>
          <h3 className="text-xl font-black text-cloud">Zero Pending Tasks</h3>
          <p className="text-ash mt-2">All workspace objectives are currently met. Mission complete.</p>
          <button 
            onClick={onBack}
            className="mt-8 px-8 py-3 bg-lime text-midnight rounded-xl font-black uppercase tracking-widest text-xs lime-glow"
          >
            Return to Base
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {checklistsWithPending.map(checklist => (
            <div key={checklist.id} className="space-y-4">
              <div className="flex items-center gap-4 px-2">
                <div className="w-2 h-8 bg-lime rounded-full shadow-[0_0_10px_rgba(180,240,0,0.5)]"></div>
                <h3 className="text-xl font-black text-cloud tracking-tight truncate">{checklist.title}</h3>
                <span className="text-[10px] font-black bg-[#1A3D3D] text-ash px-3 py-1 rounded-full border border-[#2A5A5A] uppercase tracking-widest">
                  {checklist.pendingTasks.length} PENDING
                </span>
              </div>
              
              <div className="grid gap-3">
                {checklist.pendingTasks.map(task => {
                  const assignees = users.filter(u => task.assignedTo.includes(u.id));
                  return (
                    <div 
                      key={task.id}
                      className="bg-[#1A3D3D] p-5 rounded-2xl border border-[#2A5A5A] hover:border-[#3A6A6A] transition-all flex items-center gap-5 group"
                    >
                      <button 
                        onClick={() => onToggleTask(task.id)}
                        className="w-7 h-7 rounded-lg border-2 border-[#2A5A5A] hover:border-lime flex items-center justify-center transition-all"
                      >
                        <i className="fas fa-check text-lime opacity-0 group-hover:opacity-30"></i>
                      </button>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-cloud truncate">{task.title}</h4>
                        {task.dueDate && (
                          <p className="text-[10px] font-black text-ash uppercase tracking-widest mt-1">
                            <i className="far fa-calendar-alt mr-1.5 text-lime"></i>
                            {new Date(task.dueDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                      <div className="flex -space-x-2">
                        {assignees.map(u => (
                          <img key={u.id} src={u.avatar} className="w-7 h-7 rounded-full border-2 border-[#1A3D3D]" title={u.name} alt="" />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingTasksView;
