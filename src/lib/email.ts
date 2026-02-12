// Postmark Email Service for Mindful Auth Webhooks
// You can use any email API service. For this we use our preferred API service, Postmark. 
// Create an account at https://www.postmarkapp.com/?via=mindfulauth (affiliate link).

const POSTMARK_API_URL = 'https://api.postmarkapp.com/email';

interface PostmarkEmail {
  From: string;
  To: string;
  Subject: string;
  HtmlBody: string;
  TextBody: string;
  MessageStream?: string;
}

async function sendEmail(apiToken: string, email: PostmarkEmail): Promise<void> {
  const response = await fetch(POSTMARK_API_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': apiToken,
    },
    body: JSON.stringify({
      MessageStream: 'outbound',
      ...email,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Postmark API error (${response.status}): ${error}`);
  }
}

// ── Emails 

export async function sendVerificationEmail(
  apiToken: string,
  fromAddress: string,
  to: string,
  name: string,
  verificationLink: string,
): Promise<void> {
  await sendEmail(apiToken, {
    From: fromAddress,
    To: to,
    Subject: 'Verify Your Email Address',
    HtmlBody: `
      <h2>Welcome, ${name}!</h2>
      <p>Thanks for signing up. Please verify your email address by clicking the link below:</p>
      <p><a href="${verificationLink}">Verify Email Address</a></p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <p><small>This link will expire shortly for security reasons.</small></p>
    `,
    TextBody: `Welcome, ${name}!\n\nPlease verify your email by visiting: ${verificationLink}\n\nIf you didn't create an account, ignore this email.`,
  });
}

export async function sendPasswordResetEmail(
  apiToken: string,
  fromAddress: string,
  to: string,
  name: string,
  resetLink: string,
): Promise<void> {
  await sendEmail(apiToken, {
    From: fromAddress,
    To: to,
    Subject: 'Reset Your Password',
    HtmlBody: `
      <h2>Password Reset Request</h2>
      <p>Hi ${name}, we received a request to reset your password.</p>
      <p><a href="${resetLink}">Reset Your Password</a></p>
      <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      <p><small>This link will expire shortly for security reasons.</small></p>
    `,
    TextBody: `Hi ${name},\n\nReset your password by visiting: ${resetLink}\n\nIf you didn't request this, ignore this email.`,
  });
}

export async function sendMagicLinkEmail(
  apiToken: string,
  fromAddress: string,
  to: string,
  name: string,
  magicLoginLink: string,
): Promise<void> {
  await sendEmail(apiToken, {
    From: fromAddress,
    To: to,
    Subject: 'Your Magic Login Link',
    HtmlBody: `
      <h2>Magic Login Link</h2>
      <p>Hi ${name}, click the link below to sign in to your account:</p>
      <p><a href="${magicLoginLink}">Sign In</a></p>
      <p>If you didn't request this link, you can safely ignore this email.</p>
      <p><small>This link will expire shortly for security reasons.</small></p>
    `,
    TextBody: `Hi ${name},\n\nSign in by visiting: ${magicLoginLink}\n\nIf you didn't request this, ignore this email.`,
  });
}