'use server';

import { revalidatePath, updateTag } from 'next/cache';
import z from 'zod';

import { Role } from '@/generated/prisma/enums';

import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function updateUserRole(formData: FormData) {
  const session = await getCurrentSession();

  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error('Unauthorized: only admins can update user roles');
  }

  const targetUserId = formData.get('userId') as string;
  const parsedRole = z.enum(Role).safeParse(formData.get('role'));

  if (!parsedRole.success) {
    throw new Error('Invalid role');
  }

  const newRole = parsedRole.data;

  if (session.user.id === targetUserId) {
    throw new Error('Invalid user: cannot change own role');
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new Error('Invalid user: user not found');
  }

  await prisma.user
    .update({
      where: { id: targetUserId },
      data: { role: newRole },
    })
    .catch((error) => {
      console.error('Error updating user role:', error);
      throw new Error('Internal server error: failed to update user role');
    });

  revalidateUserPaths();
}

export async function deleteUser(formData: FormData) {
  const session = await getCurrentSession();

  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error('Unauthorized: only admins can delete users');
  }

  const targetUserId = formData.get('userId') as string;

  if (session.user.id === targetUserId) {
    throw new Error('Invalid user: cannot delete own account');
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new Error('Invalid user: user not found');
  }

  // Comments, posts and projects block deleting their author, so they go first. Replies to the user's comments and
  // comments on their posts go with them.
  await prisma
    .$transaction([
      prisma.comment.deleteMany({ where: { authorId: targetUserId } }),
      prisma.post.deleteMany({ where: { writerId: targetUserId } }),
      prisma.project.deleteMany({ where: { writerId: targetUserId } }),
      prisma.user.delete({ where: { id: targetUserId } }),
    ])
    .catch((error) => {
      console.error('Error deleting user:', error);
      throw new Error('Internal server error: failed to delete user');
    });

  revalidateUserPaths();
}

export async function checkNavPermissions() {
  const session = await getCurrentSession();

  if (!session) return false;
  return session.user.role === Role.ADMIN || session.user.role === Role.WRITER;
}

// Roles and authors show up on cached posts, projects and comments
function revalidateUserPaths() {
  updateTag('posts');
  updateTag('projects');
  revalidatePath('/dashboard/users');
}
