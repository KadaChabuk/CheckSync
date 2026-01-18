
import { User, Checklist, Task, UserRole } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Rivera', email: 'alex@checksync.pro', avatar: 'https://picsum.photos/seed/u1/100/100', isOnline: true },
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@checksync.pro', avatar: 'https://picsum.photos/seed/u2/100/100', isOnline: false },
  { id: 'u3', name: 'Jordan Smyth', email: 'jordan@checksync.pro', avatar: 'https://picsum.photos/seed/u3/100/100', isOnline: true },
];

export const MOCK_CHECKLISTS: Checklist[] = [
  {
    id: 'c1',
    title: 'Product Launch Q4',
    description: 'Final tasks before the major update release on Dec 1st.',
    ownerId: 'u1',
    sharedWith: [
      { userId: 'u2', role: UserRole.EDITOR },
      { userId: 'u3', role: UserRole.VIEWER }
    ],
    category: 'Product',
    restrictViewToAssignedTasks: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'c2',
    title: 'Office Onboarding',
    description: 'Standard checklist for new employees in the engineering department.',
    ownerId: 'u2',
    sharedWith: [
      { userId: 'u1', role: UserRole.EDITOR }
    ],
    category: 'HR',
    restrictViewToAssignedTasks: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    checklistId: 'c1',
    title: 'Verify SSL certificates',
    description: 'Ensure all staging and production certs are valid.',
    isCompleted: true,
    assignedTo: ['u1'],
    priority: 'high',
    dueDate: '2023-11-28T10:00:00Z',
    completedBy: 'u1',
    completedAt: '2023-11-25T14:30:00Z'
  },
  {
    id: 't2',
    checklistId: 'c1',
    title: 'Final smoke test',
    description: 'Run through all primary user flows.',
    isCompleted: false,
    assignedTo: ['u2', 'u1'],
    priority: 'high',
    dueDate: '2023-11-30T17:00:00Z'
  },
  {
    id: 't3',
    checklistId: 'c2',
    title: 'Set up workstation',
    description: 'Order dual monitors and mechanical keyboard.',
    isCompleted: false,
    assignedTo: ['u3'],
    priority: 'medium'
  }
];
