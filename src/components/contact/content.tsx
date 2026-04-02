'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { MailIcon, SendHorizontalIcon } from 'lucide-react';

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <Card className='w-full max-w-5xl'>
      <CardHeader>
        <CardTitle className='text-primary-text flex items-center gap-2'>
          <MailIcon className='shrink-0' /> Get in Touch
        </CardTitle>
        <CardDescription className='text-balance'>
          I would love to hear from you! Whether you have a question, want to
          collaborate, or just want to say hello, feel free to reach out using
          the form below.
        </CardDescription>
      </CardHeader>
      <form id='contact' onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <FieldGroup className='gap-4'>
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
        </CardContent>
      </form>
    </Card>
  );
}
