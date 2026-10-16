'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { cookies } from 'next/headers';

import { Role } from '@/generated/prisma/enums';

import { getCurrentSession, SESSION_COOKIE } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Messages go back as values rather than thrown errors: a production build replaces a thrown error's message with a
// generic one, and these are meant to be read.
export type ActionResult = { error?: string };

const NOT_SIGNED_IN = 'You need to be signed in.';

/**
 * Signs one of your other devices out. The device you're using signs out with the Sign out button instead.
 */
export async function signOutDevice(sessionId: string): Promise<ActionResult> {
  const session = await getCurrentSession();
  if (!session) return { error: NOT_SIGNED_IN };
  if (sessionId === session.id) {
    return { error: 'Use Sign out to sign this device out.' };
  }

  // Only ever one of your own sessions
  await prisma.session.deleteMany({
    where: { id: sessionId, userId: session.user.id },
  });

  revalidatePath('/account');
  return {};
}

/**
 * Signs out every device you're signed in on except this one.
 */
export async function signOutOtherDevices(): Promise<ActionResult> {
  const session = await getCurrentSession();
  if (!session) return { error: NOT_SIGNED_IN };

  await prisma.session.deleteMany({
    where: { userId: session.user.id, NOT: { id: session.id } },
  });

  revalidatePath('/account');
  return {};
}

/**
 * Deletes your account: your comments (and the replies to them), your devices and your place on author lists. Posts
 * and projects stay, since others may have written them too. You confirm by typing your username.
 */
export async function deleteAccount(
  confirmation: string,
): Promise<ActionResult> {
  const session = await getCurrentSession();
  if (!session) return { error: NOT_SIGNED_IN };
  const { user } = session;

  if (confirmation.trim().toLowerCase() !== user.username.toLowerCase()) {
    return { error: 'Type your username to confirm.' };
  }

  // The site always keeps an admin, or nobody could manage users any more
  if (user.role === Role.ADMIN) {
    const admins = await prisma.user.count({ where: { role: Role.ADMIN } });
    if (admins <= 1) {
      return {
        error:
          'You are the only admin. Make someone else an admin before deleting your account.',
      };
    }
  }

  // Comments block deleting their author, so they go first. Sessions and author lists go with the user.
  await prisma.$transaction([
    prisma.comment.deleteMany({ where: { authorId: user.id } }),
    prisma.user.delete({ where: { id: user.id } }),
  ]);

  (await cookies()).delete(SESSION_COOKIE);

  // Author lists and comments show on cached posts and projects
  updateTag('posts');
  updateTag('projects');
  return {};
}
