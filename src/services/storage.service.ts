import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NEXT_PUBLIC_BUCKET_LOCATION } from 'config/environments';
import { serverS3Client } from 'config/storage';

export const uploadAssetToS3 = async (file: File) => {
  try {
    const Key = `${NEXT_PUBLIC_BUCKET_LOCATION}/${file.name}`;
    const command = new PutObjectCommand({
      Bucket: 'techlabs',
      Key: Key,
      Body: file as File,
    });

    const response = await serverS3Client.send(command);
    return {
      key: Key,
      status: response.$metadata.httpStatusCode,
    };
  } catch (err) {
    throw err;
  }
};

export const GetAssetFromS3ByKey = async (key: string) => {
  try {
    const params = new GetObjectCommand({
      Bucket: 'techlabs',
      Key: key,
    });

    const signedUrl = await getSignedUrl(serverS3Client, params as any);

    return signedUrl;

    // const { PresignedUrl } = await client.send(params);
  } catch (err) {
    throw err;
  }
};
