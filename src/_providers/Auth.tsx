// src/app/_providers/Auth.tsx
'use client';
import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { Member } from '../payload-types';

interface AuthContextType {
  user: Member | null | undefined;
  setUser: React.Dispatch<React.SetStateAction<Member | null | undefined>>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Member | null | undefined>();

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/get-member');
      const data = await res.json() as { member?: Member | null };
      setUser(data.member ?? null);
    } catch (err) {
      console.error('Failed to refresh user:', err);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};