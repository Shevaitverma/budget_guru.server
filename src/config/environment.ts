import "dotenv/config";

export const PORT = process.env.PORT ?? 8080;
export const CORS_ORIGINS = process.env.CORS_ORIGINS ?? "";

export const MONGODB_URI = process.env.MONGODB_URI ?? "";

export const CLIENT_URL = process.env.CLIENT_URL ?? "";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";

export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT ?? "";
export const EMAIL_SENDER_MAIL = process.env.EMAIL_SENDER_MAIL ?? "";
export const EMAIL_SENDER_PASSWORD = process.env.EMAIL_SENDER_PASSWORD ?? "";

export const COOKIE_SECRET = process.env.COOKIE_SECRET ?? "";
export const JWT_SECRET = process.env.JWT_SECRET ?? "";

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID ?? "";
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY ?? "";
export const AWS_REGION = process.env.AWS_REGION ?? "";
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME ?? "";

export const STRIPE_API_KEY = process.env.STRIPE_API_KEY ?? "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";
