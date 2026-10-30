import { Suspense } from 'react';

import { DownloadIcon, LogInIcon, RefreshCwIcon } from 'lucide-react';

import { getDisplaySession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { describeDevice } from '@/lib/user-agent';
import { formatShortDate, shorten } from '@/lib/utils';

import { LINKS } from '@/constants/links';
import { ROLE_LABELS } from '@/constants/roles';
import { SITE_METADATA } from '@/constants/metadata';

import { CommentList } from '@/components/account/comment-list';
import { DeleteAccount } from '@/components/account/delete-account';
import { DeviceList } from '@/components/account/device-list';
import { PageHeader } from '@/components/common/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const { account: metadata } = SITE_METADATA;

export default function AccountPage() {
  return (
    // A column down the middle of the page, like posts and the legal pages
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-10'>
      <PageHeader
        eyebrow='Account'
        title='Your account.'
        description="Your profile, your comments and the devices you're signed in on, all in one place."
      />
      {/* Reads the session, so it streams in after the prerendered header */}
      <Suspense fallback={<AccountSkeleton />}>
        <AccountContent />
      </Suspense>
    </div>
  );
}

async function AccountContent() {
  const session = await getDisplaySession();

  if (!session) {
    return (
      <section
        data-reveal=''
        className='bg-card flex flex-col items-start gap-4 rounded-xl border p-8 sm:flex-row sm:items-center sm:justify-between'
      >
        <div>
          <h2 className='text-lg font-bold tracking-[-0.03em]'>
            Not signed in
          </h2>
          <p className='text-body mt-1 text-sm'>
            Sign in with Discord to see your profile, comments and devices.
          </p>
        </div>
        <Button asChild>
          {/* A plain link: a prefetch of the login route would start a new login and replace one in progress */}
          <a href={`/api/auth/login?next=${encodeURIComponent('/account')}`}>
            <LogInIcon />
            Sign in
          </a>
        </Button>
      </section>
    );
  }

  const { user } = session;
  const [comments, sessions] = await Promise.all([
    prisma.comment.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { post: { select: { id: true, title: true, slug: true } } },
    }),
    prisma.session.findMany({
      where: { userId: user.id, expiresAt: { gt: new Date() } },
      orderBy: { lastSeenAt: 'desc' },
    }),
  ]);

  const name = user.displayName ?? user.username;

  return (
    <div className='flex flex-col gap-5'>
      <Section id='profile' title='Profile'>
        <div className='flex flex-wrap items-center gap-5'>
          <Avatar className='size-16 rounded-xl after:rounded-xl'>
            <AvatarImage src={user.avatarUrl} alt='' className='rounded-xl' />
            <AvatarFallback className='rounded-xl text-lg'>
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <p className='text-lg font-bold tracking-[-0.03em]'>{name}</p>
            <p className='text-muted-foreground text-[13px]'>
              @{user.username} · {ROLE_LABELS[user.role]} · member since{' '}
              {formatShortDate(user.createdAt)}
            </p>
          </div>
        </div>
        <div className='mt-5 flex flex-wrap items-center justify-between gap-4'>
          <p className='text-muted-foreground max-w-md text-[13px] leading-relaxed'>
            Your name and picture come from Discord. Changed them there? Refresh
            to bring them over.
          </p>
          <Button asChild variant='outline'>
            {/* Signs in with Discord again and comes back here. A plain link: a prefetch would start a login. */}
            <a
              href={`/api/auth/login?refresh=1&next=${encodeURIComponent('/account')}`}
            >
              <RefreshCwIcon />
              Refresh
            </a>
          </Button>
        </div>
      </Section>

      <Section id='comments' title='Your comments' count={comments.length}>
        <CommentList
          comments={comments.map((comment) => ({
            id: comment.id,
            excerpt: shorten(comment.content, 200),
            date: formatShortDate(comment.createdAt),
            postTitle: comment.post.title,
            postHref: `${LINKS.postWithSlugOrId(comment.post.slug ?? comment.post.id).url}#comments`,
            postSlug: comment.post.slug ?? '',
            isReply: comment.parentId !== null,
          }))}
        />
      </Section>

      <Section id='devices' title='Signed-in devices' count={sessions.length}>
        <DeviceList
          devices={sessions.map((s) => ({
            id: s.id,
            ...describeDevice(s.userAgent),
            lastUsed: formatShortDate(s.lastSeenAt),
            signedIn: formatShortDate(s.createdAt),
            current: s.id === session.id,
          }))}
        />
      </Section>

      <Section id='data' title='Your data'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <p className='text-body max-w-md text-sm'>
            Download your profile, comments and devices as a JSON file.
          </p>
          <Button asChild variant='outline'>
            {/* A plain link, so the browser downloads the file instead of the app navigating to it */}
            <a href='/api/account/export' download>
              <DownloadIcon />
              Download
            </a>
          </Button>
        </div>
      </Section>

      <section
        id='delete'
        aria-labelledby='delete-heading'
        className='bg-card border-destructive/30 flex scroll-mt-28 flex-wrap items-center justify-between gap-4 rounded-xl border p-6'
      >
        <div className='max-w-md'>
          <h2
            id='delete-heading'
            className='text-destructive text-base font-bold'
          >
            Delete account
          </h2>
          <p className='text-body mt-1 text-sm'>
            Removes your profile, your comments and every signed-in device.
            Posts and projects you wrote stay. This can't be undone.
          </p>
        </div>
        <DeleteAccount
          username={user.username}
          commentCount={comments.length}
        />
      </section>
    </div>
  );
}

function Section({
  id,
  title,
  count,
  children,
}: {
  id: string;
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className='bg-card scroll-mt-28 rounded-xl border p-6'
    >
      <h2 id={`${id}-heading`} className='mb-4 text-base font-bold'>
        {title}
        {count !== undefined && (
          <span className='text-muted-foreground ml-2 font-normal'>
            {count}
          </span>
        )}
      </h2>
      {children}
    </section>
  );
}

function AccountSkeleton() {
  return (
    <div className='flex flex-col gap-5'>
      <Skeleton className='h-36 w-full rounded-xl' />
      <Skeleton className='h-56 w-full rounded-xl' />
    </div>
  );
}
