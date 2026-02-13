// Mindful Auth Webhook Handler
// Receives webhook events and sends transactional emails via Postmark.
// Create an account at https://www.postmarkapp.com/?via=mindfulauth (affiliate link).
//
// Webhook URL: https://app.yourdomain.com/api/public/webhooks/mauth-webhook
// Configure this URL in Mindful Auth to receive webhook events
//
// Required environment variables
//   POSTMARK_API_TOKEN  – Your Postmark server API token
//   EMAIL_FROM          – Verified sender address (e.g. "App Name <no-reply@example.com>")

import type { APIRoute } from 'astro';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendMagicLinkEmail,
} from '@/lib/email';

// ── Webhook payload types from Mindful Auth

interface BasePayload {
  event_type: string;
  recordid: string;
  email: string;
  name: string;
}

interface PasswordResetPayload extends BasePayload {
  event_type: 'password_reset';
  resetLink: string;
}

interface VerifyEmailPayload extends BasePayload {
  event_type: 'verify_email';
  verificationLink: string;
}

interface MagicLoginPayload extends BasePayload {
  event_type: 'magic_login';
  magicLoginLink: string;
}

type WebhookPayload = PasswordResetPayload | VerifyEmailPayload | MagicLoginPayload;

// ── Route handler

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // ── Environment variables ──
    const env = (locals as any).runtime?.env ?? {};
    const POSTMARK_API_TOKEN: string | undefined = env.POSTMARK_API_TOKEN;
    const EMAIL_FROM: string | undefined = env.EMAIL_FROM;

    if (!POSTMARK_API_TOKEN || !EMAIL_FROM) {
      console.error('[Webhook] Missing required env vars: POSTMARK_API_TOKEN and/or EMAIL_FROM');
      return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500 });
    }

    // ── Parse payload ──
    const payload: WebhookPayload = await request.json();
    const { event_type, email, name } = payload;

    // ── Log payload (main webhook event) ──
    console.info('[Webhook Received]', {
      event_type,
      email,
      name,
      recordid: payload.recordid,
      payload,
    });

    // ── Dispatch by event type ──
    switch (event_type) {
      case 'verify_email': {
        const { verificationLink } = payload as VerifyEmailPayload;
        await sendVerificationEmail(POSTMARK_API_TOKEN, EMAIL_FROM, email, name, verificationLink);
        break;
      }

      case 'password_reset': {
        const { resetLink } = payload as PasswordResetPayload;
        await sendPasswordResetEmail(POSTMARK_API_TOKEN, EMAIL_FROM, email, name, resetLink);
        break;
      }

      case 'magic_login': {
        const { magicLoginLink } = payload as MagicLoginPayload;
        await sendMagicLinkEmail(POSTMARK_API_TOKEN, EMAIL_FROM, email, name, magicLoginLink);
        break;
      }

      default:
        console.warn(`Unhandled event type: ${event_type}`);
        return new Response(
          JSON.stringify({ error: `Unhandled event type: ${event_type}` }),
          { status: 400 },
        );
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[Webhook Error]:', errorMessage);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500 },
    );
  }
};

// GET handler for testing endpoint accessibility
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    status: 'Webhook endpoint is active',
    method: 'POST',
    note: 'This endpoint accepts POST requests from Mindful Auth'
  }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};