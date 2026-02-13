'use server';

import { Resend } from 'resend';

import { ContactTemplate } from '@/components/resend/contact-template';

import { MailSubmitData, mailSubmitSchema } from '@/types/mail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(data: MailSubmitData) {
  const validatedFields = mailSubmitSchema.safeParse(data);

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
