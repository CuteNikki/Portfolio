'use client';

import { createContext, ReactNode, useContext } from 'react';

import type { PublicUser } from '@/lib/data';

// Only what the dashboard UI needs. The full session holds the session token and
// the user's Discord tokens, which must never reach the browser.
type AuthSession = { user: PublicUser };

const AuthContext = createContext<AuthSession | null>(null);

export function AuthProvider({
  children,
  session,
}: {
  children: ReactNode;

  session: AuthSession | null;
}) {
  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
