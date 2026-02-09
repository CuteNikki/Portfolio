'use server';

import { Resend } from 'resend';
import { z } from 'zod';

import { ContactTemplate } from '@/components/resend/contact-template';

const resend = new Resend(process.env.RESEND_API_KEY);

const formSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  subject: z.string().min(2),
  message: z.string().min(10).max(5000),
});

export async function submitContactForm(data: z.infer<typeof formSchema>) {
  const validatedFields = formSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const { error } = await resend.emails.send({
      from: `Contact Form <${process.env.RESEND_EMAIL_FROM}>`,
      to: [`Contact Form <${process.env.RESEND_EMAIL_TO}>`],
      replyTo: validatedFields.data.email,
      subject: `[Portfolio] ${validatedFields.data.subject}`,
      react: await ContactTemplate({
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        subject: validatedFields.data.subject,
        message: validatedFields.data.message,
      }),
    });

    if (error) return { error: 'Failed to send email' };
    return { success: true };
  } catch (err) {
    console.error('Error sending contact form email:', err);
    return { error: 'An unexpected error occurred' };
  }
}
