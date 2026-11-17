import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { sendError } from '../utils/response.js';

const authClient = new OAuth2Client();

/**
 * Constant-time string comparison that safely handles unequal lengths
 * without leaking timing details or throwing errors.
 */
function safeTimingEqual(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');

  // If buffer lengths differ, we hash both with sha256 to produce fixed-length buffers
  // and ensure timing-safe comparison without throwing a RangeError.
  const hashA = crypto.createHash('sha256').update(bufA).digest();
  const hashB = crypto.createHash('sha256').update(bufB).digest();

  const hashesMatch = crypto.timingSafeEqual(hashA, hashB);
  // Also check length equality in constant time to avoid hash collisions
  return hashesMatch && bufA.length === bufB.length;
}

/**
 * Middleware to secure Cloud Scheduler jobs and internal service invocations.
 *
 * Supports two authentication mechanisms:
 * 1. Cryptographically verified Google Cloud OIDC Identity Token (Authorization: Bearer <oidc_token>)
 *    - Validates signature using Google's public certificates.
 *    - Validates issuer ('https://accounts.google.com' or 'accounts.google.com').
 *    - Validates exact audience matching the Cloud Run service URL or configured audience.
 *    - Validates token expiration.
 *    - Validates authorized service account email if configured.
 * 2. Shared Service Secret (X-Cloud-Scheduler-Secret or Authorization: Bearer <secret>)
 *    - Evaluated using constant-time crypto.timingSafeEqual comparison.
 */
export async function authenticateCronOrOIDC(req: Request, res: Response, next: NextFunction) {
  try {
    const cronSecret = process.env.CRON_SECRET || process.env.SCHEDULER_SECRET;
    const authHeader = req.headers.authorization;
    const customHeaderSecret = req.headers['x-cloud-scheduler-secret'] as string | undefined;

    // Mechanism 1: Shared CRON / Scheduler secret check with timing-safe comparison
    if (cronSecret && cronSecret.trim().length > 0) {
      if (customHeaderSecret && safeTimingEqual(customHeaderSecret, cronSecret)) {
        return next();
      }
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const bearerSecret = authHeader.slice(7);
        if (safeTimingEqual(bearerSecret, cronSecret)) {
          return next();
        }
      }
    }

    // Mechanism 2: Google Cloud OIDC Identity Token verification
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.slice(7);

      // Determine the expected audience (Cloud Run target URL or specific audience env var)
      const expectedAudience = process.env.CLOUD_RUN_SERVICE_URL ||
                               process.env.SCHEDULER_TARGET_AUDIENCE ||
                               process.env.CLIENT_URL;

      const expectedServiceAccount = process.env.SCHEDULER_SERVICE_ACCOUNT_EMAIL;

      try {
        const ticket = await authClient.verifyIdToken({
          idToken,
          audience: expectedAudience ? expectedAudience : undefined,
        });

        const payload = ticket.getPayload();
        if (!payload) {
          return sendError(res, 'Unauthorized: Invalid token payload', 401);
        }

        // 1. Verify Issuer
        const validIssuers = ['https://accounts.google.com', 'accounts.google.com'];
        if (!payload.iss || !validIssuers.includes(payload.iss)) {
          return sendError(res, 'Unauthorized: Invalid token issuer', 401);
        }

        // 2. Verify Exact Audience if configured
        if (expectedAudience) {
          const tokenAudience = payload.aud;
          const isAudienceMatch = Array.isArray(tokenAudience)
            ? tokenAudience.includes(expectedAudience)
            : tokenAudience === expectedAudience;

          if (!isAudienceMatch) {
            return sendError(res, 'Unauthorized: Token audience does not match service URL', 401);
          }
        }

        // 3. Verify Expiry
        const nowSeconds = Math.floor(Date.now() / 1000);
        if (!payload.exp || payload.exp < nowSeconds) {
          return sendError(res, 'Unauthorized: OIDC token expired', 401);
        }

        // 4. Verify Authorized Service Account Email if specified
        if (expectedServiceAccount) {
          if (payload.email !== expectedServiceAccount) {
            return sendError(res, 'Forbidden: Cloud Scheduler service account mismatch', 403);
          }
        }

        return next();
      } catch (verifyErr: any) {
        // Failed Google signature or token verification
        return sendError(res, `Unauthorized: OIDC token verification failed - ${verifyErr.message}`, 401);
      }
    }

    // Neither authorization method satisfied
    return sendError(res, 'Unauthorized: Access restricted to authorized Cloud Scheduler service account or secret', 401);
  } catch (error: any) {
    return sendError(res, `Authentication error: ${error.message}`, 401);
  }
}
