# Gmail API OAuth Integration (Optional)

If you prefer using the Gmail API instead of SMTP + App Password, follow these steps.

## 1. Create Google Cloud Credentials

1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Enable the **Gmail API** from the API Library.
4. Navigate to **APIs & Services → Credentials**.
5. Create an **OAuth Client ID** (Desktop App is the quickest option).
6. Download the `client_secret.json` file and note the `client_id`, `client_secret`, and `redirect_uris`.

## 2. Generate Refresh Token

Use a script similar to the snippet below to obtain a refresh token. Run it locally once.

```js
import { google } from 'googleapis';
import readline from 'readline';
import fs from 'fs';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

const scopes = ['https://www.googleapis.com/auth/gmail.send'];
const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });
console.log('Authorize this app by visiting:', authUrl);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Enter the code from that page: ', async (code) => {
  const { tokens } = await oAuth2Client.getToken(code);
  console.log('Refresh Token:', tokens.refresh_token);
  rl.close();
});
```

Store the `refresh_token` securely (`GMAIL_REFRESH_TOKEN`).

## 3. Update Environment Variables

```
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
GMAIL_REDIRECT_URI=...
GMAIL_REFRESH_TOKEN=...
```

## 4. Swap Transport Layer

In `services/gmailService.js`, replace the nodemailer transport with:

```js
import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

const getTransporter = async () => {
  const accessToken = await oAuth2Client.getAccessToken();
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: accessToken.token
    }
  });
};
```

Cache the transporter between sends for performance.

## 5. Deploy Considerations

- Ensure all secrets are set in Render (or your hosting platform).
- Refresh tokens remain valid until revoked but rotate regularly for security.
- Revert to App Passwords if OAuth maintenance is too heavy for your workflow.

