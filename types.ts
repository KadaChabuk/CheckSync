
export enum UserRole {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'COMPLETED' | 'UNCOMPLETED' | 'ADDED' | 'REMOVED' | 'COMMENTED' | 'UPDATED';
  userId: string;
  userName: string;
  targetName: string;
  checklistId: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  assignedTo: string[]; // User IDs
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  checklistId: string;
  completedBy?: string;
  completedAt?: string;
}

export interface Checklist {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  sharedWith: { userId: string; role: UserRole }[];
  category: string;
  restrictViewToAssignedTasks: boolean; // New property
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  currentUser: User | null;
  checklists: Checklist[];
  tasks: Task[];
  comments: Comment[];
  activities: Activity[];
  users: User[];
}
