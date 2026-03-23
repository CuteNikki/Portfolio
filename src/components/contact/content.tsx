'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { SendHorizontalIcon } from 'lucide-react';

import { sendMail } from '@/actions/mail';

import { LINKS } from '@/constants/links';
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
    <div className='flex flex-col gap-4'>
      <div className='flex max-w-3xl flex-col gap-2 pb-4'>
        <h1 className='text-3xl font-bold'>
          Get in <span className='text-primary-text'>Touch</span>.
        </h1>
        <p>
          I would love to hear from you! Whether you have a question, want to
          collaborate, or just want to say hello, feel free to reach out using
          the form below.
        </p>
      </div>
      <div>
        <form id='contact' onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className='border p-4 sm:p-8'>
            <FieldGroup className='md:flex-row'>
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
            <FieldDescription>
              By submitting this form, you agree to the{' '}
              <Link href={LINKS.privacy.url}>{LINKS.privacy.label}</Link>.
            </FieldDescription>
            <div>
              <Field orientation='horizontal'>
                <Button
                  type='submit'
                  form='contact'
                  disabled={form.formState.isSubmitting}
                >
                  <SendHorizontalIcon />
                  Submit
                </Button>
              </Field>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
