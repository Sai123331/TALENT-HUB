import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'user' | 'company' | 'admin';

interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  role: Role;
  token: string;
  summary?: string;
  resume?: string;
  profilePicture?: string;
  phoneNumber?: string;
  industryType?: string;
  website?: string;
  location?: string;
  description?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: Role;
  user: UserInfo | null;
  login: (userData: UserInfo) => void;
  logout: () => void;
  updateUser: (userData: Partial<UserInfo>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem('role') as Role) || 'user';
  });
  const [user, setUser] = useState<UserInfo | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
    localStorage.setItem('role', role);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [isAuthenticated, role, user]);

  const login = (userData: UserInfo) => {
    setUser(userData);
    setRole(userData.role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole('user');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
  };

  const updateUser = (userData: Partial<UserInfo>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, login, logout, updateUser }}>
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
