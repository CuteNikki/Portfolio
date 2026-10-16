// The contact form's rules, shared by the form in the browser and the server's check, which keeps zod out of the
// browser. Each field's limits and the message shown when they're not met.
export const MAX_MESSAGE_LENGTH = 5000;

export const CONTACT_FIELDS = {
  name: {
    min: 1,
    max: 255,
    tooShort: 'Name must be at least 1 characters long',
    tooLong: 'Name must be at most 255 characters long',
  },
  email: {
    min: 1,
    max: 255,
    tooShort: 'Please enter a valid email address',
    tooLong: 'Email must be at most 255 characters long',
  },
  subject: {
    min: 2,
    max: 255,
    tooShort: 'Subject must be at least 2 characters long',
    tooLong: 'Subject must be at most 255 characters long',
  },
  message: {
    min: 10,
    max: MAX_MESSAGE_LENGTH,
    tooShort: 'Message must be at least 10 characters long',
    tooLong: `Message must be at most ${MAX_MESSAGE_LENGTH} characters long`,
  },
} as const;

export const INVALID_EMAIL = 'Please enter a valid email address';

// Minimum time between the form mounting and being submitted. Bots submit instantly.
export const MIN_SUBMIT_TIME_MS = 3000;
