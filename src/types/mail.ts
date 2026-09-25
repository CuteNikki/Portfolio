import z from 'zod';

export const MAX_MESSAGE_LENGTH = 5000;

export const mailSubmitSchema = z.object({
  name: z
    .string('Name must be a valid string')
    .min(1, 'Name must be at least 1 characters long')
    .max(255, 'Name must be at most 255 characters long'),
  email: z
    .email('Please enter a valid email address')
    .max(255, 'Email must be at most 255 characters long'),
  subject: z
    .string('Subject must be a valid string')
    .min(2, 'Subject must be at least 2 characters long')
    .max(255, 'Subject must be at most 255 characters long'),
  message: z
    .string('Message must be a valid string')
    .min(10, 'Message must be at least 10 characters long')
    .max(
      MAX_MESSAGE_LENGTH,
      `Message must be at most ${MAX_MESSAGE_LENGTH} characters long`,
    ),
});

export type MailSubmitData = z.infer<typeof mailSubmitSchema>;

// Minimum time between the form mounting and being submitted. Bots submit instantly.
export const MIN_SUBMIT_TIME_MS = 3000;

export const antiSpamSchema = z.object({
  // Honeypot: hidden from humans, so it must stay empty
  website: z.string(),
  // Milliseconds the form was open before submitting
  elapsedMs: z.number(),
});

export type AntiSpamData = z.infer<typeof antiSpamSchema>;
