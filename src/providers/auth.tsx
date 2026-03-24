'use client';

import { createContext, ReactNode, useContext } from 'react';

import type { Session, User } from '../../generated/prisma/browser';

const AuthContext = createContext<(Session & { user: User }) | null>(null);

export function AuthProvider({
  children,

  session,
}: {
  children: ReactNode;

  session: (Session & { user: User }) | null;
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
