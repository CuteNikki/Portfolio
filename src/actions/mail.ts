'use server';

import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { createElement } from 'react';

import { ContactTemplate } from '@/components/resend/contact-template';

import {
  AntiSpamData,
  antiSpamSchema,
  MailSubmitData,
  mailSubmitSchema,
  MIN_SUBMIT_TIME_MS,
} from '@/types/mail';

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
    // Our mail server, e.g. smtps://no-reply%40niso.moe:password@mail.niso.moe
    const url = process.env.SMTP_URL;
    if (!url) throw new Error('Set SMTP_URL to send emails.');

    const { name, email, subject, message } = validatedFields.data;

    await nodemailer.createTransport(url).sendMail({
      // The visitor's name, but our address: the server only sends as its own accounts
      from: {
        name: `${name} via Contact Form`,
        address: process.env.EMAIL_FROM ?? '',
      },
      to: `Contact Form <${process.env.EMAIL_TO}>`,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: await render(
        createElement(ContactTemplate, { name, email, subject, message }),
      ),
      // Written out rather than generated from the HTML, which brings along the
      // preview text's invisible padding as rows of blank lines
      text: `${name} (${email}) wrote through the contact form:\n\n${message}`,
    });

    return { success: true };
  } catch (err) {
    console.error('Error sending contact form email:', err);
    return { error: 'An unexpected error occurred' };
  }
}
