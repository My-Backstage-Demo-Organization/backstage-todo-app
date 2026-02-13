import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export class S3Service {
  private s3: S3Client;
  private bucket: string;
  private key: string;

  constructor(bucket: string, key: string, region?: string) {
    this.bucket = bucket;
    this.key = key;
    this.s3 = new S3Client({ region });
  }

  async getStages(serviceName: string): Promise<Record<string, unknown>> {
    const res = await this.s3.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: this.key }),
    );

    const body = await res.Body!.transformToString('utf-8');
    const json = JSON.parse(body);

    const svc = json?.[serviceName];
    if (!svc) throw new Error(`Service '${serviceName}' not found in JSON`);

    const stages = svc?.stages;
    if (!stages || typeof stages !== 'object') {
      throw new Error(`'stages' not found for service '${serviceName}'`);
    }

    return stages as Record<string, unknown>;
  }
}