import dotenv from 'dotenv';
dotenv.config();

function validateProductionEnv() {
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) return;

  const errors: string[] = [];

  // JWT Secret validation
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.trim().length === 0) {
    errors.push('JWT_SECRET is required in production.');
  } else if (jwtSecret.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long in production.');
  } else if (jwtSecret.includes('development') || jwtSecret.includes('hunting_jwt_super_secret_development_key')) {
    errors.push('Development JWT_SECRET cannot be used in production.');
  }

  // Database URL validation
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.trim().length === 0) {
    errors.push('DATABASE_URL is required in production.');
  }

  // Cloud Scheduler Service Account Email validation (required for scheduled job security)
  const schedulerSa = process.env.SCHEDULER_SERVICE_ACCOUNT_EMAIL;
  if (!schedulerSa || schedulerSa.trim().length === 0) {
    errors.push('SCHEDULER_SERVICE_ACCOUNT_EMAIL is required in production.');
  }

  // Cloud Run Service URL notice:
  // If CLOUD_RUN_SERVICE_URL is not yet assigned during initial container provision,
  // warning is issued and OIDC fallback uses SCHEDULER_TARGET_AUDIENCE or CLIENT_URL.
  const cloudRunUrl = process.env.CLOUD_RUN_SERVICE_URL || process.env.SCHEDULER_TARGET_AUDIENCE;
  if (!cloudRunUrl || cloudRunUrl.trim().length === 0) {
    console.warn('[Production Env Notice]: Neither CLOUD_RUN_SERVICE_URL nor SCHEDULER_TARGET_AUDIENCE is set. Configure CLOUD_RUN_SERVICE_URL once Cloud Run service URL is provisioned.');
  }

  // Cloudinary credentials validation (required to prevent silent local disk fallback)
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    errors.push('CLOUDINARY_CLOUD_NAME is required in production.');
  }
  if (!process.env.CLOUDINARY_API_KEY) {
    errors.push('CLOUDINARY_API_KEY is required in production.');
  }
  if (!process.env.CLOUDINARY_API_SECRET) {
    errors.push('CLOUDINARY_API_SECRET is required in production.');
  }

  if (errors.length > 0) {
    throw new Error(`Production Configuration Validation Failed:\n- ${errors.join('\n- ')}`);
  }
}

validateProductionEnv();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
};
