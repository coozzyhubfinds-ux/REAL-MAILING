import 'dotenv/config';
import { sendMail } from './services/gmailService.js';

const recipient = process.argv[2];

if (!recipient) {
  console.error('Usage: node send_test_email.js recipient@example.com');
  process.exit(1);
}

sendMail({
  to: recipient,
  subject: 'ColdEmail-Automation Test',
  text: 'This is a test email from the ColdEmail-Automation backend.',
  leadId: null,
  campaignId: null
})
  .then((info) => {
    console.log('Email sent:', info);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to send test email:', error.message);
    process.exit(1);
  });

