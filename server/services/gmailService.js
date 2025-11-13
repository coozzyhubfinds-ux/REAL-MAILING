import nodemailer from 'nodemailer';
import { getSupabase } from '../utils/supabaseClient.js';
import { logError, logInfo } from '../utils/logger.js';

const {
  GMAIL_USER,
  GMAIL_PASS,
  SEND_DELAY_SECONDS_MIN = 45,
  SEND_DELAY_SECONDS_MAX = 120
} = process.env;

let transporter;

export const getTransporter = () => {
  if (!transporter) {
    if (!GMAIL_USER || !GMAIL_PASS) {
      throw new Error('GMAIL_USER and GMAIL_PASS must be configured to send mail.');
    }
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
      }
    });
  }
  return transporter;
};

export const sendMail = async ({ to, subject, text, html, leadId, campaignId }) => {
  try {
    const mailer = getTransporter();
    const info = await mailer.sendMail({
      from: GMAIL_USER,
      to,
      subject,
      text,
      html: html || text
    });

    try {
      const supabase = getSupabase();
      await supabase.from('emails').insert({
        lead_id: leadId,
        campaign_id: campaignId,
        message_id: info.messageId,
        status: 'sent',
        sent_at: new Date().toISOString(),
        raw_response: info
      });
    } catch (dbError) {
      logError('Failed to log email in Supabase', { error: dbError.message });
    }

    return { messageId: info.messageId, response: info.response };
  } catch (error) {
    logError('Error sending email', { error: error.message, to });
    throw error;
  }
};

const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export const sendWithDelay = async (messages = []) => {
  const summary = { attempted: 0, sent: 0, failed: 0, errors: [] };

  for (const message of messages) {
    summary.attempted += 1;
    const minDelay = Number(SEND_DELAY_SECONDS_MIN);
    const maxDelay = Number(SEND_DELAY_SECONDS_MAX);
    const delaySeconds = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    try {
      await sendMail(message);
      summary.sent += 1;
      logInfo('Email sent', { to: message.to, delaySeconds });
    } catch (error) {
      summary.failed += 1;
      summary.errors.push({ to: message.to, error: error.message });
    }

    if (summary.attempted < messages.length) {
      await sleep(delaySeconds);
    }
  }

  return summary;
};

/**
 * Gmail API OAuth Option (placeholder)
 *
 * To use Gmail API instead of SMTP:
 *
 * import { google } from 'googleapis';
 *
 * const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
 * oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
 *
 * const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
 * await gmail.users.messages.send({
 *   userId: 'me',
 *   requestBody: {
 *     raw: base64EncodedMessage
 *   }
 * });
 */

export default {
  sendMail,
  sendWithDelay,
  getTransporter
};

