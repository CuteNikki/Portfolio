'use server';

import { revalidatePath, updateTag } from 'next/cache';
import z from 'zod';

import { Role } from '@/generated/prisma/enums';

import type { ActionResult } from '@/lib/action-result';
import { getCurrentSession } from '@/lib/auth';
import { readText } from '@/lib/form-fields';
import prisma from '@/lib/prisma';

export async function updateUserRole(
  formData: FormData,
): Promise<ActionResult> {
  const session = await getCurrentSession();

  if (!session || session.user.role !== Role.ADMIN) {
    return { error: 'Only admins can change roles.' };
  }

  const targetUserId = readText(formData, 'userId');
  const parsedRole = z.enum(Role).safeParse(formData.get('role'));

  if (!parsedRole.success) {
    return { error: 'That isn’t a role.' };
  }

  if (session.user.id === targetUserId) {
    return { error: 'You can’t change your own role.' };
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    return { error: 'That user doesn’t exist any more.' };
  }

  try {
    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: parsedRole.data },
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return { error: 'The role couldn’t be saved. Please try again.' };
  }

  revalidateUserPaths();
  return {};
}

export async function deleteUser(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();

  if (!session || session.user.role !== Role.ADMIN) {
    return { error: 'Only admins can delete users.' };
  }

  const targetUserId = readText(formData, 'userId');

  if (session.user.id === targetUserId) {
    return { error: 'Delete your own account on the account page.' };
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    return { error: 'That user doesn’t exist any more.' };
  }

  // Comments block deleting their author, so they go first, along with the replies to them. Posts and projects can
  // have other authors, so they stay: deleting the user only takes them off the author lists.
  try {
    await prisma.$transaction([
      prisma.comment.deleteMany({ where: { authorId: targetUserId } }),
      prisma.user.delete({ where: { id: targetUserId } }),
    ]);
  } catch (error) {
    console.error('Error deleting user:', error);
    return { error: 'The user couldn’t be deleted. Please try again.' };
  }

  revalidateUserPaths();
  return {};
}

// Roles and authors show up on cached posts, projects and comments
function revalidateUserPaths() {
  updateTag('posts');
  updateTag('projects');
  updateTag('comments');
  revalidatePath('/dashboard/users');
}
