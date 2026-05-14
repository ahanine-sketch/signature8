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

/** Decode JWT and check if it's expired. Returns true if expired or invalid. */
function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;
    const payload = JSON.parse(atob(payloadBase64));
    // exp is in seconds; Date.now() is in ms
    return typeof payload.exp === 'number' && payload.exp < Date.now() / 1000;
  } catch {
    return true; // If we can't decode it, treat it as expired
  }
}

function clearStorage() {
  localStorage.removeItem('s8_token');
  localStorage.removeItem('s8_user');
  localStorage.removeItem('s8_session_start');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    setToken(null);
    setUser(null);
    clearStorage();
    router.push('/admin/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('s8_token');
    const storedUser = localStorage.getItem('s8_user');
    const sessionStart = localStorage.getItem('s8_session_start');

    const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

    if (storedToken && storedUser) {
      // 1. Check absolute 7-day session limit
      if (sessionStart) {
        const elapsed = Date.now() - parseInt(sessionStart);
        if (elapsed > ONE_YEAR_MS) {
          console.warn("🔒 Session has reached its 7-day limit. Logging out.");
          clearStorage();
          setIsLoading(false);
          return;
        }
      } else {
        // Legacy session without start time: set one now
        localStorage.setItem('s8_session_start', Date.now().toString());
      }

      // 2. Check JWT expiry directly — Supabase tokens expire after 1h
      if (isTokenExpired(storedToken)) {
        console.warn("🔒 Stored JWT is expired. Clearing session.");
        clearStorage();
        setIsLoading(false);
        // Don't redirect here — let AdminGuard handle it so public pages still work
        return;
      }

      // 3. Token is valid — restore session
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("❌ Failed to parse stored user", e);
        clearStorage();
      }
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
