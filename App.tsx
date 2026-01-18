
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  User, Checklist, Task, Comment, Activity, UserRole, AppState 
} from './types';
import { MOCK_USERS, MOCK_CHECKLISTS, MOCK_TASKS } from './store/mockData';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChecklistView from './components/ChecklistView';
import NotificationCenter from './components/NotificationCenter';
import PendingTasksView from './components/PendingTasksView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);
  const [checklists, setChecklists] = useState<Checklist[]>(MOCK_CHECKLISTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedChecklistId, setSelectedChecklistId] = useState<string | null>(null);
  const [isShowingPending, setIsShowingPending] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<{id: string, text: string, time: string}[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        const randomTaskIndex = Math.floor(Math.random() * tasks.length);
        const task = tasks[randomTaskIndex];
        const otherUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        
        if (otherUser.id !== currentUser?.id) {
          const newStatus = !task.isCompleted;
          
          setTasks(prev => prev.map((t, idx) => 
            idx === randomTaskIndex ? { 
              ...t, 
              isCompleted: newStatus, 
              completedBy: newStatus ? otherUser.id : undefined,
              completedAt: newStatus ? new Date().toISOString() : undefined 
            } : t
          ));

          const activity: Activity = {
            id: Math.random().toString(36).substr(2, 9),
            type: newStatus ? 'COMPLETED' : 'UNCOMPLETED',
            userId: otherUser.id,
            userName: otherUser.name,
            targetName: task.title,
            checklistId: task.checklistId,
            timestamp: new Date().toISOString()
          };
          
          setActivities(prev => [activity, ...prev].slice(0, 50));
          
          setNotifications(prev => [
            { 
              id: Date.now().toString(), 
              text: `${otherUser.name} ${newStatus ? 'completed' : 'unmarked'} "${task.title}"`,
              time: 'Just now'
            },
            ...prev
          ].slice(0, 10));
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [tasks, currentUser]);

  const addChecklist = useCallback((checklist: Checklist) => {
    setChecklists(prev => [checklist, ...prev]);
    const activity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'ADDED',
      userId: currentUser?.id || '',
      userName: currentUser?.name || '',
      targetName: checklist.title,
      checklistId: checklist.id,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [activity, ...prev]);
  }, [currentUser]);

  const addTask = useCallback((task: Task) => {
    setTasks(prev => [...prev, task]);
    const activity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'ADDED',
      userId: currentUser?.id || '',
      userName: currentUser?.name || '',
      targetName: task.title,
      checklistId: task.checklistId,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [activity, ...prev]);
  }, [currentUser]);

  const toggleTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newStatus = !t.isCompleted;
        const activity: Activity = {
          id: Math.random().toString(36).substr(2, 9),
          type: newStatus ? 'COMPLETED' : 'UNCOMPLETED',
          userId: currentUser?.id || '',
          userName: currentUser?.name || '',
          targetName: t.title,
          checklistId: t.checklistId,
          timestamp: new Date().toISOString()
        };
        setActivities(acts => [activity, ...acts]);
        return { 
          ...t, 
          isCompleted: newStatus,
          completedBy: newStatus ? currentUser?.id : undefined,
          completedAt: newStatus ? new Date().toISOString() : undefined
        };
      }
      return t;
    }));
  }, [currentUser]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    if (updates.dueDate) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const activity: Activity = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'UPDATED',
          userId: currentUser?.id || '',
          userName: currentUser?.name || '',
          targetName: task.title,
          checklistId: task.checklistId,
          timestamp: new Date().toISOString()
        };
        setActivities(prev => [activity, ...prev]);
      }
    }
  }, [currentUser, tasks]);

  const addComment = useCallback((taskId: string, text: string) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      taskId,
      userId: currentUser.id,
      userName: currentUser.name,
      text,
      createdAt: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const activity: Activity = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'COMMENTED',
        userId: currentUser.id,
        userName: currentUser.name,
        targetName: task.title,
        checklistId: task.checklistId,
        timestamp: new Date().toISOString()
      };
      setActivities(prev => [activity, ...prev]);
    }
  }, [currentUser, tasks]);

  const updateChecklist = useCallback((checklistId: string, updates: Partial<Checklist>) => {
    setChecklists(prev => prev.map(c => c.id === checklistId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  }, []);

  const selectedChecklist = useMemo(() => 
    checklists.find(c => c.id === selectedChecklistId) || null
  , [checklists, selectedChecklistId]);

  const navigateToDashboard = () => {
    setSelectedChecklistId(null);
    setIsShowingPending(false);
  };

  const handleSelectChecklist = (id: string | null) => {
    setSelectedChecklistId(id);
    setIsShowingPending(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight p-6">
        <div className="bg-[#1A3D3D] p-8 rounded-3xl border border-[#2A5A5A] shadow-2xl max-w-md w-full text-center">
          <div className="text-4xl mb-6 font-bold text-lime">
            CheckSync Pro
          </div>
          <p className="text-ash mb-8">Sign in to your team workspace to start collaborating.</p>
          <button 
            onClick={() => setCurrentUser(MOCK_USERS[0])}
            className="w-full bg-lime text-midnight py-4 rounded-2xl font-bold lime-glow lime-glow-hover transition-all"
          >
            Continue as {MOCK_USERS[0].name}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-midnight text-cloud">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        checklists={checklists}
        selectedId={selectedChecklistId}
        isShowingPending={isShowingPending}
        onSelect={handleSelectChecklist}
        currentUser={currentUser}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 border-b border-[#1A3D3D] bg-midnight flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[#1A3D3D] rounded-lg lg:hidden"
            >
              <i className="fas fa-bars text-ash"></i>
            </button>
            <h1 className="font-bold text-cloud truncate tracking-tight text-lg">
              {isShowingPending ? 'Pending Tasks' : selectedChecklist ? selectedChecklist.title : 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center -space-x-2">
              {MOCK_USERS.map(u => (
                <div key={u.id} className="relative group">
                  <img 
                    src={u.avatar} 
                    alt={u.name} 
                    className={`w-9 h-9 rounded-full border-2 border-midnight object-cover ${u.isOnline ? 'ring-2 ring-lime' : 'opacity-40'}`} 
                  />
                </div>
              ))}
            </div>
            
            <NotificationCenter notifications={notifications} />

            <div className="h-8 w-px bg-[#1A3D3D] mx-1"></div>
            
            <button className="flex items-center gap-3 group px-2 py-1.5 rounded-xl hover:bg-[#1A3D3D] transition-colors">
              <img src={currentUser.avatar} alt="" className="w-9 h-9 rounded-full border border-[#2A5A5A]" />
              <span className="text-sm font-semibold text-cloud group-hover:text-lime transition-colors hidden md:inline">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {isShowingPending ? (
            <PendingTasksView 
              checklists={checklists}
              tasks={tasks}
              users={MOCK_USERS}
              currentUser={currentUser}
              onToggleTask={toggleTask}
              onBack={navigateToDashboard}
            />
          ) : selectedChecklist ? (
            <ChecklistView 
              checklist={selectedChecklist}
              tasks={tasks.filter(t => t.checklistId === selectedChecklistId)}
              comments={comments}
              activities={activities.filter(a => a.checklistId === selectedChecklistId)}
              currentUser={currentUser}
              users={MOCK_USERS}
              onToggleTask={toggleTask}
              onUpdateTask={updateTask}
              onAddTask={addTask}
              onAddComment={addComment}
              onUpdateChecklist={updateChecklist}
              onBack={navigateToDashboard}
            />
          ) : (
            <Dashboard 
              checklists={checklists}
              tasks={tasks}
              currentUser={currentUser}
              onSelect={handleSelectChecklist}
              onAddChecklist={addChecklist}
              onShowPending={() => setIsShowingPending(true)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
