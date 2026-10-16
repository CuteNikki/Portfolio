'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useTransition } from 'react';

import { SendHorizontalIcon } from 'lucide-react';

import { sendMail } from '@/actions/mail';

import {
  CONTACT_FIELDS,
  INVALID_EMAIL,
  MAX_MESSAGE_LENGTH,
} from '@/constants/contact';
import { LINKS } from '@/constants/links';

import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';

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

type FieldName = keyof typeof CONTACT_FIELDS;
type Values = Record<FieldName, string>;

const EMPTY: Values = { name: '', email: '', subject: '', message: '' };
// Close enough to what the server accepts; the server checks properly
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The same rules as the server's check, without shipping a validation library to the browser
function errorsOf(values: Values) {
  const errors: Partial<Record<FieldName, string>> = {};
  for (const name of Object.keys(CONTACT_FIELDS) as FieldName[]) {
    const rule = CONTACT_FIELDS[name];
    const value = values[name];
    if (value.length < rule.min) errors[name] = rule.tooShort;
    else if (value.length > rule.max) errors[name] = rule.tooLong;
    else if (name === 'email' && !EMAIL_PATTERN.test(value))
      errors[name] = INVALID_EMAIL;
  }
  return errors;
}

function msSince(timestamp: number) {
  return Date.now() - timestamp;
}

export function ContactForm() {
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountedAtRef = useRef(0);
  const [values, setValues] = useState(EMPTY);
  // Errors show after the first attempt to send, then follow the typing
  const [attempted, setAttempted] = useState(false);
  const [pending, startTransition] = useTransition();

  // Runs again each time the page shows: Next keeps it alive in the background. Coming back starts without the last
  // visit's errors; what was typed stays.
  useEffect(() => {
    mountedAtRef.current = Date.now();
    return () => setAttempted(false);
  }, []);

  const errors = attempted ? errorsOf(values) : {};
  const field = (name: FieldName) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setValues((current) => ({ ...current, [name]: event.target.value })),
  });
  const error = (name: FieldName) =>
    errors[name] && (
      <FieldError id={`contact-${name}-error`}>{errors[name]}</FieldError>
    );

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    const found = errorsOf(values);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    startTransition(async () => {
      // A network error or a deploy that changed the action rejects instead of returning an error
      const result = await sendMail(values, {
        website: honeypotRef.current?.value ?? '',
        elapsedMs: msSince(mountedAtRef.current),
      }).catch(() => ({
        error: 'Could not reach the server. Please try again.',
      }));

      if ('error' in result && result.error) {
        toast.error('Something went wrong!', { description: result.error });
        return;
      }

      toast.success('Message sent!', {
        description: 'Thanks for reaching out! I will get back to you soon.',
      });
      setValues(EMPTY);
      setAttempted(false);
    });
  };

  return (
    <form id='contact' noValidate onSubmit={submit}>
      <div>
        {/* Honeypot: invisible to humans, bots fill it in */}
        <div
          aria-hidden
          className='absolute left-[-9999px] h-px w-px overflow-hidden'
        >
          <label htmlFor='contact-website'>Website</label>
          <input
            ref={honeypotRef}
            id='contact-website'
            name='website'
            type='text'
            tabIndex={-1}
            autoComplete='off'
            defaultValue=''
          />
        </div>
        <FieldGroup className='gap-4'>
          <FieldGroup className='lg:flex-row'>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor='contact-name'>Name</FieldLabel>
              <Input
                {...field('name')}
                placeholder='Your name'
                autoComplete='name'
              />
              {error('name')}
            </Field>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor='contact-email'>Email</FieldLabel>
              <Input
                {...field('email')}
                type='email'
                placeholder='you@example.com'
                autoComplete='email'
              />
              {error('email')}
            </Field>
          </FieldGroup>

          <Field data-invalid={!!errors.subject}>
            <FieldLabel htmlFor='contact-subject'>Subject</FieldLabel>
            <Input {...field('subject')} placeholder='What it’s about' />
            {error('subject')}
          </Field>
          <Field data-invalid={!!errors.message}>
            <FieldLabel htmlFor='contact-message'>Message</FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                {...field('message')}
                placeholder='Drop a note with any feedback or just say hi! 👋'
                rows={6}
                className='min-h-24 resize-none'
              />
              <InputGroupAddon align='block-end'>
                <InputGroupText
                  className={cn(
                    'tabular-nums',
                    values.message.length > MAX_MESSAGE_LENGTH &&
                      'text-destructive',
                  )}
                >
                  {values.message.length}/{MAX_MESSAGE_LENGTH} characters
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {error('message')}
          </Field>
          <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <FieldDescription>
              By submitting this form, you agree to the{' '}
              <Link href={LINKS.privacy.url}>{LINKS.privacy.label}</Link>.
            </FieldDescription>
            <Button type='submit' disabled={pending}>
              <SendHorizontalIcon />
              Submit
            </Button>
          </div>
        </FieldGroup>
      </div>
    </form>
  );
}
