'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { MailIcon, SendHorizontalIcon } from 'lucide-react';

import { DiscordMenu } from '@/components/navigation/discord-menu';
import { ScrollReveal } from '@/components/common/scroll-reveal';
import { sendMail } from '@/actions/mail';

import { LINKS } from '@/constants/links';
import { PERSONAL_DETAILS } from '@/constants/personal';
import { cn } from '@/lib/utils';
import {
  MailSubmitData,
  mailSubmitSchema,
  MAX_MESSAGE_LENGTH,
} from '@/types/mail';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';

export function ContactContent() {
  const form = useForm<MailSubmitData>({
    resolver: zodResolver(mailSubmitSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(data: MailSubmitData) {
    const result = await sendMail(data);

    if (result.error) {
      toast.error('Something went wrong!', {
        description: result.error,
      });

      return;
    }

    toast.success('Message sent!', {
      description: 'Thanks for reaching out! I will get back to you soon.',
    });

    form.reset();
  }

  return (
    <ScrollReveal className='w-full max-w-6xl'>
      <section className='w-full'>
      <div className='grid lg:grid-cols-[0.8fr_1.2fr]'>
        <div data-reveal-item style={{ '--reveal-index': 0 } as React.CSSProperties} className='flex flex-col gap-5 border-b-0 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10'>
          <p className='text-primary-text flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]'><MailIcon className='size-4' /> Contact</p>
          <h1 className='text-4xl tracking-tight sm:text-5xl'>Let&apos;s talk.</h1>
          <p className='text-muted-foreground max-w-sm text-balance leading-relaxed'>
            Have a question, an idea, or a project in mind? Send a note and I&apos;ll get back to you soon.
          </p>
          <div className='mt-auto flex flex-col gap-4 border-t pt-5 text-sm'>
            <div className='flex flex-col gap-2'>
              <span className='text-muted-foreground'>Prefer email?</span>
              <a className='hover:text-primary-text font-medium transition-colors' href={PERSONAL_DETAILS.emailLink}>{PERSONAL_DETAILS.email}</a>
            </div>
            <div className='flex flex-wrap items-center gap-x-5 gap-y-3'>
              {PERSONAL_DETAILS.socials.filter(({ platform }) => platform !== 'Mail' && platform !== 'Discord').map(({ platform, icon: Icon, url }) => (
                <Link key={platform} href={url} target='_blank' rel='noopener noreferrer' className='text-muted-foreground hover:text-primary-text flex items-center gap-2 transition-colors'>
                  <Icon className='size-4' />
                  {platform}
                </Link>
              ))}
              <DiscordMenu />
            </div>
          </div>
                </div>
        <form id='contact' onSubmit={form.handleSubmit(onSubmit)}>
        <div data-reveal-item style={{ '--reveal-index': 1 } as React.CSSProperties} className='p-6 sm:p-8 md:p-10'>
          <FieldGroup className='gap-4'>
            <FieldGroup className='lg:flex-row'>
              <Controller
                name='name'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='contact-name'>Your Name</FieldLabel>
                    <Input
                      {...field}
                      id='contact-name'
                      aria-invalid={fieldState.invalid}
                      placeholder='Nikki'
                      autoComplete='off'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='contact-email'>Your Email</FieldLabel>
                    <Input
                      {...field}
                      id='contact-email'
                      aria-invalid={fieldState.invalid}
                      placeholder='contact@niso.moe'
                      type='email'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Controller
              name='subject'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='contact-subject'>Subject</FieldLabel>
                  <Input
                    {...field}
                    id='contact-subject'
                    placeholder='*insert some subject here*'
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='message'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='contact-message'>Message</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id='contact-message'
                      placeholder='Drop a note with any feedback or just say hi! 👋'
                      rows={6}
                      className='min-h-24 resize-none'
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align='block-end'>
                      <InputGroupText
                        className={cn(
                          'tabular-nums',
                          (field.value?.length ?? 0) > MAX_MESSAGE_LENGTH &&
                            'text-destructive',
                        )}
                      >
                        {field.value?.length ?? 0}/{MAX_MESSAGE_LENGTH}{' '}
                        characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className='flex items-center flex-col sm:flex-row gap-4 justify-between'>
              <FieldDescription>
                By submitting this form, you agree to the{' '}
                <Link href={LINKS.privacy.url}>{LINKS.privacy.label}</Link>.
              </FieldDescription>
              <Button
                type='submit'
                form='contact'
                disabled={form.formState.isSubmitting}
              >
                <SendHorizontalIcon />
                Submit
              </Button>
            </div>
          </FieldGroup>
        </div>
      </form>
      </div>
      </section>
    </ScrollReveal>
  );
}
