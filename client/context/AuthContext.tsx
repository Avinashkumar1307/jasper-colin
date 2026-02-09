'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';

interface User {
  _id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        Cookies.remove('user');
        Cookies.remove('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const { data } = await api.post('/auth/login', { username, password });
    Cookies.set('token', data.token, { expires: 7 });
    Cookies.set('user', JSON.stringify({ _id: data._id, username: data.username }), { expires: 7 });
    setUser({ _id: data._id, username: data.username });
  };

  const register = async (username: string, password: string) => {
    const { data } = await api.post('/auth/register', { username, password });
    Cookies.set('token', data.token, { expires: 7 });
    Cookies.set('user', JSON.stringify({ _id: data._id, username: data.username }), { expires: 7 });
    setUser({ _id: data._id, username: data.username });
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
