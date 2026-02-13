import z from 'zod';

export const mailSubmitSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 characters long'),
  email: z.email('Please enter a valid email address'),
  subject: z.string().min(2, 'Subject must be at least 2 characters long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters long')
    .max(5000, 'Message must be at most 5000 characters long'),
});

export type MailSubmitData = z.infer<typeof mailSubmitSchema>;
