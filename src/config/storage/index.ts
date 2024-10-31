import { S3Client } from '@aws-sdk/client-s3';
import {
  BUCKET_ACCESS_KEY,
  BUCKET_ENDPOINT,
  BUCKET_LOCATION,
  BUCKET_REGION,
  BUCKET_SECRET_ACCESS_KEY,
  NEXT_PUBLIC_BUCKET_ACCESS_KEY,
  NEXT_PUBLIC_BUCKET_ENDPOINT,
  NEXT_PUBLIC_BUCKET_LOCATION,
  NEXT_PUBLIC_BUCKET_REGION,
  NEXT_PUBLIC_BUCKET_SECRET_ACCESS_KEY,
} from 'config/environments';

// Server/Api S3 client
export const serverS3Client = new S3Client({
  credentials: {
    accessKeyId: BUCKET_ACCESS_KEY || NEXT_PUBLIC_BUCKET_ACCESS_KEY,
    secretAccessKey:
      BUCKET_SECRET_ACCESS_KEY || NEXT_PUBLIC_BUCKET_SECRET_ACCESS_KEY,
  },
  endpoint: BUCKET_ENDPOINT || NEXT_PUBLIC_BUCKET_ENDPOINT,
  region: BUCKET_REGION || NEXT_PUBLIC_BUCKET_REGION,
});
serverS3Client.middlewareStack.add(
  (next: (arg0: any) => any) => async (args: { input: any }) => {
    const { input } = args;

    // Set the LocationConstraint to the desired value
    input.CreateBucketConfiguration = {
      LocationConstraint: BUCKET_REGION || NEXT_PUBLIC_BUCKET_REGION,
      Location: BUCKET_LOCATION || NEXT_PUBLIC_BUCKET_LOCATION,
    };
    return next(args);
  },
  { step: 'build' },
);
