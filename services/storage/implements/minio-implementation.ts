import S3 from "aws-sdk/clients/s3";
import { IStorageProvider } from "../interface";
import { CONFIG } from "@/config";

export class MinioStorageProvider implements IStorageProvider {
  client: S3;

  constructor() {
    this.client = new S3({
      endpoint: CONFIG.providers.storage.endpoint,
      apiVersion: "latest",
      region: CONFIG.providers.storage.region,
      accessKeyId: CONFIG.providers.storage.accessKey,
      secretAccessKey: CONFIG.providers.storage.secretKey,
      s3ForcePathStyle: true,
      signatureVersion: "v4",
    });
  }

  async upload(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name}`;

    const params = {
      Bucket: CONFIG.providers.storage.bucketName as string,
      Key: fileName,
      Body: buffer,
      ACL: "public-read",
    };

    try {
      const { Location } = await this.client.upload(params).promise();
      return Location;
    } catch (err) {
      console.error("Upload Error", err);
      return `Erro ao fazer upload: ${(err as Error).message}`;
    }
  }

  async delete(path: string): Promise<void> {
    const params = {
      Bucket: CONFIG.providers.storage.bucketName as string,
      Key: path,
    };

    try {
      await this.client.deleteObject(params).promise();
    } catch (err) {
      console.error("Delete Error", err);
    }
  }
}
