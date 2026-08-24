import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomBytes } from 'crypto';

@Injectable()
export class StorageService {
  private readonly client = new S3Client({
    endpoint: process.env.MINIO_ENDPOINT,
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY!,
      secretAccessKey: process.env.MINIO_SECRET_KEY!,
    },
    forcePathStyle: true,
  });

  private readonly bucket = process.env.MINIO_BUCKET!;
    async upload(depotId: string, originalName: string, buffer: Buffer, mimeType: string) {
    const key = `${depotId}/${randomBytes(8).toString('hex')}-${originalName}`;

    await this.client.send(
        new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        }),
    );

    return key;
  }
}