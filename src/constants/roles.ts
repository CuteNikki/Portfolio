import type { Role } from '@/generated/prisma/enums';

// How roles are shown to people. Shared by server and client components, so it can't live in a 'use client' file:
// a server component importing from one gets a reference to the client module instead of the values.
export const ROLE_LABELS: Record<Role, string> = {
  USER: 'User',
  WRITER: 'Writer',
  ADMIN: 'Admin',
};
