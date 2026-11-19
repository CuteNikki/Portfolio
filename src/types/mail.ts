import z from 'zod';

import { CONTACT_FIELDS, INVALID_EMAIL } from '@/constants/contact';

export { MAX_MESSAGE_LENGTH, MIN_SUBMIT_TIME_MS } from '@/constants/contact';

const { name, email, subject, message } = CONTACT_FIELDS;

export const mailSubmitSchema = z.object({
  name: z
    .string('Name must be a valid string')
    .min(name.min, name.tooShort)
    .max(name.max, name.tooLong),
  email: z.email(INVALID_EMAIL).max(email.max, email.tooLong),
  subject: z
    .string('Subject must be a valid string')
    .min(subject.min, subject.tooShort)
    .max(subject.max, subject.tooLong),
  message: z
    .string('Message must be a valid string')
    .min(message.min, message.tooShort)
    .max(message.max, message.tooLong),
});

export type MailSubmitData = z.infer<typeof mailSubmitSchema>;

export const antiSpamSchema = z.object({
  // Honeypot: hidden from humans, so it must stay empty
  website: z.string(),
  // Milliseconds the form was open before submitting
  elapsedMs: z.number(),
});

export type AntiSpamData = z.infer<typeof antiSpamSchema>;
