import Image from 'next/image';
import Link from 'next/link';

import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { Button } from '@/components/ui/button';
import { SendHorizontalIcon } from 'lucide-react';

export default async function BlogPage() {
  const user = await getCurrentUser();
  const posts = await prisma.post.findMany();

  return (
    <div>
      <h1 className='text-3xl font-bold'>Blog</h1>

      <div className='border p-4'>
        {user ? (
          <div className='flex items-center justify-center gap-4'>
            {user.avatarUrl && (
              <Image
                src={user.avatarUrl}
                alt={user.username}
                width={64}
                height={64}
                className='size-16'
              />
            )}
            <div className='flex flex-col gap-2'>
              {user.displayName ? (
                <p className='font-semibold'>{user.displayName}</p>
              ) : (
                <p className='font-semibold'>@{user.username}</p>
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
            <Button asChild>
              <Link
                href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI as string)}&response_type=code&scope=identify`}
              >
                <SendHorizontalIcon className='shrink-0' />
                Log in with Discord
              </Link>
            </Button>
          </div>
        )}
      </div>

      {posts.map((post) => (
        <div key={post.id} className='rounded-md border p-4'>
          <h2 className='text-xl font-semibold'>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
