
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define our database schema
interface UserManagementDB extends DBSchema {
  roles: {
    key: string;
    value: Role;
    indexes: {
      'by-name': string;
      'by-type': string;
    };
  };
  users: {
    key: string;
    value: User;
    indexes: {
      'by-name': string;
      'by-role': string;
      'by-email': string;
    };
  };
}

export interface Role {
  id: string;
  name: string;
  type: RoleType;
  createdAt: Date;
  features: Feature[];
  permissions: Permission[];
}

export enum RoleType {
  Admin = 'Admin',
  Management = 'Management',
  ControlCenterUnit = 'Control Center Unit',
  GeneralUser = 'General User'
}

export interface Feature {
  id: string;
  name: string;
  selected: boolean;
}

export interface Permission {
  featureId: string;
  view: boolean;
  update: boolean;
  alerts: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  roleId: string;
  roleName: string;
  roleType: RoleType;
  email: string;
  mobile: string;
  countryCode: string;
  active: boolean;
  createdAt: Date;
}

let db: IDBPDatabase<UserManagementDB>;

export async function initDB() {
  db = await openDB<UserManagementDB>('user-management-db', 1, {
    upgrade(db) {
      // Create roles store
      const roleStore = db.createObjectStore('roles', { keyPath: 'id' });
      roleStore.createIndex('by-name', 'name');
      roleStore.createIndex('by-type', 'type');

      // Create users store
      const userStore = db.createObjectStore('users', { keyPath: 'id' });
      userStore.createIndex('by-name', ['firstName', 'lastName']);
      userStore.createIndex('by-role', 'roleId');
      userStore.createIndex('by-email', 'email');

      // Add some initial data
      seedInitialData(roleStore, userStore);
    },
  });

  return db;
}

function seedInitialData(roleStore: any, userStore: any) {
  // Initial roles
  const adminRole = {
    id: '1',
    name: 'Product Manager',
    type: RoleType.Admin,
    createdAt: new Date('2025-03-08T01:21:08'),
    features: [
      { id: '1', name: 'Dashboard', selected: true },
      { id: '2', name: 'User Management', selected: true },
      { id: '3', name: 'Data Setup', selected: true },
      { id: '4', name: 'Add Route', selected: true },
      { id: '5', name: 'Add Trip', selected: true },
      { id: '6', name: 'Route Monitoring', selected: true },
      { id: '7', name: 'Live Tracking', selected: true },
    ],
    permissions: [
      { featureId: '1', view: true, update: true, alerts: false },
      { featureId: '2', view: true, update: true, alerts: false },
      { featureId: '3', view: true, update: true, alerts: false },
      { featureId: '4', view: true, update: true, alerts: false },
      { featureId: '5', view: true, update: true, alerts: false },
      { featureId: '6', view: true, update: false, alerts: false },
      { featureId: '7', view: true, update: false, alerts: false },
    ]
  };

  const managementRole = {
    id: '2',
    name: 'Product Manager',
    type: RoleType.Management,
    createdAt: new Date('2025-03-08T01:21:08'),
    features: [
      { id: '1', name: 'Dashboard', selected: true },
      { id: '2', name: 'User Management', selected: true },
      { id: '3', name: 'Data Setup', selected: true },
      { id: '4', name: 'Add Route', selected: true },
      { id: '5', name: 'Add Trip', selected: true },
      { id: '6', name: 'Route Monitoring', selected: true },
      { id: '7', name: 'Live Tracking', selected: true },
    ],
    permissions: [
      { featureId: '1', view: true, update: false, alerts: false },
      { featureId: '2', view: true, update: false, alerts: false },
      { featureId: '3', view: true, update: false, alerts: false },
      { featureId: '4', view: true, update: false, alerts: false },
      { featureId: '5', view: true, update: false, alerts: false },
      { featureId: '6', view: true, update: false, alerts: false },
      { featureId: '7', view: true, update: false, alerts: false },
    ]
  };

  roleStore.add(adminRole);
  roleStore.add(managementRole);

  // Initial users
  const users = [
    {
      id: '1',
      firstName: 'Jon',
      lastName: 'Doe',
      roleId: '1',
      roleName: 'Product Manager',
      roleType: RoleType.Admin,
      email: 'jondoe@gmail.com',
      mobile: '1234567890',
      countryCode: '+91',
      active: true,
      createdAt: new Date('2025-03-08T01:21:08')
    },
    {
      id: '2',
      firstName: 'Jon',
      lastName: 'Doe',
      roleId: '1',
      roleName: 'Product Manager',
      roleType: RoleType.Admin,
      email: 'jondoe@gmail.com',
      mobile: '1234567890',
      countryCode: '+91',
      active: true,
      createdAt: new Date('2025-03-08T01:21:08')
    },
    {
      id: '3',
      firstName: 'Jon',
      lastName: 'Doe',
      roleId: '2',
      roleName: 'Product Manager',
      roleType: RoleType.Management,
      email: 'jondoe@gmail.com',
      mobile: '1234567890',
      countryCode: '+91',
      active: false,
      createdAt: new Date('2025-03-08T01:21:08')
    },
    {
      id: '4',
      firstName: 'Jon',
      lastName: 'Doe',
      roleId: '2',
      roleName: 'Product Manager',
      roleType: RoleType.Management,
      email: 'jondoe@gmail.com',
      mobile: '1234567890',
      countryCode: '+91',
      active: false,
      createdAt: new Date('2025-03-08T01:21:08')
    },
    {
      id: '5',
      firstName: 'Jon',
      lastName: 'Doe',
      roleId: '2',
      roleName: 'Product Manager',
      roleType: RoleType.Management,
      email: 'jondoe@gmail.com',
      mobile: '1234567890',
      countryCode: '+91',
      active: false,
      createdAt: new Date('2025-03-08T01:21:08')
    }
  ];

  users.forEach(user => userStore.add(user));
}

