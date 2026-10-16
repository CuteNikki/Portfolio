'use client';

import { useTransition } from 'react';

import { MonitorIcon, SmartphoneIcon, TabletIcon } from 'lucide-react';
import { toast } from '@/lib/toast';

import { signOutDevice, signOutOtherDevices } from '@/actions/account';

import type { ActionResult } from '@/lib/action-result';

import type { DeviceKind } from '@/lib/user-agent';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface Device {
  id: string;
  name: string;
  kind: DeviceKind;
  lastUsed: string;
  signedIn: string;
  current: boolean;
}

const ICONS = {
  phone: SmartphoneIcon,
  tablet: TabletIcon,
  computer: MonitorIcon,
};

const message = (error: unknown) =>
  error instanceof Error ? error.message : 'Unknown error';

export function DeviceList({ devices }: { devices: Device[] }) {
  const [pending, startTransition] = useTransition();
  const others = devices.filter((device) => !device.current).length;

  const run = (action: () => Promise<ActionResult>, done: string) =>
    startTransition(async () => {
      try {
        const { error } = await action();
        if (error) toast.error('That didn’t work', { description: error });
        else toast.success(done);
      } catch (error) {
        toast.error('That didn’t work', { description: message(error) });
      }
    });

  return (
    <div className='flex flex-col gap-4'>
      <ul className='flex flex-col divide-y'>
        {devices.map((device) => {
          const Icon = ICONS[device.kind];
          return (
            <li key={device.id} className='flex items-center gap-4 py-3.5'>
              <Icon
                aria-hidden
                className='text-muted-foreground size-5 shrink-0'
              />
              <div className='min-w-0 flex-1'>
                <p className='flex flex-wrap items-center gap-2 text-sm font-semibold'>
                  {device.name}
                  {device.current && (
                    <Badge variant='secondary'>This device</Badge>
                  )}
                </p>
                <p className='text-muted-foreground text-xs'>
                  Last used {device.lastUsed} · signed in {device.signedIn}
                </p>
              </div>
              {!device.current && (
                <Button
                  variant='destructive'
                  size='sm'
                  disabled={pending}
                  aria-label={`Sign out ${device.name}, last used ${device.lastUsed}`}
                  onClick={() =>
                    run(
                      () => signOutDevice(device.id),
                      'Signed that device out',
                    )
                  }
                >
                  Sign out
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      {others > 0 && (
        <Button
          variant='destructive'
          className='self-start'
          disabled={pending}
          onClick={() =>
            run(signOutOtherDevices, 'Signed out your other devices')
          }
        >
          Sign out others
        </Button>
      )}
    </div>
  );
}
