'use server';

import { revalidatePath } from 'next/cache';

import { Role } from '../../generated/prisma/enums';

import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function updateUserRole(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.ADMIN) {
    throw new Error('Unauthorized: only admins can update user roles');
  }

  const targetUserId = formData.get('userId') as string;
  const newRole = formData.get('role') as Role;

  if (currentUser.id === targetUserId) {
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

  revalidatePath('/admin/users');
}
