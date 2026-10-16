'use server';

import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { createElement } from 'react';

import { hit, hitsSoFar, visitorHash } from '@/lib/rate-limit';

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
  // Bot gibberish like "sMcJJBItIpYtIIycsBwkfJVl" is one long run of Latin letters. Messages in scripts without spaces,
  // like Chinese or Japanese, or a single link, still get through.
  if (/^[A-Za-z]{15,}$/.test(data.message.trim()))
    return 'message is gibberish';

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
    // The checks above only see what the browser sends, so a script calling this action directly gets past them.
    // These limits cap what it can send: a few attempts per visitor, and a ceiling of sent messages for everyone
    // together. Only sent messages count towards the ceiling, so failed attempts can't close the form for others.
    if (
      (await hit(`contact:${await visitorHash()}`, 60 * 60)) > 5 ||
      (await hitsSoFar('contact:sent')) >= 50
    ) {
      return {
        error: 'Too many messages at once. Please try again later.',
      };
    }

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
      // For clients that show or quote plain text: just who wrote and what
      text: `${name} (${email}) wrote through the contact form:\n\n${message}`,
    });
    // The message is out, so a failure to count it shouldn't be reported as a failed send
    await hit('contact:sent', 24 * 60 * 60).catch(() => {});

    return { success: true };
  } catch (err) {
    console.error('Error sending contact form email:', err);
    return { error: 'An unexpected error occurred' };
  }
}
