'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isPro?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If Supabase is configured
    if (supabase) {
      // Check active session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || 'Dreamer',
            email: session.user.email || '',
            avatarUrl: session.user.user_metadata.avatar_url,
            isPro: false // Placeholder for future stripe integration
          });
        }
        setIsLoading(false);
      });

      // Listen for changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || 'Dreamer',
            email: session.user.email || '',
            avatarUrl: session.user.user_metadata.avatar_url,
            isPro: false
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // FALLBACK: Simulated Auth if Supabase not configured
      const storedUser = localStorage.getItem('dwt_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user data from localStorage fallback", e);
          localStorage.removeItem('dwt_user');
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) alert(error.message);
    } else {
      // Fallback Logic
      setIsLoading(true);
      setTimeout(() => {
        const mockUser: User = {
          id: 'u1',
          name: 'Alice Storyteller',
          email: 'alice@dreamweave.tales',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
          isPro: true
        };
        setUser(mockUser);
        localStorage.setItem('dwt_user', JSON.stringify(mockUser));
        setIsLoading(false);
      }, 1000);
    }
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
    } else {
      // Fallback Logic
      setIsLoading(true);
      setTimeout(() => {
        setUser(null);
        localStorage.removeItem('dwt_user');
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
