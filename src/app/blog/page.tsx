import Image from 'next/image';

import { NewspaperIcon, SendHorizontalIcon } from 'lucide-react';

import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { Button } from '@/components/ui/button';

export default async function BlogPage() {
  const session = await getCurrentSession();
  const posts = await prisma.post.findMany();

  return (
    <div>
      <div className='flex w-full max-w-5xl flex-col gap-4 border p-4 sm:p-8'>
        <h1 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <NewspaperIcon className='shrink-0' /> Blog
        </h1>
        <div className='min-w-80 border p-4 sm:p-8'>
          {session ? (
            <div className='flex items-center justify-center gap-4'>
              {session.user.avatarUrl && (
                <Image
                  src={session.user.avatarUrl}
                  alt={session.user.username}
                  width={64}
                  height={64}
                  className='size-16'
                />
              )}
              <div className='flex flex-col gap-2'>
                {session.user.displayName ? (
                  <p className='font-semibold'>{session.user.displayName}</p>
                ) : (
                  <p className='font-semibold'>@{session.user.username}</p>
                )}
                <form action='/api/auth/logout' method='POST'>
                  <Button type='submit' variant='destructive' size='sm'>
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center gap-2'>
              <p>Want to leave a comment?</p>
              <form action='/api/auth/login' method='GET'>
                <Button type='submit'>
                  <SendHorizontalIcon className='shrink-0' />
                  Log in with Discord
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
      <div>
        {posts.map((post) => (
          <div key={post.id} className='rounded-md border p-4'>
            <h2 className='text-xl font-semibold'>{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
