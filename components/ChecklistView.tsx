
import React, { useState, useMemo, useRef } from 'react';
import { Checklist, Task, User, Comment, Activity, UserRole } from '../types';
import TaskItem from './TaskItem';
import ActivityLog from './ActivityLog';

interface ChecklistViewProps {
  checklist: Checklist;
  tasks: Task[];
  comments: Comment[];
  activities: Activity[];
  currentUser: User;
  users: User[];
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onAddTask: (task: Task) => void;
  onAddComment: (taskId: string, text: string) => void;
  onUpdateChecklist: (id: string, updates: Partial<Checklist>) => void;
  onBack: () => void;
}

const ChecklistView: React.FC<ChecklistViewProps> = ({ 
  checklist, tasks, comments, activities, currentUser, users,
  onToggleTask, onUpdateTask, onAddTask, onAddComment, onUpdateChecklist, onBack 
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const isOwner = checklist.ownerId === currentUser.id;

  const visibleTasks = useMemo(() => {
    if (isOwner || !checklist.restrictViewToAssignedTasks) {
      return tasks;
    }
    return tasks.filter(task => task.assignedTo.includes(currentUser.id));
  }, [tasks, isOwner, checklist.restrictViewToAssignedTasks, currentUser.id]);

  const stats = useMemo(() => {
    const total = visibleTasks.length;
    const completed = visibleTasks.filter(t => t.isCompleted).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, progress };
  }, [visibleTasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      checklistId: checklist.id,
      title: newTaskTitle,
      isCompleted: false,
      assignedTo: [currentUser.id],
      priority: 'medium',
      dueDate: newTaskDueDate || undefined,
    };

    onAddTask(task);
    setNewTaskTitle('');
    setNewTaskDueDate('');
  };

  const triggerPicker = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch (e) {
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header Card */}
      <div className="bg-[#153434] rounded-3xl border border-[#2A5A5A] p-6 md:p-10">
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-[#2A5A5A] text-lime px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {checklist.category}
              </span>
              {checklist.restrictViewToAssignedTasks && (
                <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <i className="fas fa-eye-slash"></i> Restricted
                </span>
              )}
            </div>
            <h2 className="text-3xl font-black text-cloud tracking-tighter">{checklist.title}</h2>
            <p className="text-ash leading-relaxed max-w-2xl">{checklist.description}</p>
            
            <div className="pt-4 space-y-3 max-w-md">
              <div className="flex items-center justify-between text-xs font-bold text-ash uppercase tracking-widest">
                <span>Overall Progress</span>
                <span className="text-lime">{Math.round(stats.progress)}%</span>
              </div>
              <div className="h-3 bg-[#0D2626] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-lime shadow-[0_0_10px_rgba(180,240,0,0.5)] transition-all duration-700" 
                  style={{ width: `${stats.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 h-fit">
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="px-6 py-3 bg-[#1A3D3D] hover:bg-[#2A5A5A] text-cloud rounded-2xl text-sm font-bold transition-all border border-[#2A5A5A] flex items-center gap-2"
            >
              <i className="fas fa-cog"></i> Manage
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Tasks & Activity (Side by Side) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <form onSubmit={handleAddTask} className="bg-[#1A3D3D] p-5 rounded-3xl border border-[#2A5A5A] flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center bg-[#0D2626] rounded-2xl px-5 py-3 group focus-within:ring-2 focus-within:ring-lime transition-all">
              <i className="fas fa-tasks text-ash mr-4"></i>
              <input 
                type="text"
                placeholder="Assign a new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="bg-transparent border-none flex-1 focus:outline-none text-sm text-cloud font-medium placeholder:text-ash/50"
              />
            </div>
            <div className="flex gap-4">
              <div 
                onClick={triggerPicker}
                className="flex items-center bg-[#0D2626] rounded-2xl px-5 py-3 group hover:ring-2 hover:ring-lime/50 focus-within:ring-2 focus-within:ring-lime transition-all cursor-pointer border border-transparent"
              >
                <i className="fas fa-calendar-day text-lime mr-3 group-hover:animate-pulse"></i>
                <input 
                  ref={dateInputRef}
                  type="datetime-local"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="bg-transparent border-none text-sm text-cloud focus:outline-none cursor-pointer [color-scheme:dark] w-[160px]"
                />
                <i className="fas fa-clock text-ash ml-2 text-xs"></i>
              </div>
              <button 
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="bg-lime text-midnight px-8 rounded-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-black lime-glow whitespace-nowrap"
              >
                Add Task
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {visibleTasks.length === 0 ? (
              <div className="text-center py-20 bg-[#153434]/50 rounded-3xl border border-dashed border-[#2A5A5A]">
                <i className="fas fa-clipboard-list text-6xl text-ash/20 mb-6"></i>
                <p className="text-ash font-medium">
                  {checklist.restrictViewToAssignedTasks && !isOwner 
                    ? "You are not assigned to any tasks here." 
                    : "No tasks yet. Start collaborating now."}
                </p>
              </div>
            ) : (
              visibleTasks.sort((a, b) => {
                if (a.isCompleted !== b.isCompleted) return Number(a.isCompleted) - Number(b.isCompleted);
                return 0;
              }).map(task => (
                <TaskItem 
                  key={task.id}
                  task={task}
                  users={users}
                  currentUser={currentUser}
                  ownerId={checklist.ownerId}
                  comments={comments.filter(c => c.taskId === task.id)}
                  onToggle={() => onToggleTask(task.id)}
                  onUpdateTask={(updates) => onUpdateTask(task.id, updates)}
                  onAddComment={(text) => onAddComment(task.id, text)}
                />
              ))
            )}
          </div>
        </div>

        {/* Persistent Activity Side Panel */}
        <div className="xl:col-span-4 h-fit sticky top-8">
          <ActivityLog activities={activities} />
        </div>
      </div>

      {/* Settings Modal (Midnight Theme) */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/80 backdrop-blur-md p-4">
          <div className="bg-[#1A3D3D] rounded-3xl border border-[#2A5A5A] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-[#2A5A5A] flex items-center justify-between">
              <h3 className="text-xl font-bold text-cloud">Checklist Settings</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="text-ash hover:text-lime"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-8 space-y-8">
              {isOwner && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-ash uppercase tracking-widest">Privacy Controls</p>
                  <label className="flex items-center justify-between p-4 bg-[#0D2626] rounded-2xl cursor-pointer hover:bg-[#153434] transition-colors border border-[#2A5A5A]">
                    <div className="flex items-center gap-4">
                      <i className={`fas ${checklist.restrictViewToAssignedTasks ? 'fa-eye-slash text-lime' : 'fa-eye text-ash'}`}></i>
                      <div>
                        <p className="text-sm font-bold text-cloud">Restrict Visibility</p>
                        <p className="text-[10px] text-ash">Show only assigned tasks to users</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => onUpdateChecklist(checklist.id, { restrictViewToAssignedTasks: !checklist.restrictViewToAssignedTasks })}
                      className={`w-12 h-6 rounded-full relative transition-all ${checklist.restrictViewToAssignedTasks ? 'bg-lime' : 'bg-[#2A5A5A]'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${checklist.restrictViewToAssignedTasks ? 'left-7 bg-midnight' : 'left-1 bg-cloud'}`}></div>
                    </div>
                  </label>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-[10px] font-black text-ash uppercase tracking-widest">Team Access</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-[#0D2626] rounded-2xl">
                    <div className="flex items-center gap-3">
                      <img src={users.find(u => u.id === checklist.ownerId)?.avatar} className="w-8 h-8 rounded-full border border-ash/20" alt="" />
                      <span className="text-sm font-bold">{users.find(u => u.id === checklist.ownerId)?.name}</span>
                    </div>
                    <span className="text-[9px] bg-lime/10 text-lime px-2 py-1 rounded font-black">OWNER</span>
                  </div>
                  {checklist.sharedWith.map(sw => (
                    <div key={sw.userId} className="flex items-center justify-between p-3 border border-[#2A5A5A] rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img src={users.find(u => u.id === sw.userId)?.avatar} className="w-8 h-8 rounded-full" alt="" />
                        <span className="text-sm font-medium">{users.find(u => u.id === sw.userId)?.name}</span>
                      </div>
                      <span className="text-[9px] text-ash font-bold uppercase">{sw.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#0D2626] border-t border-[#2A5A5A] text-center">
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="text-sm font-black text-lime uppercase tracking-widest"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistView;
