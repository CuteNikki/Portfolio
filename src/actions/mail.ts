'use server';

import { Resend } from 'resend';

import { ContactTemplate } from '@/components/resend/contact-template';

import {
  AntiSpamData,
  antiSpamSchema,
  MailSubmitData,
  mailSubmitSchema,
  MIN_SUBMIT_TIME_MS,
} from '@/types/mail';

const resend = new Resend(process.env.RESEND_API_KEY);

function getSpamReason(data: MailSubmitData, antiSpam: unknown) {
  const validatedAntiSpam = antiSpamSchema.safeParse(antiSpam);
  if (!validatedAntiSpam.success) return 'missing anti-spam data';

  const { website, elapsedMs } = validatedAntiSpam.data;
  if (website) return 'honeypot filled';
  if (elapsedMs < MIN_SUBMIT_TIME_MS) return 'submitted too fast';
  // Real messages contain spaces, bot gibberish like "sMcJJBItIpYtIIycsBwkfJVl" does not
  if (!/\s/.test(data.message.trim())) return 'message has no whitespace';

  return null;
}

export async function sendMail(data: MailSubmitData, antiSpam: AntiSpamData) {
  const validatedFields = mailSubmitSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const spamReason = getSpamReason(validatedFields.data, antiSpam);
  if (spamReason) {
    console.warn(`Dropped contact form submission: ${spamReason}`);
    // Pretend it worked so bots don't adapt
    return { success: true };
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
