// lib/cloudflareClient.ts
import AWS from "aws-sdk";

// const s3 = new AWS.S3({
//   endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`, // Substitua pelo seu ID de conta
//   accessKeyId: process.env.R2_ACCESS_KEY_ID,
//   secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
//   region: "auto",
//   signatureVersion: "v4",
// });

const s3 = new AWS.S3({
  endpoint: process.env.MINIO_ENDPOINT!,
  accessKeyId: process.env.MINIO_ACCESS_KEY_ID,
  secretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true,
});

export default s3;
