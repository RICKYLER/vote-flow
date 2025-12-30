import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/voting';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, credentials: { email: string; password: string }) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'admin',
  },
  student: {
    id: '2',
    name: 'John Smith',
    email: 'john.smith@student.edu',
    role: 'student',
    studentId: 'STU2024001',
    hasVoted: false,
  },
  candidate: {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@student.edu',
    role: 'candidate',
    studentId: 'STU2024002',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole, credentials: { email: string; password: string }) => {
    // Mock authentication - in production, this would validate against a backend
    if (credentials.email && credentials.password) {
      setUser(mockUsers[role]);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
