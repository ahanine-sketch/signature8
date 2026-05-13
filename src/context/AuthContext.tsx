"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('s8_token');
    localStorage.removeItem('s8_user');
    localStorage.removeItem('s8_session_start');
    router.push('/admin/login');
  };

  useEffect(() => {
    // Check for session absolute expiration (7 days)
    const storedToken = localStorage.getItem('s8_token');
    const storedUser = localStorage.getItem('s8_user');
    const sessionStart = localStorage.getItem('s8_session_start');

    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    if (storedToken && storedUser && sessionStart) {
      const elapsed = Date.now() - parseInt(sessionStart);
      
      if (elapsed > SEVEN_DAYS_MS) {
        console.warn("🔒 Session has reached its 7-day limit. Logging out.");
        logout();
      } else {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("❌ Failed to parse stored user", e);
          logout();
        }
      }
    } else if (storedToken && storedUser && !sessionStart) {
      // Legacy session without start time: set one now or expire it
      localStorage.setItem('s8_session_start', Date.now().toString());
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('s8_token', newToken);
    localStorage.setItem('s8_user', JSON.stringify(newUser));
    localStorage.setItem('s8_session_start', Date.now().toString());
  };



  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
