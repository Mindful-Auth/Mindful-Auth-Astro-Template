// Auth API route handler
// CRITICAL: Do NOT delete or rename this file.
// Proxies all /auth/* requests to Mindful Auth central service
import { handleAuthGet, handleAuthPost } from '@mindfulauth/core/auth-handler';

export async function GET({ params, request, url, locals }: any) {
    return handleAuthGet(params.slug, request, url, locals);
}

export async function POST({ params, request, url, locals }: any) {
    return handleAuthPost(params.slug, request, url, locals);
}