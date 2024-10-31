export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? '';
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? '';
export const NEXT_PUBLIC_SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY ?? '';

// S3 Frontend envs
export const NEXT_PUBLIC_BUCKET_NAME =
  process.env.NEXT_PUBLIC_BUCKET_NAME ?? '';
export const NEXT_PUBLIC_BUCKET_ACCESS_KEY =
  process.env.NEXT_PUBLIC_BUCKET_ACCESS_KEY ?? '';
export const NEXT_PUBLIC_BUCKET_SECRET_ACCESS_KEY =
  process.env.NEXT_PUBLIC_BUCKET_SECRET_ACCESS_KEY ?? '';
export const NEXT_PUBLIC_BUCKET_ENDPOINT =
  process.env.NEXT_PUBLIC_BUCKET_ENDPOINT ?? '';
export const NEXT_PUBLIC_BUCKET_LOCATION =
  process.env.NEXT_PUBLIC_BUCKET_LOCATION ?? '';
export const NEXT_PUBLIC_BUCKET_REGION =
  process.env.NEXT_PUBLIC_BUCKET_REGION ?? '';

// S3 Server envs
export const BUCKET_NAME = process.env.BUCKET_NAME ?? '';
export const BUCKET_ACCESS_KEY = process.env.BUCKET_ACCESS_KEY ?? '';
export const BUCKET_SECRET_ACCESS_KEY =
  process.env.BUCKET_SECRET_ACCESS_KEY ?? '';
export const BUCKET_ENDPOINT = process.env.BUCKET_ENDPOINT ?? '';
export const BUCKET_LOCATION = process.env.BUCKET_LOCATION ?? '';
export const BUCKET_REGION = process.env.BUCKET_REGION ?? '';

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? '';
export const JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN ?? '';

export const DATABASE_URL = process.env.DATABASE_URL ?? '';

export const SALT_ROUND = Number(process.env.SALT_ROUND) ?? 10;

export const SECRET_KEY = process.env.SECRET_KEY ?? '';
