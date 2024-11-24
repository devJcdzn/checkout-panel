export const CONFIG = {
  providers: {
    storage: {
      provider: "MINIO",
      endpoint: process.env.MINIO_ENDPOINT,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
      region: process.env.MINIO_REGION,
      path: process.env.MINIO_PATH,
      s3ForcePathStyle: true,
      bucketName: process.env.MINIO_BUCKET_NAME,
      signatureVersion: "v4",
    },
  },
};