export async function getDB() {
  if (!db) {
    db = await initDB();
  }
  return db;
}

// Role CRUD operations
export async function getAllRoles(page = 1, limit = 10): Promise<Role[]> {
  const db = await getDB();
  const roles = await db.getAll('roles');
  const startIndex = (page - 1) * limit;
  return roles
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(startIndex, startIndex + limit);
}

export async function getRolesCount(): Promise<number> {
  const db = await getDB();
  const roles = await db.getAll('roles');
  return roles.length;
}

export async function getRoleById(id: string): Promise<Role | undefined> {
  const db = await getDB();
  return db.get('roles', id);
}

export async function createRole(role: Omit<Role, 'id' | 'createdAt'>): Promise<Role> {
  const db = await getDB();
  const newRole: Role = {
    ...role,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  };
  await db.add('roles', newRole);
  notifySubscribers('roles', 'add', newRole);
  return newRole;
}

export async function updateRole(role: Role): Promise<Role> {
  const db = await getDB();
  await db.put('roles', role);
  notifySubscribers('roles', 'update', role);
  return role;
}

export async function deleteRole(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('roles', id);
  notifySubscribers('roles', 'delete', { id });
}

// User CRUD operations
export async function getAllUsers(page = 1, limit = 10): Promise<User[]> {
  const db = await getDB();
  const users = await db.getAll('users');
  const startIndex = (page - 1) * limit;
  return users
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(startIndex, startIndex + limit);
}

export async function getUsersCount(): Promise<number> {
  const db = await getDB();
  const users = await db.getAll('users');
  return users.length;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const db = await getDB();
  return db.get('users', id);
}

export async function createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const db = await getDB();
  const newUser: User = {
    ...user,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  };
  await db.add('users', newUser);
  notifySubscribers('users', 'add', newUser);
  return newUser;
}

export async function updateUser(user: User): Promise<User> {
  const db = await getDB();
  await db.put('users', user);
  notifySubscribers('users', 'update', user);
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('users', id);
  notifySubscribers('users', 'delete', { id });
}

// Mock WebSocket implementation
type EntityType = 'roles' | 'users';
type ActionType = 'add' | 'update' | 'delete';

interface Subscriber {
  entityType: EntityType;
  callback: (actionType: ActionType, data: any) => void;
}

const subscribers: Subscriber[] = [];

export function subscribeToChanges(
  entityType: EntityType, 
  callback: (actionType: ActionType, data: any) => void
): () => void {
  const subscriber: Subscriber = { entityType, callback };
  subscribers.push(subscriber);
  
  // Return unsubscribe function
  return () => {
    const index = subscribers.indexOf(subscriber);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };
}

function notifySubscribers(entityType: EntityType, actionType: ActionType, data: any): void {
  // Small delay to simulate network latency
  setTimeout(() => {
    subscribers
      .filter(subscriber => subscriber.entityType === entityType)
      .forEach(subscriber => subscriber.callback(actionType, data));
  }, 300);
}

// Search functionality
export async function searchRoles(
  searchTerm: string, 
  searchBy: 'name' | 'type'
): Promise<Role[]> {
  const db = await getDB();
  const allRoles = await db.getAll('roles');
  
  return allRoles.filter(role => {
    if (searchBy === 'name') {
      return role.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return role.type.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });
}

export async function searchUsers(
  searchTerm: string, 
  searchBy: 'name' | 'role' | 'email'
): Promise<User[]> {
  const db = await getDB();
  const allUsers = await db.getAll('users');
  
  return allUsers.filter(user => {
    if (searchBy === 'name') {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    } else if (searchBy === 'role') {
      return user.roleName.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return user.email.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });
}
