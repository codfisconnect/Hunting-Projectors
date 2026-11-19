import jwt from 'jsonwebtoken';

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    if (!secret || secret.trim().length === 0) {
      throw new Error(
        'FATAL: JWT_SECRET environment variable is missing in production. Application startup aborted.'
      );
    }
    if (secret.length < 32) {
      throw new Error(
        'FATAL: JWT_SECRET is insufficiently secure for production. It must be at least 32 characters long.'
      );
    }
    if (secret.includes('development') || secret.includes('hunting_jwt_super_secret_development_key')) {
      throw new Error(
        'FATAL: Development JWT_SECRET key cannot be used in production. Provide a secure production secret.'
      );
    }
    return secret;
  }

  // Safe fallback for local development only
  return secret || 'hunting_jwt_super_secret_development_key_chennai_2026';
}

const JWT_SECRET = resolveJwtSecret();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
