
import React, { useState, useMemo, useRef } from 'react';
import { Task, User, Comment } from '../types';

interface TaskItemProps {
  task: Task;
  users: User[];
  currentUser: User;
  ownerId: string;
  comments: Comment[];
  onToggle: () => void;
  onUpdateTask: (updates: Partial<Task>) => void;
  onAddComment: (text: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, users, currentUser, ownerId, comments, onToggle, onUpdateTask, onAddComment 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  const completedUser = task.completedBy ? users.find(u => u.id === task.completedBy) : null;
  const assignedUsers = useMemo(() => users.filter(u => task.assignedTo.includes(u.id)), [users, task.assignedTo]);

  const isOwner = currentUser.id === ownerId;
  const isAssigned = task.assignedTo.includes(currentUser.id);
  const canInteract = isOwner || isAssigned;

  const isOverdue = useMemo(() => {
    if (task.isCompleted || !task.dueDate) return false;
    return new Date(task.dueDate).getTime() < Date.now();
  }, [task.isCompleted, task.dueDate]);

  const formattedDueDate = useMemo(() => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate);
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }, [task.dueDate]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !canInteract) return;
    onAddComment(newComment);
    setNewComment('');
  };

  const triggerPicker = () => {
    if (isOwner && dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch (e) {
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <div 
      className={`bg-[#1A3D3D] border transition-all duration-300 rounded-3xl ${isExpanded ? 'border-lime ring-1 ring-lime/20 shadow-xl' : 'border-[#2A5A5A] hover:border-[#3A6A6A]'} ${isOverdue && !task.isCompleted ? 'border-rose-500/50' : ''}`}
    >
      <div className="p-5 flex items-center gap-5">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            if (canInteract) onToggle(); 
          }}
          disabled={!canInteract}
          className={`flex-shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${task.isCompleted ? 'bg-lime border-lime lime-glow' : 'border-[#2A5A5A]'} ${canInteract ? 'hover:border-lime cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
        >
          {task.isCompleted && <i className="fas fa-check text-midnight text-xs"></i>}
        </button>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-3 mb-1">
            <h5 className={`font-bold text-base truncate transition-all ${task.isCompleted ? 'text-ash line-through opacity-50' : 'text-cloud'}`}>
              {task.title}
            </h5>
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${task.priority === 'high' ? 'bg-rose-500/10 text-rose-500' : task.priority === 'medium' ? 'bg-lime/10 text-lime' : 'bg-ash/10 text-ash'}`}>
              {task.priority}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {task.isCompleted ? (
              <p className="text-[10px] text-ash font-bold uppercase tracking-tight">
                <i className="fas fa-check-double mr-1 text-lime"></i> Done by {completedUser?.name.split(' ')[0]}
              </p>
            ) : task.dueDate ? (
              <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isOverdue ? 'text-rose-500' : 'text-ash'}`}>
                <i className={`far ${isOverdue ? 'fa-clock' : 'fa-calendar-alt'}`}></i>
                {formattedDueDate}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex -space-x-2">
            {assignedUsers.map(u => (
              <img key={u.id} src={u.avatar} className="w-8 h-8 rounded-full border-2 border-[#1A3D3D] object-cover" title={u.name} alt="" />
            ))}
          </div>
          <div className="h-8 w-px bg-[#2A5A5A]"></div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isExpanded ? 'bg-lime text-midnight' : 'text-ash hover:bg-[#2A5A5A]'}`}
          >
            <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-10 pb-8 pt-4 space-y-8 border-t border-[#2A5A5A] animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <h6 className="text-[10px] font-black text-ash uppercase tracking-[0.2em]">Context & Requirements</h6>
                <p className="text-sm text-cloud leading-relaxed opacity-80">
                  {task.description || "No specific details provided for this task."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h6 className="text-[10px] font-black text-ash uppercase tracking-[0.2em]">Schedule Ops</h6>
                  <div 
                    onClick={triggerPicker}
                    className={`flex items-center bg-[#0D2626] border border-[#2A5A5A] rounded-2xl px-4 py-3 group transition-all ${isOwner ? 'hover:border-lime cursor-pointer focus-within:ring-2 focus-within:ring-lime' : 'opacity-60 cursor-not-allowed'}`}
                  >
                    <i className="fas fa-calendar-alt text-lime mr-3 group-hover:scale-110 transition-transform"></i>
                    <input 
                      ref={dateInputRef}
                      type="datetime-local" 
                      value={task.dueDate || ''}
                      onChange={(e) => isOwner && onUpdateTask({ dueDate: e.target.value || undefined })}
                      disabled={!isOwner}
                      className="bg-transparent border-none text-sm text-cloud w-full focus:outline-none [color-scheme:dark] cursor-pointer"
                    />
                    <i className="fas fa-clock text-ash ml-2 text-xs"></i>
                  </div>
                  {isOwner && (
                    <p className="text-[9px] text-ash font-bold uppercase tracking-widest opacity-50">Click to re-schedule</p>
                  )}
                </div>

                <div className="space-y-3">
                  <h6 className="text-[10px] font-black text-ash uppercase tracking-[0.2em]">Assignees</h6>
                  <div className="flex flex-wrap gap-2">
                    {users.map(u => {
                      const isSelected = task.assignedTo.includes(u.id);
                      return (
                        <button
                          key={u.id}
                          onClick={() => isOwner && onUpdateTask({ 
                            assignedTo: isSelected ? task.assignedTo.filter(id => id !== u.id) : [...task.assignedTo, u.id] 
                          })}
                          disabled={!isOwner}
                          className={`relative group p-0.5 rounded-xl transition-all border-2 ${isSelected ? 'border-lime scale-105 shadow-md shadow-lime/20' : 'border-transparent opacity-40 hover:opacity-100'}`}
                        >
                          <img src={u.avatar} className="w-8 h-8 rounded-lg object-cover" alt={u.name} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <h6 className="text-[10px] font-black text-ash uppercase tracking-[0.2em] flex items-center justify-between">
                <span>Discussion ({comments.length})</span>
                <i className="fas fa-comments text-lime"></i>
              </h6>
              
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {comments.map(c => (
                  <div key={c.id} className="flex gap-4">
                    <div className="w-9 h-9 rounded-xl bg-[#2A5A5A] flex-shrink-0 flex items-center justify-center text-lime font-black text-xs">
                      {c.userName.charAt(0)}
                    </div>
                    <div className="flex-1 bg-[#0D2626] p-4 rounded-2xl border border-[#2A5A5A]">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-black text-cloud">{c.userName}</span>
                        <span className="text-[9px] text-ash font-bold uppercase tracking-tighter">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-cloud/70 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-xs text-ash italic text-center py-10 bg-[#0D2626]/50 rounded-2xl border border-dashed border-[#2A5A5A]">Quiet in here. Start the talk.</p>
                )}
              </div>

              <form onSubmit={handleCommentSubmit} className="relative mt-4">
                <input 
                  type="text"
                  placeholder={canInteract ? "Drop a comment..." : "View only access"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={!canInteract}
                  className="w-full bg-[#0D2626] border border-[#2A5A5A] rounded-2xl px-6 py-3 pr-14 text-sm text-cloud focus:ring-2 focus:ring-lime transition-all outline-none"
                />
                <button 
                  type="submit"
                  disabled={!newComment.trim() || !canInteract}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-lime text-midnight rounded-xl flex items-center justify-center hover:scale-105 transition-all disabled:opacity-30 lime-glow"
                >
                  <i className="fas fa-paper-plane text-xs"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
